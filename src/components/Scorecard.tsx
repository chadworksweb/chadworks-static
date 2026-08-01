"use client";

// Interactive scorecard -- the septic page's six-row quick audit
// (industry_score), ported line for line: tap rows that apply, the tally
// pops on every tap (reflow retrigger), the verdict adapts across five
// tiers, and the CTA label flips at a perfect score. Config-driven so each
// page brings its own rows and verdicts.

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { WaveText } from "@/components/WaveText";

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
  // "stacked" (default) is the original single-column card. "split" puts the
  // title, running score, and CTA in a left column with the checklist beside
  // it. Opt in per page; the stacked pages are untouched.
  layout?: "stacked" | "split";
  // Optional prose under the title. Split layout only -- the left column is
  // the one with room for it.
  blurb?: ReactNode;
}

export function Scorecard({
  label,
  title,
  items,
  verdicts,
  ctaHref,
  ctaDefault,
  ctaMax,
  layout = "stacked",
  blurb,
}: Props) {
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

  const split = layout === "split";

  const resetBtn = (
    <button type="button" className="cw-score__reset" onClick={reset}>
      Reset
    </button>
  );

  const head = (
    <>
      <div className="cw-score__header">
        <div>
          <div className="cw-score__label">{label}</div>
          <div className="cw-score__title">{title}</div>
        </div>
        {/* Split moves Reset down beside the CTA; stacked keeps it up here. */}
        {!split && resetBtn}
      </div>
      {blurb && split && <p className="cw-score__blurb">{blurb}</p>}
    </>
  );

  const list = (
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
  );

  // An empty tier-0 string is the supported way to say "no verdict until they
  // tap something" -- the element is dropped rather than reserving blank space.
  const verdictText = score === 0 ? verdicts[0].text : verdict.text;

  const tally = (
    <div className="cw-score__total" aria-live="polite">
      <div>
        <div className="cw-score__total-label">Your score</div>
        {/* The running score sits in its own fixed-width, RIGHT-aligned slot so
            a narrower numeral grows leftward into the slot instead of dragging
            the slash and the total across with it on every tap. */}
        <div ref={numRef} className="cw-score__total-num">
          <span className="cw-score__total-score">{score}</span> / {total}
        </div>
      </div>
      {/* Always in the DOM, even when empty: the split layout reserves three
          lines here, and a conditional element would collapse that reservation
          at score 0 and shift the sticky column on the first tap. */}
      <div className="cw-score__verdict" data-tier={score === 0 ? "0" : verdict.tier}>
        {verdictText}
      </div>
    </div>
  );

  // Split keeps ONE label all the way to a perfect score -- the max state is
  // signalled by the letters rising in a wave instead of by a text swap, which
  // moved the button's width under the reader. Stacked keeps the swap.
  const cta = split ? (
    <Link
      href={ctaHref}
      className={`svc-btn cw-score__cta${score === total ? " cw-score__cta--wave" : ""}`}
    >
      <span className="svc-btn__label">
        <WaveText text={ctaDefault} />
      </span>
    </Link>
  ) : (
    <Link href={ctaHref} className="svc-btn cw-score__cta">
      <span className="svc-btn__label">{score === total ? ctaMax : ctaDefault}</span>
    </Link>
  );

  // Split: title/blurb/score/CTA in the left column, checklist in the right.
  // Stacked keeps the original source order in one column.
  if (split) {
    return (
      // Three grid areas rather than two nested columns: on a phone the stack
      // has to read head -> checklist -> score, which a left/right nesting
      // cannot reorder.
      <div className="cw-score cw-score--split">
        {/* The aside is a real (sticky) box on desktop and `display: contents`
            under 900px, where its children become grid items again so the
            stack can read head -> checklist -> score -> buttons. */}
        <div className="cw-score__aside">
          <div className="cw-score__head">{head}</div>
          <div className="cw-score__tally">{tally}</div>
          <div className="cw-score__cta-row">
            {resetBtn}
            {cta}
          </div>
        </div>
        <div className="cw-score__main">{list}</div>
      </div>
    );
  }

  return (
    <div className="cw-score">
      {head}
      {list}
      {tally}
      {cta}
    </div>
  );
}
