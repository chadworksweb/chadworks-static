"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WaveText } from "@/components/WaveText";
import { isLaunched } from "@/lib/launch";

type NavLink = {
  href: string;
  label: string;
  // Dropdown children. The site's FIRST dropdown is About > Rates (Chad,
  // 2026-07-16). Kept as a general shape rather than an About-only special case,
  // since the other lanes are the obvious next candidates.
  children?: { href: string; label: string }[];
};

// Order is Chad's. Lane 03 sits with the other two lanes, and Rates moves under
// About because it is a detail OF chadworks rather than a peer of the lanes.
// `/consulting/` is not launched (the hub does not exist yet), so isLaunched
// renders it greyed and unclickable rather than pointing at a 404. That is the
// intended state, not an oversight: Chad, 2026-07-16, "yes, consulting greyed
// out for now".
const LINKS: NavLink[] = [
  { href: "/websites/", label: "Websites" },
  { href: "/visibility/", label: "Visibility" },
  { href: "/consulting/", label: "Consulting" },
  { href: "/showroom/", label: "Showroom" },
  {
    href: "/about/",
    label: "About",
    children: [
      { href: "/rates/", label: "Rates" },
      { href: "/faqs/", label: "FAQs" },
    ],
  },
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
        <Link
          href="/"
          className="site-nav__brand"
          data-text={"chadworks™"}
          onClick={() => setOpen(false)}
        >
          chadworks&trade;
        </Link>
        <div className="site-nav__links">
          {LINKS.map((l) => {
            const top = isLaunched(l.href) ? (
              <Link href={l.href}>
                <WaveText text={l.label} />
              </Link>
            ) : (
              <span className="site-nav__soon" aria-disabled="true">
                {l.label}
              </span>
            );
            if (!l.children) return <Fragment key={l.href}>{top}</Fragment>;
            // Dropdown parent. Opening is pure CSS (:hover / :focus-within), so
            // it works before hydration and keyboard users get it for free by
            // tabbing into the group. No JS state, nothing to desync.
            return (
              <div key={l.href} className="site-nav__item">
                {top}
                <span className="site-nav__caret" aria-hidden="true" />
                <div className="site-nav__dropdown">
                  {l.children.map((c) =>
                    isLaunched(c.href) ? (
                      <Link key={c.href} href={c.href}>
                        <WaveText text={c.label} />
                      </Link>
                    ) : (
                      <span
                        key={c.href}
                        className="site-nav__soon"
                        aria-disabled="true"
                      >
                        {c.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
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
          {/* No hover on a touch panel, so a dropdown would be a trap. Children
              render as indented rows under their parent instead: the hierarchy
              is still legible and every row stays one tap. */}
          {LINKS.map((l) => (
            <Fragment key={l.href}>
              {isLaunched(l.href) ? (
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ) : (
                <span className="site-nav__soon" aria-disabled="true">
                  {l.label}
                </span>
              )}
              {l.children?.map((c) =>
                isLaunched(c.href) ? (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="site-nav__panel-child"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    key={c.href}
                    className="site-nav__soon site-nav__panel-child"
                    aria-disabled="true"
                  >
                    {c.label}
                  </span>
                )
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}
