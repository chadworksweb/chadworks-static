// Route: /contact/ -- standalone page (4 of 4). The conversion hub: every
// other page's primary CTA points here. Email + form only (phone/booking is
// NEEDS-CHAD 3). Signature: the CF "colorburst" glow orbs on the dark band
// (ContactOrbs) behind the rslgo DualForm (quick <-> detailed). Forms post to
// the central LEIT endpoint (leit.libraengine.com/api/forms/submit?site=chadworks),
// delivered to chad@chadworks.co. Copy in
// Chad's public voice, real facts only. JSON-LD: ContactPage + BreadcrumbList.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { PageComposer, MainContactCapsule } from "@/components/capsules";

const PAGE_PATH = "/contact/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const EMAIL = "chad@chadworks.co";
const TITLE = "Contact chadworks | Talk to the Person Who Builds It";
const DESCRIPTION =
  "Get in touch with chadworks. Email chad@chadworks.co or send the form, and it reaches Chad Lewine directly, the person who designs the site and writes the code. Honest read within a day.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: isLaunched(PAGE_PATH), follow: true },
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

// --- JSON-LD (GEO checklist 2): ContactPage + 2-level BreadcrumbList. ---
const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: { "@type": "Organization", name: "chadworks", url: SITE_URL },
  mainEntity: {
    "@type": "Organization",
    name: "chadworks",
    url: SITE_URL,
    email: EMAIL,
    areaServed: "US",
    founder: { "@type": "Person", name: "Chad Lewine" },
    contactPoint: {
      "@type": "ContactPoint",
      email: EMAIL,
      contactType: "sales",
      availableLanguage: "English",
    },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Contact", item: PAGE_URL },
  ],
};

export default function ContactPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, contactPageJsonLd]}>
      <MainContactCapsule />
    </PageComposer>
  );
}
