"use client";

// SEND-THIS-SCOPE FORM -- the dedicated capsule under the calculator.
//
// Structure is its own: heading + intro, then a two-column split of the scope
// recap table (left) and the form (right). The STYLE borrows the global contact
// capsule's dark palette (band-dark: indigo bg, lilac type) so it reads as the
// same family, and the form chrome is the shared .cw-form dark styling.
//
// It shares the calculator's scope (passed from ScopeCalculator), so the recap
// always matches the number on the stage above, and the scope is sent as DATA
// via LeadForm's getExtraData hook (read live at submit) -- no prefilled field
// to drift, nothing to reach across the DOM for. Posts through the same LEIT
// endpoint as every other form.

import { LeadForm } from "@/components/forms/LeadForm";
import { SectionShell } from "@/components/capsules/SectionShell";
import {
  BASE,
  money,
  price,
  scopeRows,
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
  const rows = scopeRows(scope);
  const total = price(scope);

  return (
    <SectionShell id="your-scope" full className={`band-dark ${s.section}`}>
      <h2 className={s.heading}>Send me this scope</h2>
      <p className={s.intro}>
        Here is what you have built and what it comes to. Add your name and email
        and it lands with me exactly as you scoped it.
      </p>

      <div className={s.layout}>
        {/* the live recap table: every field, its level, and its cost */}
        <div className={s.recap}>
          <p className={s.estimate}>{money(total)}</p>
          <p className={s.window}>{weeksLabel(scope)}</p>

          <dl className={s.table}>
            <div className={s.row}>
              <dt className={s.rowLabel}>The baseline build</dt>
              <dd className={s.rowAmt}>{money(BASE)}</dd>
            </div>
            {rows.map((r) => (
              <div key={r.label} className={s.row}>
                <dt className={s.rowLabel}>
                  <strong>{r.label}:</strong> {r.value}
                </dt>
                <dd className={s.rowAmt}>{r.amount > 0 ? money(r.amount) : "—"}</dd>
              </div>
            ))}
            <div className={`${s.row} ${s.totalRow}`}>
              <dt className={s.rowLabel}>Estimate</dt>
              <dd className={s.totalAmt}>{money(total)}</dd>
            </div>
          </dl>
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
