// Route: /showroom/ -- the new immersive portfolio (Track A), built alongside the
// live /portfolio/ page so it can iterate without touching production. Swaps in
// once it holds. Noindex by default (see layout.tsx) while in development; the
// crawlable ItemList below keeps structure for when it goes live.

import type { Metadata } from "next";
import { SITE_URL, ORG } from "@/lib/service";
import { PortfolioShowroom } from "@/components/showroom/PortfolioShowroom";
import { SHOWROOM_ITEMS } from "@/components/showroom/showroom-data";

const PAGE_URL = `${SITE_URL}/showroom/`;

export const metadata: Metadata = {
  title: "Showroom | chadworks",
  description:
    "The chadworks portfolio showroom: real client sites, shown one at a time in a full-screen cinematic slider.",
  alternates: { canonical: PAGE_URL },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "chadworks portfolio showroom",
  url: PAGE_URL,
  provider: { "@type": "Organization", name: ORG.name, url: ORG.url },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: SHOWROOM_ITEMS.length,
    itemListElement: SHOWROOM_ITEMS.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "WebSite",
        name: w.label,
        url: w.href,
        image: `${SITE_URL}/portfolio/${w.slug}-desktop.jpg`,
      },
    })),
  },
};

export default function ShowroomPage() {
  return (
    <div className="full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <PortfolioShowroom />
    </div>
  );
}
