"use client";

// FAQ accordion -- ported from the septic page (industry_faq): a glass list of
// toggle rows; each button flips .is-open on its item and aria-expanded, the
// answer slides via a grid-template-rows 0fr -> 1fr transition. Answers are
// ALWAYS in the static HTML (GEO/no-JS: only visually collapsed), and the
// FAQPage JSON-LD is emitted separately by the template.

import { useState } from "react";
import type { ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

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
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
