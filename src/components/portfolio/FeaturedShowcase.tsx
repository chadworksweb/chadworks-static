// =====================================================================
// FeaturedShowcase -- Mode A. One flagship piece shown large through a
// DeviceMockup (desktop / tablet / mobile toggle). A copy column rides
// alongside, bound to the image's top and bottom edges. Static: no
// scroll-driven scale or drift.
// =====================================================================

import { DeviceMockup } from "./DeviceMockup";

export type FeaturedItem = {
  slug: string;
  alt: string;
  url: string;
  label: string;
  href: string;
};

// `pageHref` is set only when the flagship HAS a page of its own at
// /showroom/<slug>/. When it is, it REPLACES the live-site link, on the same
// rule the showroom reel and the archive cards run on (Chad, 2026-07-28): a
// piece with a page is reached through its page, and the page is what hands the
// visitor the live site. Without it the flagship keeps pointing straight out,
// which is what every other surface does for a piece with no page.
export function FeaturedShowcase({
  primary,
  eyebrow,
  heading,
  lede,
  headingAs: HeadingTag = "h2",
  ctaUnderLede = false,
  pageHref,
}: {
  primary: FeaturedItem;
  eyebrow: string;
  heading: string;
  lede: string;
  headingAs?: "h2" | "h3";
  ctaUnderLede?: boolean;
  pageHref?: string;
}) {
  const cta = pageHref ? (
    // Internal, so it stays in the tab and is a real crawlable edge from the
    // homepage into the project's page. Names the piece for the same reason the
    // archive cue does: read away from this block, "Explore" alone says nothing.
    <a className="cw-port-feat__link" href={pageHref}>
      Explore {primary.label}{" "}
      <span className="cw-port-feat__link-arrow" aria-hidden="true">
        &#8594;
      </span>
    </a>
  ) : (
    <a
      className="cw-port-feat__link"
      href={primary.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      Visit {primary.label}{" "}
      <svg
        className="cw-port-feat__link-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
  return (
    <div className="cw-port-feat">
      <div className="cw-port-feat__copy">
        <div className="cw-port-feat__copy-top">
          <span className="eyebrow">{eyebrow}</span>
          <HeadingTag className="cw-port-feat__heading">{heading}</HeadingTag>
          <p className="cw-port-feat__lede">{lede}</p>
          {ctaUnderLede && cta}
        </div>
        {!ctaUnderLede && cta}
      </div>

      <div className="cw-port-feat__stage">
        <div className="cw-port-feat__zoom">
          <DeviceMockup
            slug={primary.slug}
            alt={primary.alt}
            url={primary.url}
            label={primary.label}
            priority
            size="feature"
          />
        </div>
      </div>
    </div>
  );
}
