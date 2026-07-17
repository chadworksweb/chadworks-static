"use client";

// FAQ accordion -- ported from the septic page (industry_faq): a glass list of
// toggle rows; each button flips .is-open on its item and aria-expanded, the
// answer slides via a grid-template-rows 0fr -> 1fr transition. Answers are
// ALWAYS in the static HTML (GEO/no-JS: only visually collapsed), and the
// FAQPage JSON-LD is emitted separately by the template.

import { useState } from "react";
import type { ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

// A STRING answer may carry blank-line paragraph breaks, so a long answer reads
// as prose instead of one wall (Chad, 2026-07-17). Splitting here rather than
// changing the `a` type keeps answers plain strings, which matters: the FAQPage
// JSON-LD lifts `f.a` straight into `acceptedAnswer.text`, and JSX there would
// serialize an object into the schema.
// Anything that is not a string (JSX with inline links, a Prompt) renders as one
// paragraph exactly as before, so no existing FAQ moves.
function Answer({ a }: { a: ReactNode }) {
  if (typeof a === "string") {
    const paras = a
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paras.length > 1) {
      return (
        <>
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </>
      );
    }
  }
  return <p>{a}</p>;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="svc-acc">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={`svc-acc__item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="svc-acc__q"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              {item.q}
            </button>
            <div className="svc-acc__a">
              <div className="svc-acc__a-inner">
                <Answer a={item.a} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
