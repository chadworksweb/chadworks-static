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
// THIS FILE IS NOW COPY ONLY (2026-08-19). The band, the aurora, the photograph,
// the aperture and the marquee moved to ApertureBandCapsule so /consulting/ can
// cut the same window with a different payload. Nothing about how /rates/
// renders changed: the markup this produces is the markup it always produced,
// with `.cw-defense__*` renamed to the shared `.cw-aband__*` and the green
// palette, the photo and the eyebrow tint moved behind `.cw-aband--rate`.
//
// TREATMENT: the /about/ APERTURE, reused. Same mechanism, different payload --
// there the fixed layer repeats one governing line, here it stacks the roles, so
// the window reads as a list running past the hole rather than one sentence
// sliding through it.

import { ApertureBandCapsule } from "@/components/capsules/ApertureBandCapsule";
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
    <ApertureBandCapsule
      variant="rate"
      id="in-defense-of-the-rate"
      eyebrow={EYEBROW}
      heading="Why my rate is what it is"
      lead={LEAD}
      payload={ROLES}
      spoken={SPOKEN}
      passes={PASSES}
      closeLabel="What my rate buys you"
      /* Chad's wording, verbatim. Split across two paragraphs only for rhythm --
         the ask stands on its own line rather than trailing the comparison.
         Nothing is reworded, merged or cut. */
      close={[
        "Eleven specialists in a single package, all cross-examining every decision from their unique domains. An agency splits those roles across eleven people and bills you accordingly.",
        "Hire chadworks. Experience a one-of-a-kind package of speed, precision and perception applied to your initiative.",
      ]}
    />
  );
}

export default RateDefenseCapsule;
