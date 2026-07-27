// /sitemap.xml -- hand-rolled route handler (not the Next `sitemap.ts` metadata
// convention) so we can attach a branded XSL stylesheet via <?xml-stylesheet?>.
// Statically exported into ./out at build time (output: 'export').
//
// LAUNCH CONTROL: the sitemap advertises exactly the launched routes (see
// launch.ts, the single source of truth). Everything else is noindex by default
// (layout.tsx) and simply absent here. Launch a page = add it to launch.ts.

import { SITE_URL } from "@/lib/service";
import { LAUNCHED_ROUTES, isLaunched, isIndexable } from "@/lib/launch";
import { getEssaySlugs } from "@/lib/essays";
import { getProjectPageSlugs } from "@/lib/project-pages";

export const dynamic = "force-static";

// Routes advertised to search engines right now (the launched set) plus, when
// the essays collection is launched, one entry per published essay (the [slug]
// pages are not in LAUNCHED_ROUTES individually -- they inherit the collection
// launch, so they are enumerated from the content dir here).
const essayRoutes = isLaunched("/essays/")
  ? getEssaySlugs().map((slug) => `/essays/${slug}/`)
  : [];
// Advertise only indexable routes: launched AND not noindex (legal pages are
// launched for the footer but excluded here -- see isIndexable in launch.ts).
// Project pages behave the same way: /showroom/<slug>/ is not listed in
// LAUNCHED_ROUTES individually, it inherits the /showroom/ launch, so the ones
// that exist are enumerated from the content dir. A project has a page because
// src/content/projects/<slug>.md exists (see lib/project-pages.ts).
const projectRoutes = isLaunched("/showroom/")
  ? getProjectPageSlugs().map((slug) => `/showroom/${slug}/`)
  : [];
const routes = [...LAUNCHED_ROUTES.filter(isIndexable), ...essayRoutes, ...projectRoutes];

export async function GET(): Promise<Response> {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = routes
    .map((path) => {
      const priority = path === "/" ? "1.0" : "0.8";
      return [
        "  <url>",
        `    <loc>${SITE_URL}${path}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "    <changefreq>monthly</changefreq>",
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
