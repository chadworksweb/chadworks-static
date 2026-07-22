"use client";

// The client half of the shape-capture harness (see ./page.tsx). Renders every
// MODEL-generated example scope's object at one shared scale into a fixed-size
// transparent box, with capture mode on (preserveDrawingBuffer). tools/shapecap/
// captures each canvas, crops to a fixed horizontal window (identical slab
// width/position on every shape) and writes public/shapes/<slug>.webp.
//
// `rushed` is DELIBERATELY not here: its motion streak runs too long for the
// shared window, so it is a hand-finished art asset (public/shapes/rushed.webp,
// from Dropbox/ChadWorks/images/website-calc-shapes). Do not add it back, or a
// capture run will overwrite the good art with a clipped render.

import { useEffect } from "react";
import PackageScreen from "@/components/package-builder/PackageScreen";
import { channels } from "@/lib/package-builder";
import { EXAMPLES } from "@/lib/pricing";

// One scale for ALL shapes -> identical slab width. Under the tool's own 0.9 so
// corners and page strata keep a margin. MUST match the crop window assumptions
// in tools/shapecap/capture.mjs.
const S = 0.84;

// Read the canonical use-case list from the hub so this harness can never drift
// from the gallery. `rushed` is DELIBERATELY skipped: its motion streak runs too
// long for the shared crop window, so it is a hand-finished art asset
// (public/shapes/rushed.webp, from Dropbox/ChadWorks/images/website-calc-shapes).
// Do not add it back, or a capture run overwrites the good art with a clipped
// render.
const SHAPES = EXAMPLES.filter((e) => e.slug !== "rushed");

export default function ShapeCaptureClient() {
  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
  }, []);

  return (
    <>
      <style>{`.cw-pkgscreen, .cw-pkgscreen__canvas { width: 100%; height: 100%; display: block; }`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1120px)", gap: 20, padding: 20, background: "transparent" }}>
        {SHAPES.map((s) => (
          <div
            key={s.slug}
            data-shape={s.slug}
            style={{ width: 1120, height: 840, background: "transparent" }}
          >
            <PackageScreen channels={{ ...channels(s.scope), scale: S }} capture />
          </div>
        ))}
      </div>
    </>
  );
}
