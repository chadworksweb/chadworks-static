"use client";

// SEND-THIS-SCOPE FORM -- the dedicated capsule under the calculator.
//
// It shares the calculator's scope (passed down from ScopeCalculator), so the
// recap on the left always matches the number on the stage above. The scope is
// sent as DATA via LeadForm's getExtraData hook, read live at submit time, so
// there is no prefilled field to fall out of sync and nothing to reach across
// the DOM for. Posts through the same LEIT endpoint as every other form.

import { LeadForm } from "@/components/forms/LeadForm";
import { SectionShell } from "@/components/capsules/SectionShell";
import {
  ledger,
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
  const lines = ledger(scope);
  const total = price(scope);

  return (
    <SectionShell id="your-scope" className={`${s.section} svc-block`}>
      <h2 className="svc-block__heading svc-fill">Send me this scope</h2>
      <div className="svc-prose">
        <p>
          Here is what you have built and what it comes to. Add your name and
          email and it lands with me exactly as you scoped it, breakdown and all.
        </p>
      </div>

      <div className={s.layout}>
        {/* the live recap: the same breakdown the calculator is pricing */}
        <div>
          <p className={s.estimate}>{money(total)}</p>
          <p className={s.window}>{weeksLabel(scope)}</p>
          <dl className={s.rows}>
            {lines.map((l) => (
              <div key={l.label} className={s.row}>
                <dt className={s.rowLabel}>{l.label}</dt>
                <dd className={s.rowAmt}>{money(l.amount)}</dd>
              </div>
            ))}
          </dl>
          <div className={s.total}>
            <span>Estimate</span>
            <span className={s.totalAmt}>{money(total)}</span>
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
    </SectionShell>
  );
}

export default ScopeSendForm;
