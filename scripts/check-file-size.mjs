#!/usr/bin/env node
// ENFORCES THE 1 MB CEILING ON TRACKED FILES (Chad, 2026-08-11).
//
// Nothing over 1 MB goes to GitHub. Heavy media lives on disk and ships through
// deploy.sh, which tar-syncs the built `out/` rather than pulling from git, so
// a binary in the repo buys nothing and cannot be removed later without
// rewriting history.
//
// This checks what git TRACKS, not what is on disk: an ignored 6 MB clip in
// public/video/ is exactly the arrangement we want and must not fail the run.
//
// Usage:
//   node scripts/check-file-size.mjs          # fail over the limit
//   node scripts/check-file-size.mjs --list   # print the ten largest, always pass
//
// deploy.sh runs it in preflight, beside the price and index audits.

import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";

const LIMIT = 1024 * 1024; // 1 MB
const listOnly = process.argv.includes("--list");

const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const sized = [];
for (const f of tracked) {
  try {
    const { size } = statSync(f);
    sized.push({ f, size });
  } catch {
    // Tracked but absent from the working tree (a deleted-but-unstaged file).
    // Not this script's problem.
  }
}
sized.sort((a, b) => b.size - a.size);

const mb = (n) => (n / 1048576).toFixed(2) + " MB";

if (listOnly) {
  console.log("Ten largest tracked files:");
  for (const { f, size } of sized.slice(0, 10)) {
    console.log(`  ${mb(size).padStart(9)}  ${f}`);
  }
  process.exit(0);
}

const over = sized.filter((x) => x.size > LIMIT);
if (over.length === 0) {
  console.log(
    `file-size OK -- ${sized.length} tracked file(s), largest ${mb(sized[0]?.size ?? 0)}, limit ${mb(LIMIT)}.`
  );
  process.exit(0);
}

console.error(`file-size FAILED -- ${over.length} tracked file(s) over ${mb(LIMIT)}:\n`);
for (const { f, size } of over) console.error(`  ${mb(size).padStart(9)}  ${f}`);
console.error(`
Heavy media does not belong in the repo. Either:
  1. Add it to .gitignore, run \`git rm --cached <file>\`, and make sure it is
     restorable (for Pexels clips: log it in CWS-PEXELS-CLIP-LOG.md, which
     scripts/fetch-media.mjs reads), or
  2. Shrink it below the limit.

The file still deploys either way: deploy.sh tar-syncs the built out/, which
copies from public/ on this machine rather than from git.`);
process.exit(1);
