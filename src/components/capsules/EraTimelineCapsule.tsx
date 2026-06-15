// ERA TIMELINE CAPSULE -- the /about/ story, era by era. Rides the same
// build-time band arc as KeyFacts (statementTone: dark blue -> lavender, white
// last), but each band carries an era LABEL in the numeral slot (e.g. "Age 11",
// "2008") and plain narrative text, plus the `about-era` style hook.

import { statementTone } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";

export type Era = { label: string; text: string };

export type EraTimelineCapsuleProps = {
  heading: string;
  eras: Era[];
  bandClassName?: string;
};

export function EraTimelineCapsule({
  heading,
  eras,
  bandClassName = "about-era",
}: EraTimelineCapsuleProps) {
  return (
    <>
      <SectionShell full className="svc-statements-intro">
        <h2 className="svc-statements__heading">{heading}</h2>
      </SectionShell>
      {eras.map((era, i) => {
        const tone = statementTone(i, eras.length);
        return (
          <SectionShell
            key={era.label}
            full
            className={`svc-statement ${bandClassName}`}
            trailingClassName={tone.onDark ? "svc-statement--ondark" : undefined}
            style={{
              background: tone.bg,
              color: tone.onDark ? "var(--dark-text)" : undefined,
            }}
          >
            <div className="svc-statement__row">
              <span className="svc-statement__num" aria-hidden="true">
                {era.label}
              </span>
              <p className="svc-statement__text">{era.text}</p>
            </div>
          </SectionShell>
        );
      })}
    </>
  );
}
