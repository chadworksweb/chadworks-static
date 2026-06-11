"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/websites/", label: "Websites" },
  { href: "/visibility/", label: "Visibility" },
  { href: "/portfolio/", label: "Portfolio" },
  { href: "/about/", label: "About" },
  { href: "/rates/", label: "Rates" },
];

// Per-letter spans so each link can do a staggered traveling wave on hover
// (the chadlewine logo's stepped-delay shimmer, applied to motion). The link's
// accessible name is unaffected -- screen readers still read the joined text.
function WaveText({ text }: { text: string }) {
  return (
    <span className="nav-wave">
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="nav-wave__letter"
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export default function SiteNav() {
  // Scroll-up-only sticky: hide when scrolling down past a threshold, show on
  // scroll-up or at the top. Mirrors the chadlewine Nav scroll handler.
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > 200 && y > lastScroll.current);
      lastScroll.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav${hidden ? " site-nav--hidden" : ""}`}>
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__brand">
          chadworks&trade;
        </Link>
        <div className="site-nav__links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              <WaveText text={l.label} />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
