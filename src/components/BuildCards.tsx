// BUILD CARDS -- the worked-build gallery, rendered from real calculator scopes.
//
// Extracted from /how-much-does-a-website-cost/ on 2026-08-13 so two pages can
// render one gallery from one source:
//   - /how-much-does-a-website-cost/  the first three, as a teaser
//   - /web-design-packages/           the full list
//
// WHY A COMPONENT AND NOT A COPY. Every figure here is computed by price() at
// render, never typed, so a ladder retune rewrites all of them in one edit.
// Forking the markup would fork that guarantee's SURFACE: the numbers would
// still agree, and the labels, the tick logic and the timeline sentence would
// drift apart with no audit script watching. price-audit.mjs reads figures, not
// prose.
//
// The CSS (.cw-builds / .cw-build) lives in styles/global.css and was written
// for this markup. It is unchanged by the extraction.

import {
  PARAMS,
  money,
  paramValue,
  price,
  weeksLabel,
  type Scope,
} from "@/lib/package-builder";

// What a card needs. Structurally identical to `Example` in lib/pricing, which
// is what the callers pass. Declared structurally rather than importing that
// type so a second list (packages with their own names, if that ever happens)
// does not have to pretend to be an Example to render.
export type BuildCard = {
  slug: string;
  name: string;
  detail: string;
  scope: Scope;
};

// The exact scope behind a build, as ticks under its timeline. Pages and
// sections always show (the spine of any build); everything else shows only
// when it is actually engaged, so the list reads as "what is in THIS build".
export function scopeTicks(s: Scope): { label: string; value: string }[] {
  return PARAMS.filter((p) => {
    const v = s[p.key] as number;
    switch (p.key) {
      case "pages":
      case "sections":
        return true;
      case "locales":
        return v > 1;
      case "integrations":
        return v !== 0;
      case "timeline":
        return v > 0;
      case "brandingDone":
      case "content":
        return v >= 0; // a real choice was made (baseline leaves these unset)
      default:
        return v > 0; // ambition, mathDev, editability, motion, commerce
    }
  }).map((p) => ({ label: p.label, value: paramValue(p, s) }));
}

export function BuildCards({ items }: { items: readonly BuildCard[] }) {
  return (
    <div className="cw-builds">
      {items.map((ex) => (
        <article key={ex.slug} className="cw-build">
          <div className="cw-build__body">
            <h3 className="cw-build__title">
              {ex.name}{" "}
              <span className="cw-build__price">{money(price(ex.scope))}</span>
            </h3>
            <p className="cw-build__detail">{ex.detail}</p>
            <p className="cw-build__meta">
              Roughly {weeksLabel(ex.scope)} from starting to launched.
            </p>
            <ul className="cw-build__scope">
              {scopeTicks(ex.scope).map((t) => (
                <li key={t.label} className="cw-build__scope-item">
                  {t.label}: {t.value}
                </li>
              ))}
            </ul>
          </div>
          {/* The object at this exact scope, rendered once from the model to
              a transparent PNG. Decorative, so alt is empty. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
          <img
            className="cw-build__shape"
            src={`/shapes/${ex.slug}.webp`}
            alt=""
            width="860"
            height="500"
            loading="lazy"
            decoding="async"
          />
        </article>
      ))}
    </div>
  );
}
