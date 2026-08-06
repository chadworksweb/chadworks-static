// WORLDVIEW CAPSULE -- "why nothing here looks like anything else" (/about/).
//
// The missing answer on the About page. ManifestoSection answers who chadworks
// is FOR and aims outward at the client's ambition; TenetsCapsule answers what
// chadworks PROMISES. Neither answers why THIS person is the one, so the page
// went straight from a pitch to a guarantee with no argument in between. This
// sits directly after the manifesto and fills that gap: the claim, then the
// method that makes the claim true.
//
// Owns its copy the same way TenetsCapsule and FitCapsule do, because /about/
// is not a Service page and cannot reach a `service.*` slot. Canonical home of
// this text; nothing else should retype it.
//
// HARD RULE: every line in DECLARATIONS and METHOD is Chad's own wording,
// verbatim (typos corrected, nothing reworded, nothing merged or split). Only
// the eyebrow, the heading and the two kicker labels are written copy. If this
// block is ever edited for flow, it stops being the thing it is arguing for.
//
// TREATMENT: a dark band, deliberately. It follows the manifesto's airy frosted
// panel over the pale cloud, and the tonal snap is the point -- the section
// saying "I am the blackest of the sheep" should not look like the section
// above it either. The opening line gets the cw-rule accent treatment (large,
// left rule, not centered, because centering makes a statement decorative
// rather than spoken); the declarations run as beats, one breath per line.

import { SectionShell } from "@/components/capsules/SectionShell";

// The governing line. Not set as type -- repeated down the fixed layer behind
// the page and revealed through the aperture. See the render block.
const LINE = "I don't let it look like anything else.";

// The same line broken EXPLICITLY, because the window is two lines tall and the
// break has to land in the same place at every viewport width. Left to wrap on
// its own it would break differently as --text-2xl clamps, and a repeat that is
// sometimes one line and sometimes two would not stack.
const LINE_PARTS = ["I don't let it look", "like anything else."];

// Enough repeats to fill the tallest viewport the layer can be seen through.
// Each repeat is two lines of --text-2xl, so 24 covers a very tall desktop
// window with room to spare; extra spans cost nothing, the overflow is clipped.
const REPEATS = 24;

// The worldview. Why the work comes out unlike the rest of the web.
const DECLARATIONS = [
  "My view of the world is unique.",
  "Everything that has always excluded me is now becoming valuable.",
  "I don't do trends, I don't do academia, I don't follow the crowd.",
  "I am the blackest of the sheep.",
];

// The method. What "custom built" actually means when the tools can generate.
const METHOD = [
  "By nature, I use my mind as a reference.",
  "I might see things in the wild that I feed to AI as a reference for them, but the final vision is only in my head, and I don't stop shaping until what's on the screen matches what's in my head.",
];

export function WorldviewCapsule() {
  return (
    // reveal={false} is REQUIRED, not a preference -- see the aperture comment
    // below. `.reveal` keeps a filter on the section at rest, and that makes the
    // section a containing block for the fixed layer the window looks through.
    <SectionShell
      full
      reveal={false}
      className="svc-block svc-dark cw-worldview"
      id="worldview"
    >
      {/* Argument left (2/3), portrait right (1/3). Same shape as the
          why-one-person block on /how-much-does-a-website-cost/: when the claim
          is "this comes out of one specific head", the section shows the head.
          The h2 sits INSIDE the left column (Chad, 2026-08-06) rather than
          spanning the section, so the whole argument reads as one column with
          the portrait beside it. */}
      <div className="cw-worldview__layout">
        <div className="cw-worldview__copy">
          {/* Plain section heading, NOT GlyphTitleBar (Chad, 2026-08-06): the
              shade ramp is chadlewine language, traced in with the VSR capsules,
              and it does not belong on a chadworks page. */}
          <h2 className="svc-block__heading">How I guarantee original design</h2>

          <div className="cw-worldview__beats">
            {DECLARATIONS.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* THE APERTURE (Chad, 2026-08-06). The governing line is not set as
              type here -- it is a WINDOW. The line is repeated down a layer
              fixed to the viewport and pushed behind the page, and this element
              is a hole of exactly the size the h3 used to occupy, cut through to
              it. Scrolling moves the hole across a stationary layer, so the
              quote appears to slide through the gap.

              MECHANISM: `clip-path` on the aperture clips `position: fixed`
              descendants (plain `overflow: hidden` does not), which is why the
              hole is cut that way. It is also why this section opts OUT of the
              scroll reveal -- `.reveal` leaves `filter: blur(0)` on the section
              even at rest, and any filter other than `none` makes the section a
              containing block for fixed children, which would pin the layer to
              the section and kill the effect entirely.

              The real h3 stays in the document for the outline, screen readers
              and the LLM crawlers, just not painted; the window itself is
              decorative duplication and is hidden from the tree. */}
          <h3 className="sr-only">{LINE}</h3>
          <div className="cw-worldview__aperture" aria-hidden="true">
            <div className="cw-worldview__marquee">
              {Array.from({ length: REPEATS }, (_, i) => (
                <span key={i}>
                  {LINE_PARTS[0]}
                  <br />
                  {LINE_PARTS[1]}
                </span>
              ))}
            </div>
          </div>

          <div className="cw-worldview__method">
            <p className="cw-worldview__label">Where the design comes from</p>
            {METHOD.map((line, i) => (
              <p key={i} className="cw-worldview__methodline">
                {line}
              </p>
            ))}
          </div>
        </div>

        <figure className="cw-worldview__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/cutouts/chad_cutout_home_full.webp"
            alt="Chad Lewine, the one person whose head every chadworks design comes out of"
            decoding="async"
            loading="lazy"
          />
        </figure>
      </div>
    </SectionShell>
  );
}

export default WorldviewCapsule;
