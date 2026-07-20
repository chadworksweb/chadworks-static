// Regenerate the worked-example shape assets for the website cost calculator.
//
//   1. start the dev server:  npm run dev   (serves http://localhost:8890)
//   2. run this:              node tools/shapecap/capture.mjs
//
// It drives a headless Chromium to /shapecap (a dev-only route), renders every
// model example scope's object on transparent, crops each to ONE fixed
// horizontal window so the slab is an identical width/position on every shape,
// resizes to a common width, and writes public/shapes/<slug>.webp.
//
// It does NOT touch rushed.webp -- that is a hand-finished art asset (its motion
// streak is too long for the shared window). /shapecap deliberately omits it.
//
// Deps already in the project: playwright (chromium installed) + sharp.

import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../../public/shapes");
const URL = process.env.SHAPECAP_URL || "http://localhost:8890/shapecap/";
const TARGET_WIDTH = 860; // matches the hand-made rushed.webp so every slab lines up

async function cropAll(page) {
  return page.evaluate(() => {
    const dataOf = (cv) => {
      const c = document.createElement("canvas");
      c.width = cv.width;
      c.height = cv.height;
      const x = c.getContext("2d");
      x.drawImage(cv, 0, 0);
      return x.getImageData(0, 0, cv.width, cv.height).data;
    };
    const T = 34;
    // Fixed horizontal window from the baseline slab -> same slab width + x on all.
    const base = document.querySelector('[data-shape="baseline"] canvas');
    const W = base.width, H = base.height;
    const bd = dataOf(base);
    let bMinX = W, bMaxX = -1;
    for (let y = 0; y < H; y++) { const r = y * W; for (let x = 0; x < W; x++) { if (bd[(r + x) * 4 + 3] > T) { if (x < bMinX) bMinX = x; if (x > bMaxX) bMaxX = x; } } }
    const slabW = bMaxX - bMinX;
    const cx0 = Math.max(0, Math.round(bMinX - slabW * 0.5));   // left room for trails/plugs to bleed
    const cx1 = Math.min(W - 1, Math.round(bMaxX + slabW * 0.05));
    const cw = cx1 - cx0 + 1;
    const out = {};
    for (const dv of [...document.querySelectorAll("[data-shape]")]) {
      const slug = dv.getAttribute("data-shape");
      const cv = dv.querySelector("canvas");
      const d = dataOf(cv);
      let minY = H, maxY = -1;
      for (let y = 0; y < H; y++) { const r = y * W; for (let x = cx0; x <= cx1; x++) { if (d[(r + x) * 4 + 3] > T) { if (y < minY) minY = y; if (y > maxY) maxY = y; break; } } }
      const vpad = Math.round((maxY - minY) * 0.08);
      const cy0 = Math.max(0, minY - vpad), cy1 = Math.min(H - 1, maxY + vpad);
      const ch = cy1 - cy0 + 1;
      const o = document.createElement("canvas");
      o.width = cw; o.height = ch;
      o.getContext("2d").drawImage(cv, cx0, cy0, cw, ch, 0, 0, cw, ch);
      out[slug] = o.toDataURL("image/png");
    }
    return out;
  });
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    reducedMotion: "reduce", // holds every object at one static front pose
    viewport: { width: 2360, height: 4700 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000); // let the objects (and their generated textures) settle
  const data = await cropAll(page);
  await browser.close();

  await mkdir(OUT, { recursive: true });
  const results = [];
  for (const [slug, url] of Object.entries(data)) {
    const buf = Buffer.from(url.split(",")[1], "base64");
    const webp = await sharp(buf).resize({ width: TARGET_WIDTH }).webp({ quality: 90 }).toBuffer();
    await writeFile(path.join(OUT, `${slug}.webp`), webp);
    results.push(`${slug}:${Math.round(webp.length / 1000)}k`);
  }
  console.log("wrote", Object.keys(data).length, "shapes ->", OUT);
  console.log(results.join("  "));
}

main().catch((e) => { console.error(e); process.exit(1); });
