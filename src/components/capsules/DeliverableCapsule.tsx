// DELIVERABLE CAPSULE -- the document itself: its anatomy, and a sample of it.
//
// TRACED from the chadlewine Sovereignty Audit page's "What you leave with"
// section, extended. SSA could get away with a checklist because its blueprint
// is a private letter nobody sees before they buy. The V/S/R cannot: the whole
// price is the document, so the page has to SHOW one (Chad, 2026-07-16).
//
// Two parts, in order:
//   1. `anatomy` -- the deliverable's real section structure, per V / S / R.
//      Sourced from a real delivered VSR, so this is the actual shape, not an
//      idealized table of contents.
//   2. `sample` -- an excerpt of a document, carrying a visible STAMP.
//
// THE STAMP IS NOT DECORATION AND IS NOT OPTIONAL. `sample.stamp` is required
// by the type on purpose. A page that sells "your words, verbatim" while
// showing an invented document is arguing against itself, so the sample must
// announce what it is, in the reader's eye, before they read a word of it. If
// you ever render a REAL client excerpt, it belongs in VerbatimCapsule (which
// is anonymized and never composite), not here.

import type { ReactNode } from "react";
import type { Writable } from "@/lib/service";
import type { Scheme } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CtaButton } from "@/components/capsules/shared";
import { GlyphTitleBar } from "@/components/capsules/GlyphTitleBar";

export type DeliverableSection = {
  // "V" / "S" / "R"
  letter: string;
  label: string;
  // What actually sits under that letter in a delivered VSR.
  contents: string[];
};

export type DeliverableSample = {
  // Required. The visible mark telling the reader this document is not a real
  // client's. Never pass an empty string to "clean up the design".
  stamp: string;
  title: string;
  blocks: { heading: string; body: ReactNode }[];
};

export type DeliverableCapsuleProps = {
  heading: ReactNode;
  lead?: Writable | ReactNode;
  anatomy: DeliverableSection[];
  anatomyNote?: Writable | ReactNode;
  sample: DeliverableSample;
  cta?: { href: string; label: string };
  id?: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function DeliverableCapsule({
  heading,
  lead,
  anatomy,
  anatomyNote,
  sample,
  cta,
  id,
}: DeliverableCapsuleProps) {
  return (
    <SectionShell className="svc-block cw-deliv" id={id}>
      <GlyphTitleBar>{heading}</GlyphTitleBar>
      {lead && (
        <p className="svc-block__body measure-prose cw-deliv__lead">
          <W value={lead} />
        </p>
      )}

      {/* 1. The anatomy: what a VSR actually contains, per letter. */}
      <ol className="cw-deliv__anatomy" data-cols={anatomy.length}>
        {anatomy.map((s) => (
          <li key={s.letter} className="cw-deliv__part panel reveal-late">
            <p className="cw-deliv__letter" aria-hidden="true">
              {s.letter}
            </p>
            <h3 className="cw-deliv__label">
              <span className="cw-deliv__label-letter">{s.letter}</span>
              {s.label}
            </h3>
            <ul className="cw-deliv__contents">
              {s.contents.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {anatomyNote && (
        <p className="svc-block__body measure-prose cw-deliv__note">
          <W value={anatomyNote} />
        </p>
      )}

      {/* 2. The sample. The stamp renders FIRST in the DOM and is visible in the
         paper's top edge, so it is read (and announced) before the excerpt. */}
      <figure className="cw-deliv__sample">
        <figcaption className="cw-deliv__stamp">{sample.stamp}</figcaption>
        <div className="cw-deliv__paper">
          <p className="cw-deliv__paper-title">{sample.title}</p>
          {sample.blocks.map((b, i) => (
            <div key={i} className="cw-deliv__paper-block">
              <h4 className="cw-deliv__paper-heading">{b.heading}</h4>
              <div className="cw-deliv__paper-body">{b.body}</div>
            </div>
          ))}
        </div>
      </figure>

      {cta && (
        <div className="cw-deliv__cta">
          <CtaButton href={cta.href} label={cta.label} />
        </div>
      )}
    </SectionShell>
  );
}
