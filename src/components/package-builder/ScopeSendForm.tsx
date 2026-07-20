"use client";

// SEND-THIS-SCOPE FORM -- the dedicated capsule under the calculator.
//
// Styled EXACTLY like the global contact CTA (ContactCapsule): the dark
// band-dark cw-contact band, the glow orbs, the copy-left / form-right split.
// The left copy column carries a live recap of the current scope instead of the
// reach-direct details. It shares the calculator's scope (passed from
// ScopeCalculator), so the recap always matches the number on the stage above.
// The scope is sent as DATA via LeadForm's getExtraData hook, read live at
// submit, so there is no prefilled field to drift and nothing to reach across
// the DOM for. Posts through the same LEIT endpoint as every other form.

import { LeadForm } from "@/components/forms/LeadForm";
import { ContactOrbs } from "@/components/art/ContactOrbs";
import { SectionShell } from "@/components/capsules/SectionShell";
import {
  describeScope,
  money,
  price,
  scopeSummaryText,
  weeksLabel,
  type Scope,
} from "@/lib/package-builder";
import type { LeadFormConfig } from "@/lib/forms";
import s from "./scope-send-form.module.css";

const SCOPE_FORM: LeadFormConfig = {
  source: "cost calculator scope",
  subject: "New scope from the Website Design Cost Calculator (chadworks)",
  submitLabel: "Send this scope to Chad",
  successMessage: "Got it. Your scope is on its way to me, and I will be in touch.",
  fields: [
    { kind: "text", name: "first_name", label: "First name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    {
      kind: "textarea",
      name: "note",
      label: "Anything to add?",
      rows: 3,
      placeholder: "Context, a deadline, a question. Optional.",
    },
  ],
};

export function ScopeSendForm({ scope }: { scope: Scope }) {
  const rows = describeScope(scope);
  const total = price(scope);

  return (
    <SectionShell id="your-scope" full className={`band-dark cw-contact ${s.section}`}>
      <ContactOrbs />
      <div className="cw-contact__inner">
        <div className="cw-contact__layout">
          <div className="cw-contact__copy">
            <h2 className="svc-cta__heading">Send me this scope</h2>
            <p className="cw-contact__note">
              Here is what you have built and what it comes to. Add your name and
              email and it lands with me exactly as you scoped it.
            </p>

            <div className={s.recap}>
              <p className={s.estimate}>{money(total)}</p>
              <p className={s.window}>{weeksLabel(scope)}</p>
              <ul className={s.rows}>
                {rows.map((r) => (
                  <li key={r.label} className={s.row}>
                    <strong className={s.rowLabel}>{r.label}:</strong> {r.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* the form: scope travels as data, not as a prefilled field */}
          <LeadForm
            config={SCOPE_FORM}
            getExtraData={() => ({
              estimate: money(price(scope)),
              timeline: weeksLabel(scope),
              scope_summary: scopeSummaryText(scope),
            })}
          />
        </div>
      </div>
    </SectionShell>
  );
}

export default ScopeSendForm;
