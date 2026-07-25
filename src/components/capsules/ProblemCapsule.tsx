// PROBLEM CAPSULE -- full-bleed, ribbons + knockout always (the sitewide
// signature). A page that supplies `problemArt` gets that extra visual in its
// OWN clean section below (ProblemArtCapsule), exactly as the template rendered
// it -- the ribbon+knockout band is never replaced, the art is additive.

import type { ReactNode } from "react";
import type { Service } from "@/lib/service";
import { Ribbon } from "@/components/Ribbon";
import { ProblemMore } from "@/components/ProblemMore";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type ProblemCapsuleProps = {
  problem: Service["problem"];
  // Rotate the ribbon triad for this page (see Ribbon). Both passes take the
  // same value or the knockout coverage stops matching the colour band.
  ribbonRotate?: 0 | 1 | 2;
};

export function ProblemCapsule({ problem, ribbonRotate = 0 }: ProblemCapsuleProps) {
  return (
    <SectionShell full className="svc-block svc-problem">
      {/* visible colored ribbons (behind) -- sticky band inside a full-height
          rail: stays half-visible at the viewport top while the opened
          pop-down glides over it, until the section is scrolled through. */}
      <div className="svc-gradient-pin">
        <Ribbon className="svc-gradient" rotate={ribbonRotate} />
      </div>

      {/* real, accessible text -- dark blue over the page */}
      <h2 className="svc-block__heading">{problem.heading}</h2>
      {problem.subheading && (
        <h3 className="svc-block__subheading">{problem.subheading}</h3>
      )}
      {problem.more ? (
        // Prose lifted off the ribbons into a frosted pop-down (CTA trigger).
        // The body leads the panel; `more.paragraphs` expand on it.
        <ProblemMore trigger={problem.more.trigger}>
          {!problem.more.hideBodyIntro && (
            <p className="svc-block__body">
              <W value={problem.body} />
            </p>
          )}
          {problem.more.paragraphs.map((p, i) => (
            <p key={i} className="svc-block__body">
              <W value={p} />
            </p>
          ))}
        </ProblemMore>
      ) : (
        <p className="svc-block__body measure-prose">
          <W value={problem.body} />
        </p>
      )}

      {/* Knockout overlay: a white-on-black coverage pass of the same ribbons,
          multiplied by an aria-hidden white duplicate of the text, then screened
          over the section -> the copy turns white only where a ribbon is under
          it. The duplicate is presentational; the heading above is the only
          real one in the DOM. */}
      <div className="svc-knockout" aria-hidden="true">
        <Ribbon className="svc-knockout__cov" mask rotate={ribbonRotate} />
        <div className="svc-knockout__text">
          <div className="svc-block__heading">{problem.heading}</div>
          {problem.subheading && (
            <div className="svc-block__subheading">{problem.subheading}</div>
          )}
          <div className="svc-block__body measure-prose">
            <W value={problem.body} />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

// PROBLEM ART (optional) -- the page's interactive demo in its OWN clean
// section, clearly separated from the ribbon band above.
export function ProblemArtCapsule({ children }: { children: ReactNode }) {
  return (
    <SectionShell full className="svc-problem-art-section">
      <div className="svc-problem-art">{children}</div>
    </SectionShell>
  );
}
