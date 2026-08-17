// Route: /contact/ -- standalone page (4 of 4). The conversion hub: every
// other page's primary CTA points here. Email + form only (phone/booking is
// NEEDS-CHAD 3). Signature: the CF "colorburst" glow orbs on the dark band
// (ContactOrbs) behind the rslgo DualForm (quick <-> detailed). Forms post to
// the central LEIT endpoint (leit.libraengine.com/api/forms/submit?site=chadworks),
// delivered to chad@chadworks.co. Copy in
// Chad's public voice, real facts only. JSON-LD: ContactPage + BreadcrumbList.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { ORG_ID, ref } from "@/lib/jsonld";
import { isLaunched } from "@/lib/launch";
import { PageComposer, MainContactCapsule } from "@/components/capsules";

const PAGE_PATH = "/contact/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const EMAIL = "chad@chadworks.co";
const TITLE = "Contact chadworks | Inquire about websites or visibility";
// Phone pulled from the site 2026-08-17 (Chad). This string also feeds
// public/llms.txt (build-llms reads page metadata), so the number had to come
// out here or it would keep shipping in the generated file. Original:
// "Contacting chadworks is quick and easy. Fill out the form on this page or call 215-872-1240. Talk soon!"
const DESCRIPTION =
  "Contacting chadworks is quick and easy. Fill out the form on this page. Talk soon!";

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
  about: ref(ORG_ID),
  // A REFERENCE, not a second Organization. This used to restate chadworks
  // inline with no @id, which is exactly the fragmentation lib/jsonld.ts was
  // written to prevent -- two "chadworks" org entities on the same page, one
  // of them unlinked. The email, telephone, areaServed and contactPoint that
  // lived here now live once on the canonical node (lib/jsonld.ts).
  mainEntity: ref(ORG_ID),
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
      {/* h1 here and NOWHERE else this capsule is used: /contact/ is the one
          page where the capsule is the entire page, so its heading is the
          page heading. Shipped without one until 2026-07-28. */}
      <MainContactCapsule headingLevel="h1" />
    </PageComposer>
  );
}
