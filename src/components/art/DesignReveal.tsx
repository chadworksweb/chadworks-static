"use client";

// DesignReveal -- the /web-design/ signature: a before/after wipe between two
// CSS-built mini-sites inside one browser frame. Left of the divider is the
// SAME business on a default template; right of it, designed. The divider
// follows the cursor with damped weight (heavy material, measured speed --
// the Motion Profile), and an invisible range input keeps it keyboard- and
// touch-accessible. No canvas, no images: both mockups are pure DOM, so the
// whole demo costs one compositing layer.
//
// Reduced motion: the divider still moves (it is user-driven input, not
// ambient animation) but without the lerp chase.

import { useEffect, useRef } from "react";

const DAMP = 0.14;

export function DesignReveal() {
  const frameRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const target = useRef(50);
  const current = useRef(50);

  useEffect(() => {
    const frame = frameRef.current;
    const range = rangeRef.current;
    if (!frame || !range) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;

    function apply(v: number) {
      frame!.style.setProperty("--reveal", `${v}%`);
    }

    function tick() {
      const delta = target.current - current.current;
      if (Math.abs(delta) < 0.08) {
        current.current = target.current;
        apply(current.current);
        running = false;
        return;
      }
      current.current += delta * DAMP;
      apply(current.current);
      raf = requestAnimationFrame(tick);
    }

    function setTarget(v: number) {
      target.current = Math.max(2, Math.min(98, v));
      range!.value = String(Math.round(target.current));
      if (reduced) {
        current.current = target.current;
        apply(current.current);
        return;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }

    function onPointer(e: PointerEvent) {
      const r = frame!.getBoundingClientRect();
      setTarget(((e.clientX - r.left) / r.width) * 100);
    }
    function onInput() {
      setTarget(Number(range!.value));
    }

    frame.addEventListener("pointermove", onPointer);
    frame.addEventListener("pointerdown", onPointer);
    range.addEventListener("input", onInput);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onPointer);
      frame.removeEventListener("pointerdown", onPointer);
      range.removeEventListener("input", onInput);
    };
  }, []);

  return (
    <div className="design-reveal">
      <div ref={frameRef} className="design-reveal__frame" style={{ "--reveal": "50%" } as React.CSSProperties}>
        {/* Browser chrome */}
        <div className="design-reveal__bar" aria-hidden="true">
          <span className="design-reveal__dot" />
          <span className="design-reveal__dot" />
          <span className="design-reveal__dot" />
          <span className="design-reveal__url">yourbusiness.com</span>
        </div>

        <div className="design-reveal__stage" aria-hidden="true">
          {/* BEFORE: the same business on a default template */}
          <div className="design-reveal__site design-reveal__site--before">
            <div className="dr-b__nav">
              <span className="dr-b__logo">YOUR BUSINESS LLC</span>
              <span className="dr-b__links" />
            </div>
            <div className="dr-b__hero">
              <span className="dr-b__h1">Welcome To Our Website</span>
              <span className="dr-b__sub" />
              <span className="dr-b__sub dr-b__sub--short" />
              <span className="dr-b__btn">CLICK HERE</span>
            </div>
            <div className="dr-b__row">
              <span className="dr-b__box" />
              <span className="dr-b__box" />
              <span className="dr-b__box" />
            </div>
          </div>

          {/* AFTER: the same business, designed */}
          <div className="design-reveal__site design-reveal__site--after">
            <div className="dr-a__nav">
              <span className="dr-a__logo">yourbusiness</span>
              <span className="dr-a__pill" />
            </div>
            <div className="dr-a__hero">
              <span className="dr-a__eyebrow" />
              <span className="dr-a__h1">
                The work speaks.
                <em> This is where it talks.</em>
              </span>
              <span className="dr-a__sub" />
              <span className="dr-a__btn" />
            </div>
            <div className="dr-a__band">
              <span className="dr-a__card" />
              <span className="dr-a__card dr-a__card--tall" />
            </div>
          </div>

          {/* Divider + handle */}
          <div className="design-reveal__divider" aria-hidden="true">
            <span className="design-reveal__handle">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* Accessible control: drives the same wipe for keyboard + touch + AT. */}
        <input
          ref={rangeRef}
          type="range"
          className="design-reveal__range"
          min={2}
          max={98}
          defaultValue={50}
          aria-label="Compare the template version with the designed version"
        />
      </div>

      <div className="design-reveal__labels">
        <span className="design-reveal__label">A template</span>
        <span className="design-reveal__label design-reveal__label--after">Designed</span>
      </div>
    </div>
  );
}
