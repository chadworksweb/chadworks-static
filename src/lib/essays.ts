// ESSAYS -- the static content layer for /essays/ (CWS-EXPANSION-PLAN-01 item N).
//
// This is the SEAM that replaces chadlewine's Supabase `lib/entries`: same idea
// (one collection, kind-scoped reading surface), but the source is plain markdown
// files on disk, read at BUILD time. chadworks is output:'export', so there is no
// DB and no request-time data -- every essay is baked into the static HTML.
//
// AUTHORING: one file per essay in src/content/essays/<slug>.md. Frontmatter =
// title, date (YYYY-MM-DD), dek, optional description. Body = markdown pasted from
// Google Docs ("Copy as Markdown"). The filename IS the URL. Files beginning with
// "_" (e.g. _TEMPLATE.md) are ignored. See _TEMPLATE.md in that folder.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHtml, markdownToPlainText } from "@/lib/markdown";

const ESSAYS_DIR = path.join(process.cwd(), "src", "content", "essays");

// The house placeholder for an essay with no featured image of its own: the CW
// gemstone mark over a static cloud field (public/essays/placeholder.svg, a
// self-contained SVG -- the mark is embedded, nothing external to fetch).
export const ESSAY_PLACEHOLDER_IMAGE = "/essays/placeholder.svg";
export const ESSAY_PLACEHOLDER_ALT =
  'chadworks "CW" gemstone on lavender and white clouds';

export type EssayMeta = {
  slug: string;
  title: string;
  date: string; // ISO date, YYYY-MM-DD
  updated?: string; // ISO date; drives dateModified + the visible freshness line
  dek: string;
  description?: string;
  image?: string; // featured image path under /public (rendered at 1200x630)
  imageAlt?: string;
  topics?: string[]; // frontmatter `topics:`; becomes schema keywords + about
  section?: string; // frontmatter `section:`; becomes articleSection
  wordCount: number; // computed from the markdown body, for Article.wordCount
  // GEO: the essay's claims as standalone sentences (frontmatter `takeaways:`).
  // Rendered as a visible block AND fed to the schema, because answer engines
  // quote self-contained assertions, not paragraphs that need their context.
  takeaways?: string[];
};

export type Essay = EssayMeta & {
  bodyHtml: string;
  bodyText: string; // plain prose, for the schema's abstract + articleBody
};

// Every publishable essay file: *.md, minus the _-prefixed template/drafts.
function essayFiles(): string[] {
  if (!fs.existsSync(ESSAYS_DIR)) return [];
  return fs
    .readdirSync(ESSAYS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

export function getEssaySlugs(): string[] {
  return essayFiles().map((f) => f.replace(/\.md$/, ""));
}

function readMeta(slug: string): { meta: EssayMeta; content: string } | null {
  const file = path.join(ESSAYS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const title = (data.title ?? "").toString().trim();
  // A file with no title is a draft; do not surface it.
  if (!title) return null;
  // YAML parses an unquoted `date: 2026-07-15` into a JS Date, whose toString()
  // is a full timestamp ("Wed Jul 15 2026 20:00:00 GMT..."). Normalize to a bare
  // YYYY-MM-DD string either way -- the date only, never a time.
  const toIsoDate = (raw: unknown): string =>
    raw instanceof Date
      ? raw.toISOString().slice(0, 10)
      : (raw ?? "").toString().trim();
  const date = toIsoDate(data.date);
  const updated = toIsoDate(data.updated) || undefined;
  // Word count off the markdown source, minus the embed tokens and any HTML
  // comment scaffolding, so Article.wordCount reflects the prose a reader gets.
  const wordCount = content
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\{\{\s*\w+\s*\}\}/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const toStringList = (raw: unknown): string[] | undefined => {
    if (!Array.isArray(raw)) return undefined;
    const list = raw
      .map((t: unknown) => t?.toString().trim())
      .filter((t): t is string => Boolean(t));
    return list.length ? list : undefined;
  };
  const topics = toStringList(data.topics);
  const takeaways = toStringList(data.takeaways);
  const meta: EssayMeta = {
    slug,
    title,
    date,
    updated,
    wordCount,
    topics,
    takeaways,
    section: data.section ? data.section.toString().trim() : undefined,
    dek: (data.dek ?? "").toString().trim(),
    description: data.description ? data.description.toString().trim() : undefined,
    // No `image:` in the frontmatter falls back to the house placeholder (the
    // CW gemstone over the cloud field), so a card is never art-less.
    image: data.image ? data.image.toString().trim() : ESSAY_PLACEHOLDER_IMAGE,
    imageAlt: data.imageAlt
      ? data.imageAlt.toString().trim()
      : data.image
        ? undefined
        : ESSAY_PLACEHOLDER_ALT,
  };
  return { meta, content };
}

// Index data: metadata only, newest first. Titleless/draft files are skipped.
export function getAllEssays(): EssayMeta[] {
  return getEssaySlugs()
    .map((slug) => readMeta(slug)?.meta)
    .filter((m): m is EssayMeta => Boolean(m))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Detail data: metadata + rendered HTML body. Null when the slug is missing or
// the file is a draft (no title).
export async function getEssay(slug: string): Promise<Essay | null> {
  const read = readMeta(slug);
  if (!read) return null;
  const bodyHtml = await markdownToHtml(read.content);
  return { ...read.meta, bodyHtml, bodyText: markdownToPlainText(read.content) };
}
