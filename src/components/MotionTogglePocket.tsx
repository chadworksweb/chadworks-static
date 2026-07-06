"use client";

// A literal copy of GlobalMotionToggle, parked in the bottom-right "pocket"
// (where chat buttons usually sit) instead of the header. Rendered site-wide
// from the layout so every page gets a persistent global motion pause. Pages
// whose isolated header ALREADY carries the toggle (the one-pager homepage)
// render nothing here -- see ISOLATED_HEADER_ROUTES.
//
// Under an unforced reduced-motion preference it becomes "Start motion" (forces
// the full experience for the session); otherwise it is the pause/resume toggle.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  setMotionPaused,
  isReducedMotionUnforced,
  enableForcedMotion,
} from "@/lib/motion";

// Routes whose own (isolated) header already shows the motion toggle, so the
// pocket copy is suppressed to avoid two buttons on the same page.
const ISOLATED_HEADER_ROUTES = new Set<string>(["/"]);

export function MotionTogglePocket() {
  const pathname = usePathname();
  const [paused, setPaused] = useState(false);
  const [offerStart, setOfferStart] = useState(false);

  useEffect(() => {
    setOfferStart(isReducedMotionUnforced());
  }, []);

  if (ISOLATED_HEADER_ROUTES.has(pathname)) return null;

  if (offerStart) {
    return (
      <button
        type="button"
        className="svc-hero__art-toggle cw-motion-toggle cw-motion-toggle--pocket"
        onClick={enableForcedMotion}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="svc-hero__art-toggle-label">Start motion</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="svc-hero__art-toggle cw-motion-toggle cw-motion-toggle--pocket"
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        setMotionPaused(next);
      }}
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
  );
}
