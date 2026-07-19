// Route: /website-redesign/ -- a Service page (Websites lane). Thin by design:
// import the Service data, set metadata from it, render the shared template
// through the capsule layer. Mirrors the /web-design/ composition (its sibling
// on the design side), tailored to the REDESIGN context: the buyer already has
// a site and wants it torn down and rebuilt, not refreshed and not migrated.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { websiteRedesign as service } from "@/lib/services/website-redesign";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { ProcessCapsule, AssuranceCapsule, PortfolioShowcaseCapsule, AboutChadCapsule, RatesCapsule, FitCapsule, MainContactCapsule, NextStepsCapsule } from "@/components/capsules";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // Launch-driven: indexed only while launched (see launch.ts). Sealed until
  // added to LAUNCHED, so it serves noindex and stays out of the sitemap.
  robots: { index: isLaunched("/website-redesign/"), follow: true },
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

export default function WebsiteRedesignPage() {
  // Same capsule arrangement as /web-design/ (its design-side sibling):
  //  - the redesign process renders as the bold ProcessCapsule timeline;
  //  - the transparency tenets take the tenets treatment;
  //  - the shared showroom, About Chad, rates, and fit blocks slot in;
  //  - the contact section renders first (nextSteps slot) and "what happens
  //    after" renders after it (cta slot), matching web-design's tail order.
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        approach: (
          <ProcessCapsule
            pageName="website redesign"
            heading={service.approach.heading}
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
        assurance: (
          <AssuranceCapsule assurance={service.assurance!} variant="tenets" />
        ),
        // Swap the light PortfolioCapsule for the full shared showroom.
        portfolio: <PortfolioShowcaseCapsule archiveHeading="Website Redesign Showcase" />,
        // Shared homepage About Chad block, with a redesign-flavored caption
        // that carries the no-upsell honesty (I'll tell you if you only need a
        // refresh).
        made: (
          <AboutChadCapsule
            captionMain="Don't worry, I'll tell you if you don't need one."
            captionSub="(A redesign, that is.)"
          />
        ),
        // Shared homepage rates band in place of the page-specific price section.
        price: <RatesCapsule />,
        // Shared homepage "Who I Work With" in place of a page-specific fit block.
        qualification: <FitCapsule />,
        // Contact/CTA + "what happens after" get reordered: contact renders
        // first (earlier nextSteps slot), NextSteps after it (cta slot).
        nextSteps: <MainContactCapsule />,
        cta: <NextStepsCapsule nextSteps={service.nextSteps!} />,
      }}
    />
  );
}
