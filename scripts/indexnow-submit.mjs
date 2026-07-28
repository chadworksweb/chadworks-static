// IndexNow submission -- enters the Copilot contest.
//
// Copilot answers off the Bing index. A site that is not in that index is not
// in that contest, no matter how clean its HTML is. IndexNow is the push
// channel: instead of waiting for bingbot to re-crawl, we tell Bing (and Yandex,
// Naver, Seznam, which share the protocol) which URLs changed, on every deploy.
//
// No account, no verification, no API dashboard. Ownership is proved by serving
// the key back at a known path: public/<key>.txt contains the key, verbatim.
// That file MUST stay in public/ or every submission is rejected as unowned.
//
// Source of truth is out/sitemap.xml, which src/lib/launch.ts already filters to
// launched routes only. So a sealed page can never be submitted here -- one more
// reason not to hand-maintain a second URL list.
//
// Run: node scripts/indexnow-submit.mjs [--dry]
// Wired into deploy.sh, PROD ONLY (staging serves X-Robots-Tag: noindex, so
// pushing those URLs at an index would be asking it to crawl a noindex site).
//
// Non-fatal by design: a deploy whose files already synced must not fail because
// an index endpoint was having a bad afternoon. Every exit path here is code 0.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readSitemapUrls } from "./lib/sitemap-urls.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const HOST = "chadworks.co";
const KEY = "9a2c8fb4d33ac90937104c8d0efed966";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

// IndexNow caps a single submission at 10,000 URLs. The sitemap is nowhere near
// that and the launch gate keeps it small, but a silent truncation would be the
// exact kind of quiet coverage cap the GEO checklist bans, so it is logged.
const MAX_URLS = 10000;

const dry = process.argv.includes("--dry");

// PAGE urls, read through the index to the child sitemaps. Submitting the raw
// <loc> list from sitemap.xml would push the child SITEMAP files at IndexNow as
// if they were pages (see scripts/lib/sitemap-urls.mjs).
function pageUrls() {
  const urls = readSitemapUrls(resolve(ROOT, "out"));
  if (urls === null) return null;
  return urls.filter((u) => u.startsWith(`https://${HOST}/`));
}

async function main() {
  let urlList;
  try {
    urlList = pageUrls();
  } catch (err) {
    console.log(`  IndexNow skipped: ${err.message}`);
    return;
  }
  if (urlList === null) {
    console.log("  IndexNow skipped: out/sitemap.xml not found (build first).");
    return;
  }

  if (urlList.length === 0) {
    console.log("  IndexNow skipped: sitemap has no chadworks.co URLs.");
    return;
  }

  // Guard the ownership file. Submitting without it serving the key back is a
  // rejected batch that still reports 200-ish at the transport layer, so the
  // failure would otherwise be invisible.
  try {
    const served = readFileSync(resolve(ROOT, `out/${KEY}.txt`), "utf8").trim();
    if (served !== KEY) {
      console.log(`  IndexNow skipped: out/${KEY}.txt does not contain the key.`);
      return;
    }
  } catch {
    console.log(`  IndexNow skipped: out/${KEY}.txt is missing from the build.`);
    return;
  }

  if (urlList.length > MAX_URLS) {
    console.log(`  IndexNow: ${urlList.length} URLs exceeds the ${MAX_URLS} cap; submitting the first ${MAX_URLS}.`);
    urlList = urlList.slice(0, MAX_URLS);
  }

  if (dry) {
    console.log(`  IndexNow (dry run): would submit ${urlList.length} URL(s) to ${ENDPOINT}`);
    for (const u of urlList) console.log(`    ${u}`);
    return;
  }

  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
      signal: AbortSignal.timeout(15000),
    });
    // 200 accepted, 202 accepted pending key validation. Both are wins.
    if (res.status === 200 || res.status === 202) {
      console.log(`  IndexNow: ${urlList.length} URL(s) submitted (HTTP ${res.status}).`);
    } else {
      const text = await res.text().catch(() => "");
      console.log(`  IndexNow: endpoint returned HTTP ${res.status}. ${text.slice(0, 200)}`);
      console.log("  Not fatal. The sitemap still carries these URLs for the next crawl.");
    }
  } catch (err) {
    console.log(`  IndexNow: submission failed (${err.message}). Not fatal.`);
  }
}

await main();
