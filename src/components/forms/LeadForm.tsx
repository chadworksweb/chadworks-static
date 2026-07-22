"use client";

// THE FORM ENGINE -- renders a LeadFormConfig with the rslgo field chrome and
// submits through the LEIT contact form pattern. The validation rules, the
// loading/success/error mechanics, and the anti-spam fields are copied from
// the source implementations (rslgo assets/js/main.js + the niche pages'
// contact-form.js), adapted to React: refs + DOM classes, uncontrolled
// inputs, the same has-error behavior, the same JSON POST shape.

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { FormField, LeadFormConfig } from "@/lib/forms";

// The centralized LEIT contact-form endpoint (leit-dashboard on le-projects-01):
// anti-spam + Turso logging + Resend send, all server-side. The site slug keys
// FORM_SITES in server.js. chadworks.co is static (no function runtime of its
// own), so it posts here like every other LEIT site. See LEIT-CONTACT-FORM-PATTERN.md.
const FORM_ENDPOINT = "https://leit.libraengine.com/api/forms/submit?site=chadworks";
const CONTACT_EMAIL = "chad@chadworks.co";

// Safety net for the LEIT endpoint's single point of failure (if the droplet is
// down, every LEIT form is down). Rather than lose the submission, build a
// pre-filled email carrying everything the visitor typed so one click sends it.
// On the normal path the fetch succeeds first and this is never reached.
function buildMailtoHref(subject: string, data: Record<string, string>) {
  const skip = new Set(["_source", "_subject", "leit_cf_ts", "leit_company_url"]);
  const body = Object.entries(data)
    .filter(([k, v]) => v && !skip.has(k))
    .map(([k, v]) => {
      const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `${label}: ${v}`;
    })
    .join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

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

export function LeadForm({
  config,
  getExtraData,
  beforeSubmit,
}: {
  config: LeadFormConfig;
  // Extra payload merged in at SUBMIT time (read live, not at render), so a
  // caller can attach state that changes after mount -- e.g. the calculator's
  // current scope -- without prefilling any field. Overrides collected fields
  // on key collision.
  getExtraData?: () => Record<string, string>;
  // Optional node rendered just before the submit button (e.g. a sign-off).
  beforeSubmit?: ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const tsRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [mailtoHref, setMailtoHref] = useState<string>("");
  // Whether every required field is filled (and any email is valid). Gates the
  // optional beforeSubmit node, so a sign-off only appears once the form is
  // ready to send.
  const [complete, setComplete] = useState(false);
  const idBase = `cwf-${config.source.replace(/[^a-z0-9]+/gi, "-")}`;

  // LEIT anti-spam timestamp: base64(now) set on mount and after each reset,
  // exactly like injectAntispamFields in the niche contact-form.js.
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = btoa(String(Math.floor(Date.now() / 1000)));
  }, [status]);

  // Are all required fields filled (and any email well-formed)? Read live off
  // the DOM, since the inputs are uncontrolled.
  function isComplete(form: HTMLFormElement) {
    let ok = true;
    form.querySelectorAll<HTMLInputElement>("[required]").forEach((field) => {
      const v = (field.value || "").trim();
      if (!v) ok = false;
      else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ok = false;
    });
    return ok;
  }

  // Clear field error when the user starts typing again (source behavior), and
  // re-evaluate whether the form is complete so the sign-off can appear.
  function onInput(e: React.FormEvent) {
    const group = (e.target as HTMLElement).closest(".cw-form-field");
    if (group && group.classList.contains("has-error")) {
      const v = (e.target as HTMLInputElement).value || "";
      if (v.trim()) group.classList.remove("has-error");
    }
    if (formRef.current) setComplete(isComplete(formRef.current));
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
    // Report the actual page the form was sent from (like chadlewine's
    // source_page). config._source is the semantic slot; this is the real URL.
    data.source_page = window.location.pathname;
    // Merge caller-supplied data (read now, so it reflects current state).
    if (getExtraData) Object.assign(data, getExtraData());

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
      .catch(() => {
        setMailtoHref(buildMailtoHref(config.subject, data));
        setStatus("error");
      });
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

      {status === "error" && (
        <div className="cw-form__message cw-form__message--error" role="status">
          {mailtoHref ? (
            <>
              One more step to send this. Your details are ready in an email --{" "}
              <a href={mailtoHref} className="cw-form__mailto-link">
                open it and hit send
              </a>
              , and it lands with Chad. Nothing you typed is lost.
            </>
          ) : (
            <>Something went wrong sending this. Try again, or email chad@chadworks.co directly.</>
          )}
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

      {/* Only once every required field is filled, so a sign-off pops in when
          the form is actually ready to send. */}
      {complete ? beforeSubmit : null}

      <button type="submit" className="svc-btn cw-form__submit" disabled={status === "sending"}>
        <span className="svc-btn__label">
          {status === "sending" ? "Sending..." : config.submitLabel}
        </span>
      </button>

      {status === "success" && (
        <div className="cw-form__message cw-form__message--success" role="status">
          {config.successMessage}
        </div>
      )}
    </form>
  );
}
