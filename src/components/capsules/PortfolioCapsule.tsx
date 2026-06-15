// PORTFOLIO CAPSULE (optional) -- screenshot shots driven by THE sitewide
// water-ripple engine (RippleGrid: the chadlewine explore-grid hover effect,
// called here, never rebuilt per page).

import type { Service } from "@/lib/service";
import { RippleGrid } from "@/components/ripple/RippleGrid";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type PortfolioCapsuleProps = {
  portfolio: NonNullable<Service["portfolio"]>;
  slug: string;
};

export function PortfolioCapsule({ portfolio, slug }: PortfolioCapsuleProps) {
  return (
    <SectionShell className="svc-block">
      <h2 className="svc-block__heading">{portfolio.heading}</h2>
      {portfolio.intro && (
        <p className="svc-block__body measure-prose">
          <W value={portfolio.intro} />
        </p>
      )}
      <RippleGrid
        items={portfolio.items.map((p, i) => ({
          key: `${slug}-shot-${i}`,
          src: p.img,
          alt: p.alt,
          label: p.label,
          href: p.href,
        }))}
      />
    </SectionShell>
  );
}
