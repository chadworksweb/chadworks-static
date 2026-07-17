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
  FLOOR,
  PARAMS,
  channels,
  money,
  price,
  type Param,
  type Scope,
} from "@/lib/package-builder";
import s from "./package-builder.module.css";

// Params that would run too long as a chip row keep a slim slider instead.
const AS_COUNT = new Set<keyof Scope>(["pages", "sections", "integrations", "locales"]);

function valueLabel(p: Param, v: number): string {
  if (p.kind === "steps") return p.options?.[v] ?? String(v);
  if (p.key === "locales") return v === 1 ? "1 language" : `${v} languages`;
  if (p.key === "integrations") return v === 1 ? "1 system" : `${v} systems`;
  return String(v);
}

export function PackageBuilderStage() {
  const [scope, setScope] = useState<Scope>(FLOOR);
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
  const dirty = JSON.stringify(scope) !== JSON.stringify(FLOOR);

  return (
    // `full` breaks the BACKGROUND out to the viewport edges; .inner puts the
    // content back on the site width.
    <div className={`full ${s.wrap}`}>
      {/* the object */}
      <div className={s.canvasLayer}>
        <PackageScreen channels={ch} />
      </div>

      <div className={s.inner}>
        {/* the number */}
        <div className={s.readout}>
          <p className={s.readoutLabel}>{dirty ? "Estimate as scoped" : "Baseline price"}</p>
          <p className={s.figure}>{money(total)}</p>
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
                    ) : (
                      <div className={s.chips} role="group" aria-label={p.label}>
                        {p.options?.map((opt, i) => (
                          <button
                            key={opt}
                            type="button"
                            className={`${s.chip}${i === v ? ` ${s.chipOn}` : ""}`}
                            aria-pressed={i === v}
                            aria-label={`${p.label}: ${opt}`}
                            title={opt}
                            onClick={() => set(p.key, i)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
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
          {dirty ? (
            <button type="button" className={s.reset} onClick={() => setScope(FLOOR)}>
              Reset
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default PackageBuilderStage;
