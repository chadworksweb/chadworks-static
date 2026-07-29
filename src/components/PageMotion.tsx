"use client";

// Behavior-only client island (ported from the niche pages' niche-inline.js):
//  - Scroll reveal: adds `.is-visible` to `.reveal` elements as they enter view.
//  - Scroll-fill headings: sweeps the gradient on `.svc-block__heading` from
//    unfilled (below the fold) to filled as each heading scrolls up.
// Both respect prefers-reduced-motion (everything shown, no motion).

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function PageMotion() {
  useEffect(() => {
    const reduce = prefersReducedMotion();

    // --- scroll reveal ---
    // Three triggers share one `.is-visible` toggle. Only the rootMargin differs:
    //   .reveal        -- fires as the element just enters (rootMargin -8%).
    //   .reveal-early  -- fires BEFORE the element reaches the fold (rootMargin
    //                     +14%, the one positive margin here), so the rise is
    //                     already settling by the time it is read rather than
    //                     starting under the reader's eye. Used by the homepage
    //                     portfolio showcase.
    //   .reveal-late   -- waits until the element is well up the viewport
    //                     (rootMargin -32%), so a longer glide is seen mid-screen
    //                     rather than down at the fold. Used by the process cards.
    //
    // `.reveal-early` carries `.reveal` too, and takes its look and its
    // reduced-motion guard from it -- the early class is a TRIGGER, not a style.
    // Hence the `:not()` below: without it both observers would watch the same
    // element and the -8% one would fight the whole point of the +14% one.
    const observers: IntersectionObserver[] = [];

    // The trigger expressed in PIXELS: roughly 12% of one screen. For any element
    // shorter than the viewport this works out to the same 0.12 ratio the reveal
    // has always used, so those sections fire exactly when they used to.
    const triggerPx = window.innerHeight * 0.12;

    const onIntersect: IntersectionObserverCallback = (entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          o.unobserve(e.target);
        }
      });
    };

    const setupReveal = (selector: string, rootMargin: string) => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
      if (reduce) {
        els.forEach((el) => el.classList.add("is-visible"));
        return;
      }
      // One observer PER element, because the threshold has to be derived from
      // that element's own height and IntersectionObserver takes its options per
      // observer, not per target.
      //
      // WHY, and it is not theoretical: a FIXED ratio is unreachable once an
      // element is much taller than the screen. intersectionRatio tops out near
      // viewportH / elementH, so at ~8x the viewport a 0.12 threshold can never
      // be crossed, the callback never runs, and the section stays at the
      // `opacity: 0` that `.reveal` starts from -- permanently. That is exactly
      // how the homepage portfolio grid went invisible on a real phone: the grid
      // drops to one column under 600px and the section becomes several screens
      // tall, while on desktop it stays 2-up and short enough to clear 0.12,
      // which is why the bug never showed up here.
      //
      // Clamping to the pixel trigger leaves short elements on their old ratio
      // and gives tall ones a threshold they can actually reach. Height is safe
      // to read now: DeviceMockup's frames sit in a fixed-height stage, so the
      // cards do not depend on images having loaded.
      els.forEach((el) => {
        const h = el.getBoundingClientRect().height;
        const threshold = h > 0 ? Math.min(0.12, triggerPx / h) : 0;
        const obs = new IntersectionObserver(onIntersect, { threshold, rootMargin });
        obs.observe(el);
        observers.push(obs);
      });
    };
    setupReveal(".reveal:not(.reveal-early)", "0px 0px -8% 0px");
    setupReveal(".reveal-early", "0px 0px 14% 0px");
    setupReveal(".reveal-late", "0px 0px -32% 0px");

    // --- touch focus: hover, decided by scroll position ---
    // A touch screen has no pointer to hover with, and iOS latches :hover on tap
    // and never clears it, so on those devices the card the reader is actually
    // looking at is decided by position. That card wears the hover look
    // (.is-touch-focus); the CSS switches :hover off there.
    //
    // The trigger is a LINE, not a band. A band the full depth of the top third
    // still contains a card that is nearly scrolled off the top, and that card
    // was winning (Chad). A 3%-tall stripe a quarter of the way down the screen
    // is crossed by one card at a time, so the lit card is the one arriving at
    // the top of the reader's view rather than the one leaving it.
    //
    // Cut with rootMargin, so the observer fires only on a crossing -- no scroll
    // listener, and none of this runs on a pointer device.
    if (window.matchMedia("(hover: none)").matches) {
      const focusEls = Array.from(
        document.querySelectorAll<HTMLElement>(".svc-lane, .cw-lane-sub")
      );
      if (focusEls.length) {
        const onLine = new Set<Element>();
        let lit: HTMLElement | null = null;
        const light = (next: HTMLElement | null) => {
          if (next === lit) return;
          lit?.classList.remove("is-touch-focus");
          next?.classList.add("is-touch-focus");
          lit = next;
        };
        const relight = () => {
          // Last in DOM order: at the moment two cards touch the line, the lower
          // one is arriving and the upper one is leaving.
          const next = focusEls.filter((el) => onLine.has(el)).pop() ?? null;
          if (next) return light(next);
          // Nothing on the line (a gap between cards passing through it): hold
          // the current one rather than blinking off, until it has left the
          // screen entirely.
          if (!lit) return;
          const r = lit.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) light(null);
        };
        const lineObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) =>
              e.isIntersecting ? onLine.add(e.target) : onLine.delete(e.target)
            );
            relight();
          },
          { rootMargin: "-25% 0px -72% 0px", threshold: 0 }
        );
        focusEls.forEach((el) => lineObs.observe(el));
        observers.push(lineObs);
      }
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
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
