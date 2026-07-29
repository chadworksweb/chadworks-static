// =====================================================================
// chadworks Static -- composeService(s, overrides)
// Builds the canonical ordered capsule list from a Service, wrapped in
// <PageComposer> with the page-level JSON-LD. This is the default composition
// every service page renders. A page can pass `overrides` to REPLACE or DROP a
// capsule slot without forking the template (e.g. web-design swaps the
// `approach` slot for <ProcessCapsule/>); pass `null` to drop a slot.
//
// Phase B: byte-stable with no overrides -- the capsule order + markup match
// the pre-refactor ServiceTemplate exactly. Phase C moves the rule-9 faqDark
// decision into PageComposer.
// =====================================================================

import { Fragment, cloneElement, isValidElement, type ReactNode } from "react";
import {
  type Service,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import {
  HeroCapsule,
  KeyFactsCapsule,
  ProblemCapsule,
  ProblemArtCapsule,
  ApproachCapsule,
  PathsCapsule,
  TiersCapsule,
  ProofCapsule,
  PortfolioCapsule,
  TestimonialsCapsule,
  MadeByCapsule,
  PriceCapsule,
  QualificationCapsule,
  FaqCapsule,
  AssuranceCapsule,
  NextStepsCapsule,
  CtaCapsule,
} from "@/components/capsules";

// The capsule slots, in canonical render order. An override value REPLACES the
// slot's node; `null` DROPS it.
export type ServiceSlot =
  | "hero"
  | "demo"
  | "afterHero"
  | "keyFacts"
  | "problem"
  | "problemArt"
  | "approach"
  | "explainer"
  | "paths"
  | "tiers"
  | "proof"
  | "portfolio"
  | "testimonials"
  | "made"
  | "price"
  | "qualification"
  | "faq"
  | "assurance"
  | "nextSteps"
  | "cta";

export type ServiceOverrides = Partial<Record<ServiceSlot, ReactNode | null>>;

export function composeService(s: Service, overrides: ServiceOverrides = {}) {
  // Rule 9 is no longer decided here: each dark capsule declares its `scheme`
  // and PageComposer runs the scheme-adjacency pass. The FAQ prefers the dark
  // band (scheme="inverted") but is `schemeAuto`, so PageComposer demotes it to
  // light when the next present section (the dark CTA) is also inverted.

  // Default node per slot (null when the optional section is absent).
  const defaults: Record<ServiceSlot, ReactNode> = {
    hero: (
      <HeroCapsule
        lane={s.lane}
        laneLabel={s.laneLabel}
        crumbs={
          s.breadcrumbParent
            ? [
                { label: "Home", href: "/" },
                { label: s.breadcrumbParent.label, href: s.breadcrumbParent.href },
                { label: s.title },
              ]
            : undefined
        }
        title={s.title}
        titleNode={s.titleNode}
        eyebrow={s.eyebrow}
        eyebrowNode={s.eyebrowNode}
        answer={s.answer}
        heroArt={s.heroArt}
        // Explicit null means the page wants NO hero button; undefined means it
        // never asked, so the hero mirrors the contact CTA.
        cta={
          s.heroCta === null
            ? undefined
            : s.heroCta ?? { href: s.cta.href, buttonLabel: s.cta.buttonLabel }
        }
      />
    ),
    // Optional demonstration slot, the FIRST thing under the hero. For a page
    // whose argument is easier to show than to state (the AI chat mock on
    // /ai-search-visibility/). Opt in via `overrides.demo`.
    demo: null,
    // Optional interstitial between the hero and the key facts. No Service
    // field feeds it; a page opts in via `overrides.afterHero` (the pattern
    // `explainer` already uses further down the order).
    afterHero: null,
    keyFacts: (
      <KeyFactsCapsule
        heading={s.keyFactsHeading}
        facts={s.keyFacts}
        outlierFacts={s.outlierFacts}
        introClassName={s.keyFactsIntroClassName}
      />
    ),
    problem: <ProblemCapsule problem={s.problem} />,
    problemArt: s.problemArt ? (
      <ProblemArtCapsule>{s.problemArt}</ProblemArtCapsule>
    ) : null,
    approach: <ApproachCapsule approach={s.approach} scheme="inverted" />,
    // Optional interstitial section between the approach and the build-options
    // funnel. No Service field feeds it; a page opts in via `overrides.explainer`.
    explainer: null,
    paths: s.paths ? <PathsCapsule paths={s.paths} /> : null,
    tiers: s.tiers ? <TiersCapsule tiers={s.tiers} /> : null,
    proof: s.proof ? <ProofCapsule proof={s.proof} /> : null,
    portfolio: s.portfolio ? (
      <PortfolioCapsule portfolio={s.portfolio} slug={s.slug} />
    ) : null,
    testimonials: s.testimonials ? (
      <TestimonialsCapsule testimonials={s.testimonials} />
    ) : null,
    made: s.made ? <MadeByCapsule made={s.made} /> : null,
    price: <PriceCapsule price={s.price} ctaHref={s.cta.href} />,
    qualification: s.qualification ? (
      <QualificationCapsule qualification={s.qualification} />
    ) : null,
    faq: (
      <FaqCapsule
        faqs={s.faqs}
        faqLead={s.faqLead}
        pageName={s.title}
        scheme="inverted"
        schemeAuto
      />
    ),
    assurance: s.assurance ? <AssuranceCapsule assurance={s.assurance} /> : null,
    nextSteps: s.nextSteps ? <NextStepsCapsule nextSteps={s.nextSteps} /> : null,
    cta: <CtaCapsule cta={s.cta} form={s.form} scheme="inverted" />,
  };

  const order: ServiceSlot[] = [
    "hero",
    "demo",
    "afterHero",
    "keyFacts",
    "problem",
    "problemArt",
    "approach",
    "explainer",
    "paths",
    "tiers",
    "proof",
    "portfolio",
    "testimonials",
    "made",
    "price",
    "qualification",
    "faq",
    "assurance",
    "nextSteps",
    "cta",
  ];

  // Flat list of placed capsule elements, each keyed by slot. Passed directly
  // (not wrapped in Fragments) so PageComposer's rule-9 pass sees every capsule
  // as a direct child and no extra DOM node breaks the main > .section grid.
  const placed = order
    .map((slot) => {
      // An override key present in the map wins (including an explicit null,
      // which drops the slot). Otherwise use the default node.
      const node = slot in overrides ? overrides[slot] : defaults[slot];
      return node && isValidElement(node)
        ? cloneElement(node, { key: slot })
        : node
          ? <Fragment key={slot}>{node}</Fragment>
          : null;
    })
    .filter(Boolean);

  return (
    <PageComposer
      jsonLd={[
        buildBreadcrumbJsonLd(s),
        buildServiceJsonLd(s),
        buildFaqJsonLd(s),
      ]}
    >
      {placed}
    </PageComposer>
  );
}
