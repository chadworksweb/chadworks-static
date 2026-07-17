// Route: /vision-strategy-roadmap/ -- the V/S/R, first service in Lane 03
// (Consulting). Renders the Service template with overrides.
//
// NOT LAUNCHED, on purpose (Chad, 2026-07-16). The route is absent from
// src/lib/launch.ts, so it is noindex, out of the sitemap, and dimmed behind the
// footer overlay. `robots.index` reads isLaunched(), so adding the route to
// LAUNCHED is the only edit needed to light it up. Before launching, read the
// gates in CWS-VSR-SERVICE.md -- there is no /consulting/ lane hub yet and this
// page's breadcrumb points at one.
//
// This page deliberately breaks the default composition (Chad: "this page can
// break the typical format, but dont get lazy with it... use the chadlewine SSA
// page as the structural and UI foundation"). The section sequence traces the
// Sovereignty Audit page on chadlewine; the capsules were REBUILT on CWS tokens
// rather than ported, because none of the SI Night CSS exists in this codebase
// and porting it would have forked the design system. Going through
// composeService (instead of writing a bespoke page) keeps the Service data
// contract and the GEO spine: Service + FAQPage + BreadcrumbList JSON-LD still
// emit from PageComposer, which a hand-rolled page would have dropped.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import {
  visionStrategyRoadmap as service,
  vsrRule,
  vsrWhatItIs,
  vsrVerbatim,
  vsrDeliverable,
} from "@/lib/services/vision-strategy-roadmap";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import {
  ActsCapsule,
  RuleCapsule,
  SplitChecklistCapsule,
  VerbatimCapsule,
  DeliverableCapsule,
  PathsCapsule,
} from "@/components/capsules";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // Launch-driven: indexed only once the route is in launch.ts. False today.
  robots: { index: isLaunched("/vision-strategy-roadmap/"), follow: true },
  openGraph: {
    title: service.meta.title,
    description: service.meta.description,
    url: serviceUrl(service),
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: service.meta.title,
    description: service.meta.description,
    images: ["/og-default.png"],
  },
};

export default function VisionStrategyRoadmapPage() {
  // SLOT MAP. The canonical order is [hero, keyFacts, problem, problemArt,
  // approach, explainer, paths, tiers, proof, portfolio, testimonials, made,
  // price, qualification, faq, assurance, nextSteps, cta], so the placements
  // below read top-to-bottom as the page reads. Two slots carry something other
  // than their name (the same reorder trick web-design uses):
  //   paths     -> "What guided vision building is" (the real paths funnel is
  //                pushed to nextSteps, so it lands AFTER the FAQ where an
  //                onward link belongs on a page whose selling point is that it
  //                ends)
  //   portfolio -> the deliverable (this page's "portfolio" IS the document)
  //
  // SSA trace: hero -> the movements -> the one rule -> what it is -> what you
  // leave with -> the rate -> who it is for -> close.
  //
  // RULE 9 (no two consecutive darks). The darks here are Acts, Verbatim, the
  // FAQ (auto) and the CTA. Acts is followed by the light RuleCapsule, and
  // Verbatim by the light ProofCapsule, so both fixed darks are separated. The
  // FAQ is schemeAuto and its next present section is the light paths funnel, so
  // it keeps its dark band and the CTA's dark still stands alone.
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        // The movements. Not the default approach grid: these are named
        // movements with a `kind`, they run in order but not on a clock, and the
        // Gate can end the engagement before movement one.
        approach: (
          <ActsCapsule
            heading={service.approach.heading}
            acts={service.approach.steps}
            scheme="inverted"
            cta={{ href: "/contact/", label: "Start a V/S/R" }}
          />
        ),
        // THE ONE RULE, immediately after the movements, exactly where the SSA
        // page puts it. This is the differentiator and the trust argument.
        explainer: <RuleCapsule {...vsrRule} />,
        paths: <SplitChecklistCapsule {...vsrWhatItIs} />,
        // Real client sentences, verbatim and anonymized. The proof that the
        // method extracts rather than imposes.
        tiers: <VerbatimCapsule {...vsrVerbatim} scheme="inverted" />,
        // proof: default ProofCapsule (it has been run, and delivered).
        portfolio: <DeliverableCapsule {...vsrDeliverable} />,
        testimonials: null,
        made: null,
        // price: default PriceCapsule, carrying the real $3,250 figure.
        // qualification / faq: default.
        nextSteps: <PathsCapsule paths={service.paths!} />,
        // cta: default CtaCapsule, which mounts service.form in its right half.
      }}
    />
  );
}
