"use client";

// =====================================================================
// ScrollHint -- a small "scroll" kicker that nudges every few seconds and then
// gets out of the way. It hides once it has travelled above `hideAt` (a
// fraction of the viewport height, 0.45 by default): past that point the reader
// is plainly already scrolling and the prompt has done its job.
//
// The test is IntersectionObserver with a negative top rootMargin, not a scroll
// listener: the callback fires only on the crossing itself, so there is no
// per-frame work for a decoration. `boundingClientRect.top` against the shifted
// root separates "above the line" from "not on screen yet" -- both report
// isIntersecting: false, and only the first one should hide anything.
//
// Reversible on purpose: scroll back up to the hero and the hint comes back,
// same as it would on a fresh load at that position.
//
// The bounce itself is CSS (see .cw-demosplit__scroll), so it already answers to
// the global motion toggle and to prefers-reduced-motion.
// =====================================================================

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/capsule";

export function ScrollHint({
  className,
  hideAt = 0.45,
  children,
}: {
  className?: string;
  hideAt?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [past, setPast] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const line = e.rootBounds
            ? e.rootBounds.top
            : window.innerHeight * hideAt;
          setPast(e.boundingClientRect.top < line);
        }
      },
      { root: null, rootMargin: `-${hideAt * 100}% 0px 0px 0px`, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hideAt]);

  return (
    <span
      ref={ref}
      className={cx(className, past && "is-past")}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export default ScrollHint;
