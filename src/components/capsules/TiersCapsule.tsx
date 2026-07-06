// TIERS CAPSULE (optional) -- the attainable-entry + stackable-add-ons offer
// for product-style Situation pages (Leave Social Media / the Greenfield scaled
// down). The entry is one affordable module (the door); each add-on is a card
// that links to its own module page (often a stub during a spike). Reuses the
// glass-panel + accent language so it sits inside the existing system.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type TiersCapsuleProps = { tiers: NonNullable<Service["tiers"]> };

export function TiersCapsule({ tiers }: TiersCapsuleProps) {
  return (
    <SectionShell full className="scheme-alternate svc-block svc-tiers">
      <h2 className="svc-block__heading">{tiers.heading}</h2>
      {tiers.intro && (
        <p className="svc-block__body measure-prose">
          <W value={tiers.intro} />
        </p>
      )}

      <div className="svc-tiers__entry">
        <div className="svc-tiers__entry-mark">Start here</div>
        <div className="svc-tiers__price">{tiers.entry.price}</div>
        {tiers.entry.priceSub && (
          <div className="svc-tiers__price-sub">{tiers.entry.priceSub}</div>
        )}
        <h3 className="svc-tiers__entry-title">{tiers.entry.label}</h3>
        <p className="svc-tiers__entry-copy">
          <W value={tiers.entry.detail} />
        </p>
        {tiers.entry.includes && tiers.entry.includes.length > 0 && (
          <ul className="svc-tiers__includes">
            {tiers.entry.includes.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        )}
        {tiers.entry.href && (
          <Link href={tiers.entry.href} className="svc-tiers__entry-link">
            See the module -&gt;
          </Link>
        )}
      </div>

      {tiers.addOnsLabel && (
        <h3 className="svc-tiers__addons-label">{tiers.addOnsLabel}</h3>
      )}
      <div className="svc-tiers__addons">
        {tiers.addOns.map((a, i) => {
          const inner = (
            <>
              <span className="svc-tiers__addon-price">{a.price}</span>
              <span className="svc-tiers__addon-title">{a.label}</span>
              <span className="svc-tiers__addon-desc">
                <W value={a.detail} />
              </span>
              {a.href && (
                <span className="svc-tiers__addon-arrow" aria-hidden="true">
                  See the module -&gt;
                </span>
              )}
            </>
          );
          return a.href ? (
            <Link
              key={i}
              href={a.href}
              className="svc-tiers__addon svc-tiers__addon--link"
            >
              {inner}
            </Link>
          ) : (
            <div key={i} className="svc-tiers__addon">
              {inner}
            </div>
          );
        })}
      </div>

      {tiers.footnote && (
        <p className="svc-tiers__footnote">
          <W value={tiers.footnote} />
        </p>
      )}
    </SectionShell>
  );
}
