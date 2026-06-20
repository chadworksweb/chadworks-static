// KEY FACTS CAPSULE ("At a glance") -- luxury statement panels. An intro band
// carries the keyword-bearing <h2>, then each fact is its own full-width band
// whose background is interpolated dark -> light across the count (statementTone,
// build-time) so the descent stays smooth and the final band is always white.

import type { ReactNode } from "react";
import type { Writable } from "@/lib/service";
import { statementTone } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type KeyFactsCapsuleProps = {
  heading?: string;
  // A fact is finished prose, a TO-WRITE prompt, or arbitrary markup (e.g. a
  // statement carrying an inline tooltip). W renders all three.
  facts: (Writable | ReactNode)[];
  outlierFacts?: number[];
};

export function KeyFactsCapsule({
  heading,
  facts,
  outlierFacts,
}: KeyFactsCapsuleProps) {
  return (
    <>
      <SectionShell full className="svc-statements-intro">
        <h2 className="svc-statements__heading">{heading ?? "At a glance"}</h2>
      </SectionShell>
      {facts.map((fact, i) => {
        const tone = statementTone(i, facts.length, outlierFacts);
        return (
          <SectionShell
            key={i}
            full
            className="svc-statement"
            trailingClassName={tone.onDark ? "svc-statement--ondark" : undefined}
            style={{
              background: tone.bg,
              color: tone.onDark ? "var(--dark-text)" : undefined,
            }}
          >
            <div className="svc-statement__row">
              <span className="svc-statement__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="svc-statement__text">
                <W value={fact} />
              </p>
            </div>
          </SectionShell>
        );
      })}
    </>
  );
}
