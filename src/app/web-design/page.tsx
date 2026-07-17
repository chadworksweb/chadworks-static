// Route: /web-design/ -- a Service page. Thin by design: import the Service
// data, set metadata from it, render the shared template.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { webDesign as service } from "@/lib/services/web-design";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { ProcessCapsule, PortfolioShowcaseCapsule, AboutChadCapsule, RatesCapsule, FitCapsule, MainContactCapsule, NextStepsCapsule } from "@/components/capsules";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // Launch-driven: indexed only while launched (see launch.ts).
  robots: { index: isLaunched("/web-design/"), follow: true },
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
            pageName="web design"
            heading={service.approach.heading}
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
        // The tenets moved to /about/ on 2026-07-17 (Chad's call): they are
        // about how chadworks operates, not how a website gets designed. Held
        // to null so the template does not fall back to the default checklist
        // variant, which would put a weaker copy of them back on this page.
        assurance: null,
        // Swap the light PortfolioCapsule for the full shared showroom (same one
        // the homepage renders).
        portfolio: <PortfolioShowcaseCapsule archiveHeading="Website Design Showcase" />,
        // Use the shared homepage About Chad block, but keep this page's own
        // "professional web designer" photo caption.
        made: (
          <AboutChadCapsule
            captionMain="Don't worry, I'm a professional."
            captionSub="(Web designer.)"
          />
        ),
        // Swap the page-specific price section for the shared homepage rates band.
        price: <RatesCapsule />,
        // Swap the page-specific fit section for the shared homepage one.
        qualification: <FitCapsule />,
        // Contact/CTA + "what happens after" get reordered here. The canonical
        // slot order is [... nextSteps, cta], so to render the contact section
        // FIRST and "what happens after" AFTER it, we place the shared homepage
        // contact into the earlier nextSteps slot and NextSteps into the cta slot.
        nextSteps: <MainContactCapsule />,
        cta: <NextStepsCapsule nextSteps={service.nextSteps!} />,
      }}
    />
  );
}
