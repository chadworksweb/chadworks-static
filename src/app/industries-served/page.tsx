// Route: /industries-served/ -- the INDUSTRY index (web design by trade).
// Successor to the old chadworks /my-industry-specialties/ page. Industry only.
// There is no location index: the geo pages (/my-service-areas/ and the nine
// PA town pages) were REMOVED 2026-07-28 -- chadworks targets by ambition, not
// location. Do not re-add a location axis here. A compact card grid, not a
// long list. The full roster is listed; an industry without a launched page
// renders sealed (dim, non-clickable) via IndexGrid's isLaunched gating.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { IndexGrid, type IndexItem } from "@/components/IndexGrid";
import { isLaunched } from "@/lib/launch";

const PATH = "/industries-served/";
const TITLE = "Industries Served";

// The full niche roster (from marketing/niche-pipeline.md). Septic + foundation
// are launched and link out; every other row renders sealed (dim, non-clickable)
// via IndexGrid's isLaunched gating and lights up the moment its page ships.
const INDUSTRIES: IndexItem[] = [
  // Specialized design verticals
  { name: "Septic Services", desc: "Pumping, repair, emergency", href: "/website-design-for-septic-services/" },
  { name: "Foundation Repair", desc: "Waterproofing, crawl space", href: "/website-design-for-foundation-repair/" },
  { name: "Tree Companies", desc: "Removal, storm response", href: "/website-design-for-tree-companies/" },
  { name: "Bands & Musicians", desc: "Tours, EPK, merch", href: "/website-design-for-bands-musicians/" },
  { name: "Authors", desc: "Launches, mailing list", href: "/web-design-for-authors/" },
  { name: "Music Industry", desc: "Labels, studios, managers", href: "/music-industry-web-design/" },
  // Real-world experiences (added 2026-08-11): three siblings that share one
  // composition. Each sells a date rather than a service call.
  { name: "5K Races", desc: "Flat-rate race sites", href: "/website-design-for-5k-races/" },
  { name: "Conferences", desc: "Industry cons to comic cons", href: "/website-design-for-conferences/" },
  { name: "Retreats", desc: "Cohorts, deposits, travel", href: "/website-design-for-retreats/" },
  // Trades
  { name: "Chimney Sweep", desc: "Cleaning, repair", href: "/website-design-for-chimney-sweep/" },
  { name: "Excavation", desc: "Land clearing", href: "/website-design-for-excavation/" },
  { name: "Masonry & Hardscaping", desc: "Stone, brick, pavers", href: "/website-design-for-masonry/" },
  { name: "Pole Barn Builders", desc: "Custom outbuildings", href: "/website-design-for-pole-barn-builders/" },
  { name: "Stamped Concrete", desc: "Patios, driveways", href: "/website-design-for-stamped-concrete/" },
  { name: "Generator Installers", desc: "Whole-home standby", href: "/website-design-for-generator-installers/" },
  { name: "Holiday Lighting", desc: "Install, takedown", href: "/website-design-for-holiday-lighting/" },
  { name: "Radon Mitigation", desc: "Real-estate driven", href: "/website-design-for-radon-mitigation/" },
  { name: "Oil Tank Removal", desc: "Soil remediation", href: "/website-design-for-oil-tank-removal/" },
  { name: "French Drain", desc: "Yard drainage", href: "/website-design-for-french-drain/" },
  { name: "Wildlife Removal", desc: "Bats, raccoons, squirrels", href: "/website-design-for-wildlife-removal/" },
  { name: "Concrete Leveling", desc: "Mudjacking, polyjacking", href: "/website-design-for-concrete-leveling/" },
  { name: "Custom Shed Builders", desc: "Sheds, barns, outbuildings", href: "/website-design-for-custom-shed-builders/" },
  { name: "Sealcoating & Asphalt", desc: "Driveways and lots", href: "/website-design-for-sealcoating/" },
  { name: "Fence Installation", desc: "Wood and vinyl", href: "/website-design-for-fence-installation/" },
  { name: "Junk Removal", desc: "Hauling and cleanout", href: "/website-design-for-junk-removal/" },
  { name: "Mold & Water Damage", desc: "Remediation and restoration", href: "/website-design-for-mold-remediation/" },
  { name: "Hardwood Floors", desc: "Refinish and restore", href: "/website-design-for-hardwood-floor-refinishing/" },
  // Professional / soft-skill services
  { name: "Fractional CFO", desc: "B2B finance leadership", href: "/website-design-for-fractional-cfo/" },
  { name: "Executive Coaches", desc: "ICF PCC / MCC", href: "/website-design-for-executive-coaches/" },
  { name: "M&A Advisors", desc: "Lower-middle-market", href: "/website-design-for-ma-advisors/" },
  { name: "Exit Planning", desc: "CEPA succession", href: "/website-design-for-exit-planning/" },
  { name: "Elder Law", desc: "Special needs trusts", href: "/website-design-for-elder-law/" },
  { name: "Educational Consultants", desc: "Admissions, placement", href: "/website-design-for-educational-consultants/" },
  { name: "Pelvic Floor PT", desc: "Cash-pay specialty", href: "/website-design-for-pelvic-floor-pt/" },
  { name: "Functional Medicine", desc: "Cash-pay practitioners", href: "/website-design-for-functional-medicine/" },
  { name: "Divorce Mediators", desc: "Co-parenting coordination", href: "/website-design-for-divorce-mediators/" },
  { name: "Fee-Only Planners", desc: "Specialty financial advice", href: "/website-design-for-fee-only-planners/" },
  // Wildcard
  { name: "Crazy Ideas", desc: "Inventors, experimentalists", href: "/website-design-for-crazy-ideas/" },
];

export const metadata: Metadata = {
  title: "Industries Served by chadworks Web Design",
  description:
    "chadworks builds websites based on an industry's unique aspects. This page holds a list of a selection of industries served.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: isLaunched(PATH), follow: true },
  openGraph: {
    title: "Industries Served by chadworks Web Design",
    description:
      "chadworks builds websites based on an industry's unique aspects. This page holds a list of a selection of industries served.",
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

// Only advertise indexable (launched) industry pages in the collection schema.
const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: TITLE,
  url: `${SITE_URL}${PATH}`,
  hasPart: INDUSTRIES.filter((i) => isLaunched(i.href)).map((i) => ({
    "@type": "WebPage",
    name: i.name,
    url: `${SITE_URL}${i.href}`,
  })),
};

export default function IndustriesServedPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, collectionJsonLd]}>
      <IndexGrid
        eyebrow="Industries served"
        title="Web design, for your industry"
        lede="In 2026, web design is web design. While there are different facets of each industry, the core is the same: display the appropriate information, and direct the potential customer to make a sale or inquire. These are known as conversions, and it's what all of my sites are designed to do. Below is a list of industries I can build for, including, but not limited to:"
        items={INDUSTRIES}
      />
    </PageComposer>
  );
}
