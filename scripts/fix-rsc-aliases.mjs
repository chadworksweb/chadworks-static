// RSC prefetch aliases -- makes Next's own prefetch requests resolve on a static host.
//
// THE BUG. `output: export` writes each route's RSC payload as a NESTED PATH:
//
//   out/privacy-policy/__next.privacy-policy/__PAGE__.txt
//
// but the client asks for the same thing with the separator FLATTENED TO A DOT:
//
//   GET /privacy-policy/__next.privacy-policy.__PAGE__.txt?_rsc=... -> 404
//
// Confirmed on prod (chadworks.co), not a local-server artifact: the dotted form
// 404s and the slashed form 200s. So every route prefetch on the site fails, on
// every page, for every visitor. Navigation still works because it falls back to
// a full document load -- which is exactly the cost prefetching exists to avoid.
//
// THE FIX. Walk the export, and for every file inside a `__next.*` directory,
// write a sibling whose name is that relative path with "/" replaced by ".".
// Single-segment routes reduce to the form observed in the browser:
//
//   __next.privacy-policy/__PAGE__.txt  ->  __next.privacy-policy.__PAGE__.txt
//   __next.switch/leave-wordpress/__PAGE__.txt
//                                       ->  __next.switch.leave-wordpress.__PAGE__.txt
//
// ADDITIVE ONLY. Nothing is moved or deleted, so the nested files keep working
// and this stays harmless if a future Next release changes the naming: the
// aliases simply stop being requested.
//
// Usage: node scripts/fix-rsc-aliases.mjs [outDir]   (default: out)
// Wired into package.json as `postbuild`, after build-llms.

import { readdirSync, existsSync, copyFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const OUT = process.argv[2] || "out";

if (!existsSync(OUT)) {
  console.error(`fix-rsc-aliases: no build found at ${OUT}/ -- run npm run build first.`);
  process.exit(1);
}

const PREFIX = "__next.";

/** Every file under `dir`, as paths relative to `dir`, forward-slashed. */
function filesUnder(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...filesUnder(full).map((p) => `${entry.name}/${p}`));
    } else {
      found.push(entry.name);
    }
  }
  return found;
}

let written = 0;
let skipped = 0;

/**
 * Walk every directory in the export. Wherever a `__next.*` DIRECTORY sits,
 * flatten its contents into dotted siblings alongside it.
 */
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith(PREFIX)) {
      for (const rel of filesUnder(full)) {
        // "__next.privacy-policy" + "/" + "__PAGE__.txt" -> "__next.privacy-policy.__PAGE__.txt"
        const alias = join(dir, `${entry.name}.${rel.split("/").join(".")}`);
        const src = join(full, rel.split("/").join(sep));
        if (existsSync(alias) && statSync(alias).mtimeMs >= statSync(src).mtimeMs) {
          skipped++;
          continue;
        }
        copyFileSync(src, alias);
        written++;
      }
      // A `__next.*` tree contains only payloads; no nested route dirs to visit.
      continue;
    }
    walk(full);
  }
}

walk(OUT);

console.log(
  `fix-rsc-aliases: ${written} prefetch alias(es) written${skipped ? `, ${skipped} already current` : ""}.`,
);
