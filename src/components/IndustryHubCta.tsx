// Shared closing CTA for the industry niche template. Replaces the old per-page
// "other industries" wall (a long list of mostly-sealed cards) with a single
// funnel back to the industry hub -- cleaner, and it concentrates crawl equity
// on /industries-served/ instead of spraying it across unbuilt pages.
//
// Renders through SectionShell so the full-bleed band re-anchors its content to
// the site-width rail (a plain `.full` div does not re-anchor, which is what
// caused the edge bleed).

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";

export function IndustryHubCta() {
  return (
    <SectionShell full className="cw-industries">
      {/* Single block child re-anchors to the content rail; the button flows
          normally inside it so its inline-block width hugs the label (a direct
          grid child would stretch to full width). */}
      <div className="cw-industries__inner">
        <div className="cw-industries__eyebrow">Every industry</div>
        <h2 className="cw-industries__heading">Web design for any industry.</h2>
        <p className="cw-industries__lead">
          All kinds of industries. Web design is web design, so tell me what you
          need and I can build it.
        </p>
        <Link className="cw-art-btn cw-art-btn--primary" href="/industries-served/">
          See all industries served
        </Link>
      </div>
    </SectionShell>
  );
}
