// Route: /web-design/ -- a Service page. Thin by design: import the Service
// data, set metadata from it, render the shared template.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { webDesign as service } from "@/lib/services/web-design";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { ProcessCapsule, PlatformOptionsCapsule, PortfolioShowcaseCapsule, AboutChadCapsule, RatesCapsule, FitCapsule, MainContactCapsule, NextStepsCapsule, TestimonialsCapsule } from "@/components/capsules";
import { PixelDivider } from "@/components/PixelDivider";

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
        // "What clients say" moves down to sit between the FAQs and the contact
        // section (Chad, 2026-07-19): the proof lands last, once the questions
        // are answered and right as the ask arrives.
        //
        // The canonical slot order is fixed, and `assurance` is the only slot
        // between `faq` and `nextSteps`. It is empty on this page anyway (the
        // tenets moved to /about/ on 2026-07-17, Chad's call, and it was held at
        // null so the template could not fall back to the default checklist and
        // put a weaker copy of them back here), so the testimonials ride in it
        // and the real testimonials slot is emptied.
        testimonials: null,
        assurance: (
          <TestimonialsCapsule
            testimonials={service.testimonials!}
            className="cw-wd-testimonials"
          />
        ),
        // Platform Options run as horizontal lanes here (Chad, 2026-07-17). The
        // card grid leaves the fourth platform orphaned on a second row, and
        // these four are a sequence to read down rather than tiles to compare.
        // Per-instance: every other paths section keeps the grid.
        //
        // The pixel divider rides in this slot rather than its own, because the
        // slot order is fixed (paths -> tiers -> proof -> portfolio) and there
        // is no slot between them. The Fragment adds no DOM node, so both stay
        // direct children of the page-shell grid and .cw-pxdiv keeps its
        // `grid-column: full` bleed.
        paths: (
          <>
            <PlatformOptionsCapsule prefix="Web Design" />
            <PixelDivider />
          </>
        ),
        // Swap the light PortfolioCapsule for the full shared showroom (same one
        // the homepage renders).
        portfolio: <PortfolioShowcaseCapsule archiveHeading="Website Design Showcase" />,
        // Use the shared homepage About Chad block, but keep this page's own
        // "professional web designer" photo caption.
        // `cw-wd-made` tightens the top padding ONLY here, closing the gap under
        // the portfolio showcase above it (Chad, 2026-07-19). The class is
        // page-scoped on purpose: the same block renders on the homepage and
        // keeps the standard rhythm there.
        made: (
          <AboutChadCapsule
            captionMain="Don't worry, I'm a professional."
            captionSub="(Web designer.)"
            className="cw-wd-made"
          />
        ),
        // Both slots take the shared homepage bands instead of the
        // page-specific sections, and they are placed CROSSED on purpose
        // (Chad, 2026-07-19): fit reads before rates now, so the page settles
        // whether we should work together before it talks about money. The
        // canonical slot order is [... price, qualification ...] and cannot be
        // reordered per page, so the swap is done by trading contents, the same
        // trick the nextSteps/cta pair below uses.
        price: <FitCapsule />,
        qualification: <RatesCapsule />,
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
