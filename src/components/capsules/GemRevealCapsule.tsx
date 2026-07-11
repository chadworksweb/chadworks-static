// GEM REVEAL CAPSULE -- the "what is web development" definition, chopped into
// four sentence boxes scattered over the spinning CW gem. The reader clicks a
// pulsing hint beacon; that sentence box MATERIALIZES via a brand tile build-in
// (echoing the site's digitization wipe) -- a grid of super-small gradient tiles
// that ASSEMBLE in over a transparent background, then resolve into the frosted
// box + text -- and the NEXT beacon appears. The gem sentence stays static at
// the bottom.
//
// Desktop: boxes/beacons are absolutely positioned (per-box CSS vars) over the
// gem. Mobile (<=768px): the stage collapses to a stacked column.

"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { SectionShell } from "@/components/capsules/SectionShell";
import { GemstoneMark } from "@/components/GemstoneMark";
import ManifestoAmbient from "@/components/ManifestoAmbient";
import { prefersReducedMotion } from "@/lib/motion";

type Box = { text: string; left: string; top: string; w: string; label: string };

// Positions are % of the stage (responsive), matched to Chad's ss8 red boxes.
const BOXES: Box[] = [
  {
    text: "Web development is the code and technology behind the design.",
    left: "26%",
    top: "15%",
    w: "24%",
    label: "start here",
  },
  {
    text: "Development is the aspect that connects the server (the back end) to the browser (the front end).",
    left: "56%",
    top: "calc(17% + 75px)",
    w: "25%",
    label: "keep going",
  },
  {
    text: "It is the translation between raw data on a hard drive in a data center and the websites and apps you interact with.",
    left: "28%",
    top: "44%",
    w: "25%",
    label: "keep going",
  },
  {
    text: "Without development, the design would have nothing to sit on; it would be a flat image you couldn't interact with.",
    left: "55%",
    top: "58%",
    w: "25%",
    label: "one more",
  },
];

// ---- brand tile materialize (gradient sampling ported from PageTransition) ---
const TILE_PX = 9; // super-small tiles
const STAGGER_MS = 380; // max per-tile random delay -> the scatter
const MATERIALIZE_MS = 720; // tiles fade IN one by one (+ buffer) -> full cover
const REVEAL_MS = 700; // tiles dissolve OUT -> the box is uncovered

// Brand display-gradient stops (--grad-deep -> --grad-mid -> --grad-peak).
const STOPS = [
  [36, 57, 137],
  [86, 104, 173],
  [229, 210, 244],
];
function gradAt(p: number) {
  const x = Math.max(0, Math.min(1, p));
  const [a, b, t] =
    x <= 0.5 ? [STOPS[0], STOPS[1], x / 0.5] : [STOPS[1], STOPS[2], (x - 0.5) / 0.5];
  const c = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}

type Cell = { bg: string; d: number };
type Phase = "arm" | "materialize" | "reveal" | "done";

// A single sentence box that materializes tile by tile: the box itself stays
// invisible (no shape) while the gradient tiles fade IN one by one to build the
// field; then, under full tile cover, the final frosted box + text snap in
// (hidden) and the tiles dissolve OUT to reveal it. No box shape is ever seen
// before it's fully materialized, and no flash.
function RevealBox({ box }: { box: Box }) {
  const ref = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<{ cols: number; cells: Cell[] }>({ cols: 0, cells: [] });
  const [phase, setPhase] = useState<Phase>("arm");

  // Measure synchronously and start the build before first paint (no flash).
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setPhase("done");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cols = Math.max(1, Math.ceil(rect.width / TILE_PX));
    const rows = Math.max(1, Math.ceil(rect.height / TILE_PX));
    const span = Math.max(1, cols + rows - 2);
    const cells: Cell[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        cells.push({ bg: gradAt((c + r) / span), d: Math.round(Math.random() * STAGGER_MS) });
    setGrid({ cols, cells });
    setPhase("materialize");
  }, []);

  useEffect(() => {
    if (phase === "materialize") {
      const id = window.setTimeout(() => setPhase("reveal"), MATERIALIZE_MS);
      return () => window.clearTimeout(id);
    }
    if (phase === "reveal") {
      const id = window.setTimeout(() => setPhase("done"), REVEAL_MS);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  const style = {
    "--bl": box.left,
    "--bt": box.top,
    "--bw": box.w,
  } as CSSProperties;

  const showTiles = phase === "materialize" || phase === "reveal";

  return (
    <div ref={ref} className="cw-gr-box" data-phase={phase} style={style}>
      <p className="cw-gr-box__text">{box.text}</p>
      {showTiles && (
        <div
          className="cw-gr-diss"
          data-phase={phase}
          aria-hidden="true"
          style={
            grid.cols
              ? {
                  gridTemplateColumns: `repeat(${grid.cols}, ${TILE_PX}px)`,
                  gridAutoRows: `${TILE_PX}px`,
                }
              : undefined
          }
        >
          {grid.cells.map((cell, i) => (
            <span
              key={i}
              className="cw-gr-diss__cell"
              style={{ background: cell.bg, "--d": `${cell.d}ms` } as CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GemRevealCapsule() {
  // Number of hints clicked = number of boxes revealed. The hint for box `step`
  // is the one currently pulsing; boxes 0..step-1 are shown.
  const [step, setStep] = useState(0);

  return (
    <SectionShell
      full
      className="cw-gemreveal"
      bg={
        <>
          <div className="cw-gr-cloud" aria-hidden="true">
            <ManifestoAmbient />
          </div>
          <div className="cw-gempanel__gemwrap">
            <GemstoneMark spinDir={1} speed={0.12} className="cw-gempanel__gem" />
          </div>
        </>
      }
    >
      <div className="cw-gr-stage">
        {BOXES.map((b, i) => {
          if (i < step) return <RevealBox key={i} box={b} />;
          if (i === step) {
            const style = {
              "--bl": b.left,
              "--bt": b.top,
              "--bw": b.w,
            } as CSSProperties;
            return (
              <button
                key={i}
                type="button"
                className="cw-gr-hint"
                style={style}
                onClick={() => setStep(step + 1)}
                aria-label={`Reveal: ${b.text}`}
              >
                <span className="cw-gr-hint__dot" aria-hidden="true" />
                <span className="cw-gr-hint__label">{b.label}</span>
              </button>
            );
          }
          return null;
        })}

        <p className="cw-gr-gemline">
          (that gem behind this? that&apos;s not a video, that&apos;s code.)
        </p>
      </div>
    </SectionShell>
  );
}
