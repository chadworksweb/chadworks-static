"use client";

// First-visit invite for visitors whose OS asks for reduced motion. The site
// respects that preference by default (static everywhere), but the work here is
// built to move -- this offers a one-time, per-session opt-in to the full
// experience. VIEW MOTION forces motion for the session (and reloads so every
// mount-time gate re-reads clean); KEEP MOTION OFF dismisses and stays static.
// The card itself never animates, so it honors the very preference it asks about.

import { useEffect, useRef, useState } from "react";
import { isReducedMotionUnforced, enableForcedMotion } from "@/lib/motion";

const SEEN_KEY = "cw-motion-invite";

export function MotionInvite() {
  const [open, setOpen] = useState(false);
  const goRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isReducedMotionUnforced()) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    goRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="cw-motion-invite"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cw-motion-invite-title"
    >
      <div className="cw-motion-invite__card">
        <h2 id="cw-motion-invite-title" className="cw-motion-invite__title">
          You have reduced motion turned on
        </h2>
        <p className="cw-motion-invite__body">
          The chadworks&trade; website was designed to showcase cutting-edge web
          design and development through ambient and gentle motion, but we
          respect your device&apos;s &ldquo;reduce motion&rdquo; settings. I
          encourage you to click the button below to see the site in its
          intended state.
        </p>
        <div className="cw-motion-invite__actions">
          <button
            ref={goRef}
            type="button"
            className="cw-motion-invite__btn cw-motion-invite__btn--go"
            onClick={enableForcedMotion}
          >
            VIEW MOTION
          </button>
          <button
            type="button"
            className="cw-motion-invite__btn cw-motion-invite__btn--stay"
            onClick={dismiss}
          >
            KEEP MOTION OFF
          </button>
        </div>
      </div>
    </div>
  );
}
