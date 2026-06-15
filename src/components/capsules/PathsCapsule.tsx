// PATHS CAPSULE (optional) -- funnel out to sub-options, rendered as the
// ASYMMETRIC HOVER LANES (septic lane chrome: glass surface, oversized faded
// numeral, 3px accent left border + staggered indents; CF lanes hover: the
// accent border wipes to a full-width glow).

import Link from "next/link";
import type { Service } from "@/lib/service";
import { LANE_COLORS } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type PathsCapsuleProps = { paths: NonNullable<Service["paths"]> };

export function PathsCapsule({ paths }: PathsCapsuleProps) {
  return (
    <SectionShell className="svc-block">
      <h2 className="svc-block__heading">{paths.heading}</h2>
      {paths.intro && (
        <p className="svc-block__body measure-prose">
          <W value={paths.intro} />
        </p>
      )}
      <div className="svc-lanes">
        {paths.items.map((p, i) => (
          <Link
            key={i}
            href={p.href}
            className="svc-lane"
            style={
              { "--lane-color": LANE_COLORS[i % LANE_COLORS.length] } as React.CSSProperties
            }
          >
            <span className="svc-lane__num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="svc-lane__content">
              <span className="svc-lane__title">{p.label}</span>
              <span className="svc-lane__desc">
                <W value={p.detail} />
              </span>
              <span className="svc-lane__arrow" aria-hidden="true">Explore -&gt;</span>
            </span>
            {p.viz && (
              <span className="svc-lane__viz" aria-hidden="true">{p.viz}</span>
            )}
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
