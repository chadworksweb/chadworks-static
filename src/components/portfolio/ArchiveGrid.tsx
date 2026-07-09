// =====================================================================
// ArchiveGrid -- Mode B. Each client site on a site-width responsive grid,
// shown through a DeviceMockup so it can be viewed at desktop, tablet, or
// mobile. The frame is not itself a link (the device toggle lives inside it);
// the label and a "View site" cue link out to the live site in a new tab. The
// grid tiers with the global breakpoints (2-up at the rail, 1-up on mobile).
// =====================================================================

import { DeviceMockup } from "./DeviceMockup";

export type ArchiveItem = {
  key: string;
  slug: string; // resolves /portfolio/<slug>-<device>.jpg
  alt: string;
  url: string; // chrome-bar display host
  label: string;
  href?: string; // live site; omit for pieces with no public link
  blurb: string;
};

export function ArchiveGrid({ items }: { items: ArchiveItem[] }) {
  return (
    <div className="cw-port-grid">
      {items.map((item) => (
        <article className="cw-port-card" key={item.key}>
          <DeviceMockup slug={item.slug} alt={item.alt} url={item.url} label={item.label} />
          <div className="cw-port-card__meta">
            <h3 className="cw-port-card__label">{item.label}</h3>
            <p className="cw-port-card__blurb">{item.blurb}</p>
            {item.href && (
              <a
                className="cw-port-card__cue"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View site <span className="cw-port-card__cue-arrow" aria-hidden="true">&#8599;</span>
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
