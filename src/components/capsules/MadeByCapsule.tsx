// MADE-BY CAPSULE (optional) -- the septic "Hi, I'm Chad" founder block:
// cutout photo + caption card, manifesto rows, negation list, signature.

import type { Service } from "@/lib/service";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type MadeByCapsuleProps = { made: NonNullable<Service["made"]> };

export function MadeByCapsule({ made }: MadeByCapsuleProps) {
  return (
    <SectionShell className="svc-block svc-made">
      {made.eyebrow && <p className="eyebrow">{made.eyebrow}</p>}
      <h2 className="svc-block__heading svc-made__heading">{made.heading}</h2>
      <div className="svc-made__grid">
        <div className="svc-made__photo">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
          <img src={made.img} alt={made.imgAlt} loading="lazy" />
          <div className="svc-made__caption">
            <span className="svc-made__caption-main">{made.captionMain}</span>
            {made.captionSub && (
              <span className="svc-made__caption-sub">{made.captionSub}</span>
            )}
          </div>
        </div>
        <div className="svc-made__copy">
          <p className="svc-made__intro">
            <W value={made.intro} />
          </p>
          <ul className="svc-made__manifesto">
            {made.manifesto.map((m, i) => (
              <li key={i}>
                {m.lead} <span className="svc-made__aside">{m.aside}</span>
              </li>
            ))}
          </ul>
          <ul className="svc-made__negation">
            {made.negation.map((n, i) => (
              <li key={i}>
                <span className="svc-made__x" aria-hidden="true">&times;</span>
                {n}
              </li>
            ))}
          </ul>
          <p className="svc-made__close">
            <W value={made.close} />
          </p>
          <p className="svc-made__sig">
            {made.sig}
            {made.sigMeta && (
              <span className="svc-made__sig-meta">{made.sigMeta}</span>
            )}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
