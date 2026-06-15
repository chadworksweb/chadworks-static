// CTA CAPSULE -- dark band, funnel target. Content in a scanning-border panel.
// With a page form: copy left, THE FORM right (Chad, 2026-06-11). Without one,
// the single-column heading + body + button layout.

import type { Service } from "@/lib/service";
import type { LeadFormConfig } from "@/lib/forms";
import { LeadForm } from "@/components/forms/LeadForm";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CtaButton } from "@/components/capsules/shared";

export type CtaCapsuleProps = {
  cta: Service["cta"];
  form?: LeadFormConfig;
};

export function CtaCapsule({ cta, form }: CtaCapsuleProps) {
  return (
    <SectionShell full className="band-dark svc-cta">
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
