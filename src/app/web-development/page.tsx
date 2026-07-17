// Route: /web-development/ -- a Service page. Thin by design: import the
// Service data, set metadata from it, render the shared template. Every
// Service page follows this exact 3-part pattern.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { webDevelopment as service } from "@/lib/services/web-development";
import { webDesign } from "@/lib/services/web-design";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { ProcessCapsule, GemRevealCapsule, PortfolioShowcaseCapsule, RatesCapsule, FitCapsule, MainContactCapsule, NextStepsCapsule } from "@/components/capsules";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  robots: { index: isLaunched("/web-development/"), follow: true },
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

export default function WebDevelopmentPage() {
  // Reuse web-design's "what happens" steps, but swap the design-worded final
  // step for a development-framed one on this page only.
  const whatHappens = {
    ...webDesign.nextSteps!,
    steps: [
      ...webDesign.nextSteps!.steps.slice(0, 3),
      {
        title: "Production",
        body: "You see an actual development website in days. From there, we're in the real build process and your project starts coming to life.",
      },
    ],
  };
  // Render the "How I develop it" approach steps as the bold ProcessCapsule
  // timeline (inverted), the same treatment web-design uses.
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        approach: (
          <ProcessCapsule
            pageName="web development"
            heading={service.approach.heading}
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
        // Definition of web development as an interactive hint-reveal over the
        // spinning CW gem, between the process and the build options.
        explainer: <GemRevealCapsule />,
        // Swap the light ripple portfolio for the full shared showroom (same one
        // the homepage and web-design render).
        portfolio: <PortfolioShowcaseCapsule archiveHeading="Website Development Showcase" />,
        // Drop the page-specific price section here; the rates band renders later
        // (in the assurance slot) so it lands between the FAQ and the contact CTA.
        price: null,
        // Swap "Is this the right fit?" for the shared "Are We A Good Fit?".
        qualification: <FitCapsule />,
        // Rates band, placed between the FAQ and the contact CTA (this slot sits
        // right there in the canonical order). Replaces the dropped assurance.
        assurance: <RatesCapsule />,
        // Reorder the tail: render the contact CTA FIRST (in the earlier
        // nextSteps slot), then "What happens after you reach out" AFTER it (in
        // the cta slot). This also drops the page's "Not sure which way to
        // build?" CTA, replaced by the shared contact section.
        nextSteps: <MainContactCapsule />,
        cta: <NextStepsCapsule nextSteps={whatHappens} className="cw-webdev-nextsteps" />,
      }}
    />
  );
}
