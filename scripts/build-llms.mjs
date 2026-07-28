// llms.txt builder -- assembles out/llms.txt from two sources:
//
//   STRUCTURE  src/content/llms.source.txt: the section order, headings, link
//              labels, the site summary blockquote, and the bare fact lines at
//              the foot of the About section. Hand-authored, holds EVERY entry
//              whether or not its route is launched.
//   SENTENCES  the BUILT export: each entry's description is replaced with that
//              page's own <meta name="description">.
//
// WHY THE META DESCRIPTION IS THE SENTENCE (2026-07-26). llms.txt used to carry
// its own hand-written sentence per page, which meant every page's description
// was written and maintained twice, in two registers, drifting apart. Every
// launched page already has a description Chad wrote. Pulling from it makes the
// page the single source: rewrite the meta and both the search snippet and the
// llms.txt line change together, with nothing to keep in sync.
//
// WHY POSTBUILD AND NOT PREBUILD. Reading the built HTML means every value is
// already resolved -- `${HOURLY_RATE}` arrives as a number, not a template
// string -- and it catches drift no matter how a page's metadata was authored.
// Same reasoning as index-audit.mjs, which audits the export for the same
// reason. At prebuild the descriptions only exist as uncompiled TypeScript.
//
// WHAT IS FILTERED. Only launched routes are listed. The launched set comes
// from out/sitemap.xml, which is generated from src/lib/launch.ts, so this
// cannot disagree with launch control. A sealed entry keeps its line in the
// SOURCE and reappears automatically the day its route launches.
//
// Why sealed routes must not be listed even though they serve noindex:
// `noindex` is an INDEXING directive. It keeps a page out of a search index. It
// does not stop a fetch, and an assistant answering a live question is fetching,
// not consulting an index. llms.txt is a fetch invitation, so listing a sealed
// route invites assistants to read and quote a page that was held back. Audited
// 2026-07-26, when the hand-maintained file had drifted both ways at once: 33
// URLs pointing at sealed routes, and 5 launched pages missing entirely,
// including the homepage.
//
// Usage: node scripts/build-llms.mjs [outDir]   (default: out)
// Wired into package.json as `postbuild`. Exits 1 on any coverage failure.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { readSitemapPaths } from "./lib/sitemap-urls.mjs";

const OUT = process.argv[2] || "out";
const SOURCE_FILE = join("src", "content", "llms.source.txt");
const SITE_URL = "https://chadworks.co";

// Routes that are launched but deliberately never listed. Legal boilerplate is
// not what an assistant should be pointed at, and listing it spends attention
// that belongs on the service pages.
const NEVER_LISTED = new Set(["/privacy-policy/", "/terms-of-service/"]);

// Routes whose SOURCE sentence wins over the page's meta description. For the
// few pages where the llms.txt line should carry more than a search snippet
// can. Empty on purpose: the default is that the page's own description wins.
// Add a route here only with a reason, or the two drift apart again.
const KEEP_SOURCE_SENTENCE = new Set([]);

if (!existsSync(OUT)) {
  console.error(`build-llms: no build found at ${OUT}/ -- run npm run build first.`);
  process.exit(1);
}

// --- the launched set, straight from the generated sitemap ---
// Via the index: sitemap.xml lists the child SITEMAPS, and the pages live in
// those (see scripts/lib/sitemap-urls.mjs).
const launched = readSitemapPaths(OUT, SITE_URL);
if (launched === null) {
  console.error("build-llms: out/sitemap.xml missing -- the sitemap route did not export.");
  process.exit(1);
}

// --- read a built page's meta description ---
const DESC_RE = /<meta name="description" content="([^"]*)"/;

// Next escapes the description into HTML. Undo exactly what it does, so an
// apostrophe reads as an apostrophe rather than &#x27; in the file an assistant
// quotes from.
function decodeEntities(s) {
  return s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&"); // last: an entity's own & must not be re-decoded
}

function metaDescription(route) {
  const file = join(OUT, route === "/" ? "" : route, "index.html");
  if (!existsSync(file)) return null;
  const match = readFileSync(file, "utf8").match(DESC_RE);
  return match ? decodeEntities(match[1]).trim() : null;
}

// --- rebuild each entry line ---
const source = readFileSync(SOURCE_FILE, "utf8");
const EOL = source.includes("\r\n") ? "\r\n" : "\n";
const lines = source.split(EOL);

const URL_RE = new RegExp(`${SITE_URL}[^)\\s]*`, "g");
// A rewritable entry is a list item whose label links exactly one page:
//   - [Label](https://chadworks.co/route/): sentence
const ENTRY_RE = new RegExp(`^(- \\[[^\\]]*\\]\\((${SITE_URL}[^)]*)\\))(?::.*)?$`);

const toRoute = (url) => url.replace(SITE_URL, "") || "/";

const kept = [];
const missingMeta = [];
let rewritten = 0;
let heldSource = 0;
let dropped = 0;

for (const line of lines) {
  const urls = line.match(URL_RE);
  // Headings, the blockquote, blank lines, and the bare fact lines at the foot
  // of About carry no URL. Always kept, never rewritten.
  if (!urls) {
    kept.push(line);
    continue;
  }

  const routes = urls.map(toRoute);
  const live = routes.filter((r) => launched.has(r) && !NEVER_LISTED.has(r));
  // A line survives only if EVERY route on it is launched. The town-page line
  // carries nine links, so a partial launch would otherwise ship a line
  // advertising eight sealed routes alongside one live one.
  if (live.length !== routes.length) {
    dropped++;
    continue;
  }

  const entry = line.match(ENTRY_RE);
  // Multi-link lines and any other shape keep their source text: there is no
  // single page whose description could stand in for them.
  if (!entry || urls.length > 1) {
    kept.push(line);
    heldSource++;
    continue;
  }

  const route = toRoute(entry[2]);
  if (KEEP_SOURCE_SENTENCE.has(route)) {
    kept.push(line);
    heldSource++;
    continue;
  }

  const description = metaDescription(route);
  if (!description) {
    missingMeta.push(route);
    continue;
  }

  kept.push(`${entry[1]}: ${description}`);
  rewritten++;
}

if (missingMeta.length) {
  console.error(`\nbuild-llms FAIL: ${missingMeta.length} launched page(s) have no meta description.`);
  console.error("The llms.txt sentence is the page's own description, so a page without one has nothing to say.");
  console.error("Fix: add a description to that page's exported metadata.\n");
  for (const r of missingMeta) console.error(`  ${r}`);
  console.error("");
  process.exit(1);
}

// --- drop headings whose section emptied out ---
// A `## Switch` heading with every entry filtered away is a promise of content
// that is not there.
const isHeading = (l) => l.startsWith("## ");
const pruned = [];
for (let i = 0; i < kept.length; i++) {
  if (!isHeading(kept[i])) {
    pruned.push(kept[i]);
    continue;
  }
  let j = i + 1;
  let hasContent = false;
  for (; j < kept.length && !isHeading(kept[j]); j++) {
    if (kept[j].trim() !== "") hasContent = true;
  }
  if (hasContent) pruned.push(kept[i]);
  else i = j - 1; // skip the heading and the blank lines under it
}

// Collapse the blank-line runs that filtering leaves behind.
const out = [];
for (const line of pruned) {
  if (line.trim() === "" && out.length && out[out.length - 1].trim() === "") continue;
  out.push(line);
}
while (out.length && out[out.length - 1].trim() === "") out.pop();
const text = out.join(EOL) + EOL;

// --- coverage: every launched route must appear ---
const listed = new Set((text.match(URL_RE) || []).map(toRoute));
const missing = [...launched].filter((r) => !NEVER_LISTED.has(r) && !listed.has(r));

if (missing.length) {
  console.error(`\nbuild-llms FAIL: ${missing.length} launched route(s) have no llms.txt entry.`);
  console.error("A launched page missing here is invisible to the crawlers the file exists to serve.");
  console.error(`Fix: add a labelled line for each to ${SOURCE_FILE}. The sentence comes from the`);
  console.error("page's meta description, so the source line needs only the label and the URL:");
  console.error("  - [Label](https://chadworks.co/route/)\n");
  for (const r of missing) console.error(`  ${r}`);
  console.error("");
  process.exit(1);
}

writeFileSync(join(OUT, "llms.txt"), text);
// Mirror into public/ so `npm run dev` serves the last build's copy. Gitignored,
// and never a source: build-llms always regenerates it from the export.
writeFileSync(join("public", "llms.txt"), text);

console.log(
  `build-llms: ${listed.size} launched URL(s) listed -- ${rewritten} sentence(s) from page metadata, ${heldSource} kept from source, ${dropped} sealed line(s) held back.`,
);
