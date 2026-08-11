#!/usr/bin/env node
// RESTORES THE UNTRACKED MEDIA A FRESH CLONE DOES NOT HAVE (Chad, 2026-08-11).
//
// public/video/ is gitignored, because nothing over 1 MB goes to GitHub. That
// makes the clips reproducible rather than committed, and THIS is what makes
// them reproducible. Without it, "untracked" would just mean "lost".
//
// Usage:
//   node scripts/fetch-media.mjs           # fetch anything missing
//   node scripts/fetch-media.mjs --force   # re-fetch even if present
//
// Two kinds of media, and only one of them needs the network:
//
//   kind: "pexels"  -- pulled from the Pexels API. Needs the key at
//                      ~/.pexels-api-key (same file the LSM Copperwake pull
//                      used). Logged in CWS-PEXELS-CLIP-LOG.md; keep MEDIA
//                      below in step with that doc.
//   kind: "local"   -- chadworks' OWN footage, copied from the Dropbox master.
//                      No key, no network. These are portfolio captures of work
//                      that shipped, so Dropbox is the master and this repo
//                      only ever holds a copy in the gitignored public/video/.
//
// A local entry whose source is missing is a WARNING, not a failure: a machine
// without that Dropbox folder can still restore every Pexels clip and build.
// The page will 404 on the clip, which is the same failure mode a missing
// Pexels key produces, and the message says which file to go get.

import { mkdirSync, existsSync, writeFileSync, statSync, copyFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

// Pexels 403s the default Node/undici agent the same way it 403s python-urllib.
// curl works untouched. Send an explicit one.
const UA = "chadworks-static/1.0 (asset restore; +https://chadworks.co)";

const MEDIA = [
  {
    kind: "pexels",
    id: 38667751,
    // Marathon runners, 50fps. Plays at 0.5x in the /website-design-for-5k-races/
    // hero. 50fps is the whole reason this clip was chosen over better-framed
    // 24-30fps candidates; see CWS-PEXELS-CLIP-LOG.md.
    width: 1280,
    video: "public/video/race-runners-38667751-720.mp4",
    poster: "public/video/race-runners-38667751-poster.jpg",
  },
  {
    kind: "local",
    // Screen capture of the scope calculator being driven, in the CalcCtaCapsule
    // on /rates/. chadworks' own footage of chadworks' own tool, so there is no
    // licence to log and no API to call. 1920x1080, 30fps, 26.5s.
    // The poster is frame 1s, regenerate with:
    //   ffmpeg -y -ss 1 -i <video> -frames:v 1 -vf scale=960:-2 -q:v 6 <poster>
    source: join(
      homedir(),
      "Dropbox/ChadWorks/portfolio videos/website-cost-calculator.mp4"
    ),
    video: "public/video/website-cost-calculator.mp4",
    poster: "public/video/website-cost-calculator-poster.jpg",
  },
];

const force = process.argv.includes("--force");

function keyOrDie() {
  const path = join(homedir(), ".pexels-api-key");
  if (!existsSync(path)) {
    console.error(
      `No Pexels key at ${path}. Media cannot be restored without it.\n` +
        `Everything else in the build works; the hero video will 404.`
    );
    process.exit(1);
  }
  return readFileSync(path, "utf8").trim();
}

async function get(url, headers) {
  const res = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

const wanted = MEDIA.filter((m) => force || !existsSync(m.video) || !existsSync(m.poster));
if (wanted.length === 0) {
  console.log("fetch-media: everything present. Nothing to do.");
  process.exit(0);
}

// Local copies first: they need no key, so a machine with no Pexels key still
// restores everything it can before keyOrDie() has a chance to exit.
const locals = wanted.filter((m) => m.kind === "local");
const remotes = wanted.filter((m) => m.kind !== "local");

for (const m of locals) {
  if (!existsSync(m.source)) {
    console.warn(
      `fetch-media: SKIPPED ${m.video}
` +
        `  master not found at ${m.source}
` +
        `  The build will succeed and the page will 404 on this clip.`
    );
    continue;
  }
  mkdirSync(dirname(m.video), { recursive: true });
  copyFileSync(m.source, m.video);
  if (!existsSync(m.poster)) {
    console.warn(
      `fetch-media: ${m.poster} missing. Regenerate it with the ffmpeg line in MEDIA.`
    );
  }
  console.log(
    `  ${m.video} (${(statSync(m.video).size / 1048576).toFixed(2)} MB) copied from Dropbox`
  );
}

if (remotes.length === 0) {
  console.log("fetch-media: done.");
  process.exit(0);
}

const KEY = keyOrDie();

for (const m of remotes) {
  console.log(`fetch-media: pulling Pexels ${m.id} ...`);
  const meta = await (
    await get(`https://api.pexels.com/videos/videos/${m.id}`, { Authorization: KEY })
  ).json();

  const file = meta.video_files.find((f) => f.width === m.width);
  if (!file) throw new Error(`No ${m.width}px rendition on ${m.id}`);

  mkdirSync(dirname(m.video), { recursive: true });
  const buf = Buffer.from(await (await get(file.link)).arrayBuffer());
  writeFileSync(m.video, buf);

  const pics = meta.video_pictures ?? [];
  const posterUrl = pics.length
    ? pics[Math.floor(pics.length / 2)].picture
    : meta.image;
  writeFileSync(m.poster, Buffer.from(await (await get(posterUrl)).arrayBuffer()));

  console.log(
    `  ${m.video} (${(statSync(m.video).size / 1048576).toFixed(2)} MB) + poster, by ${meta.user.name}`
  );
}
console.log("fetch-media: done.");
