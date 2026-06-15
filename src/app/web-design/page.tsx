// Route: /web-design/ -- a Service page. Thin by design: import the Service
// data, set metadata from it, render the shared template.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { webDesign as service } from "@/lib/services/web-design";
import { serviceUrl } from "@/lib/service";
import { ProcessCapsule, AssuranceCapsule } from "@/components/capsules";

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

export default function WebDesignPage() {
  // Web-design redesign (Chad, 2026-06-13), placed THROUGH the capsule layer:
  //  - the "How I design it" approach steps render as the bold ProcessCapsule
  //    timeline (inverted), replacing the approach slot;
  //  - "Absolute transparency" takes the bold design-step treatment on a
  //    DEFAULT (light) scheme. (scheme split: inverted process, default
  //    transparency -- PageComposer guards rule 9.)
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        approach: (
          <ProcessCapsule
            heading={service.approach.heading}
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
        assurance: (
          <AssuranceCapsule assurance={service.assurance!} variant="design-steps" />
        ),
      }}
    />
  );
}
