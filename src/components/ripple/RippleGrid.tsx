"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RippleCanvas, type RippleCanvasHandle } from "./RippleCanvas";

// THE SITEWIDE RIPPLE GRID (chadworks). This is the water-ripple
// orchestration from the chad site's ExploreGrid copied LINE FOR LINE (the
// cursor-glow damping, the DROP_GAP_PX wake, the settle-mounted canvases,
// the pointer plumbing, the no-early-return rule). Only the rendered card
// markup differs: it renders the chadworks portfolio shot (image + external
// label) instead of the merch card. Every page that wants the ripple CALLS
// this engine -- nothing reimplements it.

export interface RippleGridItem {
  key: string;
  src: string;
  alt: string;
  label: string;
  href?: string;
}

interface Props {
  items: RippleGridItem[];
}

// Cursor-trail tuning copied from DiscographyCubeRadiant. Smaller GLOW_DAMPING
// = more lag; smaller DROP_GAP_PX = denser wake of drops.
const GLOW_DAMPING = 0.07;
const DROP_GAP_PX = 10;
// How long a card keeps its water canvas mounted after the last drop. Needs
// to outlast RippleCanvas's LIFETIME_S so a ring's full animation plays
// out even if the cursor leaves the card immediately after dropping it.
// VERBATIM chad-site ExploreGrid value (reverted from the 6800 drift now
// that LIFETIME_S is back to 3.5s -- the canvas unmounts ~2x sooner).
const SETTLE_MS = 3800;

export function RippleGrid({ items }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  // Refs target the image element's wrapper (just the image area), NOT the
  // outer card. The outer card includes the label text below the image, so
  // using its height for the cursor->drop projection puts the drop above the
  // cursor.
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const waterRefs = useRef<(RippleCanvasHandle | null)[]>([]);

  // Set of card indexes that should currently have a water canvas mounted.
  // Toggled on cursor entry and removed after SETTLE_MS without further hits.
  const [activeIdxs, setActiveIdxs] = useState<Set<number>>(new Set());
  // NOTE: the hover affordance (border/lift/cue) is driven by pure CSS :hover,
  // NOT a JS hovered-index. Deriving it from the DAMPED ripple cursor lagged
  // the border behind the real pointer (it "stuck" on the last card on fast
  // back-and-forth) and re-rendered the grid on every drop. CSS :hover is
  // instant and accurate; the damped glow now only drives the water trail.
  const settleTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const glowTargetRef = useRef<{ x: number; y: number } | null>(null);
  const glowCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const glowFrameRef = useRef<number | null>(null);
  const lastDropAtRef = useRef<{ x: number; y: number } | null>(null);

  const activate = useCallback((idx: number) => {
    const existing = settleTimers.current.get(idx);
    if (existing) clearTimeout(existing);
    settleTimers.current.set(
      idx,
      setTimeout(() => {
        setActiveIdxs((prev) => {
          if (!prev.has(idx)) return prev;
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
        settleTimers.current.delete(idx);
      }, SETTLE_MS),
    );
    setActiveIdxs((prev) => {
      if (prev.has(idx)) return prev;
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  const dropOnCards = useCallback((cx: number, cy: number) => {
    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;
      const fx = ((cx - rect.left) / rect.width) * 100;
      const fy = ((cy - rect.top) / rect.height) * 100;
      if (fx < 0 || fx > 100 || fy < 0 || fy > 100) return;
      activate(idx);
      const handle = waterRefs.current[idx];
      if (handle) handle.drop(fx, fy, 0.22);
    });
  }, [activate]);

  const tickGlow = useCallback(function tickGlowInner() {
    const t = glowTargetRef.current;
    const c = glowCurrentRef.current;
    if (!t || !c) {
      glowFrameRef.current = null;
      return;
    }
    const nx = c.x + (t.x - c.x) * GLOW_DAMPING;
    const ny = c.y + (t.y - c.y) * GLOW_DAMPING;
    glowCurrentRef.current = { x: nx, y: ny };

    const last = lastDropAtRef.current;
    if (!last) {
      lastDropAtRef.current = { x: nx, y: ny };
    } else {
      const dx = nx - last.x;
      const dy = ny - last.y;
      if (Math.hypot(dx, dy) > DROP_GAP_PX) {
        dropOnCards(nx, ny);
        lastDropAtRef.current = { x: nx, y: ny };
      }
    }

    if (Math.abs(t.x - nx) > 0.3 || Math.abs(t.y - ny) > 0.3) {
      glowFrameRef.current = requestAnimationFrame(tickGlowInner);
    } else {
      glowFrameRef.current = null;
    }
  }, [dropOnCards]);

  // Preload the texture URLs RippleCanvas will fetch on first hover. Without
  // this, the canvas mounts cold on first pointermove and only then starts
  // rendering drops. (Static export: sources are local paths, no optimizer.)
  useEffect(() => {
    items.forEach((item) => {
      if (!item.src) return;
      const url = item.src.startsWith("/")
        ? item.src
        : `/_next/image?url=${encodeURIComponent(item.src)}&w=1080&q=100`;
      const img = new Image();
      img.src = url;
    });
  }, [items]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      glowTargetRef.current = { x: e.clientX, y: e.clientY };
      if (glowCurrentRef.current === null) {
        glowCurrentRef.current = { x: e.clientX, y: e.clientY };
      }
      if (glowFrameRef.current == null) {
        glowFrameRef.current = requestAnimationFrame(tickGlow);
      }
    };
    grid.addEventListener("pointermove", onMove);
    const timersAtMount = settleTimers.current;
    return () => {
      grid.removeEventListener("pointermove", onMove);
      if (glowFrameRef.current != null) {
        cancelAnimationFrame(glowFrameRef.current);
        glowFrameRef.current = null;
      }
      for (const t of timersAtMount.values()) clearTimeout(t);
      timersAtMount.clear();
    };
  }, [tickGlow]);

  // Intentionally do NOT early-return on empty items: the grid div must be in
  // the DOM on first paint so the pointermove useEffect attaches its listener
  // to gridRef.

  return (
    <div ref={gridRef} className="svc-shots">
      {items.map((item, idx) => {
        const active = activeIdxs.has(idx);
        // The image FRAME is the primary click target (matches the chad site's
        // image-link): the whole thumbnail is clickable, shows a pointer
        // cursor, and gets the hover affordance + "View site" cue.
        const external = item.href?.startsWith("http");
        const frameInner = (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} className="svc-shot__img" loading="lazy" />
            {active && (
              <RippleCanvas
                ref={(handle) => { waterRefs.current[idx] = handle; }}
                src={item.src}
                className="svc-shot__water"
              />
            )}
            {item.href && (
              <span className="svc-shot__cue" aria-hidden="true">
                View site <span className="svc-shot__cue-arrow">&#8599;</span>
              </span>
            )}
          </>
        );
        return (
          <div key={item.key} className="svc-shot">
            {item.href ? (
              external ? (
                <a
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  href={item.href}
                  className="svc-shot__frame svc-shot__frame--link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                >
                  {frameInner}
                </a>
              ) : (
                <Link
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  href={item.href}
                  className="svc-shot__frame svc-shot__frame--link"
                  aria-label={item.label}
                >
                  {frameInner}
                </Link>
              )
            ) : (
              <div
                ref={(el) => { cardRefs.current[idx] = el; }}
                className="svc-shot__frame"
              >
                {frameInner}
              </div>
            )}
            <p className="svc-shot__label">
              {item.href ? (
                external ? (
                  <a href={item.href} className="svc-shot__link" target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="svc-shot__link">{item.label}</Link>
                )
              ) : (
                item.label
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
