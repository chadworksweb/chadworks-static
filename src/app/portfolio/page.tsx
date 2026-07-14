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
import { ARCHIVE } from "@/components/capsules/PortfolioShowcaseCapsule";

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
// Renders the exact same list as the homepage: the shared ARCHIVE is the single
// source of truth (homepage is ground truth). Rising Compass, the homepage
// flagship, leads the grid here since this page has no separate flagship block.
const RISING_COMPASS: ArchiveItem = {
  key: "risingcompass",
  slug: "risingcompass",
  alt: "Rising Compass website, designed and developed by chadworks",
  url: "risingcompass.net",
  label: "Rising Compass",
  href: "https://risingcompass.net",
  blurb:
    "One of my own builds: a data-driven product with a custom interface, designed and shipped the same way I ship client work.",
};

const archive: ArchiveItem[] = [RISING_COMPASS, ...ARCHIVE];

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
