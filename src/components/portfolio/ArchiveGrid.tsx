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

// The card title's heading LEVEL depends on what sits above the grid, so the page
// owns it, not the grid. /portfolio/ and the homepage put the grid under their own
// "More sites I've custom built" h2, where h3 is the correct next rung. /showroom/
// has only its h1, so an h3 there would skip a level. Default h3 keeps every
// existing caller rendering exactly as before.
export function ArchiveGrid({
  items,
  headingLevel: Heading = "h3",
}: {
  items: ArchiveItem[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className="cw-port-grid">
      {items.map((item) => (
        <article className="cw-port-card" key={item.key}>
          <DeviceMockup slug={item.slug} alt={item.alt} url={item.url} label={item.label} />
          <div className="cw-port-card__meta">
            <div className="cw-port-card__labelrow">
              <Heading className="cw-port-card__label">{item.label}</Heading>
              {item.href && (
                <a
                  className="cw-port-card__visit"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${item.label} live site`}
                >
                  <svg
                    className="cw-port-card__visit-icon"
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
                  <span className="cw-port-card__tip" aria-hidden="true">
                    Visit live site
                  </span>
                </a>
              )}
            </div>
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
