// Route: /my-industry-specialties/ -- the INDUSTRY index (specialized web design
// by trade). Successor to the old chadworks /my-industry-specialties/ page.
// Industry only; locations live separately at /my-service-areas/. A compact card
// grid, not a long list.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { IndexGrid, type IndexItem } from "@/components/IndexGrid";

const PATH = "/my-industry-specialties/";
const TITLE = "Industry Web Design";

const INDUSTRIES: IndexItem[] = [
  { name: "Septic Services", desc: "Pumping, repair, emergency", href: "/website-design-for-septic-services/" },
  { name: "Foundation Repair", desc: "Waterproofing, crawl space", href: "/website-design-for-foundation-repair/" },
  { name: "Tree Companies", desc: "Removal, storm response", href: "/website-design-for-tree-companies/" },
  { name: "Bands & Musicians", desc: "Tours, EPK, merch", href: "/website-design-for-bands-musicians/" },
  { name: "Authors", desc: "Launches, mailing list", href: "/web-design-for-authors/" },
  { name: "Music Industry", desc: "Labels, studios, managers", href: "/music-industry-web-design/" },
  { name: "PA Preferred Members", desc: "PA-grown, PA-made", href: "/web-design-for-pa-preferred-members/" },
];

export const metadata: Metadata = {
  title: "Web Design by Industry | chadworks",
  description:
    "Websites built for the way one trade actually wins customers. Industry-specific web design for septic, foundation repair, tree services, musicians, authors, the music business, and PA Preferred members. Each one is conversion-focused, server-rendered, and schema-rich.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: "Web Design by Industry | chadworks",
    description:
      "Industry-specific web design: a site built around how one trade actually wins customers, not a generic template.",
    url: `${SITE_URL}${PATH}`,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: TITLE, item: `${SITE_URL}${PATH}` },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${TITLE} by Industry`,
  url: `${SITE_URL}${PATH}`,
  hasPart: INDUSTRIES.map((i) => ({
    "@type": "WebPage",
    name: i.name,
    url: `${SITE_URL}${i.href}`,
  })),
};

export default function IndustrySpecialtiesPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, collectionJsonLd]}>
      <IndexGrid
        eyebrow="Specialized by trade"
        title="Web design built for your industry."
        lede="I build the whole site around how one trade actually wins customers, not a generic business template stretched to fit. Pick your industry below. Do not see yours? I build for far more than this, so just reach out."
        items={INDUSTRIES}
      />
    </PageComposer>
  );
}
