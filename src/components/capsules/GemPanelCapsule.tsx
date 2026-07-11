// GEM PANEL CAPSULE -- a full-bleed section whose background is the spinning CW
// gemstone (spins on its own, NOT cursor-driven), with the copy sitting in a
// frosted-glass panel centered over it. Used on the web-development page to
// define "what web development is" between the process timeline and the build
// options. The gem rides in SectionShell's `bg` slot (absolute, beneath the
// content); the card lifts above it.

import type { ReactNode } from "react";
import { SectionShell } from "@/components/capsules/SectionShell";
import { GemstoneMark } from "@/components/GemstoneMark";

export function GemPanelCapsule({ children }: { children: ReactNode }) {
  return (
    <SectionShell
      full
      className="cw-gempanel"
      bg={
        <div className="cw-gempanel__gemwrap">
          <GemstoneMark spinDir={1} speed={0.12} className="cw-gempanel__gem" />
        </div>
      }
    >
      <div className="cw-gempanel__card">
        <p className="cw-gempanel__text">{children}</p>
      </div>
    </SectionShell>
  );
}
