// APERTURE BAND CAPSULE -- the dark band with a hole cut through it.
//
// Extracted from RateDefenseCapsule 2026-08-19 (Chad). The /rates/ block owned
// both its copy AND the shape, and the shape is the reusable half: a full-bleed
// dark band with aurora blooms, a photograph emerging out of the right edge,
// an APERTURE cut through the page to a viewport-fixed layer of repeating type,
// and a close block under it. Scrolling moves the hole across a layer that is
// holding still, so the payload appears to slide through the gap.
//
// THE SHAPE IS ALSO THE COPY CONSTRAINT, and it is the thing to understand
// before writing for this capsule. `lead` ends MID-SENTENCE, on a colon, and
// the payload finishes it. On /rates/ the lead is "...I am also passing it
// through the mind of a:" and the window runs the roles. A lead that ends in a
// full stop leaves the window reading as decoration.
//
// RateDefenseCapsule is now a thin caller. WorldviewCapsule is NOT: /about/
// cuts the same window but hangs it in a two-column layout with a real portrait
// figure and its own declarations and method blocks, which is a different
// section that happens to share a mechanism. The mechanism was already shared
// in CSS before this extraction and still is: the aperture and marquee rules
// name `.cw-worldview__*` and `.cw-aband__*` together.
//
// WHAT LIVES WHERE. `.cw-aband__*` in global.css is STRUCTURE, shared by every
// variant. Colour, the photograph and the eyebrow tint live under a variant
// class (`.cw-aband--rate`). Adding a band means adding a variant block and
// passing its name here. Never put a hue on the base rules.

import type { ReactNode } from "react";
import { SectionShell } from "@/components/capsules/SectionShell";

export type ApertureBandCapsuleProps = {
  // The variant suffix, e.g. "rate" -> `.cw-aband--rate`. Carries the band's
  // palette, its aurora hues, its photograph and its aperture shadow. Required,
  // because a band with no variant renders as an unstyled dark rectangle.
  variant: string;
  id?: string;
  eyebrow: ReactNode;
  heading: ReactNode;
  // Ends on a colon. See the note above.
  lead: ReactNode;
  // The lines that run through the window. Order is the reading order.
  payload: string[];
  // The payload as ONE readable string, for the document outline, screen
  // readers and the LLM crawlers. The window itself is aria-hidden decorative
  // duplication, so without this the content does not exist to any of them.
  // Written by the caller rather than joined here: /rates/ wants "..., and
  // artist." with the comma-and ending, and a generic join cannot know that.
  spoken: string;
  // The kicker label over the close block.
  closeLabel: ReactNode;
  // One paragraph per entry. Two is the established rhythm.
  close: ReactNode[];
  // Enough passes of the payload to fill the tallest viewport the layer shows
  // through. Each entry is one line plus the gap, so a short payload needs more
  // passes than a long one. The overflow is clipped and costs nothing.
  passes?: number;
  // OPTIONAL SECOND COLUMN: a real <img> beside the argument, in the same 2:1
  // grid /about/ hangs its portrait in.
  //
  // This is the fork between the two ways a band can carry a picture, and which
  // one is right is decided by the ASSET, not by taste. A rectangular
  // photograph with no alpha is atmosphere: it belongs in the variant's
  // `::after` as a background layer, masked so it emerges out of the band and
  // is gone before it reaches the copy (/rates/). A cutout of a person is not
  // atmosphere, it is the person, so it holds a column and comes through here
  // (/consulting/).
  //
  // Omitting this renders the copy rail alone, which is exactly what /rates/
  // produced before the prop existed.
  figure?: { src: string; alt: string; width?: number; height?: number };
  // Wrap every payload line in curly quotes and slant it, for a payload that is
  // SPEECH rather than a list of nouns. /consulting/ runs the sentences people
  // open with, so they are quoted; /rates/ runs job titles, which would read as
  // scare quotes. Opt-in for that reason.
  //
  // The quotes are added as JSX rather than typed into the payload array,
  // because the array's entries pass through `{line}` and React escapes them --
  // an `&ldquo;` in a string prints as itself. As literal JSX text the entity
  // resolves, so the page gets real typographic quotes while every source file
  // stays ASCII.
  quoted?: boolean;
};

export function ApertureBandCapsule({
  variant,
  id,
  eyebrow,
  heading,
  lead,
  payload,
  spoken,
  closeLabel,
  close,
  passes = 3,
  figure,
  quoted,
}: ApertureBandCapsuleProps) {
  // A FRAGMENT when there is no figure, so a caller that passes none produces
  // the markup it always produced: `.cw-aband__copy` as a direct child of the
  // section, picking up the page-shell grid re-anchor. Wrapping it in a div
  // unconditionally would have put every existing band inside an extra element
  // and re-anchored the copy rail one level down.
  const Layout = ({ children }: { children: ReactNode }) =>
    figure ? <div className="cw-aband__layout">{children}</div> : <>{children}</>;

  return (
    // reveal={false} is REQUIRED, not a preference. `.reveal` keeps a filter on
    // the section even at rest, and any filter other than `none` makes the
    // section a containing block for fixed descendants -- which pins the
    // marquee layer to the section and kills the effect outright. Same reason
    // /about/ opts out. If a caller ever needs the reveal, the answer is to
    // find another way to animate, not to turn this back on.
    <SectionShell
      full
      reveal={false}
      className={`svc-block svc-dark cw-aband cw-aband--${variant}`}
      id={id}
    >
      <Layout>
      <div className="cw-aband__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="svc-block__heading">{heading}</h2>

        <p className="cw-aband__lead">{lead}</p>

        {/* THE APERTURE. The payload is not set as type here -- it is a
            WINDOW. The lines are repeated down a layer fixed to the viewport
            and pushed behind the page, and this element is a hole cut through
            to it.

            MECHANISM: `clip-path` on the aperture clips `position: fixed`
            descendants, which plain `overflow: hidden` does not. That is why
            the hole is cut that way, and it is the other half of why this
            section cannot carry `.reveal`.

            The spoken version stays in the document for the outline, screen
            readers and the crawlers, just not painted; the window is
            decorative duplication and is hidden from the tree. */}
        <h3 className="sr-only">{spoken}</h3>
        <div className="cw-aband__aperture" aria-hidden="true">
          <div
            className={`cw-aband__marquee${
              quoted ? " cw-aband__marquee--quoted" : ""
            }`}
          >
            {Array.from({ length: passes }, (_, pass) =>
              payload.map((line, i) => (
                <span key={`${pass}-${i}`}>
                  {quoted ? <>&ldquo;{line}&rdquo;</> : line}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="cw-aband__close">
          <p className="cw-aband__label">{closeLabel}</p>
          {close.map((line, i) => (
            <p key={i} className="cw-aband__closeline">
              {line}
            </p>
          ))}
        </div>
      </div>

      {figure && (
        <figure className="cw-aband__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            decoding="async"
            loading="lazy"
          />
        </figure>
      )}
      </Layout>
    </SectionShell>
  );
}

export default ApertureBandCapsule;
