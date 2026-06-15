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
import type { Scheme } from "@/lib/capsule";
import { isDarkScheme } from "@/lib/capsule";
import { Prompt } from "@/components/Prompt";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type FaqCapsuleProps = {
  faqs: Service["faqs"];
  faqLead?: Writable;
  // The FAQ prefers the dark band but yields to rule 9: PageComposer demotes
  // `scheme` to "default" when the next present section is also inverted.
  // `schemeAuto` flags it as the demotable section.
  scheme?: Scheme;
  schemeAuto?: boolean;
  // The page name drives the default heading "<Page> FAQs" (e.g. "Web Design
  // FAQs"), cascading to every service page. An explicit `heading` overrides it.
  pageName?: string;
  heading?: React.ReactNode;
};

export function FaqCapsule({
  faqs,
  faqLead,
  scheme,
  pageName,
  heading,
}: FaqCapsuleProps) {
  const dark = isDarkScheme(scheme);
  const resolvedHeading =
    heading ?? (pageName ? `${pageName} FAQs` : "Questions, answered");
  return (
    <SectionShell
      full
      className="svc-block svc-faq-section"
      trailingClassName={dark ? "svc-faq-section--dark" : undefined}
    >
      <div className="svc-faq__layout">
        <div className="svc-faq__intro">
          <h2 className="svc-block__heading svc-fill">{resolvedHeading}</h2>
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
