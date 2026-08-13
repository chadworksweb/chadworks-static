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
  | "afterPrice"
  | "qualification"
  | "faq"
  | "assurance"
  | "nextSteps"
  | "cta"
  | "afterCta";

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
        // Only meaningful alongside a first button, and HeroCapsule already
        // renders it inside the `cta &&` block, so a page that sets this
        // without a heroCta simply gets nothing rather than a lone ghost.
        ctaSecondary={s.heroCtaSecondary}
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
    // "Proof, not promises" is OFF SITEWIDE (Chad, 2026-08-01). Killed at the
    // slot, the same way /ai-search-visibility/ dropped it individually, so the
    // 25 services keep their `proof` copy in their own files and turning the
    // section back on is a one-line change here. A page that wants a proof
    // block anyway passes `overrides.proof` (nothing does today); /about/ still
    // renders ProofCapsule directly for its own "Notable Achievements".
    proof: null,
    portfolio: s.portfolio ? (
      <PortfolioCapsule portfolio={s.portfolio} slug={s.slug} />
    ) : null,
    testimonials: s.testimonials ? (
      <TestimonialsCapsule testimonials={s.testimonials} />
    ) : null,
    made: s.made ? <MadeByCapsule made={s.made} /> : null,
    price: <PriceCapsule price={s.price} ctaHref={s.cta.href} />,
    // Optional interstitial between the price and the qualification block, for
    // a section that belongs to the money conversation but is not the number
    // (e.g. what the engagement asks of the CLIENT). No Service field feeds it;
    // a page opts in via `overrides.afterPrice`, the pattern `afterHero` and
    // `explainer` already use.
    afterPrice: null,
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
    // Optional tail section, BELOW the CTA. For a page that wants "what happens
    // after you reach out" to follow the ask rather than precede it, while the
    // CTA slot keeps the real form. (web-design gets the same order by swapping
    // its nextSteps and cta slots; that trick is unavailable to a page whose CTA
    // carries the form.) Opt in via `overrides.afterCta`.
    afterCta: null,
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
    "afterPrice",
    "qualification",
    "faq",
    "assurance",
    "nextSteps",
    "cta",
    "afterCta",
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
