// PRICE CAPSULE -- value-based posture; never a fake fixed number. With a
// `figure`, renders the septic glass panel: gradient numeral + mono sub + copy
// + accent-bordered disclaimer. Alternate (lavender) scheme.

import type { Service } from "@/lib/service";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CtaButton } from "@/components/capsules/shared";

export type PriceCapsuleProps = {
  price: Service["price"];
  ctaHref: string;
  // The price-panel CTA label. Default preserves the template's wording; pages
  // override per placement.
  ctaLabel?: string;
};

export function PriceCapsule({
  price,
  ctaHref,
  ctaLabel = "Get a straight answer",
}: PriceCapsuleProps) {
  return (
    <SectionShell full className="scheme-alternate svc-block svc-pricing">
      <h2 className="svc-block__heading">{price.heading}</h2>
      {price.figure ? (
        <div className="svc-pricing__panel">
          <div className="svc-pricing__price">{price.figure}</div>
          {price.figureSub && (
            <div className="svc-pricing__price-sub">{price.figureSub}</div>
          )}
          <p className="svc-pricing__copy">
            <W value={price.body} />
          </p>
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
