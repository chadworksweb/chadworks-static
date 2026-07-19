"use client";

// =====================================================================
// PACKAGE BUILDER STAGE -- the self-contained scope tool.
//
// Reference: the Issey Miyake "Le sel d'Issey" salt-crystal builder. The object
// is the stage; the chrome floats over it. Each parameter is an EXPAND PANEL
// carrying its own description, so the rail stays terse at thirteen of them and
// the open panel is the active layer. That is why there is no separate
// explainer card any more: the description lives in the panel it belongs to.
//
// Contained to the global content column, not full-bleed: the wrap is a plain
// grid child, so the page shell gives it `grid-column: content` for free.
//
// The object is PackageScreen: a standalone engine that shares nothing with the
// CW gem. The number and the object are two views of ONE model
// (lib/package-builder), never two implementations of it.
// =====================================================================

import { useMemo, useState } from "react";
import PackageScreen from "@/components/package-builder/PackageScreen";
import {
  BASELINE,
  PARAMS,
  channels,
  integrationCount,
  money,
  price,
  weeksLabel,
  type Param,
  type Scope,
} from "@/lib/package-builder";
import s from "./package-builder.module.css";

// Params that would run too long as a chip row keep a slim slider instead.
// Integrations left this set on 2026-07-19: it is a named checklist now, so it
// asks which systems rather than making the reader count them first.
const AS_COUNT = new Set<keyof Scope>(["pages", "sections", "locales"]);

function valueLabel(p: Param, v: number): string {
  // v < 0 is the UNSET state (no chip picked): show no value, just the label.
  if (p.kind === "steps") return v < 0 ? "" : p.options?.[v] ?? String(v);
  // A bitmask, so the head summarises with a count rather than a value.
  if (p.kind === "checks") {
    const n = integrationCount(v);
    return n === 0 ? "" : n === 1 ? "1 system" : `${n} systems`;
  }
  if (p.key === "locales") return v === 1 ? "1 language" : `${v} languages`;
  return String(v);
}

export function PackageBuilderStage() {
  const [scope, setScope] = useState<Scope>(BASELINE);
  // Not an accordion: any number of panels can be open, so two layers can be
  // compared without one closing the other.
  const [open, setOpen] = useState<ReadonlySet<keyof Scope>>(new Set(["pages"]));

  const set = (k: keyof Scope, v: number) => setScope((prev) => ({ ...prev, [k]: v }));

  const toggle = (k: keyof Scope) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(k)) next.add(k);
      return next;
    });

  const ch = useMemo(() => channels(scope), [scope]);
  const total = price(scope);
  const dirty = JSON.stringify(scope) !== JSON.stringify(BASELINE);

  return (
    // `full` breaks the BACKGROUND out to the viewport edges; .inner puts the
    // content back on the site width.
    <div className={`full ${s.wrap}`}>
      {/* the object -- the slab AND the mathDev plug both live in here now */}
      <div className={s.canvasLayer}>
        <PackageScreen channels={ch} />
      </div>

      <div className={s.inner}>
        {/* the number */}
        <div className={s.readout}>
          <p className={s.readoutLabel}>{dirty ? "Estimate as scoped" : "Baseline price"}</p>
          <p className={s.figure}>{money(total)}</p>
          {/* The window is the half of the answer the tool used to withhold: it
              charged for a squeezed timeline without ever naming the normal one. */}
          <p className={s.window}>{weeksLabel(scope)}</p>
          {dirty ? (
            <button type="button" className={s.reset} onClick={() => setScope(BASELINE)}>
              Reset
            </button>
          ) : null}
        </div>

        {/* the scope */}
        <div className={s.rail}>
          {PARAMS.map((p) => {
            const v = scope[p.key];
            const isOpen = open.has(p.key);
            const panelId = `pkg-panel-${p.key}`;
            return (
              <div key={p.key} className={`${s.param}${isOpen ? ` ${s.paramOpen}` : ""}`}>
                <button
                  type="button"
                  className={s.head}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(p.key)}
                >
                  <span className={s.headLabel}>{p.label}</span>
                  <span className={s.headValue}>{valueLabel(p, v)}</span>
                  <span className={s.caret} aria-hidden="true">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>

                {/* Always mounted so it can animate open and shut. */}
                <div className={`${s.body}${isOpen ? ` ${s.bodyOpen}` : ""}`} id={panelId}>
                  <div className={s.bodyInner} inert={!isOpen ? true : undefined}>
                    <p className={s.hint}>{p.hint}</p>

                    {AS_COUNT.has(p.key) ? (
                      <div className={s.count}>
                        <input
                          className={s.range}
                          type="range"
                          min={p.min}
                          max={p.max}
                          step={1}
                          value={v}
                          aria-label={p.label}
                          onChange={(e) => set(p.key, Number(e.target.value))}
                        />
                        <span className={s.countValue}>{v}</span>
                      </div>
                    ) : p.kind === "checks" ? (
                      // Same chip row as the step selectors, but every chip is
                      // an independent toggle over one bit of the mask, so any
                      // number can be on at once. The numeral slot carries a
                      // check instead of a rung number: these are not an order.
                      <ol className={s.opts} role="group" aria-label={p.label}>
                        {p.options?.map((opt, i) => {
                          const on = (v & (1 << i)) !== 0;
                          return (
                            <li key={opt} className={s.optItem}>
                              <button
                                type="button"
                                className={`${s.opt}${on ? ` ${s.optOn}` : ""}`}
                                aria-pressed={on}
                                aria-label={`${p.label}: ${opt}`}
                                onClick={() => set(p.key, v ^ (1 << i))}
                              >
                                <span className={s.optNum} aria-hidden="true">
                                  {on ? "x" : ""}
                                </span>
                                <span className={s.optText}>{opt}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <ol className={s.opts} role="group" aria-label={p.label}>
                        {p.options?.map((opt, i) => (
                          <li key={opt} className={s.optItem}>
                            <button
                              type="button"
                              className={`${s.opt}${i === v ? ` ${s.optOn}` : ""}`}
                              aria-pressed={i === v}
                              aria-label={`${p.label}: ${opt}`}
                              onClick={() => set(p.key, i)}
                            >
                              <span className={s.optNum} aria-hidden="true">
                                {i + 1}
                              </span>
                              <span className={s.optText}>{opt}</span>
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* the finish line */}
        <div className={s.finish}>
          <a className={s.finishLink} href="/contact/">
            Send this scope to Chad
          </a>
        </div>
      </div>
    </div>
  );
}

export default PackageBuilderStage;
