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

import { DualForm } from "@/components/forms/DualForm";
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

// The same two forms the global contact capsule uses (quick <-> detailed),
// pointed at the calculator so the subject/source say "scope". The scope itself
// rides along as data via getExtraData, on whichever side the visitor submits.
const SUCCESS = "Got it. Your scope is on its way to me, and I will be in touch.";

const QUICK: LeadFormConfig = {
  source: "cost calculator scope (quick)",
  subject: "New scope (quick) from the Website Design Cost Calculator (chadworks)",
  submitLabel: "Send this scope to Chad",
  successMessage: SUCCESS,
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    {
      kind: "textarea",
      name: "message",
      label: "What's going on?",
      required: true,
      rows: 4,
      placeholder: "The business, and where it's stuck right now.",
    },
  ],
};

const DETAILED: LeadFormConfig = {
  source: "cost calculator scope (detailed)",
  subject: "New scope (detailed) from the Website Design Cost Calculator (chadworks)",
  submitLabel: "Send this scope to Chad",
  successMessage: SUCCESS,
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    { kind: "text", name: "business", label: "Business Name", span: "half" },
    { kind: "url", name: "current_url", label: "Existing domain or URL", autocomplete: "url", placeholder: "yourdomain.com" },
    {
      kind: "textarea",
      name: "background",
      label: "Provide some background info on you or the org",
      required: true,
      rows: 4,
      placeholder: "Who you are, and what the business or organization does.",
    },
    {
      kind: "textarea",
      name: "details",
      label: "Describe the idea or scope of the project",
      required: true,
      rows: 5,
      placeholder: "What the site needs to do, and where it's stuck today.",
    },
    { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
  ],
};

export function ScopeSendForm({ scope }: { scope: Scope }) {
  const rows = scopeRows(scope);
  const total = price(scope);

  return (
    <SectionShell id="your-scope" full className={`band-dark ${s.section}`}>
      <div className={s.layout}>
        {/* the live recap: heading, intro, then every field, its level, cost */}
        <div className={s.recap}>
          <h2 className={s.heading}>Send me this scope</h2>
          <p className={s.intro}>
            Here&apos;s a summary of your project&apos;s scope and an estimate of
            what it might cost. All you need to do is fill out a quick or detailed
            message and it will all get sent to me for review. I usually reply
            within 24 business hours.
          </p>
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

        {/* the form: the same quick/detailed dual form as the global contact
            capsule, with the scope attached as data (not a prefilled field).
            Sticky, so it stays in view while the recap column scrolls past. */}
        <div className={s.formCol}>
          <DualForm
            quick={QUICK}
            detailed={DETAILED}
            quickLabel="Quick message"
            detailedLabel="Detailed inquiry"
            getExtraData={() => ({
              estimate: money(price(scope)),
              timeline: weeksLabel(scope),
              scope_summary: scopeSummaryText(scope),
            })}
            beforeSubmit={
              <div className={s.thanks}>
                <p>Thank you for considering chadworks for your project.</p>
              </div>
            }
          />
        </div>
      </div>
    </SectionShell>
  );
}

export default ScopeSendForm;
