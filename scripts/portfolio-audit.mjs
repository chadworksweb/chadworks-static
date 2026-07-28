// Portfolio audit -- integrity of the project entity and the surfaces it feeds.
//
// WHY THIS EXISTS, AND WHAT CHANGED 2026-07-27.
//
// The work used to live in three hand-maintained lists that nothing connected:
// ARCHIVE/FEATURED/HELD_BACK in PortfolioShowcaseCapsule, SHOWROOM_ITEMS in
// showroom/showroom-data.ts, and a `portfolio:` block on Service objects. Adding
// a project to one and not the others was silent -- tsc, next build and every
// other gate passed -- and it landed three separate times. This script was built
// to CATCH that drift: rules A, B and C reconciled the lists against each other
// on every deploy.
//
// Those rules are GONE, because the drift is gone. The work now lives in ONE
// place, `src/lib/projects.ts`, and every surface is a projection of it. A
// project cannot be on the reel and missing from the grid, because neither is a
// list any more. Checking that they agree would be checking that a map() ran.
//
// What is left is the class of error the entity CANNOT rule out on its own:
//   F. Entity integrity. Duplicate keys, two flagships, a grid card with no grid
//      copy, two projects claiming the same archiveRank. Each one is quiet.
//   G. Architecture guard. The surfaces must stay DERIVED. If a hand-typed array
//      of projects reappears in the capsule or the showroom adapter, the
//      original defect is back, and this catches the moment it returns.
//   D. Every capture a project points at exists on disk, at the extension
//      lib/captures.ts will actually request (.webp unless excepted).
//   E. Dead ripple data. A page that overrides the `portfolio` slot can never
//      render its Service's `portfolio` block, so carrying one is dead weight
//      that reads as live.
//
// Orphaned captures (a file in public/portfolio no project points at) are
// reported as a NOTE only, never a failure. Deleting assets needs Chad's
// approval, and deploy.sh already excludes the JPG/PNG originals from the sync.
//
// It fails the deploy rather than the build, so `npm run dev` and a local
// `npm run build` stay fast. Wired into deploy.sh beside index-audit.mjs,
// price-audit.mjs and stack-query-audit.mjs.

import { readFileSync, existsSync, readdirSync } from "node:fs";

const PROJECTS_FILE = "src/lib/projects.ts";
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

// Split a sliced array body into its top-level `{ ... }` entries, so a field can
// be read PER PROJECT rather than as one flat stream. Flat was fine when this
// audit only needed a set of keys; it is not fine now that it has to know which
// rank belongs to which project.
function objectEntries(body) {
  const out = [];
  let depth = 0;
  let start = -1;
  let inStr = null;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inStr) {
      if (ch === "\\") i++;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === "{") {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) out.push(body.slice(start, i));
    }
  }
  return out;
}

function str(entry, field) {
  const m = new RegExp(`\\b${field}\\s*:\\s*["'\`]([^"'\`]*)["'\`]`).exec(entry);
  return m ? m[1] : null;
}
function num(entry, field) {
  const m = new RegExp(`\\b${field}\\s*:\\s*(-?\\d+)`).exec(entry);
  return m ? Number(m[1]) : null;
}
function bool(entry, field) {
  const m = new RegExp(`\\b${field}\\s*:\\s*(true|false)`).exec(entry);
  return m ? m[1] === "true" : null;
}
// A value wrapped onto the next line ("gridBlurb:\n  \"...\"") still counts as
// present, so prettier's wrapping cannot read as a missing field.
function has(entry, field) {
  return new RegExp(`\\b${field}\\s*:\\s*(["'\`]|\\r?\\n)`).test(entry);
}

// ---------------------------------------------------------------- parse

const projectsSrc = read(PROJECTS_FILE);
const projectsBody = sliceInitialiser(projectsSrc, "PROJECTS", "[", "]");

if (projectsSrc && projectsBody === null) {
  problems.push(
    `Could not find the PROJECTS array in ${PROJECTS_FILE}. Renamed or moved?\n` +
      `    Every portfolio surface is derived from it, so this audit can check nothing without it.`
  );
}

const projects = (projectsBody ? objectEntries(projectsBody) : []).map((e) => ({
  key: str(e, "key"),
  slug: str(e, "slug"),
  label: str(e, "label"),
  archiveRank: num(e, "archiveRank"),
  featured: bool(e, "featured") === true,
  hidden: bool(e, "hidden") === true,
  inShowcase: bool(e, "inShowcase") === true,
  hasGridBlurb: has(e, "gridBlurb"),
  hasReelBlurb: has(e, "reelBlurb"),
}));

if (projectsBody && projects.length === 0) {
  problems.push(`Parsed PROJECTS in ${PROJECTS_FILE} but found no entries. The shape changed; update this audit.`);
}

// ---------------------------------------------------------------- F: entity integrity

const seenKeys = new Set();
const seenRanks = new Map();

for (const p of projects) {
  const where = p.key ?? p.label ?? "(entry with no key)";

  if (!p.key) problems.push(`A project in ${PROJECTS_FILE} has no \`key\`. Every surface indexes on it.`);
  if (!p.slug) problems.push(`Project "${where}" has no \`slug\`, so its capture cannot resolve.`);
  if (!p.hasReelBlurb && !p.hidden)
    problems.push(`Project "${where}" has no \`reelBlurb\`, so it renders blank on /showroom/.`);

  if (p.key) {
    if (seenKeys.has(p.key)) {
      problems.push(
        `Duplicate key "${p.key}" in ${PROJECTS_FILE}.\n` +
          `    React keys collide, and the curated-grid filter matches both, so the piece renders twice.`
      );
    }
    seenKeys.add(p.key);
  }

  // KEY == SLUG. They drifted apart twice before this check existed
  // (risingcompass/rising-compass, russ-tree-service/russtree) and both times
  // it was silent: surfaces index on the key, files resolve from the slug, and
  // reaching for the wrong one simply finds nothing. When they disagree the
  // SLUG is right -- it builds the public URL and names the captures on disk.
  if (p.key && p.slug && p.key !== p.slug) {
    problems.push(
      `Project "${where}" has key "${p.key}" but slug "${p.slug}".\n` +
        `    These must match (Chad, 2026-07-28). The slug is the half with consequences -- it is\n` +
        `    the public URL and the capture filename -- so change the KEY to "${p.slug}", not the\n` +
        `    other way round. Renaming a slug means renaming /portfolio/${p.slug}-<device>.webp,\n` +
        `    /portfolio/wall/${p.slug}.jpg, any src/content/projects/${p.slug}.md, and adding a 301.`
    );
  }

  if (p.featured) {
    if (p.archiveRank !== null) {
      problems.push(
        `Flagship "${where}" carries an \`archiveRank\`.\n` +
          `    The flagship renders full-width instead of as a card, so a rank on it does nothing\n` +
          `    while reading as though it were in the grid. Remove it.`
      );
    }
    if (p.inShowcase) {
      problems.push(
        `Flagship "${where}" is marked \`inShowcase\`.\n` +
          `    It already renders above the grid; this would not add it, only mislead.`
      );
    }
    continue;
  }

  // A hidden project renders on NO surface (see `hidden` in lib/projects.ts), so
  // the grid-card requirements below do not apply to it. It still had to clear
  // the key/slug checks above and its capture is still verified in section D --
  // owning the capture is most of why a hidden project exists at all.
  if (p.hidden) {
    if (p.archiveRank !== null || p.inShowcase) {
      problems.push(
        `Hidden project "${where}" carries \`archiveRank\` or \`inShowcase\`.
` +
          `    Hidden means it renders on no surface, so grid placement on it is dead data
` +
          `    that reads as live. Drop the field, or drop \`hidden\`.`
      );
    }
    continue;
  }

  // Everything that is not the flagship renders as a grid card.
  if (!p.hasGridBlurb) {
    problems.push(
      `Project "${where}" has no \`gridBlurb\`, so its showcase card silently falls back to the short\n` +
        `    reel blurb, which is written for a piece moving past, not for a reader standing still.`
    );
  }
  if (p.archiveRank === null) {
    problems.push(
      `Project "${where}" has no \`archiveRank\`, so it sorts ahead of everything ranked and lands\n` +
        `    at the front of the archive grid. Give it a rank (they are sparse, multiples of ten).`
    );
  } else if (seenRanks.has(p.archiveRank)) {
    problems.push(
      `Duplicate archiveRank ${p.archiveRank}: "${seenRanks.get(p.archiveRank)}" and "${where}".\n` +
        `    Their grid order becomes whatever the sort happens to do, which is nobody's decision.`
    );
  } else {
    seenRanks.set(p.archiveRank, where);
  }
}

const flagships = projects.filter((p) => p.featured);
if (projects.length && flagships.length !== 1) {
  problems.push(
    flagships.length === 0
      ? `No project in ${PROJECTS_FILE} is marked \`featured\`. FEATURED_PROJECT falls back to the\n` +
        `    first entry, so the flagship becomes whatever happens to sit at the top of the reel.`
      : `${flagships.length} projects are marked \`featured\` (${flagships.map((p) => p.key).join(", ")}).\n` +
        `    Only the first is used; the rest silently render as grid cards instead.`
  );
}

if (projects.length && !projects.some((p) => p.inShowcase)) {
  problems.push(
    `No project is marked \`inShowcase\`, so the curated grid on the homepage and the service\n` +
      `    pages renders empty.`
  );
}

// ---------------------------------------------------------------- G: surfaces stay derived

// The point of the entity is that no surface holds its own copy of the work. A
// literal array of project objects reappearing in either surface file means the
// original defect is back. Detected by SHAPE (project fields inside a local
// array), not by constant name, so renaming it does not evade the check.
for (const [file, src] of [[CAPSULE, read(CAPSULE)], [SHOWROOM, read(SHOWROOM)]]) {
  if (!src) continue;
  // EVERY top-level array in the file, not a fixed list of names. A known-names
  // check is trivially evaded by calling the new list something else, which is
  // precisely what a person reintroducing one would do without meaning to.
  const declared = [...src.matchAll(/(?:export\s+)?const\s+(\w+)\s*(?::[^=]*)?=\s*\[/g)].map((m) => m[1]);
  for (const name of new Set(declared)) {
    const body = sliceInitialiser(src, name, "[", "]");
    if (!body) continue;
    const entryCount = objectEntries(body).filter((e) => /\bkey\s*:\s*["'`]/.test(e)).length;
    if (entryCount > 0) {
      problems.push(
        `${name} in ${file} is a hand-typed array of ${entryCount} project object(s) again.\n` +
          `    Every portfolio surface must be DERIVED from PROJECTS in ${PROJECTS_FILE}.\n` +
          `    A second list is how rslgo dropped off the reel: nothing connects the two copies.\n` +
          `    Map over PROJECTS (or a derived view) instead of restating the work here.`
      );
    }
  }
  if (!/@\/lib\/projects/.test(src)) {
    problems.push(
      `${file} no longer imports from @/lib/projects.\n` +
        `    It is a portfolio surface, so it must project the entity rather than hold its own data.`
    );
  }
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

const slugs = [...new Set(projects.map((p) => p.slug).filter(Boolean))];
const wantedFiles = new Set();
for (const slug of slugs) {
  const base = `${slug}-desktop`;
  wantedFiles.add(`${base}.${notConverted.get(base) ?? "webp"}`);
}

for (const file of [...wantedFiles].sort()) {
  if (!existsSync(`${PUBLIC_PORTFOLIO}/${file}`)) {
    problems.push(
      `Capture missing: ${PUBLIC_PORTFOLIO}/${file}\n` +
        `    A project points at this slug but the file it resolves to is not there, so the\n` +
        `    card renders a broken image. Encode the .webp, or add the slug to\n` +
        `    NOT_CONVERTED in ${CAPTURES} if it should keep serving its original.`
    );
  }
}

// ---------------------------------------------------------------- D2: orphan NOTE (never a failure)

if (existsSync(PUBLIC_PORTFOLIO)) {
  const onDisk = readdirSync(PUBLIC_PORTFOLIO).filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f));
  const referencedSlugs = new Set(slugs);
  const orphans = onDisk.filter((f) => {
    const slug = f.replace(/\.(webp|jpg|jpeg|png)$/i, "").replace(/-(desktop|tablet|mobile|phone)$/i, "");
    return !referencedSlugs.has(slug);
  });
  if (orphans.length) {
    notes.push(
      `${orphans.length} capture file(s) in ${PUBLIC_PORTFOLIO} are referenced by no project:\n` +
        orphans.map((f) => `      ${f}`).join("\n") +
        `\n    Not an error. Deleting assets needs Chad's approval, and deploy.sh already\n` +
        `    excludes ./portfolio/*.jpg and *.png from the sync, so the originals do not ship.`
    );
  }
}

// ---------------------------------------------------------------- E: dead ripple data

// A page that overrides the `portfolio` slot can never render its Service's
// `portfolio` block. Carrying one is dead data that reads as live -- exactly
// what web-development.tsx did until 2026-07-16b. These per-service blocks are
// deliberately NOT folded into the entity: they are curated per service page.
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
  console.error("The portfolio is ONE entity (src/lib/projects.ts) with derived surfaces.");
  console.error("See \"Portfolio surfaces\" in CWS-COMPONENT-REGISTRY.md.");
  process.exit(1);
}

const showcaseCount = projects.filter((p) => p.inShowcase).length;
// Hidden projects render on no surface, so they are counted OUT of the card
// total rather than into it -- a summary that folded them in would overstate
// what the site actually shows, which is the class of quiet wrongness this
// script exists to catch.
const hiddenCount = projects.filter((p) => p.hidden).length;
const cardCount = projects.length - hiddenCount - 1;
console.log(
  `Portfolio audit passed: ${projects.length} project(s) = 1 flagship + ${cardCount} archive ` +
    `card(s), ${showcaseCount} of them in the curated grid` +
    (hiddenCount ? `, plus ${hiddenCount} hidden (on no surface)` : "") +
    `; keys and ranks unique; both surfaces derived; ${wantedFiles.size} capture(s) present.`
);
