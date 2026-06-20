// Global motion-pause store (one-pager). A single sticky toggle flips this and
// every motion source honors it: CSS animations via the `cw-motion-paused`
// class on <html>, and the canvas/WebGL loops (CodeFall, Ribbon, GemstoneCW)
// by subscribing here and parking their rAF. Default is running, so pages that
// never mount the toggle are unaffected.

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
