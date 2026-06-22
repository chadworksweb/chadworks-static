"use client";

// =====================================================================
// MockupFrame -- a premium device frame drawn in CSS/SVG that wraps a real
// screenshot. Three variants:
//   browser -- desktop chrome bar (traffic dots + URL pill) over the shot
//   tablet  -- portrait tablet bezel with a camera dot
//   phone   -- portrait phone bezel with a notch
// All sit on a soft layered shadow with a rounded bezel, token-styled
// (cw-port-*). Inside a .cw-port-device__stage the frame is sized by height
// (aspect-ratio per device) so swapping devices never reflows the layout.
//
// The screenshot is a plain <img> (lazy unless priority). The water-ripple is
// available on the browser variant (ripple=true); at rest no canvas is mounted.
// =====================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { RippleCanvas, type RippleCanvasHandle } from "@/components/ripple/RippleCanvas";

type Variant = "browser" | "tablet" | "phone";

export type MockupFrameProps = {
  src: string;
  alt: string;
  url: string; // shown in the chrome bar (display only)
  variant?: Variant;
  priority?: boolean; // featured hero loads eagerly; everything else lazy
  ripple?: boolean; // enable the water-ripple-on-hover treatment
  className?: string;
};

const SETTLE_MS = 3800;
const DROP_GAP_PX = 14;

export function MockupFrame({
  src,
  alt,
  url,
  variant = "browser",
  priority = false,
  ripple = false,
  className,
}: MockupFrameProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<RippleCanvasHandle | null>(null);
  const [active, setActive] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDropRef = useRef<{ x: number; y: number } | null>(null);

  // Screenshot crossfade: when `src` changes (device swap) the new image is
  // pushed as a fresh layer that fades in over the previous one, which is then
  // dropped. For static single-device usage this stays a single layer and the
  // effect never fires, so behavior there is unchanged.
  const nextId = useRef(0);
  const [layers, setLayers] = useState<{ src: string; id: number }[]>([{ src, id: 0 }]);
  useEffect(() => {
    setLayers((cur) => {
      if (cur[cur.length - 1].src === src) return cur;
      nextId.current += 1;
      return [...cur, { src, id: nextId.current }];
    });
  }, [src]);
  const settleLayers = useCallback(() => {
    setLayers((cur) => (cur.length > 1 ? [cur[cur.length - 1]] : cur));
  }, []);

  const keepAlive = useCallback(() => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setActive(false), SETTLE_MS);
    setActive(true);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!ripple || e.pointerType !== "mouse") return;
      const el = screenRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const last = lastDropRef.current;
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < DROP_GAP_PX) return;
      lastDropRef.current = { x: e.clientX, y: e.clientY };
      keepAlive();
      const fx = ((e.clientX - rect.left) / rect.width) * 100;
      const fy = ((e.clientY - rect.top) / rect.height) * 100;
      waterRef.current?.drop(fx, fy, 0.24);
    },
    [ripple, keepAlive],
  );

  useEffect(() => {
    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, []);

  return (
    <div className={"cw-port-frame cw-port-frame--" + variant + (className ? " " + className : "")}>
      {/* The browser chrome bar is always mounted so it can collapse/expand with
          the shell during a device morph instead of popping in and out. */}
      <div className="cw-port-frame__bar" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, decorative */}
        <img className="cw-port-frame__mark" src="/cw-gemstone-mark.png" alt="" />
        <span className="cw-port-frame__url">
            <svg
              className="cw-port-frame__lock"
              viewBox="0 0 24 24"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          <span className="cw-port-frame__url-text">{url}</span>
        </span>
        <span className="cw-port-frame__menu">
          <i />
          <i />
          <i />
        </span>
      </div>
      {variant === "phone" && <span className="cw-port-frame__notch" aria-hidden="true" />}
      {variant === "tablet" && <span className="cw-port-frame__cam" aria-hidden="true" />}
      <div
        ref={screenRef}
        className="cw-port-frame__screen"
        onPointerMove={onMove}
      >
        {layers.map((l, i) => {
          const isTop = i === layers.length - 1;
          const fading = isTop && layers.length > 1;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={l.id}
              src={l.src}
              alt={isTop ? alt : ""}
              className={"cw-port-frame__img" + (fading ? " is-fading-in" : "")}
              loading={priority && l.id === 0 ? "eager" : "lazy"}
              onAnimationEnd={fading ? settleLayers : undefined}
              {...(priority && l.id === 0 ? { fetchPriority: "high" as const } : {})}
            />
          );
        })}
        {ripple && active && (
          <RippleCanvas
            ref={(h) => {
              waterRef.current = h;
            }}
            src={src}
            className="cw-port-frame__water"
          />
        )}
      </div>
    </div>
  );
}
