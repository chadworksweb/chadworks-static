// Index audit (launch control safety net) -- verifies the BUILT export, so it
// catches indexing drift no matter how a page's metadata was authored.
//
// Two invariants, both derived from launch.ts via the generated sitemap:
//   1. Every URL in sitemap.xml must serve an indexable page. A sitemap entry
//      that emits `noindex` is the exact bug that put /about/, /contact/ and
//      /rates/ into GSC "Excluded by 'noindex'" while they were LAUNCHED.
//   2. Every page NOT in sitemap.xml must emit `noindex`. Catches the reverse
//      drift: a hardcoded `index: true` left on an unlaunched route.
//
// Usage: node scripts/index-audit.mjs [outDir]   (default: out)
// Exits 1 on any violation. Wired into deploy.sh after `npm run build`.

import { readFileSync, existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT = process.argv[2] || "out";
const SITE_URL = "https://chadworks.co";

if (!existsSync(OUT)) {
  console.error(`index-audit: no build found at ${OUT}/ -- run npm run build first.`);
  process.exit(1);
}

// --- the sitemap is the launched set, already normalized to "/segment/" ---
const sitemapPath = join(OUT, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  console.error("index-audit: out/sitemap.xml missing -- the sitemap route did not export.");
  process.exit(1);
}
const sitemapXml = readFileSync(sitemapPath, "utf8");
const sitemapPaths = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].trim().replace(SITE_URL, "") || "/",
  ),
);

// --- walk every exported index.html ---
async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else if (entry.name === "index.html") found.push(full);
  }
  return found;
}

// Next writes the robots directive as <meta name="robots" content="...">.
const ROBOTS_RE = /<meta[^>]+name="robots"[^>]*content="([^"]*)"/i;

const missingIndex = []; // in sitemap but noindex -- invariant 1
const leakedIndex = []; // not in sitemap but indexable -- invariant 2

for (const file of await walk(OUT)) {
  const dir = relative(OUT, file).slice(0, -"index.html".length);
  const route = dir === "" ? "/" : `/${dir.split(sep).filter(Boolean).join("/")}/`;

  const html = readFileSync(file, "utf8");
  const directive = (html.match(ROBOTS_RE)?.[1] || "").toLowerCase();
  const noindex = directive.includes("noindex");

  if (sitemapPaths.has(route)) {
    if (noindex) missingIndex.push({ route, directive: directive || "(no robots meta)" });
  } else if (!noindex) {
    leakedIndex.push({ route, directive: directive || "(no robots meta)" });
  }
}

// --- report ---
let failed = false;

if (missingIndex.length) {
  failed = true;
  console.error(`\nindex-audit FAIL: ${missingIndex.length} sitemap page(s) serving noindex.`);
  console.error("These are launched in src/lib/launch.ts but tell Google not to index them.");
  console.error("Fix: add robots: { index: isLaunched(PAGE_PATH), follow: true } to the page metadata.\n");
  for (const p of missingIndex) console.error(`  ${p.route}  ->  ${p.directive}`);
}

if (leakedIndex.length) {
  failed = true;
  console.error(`\nindex-audit FAIL: ${leakedIndex.length} unlaunched page(s) are indexable.`);
  console.error("These are not in launch.ts but are exposed to search.");
  console.error("Fix: remove the hardcoded index: true, or gate it on isLaunched(PAGE_PATH).\n");
  for (const p of leakedIndex) console.error(`  ${p.route}  ->  ${p.directive}`);
}

if (failed) {
  console.error("");
  process.exit(1);
}

console.log(`index-audit OK -- ${sitemapPaths.size} sitemap route(s) indexable, everything else sealed.`);
