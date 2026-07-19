// GOING TO BAT -- the anti-agency beat, in whichever form the site can serve.
//
// The full Brixhollow email thread now lives in the essay
// (/essays/is-your-agency-ripping-you-off/), so every page that used to render
// the thread inline links out to it instead. The essays surface is held back on
// prod, so while it is unlaunched this falls back to the inline <SepticVoicebox />
// rather than dropping the section entirely.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { SepticVoicebox } from "@/components/septic/SepticVoicebox";
import { isLaunched } from "@/lib/launch";

const ESSAY = "/essays/is-your-agency-ripping-you-off/";

export function GoingToBat() {
  if (!isLaunched("/essays/")) {
    return (
      <SectionShell reveal={false} className="cw-art-voice-section">
        <SepticVoicebox />
      </SectionShell>
    );
  }
  return (
    <SectionShell className="svc-block cw-bat-teaser">
      <div className="cw-bat">
        {/* LEFT: the cutout on the showroom's braille dot field (ported from
            showroom.module.css .metaCorner::before -- same 4.5px grid and
            radial mask, re-anchored so the grain gathers behind the figure). */}
        <div className="cw-bat__art">
          <span className="cw-bat__grain" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cw-bat__cutout"
            src="/people/chad-bat-teaser.webp"
            alt=""
            loading="lazy"
            decoding="async"
            width={1000}
            height={800}
          />
        </div>

        {/* RIGHT: the copy. */}
        <div className="cw-bat__body">
          <p className="eyebrow">Going to bat for clients like you</p>
          <h2 className="svc-block__heading">Is your agency ripping you off?</h2>
          <p className="svc-block__body">
            A client of mine was billed $1,000 a month for what amounted to
            hosting, and leaving turned into weeks of fine print. The whole
            email exchange with that agency is published, start to finish.
          </p>
        </div>

        {/* The bar spans the WHOLE section and is DECORATIVE -- the cutout
            above overlaps its top seam so the figure reads as cut off by it.
            Only the dotted panel at its right end is the link. */}
        <div className="cw-bat__bar">
          <Link className="cw-bat__cta" href={ESSAY}>
            <span className="cw-bat__cta-label">Read the essay -&gt;</span>
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
