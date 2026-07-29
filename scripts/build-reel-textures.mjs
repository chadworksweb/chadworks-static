// Generates the REEL's textures: smaller copies of the portfolio captures, written
// beside the originals in public/portfolio/reel/.
//
// WHY A SECOND SET EXISTS. The showroom reel draws each capture as a WebGL texture, and
// a graphics card cannot hold a compressed image -- it holds raw pixels, four bytes
// each. So a 0.09 MB WebP file becomes 2880 x 1800 x 4 = 19.8 MB of video memory, and
// handing that over blocks the main thread. Measured headed on 2026-07-29 (Firefox
// Nightly, Intel HD, dpr 1): scrolling onto slides for the FIRST time produced 20 frames
// over 50ms with a worst frame of 104ms, while scrolling back over the same slides once
// resident produced zero. Median frame time was 13.9ms on every pass, so the motion was
// never the problem -- it was first-draw upload, and nothing else.
//
// WHY SMALLER IS ACCEPTABLE HERE, having first been wrong about it. Reel slides are
// sized to COVER the viewport (Reel.tsx: visH * 1.06), so they are not thumbnails and a
// naive downscale would be visible. What makes it fine is that the reel is the BROWSING
// view: the slide is moving and refracted through a faceted gem. The moment a visitor
// wants to actually look at a site, they click, and the expanded view is a DOM <img>
// pointed at the ORIGINAL full-resolution file (PortfolioShowroom.tsx, styles.shot).
// Detail was never coming from the texture.
//
// THE ORIGINALS ARE NEVER TOUCHED. This only ever writes into public/portfolio/reel/.
// The archive grid, the expanded view, the homepage and the JSON-LD all keep pointing at
// the full-size files through captureSrc().
//
// OUTPUT IS COMMITTED, not generated at build time. `sharp` is only reachable here as a
// transitive dependency of next, so making the build depend on it would be fragile. This
// is a tool you run when captures change, not a build step.
//
//   node scripts/build-reel-textures.mjs          # write any that are missing
//   node scripts/build-reel-textures.mjs --force  # rewrite all

import { readdirSync, mkdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// THE ONE DIAL: a bounding box each capture is fitted INSIDE, aspect preserved.
//
// Not a fixed output size. Most captures are 2880x1800 (16:10) but not all --
// rising-compass-desktop is 1884x1080 (1.744), and resizing to fixed dimensions
// stretched it. The reel's shader already cover-fits a texture of any aspect onto the
// slide (uAspect / uRepeat / uOffset), so the honest thing is to scale each capture
// down and leave its shape alone.
//
// 1600x1000 puts a 16:10 capture at 6.4 MB on the GPU against the original's 19.8,
// which is what brings a single upload inside roughly one frame instead of three or
// four. Going larger walks the stalls back: 1920x1200 is 9.2 MB and only halves them.
const REEL_W = 1600;
const REEL_H = 1000;

// q82 rather than the captures' q85: these are seen in motion through a refracting
// surface, and the file is the cheap part anyway -- the GPU cost is set purely by
// dimensions, so quality here buys sharpness at no runtime cost beyond download.
const QUALITY = 82;

const SRC_DIR = path.join(process.cwd(), "public", "portfolio");
const OUT_DIR = path.join(SRC_DIR, "reel");
const FORCE = process.argv.includes("--force");

mkdirSync(OUT_DIR, { recursive: true });

const sources = readdirSync(SRC_DIR).filter((f) => /-desktop\.webp$/.test(f));
if (sources.length === 0) {
  console.error("build-reel-textures: no *-desktop.webp found in public/portfolio");
  process.exit(1);
}

let written = 0;
let skipped = 0;
let srcBytes = 0;
let outBytes = 0;

for (const file of sources) {
  const from = path.join(SRC_DIR, file);
  const to = path.join(OUT_DIR, file);
  srcBytes += statSync(from).size;

  if (!FORCE && existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs) {
    outBytes += statSync(to).size;
    skipped++;
    continue;
  }

  await sharp(from)
    // `inside` fits within the box and PRESERVES ASPECT, so a capture that is not 16:10
    // comes out its own shape at a smaller size rather than stretched. `withoutEnlargement`
    // so a capture that is already small is copied rather than blown up.
    .resize(REEL_W, REEL_H, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(to);

  outBytes += statSync(to).size;
  written++;
}

// Report the REAL GPU cost from actual dimensions, not from an assumed size. Aspect is
// preserved per capture, so the outputs are not all the same shape and an assumed
// figure would be fiction. Also verifies nothing was distorted.
let gpuBefore = 0;
let gpuAfter = 0;
let worstSkew = 0;
let biggest = { file: "", px: 0, w: 0, h: 0 };

for (const file of sources) {
  const a = await sharp(path.join(SRC_DIR, file)).metadata();
  const b = await sharp(path.join(OUT_DIR, file)).metadata();
  gpuBefore += a.width * a.height * 4;
  gpuAfter += b.width * b.height * 4;
  worstSkew = Math.max(worstSkew, Math.abs(a.width / a.height - b.width / b.height));
  if (b.width * b.height > biggest.px) {
    biggest = { file, px: b.width * b.height, w: b.width, h: b.height };
  }
}

if (worstSkew > 0.005) {
  console.error(`build-reel-textures: ASPECT DISTORTED (worst delta ${worstSkew.toFixed(4)})`);
  process.exit(1);
}

const mb = (bytes) => (bytes / 1048576).toFixed(1);
console.log(
  `build-reel-textures: ${written} written, ${skipped} up to date, ${sources.length} total ` +
    `(fit inside ${REEL_W}x${REEL_H}, q${QUALITY}, aspect preserved)`,
);
console.log(`  files  ${mb(srcBytes)}MB -> ${mb(outBytes)}MB`);
console.log(`  GPU    ${mb(gpuBefore)}MB -> ${mb(gpuAfter)}MB across all ${sources.length}`);
console.log(
  `  worst  ${biggest.file} at ${biggest.w}x${biggest.h} = ` +
    `${mb(biggest.px * 4)}MB (was 19.8MB at 2880x1800)`,
);
