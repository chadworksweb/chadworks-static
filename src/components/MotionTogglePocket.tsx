"use client";

// A literal copy of GlobalMotionToggle, parked in the bottom-right "pocket"
// (where chat buttons usually sit) instead of the header. Rendered site-wide
// from the layout so every page gets a persistent global motion pause. Pages
// whose isolated header ALREADY carries the toggle (the one-pager homepage)
// render nothing here -- see ISOLATED_HEADER_ROUTES.
//
// When the hero carries its OWN pause button (any heroArt page), this pocket
// copy stays stowed until the hero has fully scrolled out of view, so the page
// never shows two live motion buttons at once.
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
// pocket copy is suppressed to avoid two buttons on the same page. Empty now that
// the homepage uses the real sitewide header + this pocket toggle like every page.
const ISOLATED_HEADER_ROUTES = new Set<string>();

// Routes with no animated content worth pausing, so the pocket toggle is hidden
// entirely (nothing for it to control). Matched with the trailing slash trimmed.
const MOTIONLESS_ROUTES = new Set<string>(["/faqs"]);

export function MotionTogglePocket() {
  const pathname = usePathname();
  const [paused, setPaused] = useState(false);
  const [offerStart, setOfferStart] = useState(false);
  // True while a hero that carries its own pause button is still in view.
  const [heroInView, setHeroInView] = useState(false);
  // False until the hero check below has run once. Until then the pocket is held
  // hidden (no transition) so it never flashes in and then stows on a hero page.
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    setOfferStart(isReducedMotionUnforced());
  }, []);

  useEffect(() => {
    // The hero's own toggle is a .svc-hero__art-toggle WITHOUT .cw-motion-toggle
    // (which only the global/pocket copies carry). Gate the pocket only when
    // that button is actually rendered (visible; offsetParent is null when the
    // <=900px rule display:none's it, so mobile keeps the pocket as normal).
    const heroToggle = document.querySelector(
      ".svc-hero__art-toggle:not(.cw-motion-toggle)"
    );
    const hero =
      heroToggle instanceof HTMLElement && heroToggle.offsetParent !== null
        ? heroToggle.closest(".svc-hero, .home-hero")
        : null;
    if (!hero) {
      setHeroInView(false);
      setMeasured(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting);
        setMeasured(true);
      },
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  if (ISOLATED_HEADER_ROUTES.has(pathname)) return null;
  if (MOTIONLESS_ROUTES.has(pathname.replace(/\/$/, "") || "/")) return null;

  // The start-motion invite is never stowed -- under reduced motion the hero
  // art (and its toggle) are hidden, so there is no second button to clash with.
  const stowed = !offerStart && heroInView;
  const className =
    "svc-hero__art-toggle cw-motion-toggle cw-motion-toggle--pocket" +
    (measured ? "" : " is-premeasure") +
    (stowed ? " is-stowed" : "");

  if (offerStart) {
    return (
      <button
        type="button"
        className={className}
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
      className={className}
      aria-pressed={paused}
      aria-hidden={stowed}
      tabIndex={stowed ? -1 : undefined}
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
