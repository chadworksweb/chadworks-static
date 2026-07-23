// Perf measurement harness -- run Lighthouse against the built export, repeatably.
//
// WHY THIS EXISTS. Single Lighthouse runs on a working machine vary by roughly
// plus or minus 8 points, which is wide enough to "prove" a change that did
// nothing and to bury one that worked. Every perf claim in this repo should come
// from the median of several runs against a local server, with the same flags,
// or it is not a claim.
//
// It serves out/ itself (compressed, matching deploy/compression.conf) so the
// numbers reflect what production serves rather than an uncompressed export.
//
// USAGE
//   npm run build
//   node scripts/perf-measure.mjs                     # homepage, 3 runs
//   node scripts/perf-measure.mjs / /web-design/      # several routes
//   RUNS=5 node scripts/perf-measure.mjs /
//   BLOCK=gtag node scripts/perf-measure.mjs /        # block a URL substring
//   node scripts/perf-measure.mjs --save baseline     # write results to a file
//   node scripts/perf-measure.mjs --against baseline  # and diff against it
//
// Results land in .perf/<label>.json, which is gitignored. The diff prints the
// delta per metric so a change can be read at a glance.
//
// NOT a deploy gate. Lighthouse is far too slow and too noisy to block a deploy
// on, and this needs a built export plus a free port. It is a bench, run by hand.

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";

const PORT = Number(process.env.PORT || 8899);
const RUNS = Number(process.env.RUNS || 3);
const BLOCK = process.env.BLOCK || "";
const OUT_DIR = ".perf";
const TMP_DIR = ".perf/tmp";

const argv = process.argv.slice(2);
let saveLabel = null;
let againstLabel = null;
const routes = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--save") saveLabel = argv[++i];
  else if (argv[i] === "--against") againstLabel = argv[++i];
  else routes.push(argv[i]);
}
if (routes.length === 0) routes.push("/");

// Git Bash rewrites a bare "/" argument into the MSYS install path before node
// ever sees it, so `node scripts/perf-measure.mjs /` silently benchmarks
// "C:/Program Files/Git/" and reports a score of 0. Catch it rather than let it
// look like a catastrophic regression.
for (const r of routes) {
  if (/^[A-Za-z]:[\\/]/.test(r)) {
    console.error(`"${r}" is a Windows path, not a route. Git Bash rewrote it.`);
    console.error('Pass no argument for the homepage, or prefix with MSYS_NO_PATHCONV=1.');
    process.exit(1);
  }
}

if (!existsSync("out/index.html")) {
  console.error("No out/index.html. Run `npm run build` first.");
  process.exit(1);
}

mkdirSync(TMP_DIR, { recursive: true });

// The five metrics the performance score is computed from, with their weights
// in Lighthouse 12 mobile. Printed alongside the score so a moved score can be
// attributed to the metric that moved it.
const METRICS = [
  ["first-contentful-paint", "FCP", 0.1],
  ["largest-contentful-paint", "LCP", 0.25],
  ["total-blocking-time", "TBT", 0.3],
  ["cumulative-layout-shift", "CLS", 0.25],
  ["speed-index", "SI", 0.1],
];

function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// Node 20+ refuses to spawn a .cmd shim without a shell on Windows (EINVAL), and
// npx IS a .cmd there. Going through the shell means any argument containing a
// space has to arrive quoted, or the shell splits it into two arguments and
// Lighthouse rejects the second one.
const WIN = process.platform === "win32";
const NPX = WIN ? "npx.cmd" : "npx";
const shellOpts = WIN ? { shell: true } : {};
const q = (a) => (WIN && /\s/.test(a) ? `"${a}"` : a);

console.log(`Serving out/ on :${PORT} (compressed) ...`);
const server = spawn(
  NPX,
  ["--yes", "serve", "out", "-l", String(PORT), "--no-port-switching"].map(q),
  { stdio: "ignore", detached: false, ...shellOpts },
);

// Give serve a moment, then confirm it is actually answering before burning
// several minutes of Lighthouse runs against a dead port.
await new Promise((r) => setTimeout(r, 6000));
try {
  const res = await fetch(`http://localhost:${PORT}/`);
  if (!res.ok) throw new Error(`status ${res.status}`);
} catch (err) {
  server.kill();
  console.error(`Server on :${PORT} is not answering (${err.message}). Is the port in use?`);
  process.exit(1);
}

const results = {};

try {
  for (const route of routes) {
    const url = `http://localhost:${PORT}${route.startsWith("/") ? route : `/${route}`}`;
    const runs = [];
    for (let i = 1; i <= RUNS; i++) {
      const file = `${TMP_DIR}/run-${i}.json`;
      const args = [
        "--yes",
        "lighthouse@12",
        url,
        "--only-categories=performance",
        "--output=json",
        `--output-path=${file}`,
        '--chrome-flags=--headless=new --no-sandbox',
        "--quiet",
      ];
      if (BLOCK) args.push(`--blocked-url-patterns=${BLOCK}`);
      const r = spawnSync(NPX, args.map(q), {
        stdio: ["ignore", "ignore", "pipe"],
        ...shellOpts,
      });
      if (!existsSync(file)) {
        console.error(`  run ${i} produced no report:`, String(r.stderr).split("\n").slice(-3).join(" "));
        continue;
      }
      const j = JSON.parse(readFileSync(file, "utf8"));
      runs.push({
        score: Math.round(j.categories.performance.score * 100),
        metrics: Object.fromEntries(METRICS.map(([id, key]) => [key, j.audits[id].numericValue])),
        bytes: j.audits["total-byte-weight"].numericValue,
        lcpElement:
          j.audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.selector ?? "?",
      });
      process.stdout.write(`  ${route} run ${i}/${RUNS}: ${runs.at(-1).score}\n`);
    }
    if (!runs.length) continue;
    results[route] = {
      score: median(runs.map((r) => r.score)),
      scores: runs.map((r) => r.score),
      metrics: Object.fromEntries(METRICS.map(([, key]) => [key, median(runs.map((r) => r.metrics[key]))])),
      bytes: median(runs.map((r) => r.bytes)),
      lcpElement: runs[0].lcpElement,
    };
  }
} finally {
  server.kill();
  rmSync(TMP_DIR, { recursive: true, force: true });
}

// ------------------------------------------------------------------ report

function fmt(key, v) {
  if (key === "CLS") return v.toFixed(3);
  return `${(v / 1000).toFixed(2)}s`;
}

const prev = againstLabel && existsSync(`${OUT_DIR}/${againstLabel}.json`)
  ? JSON.parse(readFileSync(`${OUT_DIR}/${againstLabel}.json`, "utf8"))
  : null;
if (againstLabel && !prev) console.log(`\n(no saved baseline "${againstLabel}" to diff against)`);

console.log("");
for (const [route, r] of Object.entries(results)) {
  const p = prev?.[route];
  const delta = p ? ` (${r.score - p.score >= 0 ? "+" : ""}${r.score - p.score} vs ${againstLabel})` : "";
  console.log(`${route}  score ${r.score}${delta}   runs [${r.scores.join(", ")}]`);
  for (const [, key] of METRICS) {
    const d = p ? `   ${p.metrics[key] > r.metrics[key] ? "better" : p.metrics[key] < r.metrics[key] ? "WORSE " : "same  "} was ${fmt(key, p.metrics[key])}` : "";
    console.log(`    ${key.padEnd(4)} ${fmt(key, r.metrics[key]).padStart(7)}${d}`);
  }
  console.log(`    bytes ${(r.bytes / 1024).toFixed(0)} KiB${p ? `   was ${(p.bytes / 1024).toFixed(0)} KiB` : ""}`);
  console.log(`    LCP element: ${r.lcpElement}`);
}

if (saveLabel) {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(`${OUT_DIR}/${saveLabel}.json`, JSON.stringify(results, null, 1));
  console.log(`\nSaved to ${OUT_DIR}/${saveLabel}.json`);
}
