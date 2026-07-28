// Read every PAGE url out of a built export's sitemap.
//
// WHY THIS EXISTS. /sitemap.xml is a <sitemapindex> (Yoast shape: an index plus
// one child per content type), so the <loc> elements in the root file are
// SITEMAPS, not pages. Three consumers -- index-audit, build-llms and
// indexnow-submit -- each used to regex <loc> out of sitemap.xml directly, which
// against an index yields the child sitemap URLs and silently turns 21 pages
// into 3. Every one of them now comes through here instead.
//
// Still works if the root ever goes back to a flat <urlset>: the index branch is
// only taken when the root actually is one.

import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/**
 * Every page URL advertised by the build, de-duplicated and in document order.
 * Returns null when the root sitemap is missing, so each caller keeps its own
 * wording for that failure. Throws when the index names a child that did not
 * export -- a broken index is a deploy-blocking bug, not something to skip past.
 */
export function readSitemapUrls(outDir = "out") {
  const rootPath = join(outDir, "sitemap.xml");
  if (!existsSync(rootPath)) return null;

  const rootXml = readFileSync(rootPath, "utf8");
  if (!rootXml.includes("<sitemapindex")) return [...new Set(locs(rootXml))];

  const urls = [];
  for (const child of locs(rootXml)) {
    const file = join(outDir, basename(new URL(child).pathname));
    if (!existsSync(file)) {
      throw new Error(
        `sitemap index lists ${child} but ${file} did not export -- the child route is missing.`,
      );
    }
    urls.push(...locs(readFileSync(file, "utf8")));
  }
  return [...new Set(urls)];
}

/** The same set as site-root-relative paths ("/" for home). */
export function readSitemapPaths(outDir = "out", siteUrl = "https://chadworks.co") {
  const urls = readSitemapUrls(outDir);
  if (urls === null) return null;
  return new Set(urls.map((u) => u.replace(siteUrl, "") || "/"));
}
