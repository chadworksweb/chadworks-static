"use client";

// SpeedDemon -- the "speed demon" easter-egg link. AMBIENT state is the wild one:
// a JS-driven motion-blur burst that toggles a real is-blurring class (italic +
// the one-shot jitter animation). HOVER calms it: the burst is suppressed and the
// text settles into a gentle pulse. JS-driven so font-style (not animatable in a
// keyframe) can flip per cycle.

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const BLUR_MS = 900;
const REST_MS = 2700;

export function SpeedDemon({ href, children }: { href: string; children: string }) {
  const [blurring, setBlurring] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      reducedRef.current = true;
      return;
    }
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const cycle = (blur: boolean) => {
      if (!alive) return;
      setBlurring(blur);
      timer = setTimeout(() => cycle(!blur), blur ? BLUR_MS : REST_MS);
    };
    cycle(false);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  // Hover wins: it suppresses the burst and shows the gentle pulse instead.
  const leaning = blurring && !hovered;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cw-speed-demon"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* outer = skewX lean (animatable oblique, eased in/out); inner = the
          stepped jitter + blur. font-style italic can't tween, so the slant is
          the animated stand-in. */}
      <span className={"cw-speed-demon__lean" + (leaning ? " is-leaning" : "")}>
        <span
          className={
            "cw-speed-demon__text" +
            (leaning ? " is-blurring" : hovered ? " is-hover-pulse" : "")
          }
        >
          {children}
        </span>
      </span>
    </a>
  );
}
