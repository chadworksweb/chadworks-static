"use client";

// Anchored section rail for the long legal pages (terms, policies). A sticky
// list of every section in the document; the dot beside the current section
// fills in as you read, and the same dot marks that section's heading in the
// body so the rail and the copy read as one object.
//
// The section list is passed in rather than scraped from the DOM: the page owns
// one SECTIONS array that renders BOTH this rail and the body, so the two can
// never drift out of sync.
//
// No-JS / pre-hydration: the rail is plain anchor links and works on its own.
// Only the active-dot tracking needs the effect below.

import { useEffect, useRef, useState } from "react";

export type LegalTocItem = { id: string; title: string };

export function LegalToc({ sections }: { sections: LegalTocItem[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    // Active = the LAST section whose top has crossed the reading line, not
    // whatever happens to be visible. An IntersectionObserver alone flips to
    // any section in the viewport, which on a legal page (short sections, tall
    // screens) means several qualify at once and the dot jumps around.
    const measure = () => {
      const line = window.innerHeight * 0.3;
      let current = nodes[0].id;
      for (const n of nodes) {
        if (n.getBoundingClientRect().top <= line) current = n.id;
      }
      // A short final section can never reach the line, so the last item would
      // never light up. Pin it once the page is scrolled to the bottom.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) current = nodes[nodes.length - 1].id;
      setActive(current);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // On a short viewport the rail scrolls inside itself. Keep the lit item in
  // view so the rail still answers "where am I" instead of showing section 1
  // while you read section 18.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollHeight <= list.clientHeight) return;
    const lit = list.querySelector<HTMLElement>("[data-active]");
    if (!lit) return;
    const top = lit.offsetTop - list.clientHeight / 2 + lit.offsetHeight / 2;
    list.scrollTo({ top, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="cw-legal__rail" aria-label="Sections of this document">
      <p className="cw-legal__rail-kicker">On this page</p>
      {/* role="list" restores the semantics Safari drops from a
          list-style: none list. */}
      <ol className="cw-legal__rail-list" role="list" ref={listRef}>
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="cw-legal__rail-link"
                data-active={isActive ? "" : undefined}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="cw-legal__dot" aria-hidden="true" />
                <span>{s.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
