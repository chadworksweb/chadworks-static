// llms.txt price sync -- rewrites every chadworks figure in src/content/llms.source.txt
// from the pricing hub, so the file the AI crawlers read can never quote a
// price the site itself has stopped charging.
//
// WHY A SCRIPT AND NOT AN IMPORT. llms.txt is a plain text surface, not a
// compiled module, so it cannot `import { BASE }` the way a page does, and it
// was the one surface the 2026-07-22 baseline move had to reach by hand. This
// closes that hole from the outside: the hub stays the single source, and the
// text is regenerated against it every build.
//
// WHICH FILE. This writes the SOURCE (src/content/llms.source.txt), not the
// shipped public/llms.txt, which sync-llms-launch.mjs generates from it
// afterwards. Pricing sealed lines too is deliberate: a held-back page's figures
// stay current, so launching it never ships a stale price.
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
//   default   rewrites src/content/llms.source.txt in place when a figure is stale
//   --check   exits 1 if it WOULD change anything, touching nothing (CI use)
// Wired into package.json as `prebuild`, alongside the essay sync.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LLMS_FILE = join("src", "content", "llms.source.txt");
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
  "VISIBILITY_AUDIT",
  "ADS_MONTHLY",
  "ADS_MIN_DAILY_SPEND",
  "STATIC_HOSTING",
  "STATIC_HOSTING_NONPROFIT",
  "WP_HOST_TYPICAL",
  "WORKSPACE_SETUP",
  "WORKSPACE_EXTRA_MAILBOX",
  "WORKSPACE_MONTHLY_CEILING",
  "MAILCHIMP_FREE_CONTACTS",
]);

// Mirrors money() in package-builder.ts. Same locale, same grouping.
const money = (n) => `$${n.toLocaleString("en-US")}`;

const HOURLY = P.MINUTELY * 60;
const WP_HOST_SAVING = P.WP_HOST_TYPICAL - P.STATIC_HOSTING;

// --- the rules --------------------------------------------------------
// `#` marks where a figure goes in the pattern; it expands to the PRICE shape
// and the matching value is supplied positionally in `to`.
//
// `@` is the same idea for a BARE count, no dollar sign. Exactly one figure on
// the site prices a service without being a price: Mailchimp's free-tier
// contact limit. It moves like a price and is quoted like one, so it belongs on
// the same leash.
const PRICE = String.raw`\$[\d,]+(?:\.\d+)?`;
const COUNT = String.raw`[\d,]+`;

// ONE RULE, and that is the point (2026-07-26). There used to be twelve, one per
// price-carrying entry sentence in llms.txt. Those sentences are gone: every
// entry's sentence is now the page's own meta description, read from the built
// export by build-llms.mjs, and page metadata interpolates from the hub already
// (`${money(BASE)}`), with price-audit.mjs failing any build where it does not.
// So those eleven rules were guarding figures that a compiler now guards.
//
// What remains is the bare fact lines at the foot of the source, which have no
// page behind them and so no metadata to inherit. Today that is one line.
//
// If a rule here stops matching, the copy was reworded: re-anchor it, do not
// delete it. A deleted rule fails silent, which is the failure this whole script
// exists to prevent.
const RULES = [
  // The per-MINUTE rate, not the hourly one. /rates/ quotes the same figure the
  // same way, so a change to MINUTELY has to move both or they disagree in
  // public. HOURLY is derived from it (MINUTELY * 60) and is what the service
  // pages quote, which is why both spellings of one rate exist at all.
  ["Posture: chadworks charges #/min and starts flat rate projects at #.",
    [money(P.MINUTELY), money(BASE)]],
];

const source = readFileSync(LLMS_FILE, "utf8");
let next = source;
const unmatched = [];

for (const [shape, values, mode] of RULES) {
  // Escape the literal words, then expand each placeholder into its shape.
  const pattern = shape
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .split("#")
    .join(PRICE)
    .split("@")
    .join(COUNT);
  const re = new RegExp(pattern, mode === "all" ? "g" : "");
  if (!re.test(next)) {
    unmatched.push(shape);
    continue;
  }
  re.lastIndex = 0;
  let i = 0;
  const replacement = shape.split(/[#@]/).reduce((acc, part, idx) =>
    idx === 0 ? part : acc + values[i++] + part);
  next = next.replace(re, () => replacement);
}

if (unmatched.length) {
  console.error("sync-llms-prices: these price sentences no longer match src/content/llms.source.txt:");
  for (const u of unmatched) console.error(`  - ${u}`);
  console.error("The copy was reworded. Re-anchor the rule in scripts/sync-llms-prices.mjs.");
  process.exit(1);
}

// --- coverage: the question the rules alone cannot ask -----------------
// Every rule matching is only half the guarantee. It says the figures we KNOW
// about are current; it says nothing about a figure nobody wrote a rule for.
// Add a line to llms.txt quoting a price and, without this, it would sit there
// unmanaged forever while the script cheerfully reported "up to date".
//
// So: every line carrying a dollar figure must be claimed by some rule. The
// essay entries are the deliberate exception -- they are generated from essay
// frontmatter by sync-llms-essays.mjs, and the money in them is somebody
// else's (the $1,000-a-month agency retainer), not a chadworks price.
const claimed = RULES.map(([shape]) =>
  new RegExp(
    shape.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").split("#").join(PRICE).split("@").join(COUNT),
  ),
);
const isEssayEntry = (l) => /^-\s*\[.*\]\(\S*\/essays\/[^)]+\/\)/.test(l.trim());
const unclaimed = next
  .split(/\r?\n/)
  .filter((l) => /\$[0-9]/.test(l) && !isEssayEntry(l))
  .filter((l) => !claimed.some((re) => re.test(l)));

if (unclaimed.length) {
  console.error("sync-llms-prices: these lines in src/content/llms.source.txt quote a price no rule owns:");
  for (const l of unclaimed) console.error(`  ${l.slice(0, 140)}`);
  console.error(
    "\nA figure here is invisible to the pricing hub: llms.txt is a static asset,",
    "\nso it cannot import. Add a rule in this file anchored on the words around",
    "\nthe number, or remove the figure from the line.",
  );
  process.exit(1);
}

if (next === source) {
  if (!CHECK_ONLY) console.log("sync-llms-prices: up to date.");
  process.exit(0);
}

if (CHECK_ONLY) {
  console.error(
    "sync-llms-prices: src/content/llms.source.txt holds a stale price. Run `node scripts/sync-llms-prices.mjs`.",
  );
  process.exit(1);
}

writeFileSync(LLMS_FILE, next);
console.log(`sync-llms-prices: rewrote ${RULES.length} price sentences from the hub.`);
