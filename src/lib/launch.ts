// LAUNCH CONTROL -- the single source of truth for what is publicly launched.
//
// A route listed in LAUNCHED is LIVE: indexed by search, in the sitemap, a lit
// footer link, and a bare (brand-only) header. A route NOT listed renders
// sealed: noindex (the layout default), out of the sitemap, and dimmed behind
// the footer "working on it" overlay.
//
// To launch a page: add its route (with a trailing slash) to LAUNCHED and run
// `bash deploy.sh`. That is the only edit. To pull one back: remove it.
//
// This replaces the old per-file sealing (SiteFooter `live` flags, SiteNav
// BARE_ROUTES, the sitemap HELD_FOR_RELAUNCH list, per-page robots overrides)
// and the separate sealed branch -- everything now reads from here.

const LAUNCHED = new Set<string>([
  "/", // homepage -- always live
  "/about/", // launched 2026-07-09 (rebuilt about page)
  "/contact/", // launched 2026-07-09 (contact CTA only)
  "/rates/", // launched 2026-07-09 (rates capsule + contact CTA)
  "/web-design/",
  "/web-development/", // launched 2026-07-11 (dev page: gem-reveal explainer + platform options)
  "/show-up-on-chatgpt/",
  "/advertising-on-chatgpt/",
  "/website-design-for-septic-services/",
  "/website-design-for-foundation-repair/",
  "/privacy-policy/", // launched with the GA4 + consent suite (2026-07-06)
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
