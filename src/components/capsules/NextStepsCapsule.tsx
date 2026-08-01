// NEXT STEPS CAPSULE (optional) -- what happens after you reach out.
// The old variant="arrow-flow" chevrons were removed sitewide 2026-08-01; the
// variant and its class remain so the markup is stable, but only the numbers
// carry the sequence now.

import type { Service } from "@/lib/service";
import { cx } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type NextStepsCapsuleProps = {
  nextSteps: NonNullable<Service["nextSteps"]>;
  // Kept for markup stability. Neither value draws anything extra today: the
  // between-step chevrons are gone and .svc-nextsteps--flow styles nothing.
  variant?: "arrow-flow" | "numbered";
  // Optional extra class on the section, for page-scoped tweaks.
  className?: string;
  // The GLOBAL treatment: a full-bleed lavender-gradient band (Chad,
  // 2026-08-01). On by default so every "what happens" section across the site
  // reads the same; pass false for a plain in-column section.
  band?: boolean;
};

export function NextStepsCapsule({
  nextSteps,
  variant = "arrow-flow",
  className,
  band = true,
}: NextStepsCapsuleProps) {
  return (
    <SectionShell
      full={band}
      className={cx("svc-block", band && "scheme-lavender-grad", className)}
    >
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
