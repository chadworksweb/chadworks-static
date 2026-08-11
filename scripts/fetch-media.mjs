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
// Needs the Pexels API key at ~/.pexels-api-key (same file the LSM Copperwake
// pull used). The clips and their reasoning are logged in
// CWS-PEXELS-CLIP-LOG.md; keep MEDIA below in step with that doc.

import { mkdirSync, existsSync, writeFileSync, statSync } from "node:fs";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

// Pexels 403s the default Node/undici agent the same way it 403s python-urllib.
// curl works untouched. Send an explicit one.
const UA = "chadworks-static/1.0 (asset restore; +https://chadworks.co)";

const MEDIA = [
  {
    id: 38667751,
    // Marathon runners, 50fps. Plays at 0.5x in the /website-design-for-5k-races/
    // hero. 50fps is the whole reason this clip was chosen over better-framed
    // 24-30fps candidates; see CWS-PEXELS-CLIP-LOG.md.
    width: 1280,
    video: "public/video/race-runners-38667751-720.mp4",
    poster: "public/video/race-runners-38667751-poster.jpg",
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

const KEY = keyOrDie();

for (const m of wanted) {
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
