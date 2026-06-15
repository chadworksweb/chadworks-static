// FAQ CAPSULE -- the septic accordion: plum->navy gradient band with lavender
// atmosphere washes, sticky intro column left, glass toggle list right. Goes
// dark (svc-faq-section--dark) only when a light section follows before the
// (dark) CTA, so two inverted bands never stack -- the placer passes `dark`.
//
// Phase B note: heading is the template's hardcoded "Questions, answered".
// Phase F derives "<Page> FAQs" by default (overridable) and inverts the
// svc-fill wipe when the band is dark.

import type { Service, Writable } from "@/lib/service";
import { isPrompt } from "@/lib/service";
import { Prompt } from "@/components/Prompt";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type FaqCapsuleProps = {
  faqs: Service["faqs"];
  faqLead?: Writable;
  dark?: boolean;
  heading?: React.ReactNode;
};

export function FaqCapsule({
  faqs,
  faqLead,
  dark,
  heading = "Questions, answered",
}: FaqCapsuleProps) {
  return (
    <SectionShell
      full
      className="svc-block svc-faq-section"
      trailingClassName={dark ? "svc-faq-section--dark" : undefined}
    >
      <div className="svc-faq__layout">
        <div className="svc-faq__intro">
          <h2 className="svc-block__heading svc-fill">{heading}</h2>
          {faqLead && (
            <p className="svc-faq__lead">
              <W value={faqLead} />
            </p>
          )}
        </div>
        <FaqAccordion
          items={faqs.map((f) => ({
            q: f.q,
            a: isPrompt(f.a) ? <Prompt label={f.a.label} brief={f.a.brief} /> : f.a,
          }))}
        />
      </div>
    </SectionShell>
  );
}
