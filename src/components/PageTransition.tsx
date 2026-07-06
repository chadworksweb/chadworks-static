"use client";

// =====================================================================
// PageTransition -- a light, brand-colored "digitization" wipe between routes.
// A viewport-filling grid of tiles, each colored as one pixel of the brand
// gradient (indigo -> periwinkle -> lavender).
//
// Flow: idle -> COVER (tiles assemble in a staggered pop) -> HOLD (fully
// covered, a gentle shimmer + sheen while the new route renders BENEATH it,
// scroll reset to top instantly) -> REVEAL (tiles dissolve to show the new,
// already-painted page) -> idle. The hold waits until the new route has both
// committed (pathname changed) AND painted (two rAFs), so the new page is in
// place before the dissolve -- no old-page-under-scrim, no end-of-wipe flash.
//
// App Router has no route-change event, so we intercept eligible link clicks in
// the capture phase and preventDefault; next/link skips its own navigation when
// the event is already defaultPrevented, and we drive router.push ourselves.
// prefers-reduced-motion disables the overlay (CSS) and the intercept (JS), so
// those users just navigate, with the scroll reset made instant in CSS.
// =====================================================================

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion";

const COVER_MS = 420; // cover-in done (cell transition + max stagger) before nav
const HOLD_MIN_MS = 320; // shortest covered hold, so the gentle motion is seen
const REVEAL_MS = 460; // dissolve-out done before the overlay goes idle
const FAILSAFE_MS = 2400; // never stay covered if a route somehow never lands
const STAGGER = 180; // max per-tile delay -> the random "digitize" scatter

// Brand display-gradient stops: --grad-deep #243989, --grad-mid #5668ad,
// --grad-peak #e5d2f4. Each tile samples this along the grid diagonal.
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
type Phase = "idle" | "cover" | "hold" | "reveal";

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [grid, setGrid] = useState<{ cols: number; cells: Cell[] }>({ cols: 0, cells: [] });

  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;
  const navigating = useRef(false);
  const targetPath = useRef<string | null>(null);
  const reduce = useRef(false);
  // hold gating: reveal only once the route has landed AND a minimum hold passed.
  const arrived = useRef(false);
  const minHeld = useRef(false);
  const revealStarted = useRef(false);

  // Build a chunky, ~square pixel field sized to the viewport (rebuilt on resize).
  useEffect(() => {
    reduce.current = prefersReducedMotion();
    const build = () => {
      const vw = window.innerWidth,
        vh = window.innerHeight;
      const cols = Math.min(20, Math.max(6, Math.round(vw / 110)));
      const cellW = vw / cols;
      const rows = Math.max(5, Math.round(vh / cellW));
      const cells: Cell[] = [];
      const span = Math.max(1, cols + rows - 2);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          cells.push({ bg: gradAt((c + r) / span), d: Math.round(Math.random() * STAGGER) });
      setGrid({ cols, cells });
    };
    build();
    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, []);

  // Intercept eligible internal link clicks -> start the cover.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (reduce.current) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const target = a.getAttribute("target");
      if (target && target !== "_self") return;
      if (a.hasAttribute("download")) return;
      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page / in-page anchor
      e.preventDefault();
      navigating.current = true;
      arrived.current = false;
      minHeld.current = false;
      revealStarted.current = false;
      targetPath.current = url.pathname + url.search + url.hash;
      document.documentElement.classList.add("cw-scroll-instant");
      setPhase("cover");
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Drive the phases off timers.
  useEffect(() => {
    if (phase === "cover") {
      const id = window.setTimeout(() => {
        window.scrollTo(0, 0);
        if (targetPath.current) router.push(targetPath.current);
        setPhase("hold");
      }, COVER_MS);
      return () => window.clearTimeout(id);
    }
    if (phase === "hold") {
      const minId = window.setTimeout(() => {
        minHeld.current = true;
        maybeReveal();
      }, HOLD_MIN_MS);
      const failId = window.setTimeout(() => {
        if (navigating.current) startReveal();
      }, FAILSAFE_MS);
      return () => {
        window.clearTimeout(minId);
        window.clearTimeout(failId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // The new route committed (pathname changed) -> note it, maybe reveal.
  useEffect(() => {
    if (navigating.current && phaseRef.current === "hold") {
      arrived.current = true;
      maybeReveal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function maybeReveal() {
    if (
      !revealStarted.current &&
      phaseRef.current === "hold" &&
      arrived.current &&
      minHeld.current
    ) {
      startReveal();
    }
  }

  // Wait two frames so the new page has actually painted beneath the full
  // cover, THEN dissolve -- the reveal uncovers the new page, never the old.
  function startReveal() {
    if (revealStarted.current) return;
    revealStarted.current = true;
    navigating.current = false;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPhase("reveal");
        window.setTimeout(() => {
          setPhase("idle");
          document.documentElement.classList.remove("cw-scroll-instant");
        }, REVEAL_MS);
      })
    );
  }

  const rows = grid.cols ? Math.ceil(grid.cells.length / grid.cols) : 0;

  return (
    <div className="cw-wipe" data-phase={phase} aria-hidden="true">
      <div
        className="cw-wipe__grid"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {grid.cells.map((cell, i) => (
          <span
            key={i}
            className="cw-wipe__cell"
            style={{ background: cell.bg, "--d": `${cell.d}ms` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export default PageTransition;
