// llms.txt essay sync -- regenerates the `## Essays` section of src/content/llms.source.txt
// from the markdown files, so a published essay is never invisible to the LLM
// crawlers just because somebody forgot to add a line by hand.
//
// The rest of the source stays hand-written: it describes services, and no script
// can write those lines. Only the Essays section is generated, and only the
// per-essay entries inside it -- the section's own lead line (the one pointing
// at /essays/ itself) is preserved exactly as authored.
//
// Each essay's sentence comes from, in order: `llmsSummary:` in the frontmatter
// (write one when the essay deserves a richer line than its meta description),
// then `description:`, then `dek:`. So a new essay always lands with something
// accurate even if nobody writes anything extra.
//
// Usage: node scripts/sync-llms-essays.mjs [--check]
//   default   rewrites src/content/llms.source.txt in place when the section is stale
//   --check   exits 1 if it WOULD change anything, touching nothing (CI use)
// Wired into package.json as `prebuild`, so `npm run build` keeps it current.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const ESSAYS_DIR = join("src", "content", "essays");
const LLMS_FILE = join("src", "content", "llms.source.txt");
const SITE_URL = "https://chadworks.co";
const CHECK_ONLY = process.argv.includes("--check");

// Same publish rules as src/lib/essays.ts: no _-prefixed files (template and
// drafts), and a file with no title is a draft no matter what it is named.
// Kept in sync by hand; these two rules have not moved since the surface
// launched, and the build would surface a mismatch as a missing page.
function publishedEssays() {
  return readdirSync(ESSAYS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const { data } = matter(readFileSync(join(ESSAYS_DIR, file), "utf8"));
      const title = (data.title ?? "").toString().trim();
      if (!title) return null;
      // YAML turns an unquoted date into a Date; normalize for sorting only.
      const date =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : (data.date ?? "").toString().trim();
      return { slug: file.replace(/\.md$/, ""), title, date };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Label and URL only. The SENTENCE comes from the essay page's own meta
// description at postbuild (see build-llms.mjs), so writing one here would be
// dead text: silently discarded, with no error to say why. The `llmsSummary`
// frontmatter key is likewise unused now -- an essay's description is its
// description, in one place.
const entryLine = (essay) => `- [${essay.title}](${SITE_URL}/essays/${essay.slug}/)`;

const source = readFileSync(LLMS_FILE, "utf8");
// The checkout is CRLF on this machine and LF elsewhere. Split and rejoin on
// whatever the file already uses, so the script never rewrites every line of
// llms.txt as a line-ending change.
const EOL = source.includes("\r\n") ? "\r\n" : "\n";
const lines = source.split(EOL);

const start = lines.findIndex((l) => l.trim() === "## Essays");
if (start === -1) {
  console.error("sync-llms-essays: no `## Essays` heading in src/content/llms.source.txt.");
  process.exit(1);
}
// The section runs to the next top-level heading, or to end of file.
let end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
if (end === -1) end = lines.length;

const section = lines.slice(start + 1, end);
// A per-essay entry is any list item pointing at an essay DETAIL url. The lead
// line links /essays/ itself, so this leaves it (and any prose) untouched.
const isEntry = (l) => /^-\s*\[.*\]\(\S*\/essays\/[^)]+\/\)/.test(l.trim());
const kept = section.filter((l) => !isEntry(l));
// Drop trailing blank lines so the entries butt up against the lead line
// instead of inheriting the gap the removed entries left behind.
while (kept.length && kept[kept.length - 1].trim() === "") kept.pop();

// Rebuild: whatever was not an entry (lead line, blank lines), then the
// generated entries, then one blank line before the next section.
const rebuilt = [...kept, ...publishedEssays().map(entryLine), ""];

const next = [...lines.slice(0, start + 1), ...rebuilt, ...lines.slice(end)].join(
  EOL,
);

if (next === source) {
  if (!CHECK_ONLY) console.log("sync-llms-essays: up to date.");
  process.exit(0);
}

if (CHECK_ONLY) {
  console.error(
    "sync-llms-essays: src/content/llms.source.txt is stale. Run `node scripts/sync-llms-essays.mjs`.",
  );
  process.exit(1);
}

writeFileSync(LLMS_FILE, next);
console.log(
  `sync-llms-essays: rewrote the Essays section (${publishedEssays().length} essays).`,
);
