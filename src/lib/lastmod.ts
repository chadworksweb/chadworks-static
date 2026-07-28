// SITEMAP LASTMOD -- a real per-route modification date.
//
// WHAT THIS REPLACES. The sitemap used to stamp every URL with `new Date()`, so
// all 21 routes claimed to change on whatever day the site was last deployed.
// Google measures lastmod against what it finds when it recrawls, and discounts
// the signal once it learns the dates are not real. A sitemap that says
// "everything changed today" every single deploy is worse than no lastmod.
//
// PURE ON PURPOSE. The dates are computed at PREBUILD by
// scripts/build-lastmod.mjs and land in lastmod.generated.ts. Nothing here
// touches the filesystem or spawns git, because doing that inside a module the
// sitemap routes import made Next's file tracer trace the whole project
// ("Encountered unexpected file in NFT list"). Keep this file a lookup.
//
// See scripts/build-lastmod.mjs for what counts as a change to a route: its own
// source only, never shared capsules or chrome.

import { ROUTE_DATES, BUILD_DATE } from "@/lib/lastmod.generated";

/**
 * lastmod for one route. Falls back to the build date for anything the
 * generator did not date -- a brand new route on a tree with no git history.
 */
export function lastmodFor(route: string): string {
  return ROUTE_DATES[route] ?? BUILD_DATE;
}

/** The newest lastmod in a set of routes -- the index entry for a child sitemap. */
export function newestLastmod(routes: string[]): string {
  if (!routes.length) return BUILD_DATE;
  return routes.map(lastmodFor).reduce((a, b) => (a > b ? a : b));
}
