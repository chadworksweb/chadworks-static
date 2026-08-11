// Route: /website-design-for-retreats/ -- a Service page in the design
// vertical. Sibling of /website-design-for-events/ and
// /website-design-for-conferences/; the three share one composition.
//
// UNLAUNCHED as of 2026-08-11. The robots line gates on isLaunched, so adding
// the route to LAUNCHED in launch.ts is the only step needed to light it.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { designRetreats as service } from "@/lib/services/design-retreats";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import {
  ProcessCapsule,
  PlatformOptionsCapsule,
  PortfolioShowcaseCapsule,
  AboutChadCapsule,
  RatesCapsule,
  FitCapsule,
} from "@/components/capsules";
import { PixelDivider } from "@/components/PixelDivider";

const PAGE_PATH = "/website-design-for-retreats/";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  robots: { index: isLaunched(PAGE_PATH), follow: true },
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

export default function RetreatsDesignPage() {
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        approach: (
          <ProcessCapsule
            pageName="retreat website design"
            heading={service.approach.heading}
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
        paths: (
          <>
            <PlatformOptionsCapsule prefix="Retreat Website" />
            <PixelDivider />
          </>
        ),
        portfolio: <PortfolioShowcaseCapsule archiveHeading="Website Design Showcase" />,
        made: (
          <AboutChadCapsule
            captionMain="Don't worry, I'm a professional."
            captionSub="(Web designer.)"
          />
        ),
        qualification: <FitCapsule />,
        assurance: <RatesCapsule />,
      }}
    />
  );
}
