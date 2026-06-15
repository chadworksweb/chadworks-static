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
  variant?: "glass" | "ledger";
  ledger?: LedgerRow[];
  panelClassName?: string;
  headingFill?: boolean; // svc-fill wipe on the heading (ledger uses it)
  heading?: ReactNode; // override price.heading
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
}: PriceCapsuleProps) {
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
