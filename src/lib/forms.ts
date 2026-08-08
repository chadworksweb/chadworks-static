// =====================================================================
// chadworks Static -- THE FORM SYSTEM
// Every page defines its own comprehensive, customized form as data; the
// LeadForm engine renders it (rslgo field chrome), validates it (the rslgo
// main.js rules), and submits it through the LEIT contact form pattern
// (honeypot + base64 timestamp + JSON POST to the central LEIT endpoint
// leit.libraengine.com/api/forms/submit?site=chadworks, logged to LEIT
// Turso before Resend delivery). Service pages mount their form in the
// right half of the CTA section; the contact page mounts the rslgo-style
// dual form (quick <-> detailed toggle).
// =====================================================================

export type FormFieldSpan = "full" | "half" | "third";

export type FormField =
  | {
      kind: "text" | "email" | "tel" | "url";
      name: string;
      label: string;
      required?: boolean;
      placeholder?: string;
      autocomplete?: string;
      span?: FormFieldSpan;
    }
  | {
      kind: "textarea";
      name: string;
      label: string;
      required?: boolean;
      placeholder?: string;
      rows?: number;
      span?: FormFieldSpan;
    }
  | {
      kind: "select";
      name: string;
      label: string;
      required?: boolean;
      options: { value: string; label: string }[];
      span?: FormFieldSpan;
    }
  | {
      // A single on/off box, label to the RIGHT of the control (not above it
      // like every other field). Added 2026-08-08 for the audit page's "Request
      // 24hr turnaround" opt-in.
      //
      // WHAT REACHES THE PAYLOAD. A checkbox is the one input whose `value` is
      // meaningless on its own: an unchecked box still reports "on", so reading
      // .value the way the other kinds do would submit the opt-in every time.
      // LeadForm reads `checked` for this kind instead, and sends `checkedValue`
      // (default "Yes") only when it is actually ticked -- an unticked box sends
      // nothing at all, matching how empty text fields are dropped.
      kind: "checkbox";
      name: string;
      label: string;
      required?: boolean;
      checkedValue?: string;
      span?: FormFieldSpan;
    }
  | {
      // A section divider label inside the form (rslgo rsl-form-section-label).
      kind: "section";
      label: string;
    };

export interface LeadFormConfig {
  // Marks the submission in LEIT (payload `_source`) -- e.g. "web-design page".
  source: string;
  // Email subject line (payload `_subject`).
  subject: string;
  submitLabel: string;
  successMessage: string;
  fields: FormField[];
}
