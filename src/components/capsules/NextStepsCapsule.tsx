// NEXT STEPS CAPSULE (optional) -- what happens after you reach out.
// Phase F adds the variant="arrow-flow" treatment (arrows between steps).

import type { Service } from "@/lib/service";
import { cx } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type NextStepsCapsuleProps = {
  nextSteps: NonNullable<Service["nextSteps"]>;
  // "arrow-flow" (default) draws a chevron between steps so it reads as a flow;
  // "numbered" is the plain numbered grid.
  variant?: "arrow-flow" | "numbered";
  // Optional extra class on the section, for page-scoped tweaks.
  className?: string;
};

export function NextStepsCapsule({
  nextSteps,
  variant = "arrow-flow",
  className,
}: NextStepsCapsuleProps) {
  return (
    <SectionShell className={cx("svc-block", className)}>
      <h2 className="svc-block__heading">{nextSteps.heading}</h2>
      <ol className={cx("svc-nextsteps", variant === "arrow-flow" && "svc-nextsteps--flow")}>
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
