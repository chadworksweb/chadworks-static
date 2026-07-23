# lab/

Experiments that are NOT part of the site.

Next builds `src/app` and `public`. This folder is neither, so nothing in here
can reach a build, an export, or production. That is the point: a lab you have
to remember to exclude is a lab that eventually ships by accident.

Run one with a static server pointed at this folder:

    npx serve lab -l 8900
    # then open http://localhost:8900/<experiment>/

## codefall/ -- can the hero art survive hydration?

**Question.** The falling code freezes for ~434ms on load. `requestAnimationFrame`
and canvas 2D both run on the main thread, and that is exactly when the browser
is parsing 1,148 KB of application JavaScript. Can the animation be moved off
the main thread so it is immune?

**Setup.** Two panes running the byte-identical animation from `core.js`. Left
drives it from the page (what ships today). Right transfers an `OffscreenCanvas`
to `worker.js` and never touches it again. A button blocks the main thread with
a busy loop for 450ms, matching the measured cost of the real bundle.

`core.js` is deliberately DOM-free: no `window`, no `document`, pointer position
arrives as plain numbers. If the animation could not be expressed that way, it
could not be moved, and the experiment would have ended there.

**Result, four consecutive 450ms blocks:**

| | Frames drawn | Longest gap between frames |
|---|---|---|
| Main thread | 94 | **472ms** |
| Worker + OffscreenCanvas | 150 | **35ms** |

35ms is one frame at the 30fps throttle. The worker did not drop a single frame
while the main thread was blocked for nearly two seconds in total.

**The cursor orb survives the move.** It was the real risk in the port, because
the worker cannot see the DOM: pointer position has to travel by `postMessage`.
Verified visually with the pointer held over the worker's canvas; glyphs displace
radially around the sphere and scale up over its near face exactly as they do on
the main thread.

**Known constraints for the port:**
- `transferControlToOffscreen()` can be called ONCE per canvas element. A React
  remount must not call it twice; the call has to be guarded by a ref or the
  canvas has to be kept out of React's reconciliation.
- After transfer the page CANNOT draw to that canvas at all. Every state change
  (resize, pause, reduced motion, pointer) becomes a message.
- The worker needs its own copy of the font family string; it cannot read
  `getComputedStyle`. Pass the resolved `--font-mono` value in the init message.
- `importScripts` needs the core at a real URL, so the production version wants
  either a static `/codefall-worker.js` or a Blob URL with the source inlined.
  A Blob URL keeps the pre-hydration seed to zero extra requests.
