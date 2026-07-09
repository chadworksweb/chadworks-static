// Route: /rates/ -- standalone page. Value-based pricing with the math
// showing. Real numbers only ($315/hr, $3,200 floor, $6,200 typical, $550
// every 6 months for WordPress care). Signature moment (CWS-CREATIVE-ARSENAL):
// the glass price panel + scanning border + a show-the-math ledger. Copy in
// Chad's public voice, big-ticket posture (never apologize for the number).
// JSON-LD: WebPage + FAQPage + BreadcrumbList.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { PageComposer, RatesCapsule, MainContactCapsule } from "@/components/capsules";

const PAGE_URL = `${SITE_URL}/rates/`;
const TITLE = "Rates: What a chadworks Website Costs | chadworks";
const DESCRIPTION =
  "Work bills at $315 an hour. The smallest engagement is $3,200, and most websites land near $6,200. WordPress care runs $550 every 6 months. The real numbers, on the table before you decide, with the math showing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// --- JSON-LD (GEO checklist 2): WebPage + 2-level BreadcrumbList. ---
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Rates",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: { "@type": "Organization", name: "chadworks", url: SITE_URL },
  // Real, public numbers as a price specification an engine can lift.
  mainEntity: {
    "@type": "Service",
    name: "Website design and development",
    provider: { "@type": "Organization", name: "chadworks", url: SITE_URL },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "315",
        priceCurrency: "USD",
        unitText: "HUR",
      },
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
    },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Rates", item: PAGE_URL },
  ],
};

export default function RatesPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* The shared rates band, with the heading in the standard hero-H1 style. */}
      <RatesCapsule standalone />
      {/* The contact CTA below it. */}
      <MainContactCapsule />
    </PageComposer>
  );
}
