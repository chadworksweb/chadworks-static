// PROJECT PAGES -- the optional narrative behind a Project.
//
// Every portfolio piece is a Project (src/lib/projects.ts). NOT every project
// gets a page of its own. What decides it is simply whether a markdown file
// exists: `src/content/projects/<slug>.md` makes /showroom/<slug>/ a real page,
// and its absence means the project is showroom-only. There is no `hasPage`
// flag to keep in step with anything, because the file IS the flag.
//
// Same content model as /essays/ (see lib/essays.ts): plain markdown read at
// BUILD time, no DB, no CMS. chadworks is output:'export'.
//
// WHY THIS IS A SEPARATE MODULE FROM projects.ts. `projects.ts` is imported by
// showroom-data.ts, which is imported by PortfolioShowroom -- a "use client"
// component. An `fs` import anywhere in that chain breaks the client bundle. So
// the entity stays pure data and everything that touches the filesystem lives
// here, where only server components reach it.
//
// AUTHORING: copy `_TEMPLATE.md`, name it `<slug>.md` where the slug matches a
// project's `slug` in projects.ts, and write. Files beginning with "_" are
// ignored, and so is a file whose slug matches no project (that would otherwise
// publish a page the room cannot link to).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHtml, markdownToPlainText } from "@/lib/markdown";
import { PROJECTS, type Project } from "@/lib/projects";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

export type ProjectPageMeta = {
  slug: string;
  title: string; // frontmatter `title:`, falling back to the project's label
  dek: string;
  description?: string;
  date?: string; // ISO, YYYY-MM-DD
  updated?: string; // ISO; drives dateModified + the visible freshness line
  wordCount: number;
};

export type ProjectPage = ProjectPageMeta & {
  project: Project;
  bodyHtml: string;
  bodyText: string;
};

function projectFiles(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

/**
 * Slugs that have BOTH a markdown file and a matching project. A file with no
 * project behind it is skipped rather than published: the page would have no
 * capture, no live link and nowhere in the room to be linked from.
 */
export function getProjectPageSlugs(): string[] {
  const known = new Set(PROJECTS.map((p) => p.slug));
  return projectFiles()
    .map((f) => f.replace(/\.md$/, ""))
    .filter((slug) => known.has(slug));
}

/** Does this project have a page of its own? Used to decide whether to link it. */
export function hasProjectPage(slug: string): boolean {
  return getProjectPageSlugs().includes(slug);
}

function readMeta(slug: string): { meta: ProjectPageMeta; content: string } | null {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return null;
  const file = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  // YAML turns an unquoted `date: 2026-07-27` into a JS Date whose toString() is
  // a full timestamp. Normalize to a bare YYYY-MM-DD either way -- the same trap
  // lib/essays.ts already hit.
  const toIsoDate = (raw: unknown): string =>
    raw instanceof Date ? raw.toISOString().slice(0, 10) : (raw ?? "").toString().trim();

  const wordCount = content
    .replace(/<!--[\s\S]*?-->/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  // A file with no body is a stub someone started; do not publish it. The title
  // falls back to the project's own label, so a page never needs to restate it.
  if (!content.trim()) return null;

  return {
    meta: {
      slug,
      title: (data.title ?? "").toString().trim() || project.label,
      dek: (data.dek ?? "").toString().trim(),
      description: data.description ? data.description.toString().trim() : undefined,
      date: toIsoDate(data.date) || undefined,
      updated: toIsoDate(data.updated) || undefined,
      wordCount,
    },
    content,
  };
}

/** Index data for every project that has a page: metadata only. */
export function getAllProjectPages(): ProjectPageMeta[] {
  return getProjectPageSlugs()
    .map((slug) => readMeta(slug)?.meta)
    .filter((m): m is ProjectPageMeta => Boolean(m));
}

/** Detail data: the project, its metadata, and the rendered body. */
export async function getProjectPage(slug: string): Promise<ProjectPage | null> {
  const read = readMeta(slug);
  if (!read) return null;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return null;
  const bodyHtml = await markdownToHtml(read.content);
  return {
    ...read.meta,
    project,
    bodyHtml,
    bodyText: markdownToPlainText(read.content),
  };
}
