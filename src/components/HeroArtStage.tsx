"use client";

// Client island for the decorative hero art: renders the chips (passed as
// children) plus a pause/play toggle in the hero's top-right. Pausing adds a
// class that sets `animation-play-state: paused` on the rising chips.

import { useState } from "react";

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function HeroArtStage({
  children,
  hideToggle = false,
}: {
  children: React.ReactNode;
  // One-pager: hide this stage's own button; the global sticky toggle pauses
  // the chips via the `cw-motion-paused` class (CSS animation-play-state).
  hideToggle?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <div
        className={`svc-hero__art${paused ? " svc-hero__art--paused" : ""}`}
        aria-hidden="true"
      >
        {children}
      </div>
      {!hideToggle && (
      <button
        type="button"
        className="svc-hero__art-toggle"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
        <span className="svc-hero__art-toggle-label">
          {paused ? "Resume motion" : "Pause motion"}
        </span>
      </button>
      )}
    </>
  );
}
