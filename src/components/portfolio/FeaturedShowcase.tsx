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
}: {
  primary: FeaturedItem;
  eyebrow: string;
  heading: string;
  lede: string;
}) {
  return (
    <div className="cw-port-feat">
      <div className="cw-port-feat__copy">
        <div className="cw-port-feat__copy-top">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="cw-port-feat__heading">{heading}</h2>
          <p className="cw-port-feat__lede">{lede}</p>
        </div>
        <a
          className="cw-port-feat__link"
          href={primary.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {primary.label} <span aria-hidden="true">&#8599;</span>
        </a>
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
