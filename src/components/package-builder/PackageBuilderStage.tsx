"use client";

// =====================================================================
// PACKAGE BUILDER STAGE -- the self-contained, full-screen scope tool.
//
// Reference: the Issey Miyake "Le sel d'Issey" salt-crystal builder. The object
// is the page; the chrome floats over it. The rail stays terse (numbered chips,
// uppercase micro-type) because the left card carries the meaning of whichever
// layer you are touching. Thirteen parameters only survive at this density.
//
// Rides the `hero` slot on /build-your-website-package/, so the stock capsules
// (postures, FAQ, assurance, CTA) follow underneath without being disturbed.
//
// The object is PackageScreen: a standalone engine that shares nothing with the
// CW gem. The ledger and the object are two views of ONE model
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
  const [active, setActive] = useState<keyof Scope>("pages");

  const set = (k: keyof Scope, v: number) => {
    setScope((prev) => ({ ...prev, [k]: v }));
    setActive(k);
  };

  const ch = useMemo(() => channels(scope), [scope]);
  const total = price(scope);
  const dirty = JSON.stringify(scope) !== JSON.stringify(FLOOR);
  const activeParam = PARAMS.find((p) => p.key === active) ?? PARAMS[0];

  return (
    <div className={`full ${s.wrap}`}>
      {/* the object */}
      <div className={s.canvasLayer}>
        <PackageScreen channels={ch} />
      </div>

      {/* the number */}
      <div className={s.readout}>
        <p className={s.readoutLabel}>{dirty ? "This scope" : "The floor"}</p>
        <p className={s.figure}>{money(total)}</p>
      </div>

      {/* the active layer, explained -- the reference's ingredient card */}
      <aside className={s.info}>
        <p className={s.infoTitle}>{activeParam.label}</p>
        <p className={s.infoBody}>{activeParam.hint}</p>
        <span className={s.infoValue}>{valueLabel(activeParam, scope[activeParam.key])}</span>
      </aside>

      {/* the scope */}
      <div className={s.rail}>
        {PARAMS.map((p) => {
          const v = scope[p.key];
          const on = active === p.key;
          return (
            <div
              key={p.key}
              className={`${s.param}${on ? ` ${s.paramOn}` : ""}`}
              onMouseEnter={() => setActive(p.key)}
              onFocus={() => setActive(p.key)}
            >
              <p className={s.paramLabel}>{p.label}</p>

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
  );
}

export default PackageBuilderStage;
