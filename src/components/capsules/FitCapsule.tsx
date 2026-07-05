// FIT CAPSULE -- the homepage's "Who I Work With" good-fit / not-a-fit block
// (global, shared). Extracted from the homepage so any page renders the same
// qualification section. Wraps the generic QualificationCapsule with the
// canonical fit copy.

import { QualificationCapsule } from "@/components/capsules/QualificationCapsule";

export function FitCapsule() {
  return (
    <QualificationCapsule
      qualification={{
        heading: "Who I Work With",
        fitLabel: "chadworks is for you if:",
        notLabel: "Probably not if:",
        fit: [
          "You want what you want, and you'd rather pay to have it built right than negotiate it down to almost right.",
          "You see your project as an integral part of your initiative, not just the brochure for it.",
          "You're building something you intend to keep for a long time.",
        ],
        notFit: [
          "You're on a strict, low budget. In the Venn diagram of good, fast, and cheap, I'm fast and good.",
          "You want a template with your logo dropped in. Plenty of builders do that, but I'm not one of them.",
          "You're building this as a hobby, not a business, product or organization.",
        ],
      }}
    />
  );
}
