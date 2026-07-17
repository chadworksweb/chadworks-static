// ACTS CAPSULE -- an ordered row of movements, each with a stepped glyph, a
// mono "kind" supertitle, a title, and a body.
//
// TRACED from the chadlewine Sovereignty Audit page's bk-acts / bk-act row,
// rebuilt on CWS tokens. The SSA page runs this shape twice (the five movements
// of the session, and the three silos of who it is for), which is why this is a
// capsule fed any ordered ServiceStep[] rather than a one-page component.
//
// Why this exists next to ApproachCapsule / ProcessCapsule: both of those
// derive a "Step N" supertitle from the index. A movement is not a numbered
// step -- it is named ("The core move", "The gate"), it can be skipped, and on
// the V/S/R the order is real but the clock is not. That label comes from
// ServiceStep.kind, which the other two ignore.
//
// Column count follows stepColumns() (CWS-DESIGN-SYSTEM rule 8, filled rows):
// 6 acts -> 3-up, 4 -> 2-up, 5 -> one full row. Never a half-filled last row.

import type { ReactNode } from "react";
import type { ServiceStep } from "@/lib/service";
import type { Scheme } from "@/lib/capsule";
import { stepColumns } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CtaButton } from "@/components/capsules/shared";
import { GlyphTitleBar, ActGlyph } from "@/components/capsules/GlyphTitleBar";

export type ActsCapsuleProps = {
  heading: ReactNode;
  intro?: ReactNode;
  acts: ServiceStep[];
  id?: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
  // Optional trailing CTA (the SSA acts row closes with "Book a session").
  cta?: { href: string; label: string };
};

export function ActsCapsule({ heading, intro, acts, id, cta }: ActsCapsuleProps) {
  const cols = stepColumns(acts.length);
  return (
    <SectionShell full className="svc-block svc-dark cw-acts" id={id}>
      <GlyphTitleBar>{heading}</GlyphTitleBar>
      {intro && (
        <p className="svc-block__body measure-prose cw-acts__intro">
          <W value={intro} />
        </p>
      )}
      <ol className="cw-acts__list" data-cols={cols}>
        {acts.map((a, i) => (
          <li key={i} className="cw-act panel reveal-late">
            <ActGlyph />
            {a.kind && <span className="cw-act__kind">{a.kind}</span>}
            <h3 className="cw-act__title">{a.title}</h3>
            <p className="cw-act__desc">
              <W value={a.body} />
            </p>
          </li>
        ))}
      </ol>
      {cta && (
        <div className="cw-acts__cta">
          <CtaButton href={cta.href} label={cta.label} />
        </div>
      )}
    </SectionShell>
  );
}
