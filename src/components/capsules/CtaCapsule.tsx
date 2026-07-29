// CTA CAPSULE -- dark band, funnel target. Content in a scanning-border panel.
// With a page form: copy left, THE FORM right (Chad, 2026-06-11). Without one,
// the single-column heading + body + button layout.

import type { Service } from "@/lib/service";
import type { LeadFormConfig } from "@/lib/forms";
import type { Scheme } from "@/lib/capsule";
import { LeadForm } from "@/components/forms/LeadForm";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CtaButton } from "@/components/capsules/shared";

// The CTA is always a fixed dark band; `scheme` is declared so the rule-9 pass
// sees it as inverted for adjacency (it never changes the rendered treatment).
export type CtaCapsuleProps = {
  cta: Service["cta"];
  form?: LeadFormConfig;
  // Optional anchor target, for a page whose own copy jumps down to this form
  // (`id="contact"`, the same hook MainContactCapsule carries). Left unset
  // everywhere else, so no page can end up with the id twice.
  id?: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function CtaCapsule({ cta, form, id }: CtaCapsuleProps) {
  return (
    <SectionShell full id={id} className="band-dark svc-cta">
      <div className="svc-cta__panel">
        {form ? (
          <div className="svc-cta__split">
            <div>
              <h2 className="svc-cta__heading">{cta.heading}</h2>
              <p className="svc-cta__body">
                <W value={cta.body} />
              </p>
            </div>
            <LeadForm config={form} />
          </div>
        ) : (
          <>
            <h2 className="svc-cta__heading">{cta.heading}</h2>
            <p className="svc-cta__body measure-prose">
              <W value={cta.body} />
            </p>
            <CtaButton href={cta.href} label={cta.buttonLabel} />
          </>
        )}
      </div>
    </SectionShell>
  );
}
