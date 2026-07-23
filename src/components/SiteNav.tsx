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
  {
    href: "/websites/",
    label: "Websites",
    // Chad, 2026-07-23. Labels are lifted from SiteFooter rather than written
    // fresh, so the same route is never called two things depending on where a
    // reader met it.
    children: [
      { href: "/web-design/", label: "Web Design" },
      { href: "/web-development/", label: "Web Development" },
      { href: "/website-design-cost-calculator/", label: "Website Cost Calculator" },
    ],
  },
  { href: "/visibility/", label: "Visibility" },
  { href: "/consulting/", label: "Consulting" },
  { href: "/essays/", label: "Essays" },
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

  // ---- LET THE COLOURWAVE FINISH ITS CYCLE (Chad, 2026-07-23) --------------
  // The wave is bound to :hover, so moving the pointer to the next item killed
  // it mid-stride and the letters snapped back to rest. Skimming the menu read
  // as a series of interruptions.
  //
  // The rule: leaving a link for somewhere else INSIDE the menu lets the wave
  // play out its current cycle; leaving the menu entirely kills it on the spot,
  // same as the dropdown closing.
  //
  // Per LETTER, not per link, because the letters are staggered by --i. Waiting
  // on the last letter alone would leave the earlier ones part-way into a fresh
  // cycle when the class came off. Each letter instead ends on its OWN
  // animationiteration, which is by definition the 100% keyframe (rest colour),
  // so the wave drains off the end of the word instead of being cut.
  const linksRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = linksRef.current;
    if (!root) return;
    const FINISHING = "is-finishing";

    // Drop a link out of the finishing state and undo the per-letter freezes.
    const cancel = (link: HTMLElement) => {
      link.classList.remove(FINISHING);
      link.querySelectorAll<HTMLElement>(".nav-wave__letter").forEach((l) => {
        l.style.animation = "";
      });
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest?.(".site-nav__links a") as HTMLElement | null;
      if (!link) return;
      const to = e.relatedTarget as Node | null;
      if (to && link.contains(to)) return; // still within the same link

      // Left the menu altogether: kill it now, do not let it drain.
      if (!to || !root.contains(to)) {
        cancel(link);
        return;
      }

      const letters = [...link.querySelectorAll<HTMLElement>(".nav-wave__letter")];
      if (!letters.length) return;
      // Adding the class in the same tick that :hover drops keeps the computed
      // animation-name identical, so the running animation carries on rather
      // than restarting from 0%.
      link.classList.add(FINISHING);
      let pending = letters.length;
      for (const letter of letters) {
        const done = () => {
          letter.removeEventListener("animationiteration", done);
          // Freeze THIS letter now: it has just crossed 100%, which is rest.
          letter.style.animation = "none";
          if (--pending === 0) cancel(link);
        };
        letter.addEventListener("animationiteration", done);
      }
    };

    // Coming back to a draining link hands it straight back to :hover.
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest?.(".site-nav__links a") as HTMLElement | null;
      if (link?.classList.contains(FINISHING)) cancel(link);
    };

    const onLeave = () => {
      root.querySelectorAll<HTMLElement>(`.${FINISHING}`).forEach(cancel);
    };

    root.addEventListener("mouseout", onMouseOut);
    root.addEventListener("mouseover", onMouseOver);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mouseout", onMouseOut);
      root.removeEventListener("mouseover", onMouseOver);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

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
        <div className="site-nav__links" ref={linksRef}>
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
