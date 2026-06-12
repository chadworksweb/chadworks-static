"use client";

// THE FORM ENGINE -- renders a LeadFormConfig with the rslgo field chrome and
// submits through the LEIT contact form pattern. The validation rules, the
// loading/success/error mechanics, and the anti-spam fields are copied from
// the source implementations (rslgo assets/js/main.js + the niche pages'
// contact-form.js), adapted to React: refs + DOM classes, uncontrolled
// inputs, the same has-error behavior, the same JSON POST shape.

import { useEffect, useRef, useState } from "react";
import type { FormField, LeadFormConfig } from "@/lib/forms";

const FORM_ENDPOINT = "/api/send";

function fieldControl(f: Exclude<FormField, { kind: "section" }>, idBase: string) {
  const id = `${idBase}-${f.name}`;
  if (f.kind === "textarea") {
    return (
      <textarea
        id={id}
        name={f.name}
        rows={f.rows ?? 4}
        required={f.required}
        placeholder={f.placeholder}
      />
    );
  }
  if (f.kind === "select") {
    return (
      <select id={id} name={f.name} required={f.required} defaultValue="">
        <option value="">Select...</option>
        {f.options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={f.kind}
      id={id}
      name={f.name}
      required={f.required}
      placeholder={f.placeholder}
      autoComplete={f.autocomplete}
    />
  );
}

// Group consecutive half fields into 2-up rows and third fields into 3-up
// rows (the rslgo rsl-form-grid--2 / --3 layout).
function groupFields(fields: FormField[]) {
  const groups: { span: string; items: FormField[] }[] = [];
  for (const f of fields) {
    const span = f.kind === "section" ? "section" : (f.span ?? "full");
    const last = groups[groups.length - 1];
    const cap = span === "half" ? 2 : span === "third" ? 3 : 1;
    if (last && last.span === span && last.items.length < cap && cap > 1) {
      last.items.push(f);
    } else {
      groups.push({ span, items: [f] });
    }
  }
  return groups;
}

export function LeadForm({ config }: { config: LeadFormConfig }) {
  const formRef = useRef<HTMLFormElement>(null);
  const tsRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const idBase = `cwf-${config.source.replace(/[^a-z0-9]+/gi, "-")}`;

  // LEIT anti-spam timestamp: base64(now) set on mount and after each reset,
  // exactly like injectAntispamFields in the niche contact-form.js.
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = btoa(String(Math.floor(Date.now() / 1000)));
  }, [status]);

  // Clear field error when the user starts typing again (source behavior).
  function onInput(e: React.FormEvent) {
    const group = (e.target as HTMLElement).closest(".cw-form-field");
    if (group && group.classList.contains("has-error")) {
      const v = (e.target as HTMLInputElement).value || "";
      if (v.trim()) group.classList.remove("has-error");
    }
  }

  function validateForm(form: HTMLFormElement) {
    let valid = true;
    form.querySelectorAll(".has-error").forEach((el) => el.classList.remove("has-error"));
    form.querySelectorAll<HTMLInputElement>("[required]").forEach((field) => {
      const group = field.closest(".cw-form-field");
      const val = (field.value || "").trim();
      if (!val) {
        valid = false;
        if (group) group.classList.add("has-error");
      }
      if (field.type === "email" && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          valid = false;
          if (group) group.classList.add("has-error");
        }
      }
    });
    return valid;
  }

  function collectFormData(form: HTMLFormElement) {
    const data: Record<string, string> = {};
    form.querySelectorAll<HTMLInputElement>("input, select, textarea").forEach((field) => {
      if (!field.name) return;
      const v = (field.value || "").trim();
      if (v) data[field.name] = v;
    });
    return data;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!validateForm(form)) {
      const firstError = form.querySelector(".has-error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("sending");
    const data = collectFormData(form);

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          form.reset();
          setStatus("success");
        } else {
          throw new Error("Form submission failed");
        }
      })
      .catch(() => setStatus("error"));
  }

  return (
    <form ref={formRef} className="cw-form" noValidate onSubmit={handleSubmit} onInput={onInput}>
      <input type="hidden" name="_source" value={config.source} />
      <input type="hidden" name="_subject" value={config.subject} />
      <input ref={tsRef} type="hidden" name="leit_cf_ts" defaultValue="" />
      {/* Honeypot (LEIT pattern): visually exiled, tab-skipped. */}
      <div className="cw-form__hp" aria-hidden="true">
        <label htmlFor={`${idBase}-leit-hp`}>Company Website</label>
        <input
          type="text"
          id={`${idBase}-leit-hp`}
          name="leit_company_url"
          defaultValue=""
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {status === "success" && (
        <div className="cw-form__message cw-form__message--success" role="status">
          {config.successMessage}
        </div>
      )}
      {status === "error" && (
        <div className="cw-form__message cw-form__message--error" role="status">
          Something went wrong sending this. Try again, or email chad@chadworks.co directly.
        </div>
      )}

      {groupFields(config.fields).map((g, gi) => {
        if (g.span === "section") {
          const f = g.items[0];
          return (
            <div key={gi} className="cw-form-section-label">{f.label}</div>
          );
        }
        const inner = g.items.map((f) => {
          if (f.kind === "section") return null;
          return (
            <div key={f.name} className="cw-form-field">
              <label htmlFor={`${idBase}-${f.name}`}>
                {f.label} {f.required && <span className="cw-required">*</span>}
              </label>
              {fieldControl(f, idBase)}
            </div>
          );
        });
        if (g.span === "half") return <div key={gi} className="cw-form-grid cw-form-grid--2">{inner}</div>;
        if (g.span === "third") return <div key={gi} className="cw-form-grid cw-form-grid--3">{inner}</div>;
        return <div key={gi}>{inner}</div>;
      })}

      <button type="submit" className="svc-btn cw-form__submit" disabled={status === "sending"}>
        <span className="svc-btn__label">
          {status === "sending" ? "Sending..." : config.submitLabel}
        </span>
      </button>
    </form>
  );
}
