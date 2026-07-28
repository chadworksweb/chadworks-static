// /sitemap.xml -- the sitemap INDEX. Hand-rolled route handler (not the Next
// `sitemap.ts` metadata convention) so we can attach the branded XSL stylesheet
// via <?xml-stylesheet?>. Statically exported into ./out at build time.
//
// This file lists SITEMAPS, not pages. The pages live in the three children --
// see src/lib/sitemap.ts for the shape and the reasoning, and note that
// scripts/lib/sitemap-urls.mjs is what every build script must use to read
// through this index to the actual URLs.
//
// robots.txt still points here (src/app/robots.ts): an index is what a
// `Sitemap:` line is supposed to name.

import { SITEMAP_CHILDREN, sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return xmlResponse(
    sitemapIndexXml(SITEMAP_CHILDREN.map((c) => ({ file: c.file, routes: c.routes() }))),
  );
}
