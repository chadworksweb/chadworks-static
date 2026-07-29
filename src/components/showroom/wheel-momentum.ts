"use client";

// WHEEL STEPPING for the reel and the right rail, which have to feel like one
// surface: they are two views of the same selection.
//
// HISTORY, because this was overshot once and the record is the point (2026-07-29):
//
//   Original      one step per event behind a flat 420ms lock, `deltaY` discarded.
//                 Chad: "scroll jacked a bit... needs to be looser."
//   Overshoot     accumulate real delta, spend it in whole steps, no lock. A hard
//                 flick threw the strip 8 items. Chad: "it moves TOO fast now."
//   Second try    cheap first step, expensive later steps. Still wrong: a single
//                 physical notch fires MORE THAN ONE wheel event on Chad's setup,
//                 and each one landed outside the 200ms gesture gap, so each claimed
//                 its own cheap first step. One notch moved two items.
//   Now           the original model, with the lock shortened. Chad: "dial it way
//                 back to where it was before I asked and then bump it up from there."
//
// WHY THE LOCK IS BACK. It is the only thing that makes "one notch = one item" true
// regardless of how many events a notch happens to emit, which varies by mouse,
// driver and OS smooth-scrolling. An accumulator cannot promise that, because it
// cannot tell one physical notch from two.
//
// THE ONE DIAL is STEP_LOCK_MS. Lower = faster and looser, higher = heavier. It is
// the whole feel of this file; nothing else needs touching.

/** Was 420ms before any of this. 300 is the "bump up from there". */
const STEP_LOCK_MS = 300;

/** Ignore trackpad jitter and sub-pixel noise, so a resting hand cannot nudge it. */
const MIN_DELTA = 8;

/** Chrome reports lines/pages rather than pixels on some mice; normalise to px. */
function toPixels(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 16; // lines
  if (e.deltaMode === 2)
    return e.deltaY * (typeof window === "undefined" ? 800 : window.innerHeight);
  return e.deltaY;
}

export type WheelStepper = {
  /** Feed it a wheel event; it calls back with +1 or -1 when a step is due. */
  handle: (e: WheelEvent) => void;
  /** Drop any pending lock (use when the surface is swapped or unmounted). */
  reset: () => void;
};

/**
 * `onSteps` is called with +1 or -1 (never 0), at most once per STEP_LOCK_MS.
 *
 * The signature keeps the signed-count shape of the accumulating version, so the call
 * sites do not care which model is in here and the dial can be changed without
 * touching them.
 */
export function createWheelStepper(onSteps: (steps: number) => void): WheelStepper {
  let lockUntil = 0;

  return {
    handle(e: WheelEvent) {
      const px = toPixels(e);
      if (Math.abs(px) < MIN_DELTA) return;
      const now = performance.now();
      // Everything inside the lock is swallowed -- including the extra events a single
      // notch emits, and a trackpad's whole inertia tail.
      if (now < lockUntil) return;
      lockUntil = now + STEP_LOCK_MS;
      onSteps(px > 0 ? 1 : -1);
    },
    reset() {
      lockUntil = 0;
    },
  };
}
