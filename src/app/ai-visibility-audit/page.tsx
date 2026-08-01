// Route: /ai-visibility-audit/ -- a Service page. Thin by design.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { CtaCapsule, PriceCapsule } from "@/components/capsules";
import { aiVisibilityAudit as service } from "@/lib/services/ai-visibility-audit";
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

export default function AiVisibilityAuditPage() {
  return (
    <ServiceTemplate
      service={service}
      overrides={{
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
          />
        ),
        // The default CTA slot ships without an anchor, so the price button's
        // "#contact" had nowhere to land. Same capsule, same form, just carrying
        // the id (the hook MainContactCapsule provides on pages that use it).
        cta: (
          <CtaCapsule
            cta={service.cta}
            form={service.form}
            id="contact"
            scheme="inverted"
          />
        ),
      }}
    />
  );
}
