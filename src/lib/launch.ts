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
  "/faqs/", // launched 2026-07-17 -- FAQ page (FAQPage JSON-LD, four themed groups)
  "/essays/", // launched 2026-07-17 -- the essays surface (CWS-EXPANSION-PLAN-01
              // item N: authority is published, not case-studied). This lights the
              // footer's Essays link; individual essays inherit the launch and are
              // added to the sitemap from the content dir (see sitemap.xml/route).
              // LIVE ON PROD 2026-07-18 with the first essay ("Is Your Agency
              // Ripping You Off?"). This also flips <GoingToBat /> from the
              // inline email thread to the teaser capsule everywhere it runs.
  "/website-design-cost-calculator/", // launched 2026-07-20 -- the scope calculator (tool intent)
  "/how-much-does-a-website-cost/", // launched 2026-07-20 -- the cost guide (informational intent).
                                    // Launch WITH the calculator so their cross-links resolve.
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

// The launched routes, in declaration order -- used by the sitemap.
export const LAUNCHED_ROUTES: string[] = [...LAUNCHED];
