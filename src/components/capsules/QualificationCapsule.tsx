// QUALIFICATION CAPSULE (optional) -- who it's for / who it isn't. Bold
// periwinkle band with CHANNEL-STATIC grain regenerating in place.
//
// Phase B note: the grain renders as a direct child (the pre-refactor markup,
// byte-stable). Phase F moves it to SectionShell's `bg` layer (beneath content)
// to fix the grain-above-content bug structurally.

import type { Service } from "@/lib/service";
import { GrainField } from "@/components/GrainField";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type QualificationCapsuleProps = {
  qualification: NonNullable<Service["qualification"]>;
};

export function QualificationCapsule({
  qualification: q,
}: QualificationCapsuleProps) {
  return (
    <SectionShell full className="svc-block svc-qual-section">
      <GrainField />
      <h2 className="svc-block__heading">{q.heading}</h2>
      <div className="svc-qual">
        <div className="svc-qual__col svc-qual__col--fit panel">
          <p className="svc-qual__label">{q.fitLabel ?? "This is for you if"}</p>
          <ul className="svc-qual__list">
            {q.fit.map((f, i) => (
              <li key={i}>
                <W value={f} />
              </li>
            ))}
          </ul>
        </div>
        <div className="svc-qual__col svc-qual__col--not panel">
          <p className="svc-qual__label">{q.notLabel ?? "Probably not if"}</p>
          <ul className="svc-qual__list">
            {q.notFit.map((f, i) => (
              <li key={i}>
                <W value={f} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
