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
  // The project's own page at /showroom/<slug>/, when one exists. A project has
  // a page because src/content/projects/<slug>.md exists and for no other
  // reason, so this is set by the SERVER page that knows the filesystem, never
  // by the entity. Omitted for the projects that are showroom-only.
  storyHref?: string;
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
              {/* The title becomes the link when the piece HAS a page, pointing
                  at the same place the cue below does -- a card title that reads
                  as clickable should be. It carries no resting treatment at all
                  (see .cw-port-card__label a: inherited color, no underline), so
                  a card with a page looks identical to one without until the
                  pointer lands. Every other card keeps a plain heading rather
                  than linking out to the live site: the whole point of the rule
                  above is that a piece with a page is reached through its page. */}
              <Heading className="cw-port-card__label">
                {item.storyHref ? (
                  <a href={item.storyHref}>{item.label}</a>
                ) : (
                  item.label
                )}
              </Heading>
              {/* The corner icon is the live-site affordance, so it follows the
                  same rule as the cue below: a piece with a page of its own
                  sends the visitor to the page, and the page carries the live
                  link. Only pieces WITHOUT a page still point straight out. */}
              {item.href && !item.storyHref && (
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
            {/* The ONLY cue on this row, and only a piece with a page of its own
                gets one (Chad, 2026-07-28). There is deliberately no live-site
                cue down here to pair it with: the live link moved up next to the
                heading some time ago (.cw-port-card__visit) and that arrow is the
                whole affordance now. A "View site" text link used to be rendered
                here too and has been dead CSS-side ever since the move; the
                markup went with it.
                The cue NAMES the piece rather than saying "project", so it still
                describes where it goes when it is read away from the card it sits
                on -- a screen reader's link list, or a crawler weighing anchor
                text, sees 23 identical cues otherwise.
                Internal link, so it stays in the tab and is a real crawlable
                edge from the room to the project's page. */}
            {item.storyHref && (
              <a className="cw-port-card__story" href={item.storyHref}>
                Explore {item.label}{" "}
                <span className="cw-port-card__cue-arrow" aria-hidden="true">&#8594;</span>
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
