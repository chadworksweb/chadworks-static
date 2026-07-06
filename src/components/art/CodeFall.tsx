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
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";

// Code-flavored glyphs (drawn in the brand mono face). No CJK -- the mono font
// has no katakana, which would render as tofu boxes.
const GLYPHS =
  "01<>/{}[]()=+-*;:&|!?$#@.abcdefghijklmnopqrstuvwxyz0123456789{}</>";

// Brand stops, 0-255 RGB.
const HEAD: [number, number, number] = [102, 41, 188]; // #6629bc vivid violet (head)
const TRAIL_NEAR: [number, number, number] = [36, 57, 137]; // #243989 deep indigo
const TRAIL_FAR: [number, number, number] = [174, 185, 234]; // #aeb9ea periwinkle (dissolving tail)


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

    layout();
    if (reduce) {
      renderStatic();
    }

    const ro = new ResizeObserver(() => {
      const wasRunning = running;
      stop();
      layout();
      if (reduce) renderStatic();
      else if (wasRunning) start();
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
    // of the canvas, and releases when the pointer leaves the document.
    // Over the orb field the pointer is hidden -- the orb itself reads as the
    // cursor. (cursor is inherited, so set it on <body>.)
    let cursorOn = false;
    const setCursor = (on: boolean) => {
      if (on === cursorOn) return;
      cursorOn = on;
      document.body.style.cursor = on ? "none" : "";
    };
    const onMove = (e: MouseEvent) => {
      const lx = e.clientX - rectL;
      const ly = e.clientY - rectT;
      mTargetX = lx;
      mTargetY = ly;
      const inZone =
        lx > -ORB_R && lx < cssW + ORB_R && ly > -ORB_R && ly < cssH + ORB_R;
      orbTargetStr = inZone ? 1 : 0;
      // Hide the pointer ONLY while strictly over the hero canvas -- never let it
      // bleed into the header above or the next section below the hero.
      const overCanvas = lx >= 0 && lx <= cssW && ly >= 0 && ly <= cssH;
      setCursor(overCanvas);
    };
    const onLeave = () => {
      orbTargetStr = 0;
      setCursor(false);
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
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div className="home-hero__codefall" ref={wrapRef} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      {!hideToggle && (
      <button
        type="button"
        className="svc-hero__art-toggle home-hero__codefall-toggle"
        onClick={() => setPaused((p) => !p)}
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
