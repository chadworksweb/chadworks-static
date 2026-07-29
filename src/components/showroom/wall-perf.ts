// TEMPORARY DIAGNOSTIC -- strip before shipping.
//
// Marks the serial chain that has to complete before the baked wall is on screen,
// so the cold-load delay can be attributed instead of guessed at:
//
//   mode-webgl -> chunk-eval -> canvas-created -> bitmap-ready -> wall-committed
//
// Off unless the URL carries ?wallperf. `performance.mark` is cheap, but the point
// is that a normal visit runs zero of this.
//
// Read by scripts/wall-timing.mjs.

let on: boolean | null = null;

function enabled(): boolean {
  if (on !== null) return on;
  if (typeof window === "undefined") return false;
  on = window.location.search.includes("wallperf");
  return on;
}

export function wmark(name: string): void {
  if (!enabled()) return;
  try {
    performance.mark(`wall:${name}`);
  } catch {
    /* marks are diagnostics; never let one break the page */
  }
}
