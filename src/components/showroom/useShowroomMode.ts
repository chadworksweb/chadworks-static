"use client";

// Picks the showroom rendering path by CAPABILITY, not width alone.
//
// Three paths, in descending order of ambition:
//   webgl  -- the full immersive drum. Wide screen, a real pointer, WebGL2, and
//             the visitor is not asking us to save data.
//   lite   -- the swipe gallery. A desktop-class machine that cannot (or should
//             not) run the drum: no WebGL2, or save-data is on.
//   static -- no showroom at all. The route renders the plain portfolio archive
//             that the server already sent, and none of the three.js bundle is
//             ever fetched. Every phone and every tablet lands here.
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

export type ShowroomMode = "webgl" | "lite" | "static";

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
        webgl2 = !!c.getContext("webgl2");
      } catch {
        webgl2 = false;
      }
      setMode(webgl2 && !saveData ? "webgl" : "lite");
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
