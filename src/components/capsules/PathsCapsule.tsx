// PATHS CAPSULE (optional) -- funnel out to sub-options, rendered as the
// ASYMMETRIC HOVER LANES (septic lane chrome: glass surface, oversized faded
// numeral, 3px accent left border + staggered indents; CF lanes hover: the
// accent border wipes to a full-width glow).

import Link from "next/link";
import type { Service } from "@/lib/service";
import { LANE_COLORS } from "@/lib/capsule";
import { isLaunched } from "@/lib/launch";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

// `layout` is per-instance, not a fork (Chad, 2026-07-17). The lane chrome is
// wired through every service page's paths section AND HubTemplate, so the card
// grid stays the default and a caller opts into "rows" on its own. Adding a
// second copy of this capsule to vary one axis is how the two gems got tangled.
// `autoSeal` locks each lane INDIVIDUALLY against launch.ts, rather than
// `paths.comingSoon` locking the whole set. Opt-in, so every page already
// placing this capsule renders exactly as before; a lane unlocks itself the day
// its route joins LAUNCHED, with nothing to remember to undo.
//
// `cta` appends the inverted contact lane the /websites/ and /visibility/ hubs
// close their lane grid with (svc-lane--cta, same chrome).
export type PathsCapsuleProps = {
  paths: NonNullable<Service["paths"]>;
  layout?: "grid" | "rows";
  autoSeal?: boolean;
  cta?: { title: string; body: React.ReactNode; label: string; href: string };
  // Per-instance modifier hook (e.g. `cw-visibility-paths`, which hands this
  // one its standard top padding back).
  className?: string;
};

export function PathsCapsule({
  paths,
  layout = "grid",
  autoSeal,
  cta,
  className,
}: PathsCapsuleProps) {
  return (
    <SectionShell className={`svc-block${className ? ` ${className}` : ""}`}>
      <h2 className="svc-block__heading">{paths.heading}</h2>
      {paths.intro && (
        <p className="svc-block__body measure-prose">
          <W value={paths.intro} />
        </p>
      )}
      <div className={`svc-lanes${layout === "rows" ? " svc-lanes--rows" : ""}`}>
        {paths.items.map((p, i) => {
          const soon = paths.comingSoon || (autoSeal && !isLaunched(p.href));
          const style = {
            "--lane-color": LANE_COLORS[i % LANE_COLORS.length],
          } as React.CSSProperties;
          const content = (
            <>
              <span className="svc-lane__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="svc-lane__content">
                <span className="svc-lane__title">{p.label}</span>
                <span className="svc-lane__desc">
                  <W value={p.detail} />
                </span>
                {soon ? (
                  <span
                    className="svc-lane__arrow svc-lane__arrow--soon"
                    tabIndex={0}
                    aria-disabled="true"
                  >
                    Explore -&gt;
                    <span className="svc-lane__tip" role="tooltip">
                      coming soon
                    </span>
                  </span>
                ) : (
                  <span className="svc-lane__arrow" aria-hidden="true">
                    Explore -&gt;
                  </span>
                )}
              </span>
              {p.viz && (
                <span className="svc-lane__viz" aria-hidden="true">{p.viz}</span>
              )}
            </>
          );
          return soon ? (
            <div key={i} className="svc-lane svc-lane--soon" style={style}>
              {content}
            </div>
          ) : (
            <Link key={i} href={p.href} className="svc-lane" style={style}>
              {content}
            </Link>
          );
        })}
        {cta && (
          <a href={cta.href} className="svc-lane svc-lane--cta">
            <span className="svc-lane__content">
              <span className="svc-lane__title">{cta.title}</span>
              <span className="svc-lane__desc">{cta.body}</span>
              <span className="svc-lane__arrow" aria-hidden="true">
                {cta.label} -&gt;
              </span>
            </span>
          </a>
        )}
      </div>
    </SectionShell>
  );
}
