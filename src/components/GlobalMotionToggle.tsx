"use client";

// The single, always-sticky motion toggle for the one-pager. Fixed top-right;
// flips the global motion store (CSS animations + every canvas loop). Replaces
// the per-section pause buttons, which are hidden on the one-pager.

import { useState } from "react";
import { setMotionPaused } from "@/lib/motion";

export function GlobalMotionToggle() {
  const [paused, setPaused] = useState(false);

  return (
    <button
      type="button"
      className="svc-hero__art-toggle cw-motion-toggle"
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
