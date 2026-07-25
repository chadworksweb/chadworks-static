// Route: /ai-search-visibility/ -- a Service page. Thin by design.
// The one non-default slot: `afterHero` carries the query-shaped breakdown
// section (the ChatGPT questions buyers actually ask), placed between the hero
// and the key facts.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { aiSearchVisibility as service } from "@/lib/services/ai-search-visibility";
import {
  AiSearchFacetsCapsule,
  AiDemoSplitCapsule,
  ProblemCapsule,
} from "@/components/capsules";
import { serviceUrl } from "@/lib/service";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
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

export default function AiSearchVisibilityPage() {
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        // The chat mock runs SECOND, straight under the hero: the argument is
        // easier to show than to state. It moved up from the problem section,
        // so `problemArt` is dropped rather than rendering the same demo twice.
        demo: <AiDemoSplitCapsule />,
        afterHero: <AiSearchFacetsCapsule />,
        // Ribbon triad rotated one step on this page: same three brand hues,
        // moved round to the next path each.
        problem: <ProblemCapsule problem={service.problem} ribbonRotate={1} />,
        problemArt: null,
      }}
    />
  );
}
