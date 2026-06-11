"use client";

import { useId, useState, type ReactNode } from "react";

// CTA disclosure for the Problem section. The prose lives OFF the ribbon
// background: a frosted panel pops down on demand, so the copy is read on a
// deliberate opened surface instead of fighting the ribbons for contrast.
// The expanded copy is in the static HTML whether open or closed (engines and
// no-JS readers get it); only the visual collapse is client-side. The section
// is top-anchored (see .svc-problem), so opening grows the section DOWNWARD
// and the H2 knockout overlay never moves.

// chevron-down -- inline so there's no icon dep; rotates when open.
function Chevron() {
  return (
    <svg
      className="svc-more__chev"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ProblemMore({
  trigger,
  children,
}: {
  trigger: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="svc-more">
      <button
        type="button"
        className="svc-btn svc-more__btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="svc-btn__label">{trigger}</span>
        <Chevron />
      </button>
      <div id={panelId} className="svc-more__panel" data-open={open || undefined}>
        <div className="svc-more__inner">
          <div className="svc-more__card">{children}</div>
        </div>
      </div>
    </div>
  );
}
