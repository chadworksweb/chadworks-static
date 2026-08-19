// Barrel export for the global capsule layer. Pages import capsules from here;
// composeService (lib/compose) places the canonical service order.
export { SectionShell } from "./SectionShell";
export { PageComposer, JsonLd } from "./PageComposer";
export { W, ArrowRight, CheckIcon, CtaButton } from "./shared";
export { HeroCapsule } from "./HeroCapsule";
export { KeyFactsCapsule } from "./KeyFactsCapsule";
export { AiSearchFacetsCapsule } from "./AiSearchFacetsCapsule";
export { AiDemoSplitCapsule } from "./AiDemoSplitCapsule";
export { ProblemCapsule, ProblemArtCapsule } from "./ProblemCapsule";
export { ApproachCapsule } from "./ApproachCapsule";
export { ProcessCapsule } from "./ProcessCapsule";
export { GemPanelCapsule } from "./GemPanelCapsule";
export { GemRevealCapsule } from "./GemRevealCapsule";
export { PathsCapsule } from "./PathsCapsule";
export { PlatformOptionsCapsule } from "./PlatformOptionsCapsule";
export { TiersCapsule } from "./TiersCapsule";
export { ProofCapsule } from "./ProofCapsule";
export { PortfolioCapsule } from "./PortfolioCapsule";
export { PortfolioShowcaseCapsule } from "./PortfolioShowcaseCapsule";
export { TestimonialsCapsule } from "./TestimonialsCapsule";
export { MadeByCapsule } from "./MadeByCapsule";
export { AboutChadCapsule } from "./AboutChadCapsule";
export { PriceCapsule } from "./PriceCapsule";
export { RatesCapsule } from "./RatesCapsule";
export { QualificationCapsule } from "./QualificationCapsule";
export { FitCapsule } from "./FitCapsule";
export { FaqCapsule } from "./FaqCapsule";
export { AssuranceCapsule } from "./AssuranceCapsule";
export { TenetsCapsule } from "./TenetsCapsule";
export { NextStepsCapsule } from "./NextStepsCapsule";
export { CtaCapsule } from "./CtaCapsule";
export { ContactCapsule } from "./ContactCapsule";
export { MainContactCapsule } from "./MainContactCapsule";
export { EraTimelineCapsule } from "./EraTimelineCapsule";
export { AnatomyCapsule } from "./AnatomyCapsule";

// --- The V/S/R (Lane 03 consulting) set. Traced from the chadlewine
// Sovereignty Audit page's sections and rebuilt on CWS tokens; see
// CWS-VSR-SERVICE.md. Global capsules, not page-private: the acts row, the
// governing-rule statement and the split checklist are all reusable shapes.
export { GlyphTitleBar, ActGlyph } from "./GlyphTitleBar";
export { ActsCapsule } from "./ActsCapsule";
export { RuleCapsule } from "./RuleCapsule";
export { SplitChecklistCapsule } from "./SplitChecklistCapsule";
export { VerbatimCapsule } from "./VerbatimCapsule";
export { DeliverableCapsule } from "./DeliverableCapsule";

// The /about/ worldview block ("why nothing here looks like anything else").
// Owns its own copy, like TenetsCapsule; page-specific by intent, exported here
// so /about/ imports from one place with the rest of its capsules.
export { WorldviewCapsule } from "./WorldviewCapsule";

// The APERTURE BAND: dark band, aurora, a photo out of the right edge, and a
// hole cut through to a viewport-fixed marquee. Extracted from the /rates/
// defense block 2026-08-19 so more than one page can cut the same window.
// Structure is shared; colour and photo live behind a `--variant` class.
export { ApertureBandCapsule } from "./ApertureBandCapsule";

// The /rates/ "in defense of the rate" block. Copy only now: it calls
// ApertureBandCapsule with variant="rate".
export { RateDefenseCapsule } from "./RateDefenseCapsule";

// The calculator hand-off: PackageAssemble beside the pitch + button. On
// /rates/ today, but written page-agnostic so any pricing surface can render it.
export { CalcCtaCapsule } from "./CalcCtaCapsule";
