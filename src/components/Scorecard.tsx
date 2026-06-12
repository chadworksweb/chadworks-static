"use client";

// Interactive scorecard -- the septic page's six-row quick audit
// (industry_score), ported line for line: tap rows that apply, the tally
// pops on every tap (reflow retrigger), the verdict adapts across five
// tiers, and the CTA label flips at a perfect score. Config-driven so each
// page brings its own rows and verdicts.

import { useRef, useState } from "react";
import Link from "next/link";

export interface ScorecardItem {
  strong: string;
  small: string;
}

export interface ScorecardVerdict {
  // Applies when score <= max (checked in order). Tier drives the color.
  max: number;
  tier: "0" | "low" | "mid" | "high" | "max";
  text: string;
}

interface Props {
  label: string;
  title: string;
  items: ScorecardItem[];
  verdicts: ScorecardVerdict[];
  ctaHref: string;
  ctaDefault: string;
  ctaMax: string;
}

export function Scorecard({ label, title, items, verdicts, ctaHref, ctaDefault, ctaMax }: Props) {
  const [on, setOn] = useState<boolean[]>(() => items.map(() => false));
  const numRef = useRef<HTMLDivElement>(null);

  const score = on.filter(Boolean).length;
  const total = items.length;
  const verdict =
    verdicts.find((v) => score <= v.max) ?? verdicts[verdicts.length - 1];

  function toggle(i: number) {
    setOn((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
    const el = numRef.current;
    if (el) {
      el.classList.remove("cw-score__pop");
      // Force reflow so the animation re-fires on each tap (source trick).
      void el.offsetWidth;
      el.classList.add("cw-score__pop");
    }
  }

  function reset() {
    setOn(items.map(() => false));
  }

  return (
    <div className="cw-score">
      <div className="cw-score__header">
        <div>
          <div className="cw-score__label">{label}</div>
          <div className="cw-score__title">{title}</div>
        </div>
        <button type="button" className="cw-score__reset" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="cw-score__list" role="group" aria-label={title}>
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            className="cw-score__item"
            data-on={on[i] ? "1" : "0"}
            aria-pressed={on[i]}
            onClick={() => toggle(i)}
          >
            <span className="cw-score__check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="cw-score__criterion">
              <strong>{item.strong}</strong>
              <small>{item.small}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="cw-score__total" aria-live="polite">
        <div>
          <div className="cw-score__total-label">Your score</div>
          <div ref={numRef} className="cw-score__total-num">
            {score} / {total}
          </div>
        </div>
        <div className="cw-score__verdict" data-tier={score === 0 ? "0" : verdict.tier}>
          {score === 0 ? verdicts[0].text : verdict.text}
        </div>
      </div>

      <Link href={ctaHref} className="svc-btn cw-score__cta">
        <span className="svc-btn__label">{score === total ? ctaMax : ctaDefault}</span>
      </Link>
    </div>
  );
}
