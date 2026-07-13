// Route: /portfolio/ -- the signature showroom. A short hero intro, then the
// ArchiveGrid (the work). Every site is shown through a DeviceMockup -- a
// desktop / tablet / mobile toggle over real captures of the live site at each
// breakpoint (/portfolio/<slug>-<device>.jpg) inside a CSS/SVG device frame.
// No stock photos, no live capture at runtime.

import type { Metadata } from "next";
import { SITE_URL, ORG } from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { SectionShell } from "@/components/capsules/SectionShell";
import { ArchiveGrid, type ArchiveItem } from "@/components/portfolio/ArchiveGrid";

const PAGE_URL = `${SITE_URL}/portfolio/`;
const TITLE = "Portfolio: Real Client Sites by chadworks | chadworks";
const DESCRIPTION =
  "A showroom of real client sites I designed and developed: tree service, event catering, landscape design, massage, automation, law, and more. See each one at desktop, tablet, and mobile. One person, start to finish, every site owned outright by the business it serves.";

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

// ---- The archive -------------------------------------------------
const archive: ArchiveItem[] = [
  {
    key: "aac",
    slug: "aac",
    alt: "AAC Event Catering website, designed and developed by chadworks",
    url: "aaceventcatering.com",
    label: "AAC Event Catering",
    href: "https://aaceventcatering.com",
    blurb:
      "A catering brand that needed to look as polished as the events it runs. Booking-ready, and built to win the search.",
  },
  {
    key: "edenscapes",
    slug: "edenscapes",
    alt: "EdenScapes Japanese garden design website, designed and developed by chadworks",
    url: "eden-scapes.com",
    label: "EdenScapes",
    href: "https://eden-scapes.com/japanese-garden-design-installation/",
    blurb:
      "Japanese garden design deserves a quiet, deliberate site. I gave the craft room to breathe and the work room to sell itself.",
  },
  {
    key: "massagepros",
    slug: "massagepros",
    alt: "Massage Professionals website, designed and developed by chadworks",
    url: "massageprofessionalsllc.com",
    label: "Massage Professionals",
    href: "https://massageprofessionalsllc.com",
    blurb:
      "A calm, trustworthy front door for a local practice, with the booking path one tap away on a phone.",
  },
  {
    key: "adsautomation",
    slug: "adsautomation",
    alt: "ADS Automation website, designed and developed by chadworks",
    url: "adsautomation.com",
    label: "ADS Automation",
    href: "https://adsautomation.com",
    blurb:
      "Industrial automation is technical work, so the site reads clear and credible without drowning a visitor in jargon.",
  },
  {
    key: "thorobird",
    slug: "thorobird",
    alt: "Thorobird website, designed and developed by chadworks",
    url: "thorobird.com",
    label: "Thorobird",
    href: "https://thorobird.com",
    blurb:
      "A brand site with a distinct point of view, custom built so it carries the personality the business actually has.",
  },
  {
    key: "abracadabragems",
    slug: "abracadabragems",
    alt: "Abracadabra Gems website, designed and developed by chadworks",
    url: "abracadabragems.com",
    label: "Abracadabra Gems",
    href: "https://abracadabragems.com",
    blurb:
      "Gemstones want color and light. The layout puts the product first and lets each piece carry the page.",
  },
  {
    key: "rozariolaw",
    slug: "rozariolaw",
    alt: "Rozario Law website, designed and developed by chadworks",
    url: "rozariolaw.com",
    label: "Rozario Law",
    href: "https://rozariolaw.com",
    blurb:
      "A law practice has seconds to earn trust. This one opens steady and serious, and tells a visitor exactly what to do next.",
  },
  {
    key: "risingcompass",
    slug: "risingcompass",
    alt: "Rising Compass website, designed and developed by chadworks",
    url: "risingcompass.net",
    label: "Rising Compass",
    href: "https://risingcompass.net",
    blurb:
      "One of my own builds: a data-driven product with a custom interface, designed and shipped the same way I ship client work.",
  },
  {
    key: "chadlewine",
    slug: "chadlewine",
    alt: "chadlewine.com website, designed and developed by chadworks",
    url: "chadlewine.com",
    label: "Chad",
    href: "https://chadlewine.com",
    blurb:
      "My musician-first site, where I push the interaction further than a client brief usually allows. Proof of where the work can go.",
  },
];

// ---- Structured data ------------------------------------------------------
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: PAGE_URL },
  ],
};

const works = archive.map((a) => ({ name: a.label, url: a.href, slug: a.slug }));

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "chadworks portfolio",
  url: PAGE_URL,
  description: DESCRIPTION,
  provider: { "@type": "Organization", name: ORG.name, url: ORG.url },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: works.length,
    itemListElement: works.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "WebSite",
        name: w.name,
        url: w.url,
        image: `${SITE_URL}/portfolio/${w.slug}-desktop.jpg`,
      },
    })),
  },
};

export default function PortfolioPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, collectionJsonLd]}>
      {/* INTRO -- short framing above the showcase. */}
      <SectionShell>
        <p className="eyebrow">Selected work</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">The work</span>
        </h1>
        <p className="svc-lede measure-prose">
          Twenty years of building, and the part I never outsource is the
          building itself. Here are real client sites I designed and developed,
          each one fast, findable, and owned outright by the business it serves.
          See any of them at desktop, tablet, and mobile.
        </p>
      </SectionShell>

      {/* The archive, lazy below the fold. */}
      <SectionShell>
        <p className="eyebrow">The archive</p>
        <h2 className="cw-port-archive__heading">More sites I&apos;ve custom built</h2>
        <p className="svc-lede measure-prose">
          A wider sample of client work. Switch any card between desktop, tablet,
          and mobile, or open it live. Each was designed and developed by one
          person, start to finish.
        </p>
        <ArchiveGrid items={archive} />
      </SectionShell>
    </PageComposer>
  );
}
