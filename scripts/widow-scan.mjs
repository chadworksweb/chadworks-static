// Widow scanner (CWS rule 12) -- loads a page at 1920w in the cached chromium
// and flags any text block whose last visual line is < 20% of its widest line.
// Usage: node scripts/widow-scan.mjs http://localhost:PORT/path/ [more urls...]
import { chromium } from "playwright-core";

const EXE =
  "C:/Users/chad/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe";
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
