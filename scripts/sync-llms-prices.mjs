// llms.txt price sync -- rewrites every chadworks figure in public/llms.txt
// from the pricing hub, so the file the AI crawlers read can never quote a
// price the site itself has stopped charging.
//
// WHY A SCRIPT AND NOT AN IMPORT. public/llms.txt is a static asset copied to
// out/ verbatim. It is not compiled, so it cannot `import { BASE }` the way a
// page does, and it was the one surface the 2026-07-22 baseline move had to
// reach by hand. This closes that hole from the outside: the hub stays the
// single source, and the text file is regenerated against it every build.
//
// HOW IT MATCHES. Each rule anchors on the WORDS around a figure and matches
// the figure itself as a shape (PRICE below), never as a specific value. That
// means a rule keeps working after the number moves -- which is the whole
// point, since the number moving is the event this script exists for. It also
// means a rule that stops matching is a real signal: the sentence was reworded,
// and a reworded sentence needs a human to re-anchor it. Every rule is
// therefore REQUIRED to match, and a miss fails the build rather than silently
// leaving a stale price behind.
//
// Usage: node scripts/sync-llms-prices.mjs [--check]
//   default   rewrites public/llms.txt in place when a figure is stale
//   --check   exits 1 if it WOULD change anything, touching nothing (CI use)
// Wired into package.json as `prebuild`, alongside the essay sync.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LLMS_FILE = join("public", "llms.txt");
const CHECK_ONLY = process.argv.includes("--check");

// --- read the hub -----------------------------------------------------
// The constants are parsed out of the TypeScript rather than duplicated here,
// so this script cannot drift from the hub either. A missing constant is a
// hard error: silently skipping one would leave a stale price in the file.
function constants(file, names) {
  const src = readFileSync(join("src", "lib", file), "utf8");
  const out = {};
  for (const name of names) {
    const m = src.match(new RegExp(`export const ${name} = ([0-9.]+);`));
    if (!m) {
      console.error(`sync-llms-prices: no \`export const ${name}\` in src/lib/${file}.`);
      process.exit(1);
    }
    out[name] = Number(m[1]);
  }
  return out;
}

const { BASE } = constants("package-builder.ts", ["BASE"]);
const P = constants("pricing.ts", [
  "MINUTELY",
  "WORDPRESS_CARE",
  "TYPICAL_LOW",
  "TYPICAL_HIGH",
  "AUDIT",
  "ADS_MONTHLY",
  "ADS_MIN_DAILY_SPEND",
  "STATIC_HOSTING",
  "STATIC_HOSTING_NONPROFIT",
  "WP_HOST_TYPICAL",
  "WORKSPACE_SETUP",
  "WORKSPACE_EXTRA_MAILBOX",
  "WORKSPACE_MONTHLY",
]);

// Mirrors money() in package-builder.ts. Same locale, same grouping.
const money = (n) => `$${n.toLocaleString("en-US")}`;

const HOURLY = P.MINUTELY * 60;
const WP_HOST_SAVING = P.WP_HOST_TYPICAL - P.STATIC_HOSTING;

// --- the rules --------------------------------------------------------
// `#` marks where a figure goes in the pattern; it expands to the PRICE shape
// and the matching value is supplied positionally in `to`.
const PRICE = String.raw`\$[\d,]+(?:\.\d+)?`;

const RULES = [
  // Websites
  ["(# baseline, most land between # and #)",
    [money(BASE), money(P.TYPICAL_LOW), money(P.TYPICAL_HIGH)]],
  ["real maintenance (# every 6 months)", [money(P.WORDPRESS_CARE)]],
  // Visibility
  ["AI Visibility Audit (priced from #/hr)", [money(HOURLY)]],
  ["Flat # a month management; ad spend separate at the #-a-day OpenAI floor",
    [money(P.ADS_MONTHLY), money(P.ADS_MIN_DAILY_SPEND)]],
  // Industry
  ["Custom builds run # to #, quoted up front.",
    [money(P.TYPICAL_LOW), money(P.TYPICAL_HIGH)]],
  // Switch
  ["Static hosting is # a month (about # less than a typical WordPress host), # for non-profits.",
    [money(P.STATIC_HOSTING), money(WP_HOST_SAVING), money(P.STATIC_HOSTING_NONPROFIT)]],
  ["Google Workspace runs under # a month per user; chadworks sets it up for a flat # (training and signature included), # per additional mailbox.",
    [money(P.WORKSPACE_MONTHLY), money(P.WORKSPACE_SETUP), money(P.WORKSPACE_EXTRA_MAILBOX)]],
  ["hosted for # a month (# non-profit)",
    [money(P.STATIC_HOSTING), money(P.STATIC_HOSTING_NONPROFIT)], "all"],
  ["hosting is # a month (# non-profit)",
    [money(P.STATIC_HOSTING), money(P.STATIC_HOSTING_NONPROFIT)]],
  // About
  ["Work bills at #/hour; the smallest engagement is #; most websites land between # and #; WordPress care runs # every 6 months.",
    [money(HOURLY), money(BASE), money(P.TYPICAL_LOW), money(P.TYPICAL_HIGH), money(P.WORDPRESS_CARE)]],
  ["Posture: value-based pricing (#/hr, # baseline).", [money(HOURLY), money(BASE)]],
];

const source = readFileSync(LLMS_FILE, "utf8");
let next = source;
const unmatched = [];

for (const [shape, values, mode] of RULES) {
  // Escape the literal words, then expand each `#` into the price shape.
  const pattern = shape
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .split("#")
    .join(PRICE);
  const re = new RegExp(pattern, mode === "all" ? "g" : "");
  if (!re.test(next)) {
    unmatched.push(shape);
    continue;
  }
  re.lastIndex = 0;
  let i = 0;
  const replacement = shape.split("#").reduce((acc, part, idx) =>
    idx === 0 ? part : acc + values[i++] + part);
  next = next.replace(re, () => replacement);
}

if (unmatched.length) {
  console.error("sync-llms-prices: these price sentences no longer match public/llms.txt:");
  for (const u of unmatched) console.error(`  - ${u}`);
  console.error("The copy was reworded. Re-anchor the rule in scripts/sync-llms-prices.mjs.");
  process.exit(1);
}

if (next === source) {
  if (!CHECK_ONLY) console.log("sync-llms-prices: up to date.");
  process.exit(0);
}

if (CHECK_ONLY) {
  console.error(
    "sync-llms-prices: public/llms.txt holds a stale price. Run `node scripts/sync-llms-prices.mjs`.",
  );
  process.exit(1);
}

writeFileSync(LLMS_FILE, next);
console.log(`sync-llms-prices: rewrote ${RULES.length} price sentences from the hub.`);
