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
      {variant === "browser" && (
        <div className="cw-port-frame__bar" aria-hidden="true">
          <span className="cw-port-frame__dots">
            <span className="cw-port-frame__dot" />
            <span className="cw-port-frame__dot" />
            <span className="cw-port-frame__dot" />
          </span>
          <span className="cw-port-frame__url">{url}</span>
          <span className="cw-port-frame__bar-spacer" />
        </div>
      )}
      {variant === "phone" && <span className="cw-port-frame__notch" aria-hidden="true" />}
      {variant === "tablet" && <span className="cw-port-frame__cam" aria-hidden="true" />}
      <div
        ref={screenRef}
        className="cw-port-frame__screen"
        onPointerMove={onMove}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="cw-port-frame__img"
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" as const } : {})}
        />
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
