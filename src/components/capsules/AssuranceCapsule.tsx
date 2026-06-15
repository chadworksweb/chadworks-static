// ASSURANCE CAPSULE (optional) -- risk reversal: reasons it's safe to say yes.

import type { Service } from "@/lib/service";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CheckIcon } from "@/components/capsules/shared";

export type AssuranceCapsuleProps = {
  assurance: NonNullable<Service["assurance"]>;
};

export function AssuranceCapsule({ assurance }: AssuranceCapsuleProps) {
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
