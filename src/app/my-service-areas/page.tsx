// Route: /my-service-areas/ -- the LOCATION index (local PA web design by town).
// Successor to the old chadworks /my-service-areas/ page. Locations only;
// industries live separately at /industries-served/. A compact card grid.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { IndexGrid, type IndexItem } from "@/components/IndexGrid";

const PATH = "/my-service-areas/";
const TITLE = "Service Areas";

const AREAS: IndexItem[] = [
  { name: "Norristown, PA", desc: "Montgomery County", href: "/website-design-for-norristown-pa/" },
  { name: "Ambler, PA", desc: "Montgomery County", href: "/website-design-for-ambler-pa/" },
  { name: "Lansdale, PA", desc: "Montgomery County", href: "/website-design-for-lansdale-pa/" },
  { name: "Conshohocken, PA", desc: "Montgomery County", href: "/website-design-for-conshohocken-pa/" },
  { name: "Collegeville, PA", desc: "Montgomery County", href: "/website-design-for-collegeville-pa/" },
  { name: "Pottstown, PA", desc: "Montgomery County", href: "/website-design-for-pottstown-pa/" },
  { name: "Doylestown, PA", desc: "Bucks County", href: "/website-design-for-doylestown-pa/" },
  { name: "Phoenixville, PA", desc: "Chester County", href: "/website-design-for-phoenixville-pa/" },
  { name: "Lancaster, PA", desc: "Lancaster County", href: "/website-design-for-lancaster-pa/" },
];

export const metadata: Metadata = {
  title: `${TITLE}: Local Web Design Across Pennsylvania | chadworks`,
  description:
    "Local web design for Pennsylvania towns: Norristown, Ambler, Lansdale, Conshohocken, Collegeville, Pottstown, Doylestown, Phoenixville, and Lancaster. Built to rank in local search for your town, and remote-friendly anywhere from a base in Greater Philadelphia.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: `${TITLE}: Local Web Design Across Pennsylvania | chadworks`,
    description:
      "Local web design built to rank for your Pennsylvania town. Greater Philadelphia based, remote-friendly.",
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
  name: `${TITLE}: Local Web Design Across Pennsylvania`,
  url: `${SITE_URL}${PATH}`,
  hasPart: AREAS.map((a) => ({
    "@type": "WebPage",
    name: a.name,
    url: `${SITE_URL}${a.href}`,
  })),
};

export default function ServiceAreasPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, collectionJsonLd]}>
      <IndexGrid
        eyebrow="Local, across Pennsylvania"
        title="Web design for your Pennsylvania town."
        lede="A site built to rank in local search for the town you actually serve, with the local detail Google and the AI assistants reward. I am based in Greater Philadelphia and work remotely too, so the town below is a starting point, not a fence."
        items={AREAS}
      />
    </PageComposer>
  );
}
