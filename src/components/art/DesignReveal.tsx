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

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const DAMP = 0.14;

// One before/after pair per page of a real client site (Rozario Touma P.C.).
// Same framing before and after, so the wipe reveals the redesign in place.
export type RevealPage = {
  label: string;   // tab label
  url: string;     // faux browser-chrome address
  before: string;  // /public path to the "before" shot
  after: string;   // /public path to the "after" shot
  beforeAlt: string;
  afterAlt: string;
};

const DEFAULT_PAGES: RevealPage[] = [
  {
    label: "Homepage",
    url: "rozariolaw.com",
    before: "/design-reveal/rt-law_before.webp",
    after: "/design-reveal/rt-law_after.webp",
    beforeAlt: "Rozario Touma homepage before the redesign",
    afterAlt: "Rozario Touma homepage after the chadworks redesign",
  },
  {
    label: "Bio page",
    url: "rozariolaw.com/team",
    before: "/design-reveal/rt-law-person-before.webp",
    after: "/design-reveal/rt-law-person-after.webp",
    beforeAlt: "Attorney bio page before the redesign",
    afterAlt: "Attorney bio page after the chadworks redesign",
  },
];

// The header copy is overridable so a second page can run the same demo saying
// something appropriate to it, rather than the component being forked or the
// copy being asserted twice. Defaults are the /web-design/ wording, so that page
// and /website-redesign/ are untouched.
export function DesignReveal({
  pages = DEFAULT_PAGES,
  eyebrow = "Try it yourself",
  heading = "Same business, two first impressions",
  lead = "Grab the divider and drag. Everything that changes is design.",
  className,
}: {
  pages?: RevealPage[];
  eyebrow?: string;
  heading?: string;
  lead?: string;
  // A modifier on the root, so a PAGE can tune the section around this demo
  // without the component knowing which page it is on. The wrapping section
  // reaches it with :has() -- the same hook .cw-score--split already uses to
  // trim .svc-problem-art-section. Nothing here styles it.
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const page = pages[active] ?? pages[0];

  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  // Rest position favors the DESIGNED side (the sell), not a dead 50/50.
  const target = useRef(36);
  const current = useRef(36);

  useEffect(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    const range = rangeRef.current;
    if (!frame || !stage || !range) return;

    const reduced = prefersReducedMotion();
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    let raf = 0;
    let running = false;
    let dragging = false;

    function apply(v: number) {
      frame!.style.setProperty("--reveal", `${v}%`);
    }

    // Eased glide toward target -- used for KEYBOARD steps only, so arrow keys
    // feel weighted. A live pointer drag bypasses this (sticks 1:1 to the cursor).
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

    function setTarget(v: number, immediate: boolean) {
      target.current = clamp(v);
      range!.value = String(Math.round(target.current)); // keep AT / keyboard synced
      if (immediate || reduced) {
        current.current = target.current;
        apply(current.current);
        if (raf) cancelAnimationFrame(raf);
        running = false;
        return;
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }

    const pctFromX = (clientX: number) => {
      const r = stage!.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    };

    // POINTER DRAG -- the divider moves ONLY by grabbing the handle (the <>
    // button on the divider). A press anywhere else in the panel does nothing
    // and never drags the image; while held, the divider tracks the cursor 1:1.
    // Pointer capture keeps the drag alive even if the cursor leaves the frame.
    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      e.preventDefault(); // kill image-drag ghost / text selection anywhere in the panel
      const onHandle = (e.target as Element | null)?.closest?.(
        ".design-reveal__divider",
      );
      if (!onHandle) return; // presses off the handle are inert
      dragging = true;
      frame!.classList.add("is-dragging", "is-touched");
      try { stage!.setPointerCapture(e.pointerId); } catch {}
      setTarget(pctFromX(e.clientX), true);
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      setTarget(pctFromX(e.clientX), true);
    }
    function endDrag(e: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      frame!.classList.remove("is-dragging");
      try { stage!.releasePointerCapture(e.pointerId); } catch {}
    }

    // KEYBOARD / AT -- the range still drives via arrow keys, with the glide.
    function onInput() {
      if (dragging) return; // pointer path owns live drags
      frame!.classList.add("is-touched");
      setTarget(Number(range!.value), false);
    }

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    range.addEventListener("input", onInput);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      range.removeEventListener("input", onInput);
    };
  }, []);

  return (
    <div className={"design-reveal" + (className ? ` ${className}` : "")}>
      <div className="design-reveal__header">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="design-reveal__heading">{heading}</h2>
        <p className="design-reveal__lead">{lead}</p>
      </div>

      {/* Page switcher: each tab swaps in a different before/after pair. */}
      {pages.length > 1 && (
        <div
          className="design-reveal__tabs"
          role="tablist"
          aria-label="Choose a page to compare"
        >
          {pages.map((p, i) => (
            <button
              key={p.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={
                "design-reveal__tab" + (i === active ? " is-active" : "")
              }
              onClick={() => setActive(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div ref={frameRef} className="design-reveal__frame" style={{ "--reveal": "36%" } as React.CSSProperties}>
        {/* Browser chrome */}
        <div className="design-reveal__bar" aria-hidden="true">
          <span className="design-reveal__dot" />
          <span className="design-reveal__dot" />
          <span className="design-reveal__dot" />
          <span className="design-reveal__url">{page.url}</span>
        </div>

        <div ref={stageRef} className="design-reveal__stage" aria-hidden="true">
          {/* Only the images are clipped to the rounded frame; the divider
              overlays OUTSIDE this clip so its handle can spill past the edges. */}
          <div className="design-reveal__clip">
            {/* BEFORE: the real client site prior to the redesign */}
            <div className="design-reveal__site design-reveal__site--before">
              <img
                className="design-reveal__shot"
                src={page.before}
                alt={page.beforeAlt}
                draggable={false}
              />
            </div>

            {/* AFTER: the chadworks redesign, clipped by the divider */}
            <div className="design-reveal__site design-reveal__site--after">
              <img
                className="design-reveal__shot"
                src={page.after}
                alt={page.afterAlt}
                draggable={false}
              />
            </div>
          </div>

          {/* Divider + handle + DRAG tab (UI indicators; the handle pulses
              until the first interaction) */}
          <div className="design-reveal__divider" aria-hidden="true">
            <span className="design-reveal__drag-tab">Drag</span>
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
          min={0}
          max={100}
          defaultValue={36}
          aria-label="Compare the template version with the designed version"
        />
      </div>

      <div className="design-reveal__labels">
        <span className="design-reveal__label">Before</span>
        <span className="design-reveal__label design-reveal__label--after">After</span>
      </div>
    </div>
  );
}
