"use client";

// WHEEL INPUT for the reel: turns raw wheel events into a continuous travel figure,
// measured in ITEMS, that the reel smooths toward.
//
// HISTORY, because this was overshot repeatedly and the record is the point:
//
//   Original      one step per event behind a flat 420ms lock, `deltaY` discarded.
//                 Chad: "scroll jacked a bit... needs to be looser."
//   Overshoot     accumulate real delta, spend it in whole steps, no lock. A hard
//                 flick threw the strip 8 items. Chad: "it moves TOO fast now."
//   Second try    cheap first step, expensive later steps. Still wrong: a single
//                 physical notch fires MORE THAN ONE wheel event on Chad's setup,
//                 and each one landed outside the 200ms gesture gap, so each claimed
//                 its own cheap first step. One notch moved two items.
//   Lock, shorter  back to the original model at 300ms.
//   Now (2026-07-29, Chad: "it still scrolls in chunks, no glassy smooth retina
//                 vibes") the lock is GONE.
//
// WHY THE LOCK HAD TO GO. It was there to make "one notch = one item" true no matter
// how many events a notch emits. It did that, and the cost was everything that makes
// motion feel continuous: every event inside the window was discarded, including a
// trackpad's entire inertia tail, so a gesture could only ever produce one discrete
// hop. Chunky was not a tuning problem, it was the model.
//
// WHAT REPLACES IT. Nothing is swallowed. Every event adds to a target the reel eases
// toward, so rapid input ACCUMULATES and blends into one continuous travel instead of
// queueing as separate hops. Runaway is prevented by capping how far the target may
// sit ahead of where the strip actually is (MAX_LEAD_ITEMS), which is the piece the
// earlier accumulating attempt lacked -- that is what threw it 8 items, not the
// accumulation itself.
//
// "One notch = one item" is no longer promised, and cannot be. It is traded on
// purpose for continuity, which is what was asked for. A notch still moves about one
// item; two fast notches move about two, blended into a single glide.

/** Wheel deltas at or above this read as a mouse notch; below, as a trackpad glide. */
const NOTCH_PX = 45;

/** What one mouse notch is worth, in items. */
const NOTCH_ITEMS = 1;

/** Trackpad travel: pixels of finger movement per item. Higher = heavier. */
const TRACKPAD_PX_PER_ITEM = 260;

/** Ignore sub-pixel noise, so a resting hand cannot nudge it. */
const MIN_DELTA = 2;

/** Chrome reports lines/pages rather than pixels on some mice; normalise to px. */
function toPixels(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 16; // lines
  if (e.deltaMode === 2)
    return e.deltaY * (typeof window === "undefined" ? 800 : window.innerHeight);
  return e.deltaY;
}

export type WheelScroller = {
  /** Feed it a wheel event; it calls back with a signed travel in ITEMS (never 0). */
  handle: (e: WheelEvent) => void;
  /** Milliseconds since the last accepted event, for settle detection. */
  quietFor: (now: number) => number;
  reset: () => void;
};

/**
 * `onTravel` receives a signed distance in ITEMS (fractional for a trackpad, about
 * 1 per mouse notch). It is a RELATIVE amount to add, not an absolute destination.
 */
export function createWheelScroller(onTravel: (items: number) => void): WheelScroller {
  let lastAt = 0;

  return {
    handle(e: WheelEvent) {
      const px = toPixels(e);
      if (Math.abs(px) < MIN_DELTA) return;
      lastAt = performance.now();
      // A mouse notch is quantised and sparse, so its SIZE carries no information
      // worth keeping -- only its direction. A trackpad's delta is the finger, so it
      // is spent as-is and the motion tracks the hand.
      const items =
        Math.abs(px) >= NOTCH_PX
          ? Math.sign(px) * NOTCH_ITEMS
          : px / TRACKPAD_PX_PER_ITEM;
      onTravel(items);
    },
    quietFor(now: number) {
      return lastAt === 0 ? Infinity : now - lastAt;
    },
    reset() {
      lastAt = 0;
    },
  };
}

/** How far ahead of the strip the target may ever sit. Caps queued travel. */
export const MAX_LEAD_ITEMS = 1.5;

/**
 * THE SPEED LIMIT, in items per second, and the dial that actually governs how fast
 * the strip slides.
 *
 * It exists because capping the LEAD does not cap the speed (Chad, 2026-07-29: "the
 * actual sliding, its so fast"). Under exponential smoothing velocity is `K * distance`,
 * so a 2.5-item lead at K=11 meant sustained scrolling accelerated to about 27 items a
 * second. The lead cap stopped the strip running far ahead and then let it cover that
 * ground absurdly fast, which is not a cap at all.
 *
 * 3.2/sec puts one item at roughly 310ms, which is about where the old fixed-duration
 * glide sat -- that pace was never the complaint, the chunkiness was.
 */
export const MAX_ITEMS_PER_SEC = 3.2;

/**
 * Frame-rate independent easing factor. `dt * k` is NOT frame-rate independent and
 * was one of the defects in the original reel motion; this is the correct form.
 *
 * With the speed limit above in play this no longer sets the travel pace -- it shapes
 * the ARRIVAL, easing the last fraction of an item so the strip settles rather than
 * stopping dead. Higher = tighter, lower = floatier.
 */
export const SMOOTH_K = 11;

/** No wheel input for this long means the gesture is over: snap to the nearest item. */
export const SETTLE_QUIET_MS = 110;
