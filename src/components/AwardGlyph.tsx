"use client";

// AWARD GLYPH -- the ribbon beside the "Notable Achievements" heading, painted
// as a continuation of the heading's own scroll-fill rather than as a second
// thing that fills alongside it.
//
// WHY THIS IS NOT CSS. The heading fills via `svc-fill`: one gradient, sized to
// 200% of the heading, clipped to the text, with PageMotion sweeping its
// background-position on scroll. A mask can borrow that gradient, but it cannot
// borrow its GEOMETRY -- a percentage background-size and background-position
// resolve against whatever box they are on, so an icon with the same values
// gets its own private sweep across its own 1em box. That is the bug this
// replaces: the ribbon was wiping independently of the words.
//
// To be one continuous wipe, the icon has to paint the same image at the same
// scale, offset by exactly how far into the heading it sits -- and that offset
// is a rendered layout value CSS has no handle on. So the geometry is mirrored
// in pixels here:
//
//   image width      = 2 * heading width          (the heading's 200%)
//   image left edge  = -(p / 100) * heading width (p = heading's position %)
//   icon position x  = image left edge - icon's offset from the heading's left
//
// Which puts the icon's slice of the gradient exactly where it would fall if
// the ribbon were one more letter in the word. The gradient itself is read off
// the heading rather than restated, so it cannot drift from `svc-fill`.
//
// Driven by a MutationObserver on the heading's style attribute: PageMotion
// writes background-position there every frame it updates, so this follows
// without a second scroll listener or a second rAF loop of its own.

import { useEffect, useRef } from "react";

export function AwardGlyph() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const heading = el.closest("h2");
    if (!heading) return;

    // Borrowed once, not restated: whatever gradient svc-fill defines is the
    // gradient the ribbon paints.
    el.style.backgroundImage = getComputedStyle(heading).backgroundImage;

    const sync = () => {
      const width = heading.clientWidth;
      if (!width) return;
      const offset =
        el.getBoundingClientRect().left - heading.getBoundingClientRect().left;
      // PageMotion writes "<n>% 0"; before it runs, svc-fill's own 0% applies.
      const percent = parseFloat(heading.style.backgroundPosition) || 0;
      const imageLeft = -(percent / 100) * width;
      el.style.backgroundSize = `${width * 2}px 100%`;
      el.style.backgroundPosition = `${imageLeft - offset}px 0`;
    };

    sync();
    const styleObserver = new MutationObserver(sync);
    styleObserver.observe(heading, {
      attributes: true,
      attributeFilter: ["style"],
    });
    // Width changes move both the scale and the offset, so re-derive on resize.
    const sizeObserver = new ResizeObserver(sync);
    sizeObserver.observe(heading);

    return () => {
      styleObserver.disconnect();
      sizeObserver.disconnect();
    };
  }, []);

  return <span ref={ref} className="cw-ach__award" aria-hidden="true" />;
}

export default AwardGlyph;
