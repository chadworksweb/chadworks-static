// Bakes the showroom TileWall's flat tiles from the full portfolio screenshots.
//
// The wall draws each shot at ~175 CSS px tall, desaturated, under an 0.82 blue
// wash -- but it was loading the full-res -desktop.jpg (6.4MB across 20 shots),
// which is what made the wall slow to appear. These tiles are the same pixels the
// wall actually shows:
//   - grayscale, because TILE_FRAG already reduces every tile to luminance, so a
//     gray source is identical on screen and costs a third of the bytes
//   - resized with fit:"fill" to TILE_ASPECT, matching the wall's plain 0..1 UV
//     map, so the framing is unchanged
//
// Run: node scripts/build-wall-tiles.mjs

import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = path.join(process.cwd(), "public", "portfolio");
const OUT_DIR = path.join(SRC_DIR, "wall");
// A tile draws at ~TILE_PX (175) CSS tall, so 280x175 CSS -> 560x350 device px at
// the dpr:2 cap. 720x450 covers that 1:1 with headroom and still costs ~1.3MB of
// GPU upload each, vs ~20MB for the full-res -desktop.jpg.
const W = 720;
const H = 450; // 16:10, matching TILE_ASPECT in TileWall.tsx
const QUALITY = 78;

const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith("-desktop.jpg"));
await mkdir(OUT_DIR, { recursive: true });

let srcTotal = 0;
let outTotal = 0;

for (const file of files) {
  const slug = file.replace(/-desktop\.jpg$/, "");
  const src = path.join(SRC_DIR, file);
  const out = path.join(OUT_DIR, `${slug}.jpg`);
  const meta = await sharp(src).metadata();

  await sharp(src)
    .resize(W, H, { fit: "fill" })
    .grayscale()
    .jpeg({ quality: QUALITY, progressive: false, mozjpeg: true })
    .toFile(out);

  const a = (await stat(src)).size;
  const b = (await stat(out)).size;
  srcTotal += a;
  outTotal += b;
  const kb = (n) => (n / 1024).toFixed(0).padStart(4);
  console.log(
    `${slug.padEnd(22)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} ` +
      `${kb(a)}KB -> ${kb(b)}KB`
  );
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\n${files.length} tiles: ${mb(srcTotal)}MB -> ${mb(outTotal)}MB`);
