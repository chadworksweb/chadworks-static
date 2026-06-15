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

import { Fragment, type ReactNode } from "react";
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
  | "keyFacts"
  | "problem"
  | "problemArt"
  | "approach"
  | "paths"
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
  // Rule 9: the CTA is always dark, so the FAQ takes its dark treatment ONLY
  // when a light section (assurance / next-steps) sits between it and the CTA.
  const faqDark = Boolean(s.assurance || s.nextSteps);

  // Default node per slot (null when the optional section is absent).
  const defaults: Record<ServiceSlot, ReactNode> = {
    hero: (
      <HeroCapsule
        lane={s.lane}
        laneLabel={s.laneLabel}
        title={s.title}
        titleNode={s.titleNode}
        eyebrow={s.eyebrow}
        answer={s.answer}
        heroArt={s.heroArt}
        cta={{ href: s.cta.href, buttonLabel: s.cta.buttonLabel }}
      />
    ),
    keyFacts: (
      <KeyFactsCapsule
        heading={s.keyFactsHeading}
        facts={s.keyFacts}
        outlierFacts={s.outlierFacts}
      />
    ),
    problem: <ProblemCapsule problem={s.problem} />,
    problemArt: s.problemArt ? (
      <ProblemArtCapsule>{s.problemArt}</ProblemArtCapsule>
    ) : null,
    approach: <ApproachCapsule approach={s.approach} />,
    paths: s.paths ? <PathsCapsule paths={s.paths} /> : null,
    proof: <ProofCapsule proof={s.proof} />,
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
    faq: <FaqCapsule faqs={s.faqs} faqLead={s.faqLead} dark={faqDark} />,
    assurance: s.assurance ? <AssuranceCapsule assurance={s.assurance} /> : null,
    nextSteps: s.nextSteps ? <NextStepsCapsule nextSteps={s.nextSteps} /> : null,
    cta: <CtaCapsule cta={s.cta} form={s.form} />,
  };

  const order: ServiceSlot[] = [
    "hero",
    "keyFacts",
    "problem",
    "problemArt",
    "approach",
    "paths",
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

  return (
    <PageComposer
      jsonLd={[
        buildBreadcrumbJsonLd(s),
        buildServiceJsonLd(s),
        buildFaqJsonLd(s),
      ]}
    >
      {order.map((slot) => {
        // An override key present in the map wins (including an explicit null,
        // which drops the slot). Otherwise use the default node. Rendered in a
        // keyed Fragment so no extra DOM node breaks the main > .section grid.
        const node = slot in overrides ? overrides[slot] : defaults[slot];
        return node ? <Fragment key={slot}>{node}</Fragment> : null;
      })}
    </PageComposer>
  );
}
