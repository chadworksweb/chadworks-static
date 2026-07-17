// VERBATIM CAPSULE -- real client sentences, quoted exactly, attributed to an
// anonymized source.
//
// TRACED from the chadlewine Sovereignty Audit page's "What you leave with"
// argument ("Your words are the whole point. A reading I hand you is one you
// can argue with later. A sentence you said yourself is not."), but built as
// its own section because on the V/S/R that argument needs EVIDENCE, not just
// a claim. The proof of extraction-first is a real client sentence that is
// audibly not agency copy.
//
// DELIBERATELY NOT TestimonialsCapsule. A testimonial is praise for Chad. These
// are the opposite: they are the CLIENT's own thinking, captured. Rendering
// them through the testimonial treatment would read as invented endorsement,
// which on this page of all pages would undercut the entire claim.
//
// HARD RULE, do not relax: every quote here is real and verbatim, and every
// attribution is anonymized until the client has consented by name. This
// capsule must never carry a composite, a paraphrase, or a tightened-up
// version. If a quote is not exactly what the person said, it does not belong
// in this capsule -- put it in DeliverableCapsule's stamped sample instead.
// See CWS-VSR-SERVICE.md ("Consent and anonymization").

import type { ReactNode } from "react";
import type { Writable } from "@/lib/service";
import type { Scheme } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";
import { GlyphTitleBar } from "@/components/capsules/GlyphTitleBar";

export type VerbatimItem = {
  // The client's exact words. Never edited for flow.
  quote: string;
  // Anonymized attribution (e.g. "The founder, a 28-year-old arts nonprofit").
  source: string;
  // Optional line naming what the quote PROVES about the method.
  note?: Writable | ReactNode;
};

export type VerbatimCapsuleProps = {
  heading: ReactNode;
  lead?: Writable | ReactNode;
  items: VerbatimItem[];
  footer?: Writable | ReactNode;
  id?: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function VerbatimCapsule({
  heading,
  lead,
  items,
  footer,
  id,
}: VerbatimCapsuleProps) {
  return (
    <SectionShell full className="svc-block svc-dark cw-verbatim" id={id}>
      <GlyphTitleBar>{heading}</GlyphTitleBar>
      {lead && (
        <p className="svc-block__body measure-prose cw-verbatim__lead">
          <W value={lead} />
        </p>
      )}
      <ul className="cw-verbatim__list">
        {items.map((it, i) => (
          <li key={i} className="cw-verbatim__item reveal-late">
            <figure className="cw-verbatim__fig panel">
              <blockquote className="cw-verbatim__quote">
                <p>{it.quote}</p>
              </blockquote>
              <figcaption className="cw-verbatim__source">{it.source}</figcaption>
            </figure>
            {it.note && (
              <p className="cw-verbatim__note">
                <W value={it.note} />
              </p>
            )}
          </li>
        ))}
      </ul>
      {footer && (
        <p className="svc-block__body measure-prose cw-verbatim__footer">
          <W value={footer} />
        </p>
      )}
    </SectionShell>
  );
}
