// Global motion-pause store (one-pager). A single sticky toggle flips this and
// every motion source honors it: CSS animations via the `cw-motion-paused`
// class on <html>, and the canvas/WebGL loops (CodeFall, Ribbon, GemstoneCW)
// by subscribing here and parking their rAF. Default is running, so pages that
// never mount the toggle are unaffected.

// -----------------------------------------------------------------------------
// Forced motion (reduced-motion override). A visitor whose OS asks for reduced
// motion normally gets the static site: CSS reduced-motion blocks are gated on
// `html:not(.cw-force-motion)`, and every JS loop bails on prefersReducedMotion().
// The first-visit invite (and the toggle) let them opt INTO the full motion
// experience. Forcing persists for the session and flips the `cw-force-motion`
// class on <html> so both layers ignore the OS preference. Because the JS loops
// decide at mount, enabling force reloads the page so every gate re-reads clean.
const FORCE_KEY = "cw-force-motion";

export function isMotionForced(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("cw-force-motion");
}

// The one gate every JS motion source should call instead of matchMedia directly.
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (isMotionForced()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// True when the OS asks for reduced motion AND the visitor has not opted in yet.
// Drives the invite popup and the toggle's "Start motion" affordance.
export function isReducedMotionUnforced(): boolean {
  if (typeof window === "undefined") return false;
  return (
    !isMotionForced() &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Opt into full motion for the session. Reloads so mount-time gates re-read.
export function enableForcedMotion() {
  try {
    sessionStorage.setItem(FORCE_KEY, "1");
  } catch {}
  document.documentElement.classList.add("cw-force-motion");
  window.location.reload();
}

let paused = false;
const subs = new Set<(v: boolean) => void>();

export function isMotionPaused() {
  return paused;
}

export function setMotionPaused(v: boolean) {
  if (v === paused) return;
  paused = v;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("cw-motion-paused", v);
  }
  subs.forEach((f) => f(v));
}

// Subscribe to changes; returns an unsubscribe. The callback fires on every
// toggle (not immediately) -- read isMotionPaused() for the current value.
export function subscribeMotion(f: (v: boolean) => void) {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
}
