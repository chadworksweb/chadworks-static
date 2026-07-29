// TEMPORARY DIAGNOSTIC -- proves the CSS wall and the WebGL wall are the same wall.
//
// The CSS backdrop only works if it lands on the SAME pixel as the texture that
// replaces it. If the two disagree the visitor sees the bricks change size when the
// canvas takes over, which is worse than the blank stage it was meant to fix.
//
// TWO EARLIER VERSIONS OF THIS SCRIPT LIED. Recorded because each failure was a
// different way of measuring nothing:
//   1. Gated the "before" shot on `wall:mode-webgl` NOT existing. That mark never
//      un-fires, so the wait timed out, the catch swallowed it, and the shot was
//      taken with the WebGL wall already up. It compared the WebGL wall to itself and
//      reported a perfect 0.89/255 while the wall was visibly stretching.
//   2. Tried to isolate the layers by blocking the three.js chunk and pinning the
//      random bake -- but the chunk regex also caught app code, and stubbing
//      Math.random broke three.js outright (it builds every object UUID from it).
//      Result: two screenshots of "This page couldn't load", diffed to a confident 177.
//
// SO: no blocking, no stubbing, no racing. ONE page load, fully settled, then toggle
// which layer is visible and shoot twice. Same bake, same geometry, same DOM -- the
// only difference between the two frames is which wall drew.
//
//   node scripts/wall-handoff.mjs

import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const PORT = Number(process.env.PORT || 8902);
const OUT = process.env.OUT || "C:/Users/chad/AppData/Local/Temp/claude/wall-handoff";
const VW = Number(process.env.VW || 1600);
const VH = Number(process.env.VH || 1000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};
const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let file = path.join("out", decodeURIComponent(url.pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  else if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) return res.writeHead(404).end("nf");
  const body = readFileSync(file);
  res
    .writeHead(200, {
      "content-type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "public, max-age=3600",
      "content-length": body.length,
    })
    .end(body);
});
await new Promise((r) => server.listen(PORT, r));
mkdirSync(OUT, { recursive: true });

const root =
  process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(process.env.LOCALAPPDATA, "ms-playwright");
const buildDir = readdirSync(root)
  .filter((d) => /^chromium-\d+$/.test(d))
  .sort((a, b) => Number(b.slice(9)) - Number(a.slice(9)))[0];
const browser = await chromium.launch({
  executablePath: path.join(root, buildDir, "chrome-win64/chrome.exe"),
});

const context = await browser.newContext({ viewport: { width: VW, height: VH } });
const page = await context.newPage();
await page.goto(`http://localhost:${PORT}/showroom/?wallperf=1`, { waitUntil: "commit" });
await page
  .waitForFunction(() => performance.getEntriesByName("wall:wall-painted").length > 0, null, {
    timeout: 30000,
  })
  .catch(() => console.log("  WARNING: the WebGL wall never painted"));
await page.waitForTimeout(900); // let the intro settle so neither shot catches motion

const info = await page.evaluate(() => {
  const el = document.querySelector('[class*="canvasWrap"],[class*="stageHold"]');
  const cv = document.querySelector("canvas");
  return {
    bake: (getComputedStyle(el).backgroundImage.match(/bake-\d/) || ["?"])[0],
    hasCanvas: !!cv,
    canvasW: cv ? Math.round(cv.getBoundingClientRect().width) : 0,
    canvasH: cv ? Math.round(cv.getBoundingClientRect().height) : 0,
    innerW: window.innerWidth,
    innerH: window.innerHeight,
    // The build under test is identified by what it SHIPS, not by a flag here: the
    // fixed TileWall says so in its own source comment.
    usesWindow: !!window.__WALL_USES_WINDOW,
  };
});
info.usesWindow = process.env.USES_WINDOW === "1";
console.log(
  `\nwall-handoff  ${VW}x${VH}  ${info.bake}  canvas ${info.canvasW}px  window ${info.innerW}px\n`,
);

// THE DECISIVE NUMBER, and it does not depend on image contrast.
//
// CSS draws the wall at 1:1 -- background-size is COMPOSITE_W, on an element that is
// canvasW wide. So one texture pixel is one CSS pixel, exactly, by construction.
//
// WebGL: the plane is sized visH * PLANE_ASPECT, the camera's aspect comes from the
// canvas, and `repeat` puts canvasW texture pixels across the plane's whole width. So
//     plane width on screen = PLANE_ASPECT / (canvasW/canvasH) * canvasW
//     texture px per CSS px  = canvasW / that
// which is 1.000 only when PLANE_ASPECT is the CANVAS aspect. Feed it the WINDOW
// aspect instead and the wall is drawn at the wrong scale by exactly the ratio of the
// two widths -- the scrollbar gutter.
const scale = (planeAspectW) => {
  const planeWpx = (planeAspectW / info.innerH / (info.canvasW / info.canvasH)) * info.canvasW;
  return info.canvasW / planeWpx;
};
const s = scale(info.usesWindow ? info.innerW : info.canvasW);
const drift = Math.round(info.canvasW * (1 / s - 1));
console.log(`  plane aspect taken from : ${info.usesWindow ? "window.innerWidth" : "canvas width"}`);
console.log(`  texture px per CSS px   : ${s.toFixed(5)}   (1.00000 is correct)`);
console.log(`  drift across the wall   : ${drift}px  (~${Math.round(Math.abs(drift) / 2)}px at each edge)\n`);

// Shot 1: CSS wall only -- hide the canvas, leave everything else alone.
await page.evaluate(() => {
  document.querySelector("canvas").style.visibility = "hidden";
});
const cssShot = path.join(OUT, "1-css-wall.png");
await page.screenshot({ path: cssShot });

// Shot 2: WebGL wall only -- canvas back, CSS backdrop off.
await page.evaluate(() => {
  document.querySelector("canvas").style.visibility = "visible";
  const el = document.querySelector('[class*="canvasWrap"],[class*="stageHold"]');
  el.style.backgroundImage = "none";
});
const glShot = path.join(OUT, "2-webgl-wall.png");
await page.screenshot({ path: glShot });

// Compare the OUTER columns only. The gem lives in the middle and is legitimately in
// just one of the two frames, so the centre is not comparable -- but a uniform scale
// error is largest at the edges anyway, which is exactly where this looks.
const result = await page.evaluate(
  async ([a, b]) => {
    const load = (src) =>
      new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = src;
      });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const W = ia.width;
    const H = Math.min(ia.height, ib.height);
    const grab = (img) => {
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const x = c.getContext("2d");
      x.drawImage(img, 0, 0);
      return x.getImageData(0, 0, W, H).data;
    };
    const da = grab(ia);
    const db = grab(ib);
    const y0 = Math.round(H * 0.15);
    const y1 = Math.round(H * 0.85);
    const zone = (x0, x1) => {
      let s = 0;
      let n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * W + x) * 4;
          for (let k = 0; k < 3; k++) {
            s += Math.abs(da[i + k] - db[i + k]);
            n++;
          }
        }
      }
      return s / n;
    };
    return {
      farLeft: zone(0, Math.round(W * 0.12)),
      left: zone(Math.round(W * 0.12), Math.round(W * 0.24)),
      right: zone(Math.round(W * 0.76), Math.round(W * 0.88)),
      farRight: zone(Math.round(W * 0.88), W),
    };
  },
  [
    `data:image/png;base64,${readFileSync(cssShot).toString("base64")}`,
    `data:image/png;base64,${readFileSync(glShot).toString("base64")}`,
  ],
);

const rows = [
  ["far left  (0-12%)", result.farLeft],
  ["left      (12-24%)", result.left],
  ["right     (76-88%)", result.right],
  ["far right (88-100%)", result.farRight],
];
console.log("  zone                  mean delta /255");
for (const [label, v] of rows) {
  console.log(`  ${label.padEnd(22)} ${v.toFixed(1).padStart(6)}  ${"#".repeat(Math.min(40, Math.round(v)))}`);
}
const worst = Math.max(...rows.map((r) => r[1]));
console.log(
  `\n  worst edge ${worst.toFixed(1)}/255 -- ${
    worst < 10
      ? "ALIGNED. The bricks do not move when the canvas takes over."
      : "MISALIGNED. The wall changes size at the handoff."
  }`,
);
console.log(`\n  ${cssShot}\n  ${glShot}`);

await browser.close();
server.close();
