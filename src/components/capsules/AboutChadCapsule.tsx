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
import { PERSON } from "@/lib/service";

// Chad's OWN profiles, derived from PERSON.sameAs so this block and the entity
// graph cannot drift. Deliberately NOT the studio's profiles: the footer runs
// ORG.sameAs (LinkedIn company page, GitHub org, Crunchbase, Contra studio,
// Reddit), and this block is the human, so it runs the personal accounts. Those
// two arrays exist precisely so a person's profile is never asserted as the
// organisation's, and mixing them here would undo that.
const PERSON_LABELS = [
  { match: "linkedin.com", label: "LinkedIn" },
  { match: "github.com", label: "GitHub" },
  { match: "contra.com", label: "Contra" },
] as const;

// Bare hostname matching is safe here because only PERSON.sameAs is read; the
// org's LinkedIn, GitHub and Contra live on the other array and never reach this.
const PERSON_PROFILES = PERSON_LABELS.flatMap(({ match, label }) => {
  const href = PERSON.sameAs.find((u) => u.includes(match));
  return href ? [{ href, label }] : [];
});

export function AboutChadCapsule({
  captionMain = "Yes, this is the whole company.",
  captionSub = "(That's the point.)",
  className,
  profiles = false,
}: {
  captionMain?: string;
  captionSub?: string;
  // Per-instance hook, forwarded to the section. Used on /web-design/ to close
  // the gap under the portfolio showcase without moving this block elsewhere.
  className?: string;
  // Render Chad's personal profile links under the caption card. OFF by default
  // and on only on /about/ (Chad, 2026-07-31). This block also renders on the
  // homepage, /web-design/ and /website-redesign/; the links belong on the page
  // that is actually about the person.
  profiles?: boolean;
} = {}) {
  return (
    <MadeByCapsule
      variant="split"
      className={className}
      profiles={profiles ? PERSON_PROFILES : undefined}
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
