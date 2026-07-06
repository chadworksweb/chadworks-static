"use client";

// =====================================================================
// PixelDivider -- a thin, brand-gradient PIXEL row used as a section divider.
// Inspired by the page-transition wipe (cw-wipe): a chunky run of tiles, each
// colored as one pixel of the brand gradient (indigo -> periwinkle -> lavender).
//
// SCROLL RESPONSIVE: the tiles fill in strict left-to-right order as the divider
// moves up through a reveal band, and empty back out as it scrolls down -- the
// fill is driven by scroll position, not a one-shot trigger. Thresholds are
// perfectly sequential (no jitter), so pixels appear one after another with none
// dropped or delayed. Honors reduced-motion and the global motion-pause store
// (shows fully assembled + static in both cases).
// =====================================================================

import { useEffect, useRef, useState } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";

// Brand display-gradient stops (match PageTransition / --grad-deep/mid/peak).
const STOPS = [
  [36, 57, 137],
  [86, 104, 173],
  [229, 210, 244],
];
function gradAt(p: number) {
  const x = Math.max(0, Math.min(1, p));
  const [a, b, t] =
    x <= 0.5 ? [STOPS[0], STOPS[1], x / 0.5] : [STOPS[1], STOPS[2], (x - 0.5) / 0.5];
  const c = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}

const TILE = 21; // px, target tile width -> tile count from width (~30% wider)

type Cell = { bg: string; t: number };

export function PixelDivider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [cells, setCells] = useState<Cell[]>([]);

  // Build the pixel row, sized to the current width (rebuilt on resize).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const build = () => {
      const w = row.clientWidth || window.innerWidth;
      const n = Math.max(8, Math.round(w / TILE));
      const next: Cell[] = [];
      for (let i = 0; i < n; i++) {
        next.push({
          bg: gradAt(n > 1 ? i / (n - 1) : 0),
          t: i / Math.max(1, n - 1), // strict left-to-right order, no jitter
        });
      }
      row.style.setProperty("--n", String(n));
      setCells(next);
    };
    build();
    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, []);

  // Drive the per-tile fill off scroll, but with MOMENTUM: scroll sets a target
  // progress; a displayed value eases toward it on its own rAF loop, so the fill
  // keeps advancing for ~750ms after the scroll stops instead of being pinned to
  // the scroll pixel-by-pixel. The loop self-parks once settled.
  useEffect(() => {
    const root = rootRef.current;
    const row = rowRef.current;
    if (!root || !row || cells.length === 0) return;

    const reduce = prefersReducedMotion();
    const nodes = Array.from(row.children) as HTMLElement[];
    const TAU = 160; // ms time-constant -> ~750ms to settle after scroll stops

    let current = 0;
    let lastRendered = -1;
    let raf = 0;
    let lastTs = 0;

    const targetNow = () => {
      if (reduce || isMotionPaused()) return 1; // motion off -> fully assembled
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Driven by the divider's TOP (leading) edge as it travels up the viewport,
      // so the tall full-bleed band starts filling the moment it enters. progress
      // 0 once the top edge is ~1% up from the bottom; progress 1 not until it is
      // ~95% up, near the top edge.
      const start = vh * 0.99; // top edge ~1% up from the bottom -> progress 0
      const end = vh * 0.05; // top edge ~95% up, near the top -> progress 1
      const y = rect.top;
      return Math.max(0, Math.min(1, (start - y) / (start - end)));
    };

    // `force` bypasses the delta guard: the parking snap (<0.002) is smaller
    // than the guard (0.003), so without it the final frame -- the only one
    // where current hits exactly 1 or 0 -- never renders and the last tile
    // sticks (seen as one dead tile at the row's right edge).
    const render = (force = false) => {
      if (!force && Math.abs(current - lastRendered) < 0.003) return;
      lastRendered = current;
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.toggle("is-on", current >= cells[i].t);
      }
    };

    const frame = (ts: number) => {
      const dt = lastTs ? ts - lastTs : 16;
      lastTs = ts;
      const target = targetNow();
      if (reduce || isMotionPaused()) {
        current = target; // snap when motion is off
      } else {
        current += (target - current) * (1 - Math.exp(-dt / TAU));
        if (Math.abs(target - current) < 0.002) current = target;
      }
      render(current === target);
      if (current !== target) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        lastTs = 0;
      }
    };

    const kick = () => {
      if (!raf) {
        lastTs = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    // Initial paint: snap to the current scroll state (no entrance jump on load).
    current = targetNow();
    render();

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    const unsub = subscribeMotion(kick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      unsub();
    };
  }, [cells]);

  return (
    <div className="cw-pxdiv" ref={rootRef} aria-hidden="true">
      <div className="cw-pxdiv__row" ref={rowRef}>
        {cells.map((cell, i) => (
          <span key={i} className="cw-pxdiv__cell" style={{ background: cell.bg }} />
        ))}
      </div>
    </div>
  );
}

export default PixelDivider;
