// Portfolio audit -- keeps the three portfolio surfaces from drifting apart.
//
// WHY THIS EXISTS. The work appears in three places driven by three DIFFERENT
// hand-maintained lists (see "Portfolio surfaces" in CWS-COMPONENT-REGISTRY):
//
//   1. the showcase capsule  -> ARCHIVE + FEATURED + HELD_BACK in
//                               src/components/capsules/PortfolioShowcaseCapsule.tsx
//   2. /showroom/            -> SHOWROOM_ITEMS in
//                               src/components/showroom/showroom-data.ts
//   3. the ripple portfolio  -> a `portfolio:` block on a Service object
//
// Nothing connects them. Add a project to one and it goes silently missing from
// the other; tsc, next build and every existing gate pass. That failure has
// already landed three times: rslgo dropped out of the showroom, a whole
// `portfolio` block in web-development.tsx went dead behind a slot override, and
// the same shape nearly left the staging vhost out of deploy.sh. The expansion
// plan calls it "the recurring defect on this codebase".
//
// This is the guard. It parses the lists instead of trusting a comment, and it
// fails the deploy rather than the build, so `npm run dev` and a local
// `npm run build` stay fast. Wired into deploy.sh beside index-audit.mjs,
// price-audit.mjs and stack-query-audit.mjs.
//
// WHAT IT ENFORCES
//   A. /showroom/ is the superset. Every ARCHIVE key and the FEATURED slug must
//      appear in SHOWROOM_ITEMS.
//   B. No showroom-only strays. Every SHOWROOM_ITEMS key must be in ARCHIVE or
//      be the flagship, so a piece cannot exist on the reel and nowhere else.
//   C. HELD_BACK entries must name a real ARCHIVE key. A typo there is silent:
//      the item keeps showing and nobody finds out.
//   D. Every capture a list points at must exist on disk, at the extension
//      lib/captures.ts will actually request (.webp unless excepted).
//   E. Dead ripple data. A page that overrides the `portfolio` slot can never
//      render its Service's `portfolio` block, so carrying one is dead weight
//      that reads as live.
//
// Orphaned captures (a file in public/portfolio no list points at) are reported
// as a NOTE only, never a failure. Deleting assets needs Chad's approval, and
// deploy.sh already excludes the JPG/PNG originals from the sync.

import { readFileSync, existsSync, readdirSync } from "node:fs";

const CAPSULE = "src/components/capsules/PortfolioShowcaseCapsule.tsx";
const SHOWROOM = "src/components/showroom/showroom-data.ts";
const CAPTURES = "src/lib/captures.ts";
const PUBLIC_PORTFOLIO = "public/portfolio";
const APP_DIR = "src/app";

const problems = [];
const notes = [];

function read(file) {
  if (!existsSync(file)) {
    problems.push(`MISSING FILE: ${file} -- this audit cannot verify anything without it.`);
    return "";
  }
  return readFileSync(file, "utf8");
}

// Slice a top-level `const NAME = [ ... ];` / `= { ... };` initialiser out of a
// source file by walking brackets, so a nested array or object inside an entry
// cannot end the slice early (a plain regex stops at the first "];").
function sliceInitialiser(src, name, open, close) {
  const decl = new RegExp(`(?:const|export const)\\s+${name}\\b[^=]*=\\s*\\${open}`);
  const m = decl.exec(src);
  if (!m) return null;
  let depth = 1;
  let i = m.index + m[0].length;
  let inStr = null;
  for (; i < src.length && depth > 0; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\") i++;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === open) depth++;
    else if (ch === close) depth--;
  }
  return src.slice(m.index + m[0].length, i - 1);
}

// Every `key: "..."` / `slug: "..."` at any depth inside the sliced body. The
// lists are flat objects, so this reads each entry exactly once.
function fieldValues(body, field) {
  const out = [];
  const re = new RegExp(`\\b${field}\\s*:\\s*["'\`]([^"'\`]+)["'\`]`, "g");
  let m;
  while ((m = re.exec(body))) out.push(m[1]);
  return out;
}

const capsuleSrc = read(CAPSULE);
const showroomSrc = read(SHOWROOM);

// ---------------------------------------------------------------- parse

const archiveBody = sliceInitialiser(capsuleSrc, "ARCHIVE", "[", "]");
const showroomBody = sliceInitialiser(showroomSrc, "SHOWROOM_ITEMS", "[", "]");
const featuredBody = sliceInitialiser(capsuleSrc, "FEATURED", "{", "}");
const heldBackBody = sliceInitialiser(capsuleSrc, "HELD_BACK", "[", "]");

if (archiveBody === null) problems.push(`Could not find the ARCHIVE array in ${CAPSULE}. Renamed? Update this audit with it.`);
if (showroomBody === null) problems.push(`Could not find the SHOWROOM_ITEMS array in ${SHOWROOM}. Renamed? Update this audit with it.`);
if (featuredBody === null) problems.push(`Could not find the FEATURED object in ${CAPSULE}. Renamed? Update this audit with it.`);
if (heldBackBody === null) problems.push(`Could not find the HELD_BACK array in ${CAPSULE}. Renamed? Update this audit with it.`);

const archiveKeys = archiveBody ? fieldValues(archiveBody, "key") : [];
const archiveSlugs = archiveBody ? fieldValues(archiveBody, "slug") : [];
const showroomKeys = showroomBody ? fieldValues(showroomBody, "key") : [];
const showroomSlugs = showroomBody ? fieldValues(showroomBody, "slug") : [];
const featuredSlug = featuredBody ? (fieldValues(featuredBody, "slug")[0] ?? null) : null;
// HELD_BACK is a bare string array, not objects.
const heldBack = heldBackBody ? [...heldBackBody.matchAll(/["'`]([^"'`]+)["'`]/g)].map((m) => m[1]) : [];

if (archiveBody && archiveKeys.length === 0) problems.push(`Parsed ARCHIVE in ${CAPSULE} but found no \`key\` fields. The shape changed; update this audit.`);
if (showroomBody && showroomKeys.length === 0) problems.push(`Parsed SHOWROOM_ITEMS in ${SHOWROOM} but found no \`key\` fields. The shape changed; update this audit.`);

const archiveSet = new Set(archiveKeys);
const showroomSet = new Set(showroomKeys);

// ---------------------------------------------------------------- A + B: the two lists

for (const key of archiveKeys) {
  if (!showroomSet.has(key)) {
    problems.push(
      `"${key}" is in ARCHIVE (${CAPSULE}) but NOT in SHOWROOM_ITEMS (${SHOWROOM}).\n` +
        `    /showroom/ is the full archive, so it must carry everything the showcase carries.\n` +
        `    Add it to SHOWROOM_ITEMS, in the reel position you want.`
    );
  }
}

for (const key of showroomKeys) {
  if (archiveSet.has(key)) continue;
  if (featuredSlug && key === featuredSlug) continue; // the flagship, held out of the grid by design
  problems.push(
    `"${key}" is in SHOWROOM_ITEMS (${SHOWROOM}) but NOT in ARCHIVE (${CAPSULE}).\n` +
      `    It shows on /showroom/ and nowhere else. Add it to ARCHIVE, and to HELD_BACK\n` +
      `    if it should stay out of the curated grid (that is the deliberate way to hide one).`
  );
}

// ---------------------------------------------------------------- C: holdbacks must be real

for (const key of heldBack) {
  if (!archiveSet.has(key)) {
    problems.push(
      `HELD_BACK names "${key}", which is not an ARCHIVE key (${CAPSULE}).\n` +
        `    A holdback that matches nothing does nothing, silently. Fix the spelling,\n` +
        `    or drop the entry if the piece is gone.`
    );
  }
}

if (featuredSlug && !showroomSet.has(featuredSlug)) {
  problems.push(
    `FEATURED is "${featuredSlug}" but SHOWROOM_ITEMS has no entry with that key (${SHOWROOM}).\n` +
      `    The flagship has to lead the reel as well as the showcase.`
  );
}

if (featuredSlug && archiveSet.has(featuredSlug)) {
  problems.push(
    `FEATURED "${featuredSlug}" is ALSO in ARCHIVE (${CAPSULE}).\n` +
      `    The flagship would render twice on every surface: once full-width, once as a card.`
  );
}

// ---------------------------------------------------------------- D: captures resolve

// Mirror lib/captures.ts: every slug resolves to .webp unless NOT_CONVERTED
// says otherwise. Parsed rather than assumed, so an exception added there is
// honoured here instead of turning into a false failure.
const capturesSrc = read(CAPTURES);
const notConvertedBody = sliceInitialiser(capturesSrc, "NOT_CONVERTED", "(", ")");
const notConverted = new Map(
  notConvertedBody
    ? [...notConvertedBody.matchAll(/\[\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\]/g)].map((m) => [m[1], m[2]])
    : []
);

const wantedFiles = new Set();
for (const slug of [...new Set([...archiveSlugs, ...showroomSlugs, ...(featuredSlug ? [featuredSlug] : [])])]) {
  const base = `${slug}-desktop`;
  wantedFiles.add(`${base}.${notConverted.get(base) ?? "webp"}`);
}

for (const file of [...wantedFiles].sort()) {
  if (!existsSync(`${PUBLIC_PORTFOLIO}/${file}`)) {
    problems.push(
      `Capture missing: ${PUBLIC_PORTFOLIO}/${file}\n` +
        `    A list points at this slug but the file it resolves to is not there, so the\n` +
        `    card renders a broken image. Encode the .webp, or add the slug to\n` +
        `    NOT_CONVERTED in ${CAPTURES} if it should keep serving its original.`
    );
  }
}

// ---------------------------------------------------------------- D2: orphan NOTE (never a failure)

if (existsSync(PUBLIC_PORTFOLIO)) {
  const onDisk = readdirSync(PUBLIC_PORTFOLIO).filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f));
  const referencedSlugs = new Set([...archiveSlugs, ...showroomSlugs, ...(featuredSlug ? [featuredSlug] : [])]);
  const orphans = onDisk.filter((f) => {
    const slug = f.replace(/\.(webp|jpg|jpeg|png)$/i, "").replace(/-(desktop|tablet|mobile|phone)$/i, "");
    return !referencedSlugs.has(slug);
  });
  if (orphans.length) {
    notes.push(
      `${orphans.length} capture file(s) in ${PUBLIC_PORTFOLIO} are referenced by neither list:\n` +
        orphans.map((f) => `      ${f}`).join("\n") +
        `\n    Not an error. Deleting assets needs Chad's approval, and deploy.sh already\n` +
        `    excludes ./portfolio/*.jpg and *.png from the sync, so the originals do not ship.`
    );
  }
}

// ---------------------------------------------------------------- E: dead ripple data

// A page that overrides the `portfolio` slot can never render its Service's
// `portfolio` block. Carrying one is dead data that reads as live -- exactly
// what web-development.tsx did until 2026-07-16b.
function appPages(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...appPages(p));
    else if (entry.name === "page.tsx") out.push(p);
  }
  return out;
}

if (existsSync(APP_DIR)) {
  for (const page of appPages(APP_DIR)) {
    const src = readFileSync(page, "utf8");
    // Only the override map assigns a JSX value to a `portfolio:` key.
    if (!/\boverrides\s*=\s*\{\{/.test(src)) continue;
    if (!/^\s*portfolio\s*:\s*</m.test(src)) continue;

    // Which Service does this page render? Take the lib/services import.
    const imp = /from\s+["'`]@\/lib\/services\/([\w-]+)["'`]/.exec(src);
    if (!imp) continue;
    const dataFile = `src/lib/services/${imp[1]}.tsx`;
    if (!existsSync(dataFile)) continue;
    const dataSrc = readFileSync(dataFile, "utf8");
    if (/^\s*portfolio\s*:\s*\{/m.test(dataSrc)) {
      problems.push(
        `Dead portfolio data: ${dataFile} carries a \`portfolio\` block, but ${page}\n` +
          `    overrides the portfolio slot, so compose.tsx never renders it.\n` +
          `    Delete the block (and its PortfolioCapsule import) or drop the override.`
      );
    }
  }
}

// ---------------------------------------------------------------- report

if (notes.length) {
  console.log("Portfolio audit notes:");
  for (const n of notes) console.log(`  NOTE: ${n}`);
}

if (problems.length) {
  console.error(`Portfolio audit FAILED (${problems.length} problem${problems.length === 1 ? "" : "s"}):`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error("");
  console.error("The three portfolio surfaces are hand-synced lists with nothing connecting");
  console.error("them. See \"Portfolio surfaces\" in CWS-COMPONENT-REGISTRY.md.");
  process.exit(1);
}

console.log(
  `Portfolio audit passed: ${archiveKeys.length} archive item(s) + 1 flagship reconcile ` +
    `against ${showroomKeys.length} showroom item(s); ${heldBack.length} holdback(s) all resolve; ` +
    `${wantedFiles.size} capture(s) present.`
);
