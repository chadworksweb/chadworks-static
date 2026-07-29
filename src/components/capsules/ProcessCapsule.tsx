// PROCESS CAPSULE -- the bold timeline (global, placed in multiple instances).
// Recreates the live chadworks.co "Website Design Process" bold timeline (a
// vertical center line, alternating cards, dot markers carrying the step
// number, a mono "Step N" supertitle over a bold title), rebranded to CWS
// tokens and rendered INVERTED (the svc-dark band) so it reads as its own bold
// moment. Reusable: feed it any ordered step list.
//
// `scheme` is the fixed-inverted declaration PageComposer's rule-9 pass reads;
// the capsule always renders its dark treatment.

import type { ReactNode } from "react";
import type { Writable } from "@/lib/service";
import type { Scheme } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

// `cta` is an OPTIONAL node rendered under the step body (a cross-link out to
// the page that step names). Kept out of ServiceStep on purpose: it is a
// presentation choice the placing page makes, not copy the service data owns.
export type ProcessStep = {
  title: string;
  body?: Writable | ReactNode;
  cta?: ReactNode;
};

export type ProcessCapsuleProps = {
  // Heading is "The <page> process" by default (e.g. "The web design process"),
  // derived from `pageName`; an explicit `heading` overrides it.
  pageName?: string;
  heading?: React.ReactNode;
  intro?: Writable;
  steps: ProcessStep[];
  stepLabel?: (i: number) => string; // supertitle text; default "Step N"
  // Per-instance modifier hook (e.g. `cw-process--nested`, which halves the
  // vertical pitch so the alternating cards nest instead of clearing).
  className?: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function ProcessCapsule({
  pageName,
  heading,
  intro,
  steps,
  stepLabel = (i) => `Step ${i + 1}`,
  className,
}: ProcessCapsuleProps) {
  const resolvedHeading =
    heading ?? (pageName ? `The ${pageName} process` : "The process");
  return (
    <SectionShell
      full
      className={`svc-block svc-dark cw-process${className ? ` ${className}` : ""}`}
    >
      <h2 className="svc-block__heading">{resolvedHeading}</h2>
      {intro && (
        <p className="svc-block__body measure-prose cw-process__intro">
          <W value={intro} />
        </p>
      )}
      <ol className="cw-process__line">
        {steps.map((s, i) => (
          <li key={i} className="cw-process__item reveal-late">
            <span className="cw-process__marker" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="cw-process__card panel">
              <p className="cw-process__step">{stepLabel(i)}</p>
              <h3 className="cw-process__title">{s.title}</h3>
              {s.body && (
                <p className="cw-process__body">
                  <W value={s.body} />
                </p>
              )}
              {s.cta && <p className="cw-process__cta">{s.cta}</p>}
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
