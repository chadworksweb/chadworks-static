"use client";

// Behavior-only client island (ported from the niche pages' niche-inline.js):
//  - Scroll reveal: adds `.is-visible` to `.reveal` elements as they enter view.
//  - Scroll-fill headings: sweeps the gradient on `.svc-block__heading` from
//    unfilled (below the fold) to filled as each heading scrolls up.
// Both respect prefers-reduced-motion (everything shown, no motion).

import { useEffect } from "react";

export function PageMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- scroll reveal ---
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal")
    );
    let io: IntersectionObserver | null = null;
    if (reduce) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io!.observe(el));
    }

    // --- scroll-fill headings ---
    const fillEls = Array.from(
      document.querySelectorAll<HTMLElement>(".svc-fill")
    );
    let raf = 0;
    const updateFills = () => {
      raf = 0;
      const vh = window.innerHeight;
      const start = vh * 1.1; // begins filling just below the fold (110% down)
      const end = vh * 0.1; // fully filled near the top -- ~1vh of scroll, slow sweep
      for (const el of fillEls) {
        const top = el.getBoundingClientRect().top;
        let t = (start - top) / (start - end);
        t = Math.max(0, Math.min(1, t));
        el.style.backgroundPosition = `${100 - t * 100}% 0`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateFills);
    };

    if (reduce) {
      fillEls.forEach((el) => (el.style.backgroundPosition = "0% 0"));
    } else {
      updateFills();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
