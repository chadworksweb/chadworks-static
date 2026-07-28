// Sitemap lastmod precompute -- resolves a real modification date per route and
// writes src/lib/lastmod.generated.ts.
//
// WHY A PREBUILD SCRIPT AND NOT A LOOKUP AT BUILD TIME. The first version of
// this did the git and fs work inside src/lib/lastmod.ts, which the sitemap
// routes import. Next's file tracer saw unbounded fs calls across src/ and gave
// up, tracing the whole project:
//
//   Encountered unexpected file in NFT list
//   ./next.config.ts -> ./src/lib/lastmod.ts -> ./src/lib/sitemap.ts
//
// Isolated rather than guessed: stubbing child_process still warned, and a pure
// lastmod.ts built clean, so the fs was the trigger. (lib/essays.ts reads the
// filesystem too and does NOT trigger it, because it is scoped to one static
// directory. This module needs dates from app/, content/ and lib/services/ at
// once, which is what reads as "the whole project".) Doing the work out here
// keeps the route graph pure.
//
// WHAT COUNTS AS A CHANGE. A route's own source only: its page.tsx, the Service
// data file that holds its copy, or its markdown. Edits to shared capsules,
// chrome, styles or the entity graph do NOT move any route's lastmod. This is
// deliberate. Bumping every URL because the footer changed is the same
// dishonesty as stamping them all with the build date, just slower.
//
// Usage: node scripts/build-lastmod.mjs [--check]
//   default   rewrites src/lib/lastmod.generated.ts when a date has moved
//   --check   exits 1 if it WOULD change anything, touching nothing (CI use)
// Wired into package.json as `prebuild`, ahead of the llms syncs.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";

const ROOT = process.cwd();
const OUT_FILE = join("src", "lib", "lastmod.generated.ts");
const CHECK_ONLY = process.argv.includes("--check");

// Not a lie: a file with no commit really is as new as this build.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * repo path -> YYYY-MM-DD of the newest commit touching it, from ONE git pass.
 * Per-file `git log` calls would be ~70 process spawns on Windows. git log
 * walks newest-first, so the first date seen for a path wins.
 *
 * "@@" marks a commit line (--format=@@%cs); every other non-blank line is a
 * path from that commit. A printable sentinel, so this file stays ASCII.
 */
function gitDates() {
  const dates = new Map();
  let out;
  try {
    out = execFileSync(
      "git",
      ["-c", "core.quotepath=false", "log", "--format=@@%cs", "--name-only"],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch {
    // No git, no history, or not a repo (a tarball build). Callers fall back.
    return dates;
  }
  let current = "";
  for (const line of out.split("\n")) {
    if (line.startsWith("@@")) {
      current = line.slice(2).trim();
    } else {
      const file = line.trim();
      if (file && current && !dates.has(file)) dates.set(file, current);
    }
  }
  return dates;
}

const DATES = gitDates();

/** git, then mtime, then nothing. relPath is repo-relative, forward-slashed. */
function fileDate(relPath) {
  const abs = join(ROOT, relPath.split("/").join(sep));
  if (!existsSync(abs)) return null;
  const committed = DATES.get(relPath);
  if (committed) return committed;
  try {
    return statSync(abs).mtime.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

// A Service page's page.tsx is a thin wrapper -- the copy lives in
// src/lib/services/<name>.tsx. Editing that prose never touches the route file,
// so the route would look frozen. Read the service module out of the page's own
// import list rather than maintaining a hand-written route -> service map.
const SERVICE_IMPORT_RE = /from\s+"@\/lib\/services\/([\w-]+)"/g;

function serviceSourcesFor(pageFile) {
  let src;
  try {
    src = readFileSync(join(ROOT, pageFile.split("/").join(sep)), "utf8");
  } catch {
    return [];
  }
  const files = [];
  for (const m of src.matchAll(SERVICE_IMPORT_RE)) {
    for (const ext of [".tsx", ".ts"]) {
      const candidate = `src/lib/services/${m[1]}${ext}`;
      if (existsSync(join(ROOT, candidate.split("/").join(sep)))) {
        files.push(candidate);
        break;
      }
    }
  }
  return files;
}

/** Every static app route: src/app/**\/page.tsx -> "/segment/". */
function appRoutes(dir = join("src", "app"), segments = []) {
  const routes = [];
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    // Dynamic segments have no single source date; their pages are enumerated
    // from the content dirs below instead.
    if (entry.isDirectory()) {
      if (entry.name.startsWith("[") || entry.name.startsWith("_")) continue;
      routes.push(...appRoutes(join(dir, entry.name), [...segments, entry.name]));
    } else if (entry.name === "page.tsx") {
      const pageFile = `${dir.split(sep).join("/")}/page.tsx`;
      routes.push({
        route: segments.length ? `/${segments.join("/")}/` : "/",
        sources: [pageFile, ...serviceSourcesFor(pageFile)],
      });
    }
  }
  return routes;
}

/** Content-backed routes: one per publishable markdown file. */
function contentRoutes(dirName, prefix) {
  const dir = join("src", "content", dirName);
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir))
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => ({
      route: `${prefix}${f.replace(/\.md$/, "")}/`,
      sources: [`src/content/${dirName}/${f}`],
    }));
}

const all = [
  ...appRoutes(),
  ...contentRoutes("essays", "/essays/"),
  ...contentRoutes("projects", "/showroom/"),
];

const entries = all
  .map(({ route, sources }) => {
    const dates = sources.map(fileDate).filter(Boolean);
    return dates.length ? [route, dates.reduce((a, b) => (a > b ? a : b))] : null;
  })
  .filter(Boolean)
  .sort((a, b) => a[0].localeCompare(b[0]));

const body = [
  "// GENERATED by scripts/build-lastmod.mjs. Do not edit by hand.",
  "//",
  "// Per-route modification dates for the sitemap, derived from git (falling back",
  "// to file mtime, then to the build date). Regenerated at prebuild. This file is",
  "// committed so `npm run dev` and a fresh clone both have dates before any build",
  "// has run.",
  "//",
  "// It exists as generated DATA, not as a lookup, so the sitemap routes can import",
  "// it without pulling filesystem access into the Next build graph -- see the",
  "// header of scripts/build-lastmod.mjs for what that cost the first time.",
  "",
  `export const BUILD_DATE = ${JSON.stringify(BUILD_DATE)};`,
  "",
  "export const ROUTE_DATES: Record<string, string> = {",
  ...entries.map(([route, date]) => `  ${JSON.stringify(route)}: ${JSON.stringify(date)},`),
  "};",
  "",
].join("\n");

const existing = existsSync(join(ROOT, OUT_FILE))
  ? readFileSync(join(ROOT, OUT_FILE), "utf8")
  : "";

// Compare on the ROUTE table only. BUILD_DATE moves every day, and rewriting the
// file daily for a constant nothing reads unless git is missing would make this
// look stale on every build.
const table = (text) => text.slice(text.indexOf("export const ROUTE_DATES"));
if (existing && table(existing) === table(body)) {
  if (!CHECK_ONLY) console.log(`build-lastmod: up to date (${entries.length} routes).`);
  process.exit(0);
}

if (CHECK_ONLY) {
  console.error(`build-lastmod: ${OUT_FILE} is stale. Run \`node scripts/build-lastmod.mjs\`.`);
  process.exit(1);
}

writeFileSync(join(ROOT, OUT_FILE), body);
console.log(`build-lastmod: wrote ${entries.length} route date(s).`);
