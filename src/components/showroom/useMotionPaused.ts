"use client";

// A ref that stays true whenever motion should be frozen: the global motion-pause
// store is on, OR the visitor asked for reduced motion (and hasn't opted into
// forced motion). The R3F loops read this ref to park their idle animation.

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";

export function useMotionPausedRef() {
  const ref = useRef(false);
  useEffect(() => {
    const sync = () => {
      ref.current = isMotionPaused() || prefersReducedMotion();
    };
    sync();
    return subscribeMotion(sync);
  }, []);
  return ref;
}
