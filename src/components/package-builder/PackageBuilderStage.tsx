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

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
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

// ---------------------------------------------------------------------
// SCROLL TO A PARAM'S DISCLAIMER, then flash it.
//
// The scroll is animated here rather than handed to the browser. Native smooth
// scrolling is a per-browser preference (Firefox ships it off in more than one
// configuration), and a fragment jump would land hard with no travel at all.
// Owning the tween means the motion is the same everywhere AND there is an
// exact moment the scroll finishes, which is when the pulse has to start.
//
// The highlight is on before the first frame of travel, so the reader can see
// what they are being carried to while it is still off screen.
// ---------------------------------------------------------------------
const HELD = "cw-ratecard__note--held";
const PULSE = "cw-ratecard__note--pulse";
const TRAVEL_MS = 750;
// Must outlast the whole cw-note-pulse animation in global.css: three flashes
// (peaks at 0s, 0.8s, 1.6s) plus a 0.8s fade down. Cutting the class before the
// fade completes is exactly the mid-cycle snap the tail exists to avoid.
const PULSE_MS = 2500;

function scrollToNote(el: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  el.classList.remove(PULSE);
  el.classList.add(HELD);

  const land = () => {
    el.classList.remove(HELD);
    el.classList.add(PULSE);
    window.setTimeout(() => el.classList.remove(PULSE), PULSE_MS);
  };

  // Centre the note, clamped to the real scroll range so a target near either
  // end still lands instead of asking for an impossible offset.
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const startY = window.scrollY;
  const endY = Math.max(
    0,
    Math.min(
      maxY,
      startY + el.getBoundingClientRect().top - (window.innerHeight - el.offsetHeight) / 2,
    ),
  );

  // EVERY scroll here passes behavior "instant" on purpose. global.css sets
  // `scroll-behavior: smooth` on the root, which silently upgrades a bare
  // scrollTo into an animated one -- so the per-frame writes below would each
  // start their own smooth scroll and fight the easing. Instant makes this
  // function the only thing moving the page.
  const jump = (y: number) => window.scrollTo({ top: y, behavior: "instant" });

  if (reduced || Math.abs(endY - startY) < 2) {
    jump(endY);
    land();
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    jump(endY);
    land();
  };

  const t0 = performance.now();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now: number) => {
    if (done) return;
    const prog = Math.min(1, (now - t0) / TRAVEL_MS);
    jump(startY + (endY - startY) * ease(prog));
    if (prog < 1) requestAnimationFrame(step);
    else finish();
  };
  requestAnimationFrame(step);

  // Watchdog. rAF does not always run: a background or throttled tab can starve
  // it indefinitely, and some automation contexts never fire it at all. Without
  // this the reader would sit on a highlighted line they cannot see, having
  // been moved nowhere. If the tween has not finished by the time it should
  // have, land the hard way.
  window.setTimeout(finish, TRAVEL_MS + 400);
}

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

// Scope is CONTROLLED by the parent (ScopeCalculator) so the send-to-Chad form
// can read the same state the calculator writes. Only the open-panel set is
// local -- it is pure UI and nothing else needs it.
export function PackageBuilderStage({
  scope,
  setScope,
}: {
  scope: Scope;
  setScope: Dispatch<SetStateAction<Scope>>;
}) {
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
                    <p className={s.hint}>
                      {p.hint}
                      {p.note ? (
                        <>
                          {" "}
                          <a
                            className={s.noteRef}
                            href={`#note-${p.key}`}
                            aria-label={`${p.label}: read the disclaimer on this line`}
                            onClick={(e) => {
                              const el = document.getElementById(`note-${p.key}`);
                              if (!el) return; // no target: let the href do it
                              e.preventDefault();
                              scrollToNote(el);
                            }}
                          >
                            (read disclaimer)
                          </a>
                        </>
                      ) : null}
                    </p>

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
                          onChange={(e) => {
                            const nv = Number(e.target.value);
                            // Reaching for languages before copy has been
                            // picked implies copy exists to translate: the xN
                            // badge sits on the copy column, so promote unset
                            // copy to level 1 in the same move rather than
                            // stamping it over an empty column.
                            if (p.key === "locales") {
                              setScope((prev) => ({
                                ...prev,
                                locales: nv,
                                content: prev.content < 0 ? 0 : prev.content,
                              }));
                            } else {
                              set(p.key, nv);
                            }
                          }}
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

        {/* the finish line: a native anchor to the send form right below the
            stage. No JS, no DOM reach-across -- the browser scrolls to the form,
            which already carries the live scope. */}
        <div className={s.finish}>
          <a className={s.finishLink} href="#your-scope">
            Send this scope to Chad
          </a>
        </div>
      </div>

      {/* The tool needs a real landscape screen -- the rail, the object and the
          price sit in a row. A PHONE stays dark in both orientations and is sent
          to the desktop, because turning it does not buy enough room either way.
          A TABLET upright is the one gated case where turning it really does run
          the tool, so it is the only one that says "rotate". Which line shows is
          pure CSS (see .gateMsgRotate / .gateMsgDesktop); both are always in the
          DOM, so there is no hydration flash and the static export needs no
          client gate. */}
      <div className={s.mobileGate}>
        <p className={s.gateKicker}>chadworks</p>
        {/* The page title still lands even though the tool is dark, so the fold
            says what this page is rather than only that it is unavailable. */}
        <p className={s.gateTitle}>Website Design Cost Calculator</p>
        <p className={s.gateHeading}>
          <span className={s.gateMsgRotate}>Rotate your device to landscape</span>
          <span className={s.gateMsgDesktop}>Please view on desktop</span>
        </p>
        {/* Phone-only footnote. Hidden wherever the rotate prompt shows, since a
            tablet is being asked to turn, not to leave. */}
        <p className={s.gateNote}>
          I am working on a mobile friendly version of this. To see the fully
          loaded calculator, visit this page on a tablet or computer.
        </p>
      </div>
    </div>
  );
}

export default PackageBuilderStage;
