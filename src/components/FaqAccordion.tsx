"use client";

// FAQ accordion -- ported from the septic page (industry_faq): a glass list of
// toggle rows; each button flips .is-open on its item and aria-expanded, the
// answer slides via a grid-template-rows 0fr -> 1fr transition. Answers are
// ALWAYS in the static HTML (GEO/no-JS: only visually collapsed), and the
// FAQPage JSON-LD is emitted separately by the template.

import { useState, isValidElement } from "react";
import type { ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

// A multi-paragraph answer that can also carry inline links. A plain string
// answer can hold paragraph breaks (a blank line) but not JSX. In this build an
// inline <>...</> fragment evaluates to a plain array, so a bare array can't
// signal "paragraphs" without also catching every inline-link fragment. Hence a
// dedicated element the Answer renderer matches by type. Each item is one <p>.
export function FaqParas({ items }: { items: ReactNode[] }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

// A STRING answer may carry blank-line paragraph breaks, so a long answer reads
// as prose instead of one wall (Chad, 2026-07-17). Splitting here rather than
// changing the `a` type keeps answers plain strings, which matters: the FAQPage
// JSON-LD lifts `f.a` straight into `acceptedAnswer.text`, and JSX there would
// serialize an object into the schema.
// Anything that is not a string (JSX with inline links, a Prompt) renders as one
// paragraph exactly as before, so no existing FAQ moves.
// Is this element a FaqParas?
//
// IDENTITY DOES NOT SURVIVE THE RSC BOUNDARY, and that is the bug this exists
// for. This module is "use client"; the pages that build FAQ answers are server
// components. A <FaqParas> created on the server carries a client REFERENCE as
// its `type`, never the function object this module holds, so `a.type ===
// FaqParas` was always false in exactly the case it was written for. Every
// FaqParas answer was being wrapped in an extra <p>, producing invalid
// <p><p>...</p></p> that the browser then split into a stray empty paragraph.
// It was live on /faqs/ before this page ever used it.
//
// Props DO survive, so the shape is what gets checked. The identity test stays
// first as a fast path for anything built client-side.
function isFaqParas(a: ReactNode): boolean {
  if (!isValidElement(a)) return false;
  if (a.type === FaqParas) return true;
  return Array.isArray((a.props as { items?: unknown }).items);
}

function Answer({ a }: { a: ReactNode }) {
  // A FaqParas answer renders its own <p> list, so return it as-is rather than
  // wrapping it in another <p> (which would be invalid nesting).
  if (isFaqParas(a)) return a;
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
  const [open, setOpen] = useState<Set<number>>(() => new Set());

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
