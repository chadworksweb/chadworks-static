"use client";

// =====================================================================
// ScrollFade -- fades a decorative element up as it travels toward the middle of
// the viewport and back down as it leaves, symmetrically, in both scroll
// directions.
//
// Why rAF and not CSS: a `view()` scroll timeline would be the right mechanism,
// but it is not available widely enough to BE the mechanism (Safari and Firefox
// have no view timelines, and plenty of Chromium builds still report
// `CSS.supports("animation-timeline: view()")` as false). Why rAF and not a
// scroll listener: scroll events fire at their own cadence, not the frame's, so
// writing opacity from one lands a step behind the paint and reads as judder.
// A rAF loop writes exactly once per frame, in sync with what the compositor is
// about to draw.
//
// The curve is a flat hold through the middle with smoothstepped shoulders, so
// the element is solid for the whole stretch that matters and only the approach
// and the exit are soft. A straight linear ramp edge-to-edge is what makes a
// fade read as cheap.
//
// Opacity is the only property touched (compositor-only, no layout, no paint).
// The loop parks via IntersectionObserver when the element is nowhere near the
// viewport, obeys the global motion toggle, and steps aside entirely for a
// reduced-motion reader -- in every one of those cases the element is left fully
// visible, never mid-fade.
// =====================================================================

import { useEffect, useRef, type ReactNode } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";

// Fraction of the pass spent on each shoulder. The middle (1 - 2 * SHOULDER) is
// held at full opacity, so the element is solid for the whole stretch that
// matters and only the approach and the exit are soft.
const SHOULDER = 0.26;

// Below this delta the write is skipped: sub-1% opacity changes are invisible
// and only cost a style recalc.
const EPSILON = 0.004;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function ScrollFade({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // A reduced-motion reader gets the element as-is, at rest, fully visible.
    if (prefersReducedMotion()) return;

    let raf = 0;
    let running = false;
    let last = -1;

    // Progress is measured on the TRACK, not on the faded element. A sticky
    // element is clamped inside its container, so its own box never travels the
    // full pass -- measuring it means the fade can only ever reach partway
    // (0.74 in, here) before the element is already parked. The track is the
    // container that genuinely crosses the viewport, so the shoulders resolve
    // to a real zero at both ends.
    const track = (el.closest("[data-scroll-fade-track]") as HTMLElement) ?? el;

    const apply = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 the instant the track's top edge reaches the bottom of the viewport,
      // 1 the instant its bottom edge clears the top.
      const p = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, p));
      const shoulder =
        clamped < SHOULDER
          ? clamped / SHOULDER
          : clamped > 1 - SHOULDER
            ? (1 - clamped) / SHOULDER
            : 1;
      const next = smoothstep(Math.max(0, Math.min(1, shoulder)));
      if (Math.abs(next - last) > EPSILON) {
        last = next;
        el.style.opacity = String(next);
      }
    };

    const tick = () => {
      apply();
      if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    let visible = false;
    let paused = isMotionPaused();
    const sync = () => {
      if (visible && !paused) {
        start();
      } else {
        stop();
        // Never leave it stranded mid-fade.
        if (paused) {
          last = 1;
          el.style.opacity = "1";
        }
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        sync();
      },
      { root: null, rootMargin: "60% 0px 60% 0px", threshold: 0 }
    );
    io.observe(el);
    const unsub = subscribeMotion((v) => {
      paused = v;
      sync();
    });

    return () => {
      stop();
      unsub();
      io.disconnect();
      el.style.opacity = "";
    };
  }, []);

  return (
    <div className={className} ref={ref} aria-hidden="true">
      {children}
    </div>
  );
}

export default ScrollFade;
