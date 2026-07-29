// TEMPORARY DIAGNOSTIC -- cold-load timeline for the showroom's baked wall.
//
// The question it answers: when the wall takes too long to appear, is the time going
// into the FETCH of the image, its DECODE, or the ~1MB three.js chunk that has to
// land before anything can consume the image at all? Four CSS theories were wrong in
// a row last session before the frame was instrumented, so this measures first.
//
// Serves out/ itself (gzip, like production), loads /showroom/?wallperf=1 in the
// cached chromium with the HTTP cache DISABLED, and prints:
//   - the serial chain of wall: marks (see src/components/showroom/wall-perf.ts)
//   - every request, with its CDP priority, start, and finish
//
// USAGE
//   npm run build
//   node scripts/wall-timing.mjs                 # no throttling (a localhost load)
//   THROTTLE=4g node scripts/wall-timing.mjs     # what a real visitor gets
//   THROTTLE=3g node scripts/wall-timing.mjs
//   RUNS=3 node scripts/wall-timing.mjs

import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { chromium } from "playwright-core";

const PORT = Number(process.env.PORT || 8901);
const RUNS = Number(process.env.RUNS || 1);
const ROUTE = process.env.ROUTE || "/showroom/";
const THROTTLE = (process.env.THROTTLE || "none").toLowerCase();
// "1" profiles the whole load; "window" profiles only from canvas-created onward.
const PROFILE = process.env.PROFILE || "";
const CACHE = (process.env.CACHE || "off").toLowerCase();
const EARLY_CHUNK = process.env.EARLY_CHUNK || "";
const BLOCK = process.env.BLOCK || "";
const EXTRA_QS = process.env.EXTRA_QS || "";

// Same resolver as widow-scan.mjs: find the browser rather than naming a build that
// will rot out of the cache.
function resolveChrome() {
  if (process.env.WIDOW_CHROME) return process.env.WIDOW_CHROME;
  const localAppData =
    process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || "", "AppData", "Local");
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(localAppData, "ms-playwright");
  const builds = existsSync(root)
    ? readdirSync(root)
        .filter((d) => /^chromium-\d+$/.test(d))
        .sort((a, b) => Number(b.slice(9)) - Number(a.slice(9)))
    : [];
  for (const build of builds) {
    for (const exe of ["chrome-win64/chrome.exe", "chrome-linux/chrome", "chrome-mac/chrome"]) {
      const full = path.join(root, build, exe);
      if (existsSync(full)) return full;
    }
  }
  console.error(`No cached chromium found under ${root}.`);
  process.exit(1);
}

if (!existsSync("out/index.html")) {
  console.error("No out/index.html. Run `npm run build` first.");
  process.exit(1);
}

// Chrome's own presets, so the numbers are comparable to a DevTools throttle.
const PROFILES = {
  none: null,
  "4g": { downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (9 * 1024 * 1024) / 8, latency: 40 },
  "3g": { downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 300 },
};
if (!(THROTTLE in PROFILES)) {
  console.error(`THROTTLE must be one of: ${Object.keys(PROFILES).join(", ")}`);
  process.exit(1);
}

// ------------------------------------------------------------------- server

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".xsl": "application/xml; charset=utf-8",
};
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".txt", ".svg", ".xml", ".xsl"]);

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let file = path.join("out", decodeURIComponent(url.pathname));
  try {
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    else if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
    if (!existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    const ext = path.extname(file).toLowerCase();
    let body = readFileSync(file);
    const headers = { "content-type": TYPES[ext] || "application/octet-stream" };
    // Every run is a cold load because the CONTEXT is fresh, not because caching is
    // forbidden. With CACHE=on the headers mirror production so the preload cache can
    // actually hold a resource for the loader that follows it.
    headers["cache-control"] =
      CACHE === "on"
        ? file.includes("_next") && file.includes("static")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=3600"
        : "no-store";
    if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
      body = gzipSync(body);
      headers["content-encoding"] = "gzip";
    }
    headers["content-length"] = body.length;
    res.writeHead(200, headers).end(body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
});
await new Promise((r) => server.listen(PORT, r));

// ------------------------------------------------------------------ measure

const browser = await chromium.launch({ executablePath: resolveChrome() });
const short = (u) => u.replace(`http://localhost:${PORT}`, "").slice(0, 62) || "/";

async function run(n) {
  // A fresh context per run: no HTTP cache, no memory cache, no warm connection.
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    bypassCSP: true,
  });
  const page = await context.newPage();

  // Long tasks, recorded from before the first byte of script runs. A block of dead
  // main thread is the thing the timeline shows as a gap; this names its size.
  await page.addInitScript(() => {
    window.__longtasks = [];
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__longtasks.push({ t: e.startTime, dur: e.duration, name: e.name });
        }
      }).observe({ entryTypes: ["longtask"] });
    } catch {
      /* diagnostics only */
    }
  });

  // Chrome warns when a preload goes unused. That warning is the difference between
  // "the preload worked" and "the preload downloaded 136KB nobody claimed".
  const console_ = [];
  page.on("console", (m) => {
    const t = m.text();
    if (/preload|texture|webgl|context/i.test(t)) console_.push(`${m.type()}: ${t.slice(0, 160)}`);
  });

  // EXPERIMENT (EARLY_CHUNK=<comma separated chunk basenames>). Asks for the showroom's
  // three.js chunks from the very first byte of the document instead of waiting for
  // React to hydrate and the mode effect to run. Injected from the harness, so it
  // measures the ceiling of that change before a line of app code moves.
  if (EARLY_CHUNK) {
    const names = EARLY_CHUNK.split(",");
    await page.addInitScript((chunks) => {
      for (const c of chunks) {
        const l = document.createElement("link");
        l.rel = "preload";
        l.as = "script";
        l.href = `/_next/static/chunks/${c}.js`;
        document.head.appendChild(l);
      }
    }, names);
  }

  // EXPERIMENT (BLOCK=<regex>). On a throttled connection the showroom is bandwidth
  // bound, so the question stops being "what is slow" and becomes "what else is on
  // the wire". Blocking a candidate is the only honest way to price it.
  if (BLOCK) {
    const re = new RegExp(BLOCK);
    await context.route(
      (u) => re.test(u.toString()),
      (route) => route.abort(),
    );
  }

  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  // CACHE=on is the truer cold load. A fresh context already starts with an empty
  // HTTP cache, so setCacheDisabled adds nothing -- except that it ALSO bypasses the
  // preload cache, which would make any preloaded resource look like it is fetched
  // twice. That is the exact thing being measured here, so it must be switchable.
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: CACHE !== "on" });
  const profile = PROFILES[THROTTLE];
  if (profile) await cdp.send("Network.emulateNetworkConditions", { offline: false, ...profile });

  // A sampling CPU profile attributes that dead main thread to actual functions.
  // 100us sampling: fine enough to separate hydration from decode, cheap enough not
  // to distort the very thing being measured.
  if (PROFILE) {
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.setSamplingInterval", { interval: 100 });
    // PROFILE=window starts sampling only once the canvas exists, so the numbers
    // describe the tail (context setup -> shader compile -> upload -> paint) instead
    // of being buried under hydration.
    if (PROFILE === "1") await cdp.send("Profiler.start");
  }

  const reqs = new Map();
  let origin = null;
  cdp.on("Network.requestWillBeSent", (e) => {
    if (origin === null) origin = e.timestamp;
    reqs.set(e.requestId, {
      url: e.request.url,
      priority: e.request.initialPriority,
      initiator: e.initiator?.type,
      start: (e.timestamp - origin) * 1000,
      end: null,
      bytes: 0,
    });
  });
  cdp.on("Network.loadingFinished", (e) => {
    const r = reqs.get(e.requestId);
    if (r) {
      r.end = (e.timestamp - origin) * 1000;
      r.bytes = e.encodedDataLength;
    }
  });

  const url = `http://localhost:${PORT}${ROUTE}?wallperf=1${EXTRA_QS ? `&${EXTRA_QS}` : ""}`;
  await page.goto(url, { waitUntil: "commit" });
  // PROFILE=<markName> samples only from that mark onward, so a single link in the
  // chain can be attributed without hydration burying it.
  if (PROFILE && PROFILE !== "1") {
    await page
      .waitForFunction(
        (m) => performance.getEntriesByName(`wall:${m}`).length > 0,
        PROFILE,
        { timeout: 30000 },
      )
      .catch(() => {});
    await cdp.send("Profiler.start");
  }
  // Wait for the last link in the chain rather than a fixed sleep, so a slow run is
  // measured rather than truncated.
  await page
    .waitForFunction(() => performance.getEntriesByName("wall:wall-painted").length > 0, null, {
      timeout: 30000,
    })
    .catch(() => console.log("  (timed out waiting for wall:wall-painted)"));

  const marks = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const seen = new Map();
    for (const m of performance.getEntriesByType("mark")) {
      if (!m.name.startsWith("wall:")) continue;
      const key = m.name.slice(5);
      if (!seen.has(key)) seen.set(key, m.startTime);
    }
    return {
      marks: [...seen].map(([name, t]) => ({ name, t })),
      nav: {
        responseEnd: nav?.responseEnd ?? 0,
        domInteractive: nav?.domInteractive ?? 0,
        domContentLoaded: nav?.domContentLoadedEventEnd ?? 0,
      },
      paints: performance.getEntriesByType("paint").map((p) => ({ name: p.name, t: p.startTime })),
    };
  });

  const longtasks = await page.evaluate(() => window.__longtasks || []);

  // Roll the sampled call tree up into self time per function. Self time is what
  // matters here: a parent that merely awaits is not the cost.
  let hot = [];
  if (PROFILE) {
    const { profile: prof } = await cdp.send("Profiler.stop");
    const byId = new Map(prof.nodes.map((n) => [n.id, n]));
    const self = new Map();
    // timeDeltas[i] is the gap BEFORE samples[i], so it is that sample's cost.
    for (let i = 0; i < prof.samples.length; i++) {
      const node = byId.get(prof.samples[i]);
      if (!node) continue;
      const f = node.callFrame;
      const where = f.url ? `${f.url.split("/").pop()}:${f.lineNumber + 1}` : "(native)";
      const key = `${f.functionName || "(anonymous)"}  ${where}`;
      self.set(key, (self.get(key) || 0) + (prof.timeDeltas[i] || 0) / 1000);
    }
    hot = [...self].sort((a, b) => b[1] - a[1]).slice(0, 18);
  }

  await context.close();
  return { marks, reqs: [...reqs.values()], longtasks, hot, console_ };
}

const ms = (v) => `${v.toFixed(0)}ms`.padStart(8);

console.log(`\nwall-timing  route ${ROUTE}  throttle ${THROTTLE}  cache DISABLED\n`);

for (let i = 1; i <= RUNS; i++) {
  const { marks, reqs, longtasks, hot, console_ } = await run(i);
  console.log(`--- run ${i} -------------------------------------------------------`);

  const rows = [
    ...marks.paints.map((p) => ({ name: p.name, t: p.t })),
    { name: "domContentLoaded", t: marks.nav.domContentLoaded },
    ...marks.marks,
  ].sort((a, b) => a.t - b.t);

  let prev = 0;
  console.log("  TIMELINE                        at        +since prev");
  for (const r of rows) {
    console.log(`  ${r.name.padEnd(26)} ${ms(r.t)}   ${ms(r.t - prev)}`);
    prev = r.t;
  }

  console.log("\n  REQUESTS                                   prio      start      end     KB");
  const interesting = reqs
    .filter((r) => !/favicon|\.map$/.test(r.url))
    .sort((a, b) => a.start - b.start);
  for (const r of interesting) {
    const size = r.bytes ? (r.bytes / 1024).toFixed(0) : "-";
    console.log(
      `  ${short(r.url).padEnd(42)} ${String(r.priority || "?").padEnd(8)} ${ms(r.start)} ${ms(
        r.end ?? NaN,
      )} ${String(size).padStart(6)}`,
    );
  }

  if (longtasks.length) {
    const total = longtasks.reduce((a, t) => a + t.dur, 0);
    console.log(`\n  LONG TASKS (${longtasks.length}, ${total.toFixed(0)}ms of blocked main thread)`);
    for (const t of longtasks) {
      console.log(`  ${String(t.name).padEnd(26)} ${ms(t.t)}   for ${ms(t.dur)}`);
    }
  }

  if (console_.length) {
    console.log("\n  CONSOLE (preload / texture / webgl)");
    for (const line of console_) console.log(`  ${line}`);
  }

  if (hot.length) {
    console.log("\n  CPU SELF TIME (top functions)");
    for (const [key, v] of hot) console.log(`  ${ms(v)}  ${key}`);
  }
  console.log("");
}

await browser.close();
server.close();
