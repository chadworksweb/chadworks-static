"use client";

// Picks the showroom rendering path by CAPABILITY, not width alone.
//
// TWO paths. There is no third (Chad, 2026-07-29: "lite should NOT EXIST AT ALL").
//   webgl  -- the full immersive drum. Wide screen, a real pointer, WebGL2, and
//             the visitor is not asking us to save data.
//   static -- no showroom at all. The route renders the plain portfolio archive
//             that the server already sent, and none of the three.js bundle is
//             ever fetched. Every phone and every tablet lands here, and so does
//             any desktop without WebGL2.
//
// THERE USED TO BE A `lite` SWIPE GALLERY between them, and it was a trap. Because
// phones and tablets are already caught by the width/pointer gate above, `lite` could
// ONLY ever be served to a DESKTOP -- but it was laid out as a phone swipe track
// (82%-wide cards, horizontal scroll-snap). On a 1600px screen that is a sideways
// scroll of 23 near-full-size screenshots under a third of a viewport of empty
// gradient. So the one moment it appeared -- a desktop losing WebGL -- it looked like
// the site had broken, which is worse than the archive it was supposed to improve on.
// The archive is server-rendered, crawlable and correct at every width. Use it.
//
// The static cut is the SAME `wide && fine` test the drum already needed, read
// as one question: is this a desktop-class device? A phone fails on width; a
// tablet fails on pointer, since a touch screen reports `coarse` whatever its
// resolution (an iPad Pro is 1024px in portrait and 1366px in landscape, so
// width alone never separates it from a laptop). The gap: an iPad driven by a
// trackpad reports `fine`/`hover` and clears the gate. That is a big screen with
// a real pointer, so letting it through is the answer we would pick anyway --
// the alternative is sniffing the user agent, which lies.
//
// Returns null until the first client effect decides, so SSR and first paint
// render the crawlable archive with no hydration mismatch.

import { useEffect, useState } from "react";

export type ShowroomMode = "webgl" | "static";

export function useShowroomMode(): { mode: ShowroomMode | null } {
  const [mode, setMode] = useState<ShowroomMode | null>(null);

  useEffect(() => {
    const decide = () => {
      const wide = window.matchMedia("(min-width: 901px)").matches;
      const fine = window.matchMedia("(pointer: fine)").matches;
      const hover = window.matchMedia("(hover: hover)").matches;
      if (!(wide && fine && hover)) {
        setMode("static");
        return;
      }
      const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
      const saveData = conn?.saveData === true;
      let webgl2 = false;
      try {
        const c = document.createElement("canvas");
        const probe = c.getContext("webgl2");
        webgl2 = !!probe;
        // RELEASE THE PROBE. This is a capability test that draws nothing, but an
        // unreleased WebGL context still holds one of the browser's slots (Chrome
        // caps them at ~16 per process) until GC decides otherwise, which is not
        // deterministic and can be a long time.
        //
        // Leaking one per page load is invisible for a few loads and then not: once
        // the cap is reached, `getContext("webgl2")` starts returning null, this
        // function reports `static`, and the visitor silently gets the archive instead
        // of the room -- no error, no warning, just the wrong page.
        // Found 2026-07-29 after a long session of reloads did exactly that
        // (Chad: "its just a long horizontal scroll of the projects' slide images").
        //
        // A reload does not necessarily reclaim them either, so this compounds across
        // a working session and across a visitor's tabs.
        probe?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        webgl2 = false;
      }
      // No WebGL2, or the visitor asked us to save data: they get the ARCHIVE, which
      // is the real page anyway -- server-rendered, crawlable, and correct at any
      // width. See the note at the top about why there is no third path.
      setMode(webgl2 && !saveData ? "webgl" : "static");
    };
    decide();
    // Re-decide on any change that could move the answer: rotating a tablet
    // crosses the width line, and docking a keyboard crosses the pointer line.
    const queries = ["(min-width: 901px)", "(pointer: fine)", "(hover: hover)"].map((q) =>
      window.matchMedia(q),
    );
    queries.forEach((mq) => mq.addEventListener("change", decide));
    return () => queries.forEach((mq) => mq.removeEventListener("change", decide));
  }, []);

  return { mode };
}
