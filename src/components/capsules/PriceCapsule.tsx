// PRICE CAPSULE -- value-based posture; never a fake fixed number.
//  - "glass" (default): the septic glass panel -- gradient numeral + mono sub +
//    copy + accent-bordered disclaimer.
//  - "ledger" (/rates/): the same panel plus a show-the-math ledger (dl) between
//    the copy and the disclaimer, the heading on the svc-fill wipe, and the
//    rates-panel hook.
// Alternate (lavender) scheme.

import type { ReactNode } from "react";
import type { Service } from "@/lib/service";
import { cx } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CtaButton } from "@/components/capsules/shared";

export type LedgerRow = { label: string; num: string; note: string };

export type PriceCapsuleProps = {
  price: Service["price"];
  ctaHref: string;
  // The price-panel CTA label. Default preserves the template's wording; pages
  // override per placement.
  ctaLabel?: string;
  variant?: "glass" | "ledger" | "rates";
  ledger?: LedgerRow[];
  panelClassName?: string;
  headingFill?: boolean; // svc-fill wipe on the heading (ledger uses it)
  heading?: ReactNode; // override price.heading
  // "rates" only: the mono label over the figure, and the small unit trailing
  // it ("/ month"). The figure itself stays price.figure.
  cardLabel?: string;
  unit?: string;
  // "rates" only: render the fine print in the CARD column, tucked under the
  // card, instead of in the copy column under the argument (Chad, 2026-08-09).
  // Opt-in rather than a straight move, because /ai-search-visibility/ and
  // /ai-visibility-audit/ run this variant too and keep the fine print with the
  // copy. It is a DOM change and not a CSS one on purpose: with the paragraph
  // living inside the copy column, no amount of grid placement puts it against
  // the bottom of the card -- its row is sized by the argument beside it, so it
  // lands wherever that text ends.
  disclaimerUnderCard?: boolean;
};

export function PriceCapsule({
  price,
  ctaHref,
  ctaLabel = "Get a straight answer",
  variant = "glass",
  ledger,
  panelClassName,
  headingFill,
  heading,
  cardLabel = "Flat monthly rate",
  unit,
  disclaimerUnderCard,
}: PriceCapsuleProps) {
  // RATES variant -- the global rates band's design language (cw-pricing head,
  // panel card, centred disclaimer + CTA), split so the argument holds the left
  // column and the number sits on the right. Used where the price is one flat
  // figure rather than a posture about an hourly rate.
  if (variant === "rates") {
    return (
      <SectionShell full className="scheme-alternate cw-pricing cw-pricing--split">
        <div className="cw-pricing__grid cw-pricing__grid--split">
          {/* Left column: the heading, the argument, then the fine print. The
              rates band runs its heading above the grid; here it belongs to the
              copy, so the card can start level with it. */}
          <div className="cw-pricing__copy">
            {/* The standard section heading, NOT .cw-pricing__heading: inside
                the copy column that one inherits the column's --text-secondary
                and reads grey against every other h2 on the page. */}
            <h2 className="svc-block__heading">{heading ?? price.heading}</h2>
            <p>
              <W value={price.body} />
            </p>
            {price.disclaimer && !disclaimerUnderCard && (
              <p className="cw-pricing__disclaimer cw-pricing__disclaimer--inline">
                {price.disclaimer}
              </p>
            )}
          </div>
          {/* Right column: the number, closed by the CTA sitting flush in the
              card's bottom edge (square on top, the panel's radius below).

              The wrapper only exists when the fine print joins the card here,
              so every other page's grid keeps the card as its own direct grid
              item and nothing about their layout moves. */}
          {(() => {
            const card = (
              <div className={cx("cw-price-card panel cw-price-card--cta", panelClassName)}>
                <p className="cw-price-card__label">{cardLabel}</p>
                <p className="cw-price-card__figure">
                  {price.figure}
                  {unit && <span className="cw-price-card__unit">{unit}</span>}
                </p>
                <div className="cw-price-card__cta">
                  <CtaButton href={ctaHref} label={ctaLabel} />
                </div>
              </div>
            );
            if (!price.disclaimer || !disclaimerUnderCard) return card;
            return (
              <div className="cw-pricing__aside">
                {card}
                <p className="cw-pricing__disclaimer cw-pricing__disclaimer--under-card">
                  {price.disclaimer}
                </p>
              </div>
            );
          })()}
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell full className="scheme-alternate svc-block svc-pricing">
      <h2 className={cx("svc-block__heading", headingFill && "svc-fill")}>
        {heading ?? price.heading}
      </h2>
      {price.figure ? (
        <div className={cx("svc-pricing__panel", panelClassName)}>
          <div className="svc-pricing__price">{price.figure}</div>
          {price.figureSub && (
            <div className="svc-pricing__price-sub">{price.figureSub}</div>
          )}
          <p className="svc-pricing__copy">
            <W value={price.body} />
          </p>
          {variant === "ledger" && ledger && (
            <dl className="rates-ledger">
              {ledger.map((row) => (
                <div key={row.num} className="rates-ledger__row">
                  <dt className="rates-ledger__label">{row.label}</dt>
                  <dd className="rates-ledger__num">{row.num}</dd>
                  <dd className="rates-ledger__note">{row.note}</dd>
                </div>
              ))}
            </dl>
          )}
          {price.disclaimer && (
            <p className="svc-pricing__disclaimer">{price.disclaimer}</p>
          )}
          <CtaButton href={ctaHref} label={ctaLabel} />
        </div>
      ) : (
        <p className="svc-block__body measure-prose">
          <W value={price.body} />
        </p>
      )}
    </SectionShell>
  );
}
