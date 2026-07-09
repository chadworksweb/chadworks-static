"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WaveText } from "@/components/WaveText";
import { isLaunched } from "@/lib/launch";

const LINKS = [
  { href: "/websites/", label: "Websites" },
  { href: "/visibility/", label: "Visibility" },
  { href: "/portfolio/", label: "Portfolio" },
  { href: "/about/", label: "About" },
  { href: "/rates/", label: "Rates" },
  { href: "/contact/", label: "Contact" },
];

export default function SiteNav() {
  // Scroll-up-only sticky: hide when scrolling down past a threshold, show on
  // scroll-up or at the top. Mirrors the chad-site Nav scroll handler.
  const [hidden, setHidden] = useState(false);
  // Mobile menu (<=900): slide-down panel under the header bar.
  const [open, setOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > 200 && y > lastScroll.current && !openRef.current);
      lastScroll.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the scroll handler honest about the menu without re-binding it.
  const openRef = useRef(open);
  openRef.current = open;

  // Escape closes the open panel.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The full nav renders sitewide. A link whose route isn't launched yet renders
  // greyed and non-clickable (a "coming soon" placeholder) instead of pointing
  // at a sealed page. Launch state is driven entirely by launch.ts.
  return (
    <nav className={`site-nav${hidden ? " site-nav--hidden" : ""}${open ? " site-nav--open" : ""}`}>
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__brand" onClick={() => setOpen(false)}>
          chadworks&trade;
        </Link>
        <div className="site-nav__links">
          {LINKS.map((l) =>
            isLaunched(l.href) ? (
              <Link key={l.href} href={l.href}>
                <WaveText text={l.label} />
              </Link>
            ) : (
              <span key={l.href} className="site-nav__soon" aria-disabled="true">
                {l.label}
              </span>
            )
          )}
        </div>
        {/* Mobile-only (<=900) hamburger; the inline links hide at that tier. */}
        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="site-nav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="site-nav__toggle-bar" aria-hidden="true" />
          <span className="site-nav__toggle-bar" aria-hidden="true" />
          <span className="site-nav__toggle-bar" aria-hidden="true" />
        </button>
      </div>
      {/* Slide-down panel. Always in the DOM (grid-rows animation); links are
          untabbable while closed via the inert attribute. */}
      <div id="site-nav-panel" className="site-nav__panel" inert={open ? undefined : true}>
        <div className="site-nav__panel-inner">
          {LINKS.map((l) =>
            isLaunched(l.href) ? (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <span key={l.href} className="site-nav__soon" aria-disabled="true">
                {l.label}
              </span>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
