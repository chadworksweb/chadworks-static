// Route: /portfolio/ -- LEAN MVP. A short intro section plus the sitewide
// PortfolioCapsule fed six real client shots. The full immersive
// camera-zoom experience (CWS-PORTFOLIO-MOCKUP.md) is deferred to the
// comb-through; this is the breadth-first version.

import type { Metadata } from "next";
import { SITE_URL, ORG } from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { SectionShell } from "@/components/capsules/SectionShell";
import { PortfolioCapsule } from "@/components/capsules";

const PAGE_URL = `${SITE_URL}/portfolio/`;
const TITLE = "Portfolio: Real Client Sites by chadworks | chadworks";
const DESCRIPTION =
  "A look at real client sites custom built by chadworks: tree service, event catering, landscape design, massage, automation, and more. Every one designed and developed by one person.";

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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: PAGE_URL },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "chadworks portfolio",
  url: PAGE_URL,
  description: DESCRIPTION,
  provider: { "@type": "Organization", name: ORG.name, url: ORG.url },
};

const portfolio = {
  heading: "Sites I've custom built",
  intro:
    "A sample of real client work. Each of these was designed and developed by one person, start to finish, and each one belongs to the business it was built for. Hover any shot to bring it to life, or click through to see it live.",
  items: [
    {
      label: "Russ Tree Service",
      img: "/portfolio/russtree.webp",
      alt: "Russ Tree Service website by chadworks",
      href: "https://russtreeservice.com",
    },
    {
      label: "AAC Event Catering",
      img: "/portfolio/aac.webp",
      alt: "AAC Event Catering website by chadworks",
      href: "https://aaceventcatering.com",
    },
    {
      label: "EdenScapes",
      img: "/portfolio/edenscapes.webp",
      alt: "EdenScapes Japanese garden design website by chadworks",
      href: "https://eden-scapes.com/japanese-garden-design-installation/",
    },
    {
      label: "Massage Professionals",
      img: "/portfolio/massagepros.webp",
      alt: "Massage Professionals website by chadworks",
      href: "https://massageprofessionalsllc.com",
    },
    {
      label: "ADS Automation",
      img: "/portfolio/adsautomation.webp",
      alt: "ADS Automation website by chadworks",
      href: "https://adsautomation.com",
    },
    {
      label: "Thorobird",
      img: "/portfolio/thorobird.webp",
      alt: "Thorobird website by chadworks",
      href: "https://thorobird.com",
    },
  ],
};

export default function PortfolioPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, collectionJsonLd]}>
      {/* INTRO -- short framing above the shots. */}
      <SectionShell>
        <p className="eyebrow">Selected work</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">The work</span>
        </h1>
        <p className="svc-lede measure-prose">
          Twenty years of building, and the part I never outsource is the
          building itself. Here are real client sites I designed and developed,
          each one fast, findable, and owned outright by the business it serves.
        </p>
      </SectionShell>

      {/* THE SHOTS -- sitewide water-ripple grid, six real client sites. */}
      <PortfolioCapsule portfolio={portfolio} slug="portfolio" />
    </PageComposer>
  );
}
