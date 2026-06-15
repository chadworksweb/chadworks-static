// QUALIFICATION CAPSULE (optional) -- who it's for / who it isn't. Bold
// periwinkle band with CHANNEL-STATIC grain regenerating in place.
//
// The grain renders as a direct child: the existing .svc-qual-section CSS
// already layers it behind content (canvas z-index 0, content z-index 1) AND
// keeps its mix-blend-mode:overlay keyed to the periwinkle band. Routing it
// through SectionShell's bg layer was tried and reverted: the bg layer's
// stacking context makes the overlay blend against transparent, washing the
// band to gray. An optional `footer` renders after the fit/not-fit grid (e.g.
// the /about/ rates cross-link paragraph).

import type { ReactNode } from "react";
import type { Service } from "@/lib/service";
import { GrainField } from "@/components/GrainField";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type QualificationCapsuleProps = {
  qualification: NonNullable<Service["qualification"]>;
  footer?: ReactNode;
};

export function QualificationCapsule({
  qualification: q,
  footer,
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
      {footer}
    </SectionShell>
  );
}
