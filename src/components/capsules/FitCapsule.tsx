// FIT CAPSULE -- the canonical "Are We A Good Fit?" good-fit / not-a-fit block
// (global, shared). Rendered by the homepage, /about/ and the signed-off service
// pages, so every one of them qualifies a visitor in the same words. Wraps the
// generic QualificationCapsule with the canonical fit copy.
//
// The heading read "Who I Work With" until 2026-07-16, which is grammatically
// wrong: the pronoun is the object of "with", so it wants "whom". Reaching for
// "whom" would have fought the plain register used everywhere else here, so Chad
// made it a question instead. /are-we-a-good-fit/ is the room this teases.
//
// `moreLink` renders the cross-link into that room and defaults ON, so every page
// carrying the tease points at the full version. The room itself passes false --
// it renders this block as its own conclusion and must not link to itself, and
// overrides `heading` so the block does not repeat the room's H1. The fit copy
// below stays the single source for every surface either way.

import Link from "next/link";
import { QualificationCapsule } from "@/components/capsules/QualificationCapsule";
import { isLaunched } from "@/lib/launch";

const ROOM = "/are-we-a-good-fit/";

// THE canonical fit copy. Exported because /are-we-a-good-fit/ renders the bare
// QualPanels in its hero rather than this whole capsule, and the two must never
// drift into two versions of the same lists.
export const FIT = {
  heading: "Are We A Good Fit?",
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
};

export function FitCapsule({
  moreLink = true,
  heading = FIT.heading,
}: { moreLink?: boolean; heading?: string } = {}) {
  return (
    <QualificationCapsule
      qualification={{ ...FIT, heading }}
      footer={
        moreLink && isLaunched(ROOM) ? (
          <p className="svc-qual__more">
            <Link href={ROOM}>The longer answer, and what I built this for</Link>
          </p>
        ) : undefined
      }
    />
  );
}
