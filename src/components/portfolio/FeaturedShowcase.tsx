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

export function FeaturedShowcase({
  primary,
  eyebrow,
  heading,
  lede,
  headingAs: HeadingTag = "h2",
  ctaUnderLede = false,
}: {
  primary: FeaturedItem;
  eyebrow: string;
  heading: string;
  lede: string;
  headingAs?: "h2" | "h3";
  ctaUnderLede?: boolean;
}) {
  const cta = (
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
