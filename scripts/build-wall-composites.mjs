// Converts captured showroom-wall screengrabs into the shipped wall images.
//
// WHY SCREENGRABS AND NOT A COMPOSITE BUILT FROM THE TILES. The wall's look is not
// just an arrangement of pictures: it is the grayscale TILE_FRAG pass, the brick
// stagger, and the #243989 wash at 0.82 over the top, all resolved by the renderer.
// Rebuilding that in sharp means reimplementing three things and keeping them in
// step with the shaders forever. Capturing the real renderer means the shipped image
// IS the wall, exactly, by construction.
//
// HOW THE CAPTURES ARE MADE. Load /showroom/?wallcap=1 (a temporary harness that
// drops the gem and the chrome and turns on preserveDrawingBuffer), wait for the
// veil dissolve to finish, hide every DOM layer over the canvas, and clip a
// screenshot to the canvas box at a 2560x1600 viewport. Three loads, three shuffles.
//
// WHY 2560x1600. That is the CAPTURE VIEWPORT in CSS pixels, so the image maps 1:1
// to CSS pixels at display time and a brick draws at exactly the size the live wall
// drew it. TileWall sets texture.repeat from the viewport over these dimensions;
// change the size here and the bricks change size on screen.
//
// Run: node scripts/build-wall-composites.mjs <captureDir>

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = process.argv[2];
if (!SRC_DIR) {
  console.error("build-wall-composites: pass the directory holding wallraw-*.png");
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), "public", "portfolio", "wall");
// Must match COMPOSITE_W / COMPOSITE_H in TileWall.tsx.
const W = 2560;
const H = 1600;
const QUALITY = 76;

const raws = (await readdir(SRC_DIR)).filter((f) => /^wallraw-\d+\.png$/.test(f)).sort();
if (raws.length === 0) {
  console.error(`build-wall-composites: no wallraw-*.png in ${SRC_DIR}`);
  process.exit(1);
}

let n = 0;
for (const f of raws) {
  n++;
  const out = path.join(OUT_DIR, `bake-${n}.jpg`);
  // fit:"fill" and not "cover": the capture is the same 16:10 box as the output, so
  // this is a straight downscale. Any letterboxing here would show up as a stretched
  // wall on screen.
  const info = await sharp(path.join(SRC_DIR, f))
    .resize(W, H, { fit: "fill" })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toFile(out);
  console.log(`build-wall-composites: ${path.basename(out)} ${Math.round(info.size / 1024)}KB`);
}
