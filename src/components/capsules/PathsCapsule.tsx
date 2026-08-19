// PATHS CAPSULE (optional) -- funnel out to sub-options, rendered as the
// ASYMMETRIC HOVER LANES (septic lane chrome: glass surface, oversized faded
// numeral, 3px accent left border + staggered indents; CF lanes hover: the
// accent border wipes to a full-width glow).

import Link from "next/link";
import type { Service, Writable } from "@/lib/service";
import { isPrompt } from "@/lib/service";
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
//
// `topPad` is the section's TOP RHYTHM, and it is a prop rather than a global
// rule for a reason that cost four pages a patch each (Chad, 2026-08-19). The
// original was a blanket `:has(.svc-lanes)` selector cutting the top padding to
// 15%, written 2026-07-13 for a funnel tucked under a block on the SAME
// surface. No lanes module on the site sits that way any more: every one of
// them follows a full-bleed band with its own background, where the band's own
// padding is inside its dark surface and contributes no visible air, so 15%
// reads as none. /ai-search-visibility/, /rates/ and the calculator each
// discovered that separately and each wrote their own override. The default is
// now the full rhythm, and "tuck" is what an instance opts INTO.
export type PathsCapsuleProps = {
  // `heading` is widened to OPTIONAL here, which `Service["paths"]` does not
  // allow. The homepage's three-up module has no h2 at all and never did, so a
  // capsule that always prints one could not have absorbed it. Existing callers
  // pass a string and are unaffected.
  // `intro` is widened alongside it: HubConfig types its lane intro as a
  // ReactNode, and `Service["paths"]` only allows a Writable (a string, or a
  // Prompted placeholder). Both are accepted and rendered by their own branch
  // below, so neither caller has to narrow at the call site.
  paths: Omit<NonNullable<Service["paths"]>, "heading" | "intro"> & {
    heading?: string;
    intro?: Writable | React.ReactNode;
  };
  layout?: "grid" | "rows";
  topPad?: "full" | "tuck";
  autoSeal?: boolean;
  cta?: { title: string; body: React.ReactNode; label: string; href: string };
  // Where the cta lane sits in the grid. Default is last. Both lane hubs splice
  // theirs in at index 2, so the contact card is the THIRD box rather than the
  // final one, and absorbing them without this would have silently moved it to
  // the end of a seven or eight card grid.
  ctaAt?: number;
  // Per-instance modifier hook (e.g. `cw-visibility-paths`, which hands this
  // one its standard top padding back).
  className?: string;
  // Anchor target on the SECTION, for a hero CTA that jumps down into the lane
  // grid (the /consulting/ hub does this). Optional, so every existing caller
  // renders byte-identical HTML.
  id?: string;
};

export function PathsCapsule({
  paths,
  layout = "grid",
  topPad = "full",
  autoSeal,
  cta,
  ctaAt,
  className,
  id,
}: PathsCapsuleProps) {
  const pad = topPad === "tuck" ? " cw-lanes--tuck" : "";
  return (
    <SectionShell
      id={id}
      className={`svc-block${pad}${className ? ` ${className}` : ""}`}
    >
      {paths.heading && (
        <h2 className="svc-block__heading">{paths.heading}</h2>
      )}
      {paths.intro !== undefined && paths.intro !== null && (
        <p className="svc-block__body measure-prose">
          {/* A Writable goes through W, which knows how to paint an unwritten
              `prompt()` placeholder. Anything else is already a ReactNode and
              renders as itself. */}
          {typeof paths.intro === "string" || isPrompt(paths.intro) ? (
            <W value={paths.intro as Writable} />
          ) : (
            (paths.intro as React.ReactNode)
          )}
        </p>
      )}
      <div className={`svc-lanes${layout === "rows" ? " svc-lanes--rows" : ""}`}>
        {(() => {
        const cards = paths.items.map((p, i) => {
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
        });
        if (cta) {
          const card = (
            <a key="cta" href={cta.href} className="svc-lane svc-lane--cta">
              <span className="svc-lane__content">
                <span className="svc-lane__title">{cta.title}</span>
                <span className="svc-lane__desc">{cta.body}</span>
                {/* ONE LINE, and it has to stay one line. Split across lines,
                    JSX trims the leading newline and indentation off the text
                    node that follows {cta.label}, so the separating space is
                    eaten and the card renders "Contact me->". The hand-rolled
                    hub and homepage markup this capsule absorbed had the label
                    baked into the literal and never hit it. */}
                <span className="svc-lane__arrow" aria-hidden="true">{cta.label} -&gt;</span>
              </span>
            </a>
          );
          // splice, not push: see `ctaAt`. An index past the end appends, which
          // is exactly what the default does.
          cards.splice(ctaAt ?? cards.length, 0, card);
        }
        return cards;
        })()}
      </div>
    </SectionShell>
  );
}
