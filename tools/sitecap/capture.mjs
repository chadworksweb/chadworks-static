// sitecap -- portfolio capture rig for live client sites.
//
//   node tools/sitecap/capture.mjs ocp            # record
//   node tools/sitecap/capture.mjs ocp --recon    # measure, no recording
//   node tools/sitecap/capture.mjs ocp --framing  # one still, framed as the take will be
//
// Forked from tools/democap/capture.mjs. Same capture surface (real Chrome +
// getDisplayMedia + MediaRecorder, window sized rather than viewport, drawn
// cursor), different target: a live public site walked end to end instead of a
// single-page demo.
//
// What changes versus democap:
//   - The target is remote, so there is no local server and no byte-range
//     concern. Network variance instead becomes the pacing risk, so navigations
//     are beats that WAIT for their landing selector rather than fixed sleeps.
//   - The site is a Next.js App Router app. Every in-take navigation is a
//     client-side transition, so the injected kit survives; ensureKit() re-injects
//     anyway in case a link ever hard-navigates.
//   - Nothing is submitted. The paywall's checkout button is clicked because a
//     logged-out POST /api/checkout returns 401 and the app routes to /signup on
//     its own -- no Stripe session is ever created.
//
// Output: 1920x1080 h264 30fps mp4 in Dropbox/ChadWorks/portfolio videos/.

import { chromium } from "playwright-core";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import os from "node:os";

const run = promisify(execFile);

const OUT_DIR = "C:/Users/chad/Dropbox/ChadWorks/portfolio videos";
const TMP = path.join(os.tmpdir(), "sitecap");
const W = 1920;
const H = 1080;
const FPS = 30;

// ---------------------------------------------------------------------------
// in-page kit: drawn cursor, eased scrolling, click ripples
// ---------------------------------------------------------------------------
const KIT = () => {
  if (window.__sitecap) return;
  const ns = (window.__sitecap = {});
  const cur = document.createElement("div");
  cur.id = "__sitecap_cursor";
  cur.innerHTML = `
    <svg width="26" height="34" viewBox="0 0 26 34">
      <path d="M2 1 L2 27 L8.5 20.5 L12.5 30 L17 28 L13 18.5 L22 18.5 Z"
            fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>
    <span class="__ring"></span>`;
  const css = document.createElement("style");
  css.textContent = `
    #__sitecap_cursor{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;
      will-change:transform;filter:drop-shadow(0 2px 4px rgba(0,0,0,.45));opacity:0;
      transition:opacity .25s ease}
    #__sitecap_cursor.on{opacity:1}
    #__sitecap_cursor .__ring{position:absolute;left:1px;top:1px;width:12px;height:12px;
      border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.5);
      transform:translate(-50%,-50%) scale(0);opacity:0}
    #__sitecap_cursor.__click .__ring{animation:__scring .42s ease-out}
    @keyframes __scring{0%{transform:translate(-50%,-50%) scale(.2);opacity:.95}
      100%{transform:translate(-50%,-50%) scale(3.4);opacity:0}}`;
  document.head.appendChild(css);
  document.body.appendChild(cur);

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight * 0.62;
  const put = () => (cur.style.transform = `translate(${cx}px, ${cy}px)`);
  put();

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  ns.show = () => cur.classList.add("on");
  ns.hide = () => cur.classList.remove("on");
  ns.at = () => [cx, cy];

  ns.moveTo = (x, y, ms) =>
    new Promise((done) => {
      const x0 = cx;
      const y0 = cy;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        const e = ease(p);
        cx = x0 + (x - x0) * e;
        cy = y0 + (y - y0) * e;
        put();
        p < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });

  ns.ripple = () => {
    cur.classList.remove("__click");
    void cur.offsetWidth;
    cur.classList.add("__click");
  };

  // Eased scroll of the document. Used instead of behavior:'smooth' so the
  // duration is ours and reads as a deliberate move on camera.
  //
  // The reader calls window.scrollTo({behavior:'smooth'}) itself on every page
  // turn, so any driven scroll that overlaps a turn will fight it. Beats are
  // ordered so that never happens.
  ns.scrollY = (top, ms) =>
    new Promise((done) => {
      const el = document.scrollingElement;
      const max = el.scrollHeight - window.innerHeight;
      const target = Math.max(0, Math.min(top, max));
      const y0 = el.scrollTop;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        el.scrollTop = y0 + (target - y0) * ease(p);
        p < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });

  // Scroll so that `sel` sits `frac` down the viewport. Absolute pixel targets
  // would need re-measuring every time the site's copy changes; a selector does
  // not, and late-loading imagery moves the numbers anyway.
  ns.scrollToEl = (sel, frac, ms) => {
    const el = document.querySelector(sel);
    if (!el) return Promise.reject(new Error("no element for " + sel));
    const r = el.getBoundingClientRect();
    const top = document.scrollingElement.scrollTop + r.top - window.innerHeight * frac;
    return ns.scrollY(top, ms);
  };
};

// ---------------------------------------------------------------------------
// the take
//
// One continuous walk of the public site: the homepage top to bottom, into the
// chapter index, into a free chapter, through the reading controls and a page
// turn, back to the index, into a locked chapter for the paywall, and out to the
// signup the paywall routes to.
//
// Pacing follows the democap register: 500-600ms glides, 1.2-1.5s of dwell. The
// difference here is that navigations cost real network time, so each one gets a
// waited landing rather than a guessed sleep, and the beats after it are keyed
// with enough slack to absorb a slow response.
// ---------------------------------------------------------------------------

const ocp = {
  url: "https://oakcourtpress.com/",
  out: "oakcourtpress.mp4",
  target: 60.0,
  warm: ["read"],
  ready: async (page) => {
    await page.waitForSelector("section a[href='/read']", { timeout: 30000 });
    // The hero video decodes after first paint; opening on a poster frame would
    // waste the establishing beat.
    await page
      .waitForFunction(() => {
        const v = document.querySelector("video");
        return v && v.readyState >= 3;
      }, { timeout: 15000 })
      .catch(() => {});
    await page.waitForTimeout(1200);
  },
  beats: (d) => [
    // --- homepage -------------------------------------------------------
    { t: 800, label: "cursor in", do: () => d.cursorOn() },
    { t: 1400, label: "scroll to the synopsis", do: () => d.scrollTo("section:nth-of-type(2)", 0.12, 1800) },
    { t: 4400, label: "scroll to the chapter glimpses", do: () => d.scrollTo("section:nth-of-type(3)", 0.1, 1800) },
    // Hover only. The cards lift and their titles warm on hover, and that reads
    // better as a held beat than as a click that would leave the page early.
    { t: 7000, label: "hover a glimpse card", do: () => d.hover("a[href='/read/chapter-02']", 700) },
    { t: 9000, label: "scroll to the author", do: () => d.scrollTo("section:nth-of-type(4)", 0.12, 1700) },
    { t: 11600, label: "scroll to the closing call", do: () => d.scrollTo("section:nth-of-type(5)", 0.15, 1500) },
    { t: 14000, label: "Begin Reading", do: () => d.click("section:nth-of-type(5) a[href='/read']", 620) },
    { t: 14800, label: "land on the chapter index", do: () => d.landed("a[href='/read/chapter-01']") },

    // --- chapter index --------------------------------------------------
    // Depth here is set by the site's own animation, not by what fits. Every card
    // is a FadeIn with delay = index * 0.1s, counted from when it enters view, so
    // card 40 arrives four seconds after it is scrolled to. Outrun that and the
    // frame is half empty. Two shortish scrolls with a dwell between them keeps
    // the grid ahead of the camera: the first settles on the free-preview badges,
    // the second crosses into the padlocked cards.
    { t: 16200, label: "scroll the index (free previews)", do: () => d.scrollY(620, 1900) },
    { t: 19400, label: "scroll on into the locked chapters", do: () => d.scrollY(1180, 1800) },
    // 2.2s of dwell here, not the usual 1.4: the row that arrives last in this
    // frame is chapter 16-18, whose fade is delayed 1.5-1.7s from the moment the
    // scroll brings it into view. Leave earlier and the bottom third of the shot
    // is bare green.
    { t: 23400, label: "back to the top of the index", do: () => d.scrollY(0, 1300) },
    { t: 25000, label: "open Chapter 1", do: () => d.click("a[href='/read/chapter-01']", 600) },
    { t: 25800, label: "land in the reader", do: () => d.landed("#page-content") },

    // --- the reader -----------------------------------------------------
    // Holds on the chapter intro first: it is a full-bleed looping video with the
    // chapter title over it, and it is the single best-looking frame on the site.
    { t: 28200, label: "scroll to the reading area", do: () => d.scrollTo("#reader-controls-bar", 0.18, 1700) },
    { t: 31000, label: "text size up", do: () => d.click("#btn-font-lg", 560) },
    { t: 33200, label: "text size back to medium", do: () => d.click("#btn-font-md", 420) },
    // The reader smooth-scrolls itself to y=300 on every turn, so nothing else is
    // scheduled across a turn -- a driven scroll would just fight it.
    { t: 35200, label: "turn the page", do: () => d.click("#btn-page-next", 620) },
    { t: 38200, label: "turn again", do: () => d.click("#btn-page-next", 420) },
    // Stop at the page nav, not the chapter nav. The chapter page is barely taller
    // than two screens, so scrolling to its foot pins against the bottom and the
    // shot is mostly footer under a band of empty green.
    { t: 41200, label: "scroll to the page nav", do: () => d.scrollTo("#page-nav", 0.85, 1400) },
    // Back to the index via the header rather than the in-page "All Chapters",
    // for the same reason: the header is fixed, so it needs no extra travel.
    { t: 43400, label: "back to the index", do: () => d.click("header a[href='/read']", 520) },
    { t: 44200, label: "land back on the index", do: () => d.landed("a[href='/read/chapter-04']") },

    // --- the paywall ----------------------------------------------------
    { t: 45600, label: "scroll to a locked chapter", do: () => d.scrollTo("a[href='/read/chapter-04']", 0.34, 1200) },
    { t: 47400, label: "open Chapter 4", do: () => d.click("a[href='/read/chapter-04']", 600) },
    { t: 48200, label: "land on the paywall", do: () => d.landed("#paywall-card") },
    { t: 50400, label: "scroll to the paywall card", do: () => d.scrollTo("#paywall-preview", 0.2, 1500) },
    // Logged out, POST /api/checkout answers 401 and the app routes itself to
    // /signup. No Stripe session is created, so this is safe to click on prod.
    { t: 53400, label: "Unlock the Full Story", do: () => d.click("#paywall .paywall__card button", 620) },
    { t: 54200, label: "land on signup", do: () => d.landed("form") },
    { t: 56200, label: "settle on the account form", do: () => d.scrollY(0, 900) },
    { t: 58200, label: "cursor out", do: () => d.cursorOff() },
  ],
  recon: [
    { label: "home", sels: [
      "section:nth-of-type(2)", "section:nth-of-type(3)", "section:nth-of-type(4)", "section:nth-of-type(5)",
      "a[href='/read/chapter-02']", "section:nth-of-type(5) a[href='/read']",
    ] },
    { label: "index", path: "read", sels: ["a[href='/read/chapter-01']", "a[href='/read/chapter-04']"] },
    { label: "reader", path: "read/chapter-01", sels: [
      "#page-content", "#reader-controls-bar", "#btn-font-lg", "#btn-font-md",
      "#btn-page-next", "#chapter-nav", "#btn-all-chapters",
    ] },
    { label: "paywall", path: "read/chapter-04", sels: [
      "#paywall", "#paywall-preview", "#paywall-card", "#paywall .paywall__card button",
    ] },
    { label: "signup", path: "signup", sels: ["form", "canvas"] },
  ],
};

// ---------------------------------------------------------------------------
// tomtheweatherwizard.com -- the weather effects
//
// A single-page React app whose joke is the weather itself: seven named seasons,
// each one a line you can click, each one running a full-page canvas effect over
// the site. The same seven live twice -- as the season lines in the "Spring? Yeah
// Right!" section, and as the Weather FX row above the shirt -- so the take runs
// four from the season lines, carries the running effect down to the shirt, and
// finishes the remaining three from the shirt's own controls.
//
// It opens ALREADY at the season section. That section is one viewport tall and
// sits five sections down the page, and the scroll to reach it shows nothing the
// video is about.
// ---------------------------------------------------------------------------

// The season line and the Weather FX button for each effect. Order is the
// site's own: the seasons as the joke tells them, polar vortex through actual
// summer.
const FX = {
  polarVortex: { line: 0, btn: "Polar Vortex" },
  fakeSpring1: { line: 1, btn: "Fake Spring I" },
  revengeWinter: { line: 2, btn: "Revenge Winter" },
  fakeSpring2: { line: 3, btn: "Fake Spring II" },
  prematureSummer: { line: 4, btn: "Premature Summer" },
  aprilSnowstorm: { line: 5, btn: "April Snowstorm" },
  actualSummer: { line: 6, btn: "Actual Summer" },
};
const line = (k) => `.season-line >> nth=${FX[k].line}`;
const fxBtn = (k) => `.weather-fx-btn[aria-label="${FX[k].btn}"]`;

const ttww = {
  url: "https://tomtheweatherwizard.com/",
  out: "tomtheweatherwizard-weather-fx.mp4",
  target: 34.0,
  ready: async (page) => {
    // The season lines only mount once the five display fonts resolve; before
    // that the section is a flat blue placeholder.
    await page.waitForSelector(".season-line", { timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll(".season-line").length >= 7, { timeout: 15000 });
    await page.waitForTimeout(1500);
  },
  // Put the camera on the section before the clock starts, with the page's own
  // smooth-scroll suppressed so it is a cut, not a ride.
  open: async (page) => {
    await page.evaluate(() => {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      const el = document.querySelector(".intro-section");
      window.scrollTo(0, Math.round(el.getBoundingClientRect().top + window.scrollY));
      document.documentElement.style.scrollBehavior = prev;
    });
    await page.waitForTimeout(600);
  },
  beats: (d) => [
    // --- the season lines -----------------------------------------------
    // 3.2s an effect. Each click crossfades the section's background photo over
    // 800ms and starts a full-page particle field, so anything under about 3s
    // cuts away while the crossfade is still resolving.
    { t: 600, label: "cursor in", do: () => d.cursorOn() },
    { t: 1000, label: "POLAR VORTEX SEASON", do: () => d.click(line("polarVortex"), 640) },
    { t: 4200, label: "Fake Spring I", do: () => d.click(line("fakeSpring1"), 520) },
    { t: 7400, label: "REVENGE WINTER", do: () => d.click(line("revengeWinter"), 520) },
    { t: 10600, label: "premature summer", do: () => d.click(line("prematureSummer"), 520) },

    // --- down to the shirt ----------------------------------------------
    // The heat wave is left running across the move on purpose: the effects are
    // fixed to the viewport, not to the section that started them, and carrying
    // one down is the clearest way to show that.
    { t: 14000, label: "scroll to the shirt", do: () => d.scrollTo(".product-section", 0, 2000) },

    // --- the rest, from the shirt's own controls ------------------------
    { t: 17400, label: "Fake Spring II", do: () => d.click(fxBtn("fakeSpring2"), 620) },
    { t: 20800, label: "April Snowstorm", do: () => d.click(fxBtn("aprilSnowstorm"), 460) },
    { t: 24200, label: "Actual Summer", do: () => d.click(fxBtn("actualSummer"), 460) },
    // One more pass back through the two the shirt looks best under, now that
    // the whole row has been used once and the gesture reads as a switch rather
    // than a discovery.
    { t: 27600, label: "back to Polar Vortex", do: () => d.click(fxBtn("polarVortex"), 500) },
    { t: 30800, label: "and out on Actual Summer", do: () => d.click(fxBtn("actualSummer"), 460) },
    { t: 32800, label: "cursor out", do: () => d.cursorOff() },
  ],
  recon: [
    { label: "one page", sels: [
      ".intro-section", ".product-section", ".weather-fx-header", ".season-line >> nth=6",
      fxBtn("polarVortex"), fxBtn("fakeSpring2"), fxBtn("aprilSnowstorm"), fxBtn("actualSummer"),
    ] },
  ],
};

// ---------------------------------------------------------------------------
// chadlewine.com -- the cube on a song page
//
// The song page replaces a cover-art still with CubeVisualizer: a cube whose
// faces carry the art, lit and morphed by the track's own audio. It is the
// first entry in this folder with a soundtrack, because the cube is only half
// the point -- what it is reacting to is the other half. The take is
// deliberately plain: start the track, watch the cube in the page, then send it
// fullscreen and stay there.
//
// Two things the page settled:
//   - Playback is a real stream, not a preview. The mini player's aria-label
//     reads "Play " rather than "Play preview", and PlayerContext routes an
//     `new Audio()` element (never in the DOM, so there is no <audio> to query)
//     through an AudioContext for the FFT the cube reads.
//   - Fullscreen is the Fullscreen API on `.cube-vis` itself, and it does NOT
//     move the window: innerWidth/innerHeight stay 1920x1080 across the
//     transition, so the capture track never rescales. Measured before the
//     headed take, because a mid-take rescale is the one artifact this rig
//     cannot fix in post.
// ---------------------------------------------------------------------------

const clcube = {
  url: "https://chadlewine.com/music/songs/machine",
  out: "chadlewine-cube-machine.mp4",
  target: 42.0,
  // Music, so normalize rather than ship whatever the page happened to output.
  loudnorm: true,
  // The song page gates anonymous playback after two full plays per song, keyed
  // on sha256(ip | user-agent) (see src/app/api/play/gate/route.ts in the
  // chadlewine repo). Unlabelled, the rig shares a fingerprint with whoever is
  // browsing from this machine, and a third take opens on the "free play limit
  // reached" modal instead of the cube. The tag gives capture runs their own
  // bucket. It is not an unlimited bypass: two takes per tag.
  uaTag: "sitecap-portfolio-capture",
  ready: async (page) => {
    // The consent bar is a fixed strip across the foot of the frame and would
    // sit in the whole in-page half of the take. Dismissed with "Reject
    // optional" rather than "Accept all": the capture rig is not a visitor, and
    // accepting would have it firing GA4 events as one.
    await page
      .locator(".cl-consent__btn--ghost", { hasText: "Reject optional" })
      .first()
      .click({ timeout: 8000 })
      .catch(() => {});
    await page.waitForSelector(".cube-vis canvas", { timeout: 30000 });
    await page.waitForSelector(".track-detail__player-row .mini-player__play-btn", { timeout: 30000 });
    // The cube unfolds from the flat art on mount (--cv-unfold), and the art
    // itself is a late-loading image. Opening mid-unfold wastes the first beat.
    await page.waitForTimeout(2500);
  },
  beats: (d) => [
    { t: 700, label: "cursor in", do: () => d.cursorOn() },
    // Rest on the cube while it is still idle, so the change when the track
    // starts is something the video shows rather than something it opens on.
    { t: 1300, label: "rest on the idle cube", do: () => d.hover(".cube-vis", 900) },
    { t: 3200, label: "play Machine", do: () => d.click(".track-detail__player-row .mini-player__play-btn", 700) },
    // Straight to the toggle from the play button. The in-page stretch is only
    // long enough to carry the unfold and register the page around it -- title,
    // info bar, waveform, Rising Compass badge -- because the cube at full
    // frame is what the video is for and it should not have to wait.
    { t: 6300, label: "fullscreen", do: () => d.click(".cube-vis__fs-toggle", 700) },
    // The drawn cursor lives on document.body, outside .cube-vis, so fullscreen
    // hides it on its own. Called anyway so the state is not left to a side
    // effect of where the element happens to sit in the tree.
    { t: 7300, label: "cursor out", do: () => d.cursorOff() },
  ],
  recon: [
    { label: "song page", sels: [
      ".cube-vis", ".cube-vis canvas", ".cube-vis__fs-toggle",
      ".track-detail__player-row .mini-player__play-btn",
    ] },
  ],
};

const SITES = { ocp, ttww, clcube };

// ---------------------------------------------------------------------------
// driver
// ---------------------------------------------------------------------------

function makeDriver(page) {
  const kit = (fn, ...a) => page.evaluate(fn, ...a);

  // Client-side navigation keeps the kit alive, but a hard navigation would not.
  // Cheap enough to assert before every move.
  const ensureKit = async () => {
    const has = await page.evaluate(() => !!window.__sitecap).catch(() => false);
    if (!has) {
      await page.evaluate(KIT);
      await page.evaluate(() => window.__sitecap.show());
    }
  };

  const boxOf = async (sel) => {
    const el = page.locator(sel).first();
    // Short on purpose: a miss must not eat the schedule the later beats are
    // keyed to.
    await el.waitFor({ state: "visible", timeout: 2500 });
    const b = await el.boundingBox();
    if (!b) throw new Error("no box for " + sel);
    return b;
  };

  const glide = async (x, y, ms) => {
    await page.evaluate(([x, y, ms]) => window.__sitecap.moveTo(x, y, ms), [x, y, ms]);
    await page.mouse.move(x, y);
  };

  const tap = async () => {
    await page.evaluate(() => window.__sitecap.ripple());
    await page.mouse.down();
    await page.waitForTimeout(60);
    await page.mouse.up();
  };

  const d = {
    cursorOn: async () => {
      await ensureKit();
      await kit(() => window.__sitecap.show());
    },
    cursorOff: () => kit(() => window.__sitecap.hide()),

    async click(sel, glideMs = 500) {
      await ensureKit();
      const b = await boxOf(sel);
      await glide(b.x + b.width / 2, b.y + b.height / 2, glideMs);
      await tap();
    },

    // Move onto a target and stay there. The site leans on hover states (card
    // lift, glow, link colour), and they only read if the cursor rests.
    async hover(sel, glideMs = 600) {
      await ensureKit();
      const b = await boxOf(sel);
      await glide(b.x + b.width / 2, b.y + b.height * 0.42, glideMs);
    },

    scrollY: async (top, ms) => {
      await ensureKit();
      return page.evaluate(([t, m]) => window.__sitecap.scrollY(t, m), [top, ms]);
    },

    scrollTo: async (sel, frac, ms) => {
      await ensureKit();
      return page.evaluate(([s, f, m]) => window.__sitecap.scrollToEl(s, f, m), [sel, frac, ms]);
    },

    // A navigation beat's only job is to wait for the new surface. Given its own
    // slot so the run log shows what the transition actually cost, which is the
    // number that decides whether the beats after it need more slack.
    async landed(sel) {
      await page.locator(sel).first().waitFor({ state: "visible", timeout: 12000 });
      await ensureKit();
    },
  };
  return d;
}

// ---------------------------------------------------------------------------

async function sizeWindow(page, cdp) {
  for (let i = 0; i < 6; i++) {
    const inner = await page.evaluate(() => [innerWidth, innerHeight]);
    if (inner[0] === W && inner[1] === H) return inner;
    const { windowId, bounds } = await cdp.send("Browser.getWindowForTarget");
    await cdp.send("Browser.setWindowBounds", {
      windowId,
      bounds: {
        width: bounds.width + (W - inner[0]),
        height: bounds.height + (H - inner[1]),
        windowState: "normal",
      },
    });
    await page.waitForTimeout(250);
  }
  return page.evaluate(() => [innerWidth, innerHeight]);
}

async function parkPointer() {
  // The OS cursor sits inside the captured surface and Playwright's synthetic
  // mouse never moves it. Push it into the far corner of the primary display,
  // clear of the browser window.
  const ps = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(2555,1435)`;
  try {
    await run("powershell", ["-NoProfile", "-Command", ps]);
  } catch {
    /* cosmetic only */
  }
}

// ---------------------------------------------------------------------------
// recon -- cheap pass that proves every selector the take drives, before paying
// for a headed capture.
// ---------------------------------------------------------------------------

async function recon(key) {
  const site = SITES[key];
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: W, height: H } });

  const probe = async (label, url, sels) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2500);
    const geo = await page.evaluate(() => ({
      docH: document.scrollingElement.scrollHeight,
      sections: [...document.querySelectorAll("section")].map((s) => Math.round(s.getBoundingClientRect().top + window.scrollY)),
      videos: document.querySelectorAll("video").length,
    }));
    console.log(`\n--- ${label}  ${url}`);
    console.log(`    page ${geo.docH}px, ${geo.sections.length} sections at [${geo.sections.join(", ")}], ${geo.videos} video(s)`);
    for (const s of sels) {
      const n = await page.locator(s).count();
      const vis = n ? await page.locator(s).first().isVisible() : false;
      console.log(`    ${n === 1 && vis ? "ok  " : n ? "??  " : "MISS"} ${s}   (n=${n}, visible=${vis})`);
    }
  };

  for (const surface of site.recon) {
    await probe(surface.label, site.url + (surface.path || ""), surface.sels);
  }

  await browser.close();
}

// ---------------------------------------------------------------------------

async function capture(key, { framingOnly }) {
  const site = SITES[key];
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    args: [
      "--force-device-scale-factor=1",
      "--hide-scrollbars",
      "--autoplay-policy=no-user-gesture-required",
      "--auto-accept-this-tab-capture",
      "--enable-usermedia-screen-capturing",
      "--disable-features=Translate,MediaRouter",
      "--window-position=40,40",
      "--window-size=1936,1175",
    ],
  });
  const ctx = await browser.newContext({ viewport: null, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);

  // A site that rate-limits anonymous visitors will count capture runs as if
  // they were visits. Tagging the UA gives the rig its own identity in those
  // counters instead of burning the operator's, and says plainly in the request
  // what it is rather than pretending to be a visitor.
  if (site.uaTag) {
    const ua = await page.evaluate(() => navigator.userAgent);
    await cdp.send("Network.setUserAgentOverride", { userAgent: `${ua} ${site.uaTag}` });
  }

  const inner = await sizeWindow(page, cdp);
  if (inner[0] !== W || inner[1] !== H) {
    throw new Error(`window would not size to ${W}x${H} (got ${inner.join("x")})`);
  }

  // Warm pass: the first hit pays for the CDN, the fonts, and any video. None of
  // that belongs inside the take. `warm` lists the extra routes the take visits,
  // so their payloads are cached before the clock starts.
  await page.goto(site.url, { waitUntil: "load", timeout: 60000 });
  await site.ready(page);
  for (const p of site.warm || []) {
    await page.goto(site.url + p, { waitUntil: "load", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1500);
  }
  if (site.warm?.length) {
    await page.goto(site.url, { waitUntil: "load", timeout: 60000 });
    await site.ready(page);
  }

  await page.evaluate(KIT);
  await parkPointer();

  if (framingOnly) {
    await mkdir(TMP, { recursive: true });
    const shot = path.join(TMP, `framing-${key}.png`);
    await page.evaluate(() => window.__sitecap.show());
    await page.screenshot({ path: shot });
    console.log("framing ->", shot);
    await browser.close();
    return;
  }

  // --- grab the tab, audio included -------------------------------------
  const got = await page.evaluate(async ([w, h, fps]) => {
    const s = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: fps, width: w, height: h },
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 2,
        sampleRate: 48000,
      },
      preferCurrentTab: true,
      selfBrowserSurface: "include",
      systemAudio: "include",
    });
    window.__stream = s;
    const v = s.getVideoTracks()[0].getSettings();
    const a = s.getAudioTracks()[0];
    return { v, audio: a ? a.getSettings() : null };
  }, [W, H, FPS]);
  console.log(`  surface ${got.v.width}x${got.v.height}@${got.v.frameRate} audio=${got.audio ? got.audio.channelCount + "ch" : "none"}`);

  const chunks = [];
  await page.exposeBinding("__sitecapChunk", (_src, b64) => chunks.push(Buffer.from(b64, "base64")));

  // Codec preference is about real-time encode cost, not quality: VP9 at 1080p30
  // is software encoded on this machine and drops frames under load.
  const ext = await page.evaluate(() => {
    const candidates = [
      ["video/x-matroska;codecs=avc1,opus", "mkv"],
      ["video/mp4;codecs=avc1.640028,opus", "mp4"],
      ["video/webm;codecs=vp8,opus", "webm"],
      ["video/webm;codecs=vp9,opus", "webm"],
    ];
    const pick = candidates.find(([m]) => MediaRecorder.isTypeSupported(m)) || ["video/webm", "webm"];
    window.__mime = pick[0];
    return pick[1];
  });
  console.log(`  recording as ${ext}`);

  await page.evaluate(() => {
    const rec = new MediaRecorder(window.__stream, {
      mimeType: window.__mime,
      videoBitsPerSecond: 14_000_000,
      audioBitsPerSecond: 192_000,
    });
    window.__rec = rec;
    rec.ondataavailable = async (e) => {
      if (!e.data.size) return;
      const buf = new Uint8Array(await e.data.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      window.__sitecapChunk(btoa(bin));
    };
    window.__recStopped = new Promise((r) => (rec.onstop = r));
    rec.start(500);
  });
  const recStarted = Date.now();

  // Starting a tab capture drops Chrome's "sharing this tab" bar into the window,
  // stealing content height. The page reflows and the track -- pinned to
  // 1920x1080 by crop-and-scale -- rescales to match, which reads on camera as
  // the site resizing itself a few frames in. Refit, settle, then trim the
  // lead-in off with a frame-accurate -ss.
  await page.waitForTimeout(700);
  const settled = await sizeWindow(page, cdp);
  console.log(`  refit after capture: ${settled.join("x")}`);
  // Framing happens here, after the refit, so a site that opens partway down the
  // page is already parked there when the clock starts. The move itself is
  // inside the trimmed lead-in and never reaches the video.
  if (site.open) await site.open(page);
  else await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);

  // --- run the beats on an absolute clock -------------------------------
  const d = makeDriver(page);
  const t0 = Date.now();
  const leadIn = (t0 - recStarted) / 1000;
  const waitUntil = async (ms) => {
    const left = ms - (Date.now() - t0);
    if (left > 0) await page.waitForTimeout(left);
  };
  for (const beat of site.beats(d)) {
    await waitUntil(beat.t);
    const at = ((Date.now() - t0) / 1000).toFixed(2);
    let note = "";
    try {
      await beat.do();
    } catch (e) {
      note = `  !! ${e.message.split("\n")[0]}`;
    }
    const done = ((Date.now() - t0) / 1000).toFixed(2);
    console.log(`  ${at}s -> ${done}s  ${beat.label}${note}`);
  }
  // Generous tail: frames still in flight when stop() lands are lost, and the
  // trim takes exactly `target` from the lead-in mark.
  await waitUntil(site.target * 1000 + 1200);

  await page.evaluate(async () => {
    window.__rec.stop();
    await window.__recStopped;
    window.__stream.getTracks().forEach((t) => t.stop());
  });
  await page.waitForTimeout(600);
  await browser.close();

  // --- encode ------------------------------------------------------------
  await mkdir(TMP, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });
  const raw = path.join(TMP, `${key}.${ext}`);
  await writeFile(raw, Buffer.concat(chunks));

  // The site's video is decorative and muted, so there is nothing to normalize.
  // Measure rather than assume, and ship silent when it is silent.
  const probe = await run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type", "-of", "csv=p=0", raw]);
  let hasAudio = probe.stdout.includes("audio");
  if (hasAudio) {
    const vd = await run(
      "ffmpeg",
      ["-hide_banner", "-i", raw, "-ss", leadIn.toFixed(3), "-t", String(site.target),
       "-af", "volumedetect", "-f", "null", "-"],
      { maxBuffer: 1 << 26 }
    ).catch((e) => ({ stderr: e.stderr || "" }));
    const mean = parseFloat((vd.stderr.match(/mean_volume:\s*(-?[\d.]+)/) || [])[1] ?? "-99");
    console.log(`  audio mean ${mean} dB`);
    if (mean < -60) {
      hasAudio = false;
      console.log("  audio is silence -- shipping without a track");
    }
  }

  const out = path.join(OUT_DIR, site.out);
  const args = [
    "-y", "-i", raw,
    // Output seeking, so the trim is frame-accurate rather than snapped to the
    // nearest keyframe. The lead-in is exactly the part that must not survive.
    "-ss", leadIn.toFixed(3),
    "-t", String(site.target),
    "-vf", `scale=${W}:${H}:flags=lanczos,fps=${FPS},format=yuv420p`,
    // Force CFR: the capture is variable-rate, and without this a stalled stretch
    // ships as a short video stream instead of held frames.
    "-fps_mode", "cfr", "-r", String(FPS),
    "-c:v", "libx264", "-preset", "slow", "-crf", "18",
    "-profile:v", "high", "-level", "4.1",
    "-movflags", "+faststart",
  ];
  if (hasAudio) {
    // Tab capture hands back whatever level the page's own gain staging
    // produced, which is not a level anyone chose. A site that ships with sound
    // sets `loudnorm` and lands at -16 LUFS, the same target the rest of the
    // portfolio would be mixed to if it had audio at all.
    if (site.loudnorm) args.push("-af", "loudnorm=I=-16:TP=-1.5:LRA=11");
    args.push("-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2");
  } else {
    args.push("-an");
  }
  args.push(out);
  await run("ffmpeg", args, { maxBuffer: 1 << 26 });
  await rm(raw, { force: true });

  const info = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size",
    "-show_entries", "stream=codec_type,codec_name,width,height",
    "-of", "default=noprint_wrappers=1", out,
  ]);
  console.log(`  -> ${out}\n${info.stdout.trim().split("\n").map((l) => "     " + l).join("\n")}`);

  // A capture that stalled still produces a playable file, just a short one. Say
  // so rather than let it pass as finished.
  const counted = await run("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-count_frames",
    "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", out,
  ]);
  const frames = parseInt(counted.stdout.trim(), 10);
  const want = Math.round(site.target * FPS);
  console.log(`     frames ${frames}/${want}${frames < want - 2 ? "  <-- SHORT, capture dropped frames" : ""}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const framingOnly = argv.includes("--framing");
  const reconOnly = argv.includes("--recon");
  const which = argv.filter((a) => !a.startsWith("--"));
  const keys = which.length ? which : ["ocp"];

  for (const k of keys) {
    if (!SITES[k]) throw new Error("unknown site: " + k);
    console.log(`\n=== ${k} ===`);
    if (reconOnly) await recon(k);
    else await capture(k, { framingOnly });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
