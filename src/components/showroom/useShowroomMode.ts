"use client";

// Picks the showroom rendering path by CAPABILITY, not width alone. Full WebGL
// drum only when the screen is wide, the pointer is fine, WebGL2 exists, and the
// visitor is not on save-data. Everything else falls to the lite swipe gallery.
// Returns null until the first client effect decides, so SSR/first paint render
// the crawlable fallback with no hydration mismatch.

import { useEffect, useState } from "react";

export type ShowroomMode = "webgl" | "lite";

export function useShowroomMode(): { mode: ShowroomMode | null } {
  const [mode, setMode] = useState<ShowroomMode | null>(null);

  useEffect(() => {
    const decide = () => {
      const wide = window.matchMedia("(min-width: 901px)").matches;
      const fine = window.matchMedia("(pointer: fine)").matches;
      const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
      const saveData = conn?.saveData === true;
      let webgl2 = false;
      try {
        const c = document.createElement("canvas");
        webgl2 = !!c.getContext("webgl2");
      } catch {
        webgl2 = false;
      }
      setMode(wide && fine && webgl2 && !saveData ? "webgl" : "lite");
    };
    decide();
    const mq = window.matchMedia("(min-width: 901px)");
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  return { mode };
}
