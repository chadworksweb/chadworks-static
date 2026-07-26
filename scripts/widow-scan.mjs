// Widow scanner (CWS rule 12) -- loads a page at 1920w in the cached chromium
// and flags any text block whose last visual line is < 20% of its widest line.
// Usage: node scripts/widow-scan.mjs http://localhost:PORT/path/ [more urls...]
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

// The chromium build number used to be pinned here (chromium-1223), and it
// rotted: the cache moved on, the path stopped existing, and the scanner died
// on launch with an error that reads like the tool is broken rather than the
// constant being stale. So find the browser instead of naming it. Newest build
// in the cache wins; WIDOW_CHROME overrides, PLAYWRIGHT_BROWSERS_PATH is
// honoured for a relocated cache.
function resolveChrome() {
  if (process.env.WIDOW_CHROME) return process.env.WIDOW_CHROME;
  const localAppData =
    process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || "", "AppData", "Local");
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(localAppData, "ms-playwright");
  const builds = existsSync(root)
    ? readdirSync(root)
        .filter((d) => /^chromium-\d+$/.test(d))
        .sort((a, b) => Number(b.slice(9)) - Number(a.slice(9)))
    : [];
  for (const build of builds) {
    for (const exe of ["chrome-win64/chrome.exe", "chrome-linux/chrome", "chrome-mac/chrome"]) {
      const full = path.join(root, build, exe);
      if (existsSync(full)) return full;
    }
  }
  console.error(`No cached chromium found under ${root}.`);
  console.error("Install one with `npx playwright install chromium`, or point");
  console.error("WIDOW_CHROME at a chrome binary.");
  process.exit(1);
}

const EXE = resolveChrome();
const urls = process.argv.slice(2);

const SEL = [
  "p", "dd", "li",
  ".svc-statement__text", ".svc-step__body", ".svc-nextstep__body",
  ".svc-cta__body", ".svc-lede", ".svc-lane__desc", ".svc-pricing__copy",
  ".svc-pricing__disclaimer", ".svc-faq__lead", ".svc-acc__a p",
  ".rates-ledger__note", ".rates-ledger__label", ".svc-qual__list li",
  ".cw-faq-group__lead",
].join(", ");

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

let total = 0;
for (const url of urls) {
  await page.goto(url, { waitUntil: "networkidle" });
  const flags = await page.evaluate((sel) => {
    const out = [];
    document.querySelectorAll(sel).forEach((el) => {
      const txt = (el.textContent || "").trim();
      if (txt.split(/\s+/).length < 4) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((r) => r.width > 1);
      if (rects.length < 2) return;
      const maxW = Math.max(...rects.map((r) => r.width));
      const last = rects[rects.length - 1];
      if (last.width < maxW * 0.2) {
        out.push({
          pct: Math.round((last.width / maxW) * 100),
          text: txt.slice(-72),
        });
      }
    });
    return out;
  }, SEL);
  total += flags.length;
  console.log(`\n=== ${url} === ${flags.length} widow(s)`);
  for (const f of flags) console.log(`  [${f.pct}%] ...${f.text}`);
}
await browser.close();
console.log(`\nTOTAL: ${total}`);
process.exit(total > 0 ? 1 : 0);
