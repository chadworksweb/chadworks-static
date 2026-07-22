"use client";

import { useId, useState, type ReactNode } from "react";

// A LIGHT disclosure, sized to live inside a list item.
//
// ProblemMore is the same idea at section scale: a CTA-sized button that drops
// a frosted card. Dropping that into a bullet would outweigh the bullet it
// belongs to, so this is the inline cut -- a text button that reads as part of
// the sentence, and a panel that opens under it in the same <li>.
//
// The one behaviour copied exactly from ProblemMore: the expanded copy sits in
// the STATIC HTML whether the panel is open or shut, and only the visual
// collapse is client-side. That matters more here than almost anywhere else on
// the site, because this page's whole argument is that AI crawlers fetch
// JavaScript and never run it, so anything that exists only in client state is
// a thing no engine can read. The detail behind "Read more" is exactly the sort
// of qualifying text an engine should be quoting.
//
// The panel animates 0fr -> 1fr on a grid row, so it finds its own height with
// no hardcoded max-height to drift out of date.
// The label does NOT change on open, and that is deliberate (Chad,
// 2026-07-22). The trigger sits INLINE at the end of a sentence, so swapping it
// for a shorter word ("Read less") shortened the line, the whole anchor fitted
// back onto the row above, and it jumped up the moment you clicked it. Anything
// that changes the trigger's width re-wraps the paragraph underneath it, so the
// only stable answer for an inline trigger is a label that never resizes.
// `triggerOpen` is here for a caller that has room for it (a trigger on its own
// line cannot jump), and it falls back to `trigger` so the safe case is default.
// The open state is still announced properly through aria-expanded, and the
// panel appearing is its own visual confirmation.
export function InlineMore({
  trigger = "Read more",
  triggerOpen,
  children,
}: {
  trigger?: string;
  triggerOpen?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <button
        type="button"
        className="cw-inline-more__btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? triggerOpen ?? trigger : trigger}
      </button>
      <div id={panelId} className="cw-inline-more" data-open={open || undefined}>
        <div className="cw-inline-more__inner">{children}</div>
      </div>
    </>
  );
}

export default InlineMore;
