// Stack-query audit -- keeps the calculator's stacked-layout breakpoint in sync.
//
// WHY THIS EXISTS. The condition that switches the cost calculator from the
// desktop row to the stacked (phone + tablet) layout is written in THREE places
// that have to agree, and cannot be a single shared constant: two are CSS
// `@media` rules (a CSS module and a global sheet) and one is a JS matchMedia
// string. CSS cannot import the JS value and the two sheets cannot import each
// other, so DRY is not available here. Edit one and forget the others and the
// failure is silent and split-brained: the layout stacks at a width where the
// header no longer tucks, or the pause button no longer hides. tsc and next
// build pass happily through all of it. This script is what holds the three
// together, the same way price-audit holds the pricing hub together.
//
// TO CHANGE THE BREAKPOINT: edit QUERY here AND all three files below to the new
// value, together, in one commit. That is the whole point -- this file is the
// checklist that makes "all three" unforgettable.
//
// Wired into deploy.sh beside index-audit.mjs and price-audit.mjs.

import { readFileSync, existsSync } from "node:fs";

// The canonical stacked-layout condition. Keep byte-identical to the three below.
const QUERY = "(pointer: coarse), (max-width: 900px)";

// A weaker fingerprint of the same rule: a file that carries this but NOT the
// full QUERY has almost certainly had its width edited in isolation, which is
// the exact desync this audit is for. Used only to sharpen the error message.
const PARTIAL = "(pointer: coarse)";

const CONSUMERS = [
  {
    file: "src/components/package-builder/package-builder.module.css",
    ctx: "the stacked-layout @media block",
  },
  {
    file: "src/components/package-builder/PackageBuilderStage.tsx",
    ctx: "MOBILE_Q (drives the header tuck + the open-panel park)",
  },
  {
    file: "src/styles/global.css",
    ctx: ".cw-motion-toggle--hide-mobile @media (pause button hidden on the stack)",
  },
];

const problems = [];
for (const { file, ctx } of CONSUMERS) {
  if (!existsSync(file)) {
    problems.push(`${file}: MISSING FILE (expected ${ctx})`);
    continue;
  }
  const src = readFileSync(file, "utf8");
  if (src.includes(QUERY)) continue; // in sync
  // Present-but-different beats absent for diagnosing: show the offending line.
  const near = src
    .split(/\r?\n/)
    .map((line, i) => ({ line: line.trim(), n: i + 1 }))
    .find((l) => l.line.includes(PARTIAL));
  problems.push(
    near
      ? `${file}:${near.n} has a DIFFERENT stacked-layout condition in ${ctx}\n` +
        `    found:  ${near.line.slice(0, 120)}\n` +
        `    expect: ${QUERY}`
      : `${file}: stacked-layout condition not found in ${ctx} (expected ${QUERY})`,
  );
}

if (problems.length) {
  console.error("stack-query-audit: the stacked-layout breakpoint is out of sync.\n");
  for (const p of problems) console.error("  " + p);
  console.error(
    `\nThe condition "${QUERY}" must be byte-identical in all three files.` +
    "\nTo change it, edit QUERY in scripts/stack-query-audit.mjs and all three files together.",
  );
  process.exit(1);
}

console.log(`stack-query-audit OK -- 3 files agree on "${QUERY}".`);
