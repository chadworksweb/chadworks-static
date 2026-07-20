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
import {
  BASELINE,
  SMALL_BUSINESS,
  STORE,
  channels,
  wire,
  type Scope,
} from "@/lib/package-builder";

// One scale for ALL shapes -> identical slab width. Under the tool's own 0.9 so
// corners and page strata keep a margin. MUST match the crop window assumptions
// in tools/shapecap/capture.mjs.
const S = 0.84;

const SHAPES: { slug: string; scope: Scope }[] = [
  { slug: "baseline", scope: BASELINE },
  { slug: "small-business", scope: SMALL_BUSINESS },
  { slug: "ecommerce", scope: STORE },
  { slug: "bespoke-motion", scope: { ...BASELINE, pages: 6, ambition: 4, motion: 4, brandingDone: 3, content: 2, editability: 1 } },
  { slug: "multilingual", scope: { ...BASELINE, pages: 6, content: 2, editability: 1, locales: 3 } },
  { slug: "publication", scope: { ...BASELINE, pages: 14, sections: 5, content: 1, editability: 3, mathDev: 1, integrations: wire(3), motion: 1 } },
  { slug: "web-app", scope: { ...BASELINE, pages: 6, mathDev: 3, integrations: wire(3, 4, 6), editability: 2, ambition: 2 } },
  { slug: "service-booking", scope: { ...BASELINE, pages: 5, integrations: wire(0, 1), commerce: 1, ambition: 2, motion: 2, content: 2, brandingDone: 2 } },
  { slug: "membership", scope: { ...BASELINE, pages: 8, integrations: wire(3, 4), editability: 2, content: 1, mathDev: 2 } },
];

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
