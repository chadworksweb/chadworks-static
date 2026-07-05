// ASSURANCE CAPSULE (optional) -- risk reversal: reasons it's safe to say yes.
//  - "checklist" (default): the check-mark list (svc-assurance).
//  - "design-steps": the bold numbered-step treatment (svc-steps cards) on a
//    DEFAULT (light) scheme -- borrowing the approach-step visual without the
//    dark band.
//  - "tenets": the constitutional treatment -- a narrow, centered column of
//    hairline-ruled articles, each a roman numeral beside a bold statement.
//    Spatial style ported from the Libra Engine Compass tenets; deliberately
//    breaks from the rest of the page chrome so the items read as sacred.

import type { Service } from "@/lib/service";
import { stepColumns } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CheckIcon } from "@/components/capsules/shared";

export type AssuranceCapsuleProps = {
  assurance: NonNullable<Service["assurance"]>;
  variant?: "checklist" | "design-steps" | "tenets";
};

// 1 -> "I", 4 -> "IV", etc. Ample for any realistic tenet count.
function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

export function AssuranceCapsule({
  assurance,
  variant = "checklist",
}: AssuranceCapsuleProps) {
  if (variant === "tenets") {
    return (
      <SectionShell className="svc-block svc-tenets-section">
        <h2 className="svc-block__heading svc-tenets__heading">
          {assurance.heading}
        </h2>
        <ol className="svc-tenets">
          {assurance.items.map((it, i) => (
            <li key={i} className="svc-tenet">
              <span className="svc-tenet__mark" aria-hidden="true">
                {toRoman(i + 1)}
              </span>
              <p className="svc-tenet__text">
                <W value={it} />
              </p>
            </li>
          ))}
        </ol>
      </SectionShell>
    );
  }

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
