"use client";

// =====================================================================
// PackageAssemble -- the deconstruct/reassemble object in the calculator's
// "purpose" section.
//
// It is NOT a separate illustration. It is the REAL calculator object
// (PackageScreen) driven at one fixed scope, running in its `assembly` mode:
// the genuine parts -- the beveled cover, the stacked page leaves, the mathDev
// plug, and the branding panel with its real gem, copy-skeleton bars and
// ecommerce grid -- disperse across the frame and click-assemble into the
// finished package. Every element is the actual scope-driven geometry the
// calculator renders; the assembly is layered on top of those real draw calls,
// not reconstructed from stand-ins.
//
// The scope shown (levels are 1-indexed, as the calculator's chips read):
//   visual level 5   -> ambition 4: the lit-bevel "(chad)works" cover
//   math level 5     -> mathDev 4: the electric plug
//   branding level 2 -> brandingDone 1: the plaque + CW logo (gem, no cloud)
//   copy level 3     -> content 2: the skeleton copy bars
//   ecommerce level 3-> commerce 2: the store grid + cart
// Everything else sits at the baseline. Change the numbers here and the object
// rebuilds itself from the one pricing model -- these are the same channels the
// live tool feeds its object.
// =====================================================================

import { PackageScreen } from "./PackageScreen";
import { channels, BASELINE } from "@/lib/package-builder";

// The package the assembled object represents. A real Scope, priced and
// rendered by the same model as the live calculator.
const ASSEMBLE_SCOPE = {
  ...BASELINE,
  pages: 3,
  ambition: 4, // visual level 5: the lit-bevel cover
  mathDev: 4, // math level 5: the electric plug
  brandingDone: 1, // branding level 2: the plaque + CW logo (gem, no cloud)
  content: 2, // copy level 3: the skeleton bars
  commerce: 2, // ecommerce level 3: the store grid + cart
};

// Computed once at module load -- the scope never changes, so neither do the
// channels. Passing the real channels object is what makes the parts genuine.
const ASSEMBLE_CHANNELS = channels(ASSEMBLE_SCOPE);

export function PackageAssemble({ className }: { className?: string }) {
  return <PackageScreen channels={ASSEMBLE_CHANNELS} assembly className={className} />;
}

export default PackageAssemble;
