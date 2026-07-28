// llms.txt project sync -- regenerates the `## Showroom` section of
// src/content/llms.source.txt from src/content/projects/*.md, so a published
// project page is never invisible to the LLM crawlers just because somebody
// forgot to add a line by hand.
//
// WHY THIS EXISTS. /showroom/<slug>/ pages inherit the /showroom/ launch rather
// than being listed in LAUNCHED_ROUTES individually, so the sitemap picks them
// up automatically but llms.source.txt did not. build-llms then FAILED the
// deploy on coverage ("launched route with no llms.txt entry"), and the only fix
// was a hand-written line. That happened on the first project page (Rising
// Compass, 2026-07-27) and would have happened on every one after it. This is
// the essay sync's counterpart: scripts/sync-llms-essays.mjs, same shape.
//
// The rest of the source stays hand-written. Only the Showroom section is
// generated, and only the per-project entries inside it -- the section's lead
// line (the one pointing at /showroom/ itself) is preserved as authored.
//
// Usage: node scripts/sync-llms-projects.mjs [--check]
//   default   rewrites src/content/llms.source.txt in place when the section is stale
//   --check   exits 1 if it WOULD change anything, touching nothing (CI use)
// Wired into package.json as `prebuild`, alongside the essay and price syncs.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = join("src", "content", "projects");
const PROJECTS_TS = join("src", "lib", "projects.ts");
const LLMS_FILE = join("src", "content", "llms.source.txt");
const SITE_URL = "https://chadworks.co";
const HEADING = "## Showroom";
const CHECK_ONLY = process.argv.includes("--check");

// slug -> label, read out of the Project entity.
//
// WHY PARSE RATHER THAN IMPORT: projects.ts is TypeScript and this is a plain
// .mjs run by node before the build, so there is no import path to it. Chunking
// on `key:` bounds each project, which makes the slug/label lookups inside a
// chunk order-independent -- the one thing a flat file-wide regex would get
// wrong the first time somebody writes label above slug.
function projectLabels() {
  const src = readFileSync(PROJECTS_TS, "utf8");
  const labels = new Map();
  for (const chunk of src.split(/\bkey:\s*"/).slice(1)) {
    const slug = chunk.match(/\bslug:\s*"([^"]+)"/);
    const label = chunk.match(/\blabel:\s*"([^"]+)"/);
    if (slug && label) labels.set(slug[1], label[1]);
  }
  return labels;
}

// The SAME publish rules as src/lib/project-pages.ts, which decides what
// /showroom/<slug>/ actually builds. These must agree: a project listed here
// with no page ships a broken link, and a page missing here fails build-llms.
//   - no _-prefixed files (the template)
//   - the slug must match a real project, or the page has no capture and
//     nowhere in the room to be linked from
//   - an empty body is a stub somebody started, not a published page
function publishedProjects() {
  if (!existsSync(PROJECTS_DIR)) return [];
  const labels = projectLabels();
  return readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const label = labels.get(slug);
      if (!label) return null;
      const { data, content } = matter(readFileSync(join(PROJECTS_DIR, file), "utf8"));
      if (!content.trim()) return null;
      // The frontmatter title is optional and falls back to the project's own
      // label, exactly as the page does.
      const title = (data.title ?? "").toString().trim() || label;
      const date =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : (data.date ?? "").toString().trim();
      return { slug, title, date };
    })
    .filter(Boolean)
    // Newest first, like the essays. Undated entries sort last, then by title,
    // so the order never depends on readdir.
    .sort((a, b) => {
      if (a.date !== b.date) return a.date && b.date ? (a.date < b.date ? 1 : -1) : a.date ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
}

// Label and URL only. The SENTENCE comes from the project page's own meta
// description at postbuild (see build-llms.mjs), so writing one here would be
// dead text: silently discarded, with no error to say why.
const entryLine = (p) => `- [${p.title}](${SITE_URL}/showroom/${p.slug}/)`;

const source = readFileSync(LLMS_FILE, "utf8");
// The checkout is CRLF on this machine and LF elsewhere. Split and rejoin on
// whatever the file already uses, so the script never rewrites every line as a
// line-ending change.
const EOL = source.includes("\r\n") ? "\r\n" : "\n";
const lines = source.split(EOL);

const start = lines.findIndex((l) => l.trim() === HEADING);
if (start === -1) {
  console.error(`sync-llms-projects: no \`${HEADING}\` heading in ${LLMS_FILE}.`);
  process.exit(1);
}
// The section runs to the next top-level heading, or to end of file.
let end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
if (end === -1) end = lines.length;

const section = lines.slice(start + 1, end);
// A per-project entry is any list item pointing at a project DETAIL url. The
// lead line links /showroom/ itself, which has nothing after the slash, so this
// leaves it (and any prose) untouched.
const isEntry = (l) => /^-\s*\[.*\]\(\S*\/showroom\/[^)]+\/\)/.test(l.trim());
const kept = section.filter((l) => !isEntry(l));
// Drop trailing blank lines so the entries butt up against the lead line
// instead of inheriting the gap the removed entries left behind.
while (kept.length && kept[kept.length - 1].trim() === "") kept.pop();

const projects = publishedProjects();
const rebuilt = [...kept, ...projects.map(entryLine), ""];

const next = [...lines.slice(0, start + 1), ...rebuilt, ...lines.slice(end)].join(EOL);

if (next === source) {
  if (!CHECK_ONLY) console.log("sync-llms-projects: up to date.");
  process.exit(0);
}

if (CHECK_ONLY) {
  console.error(
    `sync-llms-projects: ${LLMS_FILE} is stale. Run \`node scripts/sync-llms-projects.mjs\`.`,
  );
  process.exit(1);
}

writeFileSync(LLMS_FILE, next);
console.log(
  `sync-llms-projects: rewrote the Showroom section (${projects.length} project page(s)).`,
);
