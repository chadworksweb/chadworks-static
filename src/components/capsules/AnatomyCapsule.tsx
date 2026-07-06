// ANATOMY CAPSULE ("Anatomy of a great web page") -- the generic, trimmed
// WireframeCamera teardown packaged as a drop-in section. The scroll-hijack
// camera and its .cw-wf-* CSS are untouched; this capsule just pairs the
// component with the industry-neutral `genericWireframe` data and a default
// intro, wrapped in a full-bleed SectionShell. Pass `sections`/`intro`/
// `scrollVh` to reuse the same teardown with different content.

import type { ReactNode } from "react";
import { SectionShell } from "@/components/capsules/SectionShell";
import { WireframeCamera, type WfSection } from "@/components/art/WireframeCamera";
import { genericWireframe } from "@/components/art/wireframes/generic";

type AnatomyIntro = { eyebrow?: string; heading: string; lede?: ReactNode };

const DEFAULT_INTRO: AnatomyIntro = {
  eyebrow: "A teardown, section by section",
  heading: "Anatomy of a great web page",
  lede: (
    <>
      Scroll the sample page below. The view zooms into each section so you can
      see what it does and why it earns its place, from the header a visitor
      never loses to the close that catches them at the end.
    </>
  ),
};

export function AnatomyCapsule({
  sections = genericWireframe,
  intro = DEFAULT_INTRO,
  scrollVh,
}: {
  sections?: WfSection[];
  intro?: AnatomyIntro;
  scrollVh?: number;
} = {}) {
  return (
    <SectionShell full reveal={false}>
      <WireframeCamera sections={sections} intro={intro} scrollVh={scrollVh} />
    </SectionShell>
  );
}
