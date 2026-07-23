// Rendered-text diff -- what a READER sees, compared across two builds.
//
// WHY THIS EXISTS. During the 2026-07-23 pricing-hub pass, tsc, next build and
// index-audit all passed green while four pages shipped broken copy:
// "500contacts", "$39plan". Turning a numeral into a JSX expression can eat the
// space after it, and no source-level grep can see that -- the source is
// correct, the render is not. This caught all four.
//
// It is the right check for any change that is supposed to be INVISIBLE:
// routing a figure through the hub, extracting a component, renaming a
// constant. Save a baseline, make the change, rebuild, check. Zero differences
// is the pass. When a price genuinely changes, differences are expected -- the
// point is that they are the ones you meant and nothing else moved with them.
//
// WHY IT IS NOT A BYTE DIFF. Every page embeds hashed chunk names and an RSC
// payload, so all 66 pages differ on any rebuild. This strips <script>/<style>,
// DELETES html comments, drops tags, unescapes entities and collapses
// whitespace. Deleting comments is load-bearing: React emits <!-- --> between
// adjacent text nodes, so `$3,250 but` (one text node) and `{money(BASE)} but`
// (two) differ in source while rendering identically. A browser paints a
// comment as nothing, not as a space. Treat it as a space and every
// interpolation looks like a copy change; delete it and only real ones show.
//
// Usage:
//   node scripts/render-diff.mjs save <label>    snapshot out/ under a name
//   node scripts/render-diff.mjs check <label>   compare out/ against it
//
// Typical run:
//   npm run build && node scripts/render-diff.mjs save before
//   ...make the change...
//   npm run build && node scripts/render-diff.mjs check before
//
// Snapshots live in .render-snapshots/ and are gitignored: they are build
// output, and they are only meaningful against the tree that produced them.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT = "out";
const SNAP_DIR = ".render-snapshots";
const [mode, label] = process.argv.slice(2);

if (!["save", "check"].includes(mode) || !label) {
  console.error("usage: node scripts/render-diff.mjs <save|check> <label>");
  process.exit(1);
}
if (!existsSync(OUT)) {
  console.error(`render-diff: no build at ${OUT}/ -- run npm run build first.`);
  process.exit(1);
}

const STRIP = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const COMMENT = /<!--[\s\S]*?-->/g;
const TAG = /<[^>]+>/g;

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘",
  ldquo: "“", rdquo: "”", trade: "™",
};
const unescape = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);

function textOf(file) {
  const raw = readFileSync(file, "utf8");
  if (file.endsWith(".txt")) return raw.replace(/\s+/g, " ").trim();
  return unescape(raw.replace(STRIP, " ").replace(COMMENT, "").replace(TAG, " "))
    .replace(/\s+/g, " ")
    .trim();
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    // index.html is the page; llms.txt and robots.txt are the text surfaces.
    // Skipping the .txt RSC payloads Next emits beside each route.
    else if (entry.name === "index.html" || /^(llms|robots)\.txt$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const files = await walk(OUT);
const snapshot = {};
for (const f of files) snapshot[relative(OUT, f).split(sep).join("/")] = textOf(f);

mkdirSync(SNAP_DIR, { recursive: true });
const snapPath = join(SNAP_DIR, `${label}.json`);

if (mode === "save") {
  writeFileSync(snapPath, JSON.stringify(snapshot, null, 0));
  console.log(`render-diff: saved ${Object.keys(snapshot).length} page(s) as "${label}".`);
  process.exit(0);
}

if (!existsSync(snapPath)) {
  console.error(`render-diff: no snapshot "${label}". Run \`save ${label}\` on the baseline build.`);
  process.exit(1);
}
const before = JSON.parse(readFileSync(snapPath, "utf8"));

// Sentence-level, so a report reads like prose rather than a token soup. A
// changed sentence shows up as one removed and one added line, which is what
// makes "500 contacts" -> "500contacts" obvious at a glance.
const sentences = (t) => t.split(/(?<=[.!?])\s+/).filter(Boolean);

let changed = 0;
for (const page of new Set([...Object.keys(before), ...Object.keys(snapshot)])) {
  const a = before[page], b = snapshot[page];
  if (a === undefined) { console.log(`\n=== ${page} === NEW PAGE`); changed++; continue; }
  if (b === undefined) { console.log(`\n=== ${page} === PAGE GONE`); changed++; continue; }
  if (a === b) continue;
  changed++;
  console.log(`\n=== ${page} ===`);
  const countOf = (list) => list.reduce((m, s) => m.set(s, (m.get(s) ?? 0) + 1), new Map());
  const ca = countOf(sentences(a)), cb = countOf(sentences(b));
  for (const [s, n] of ca) {
    const extra = n - (cb.get(s) ?? 0);
    for (let i = 0; i < extra; i++) console.log(`  - ${s.slice(0, 160)}`);
  }
  for (const [s, n] of cb) {
    const extra = n - (ca.get(s) ?? 0);
    for (let i = 0; i < extra; i++) console.log(`  + ${s.slice(0, 160)}`);
  }
}

if (!changed) {
  console.log(`render-diff OK -- ${Object.keys(snapshot).length} page(s), no visible text changed.`);
  process.exit(0);
}
console.log(`\n${changed} page(s) differ in visible text.`);
console.log("Expected, if you changed a price. Not expected, if you were only moving a figure into the hub.");
process.exit(1);
