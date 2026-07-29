// LAUNCH CONTROL -- the single source of truth for what is publicly launched.
//
// A route listed in LAUNCHED is LIVE: indexed by search, in the sitemap, a lit
// footer link, and a bare (brand-only) header. A route NOT listed renders
// sealed: noindex (the layout default), out of the sitemap, and dimmed behind
// the footer "working on it" overlay.
//
// TO LAUNCH A PAGE -- both steps, every time:
//   1. Add the route (with a trailing slash) to LAUNCHED below.
//   2. In that page's `export const metadata`, make sure the robots line reads
//      `robots: { index: isLaunched(PAGE_PATH), follow: true },`
//      Step 2 is NOT optional. layout.tsx defaults every route to
//      `index: false`, so a page listed here but missing its robots line lands
//      in the sitemap while serving noindex -- which is precisely how /about/,
//      /contact/ and /rates/ ended up in GSC "Excluded by 'noindex'" (fixed
//      2026-07-18). Never hardcode `index: true`; always gate on isLaunched so
//      pulling a route back here actually seals the page.
// To pull one back: remove the route. The gated robots line follows it.
//
// `bash deploy.sh` runs scripts/index-audit.mjs against the built export and
// refuses to ship if the two steps disagree. Run it locally after any launch
// change: `npm run build && node scripts/index-audit.mjs`.
//
// This replaces the old per-file sealing (SiteFooter `live` flags, SiteNav
// BARE_ROUTES, the sitemap HELD_FOR_RELAUNCH list) and the separate sealed
// branch -- the launched SET now reads from here, and per-page robots lines
// derive from it rather than being maintained independently.

const LAUNCHED = new Set<string>([
  "/", // homepage -- always live
  "/about/", // launched 2026-07-09 (rebuilt about page)
  "/contact/", // launched 2026-07-09 (contact CTA only)
  "/rates/", // launched 2026-07-09 (rates capsule + contact CTA)
  "/showroom/", // launched 2026-07-15 -- the portfolio, renamed. /portfolio/ 301s here
                // (deploy/chadworks.conf) and is never itself launched or linked.
  "/are-we-a-good-fit/", // launched 2026-07-16 -- the qualification room
                         // (CWS-EXPANSION-PLAN-01 item D). This one line also lights
                         // the footer's Company link and the FitCapsule cross-link on
                         // the homepage/about/service pages; both are isLaunched-gated.
  "/websites/", // launched 2026-07-13 (websites lane hub: live Web Design/Dev lanes, rest coming soon)
  "/web-design/",
  "/web-development/", // launched 2026-07-11 (dev page: gem-reveal explainer + platform options)
  "/show-up-on-chatgpt/",
  "/advertising-on-chatgpt/",
  "/industries-served/", // launched 2026-07-13 (industry hub -- de-orphans septic + foundation)
  "/website-design-for-septic-services/",
  "/website-design-for-foundation-repair/",
  "/privacy-policy/", // launched with the GA4 + consent suite (2026-07-06)
  "/terms-of-service/", // launched 2026-07-23 -- rewritten as SITE terms (visitor
                        // rules, scraping/AI-training limits, disclaimers, PA
                        // disputes) on the anchored legal-doc layout. The old
                        // draft was a client services agreement and never shipped.
  "/faqs/", // launched 2026-07-17 -- FAQ page (FAQPage JSON-LD, four themed groups)
  "/essays/", // launched 2026-07-17 -- the essays surface (CWS-EXPANSION-PLAN-01
              // item N: authority is published, not case-studied). This lights the
              // footer's Essays link; individual essays inherit the launch and are
              // added to the sitemap from the content dir (see sitemap.xml/route).
              // LIVE ON PROD 2026-07-18 with the first essay ("Is Your Agency
              // Ripping You Off?"). This also flips <GoingToBat /> from the
              // inline email thread to the teaser capsule everywhere it runs.
  "/website-design-cost-calculator/", // launched 2026-07-20 -- the scope calculator (tool intent)
  "/visibility/", // launched 2026-07-29 -- the visibility hub. AI visibility is the
                  // umbrella; SEO, presence and email are the lanes underneath.
  "/ai-search-visibility/", // launched 2026-07-29 -- the service page under the hub above.
                            // Neither of these two carried a robots line before launch,
                            // which is the exact failure the note at the top of this file
                            // describes: in the sitemap, serving noindex. Both gained one
                            // in the same commit as this edit.
  // "/how-much-does-a-website-cost/" -- SEALED 2026-07-24. Pulled back from launch
  // (was launched 2026-07-20). robots line gates on isLaunched, so it follows.
]);

// Launched for navigation but deliberately kept OUT of search: reachable and
// footer-linked (isLaunched is true), yet noindex and absent from the sitemap.
// Legal pages live here -- users must be able to reach them, but they should not
// compete in search. A route here MUST also be in LAUNCHED (so the footer lights
// it); isIndexable is what gates robots + sitemap.
const NOINDEX = new Set<string>([
  "/privacy-policy/", // noindex 2026-07-24 -- legal page, footer-linked, not searched
  "/terms-of-service/", // noindex 2026-07-24 -- legal page, footer-linked, not searched
]);

// Normalize any path to the canonical "/segment/" form ("/" for home), tolerant
// of a missing/extra slash, a hash, or a query string.
function norm(path: string): string {
  const p = path.trim().replace(/[#?].*$/, "").replace(/^\/+|\/+$/g, "");
  return p === "" ? "/" : `/${p}/`;
}

export function isLaunched(path: string): boolean {
  return LAUNCHED.has(norm(path));
}

// True only when a route should be advertised to search: launched AND not in the
// noindex set. Use this for a page's `robots.index` and for sitemap inclusion.
// (isLaunched still drives nav/footer visibility, so noindex legals stay linked.)
export function isIndexable(path: string): boolean {
  const p = norm(path);
  return LAUNCHED.has(p) && !NOINDEX.has(p);
}

// The launched routes, in declaration order -- used by the sitemap.
export const LAUNCHED_ROUTES: string[] = [...LAUNCHED];
