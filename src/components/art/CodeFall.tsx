"use client";

// Homepage hero art -- a dense "code waterfall" filling the right third of the
// hero, in the same placement model as the /web-development/ rising-chips art
// (.svc-hero__art: far-right column, masked, behind the text). Falling-code
// effect, re-styled premium for the LIGHT brand: vivid violet heads, indigo
// trails dissolving up into periwinkle on a whisper-soft cool backdrop. No neon
// green, no CRT -- this is the brand's own expression of the idea.
//
// Built to the bar of the Ribbon / GradientField pieces: canvas tuned per device
// pixel ratio, the render loop fully parks off-screen via IntersectionObserver,
// re-fits on resize, respects prefers-reduced-motion, and carries a pause toggle.

import { useEffect, useRef, useState } from "react";
import { isMotionPaused, setMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";
import { CODEFALL_WORKER_SOURCE } from "./codefall-source";

// Code-flavored glyphs (drawn in the brand mono face). No CJK -- the mono font
// has no katakana, which would render as tofu boxes.
const GLYPHS =
  "01<>/{}[]()=+-*;:&|!?$#@.abcdefghijklmnopqrstuvwxyz0123456789{}</>";

// Brand stops, 0-255 RGB.
const HEAD: [number, number, number] = [102, 41, 188]; // #6629bc vivid violet (head)
const TRAIL_NEAR: [number, number, number] = [36, 57, 137]; // #243989 deep indigo
const TRAIL_FAR: [number, number, number] = [174, 185, 234]; // #aeb9ea periwinkle (dissolving tail)


// What the inline boot script leaves on window once the worker owns the canvas.
type WorkerHandle = { worker: Worker; url: string; dpr: number };

type Column = {
  head: number; // fractional row index of the leading glyph
  speed: number; // rows per second
  len: number; // trail length in rows
  dim: number; // depth-dimming multiplier (some columns sit back)
  chars: string[]; // per-row glyph buffer (index 0 = head), mutates as it falls
  lastRow: number; // last integer head row we advanced past
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------------------
// WORKER BOOT -- the falling code starts before the bundle, and off the main
// thread so nothing the bundle does can interrupt it.
//
// This inline script runs at HTML parse time. It hands the canvas to a worker
// via transferControlToOffscreen() and starts it from a Blob URL, so there is
// no module graph, no bundle and no extra request between the HTML arriving and
// the first glyph appearing.
//
// WHY OFF-THREAD. requestAnimationFrame and canvas 2D both run on the main
// thread, and the main thread is blocked for ~434ms while the browser parses
// this site's 1,148 KB of application JavaScript. Anything drawn from the page
// freezes solid through that window no matter how early it starts, which is
// exactly what happened when the art was first made to appear early: it showed
// up, then stuttered. Measured in lab/codefall/, across four consecutive 450ms
// blocks: page-driven longest gap 472ms, worker longest gap 35ms (one frame at
// the 30fps throttle).
//
// AFTER TRANSFER THE PAGE CANNOT DRAW TO THIS CANVAS AT ALL, and
// canvas.getContext("2d") THROWS on it. The component below therefore checks
// for the handle before it touches the context, and every state change (resize,
// pause, off-screen parking, pointer) becomes a message.
//
// If OffscreenCanvas or Worker is missing, this bails WITHOUT setting the
// handle and without transferring, and the component falls back to drawing on
// the main thread exactly as it always did.
const SEED_SCRIPT = `(function(){function boot(){try{
var w=document.querySelector('.home-hero__codefall');if(!w)return false;
var c=w.querySelector('canvas');if(!c)return false;
if(c.getAttribute('data-cw-codefall'))return true;
// No OffscreenCanvas or no Worker: stop, leave the handle unset, let the
// component draw on the main thread. Returning true prevents a pointless retry.
if(!c.transferControlToOffscreen||typeof Worker==='undefined')return true;
// Every "not ready yet" path must return FALSE so the DOMContentLoaded retry
// still fires. This sits at the top of the hero and the hero has no resolved
// height until the markup below it parses, so the first attempt always reads
// clientHeight 0 and has to come back later.
var W=w.clientWidth,H=w.clientHeight;if(!W||!H)return false;
var d=Math.min(window.devicePixelRatio||1,2);
// The worker cannot read getComputedStyle, so the resolved font family has to
// travel with the init message.
var m=getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim()||'monospace';
var red=window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('cw-force-motion');
var url=URL.createObjectURL(new Blob([${JSON.stringify(CODEFALL_WORKER_SOURCE)}],{type:'application/javascript'}));
var wk=new Worker(url);
var off=c.transferControlToOffscreen();
wk.postMessage({type:'init',canvas:off,cssW:W,cssH:H,dpr:d,font:m,animate:!red},[off]);
c.setAttribute('data-cw-codefall','1');
window.__CW_CODEFALL={worker:wk,url:url,dpr:d};
return true}catch(e){return true}}
// React can HOIST an inline script above the markup it was written next to
// (seen on this codebase 2026-07-23), so if the canvas is not parsed yet, wait.
if(!boot()){document.addEventListener('DOMContentLoaded',boot)}})();`;

export function CodeFall({ hideToggle = false }: { hideToggle?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Honor the global motion toggle (one-pager): keep local state in sync so the
  // rAF parks and the local button (when shown) reflects the global state.
  useEffect(() => {
    setPaused(isMotionPaused());
    return subscribeMotion((v) => setPaused(v));
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // ---- WORKER MODE -------------------------------------------------------
    // The inline boot script already transferred this canvas and started the
    // animation. React never draws here; it only relays state. This branch MUST
    // come before getContext("2d"), which THROWS on a transferred canvas.
    //
    // The data attribute is checked as well as the handle: if React ever
    // remounted and rebuilt the canvas element, the new one would not carry it,
    // and falling through to the main-thread path is the correct recovery.
    const handle = (window as unknown as { __CW_CODEFALL?: WorkerHandle })
      .__CW_CODEFALL;
    if (handle && canvas.getAttribute("data-cw-codefall")) {
      const post = (m: Record<string, unknown>) => handle.worker.postMessage(m);

      const ro = new ResizeObserver(() => {
        post({ type: "resize", cssW: wrap.clientWidth, cssH: wrap.clientHeight, dpr: handle.dpr });
      });
      ro.observe(wrap);

      // Park the loop unless the hero is near the viewport, the same thing the
      // main-thread path does with its own IntersectionObserver.
      const io = new IntersectionObserver(
        (entries) => post({ type: "parked", value: !entries[0].isIntersecting }),
        { rootMargin: "200px" },
      );
      io.observe(wrap);

      post({ type: "paused", value: isMotionPaused() });
      const unsub = subscribeMotion((v) => post({ type: "paused", value: v }));

      // The worker cannot see the DOM, so the pointer travels as a message, in
      // canvas-local CSS pixels.
      const onMove = (e: MouseEvent) => {
        const b = canvas.getBoundingClientRect();
        post({ type: "pointer", x: e.clientX - b.left, y: e.clientY - b.top, inside: true });
      };
      const onLeave = () => post({ type: "pointer", x: -9999, y: -9999, inside: false });
      document.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);

      return () => {
        ro.disconnect();
        io.disconnect();
        unsub();
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseleave", onLeave);
      };
    }

    // ---- FALLBACK: draw on the main thread (no OffscreenCanvas or no Worker) -
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();

    // Brand mono family from the next/font CSS var (a hashed family name).
    const mono =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-mono")
        .trim() || "monospace";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 0;
    let cssH = 0;
    let colW = 0;
    let rowH = 0;
    let rows = 0;
    let fontPx = 0;
    let columns: Column[] = [];

    // Cursor "orb": the falling code is repelled into a circular void around the
    // pointer, so the bands curve around an invisible sphere. Position is lerped
    // (smooth trailing) and influence eases in/out as the cursor enters/leaves.
    const ORB_R = 59; // sphere radius, CSS px
    let rectL = 0;
    let rectT = 0; // canvas top-left in the viewport (CSS px), cached
    let mTargetX = -9999;
    let mTargetY = -9999; // pointer in canvas-local CSS px
    let orbX = -9999;
    let orbY = -9999; // smoothed orb center
    let orbVX = 0;
    let orbVY = 0; // orb velocity (gives it mass / planetary glide)
    let orbStr = 0;
    let orbTargetStr = 0; // 0..1 influence

    const newColumn = (seedAbove: boolean): Column => {
      const len = Math.round(rand(10, 26));
      return {
        // Seed visible streams across a wide range so more lines are on screen
        // at once (denser), then respawn just above the top as they fall out.
        head: seedAbove ? rand(-rows * 1.1, rows * 0.7) : rand(-len, -1),
        speed: rand(5.5, 13), // unchanged fall speed
        len,
        dim: rand(0.4, 1),
        chars: Array.from({ length: len + rows + 2 }, pick),
        lastRow: -9999,
      };
    };

    const layout = () => {
      cssW = wrap.clientWidth;
      cssH = wrap.clientHeight;
      // Glyph size + row height unchanged; density comes from the tighter
      // column pitch (+1) and the wider initial seed (more lines on screen).
      fontPx = Math.max(13, Math.min(17, Math.round(cssW / 30)));
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      // Resetting canvas size clears all context state -- re-apply transform/font.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontPx}px ${mono}`;
      ctx.textBaseline = "top";
      colW = Math.max(8, Math.ceil(ctx.measureText("0").width) + 1);
      rowH = Math.round(fontPx * 1.18);
      rows = Math.ceil(cssH / rowH) + 2;
      const cols = Math.ceil(cssW / colW);
      columns = Array.from({ length: cols }, () => newColumn(true));
      const b = canvas.getBoundingClientRect();
      rectL = b.left;
      rectT = b.top;
    };

    // Draw a glyph, optionally scaled about its own center (used for the orb's
    // forward protrusion -- glyphs over the near face of the sphere grow).
    const blit = (ch: string, px: number, py: number, scale: number) => {
      if (scale === 1) {
        ctx.fillText(ch, px, py);
        return;
      }
      const cx = px + colW * 0.45;
      const cy = py + fontPx * 0.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.fillText(ch, px - cx, py - cy);
      ctx.restore();
    };

    const drawColumn = (col: Column, x: number) => {
      const headRow = Math.floor(col.head);
      for (let k = 0; k < col.len; k++) {
        const row = headRow - k;
        if (row < 0 || row > rows) continue;
        const ch = col.chars[row] ?? pick();
        let gx = x;
        let gy = row * rowH;

        // --- Orb displacement (no shading) ----------------------------------
        // The orb occupies physical space and bulges toward the viewer. Off-axis
        // glyphs wrap radially around it (orthographic sphere displacement);
        // glyphs over the near face protrude FORWARD -- modelled as a size bump
        // (perspective: closer = larger), peaking dead-center where z = 1. No
        // colour or lighting change.
        let scale = 1;
        if (orbStr > 0.001) {
          const cx = gx + colW * 0.45;
          const cy = gy + fontPx * 0.5;
          const dx = cx - orbX;
          const dy = cy - orbY;
          const r = Math.hypot(dx, dy);
          if (r < ORB_R) {
            const nr = r / ORB_R;
            const rp = ORB_R * Math.sin(nr * (Math.PI / 2)); // wrap radius
            if (r > 0.0001) {
              const f = (rp - r) * orbStr;
              gx += (dx / r) * f;
              gy += (dy / r) * f;
            }
            const nrp = Math.min(1, rp / ORB_R);
            const z = Math.sqrt(Math.max(0, 1 - nrp * nrp)); // 1 at center -> 0 at rim
            scale = 1 + Math.pow(z, 1.2) * 0.65 * orbStr; // forward protrusion
          }
        }

        const t = k / col.len; // 0 at head -> 1 at tail
        if (k === 0) {
          // Leading glyph: vivid, with a soft luminous bloom.
          ctx.shadowColor = "rgba(102, 41, 188, 0.55)";
          ctx.shadowBlur = 7;
          ctx.fillStyle = `rgba(${HEAD[0]}, ${HEAD[1]}, ${HEAD[2]}, ${0.95 * col.dim})`;
          blit(ch, gx, gy, scale);
          ctx.shadowBlur = 0;
        } else {
          // Trail: indigo near the head, dissolving up into faint periwinkle.
          const ct = Math.min(1, t * 1.3);
          const r = lerp(TRAIL_NEAR[0], TRAIL_FAR[0], ct);
          const g = lerp(TRAIL_NEAR[1], TRAIL_FAR[1], ct);
          const b = lerp(TRAIL_NEAR[2], TRAIL_FAR[2], ct);
          const a = Math.pow(1 - t, 1.5) * 0.82 * col.dim;
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`;
          blit(ch, gx, gy, scale);
        }
      }
    };

    const renderStatic = () => {
      // Reduced-motion: one calm, frozen frame (no loop).
      ctx.clearRect(0, 0, cssW, cssH);
      columns.forEach((col, i) => {
        col.head = rand(rows * 0.3, rows * 0.9);
        drawColumn(col, i * colW);
      });
    };

    let raf = 0;
    let last = 0;
    let running = false;
    // Throttle to ~30fps: the rain steps row-by-row, so 60fps is wasted work.
    const FRAME_MS = 1000 / 30;

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame); // schedule next; we may skip drawing
      if (pausedRef.current) {
        last = now;
        return;
      }
      if (last && now - last < FRAME_MS) return; // not time to draw yet
      const dt = last ? Math.min((now - last) / 1000, 0.066) : 0;
      last = now;

      // The orb has MASS: it doesn't snap to the pointer, it accelerates toward
      // it under a soft spring and coasts (underdamped) -- a heavy, planetary
      // glide. Snap into place (and kill momentum) only as it first fades in.
      if (orbStr < 0.01) {
        orbX = mTargetX;
        orbY = mTargetY;
        orbVX = 0;
        orbVY = 0;
      }
      const SPRING = 26; // pull toward the pointer (lower = heavier)
      const FRICTION = 7; // velocity damping (lower = floatier glide)
      orbVX += (mTargetX - orbX) * SPRING * dt;
      orbVY += (mTargetY - orbY) * SPRING * dt;
      const fric = Math.exp(-FRICTION * dt);
      orbVX *= fric;
      orbVY *= fric;
      orbX += orbVX * dt;
      orbY += orbVY * dt;
      orbStr += (orbTargetStr - orbStr) * Math.min(1, dt * 3.5);

      ctx.clearRect(0, 0, cssW, cssH);
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.head += col.speed * dt;
        const hr = Math.floor(col.head);
        if (hr !== col.lastRow) {
          col.lastRow = hr;
          // New glyph at the just-entered head row; occasional flicker upstream.
          if (hr >= 0 && hr < col.chars.length) col.chars[hr] = pick();
          if (Math.random() < 0.5) {
            const j = (Math.random() * col.chars.length) | 0;
            col.chars[j] = pick();
          }
        }
        drawColumn(col, i * colW);
        if (hr - col.len > rows) {
          columns[i] = newColumn(false); // respawn above, staggered
        }
      }
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Paint the columns exactly as they stand, once, synchronously. This is the
    // same frame the loop would draw on its first tick; it does NOT move a
    // single head, so it changes nothing about the motion.
    //
    // Why it has to exist: layout() assigns canvas.width, and assigning canvas
    // width CLEARS the canvas. Without an immediate repaint the canvas sits
    // blank from that assignment until the IntersectionObserver fires and the
    // first requestAnimationFrame lands. That is one frame at best and much
    // longer if the observer is late, and the requirement is that the falling
    // code is never absent for even a moment.
    const paintOnce = () => {
      ctx.clearRect(0, 0, cssW, cssH);
      for (let i = 0; i < columns.length; i++) drawColumn(columns[i], i * colW);
    };

    layout();
    if (reduce) {
      renderStatic();
    } else {
      paintOnce();
    }

    const ro = new ResizeObserver(() => {
      const wasRunning = running;
      stop();
      layout();
      if (reduce) renderStatic();
      else {
        paintOnce(); // same reason: layout() just cleared it
        if (wasRunning) start();
      }
    });
    ro.observe(wrap);

    // Park the loop unless the hero is near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? start : stop)();
      },
      { root: null, rootMargin: "60% 0px 60% 0px", threshold: 0 }
    );
    io.observe(wrap);

    // Pointer field. The canvas is pointer-events:none, so track on window and
    // map to canvas-local coords; influence engages only within ~one orb radius
    // of the canvas, and releases when the pointer leaves the document. The
    // cursor stays visible -- no cursor hiding over the hero.
    const onMove = (e: MouseEvent) => {
      const lx = e.clientX - rectL;
      const ly = e.clientY - rectT;
      mTargetX = lx;
      mTargetY = ly;
      const inZone =
        lx > -ORB_R && lx < cssW + ORB_R && ly > -ORB_R && ly < cssH + ORB_R;
      orbTargetStr = inZone ? 1 : 0;
    };
    const onLeave = () => {
      orbTargetStr = 0;
    };
    const onScroll = () => {
      const b = canvas.getBoundingClientRect();
      rectL = b.left;
      rectT = b.top;
    };
    if (!reduce) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className="home-hero__codefall" ref={wrapRef} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      {/* Paints the first frame before the bundle lands. See SEED_SCRIPT. */}
      <script dangerouslySetInnerHTML={{ __html: SEED_SCRIPT }} />
      {!hideToggle && (
      <button
        type="button"
        className="svc-hero__art-toggle home-hero__codefall-toggle"
        onClick={() => setMotionPaused(!paused)}
        aria-pressed={paused}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        )}
        <span className="svc-hero__art-toggle-label">
          {paused ? "Resume motion" : "Pause motion"}
        </span>
      </button>
      )}
    </>
  );
}
