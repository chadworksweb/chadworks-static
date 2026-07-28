// SITEMAP -- the route sets and the XML builders behind /sitemap.xml and its
// three children.
//
// SHAPE (the Yoast shape): /sitemap.xml is a <sitemapindex>, not a page list.
// It names one child per content type:
//
//   /page-sitemap.xml     the launched, indexable routes (launch.ts)
//   /essay-sitemap.xml    one per published essay
//   /project-sitemap.xml  one per /showroom/<slug>/ project page
//
// WHY SPLIT AT 21 URLS. Not for crawling -- Google's ceiling is 50,000 per
// sitemap and discovery is identical either way. It is for REPORTING: GSC's
// Sitemaps report breaks indexation down per submitted sitemap, so essays and
// project pages can be watched separately from service pages instead of as one
// blended number. That is the whole payoff, and it is the reason to keep the
// children split even while one of them holds a single URL.
//
// LAUNCH CONTROL is unchanged: the sitemap advertises exactly the launched,
// indexable routes (launch.ts is the single source of truth). Everything else is
// noindex by default (layout.tsx) and simply absent here.
//
// SERVER ONLY -- pulls in lib/lastmod (node:child_process) and the fs-backed
// content readers. Only the four sitemap route handlers import this.

import { SITE_URL } from "@/lib/service";
import { LAUNCHED_ROUTES, isLaunched, isIndexable } from "@/lib/launch";
import { getEssaySlugs } from "@/lib/essays";
import { getProjectPageSlugs } from "@/lib/project-pages";
import { lastmodFor, newestLastmod } from "@/lib/lastmod";

/** Launched, indexable routes. Legal pages are launched but not indexable. */
export function pageRoutes(): string[] {
  return LAUNCHED_ROUTES.filter(isIndexable);
}

/**
 * One route per published essay. The [slug] pages are not listed in
 * LAUNCHED_ROUTES individually -- they inherit the collection's launch, so they
 * are enumerated from the content dir.
 */
export function essayRoutes(): string[] {
  if (!isLaunched("/essays/")) return [];
  return getEssaySlugs().map((slug) => `/essays/${slug}/`);
}

/** Same inheritance rule for project pages: the markdown file IS the flag. */
export function projectRoutes(): string[] {
  if (!isLaunched("/showroom/")) return [];
  return getProjectPageSlugs().map((slug) => `/showroom/${slug}/`);
}

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>';
const XSL = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
const NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

/** A child sitemap: one <url> per route, with a git-derived lastmod. */
export function urlsetXml(routes: string[]): string {
  const urls = routes.map((path) => {
    const priority = path === "/" ? "1.0" : "0.8";
    return [
      "  <url>",
      `    <loc>${SITE_URL}${path}</loc>`,
      `    <lastmod>${lastmodFor(path)}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  });

  return [XML_HEAD, XSL, `<urlset xmlns="${NS}">`, ...urls, "</urlset>", ""].join("\n");
}

/**
 * The index. A child with no routes is OMITTED rather than listed empty -- an
 * index pointing at a zero-URL sitemap is a GSC warning for no reason.
 */
export function sitemapIndexXml(
  children: Array<{ file: string; routes: string[] }>,
): string {
  const entries = children
    .filter((c) => c.routes.length > 0)
    .map((c) =>
      [
        "  <sitemap>",
        `    <loc>${SITE_URL}/${c.file}</loc>`,
        `    <lastmod>${newestLastmod(c.routes)}</lastmod>`,
        "  </sitemap>",
      ].join("\n"),
    );

  return [XML_HEAD, XSL, `<sitemapindex xmlns="${NS}">`, ...entries, "</sitemapindex>", ""].join(
    "\n",
  );
}

/** One place both the index and the child routes agree on the filenames. */
export const SITEMAP_CHILDREN = [
  { file: "page-sitemap.xml", routes: pageRoutes },
  { file: "essay-sitemap.xml", routes: essayRoutes },
  { file: "project-sitemap.xml", routes: projectRoutes },
] as const;

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
