// Markdown -> HTML for the essays surface. Ported from chadlewine's reader,
// stripped of the WordPress-migration shortcode/NBSP handling it carried (essays
// come from Google Docs "Copy as Markdown", which is clean). GFM is on so tables,
// strikethrough and autolinks from Google Docs survive. sanitize:false is safe:
// the only input is Chad's own hand-authored markdown, never user input.
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
  return result.toString();
}
