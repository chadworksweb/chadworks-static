// =====================================================================
// ManifestoSection -- the FULL "who is chadworks for?" manifesto, for the About
// page. The same frosted glass panel + Lyric-Transformer cloud the homepage once
// carried, now its real home. The cloud (<ManifestoAmbient />) is a full-bleed,
// non-fixed layer behind the panel; on this page it starts at the section top
// (no gemstone above it) and fades in/out. The homepage only teases this with a
// heading + a "Read the manifesto" CTA.
// =====================================================================

import { emphasize } from "@/lib/emphasize";
import { MANIFESTO } from "@/lib/manifesto";
import { SectionShell } from "@/components/capsules/SectionShell";
import ManifestoAmbient from "@/components/ManifestoAmbient";

export function ManifestoSection() {
  return (
    <div className="shell full cw-mani-field cw-mani-field--page">
      {/* the full-bleed cloud, behind the panel; non-fixed (scrolls with page) */}
      <div className="cw-mani-field__bg" aria-hidden="true">
        <ManifestoAmbient />
      </div>

      <SectionShell className="cw-manifesto" id="manifesto">
        <p className="eyebrow">{MANIFESTO.eyebrow}</p>
        <h2>{MANIFESTO.heading}</h2>
        <p className="svc-lede measure-prose">{MANIFESTO.intro}</p>
        <div className="cw-manifesto__panel">
          {MANIFESTO.paragraphs.map((p, i) => (
            <p key={i}>{emphasize(p)}</p>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

export default ManifestoSection;
