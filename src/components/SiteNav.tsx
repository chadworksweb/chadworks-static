"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WaveText } from "@/components/WaveText";

const LINKS = [
  { href: "/websites/", label: "Websites" },
  { href: "/visibility/", label: "Visibility" },
  { href: "/portfolio/", label: "Portfolio" },
  { href: "/about/", label: "About" },
  { href: "/rates/", label: "Rates" },
  { href: "/contact/", label: "Contact" },
];

// Routes that carry the bare (brand-only) header instead of the full nav: the
// homepage plus each individually-relaunched page whose full-nav links would
// otherwise point at still-sealed pages. Compared without a trailing slash.
const BARE_ROUTES = new Set([
  "/",
  "/show-up-on-chatgpt",
  "/advertising-on-chatgpt",
  "/website-design-for-septic-services",
  "/website-design-for-foundation-repair",
  "/web-design",
]);

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

  // Bare (brand-only) header on the homepage and the relaunched pages -- no
  // links and no mobile menu; navigation to the inner pages lives in the footer.
  const pathname = usePathname();
  const bare = BARE_ROUTES.has(pathname.replace(/\/+$/, "") || "/");

  // Escape closes the open panel.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (bare) {
    return (
      <nav className="site-nav">
        <div className="site-nav__inner">
          <span className="site-nav__brand">chadworks&trade;</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`site-nav${hidden ? " site-nav--hidden" : ""}${open ? " site-nav--open" : ""}`}>
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__brand" onClick={() => setOpen(false)}>
          chadworks&trade;
        </Link>
        <div className="site-nav__links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              <WaveText text={l.label} />
            </Link>
          ))}
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
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
