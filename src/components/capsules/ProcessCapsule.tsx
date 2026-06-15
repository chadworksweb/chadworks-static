// PROCESS CAPSULE -- the bold timeline (global, placed in multiple instances).
// Recreates the live chadworks.co "Website Design Process" bold timeline (a
// vertical center line, alternating cards, dot markers carrying the step
// number, a mono "Step N" supertitle over a bold title), rebranded to CWS
// tokens and rendered INVERTED (the svc-dark band) so it reads as its own bold
// moment. Reusable: feed it any ordered step list.
//
// `scheme` is the fixed-inverted declaration PageComposer's rule-9 pass reads;
// the capsule always renders its dark treatment.

import type { Writable } from "@/lib/service";
import type { Scheme } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type ProcessStep = { title: string; body?: Writable };

export type ProcessCapsuleProps = {
  heading: React.ReactNode;
  intro?: Writable;
  steps: ProcessStep[];
  stepLabel?: (i: number) => string; // supertitle text; default "Step N"
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function ProcessCapsule({
  heading,
  intro,
  steps,
  stepLabel = (i) => `Step ${i + 1}`,
}: ProcessCapsuleProps) {
  return (
    <SectionShell full className="svc-block svc-dark cw-process">
      <h2 className="svc-block__heading">{heading}</h2>
      {intro && (
        <p className="svc-block__body measure-prose cw-process__intro">
          <W value={intro} />
        </p>
      )}
      <ol className="cw-process__line">
        {steps.map((s, i) => (
          <li key={i} className="cw-process__item">
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
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
