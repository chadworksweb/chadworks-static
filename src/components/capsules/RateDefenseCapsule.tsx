// RATE DEFENSE CAPSULE -- "in defense of the rate" (/rates/).
//
// The /rates/ page shows the number and then shows the math behind the minutely
// rate. Neither answers the objection the number actually raises, which is not
// "how long does that take" but "why is one person worth that". This sits after
// the ledger and answers it: the rate is not buying a web designer's hour, it is
// buying every discipline the decision passes through.
//
// Owns its copy the way WorldviewCapsule and TenetsCapsule do. The lead line and
// the role list are Chad's own wording, verbatim; only the heading, the kicker
// label and the closing paragraph are written copy.
//
// TREATMENT: the /about/ APERTURE, reused. Same mechanism, different payload --
// there the fixed layer repeats one governing line, here it stacks the roles, so
// the window reads as a list running past the hole rather than one sentence
// sliding through it. The aperture and marquee CSS is shared with cw-worldview
// (see the WORLDVIEW block in global.css); this file only supplies the content
// and the cw-defense modifiers.

import { SectionShell } from "@/components/capsules/SectionShell";
import { HOURLY_RATE } from "@/lib/pricing";

// The eyebrow says the number out loud before the reader can. HOURLY_RATE is
// read from the pricing hub rather than typed, like every other figure on this
// page -- if the minutely rate ever moves, this eyebrow moves with it.
const EYEBROW = `Yes, my rate works out to ${HOURLY_RATE}.`;

// The lead, verbatim. It ends mid-sentence on purpose: the aperture finishes it.
const LEAD =
  "I am more than a web designer and developer. When I make a decision, I am also passing it through the mind of a:";

// The roles, in Chad's order and his words. These are NOT set as type in the
// section -- they are the payload of the fixed layer behind the page, revealed
// through the window. One per line, so the window shows two at a time and the
// rest keep going behind the copy.
const ROLES = [
  "Product Designer",
  "Brand Manager",
  "SEO Specialist",
  "Art Director",
  "Copywriter",
  "Marketer",
  "Business Owner",
  "AI Search Specialist",
  "Free Thinker",
  "Strategist",
  "Artist",
];

// The full list as one sentence, for the outline, screen readers and the LLM
// crawlers. The window itself is decorative duplication and is hidden.
const SPOKEN = `${ROLES.slice(0, -1).join(", ")}, and artist.`;

// Enough passes of the list to fill the tallest viewport the layer shows
// through. Each role is one line plus the gap, so three passes covers a very
// tall desktop window; the overflow is clipped and costs nothing.
const PASSES = 3;

export function RateDefenseCapsule() {
  return (
    // reveal={false} is REQUIRED, not a preference. `.reveal` keeps a filter on
    // the section at rest, and any filter other than `none` makes the section a
    // containing block for the fixed layer the window looks through, which pins
    // the layer to the section and kills the effect. Same reason as /about/.
    <SectionShell
      full
      reveal={false}
      className="svc-block svc-dark cw-defense"
      id="in-defense-of-the-rate"
    >
      <div className="cw-defense__copy">
        <p className="eyebrow">{EYEBROW}</p>
        <h2 className="svc-block__heading">Why my rate is what it is</h2>

        <p className="cw-defense__lead">{LEAD}</p>

        <h3 className="sr-only">{SPOKEN}</h3>
        <div className="cw-defense__aperture" aria-hidden="true">
          <div className="cw-defense__marquee">
            {Array.from({ length: PASSES }, (_, pass) =>
              ROLES.map((role, i) => <span key={`${pass}-${i}`}>{role}</span>)
            )}
          </div>
        </div>

        <div className="cw-defense__close">
          <p className="cw-defense__label">What my rate buys you</p>
          {/* Chad's wording, verbatim. Split across two paragraphs only for
              rhythm -- the ask stands on its own line rather than trailing the
              comparison. Nothing is reworded, merged or cut. */}
          <p className="cw-defense__closeline">
            Eleven specialists in a single package, all cross-examining every
            decision from their unique domains. An agency splits those roles
            across eleven people and bills you accordingly.
          </p>
          <p className="cw-defense__closeline">
            Hire chadworks. Experience a one-of-a-kind package of speed,
            precision and perception applied to your initiative.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

export default RateDefenseCapsule;
