// Markdown -> HTML for the essays surface. Ported from chadlewine's reader,
// stripped of the WordPress-migration shortcode/NBSP handling it carried (essays
// come from Google Docs "Copy as Markdown", which is clean). GFM is on so tables,
// strikethrough and autolinks from Google Docs survive. sanitize:false is safe:
// the only input is Chad's own hand-authored markdown, never user input.
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";

// GEO: headings need stable ids so a section can be linked and cited directly
// (/essays/x/#the-part-that-matters) instead of only the page as a whole. AI
// answer surfaces quote at section granularity, and an anchorless h2 gives them
// nothing to point at. Done as a post-process on the HTML string rather than
// with rehype-slug, to avoid three more dependencies for one regex.
const slugify = (text: string): string =>
  text
    .replace(/<[^>]+>/g, "") // inner markup (a bolded word in a heading)
    .replace(/&[a-z]+;|&#\d+;/gi, " ") // entities are word breaks, not letters
    .toLowerCase()
    .replace(/['‘’]/g, "") // don't let apostrophes become hyphens
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function addHeadingIds(source: string): string {
  // Two headings can slug identically ("The Cost" twice); -2, -3 keeps them
  // unique so the anchors stay addressable.
  const used = new Map<string, number>();
  return source.replace(
    /<(h[23])>([\s\S]*?)<\/\1>/g,
    (whole, tag: string, inner: string) => {
      const base = slugify(inner);
      if (!base) return whole;
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen + 1}`;
      return `<${tag} id="${id}">${inner}</${tag}>`;
    },
  );
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
  return addHeadingIds(result.toString());
}

// The prose as plain text, for the schema fields that want words rather than
// markup (abstract, articleBody). Strips markdown syntax and the embed tokens.
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\{\{\s*\w+\s*\}\}/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their text
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // heading markers
    .replace(/^\s{0,3}>\s?/gm, "") // blockquote markers
    .replace(/`{1,3}/g, "")
    .replace(/[*_]{1,3}/g, "")
    .replace(/\\([*_#>])/g, "$1") // escaped punctuation from Google Docs
    .replace(/\s+/g, " ")
    .trim();
}
