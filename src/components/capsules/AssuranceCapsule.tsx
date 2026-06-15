// ASSURANCE CAPSULE (optional) -- risk reversal: reasons it's safe to say yes.
//  - "checklist" (default): the check-mark list (svc-assurance).
//  - "design-steps": the bold numbered-step treatment (svc-steps cards) on a
//    DEFAULT (light) scheme -- the "Absolute transparency" look on /web-design/,
//    borrowing the approach-step visual without the dark band.

import type { Service } from "@/lib/service";
import { stepColumns } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CheckIcon } from "@/components/capsules/shared";

export type AssuranceCapsuleProps = {
  assurance: NonNullable<Service["assurance"]>;
  variant?: "checklist" | "design-steps";
};

export function AssuranceCapsule({
  assurance,
  variant = "checklist",
}: AssuranceCapsuleProps) {
  if (variant === "design-steps") {
    return (
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading">{assurance.heading}</h2>
        <ol
          className="svc-steps"
          style={
            { "--svc-cols": stepColumns(assurance.items.length) } as React.CSSProperties
          }
        >
          {assurance.items.map((it, i) => (
            <li key={i} className="svc-step panel">
              <span className="svc-step__num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="svc-step__body">
                  <W value={it} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </SectionShell>
    );
  }

  return (
    <SectionShell className="svc-block">
      <h2 className="svc-block__heading">{assurance.heading}</h2>
      <ul className="svc-assurance">
        {assurance.items.map((it, i) => (
          <li key={i} className="svc-assurance__item">
            <CheckIcon />
            <span>
              <W value={it} />
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
