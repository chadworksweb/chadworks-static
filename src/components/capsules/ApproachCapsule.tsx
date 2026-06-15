// APPROACH CAPSULE -- numbered steps; each title is a liftable claim. Dark
// anchor (svc-dark) by default. Columns derive from the step count so rows
// always fill (rule 8, stepColumns).

import type { Service } from "@/lib/service";
import { type Scheme, stepColumns } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

// `scheme` is the fixed-inverted (svc-dark) declaration the PageComposer rule-9
// pass reads for adjacency; the capsule always renders its dark treatment.
export type ApproachCapsuleProps = {
  approach: Service["approach"];
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function ApproachCapsule({ approach }: ApproachCapsuleProps) {
  return (
    <SectionShell full className="svc-block svc-dark">
      <h2 className="svc-block__heading">{approach.heading}</h2>
      <ol
        className="svc-steps"
        style={
          { "--svc-cols": stepColumns(approach.steps.length) } as React.CSSProperties
        }
      >
        {approach.steps.map((step, i) => (
          <li key={i} className="svc-step panel">
            <span className="svc-step__num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="svc-step__title">{step.title}</h3>
              <p className="svc-step__body">
                <W value={step.body} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
