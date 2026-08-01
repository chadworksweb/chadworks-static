// Route: /ai-visibility-audit/ -- a Service page. Thin by design.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import {
  MainContactCapsule,
  NextStepsCapsule,
  PriceCapsule,
  ProcessCapsule,
} from "@/components/capsules";
import { aiVisibilityAudit as service } from "@/lib/services/ai-visibility-audit";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // REQUIRED alongside the launch.ts entry: layout.tsx defaults every route to
  // noindex, so launching without this line puts the page in the sitemap while
  // it still serves noindex. isLaunched takes the bare PATH, never a full URL.
  robots: { index: isLaunched("/ai-visibility-audit/"), follow: true },
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

export default function AiVisibilityAuditPage() {
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        // "How the audit runs" moves onto the global bold timeline, the same
        // treatment /ai-search-visibility/ and /web-design/ use, instead of the
        // default numbered ApproachCapsule grid. Copy still lives in the
        // service's `approach`.
        approach: (
          <ProcessCapsule
            pageName="audit"
            className="cw-process--nested"
            heading={service.approach.heading}
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
        // Same cost module /ai-search-visibility/ runs (PriceCapsule's "rates"
        // variant: argument left, figure in a rates card right, CTA flush in
        // the card's bottom edge). The only difference is the unit -- this one
        // is a single flat fee, so the card carries no "/month".
        price: (
          <PriceCapsule
            price={service.price}
            // This page carries its own form, so the button stays on-page.
            ctaHref="#contact"
            ctaLabel="Inquire"
            variant="rates"
            cardLabel="One time"
            panelClassName="cw-price-card--center"
          />
        ),
        // "If you already know you want more" is off this page (Chad,
        // 2026-08-01). Dropped at the slot, so the copy stays in the service.
        paths: null,
        // "Why it's safe to start" is off this page (Chad, 2026-08-01), dropped
        // at the slot so the copy stays in the service.
        assurance: null,
        // The global contact block closes the page instead of the service CTA +
        // its own form, matching /ai-search-visibility/. It carries id="contact"
        // itself, which is also what the price card's button lands on.
        cta: (
          <MainContactCapsule heading={service.cta.heading} scheme="inverted" />
        ),
        // With the form gone from the CTA slot, "what happens after you reach
        // out" takes the tail slot BELOW the contact block rather than sitting
        // above it.
        nextSteps: null,
        // The lavender-gradient band is the capsule's own default now, so this
        // placement carries no styling of its own.
        afterCta: <NextStepsCapsule nextSteps={service.nextSteps!} />,
      }}
    />
  );
}
