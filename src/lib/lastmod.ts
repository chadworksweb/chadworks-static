// SITEMAP LASTMOD -- a real per-route modification date, derived from git.
//
// WHAT THIS REPLACES. The sitemap used to stamp every URL with `new Date()`, so
// all 21 routes claimed to change on whatever day the site was last deployed.
// Google measures lastmod against what it finds when it recrawls, and discounts
// the signal once it learns the dates are not real. A sitemap that says
// "everything changed today" every single deploy is worse than no lastmod.
//
// WHAT COUNTS AS A CHANGE. A route's own source only: its page.tsx, the Service
// data file that holds its copy, or its markdown. Edits to shared capsules,
// chrome, styles or the entity graph do NOT move any route's lastmod. This is
// deliberate. Bumping 21 URLs because the footer changed is the same dishonesty
// as new Date(), just slower.
//
// SERVER ONLY. Imports node:child_process and node:fs, so this must never be
// pulled into a client bundle -- same constraint as lib/project-pages.ts. Only
// the four sitemap route handlers import it.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// The build date, used only when git cannot answer. Not a lie: a file with no
// commit really is as new as this build.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * repo path -> YYYY-MM-DD of the newest commit touching it, from ONE git pass.
 * Per-file `git log` calls would be ~70 process spawns per build on Windows.
 * Because git log walks newest-first, the first date seen for a path wins.
 */
function buildGitDates(): Map<string, string> {
  const dates = new Map<string, string>();
  let out: string;
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

  // "@@" marks a commit line (--format=@@%cs); every other non-blank line is a
  // path from that commit. A printable sentinel, so this file stays ASCII.
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

let gitDates: Map<string, string> | null = null;

/** Newest commit date for a repo-relative path, or null when git has nothing. */
function commitDate(relPath: string): string | null {
  if (gitDates === null) gitDates = buildGitDates();
  return gitDates.get(relPath.split(path.sep).join("/")) ?? null;
}

/** Filesystem mtime, the fallback when git has no record of a file. */
function mtimeDate(relPath: string): string | null {
  try {
    return fs.statSync(path.join(ROOT, relPath)).mtime.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

/** Best known date for one file: git, then mtime, then nothing. */
function fileDate(relPath: string): string | null {
  if (!fs.existsSync(path.join(ROOT, relPath))) return null;
  return commitDate(relPath) ?? mtimeDate(relPath);
}

// A Service page's page.tsx is a thin wrapper -- the copy lives in
// src/lib/services/<name>.tsx. Editing that prose never touches the route file,
// so the route would look frozen. Pull the service module out of the page's own
// import list rather than maintaining a hand-written route -> service map.
const SERVICE_IMPORT_RE = /from\s+"@\/lib\/services\/([\w-]+)"/g;

function serviceSourcesFor(pageFile: string): string[] {
  let src: string;
  try {
    src = fs.readFileSync(path.join(ROOT, pageFile), "utf8");
  } catch {
    return [];
  }
  const files: string[] = [];
  for (const m of src.matchAll(SERVICE_IMPORT_RE)) {
    for (const ext of [".tsx", ".ts"]) {
      const candidate = `src/lib/services/${m[1]}${ext}`;
      if (fs.existsSync(path.join(ROOT, candidate))) {
        files.push(candidate);
        break;
      }
    }
  }
  return files;
}

/** The source files whose edits legitimately change what a route says. */
function sourcesFor(route: string): string[] {
  const essay = route.match(/^\/essays\/([^/]+)\/$/);
  if (essay) return [`src/content/essays/${essay[1]}.md`];

  const project = route.match(/^\/showroom\/([^/]+)\/$/);
  if (project) return [`src/content/projects/${project[1]}.md`];

  const segments = route.split("/").filter(Boolean);
  const pageFile = segments.length
    ? `src/app/${segments.join("/")}/page.tsx`
    : "src/app/page.tsx";
  return [pageFile, ...serviceSourcesFor(pageFile)];
}

/**
 * lastmod for one route: the newest date across its own sources. Falls back to
 * the build date only when nothing about the route can be dated at all.
 */
export function lastmodFor(route: string): string {
  const dates = sourcesFor(route)
    .map(fileDate)
    .filter((d): d is string => Boolean(d));
  if (!dates.length) return BUILD_DATE;
  return dates.reduce((a, b) => (a > b ? a : b));
}

/** The newest lastmod in a set of routes -- the index entry for a child sitemap. */
export function newestLastmod(routes: string[]): string {
  if (!routes.length) return BUILD_DATE;
  return routes.map(lastmodFor).reduce((a, b) => (a > b ? a : b));
}
