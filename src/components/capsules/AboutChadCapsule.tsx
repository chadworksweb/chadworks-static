// ABOUT CHAD CAPSULE -- the canonical "the Chad behind chadworks" human block
// (the homepage version), extracted so every page renders the same one. Wraps
// MadeByCapsule in its "split" layout with the shared founder content.
//
// The photo caption is overridable so a page can speak in its own context: the
// homepage says "Yes, this is the whole company"; the web-design page keeps its
// "Don't worry, I'm a professional. (Web designer.)" line. Everything else is
// identical everywhere.

import { MadeByCapsule } from "@/components/capsules/MadeByCapsule";
import { SpeedDemon } from "@/components/SpeedDemon";

export function AboutChadCapsule({
  captionMain = "Yes, this is the whole company.",
  captionSub = "(That's the point.)",
  className,
}: {
  captionMain?: string;
  captionSub?: string;
  // Per-instance hook, forwarded to the section. Used on /web-design/ to close
  // the gap under the portfolio showcase without moving this block elsewhere.
  className?: string;
} = {}) {
  return (
    <MadeByCapsule
      variant="split"
      className={className}
      made={{
        heading: (
          <>
            the <em>Chad</em> behind chadworks
          </>
        ),
        img: "/people/chad-cutout.webp",
        imgAlt: "Chad Lewine, the person behind chadworks",
        captionMain,
        captionSub,
        manifesto: [
          { lead: "Clear communication.", aside: "(no fluff, no fuss)" },
          { lead: "Transparent fees and terms.", aside: "(always)" },
          { lead: "Based in Philadelphia.", aside: "(U.S. made)" },
          {
            lead: "Blazing fast turnaround.",
            aside: (
              <>
                (<SpeedDemon href="https://www.youtube.com/watch?v=l039y9FaIjc">speed demon</SpeedDemon>)
              </>
            ),
          },
        ],
        negation: [
          "No subcontractors.",
          "No offshore handoffs.",
          "No invented case studies.",
          "No pretending I'm an agency or that the web is a perfect system.",
        ],
        close: "Trends come and go and the web changes. My values don't.",
        sig: "Chad Lewine",
      }}
    />
  );
}
