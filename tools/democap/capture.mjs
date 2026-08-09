// democap -- portfolio capture rig for the demos.chadworks.co interfaces.
//
//   1. serve the demos:  python -m http.server 8899 --directory "<chadworks-demos>"
//   2. run this:         node tools/democap/capture.mjs [sap|tvp|sfvv|all] [--framing]
//
// Drives real Google Chrome (not the Playwright Chromium build -- that one has no
// h264/mp3/aac, so every clip in the demos would refuse to decode) through a
// scripted choreography, and records the tab with getDisplayMedia +
// MediaRecorder. That path is used instead of Playwright's recordVideo because it
// carries the tab's real audio, in sync, with no post-mixing.
//
// Two things the capture surface cares about:
//   - Tab capture grabs the REAL window content area in device pixels. Playwright
//     viewport emulation does not touch it. So the window itself is sized until
//     innerWidth/innerHeight measure exactly 1920x1080, with
//     --force-device-scale-factor=1 pinning dpr to 1.
//   - The OS cursor is inside the captured surface, and Playwright's synthetic
//     mouse does not move it. So the real pointer is parked off-window and a drawn
//     cursor is injected instead, which also lets clicks read on camera.
//
// Output: 1920x1080 h264 30fps mp4 in Dropbox/ChadWorks/portfolio videos/.

import { chromium } from "playwright-core";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { createReadStream, statSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import http from "node:http";
import path from "node:path";
import os from "node:os";

const run = promisify(execFile);

const DEMOS_ROOT = process.env.DEMOCAP_ROOT || "C:/Users/chad/Local Sites/chadworks-demos";
const PORT = 8899;
const BASE = process.env.DEMOCAP_URL || `http://127.0.0.1:${PORT}`;
const OUT_DIR = "C:/Users/chad/Dropbox/ChadWorks/portfolio videos";
const TMP = path.join(os.tmpdir(), "democap");
const W = 1920;
const H = 1080;
const FPS = 30;

// ---------------------------------------------------------------------------
// static server WITH byte ranges
//
// This exists because `python -m http.server` does not answer Range requests. On
// that server a media element cannot seek past what it has already buffered:
// SAP's seek computes the right position, sets currentTime, and Chrome snaps it
// straight back to 0, which on camera looks exactly like the player restarting
// itself. It is not a player bug and it does not happen on the real host, where
// nginx serves ranges. Serving them here keeps captures honest and deterministic.
// ---------------------------------------------------------------------------
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".mp3": "audio/mpeg",
  ".mp4": "video/mp4", ".csv": "text/csv", ".webm": "video/webm",
};

function serveDemos(root, port) {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
    const file = path.join(root, rel);
    if (!file.startsWith(path.resolve(root))) {
      res.writeHead(403).end();
      return;
    }
    let st;
    try {
      st = statSync(file);
    } catch {
      res.writeHead(404).end("not found");
      return;
    }
    const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (range) {
      const start = range[1] ? parseInt(range[1], 10) : 0;
      const end = range[2] ? parseInt(range[2], 10) : st.size - 1;
      res.writeHead(206, {
        "Content-Type": type,
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${st.size}`,
        "Content-Length": end - start + 1,
        "Cache-Control": "no-store",
      });
      createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, {
      "Content-Type": type,
      "Accept-Ranges": "bytes",
      "Content-Length": st.size,
      "Cache-Control": "no-store",
    });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok, fail) => {
    server.on("error", fail);
    server.listen(port, "127.0.0.1", () => ok(server));
  });
}

// ---------------------------------------------------------------------------
// in-page kit: drawn cursor, eased scrolling, click ripples
// ---------------------------------------------------------------------------
const KIT = () => {
  const ns = (window.__democap = {});
  const cur = document.createElement("div");
  cur.id = "__democap_cursor";
  cur.innerHTML = `
    <svg width="26" height="34" viewBox="0 0 26 34">
      <path d="M2 1 L2 27 L8.5 20.5 L12.5 30 L17 28 L13 18.5 L22 18.5 Z"
            fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>
    <span class="__ring"></span>`;
  const css = document.createElement("style");
  css.textContent = `
    #__democap_cursor{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;
      will-change:transform;filter:drop-shadow(0 2px 4px rgba(0,0,0,.45));opacity:0;
      transition:opacity .25s ease}
    #__democap_cursor.on{opacity:1}
    #__democap_cursor .__ring{position:absolute;left:1px;top:1px;width:12px;height:12px;
      border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.5);
      transform:translate(-50%,-50%) scale(0);opacity:0}
    #__democap_cursor.__click .__ring{animation:__dcring .42s ease-out}
    @keyframes __dcring{0%{transform:translate(-50%,-50%) scale(.2);opacity:.95}
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

  // Eased scroll for any scroller. Used instead of behavior:'smooth' so the
  // duration is ours and reads as a deliberate move on camera.
  //
  // snapOff matters on the SFVV feed: it is scroll-snap:y mandatory, and Chrome
  // re-snaps on every scrollTop assignment, so a per-frame animation gets yanked
  // to the nearest slide and the travel never appears. Releasing snap for the
  // duration of the move is what makes the swipe visible; it is restored at the
  // end, already sitting on a snap point.
  ns.scrollTo = (sel, top, ms, snapOff) =>
    new Promise((done) => {
      const el = sel === "window" ? document.scrollingElement : document.querySelector(sel);
      const prevSnap = el.style.scrollSnapType;
      if (snapOff) el.style.scrollSnapType = "none";
      const y0 = el.scrollTop;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        el.scrollTop = y0 + (top - y0) * ease(p);
        if (p < 1) return requestAnimationFrame(step);
        if (snapOff) el.style.scrollSnapType = prevSnap;
        done();
      };
      requestAnimationFrame(step);
    });
};

// ---------------------------------------------------------------------------
// choreographies -- each returns a list of {t, label, do} keyed to ms since the
// recorder started. Keep the last beat under the target duration.
// ---------------------------------------------------------------------------

const sap = {
  page: "sap.html",
  zoom: 1.85,
  // Longer than the other two: the second track needs ~5s on air at the end, and
  // squeezing that into 12s would undo the pacing everywhere before it.
  target: 15.5,
  ready: async (page) => {
    await page.waitForSelector(".sap-track-item", { timeout: 15000 });
    await page.waitForTimeout(700);
  },
  beats: (d) => [
    { t: 600, label: "cursor in", do: () => d.cursorOn() },
    // EXPAND opens all three albums at once, which both reads well and saves the
    // separate beat that expanding Volume Two would otherwise cost later.
    { t: 900, label: "expand the discography", do: () => d.click("#sapExpandAllBtn", 620) },
    { t: 2100, label: "play Eye For An Eye", do: () => d.click("#sap-album-0 .sap-track-item >> nth=0", 560) },
    { t: 4000, label: "EQ 60Hz up", do: () => d.dragEq(0, -26) },
    { t: 5400, label: "volume down", do: () => d.clickAt("#sapVolumeSlider", 0.38, 0.5, 560) },
    { t: 6600, label: "volume back up", do: () => d.clickAt("#sapVolumeSlider", 0.92, 0.5, 380) },
    { t: 8000, label: "scrub forward", do: () => d.scrubSeek(0.45) },
    { t: 9900, label: "play If I Dont", do: () => d.click("#sap-album-1 .sap-track-item >> nth=0", 560) },
    { t: 11000, label: "cursor out", do: () => d.cursorOff() },
    // then ~4.5s of the second track running on its own
  ],
};

const tvp = {
  page: "tvp.html",
  zoom: 1.42,
  // Two clips need loading, and the second one has to sit on screen long enough to
  // be watched rather than glimpsed.
  target: 15.0,
  ready: async (page) => {
    await page.waitForSelector(".tvp-playlist-item", { timeout: 15000 });
    await page.waitForSelector(".tvp-video-card", { timeout: 15000 });
    await page.waitForTimeout(700);
  },
  beats: (d) => [
    // Two clips: the featured panel loads the first, the grid loads the second.
    // Order is set by audio -- "Ridge In Cloud" (clip-11) is the only clip in this
    // fixture whose audio track is not digital silence, so it goes second and the
    // sound runs unbroken to the end. Filtering to Scenes first both shows the
    // nested category tree and puts Ridge on screen as a grid card.
    { t: 600, label: "cursor in", do: () => d.cursorOn() },
    { t: 900, label: "play City Lights (featured)", do: () => d.click(".tvp-playlist-item >> nth=0", 520) },
    { t: 3200, label: "scanlines on", do: () => d.click("#tvpToggleScanlines", 500) },
    { t: 5000, label: "scroll to library", do: () => d.scroll("window", 980, 1400) },
    // Scope to the desktop panel: the categories are also cloned into the hidden
    // mobile dropdown, and the bare selector matches that copy first.
    { t: 7300, label: "filter to Scenes", do: () => d.click('#tvpGridCategoriesList .tvp-playlist-link[data-category-id="1"]', 520) },
    // No scroll-back beat after this one: playVideo() smooth-scrolls the page to
    // top itself and fires the channel-change static, so driving the scroll here
    // would just fight it.
    { t: 9000, label: "play Ridge In Cloud (grid)", do: () => d.click('#tvpVideoGrid .tvp-video-card[data-video-id="7"]', 560) },
    { t: 12000, label: "VHS indicators off", do: () => d.click("#tvpToggleIndicators", 460) },
    { t: 13200, label: "cursor out", do: () => d.cursorOff() },
    // then ~1.8s of the second clip running on its own
  ],
};

const sfvv = {
  page: "sfvv.html",
  zoom: 1.0,
  // The long one, and deliberately so: a feed has to be scrolled through to be
  // shown at all. Runs the unfiltered feed, filters it, then scrolls the result.
  target: 27.0,
  ready: async (page) => {
    await page.waitForSelector(".sfvvr-slide", { timeout: 15000 });
    await page.waitForTimeout(1200);
  },
  beats: (d) => [
    // Unmute cannot come earlier than this: the mute control only exists on video
    // slides and the feed opens on the featured card, so one swipe has to land
    // before there is anything to unmute.
    { t: 600, label: "cursor in", do: () => d.cursorOn() },
    { t: 1000, label: "swipe to clip 1", do: () => d.feed(1, 1300) },
    { t: 2900, label: "unmute", do: () => d.click(".sfvvr-slot >> nth=1 >> .sfvvr-mute", 500) },
    { t: 4100, label: "like", do: () => d.click(".sfvvr-slot >> nth=1 >> .sfvvr-like", 420) },

    // Four more through the unfiltered feed. Slides 2-5 cross a typed card, so the
    // card treatments land here rather than needing a beat of their own.
    { t: 5400, label: "swipe on (2)", do: () => d.feed(2, 1400) },
    { t: 7400, label: "swipe on (3)", do: () => d.feed(3, 1400) },
    { t: 9400, label: "swipe on (4)", do: () => d.feed(4, 1400) },
    { t: 11400, label: "swipe on (5)", do: () => d.feed(5, 1400) },

    // Street, not Craft: its clips (v-02, v-03) are the ones carrying real audio,
    // so the back half still has sound after the feed reloads.
    { t: 13400, label: "open the menu", do: () => d.click(".sfvv-menu-fab", 520) },
    { t: 14700, label: "open Feed Filter", do: () => d.click(".sfvv-menu-section-toggle >> nth=0", 380) },
    { t: 15800, label: "choose Street", do: () => d.click('.sfvv-category-option input[value="street"]', 320) },
    { t: 16900, label: "apply", do: () => d.click(".sfvv-category-apply", 300) },

    // A Street cycle is 5 slides (featured card, 3 clips, one more card), so four
    // swipes walks it end to end.
    { t: 18300, label: "filtered swipe (1)", do: () => d.feed(1, 1400) },
    { t: 20300, label: "filtered swipe (2)", do: () => d.feed(2, 1400) },
    { t: 22300, label: "filtered swipe (3)", do: () => d.feed(3, 1400) },
    { t: 24300, label: "filtered swipe (4)", do: () => d.feed(4, 1400) },
    { t: 26300, label: "cursor out", do: () => d.cursorOff() },
  ],
};

const DEMOS = { sap, tvp, sfvv };

// ---------------------------------------------------------------------------
// driver
// ---------------------------------------------------------------------------

function makeDriver(page) {
  const kit = (fn, ...a) => page.evaluate(fn, ...a);

  const boxOf = async (sel) => {
    const el = page.locator(sel).first();
    // Short: a miss must not eat the schedule the rest of the beats are keyed to.
    await el.waitFor({ state: "visible", timeout: 2500 });
    const b = await el.boundingBox();
    if (!b) throw new Error("no box for " + sel);
    return b;
  };

  // Fire-and-forget: lets the drawn cursor travel while the real moves stream.
  const drawCursor = (x, y, ms) => {
    page.evaluate(([x, y, ms]) => window.__democap.moveTo(x, y, ms), [x, y, ms]).catch(() => {});
  };

  const glide = async (x, y, ms) => {
    await page.evaluate(([x, y, ms]) => window.__democap.moveTo(x, y, ms), [x, y, ms]);
    await page.mouse.move(x, y);
  };

  const tap = async () => {
    await page.evaluate(() => window.__democap.ripple());
    await page.mouse.down();
    await page.waitForTimeout(60);
    await page.mouse.up();
  };

  const d = {
    cursorOn: () => kit(() => window.__democap.show()),
    cursorOff: () => kit(() => window.__democap.hide()),

    async click(sel, glideMs = 400) {
      const b = await boxOf(sel);
      await glide(b.x + b.width / 2, b.y + b.height / 2, glideMs);
      await tap();
    },

    async clickAt(sel, fx, fy, glideMs = 400) {
      const b = await boxOf(sel);
      await glide(b.x + b.width * fx, b.y + b.height * fy, glideMs);
      await tap();
    },

    async type(sel, text, glideMs, perKey) {
      const b = await boxOf(sel);
      await glide(b.x + b.width * 0.25, b.y + b.height / 2, glideMs);
      await tap();
      await page.keyboard.type(text, { delay: perKey });
    },

    async clearSearch() {
      await page.click("#tvpSearchInput");
      await page.keyboard.press("Control+A");
      await page.keyboard.press("Backspace");
      await page.evaluate(() => document.querySelector("#tvpSearchInput").blur());
    },

    // EQ bands are mousedown-drag, not click-to-set. The drawn cursor animates
    // from one evaluate while Playwright streams the real moves, so a drag costs
    // one round trip instead of one per step.
    async dragEq(band, dy) {
      const b = await boxOf(`.sap-eq-slider-track[data-band="${band}"]`);
      const x = b.x + b.width / 2;
      const y0 = b.y + b.height / 2;
      await glide(x, y0, 280);
      await page.mouse.down();
      const y1 = y0 + dy;
      drawCursor(x, y1, 240);
      await page.mouse.move(x, y1, { steps: 14 });
      await page.waitForTimeout(110);
      await page.mouse.up();
    },

    // Grab the scrub handle where it currently sits and slide it. sap.js binds
    // only a click on the bar, no drag, so the fill catches up on release rather
    // than tracking the pointer -- but the travel is what reads on camera, and the
    // click that fires on mouseup carries the release position into seek().
    async scrubSeek(toFrac) {
      const bar = await boxOf("#sapSeekBar");
      const handle = await boxOf("#sapSeekHandle");
      const y = bar.y + bar.height / 2;
      const x0 = handle.x + handle.width / 2;
      const x1 = bar.x + bar.width * toFrac;
      await glide(x0, y, 420);
      await page.mouse.down();
      drawCursor(x1, y, 540);
      await page.mouse.move(x1, y, { steps: 24 });
      await page.waitForTimeout(180);
      await page.mouse.up();
    },

    async dragBalance() {
      const b = await boxOf("#sapBalanceMeter");
      const y = b.y + b.height / 2;
      const at = (f) => b.x + b.width * f;
      await glide(at(0.5), y, 260);
      await page.mouse.down();
      for (const f of [0.84, 0.24, 0.5]) {
        drawCursor(at(f), y, 150);
        await page.mouse.move(at(f), y, { steps: 8 });
        await page.waitForTimeout(40);
      }
      await page.mouse.up();
    },

    scroll: (sel, top, ms) =>
      page.evaluate(([s, t, m]) => window.__democap.scrollTo(s, t, m, false), [sel, top, ms]),

    // Snap-scroll feed: move by whole slots, with snap released for the travel so
    // the swipe is actually on screen instead of a cut between slides.
    async feed(index, ms) {
      const h = await page.evaluate(() => document.querySelector(".sfvvr-slot").getBoundingClientRect().height);
      await page.evaluate(([t, m]) => window.__democap.scrollTo(".sfvvr-feed", t, m, true), [Math.round(h * index), ms]);
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

// Two-pass loudnorm. Single pass is a dynamic normalizer and barely moves quiet
// material -- the difference between the demos landing at a matched level and one
// of them being inaudible next to the others.
const LOUD = "I=-16:TP=-1.5:LRA=11";

async function loudnormPass(file, ss, dur) {
  const r = await run(
    "ffmpeg",
    ["-hide_banner", "-i", file, "-ss", String(ss), "-t", String(dur),
     "-af", `loudnorm=${LOUD}:print_format=json`, "-f", "null", "-"],
    { maxBuffer: 1 << 26 }
  ).catch((e) => ({ stderr: e.stderr || "" }));
  const json = (r.stderr.match(/\{[\s\S]*?\}/g) || []).pop();
  if (!json) return `loudnorm=${LOUD}`;
  try {
    const m = JSON.parse(json);
    return (
      `loudnorm=${LOUD}:measured_I=${m.input_i}:measured_TP=${m.input_tp}` +
      `:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}` +
      `:offset=${m.target_offset}:linear=true`
    );
  } catch {
    return `loudnorm=${LOUD}`;
  }
}

async function parkPointer() {
  // The OS cursor sits inside the captured surface and Playwright's synthetic
  // mouse never moves it. Push it onto the far corner of the second display.
  const ps = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(2555,1435)`;
  try {
    await run("powershell", ["-NoProfile", "-Command", ps]);
  } catch {
    /* cosmetic only */
  }
}

async function capture(key, { framingOnly }) {
  const demo = DEMOS[key];
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
  const ctx = await browser.newContext({ viewport: null });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);

  // Pin the SFVV shuffle seed so the slide order is the same capture to capture.
  if (key === "sfvv") {
    await page.route("**/sfvv-demo.js", async (route) => {
      const res = await route.fetch();
      const body = (await res.text()).replace("Math.floor(Date.now() / 1000)", "20260801");
      await route.fulfill({ response: res, body });
    });
  }

  const inner = await sizeWindow(page, cdp);
  if (inner[0] !== W || inner[1] !== H) {
    throw new Error(`window would not size to ${W}x${H} (got ${inner.join("x")})`);
  }

  await page.goto(`${BASE}/${demo.page}`, { waitUntil: "load" });
  await demo.ready(page);
  if (demo.zoom !== 1) {
    await page.addStyleTag({ content: `.cwd-stage-inner{zoom:${demo.zoom}}` });
    await page.waitForTimeout(500);
  }
  await page.evaluate(KIT);
  await parkPointer();

  if (framingOnly) {
    await mkdir(TMP, { recursive: true });
    const shot = path.join(TMP, `framing-${key}.png`);
    await page.evaluate(() => window.__democap.show());
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
  await page.exposeBinding("__democapChunk", (_src, b64) => chunks.push(Buffer.from(b64, "base64")));

  // Codec preference is about real-time encode cost, not quality. VP9 at 1080p30
  // is software-encoded here and could not keep up with SAP's 24-bar spectrum: a
  // run came back 43 frames short of 12s. h264 gets hardware support, VP8 is at
  // least cheap, and VP9 is the last resort.
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
      window.__democapChunk(btoa(bin));
    };
    window.__recStopped = new Promise((r) => (rec.onstop = r));
    rec.start(500);
  });
  const recStarted = Date.now();

  // Starting a tab capture drops Chrome's "sharing this tab" bar into the window,
  // which steals content height. The page reflows and the capture -- pinned to
  // 1920x1080 by crop-and-scale -- rescales to match, which reads on camera as the
  // interface resizing itself a few frames in. Refit the window to put inner back
  // at 1920x1080, then let it settle. Everything before t0 is trimmed off.
  await page.waitForTimeout(700);
  const settled = await sizeWindow(page, cdp);
  console.log(`  refit after capture: ${settled.join("x")}`);
  await page.waitForTimeout(900);

  // --- run the beats on an absolute clock -------------------------------
  const d = makeDriver(page);
  const t0 = Date.now();
  const leadIn = (t0 - recStarted) / 1000;
  const waitUntil = async (ms) => {
    const left = ms - (Date.now() - t0);
    if (left > 0) await page.waitForTimeout(left);
  };
  for (const beat of demo.beats(d)) {
    await waitUntil(beat.t);
    const at = ((Date.now() - t0) / 1000).toFixed(2);
    try {
      await beat.do();
    } catch (e) {
      console.log(`  !! ${beat.label} failed: ${e.message.split("\n")[0]}`);
    }
    console.log(`  ${at}s  ${beat.label}`);
  }
  // Generous tail: frames still in flight when stop() lands are lost, and the trim
  // takes exactly `target` from the lead-in mark, so the slack has to outlast them.
  await waitUntil(demo.target * 1000 + 1200);

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

  // An audio track is not the same as audio. Several of the Pexels clips ship a
  // stream that is digital silence, and a silent track normalized to -16 LUFS is
  // just amplified nothing -- so measure before deciding to keep it.
  const probe = await run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type", "-of", "csv=p=0", raw]);
  let hasAudio = probe.stdout.includes("audio");
  if (hasAudio) {
    const vd = await run(
      "ffmpeg",
      ["-hide_banner", "-i", raw, "-ss", leadIn.toFixed(3), "-t", String(demo.target),
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

  const out = path.join(OUT_DIR, `demo-${key}.mp4`);
  const args = [
    "-y", "-i", raw,
    // Output seeking, so the trim is frame-accurate rather than snapped to the
    // nearest keyframe -- the lead-in is exactly the part that must not survive.
    "-ss", leadIn.toFixed(3),
    "-t", String(demo.target),
    "-vf", `scale=${W}:${H}:flags=lanczos,fps=${FPS},format=yuv420p`,
    // Force CFR: the capture is variable-rate, and without this a stalled stretch
    // ships as a short video stream instead of held frames.
    "-fps_mode", "cfr", "-r", String(FPS),
    "-c:v", "libx264", "-preset", "slow", "-crf", "18",
    "-profile:v", "high", "-level", "4.1",
    "-movflags", "+faststart",
  ];
  if (hasAudio) {
    args.push("-af", await loudnormPass(raw, leadIn.toFixed(3), demo.target),
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2");
  } else {
    args.push("-an");
  }
  args.push(out);
  await run("ffmpeg", args, { maxBuffer: 1 << 26 });
  await rm(raw, { force: true });

  const info = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size",
    "-show_entries", "stream=codec_type,codec_name,width,height,nb_frames,channels",
    "-of", "default=noprint_wrappers=1", out,
  ]);
  console.log(`  -> ${out}\n${info.stdout.trim().split("\n").map((l) => "     " + l).join("\n")}`);

  // A capture that stalled still produces a playable file, just a short one.
  // Say so rather than let it pass as finished.
  const counted = await run("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-count_frames",
    "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", out,
  ]);
  const frames = parseInt(counted.stdout.trim(), 10);
  const want = Math.round(demo.target * FPS);
  console.log(`     frames ${frames}/${want}${frames < want - 2 ? "  <-- SHORT, capture dropped frames" : ""}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const framingOnly = argv.includes("--framing");
  const which = argv.filter((a) => !a.startsWith("--"));
  const keys = !which.length || which[0] === "all" ? ["sap", "tvp", "sfvv"] : which;

  let server = null;
  if (!process.env.DEMOCAP_URL) {
    server = await serveDemos(DEMOS_ROOT, PORT).catch((e) => {
      if (e.code !== "EADDRINUSE") throw e;
      console.log(`  port ${PORT} already in use -- reusing whatever is on it`);
      console.log("  NOTE: if that is python's http.server, seeking will not work (no byte ranges)");
      return null;
    });
    if (server) console.log(`serving ${DEMOS_ROOT} on ${BASE} (byte ranges enabled)`);
  }

  try {
    for (const k of keys) {
      if (!DEMOS[k]) throw new Error("unknown demo: " + k);
      console.log(`\n=== ${k} ===`);
      await capture(k, { framingOnly });
    }
  } finally {
    if (server) server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
