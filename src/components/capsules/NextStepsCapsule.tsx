// NEXT STEPS CAPSULE (optional) -- what happens after you reach out.
// Phase F adds the variant="arrow-flow" treatment (arrows between steps).

import type { Service } from "@/lib/service";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type NextStepsCapsuleProps = {
  nextSteps: NonNullable<Service["nextSteps"]>;
};

export function NextStepsCapsule({ nextSteps }: NextStepsCapsuleProps) {
  return (
    <SectionShell className="svc-block">
      <h2 className="svc-block__heading">{nextSteps.heading}</h2>
      <ol className="svc-nextsteps">
        {nextSteps.steps.map((st, i) => (
          <li key={i} className="svc-nextstep">
            <span className="svc-nextstep__num">{i + 1}</span>
            <div>
              <h3 className="svc-nextstep__title">{st.title}</h3>
              <p className="svc-nextstep__body">
                <W value={st.body} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
