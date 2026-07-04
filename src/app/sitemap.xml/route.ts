// /sitemap.xml -- hand-rolled route handler (not the Next `sitemap.ts` metadata
// convention) so we can attach a branded XSL stylesheet via <?xml-stylesheet?>.
// Statically exported into ./out at build time (output: 'export').
//
// STAGED RELAUNCH: only the homepage is advertised to search right now. Every
// other route is noindex by default (see layout.tsx) and held out below. To
// relaunch a page: move its slug from HELD_FOR_RELAUNCH into `routes` AND add
// `robots: { index: true, follow: true }` to that page's metadata.

import { SITE_URL } from "@/lib/service";

export const dynamic = "force-static";

// Routes advertised to search engines right now.
const routes = [
  "/", // home
];

// Pulled from search during the staged relaunch. Kept here so bringing a page
// back is a one-line move into `routes` (plus the per-page robots override).
const HELD_FOR_RELAUNCH = [
  // Lane hubs
  "/websites/",
  "/visibility/",
  // Websites services
  "/web-development/",
  "/web-design/",
  "/web-design-packages/",
  "/wordpress/",
  "/custom-coded-static/",
  "/ecommerce/",
  "/shopify/",
  // Visibility services
  "/ai-viz/",
  "/ai-visibility-audit/",
  "/seo/",
  "/digital-marketing/",
  "/email-marketing/",
  // ChatGPT ports (own flat pages at their old URLs)
  "/show-up-on-chatgpt/",
  "/advertising-on-chatgpt/",
  // Standalone pages
  "/about/",
  "/rates/",
  "/faqs/",
  "/contact/",
  // Situation pages
  "/build-your-vision/",
  "/switch/leave-wordpress/",
  "/switch/gmail-to-workspace/",
  "/switch/squarespace-to-static/",
  "/switch/wix-to-static/",
  "/switch/godaddy-to-static/",
  // Industry web design
  "/my-industry-specialties/",
  "/website-design-for-septic-services/",
  "/website-design-for-foundation-repair/",
  "/website-design-for-tree-companies/",
  "/website-design-for-bands-musicians/",
  "/web-design-for-authors/",
  "/music-industry-web-design/",
  "/web-design-for-pa-preferred-members/",
  // Local PA web design
  "/my-service-areas/",
  "/website-design-for-norristown-pa/",
  "/website-design-for-ambler-pa/",
  "/website-design-for-lansdale-pa/",
  "/website-design-for-conshohocken-pa/",
  "/website-design-for-doylestown-pa/",
  "/website-design-for-lancaster-pa/",
  "/website-design-for-pottstown-pa/",
  "/website-design-for-collegeville-pa/",
  "/website-design-for-phoenixville-pa/",
  // Portfolio
  "/portfolio/",
  // Legal
  "/terms-of-service/",
  "/privacy-policy/",
];
void HELD_FOR_RELAUNCH;

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
