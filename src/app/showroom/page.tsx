// Route: /showroom/ -- THE portfolio page. Built as Track A alongside the old
// /portfolio/ route, and swapped in on 2026-07-15: this is what the nav, the
// footer, the service pages and the sitemap all point at now. /portfolio/ still
// exists as a route but is unlaunched, unlinked, and 301s here at the edge (see
// deploy/chadworks.conf); only its IMAGE directory is still live.
//
// The showroom is DESKTOP-ONLY. Phones and tablets get the archive below and never
// download the three.js bundle at all (see ShowroomRoute). The archive is composed
// here, on the server, and handed down as a prop: that keeps the grid and its
// section shell out of the client bundle, and means the crawlable version of this
// page is the real portfolio rather than a stripped list of links.

import type { Metadata } from "next";
import { SITE_URL, ORG } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { JsonLd } from "@/components/capsules/PageComposer";
import { MainContactCapsule } from "@/components/capsules/MainContactCapsule";
import { PageMotion } from "@/components/PageMotion";
import { SectionShell } from "@/components/capsules/SectionShell";
import { ArchiveGrid } from "@/components/portfolio/ArchiveGrid";
import showroomStyles from "@/components/showroom/showroom.module.css";
import { captureSrc } from "@/lib/captures";
import { ShowroomRoute } from "@/components/showroom/ShowroomRoute";
import { SHOWROOM_ITEMS } from "@/components/showroom/showroom-data";

// The bare route (what launch.ts keys on) and the absolute URL (what canonical and
// JSON-LD need) are different strings -- isLaunched normalizes paths, not URLs, and
// silently returns false for an absolute one.
const ROUTE = "/showroom/";
const PAGE_URL = `${SITE_URL}${ROUTE}`;

const TITLE = "Showroom | chadworks";
const DESCRIPTION =
  "Welcome to the immersive showcase of chadworks projects. A high-end, motion-driven portfolio built to show off my capabilities.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // Launch-driven, and REQUIRED: layout.tsx defaults every route to noindex, so
  // being in launch.ts alone would still serve noindex. Both edits or neither.
  robots: { index: isLaunched(ROUTE), follow: true },
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

// Same shape and order as /portfolio/: BreadcrumbList first, then the collection.
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Project Showroom", item: PAGE_URL },
  ],
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
        // Only a piece with a live public link carries a url in the schema.
        ...(w.href ? { url: w.href } : {}),
        image: `${SITE_URL}${captureSrc(w.slug)}`,
      },
    })),
  },
};

// What a phone or a tablet sees: the work itself, on the standard page grid. Every
// card carries its own desktop / tablet / mobile toggle, so the sites are still
// shown at every breakpoint -- the showroom's job, done without the showroom.
//
// This route does not use PageComposer, so nothing mounts PageMotion for it -- and
// `.reveal` is `opacity: 0` until PageMotion's observer adds `.is-visible`. That
// makes the reveal decisions below load-bearing rather than stylistic: get one
// wrong and the element renders at full size, in the DOM, painting nothing.
// The archive opts OUT (it is the page's own above-the-fold content, not something
// you scroll into); the contact band cannot opt out, so PageMotion mounts here for
// it.
function ShowroomArchive() {
  return (
    <>
      {/* Inside the archive branch, so it ships only to the devices that render
          the archive -- the desktop showroom has nothing to reveal. */}
      <PageMotion />
      <SectionShell reveal={false} className="cw-showroom-archive">
        <p className="eyebrow">Selected work</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">Project Showroom</span>
        </h1>
        {/* Only a phone or a tablet ever reads this, so the last line can point
            at the desktop without ever showing up on the machine it points to. */}
        <p className="svc-lede measure-prose">
          Real client sites I designed and developed, each one fast, findable, and
          owned outright by the business it serves. Switch any card between
          desktop, tablet, and mobile, or open it live. View this page on desktop
          for the full experience.
        </p>
      {/* h2, not the default h3: the only heading above these is the page h1, so
          h3 would skip a level. /portfolio/ and the homepage keep h3 -- there the
          grid sits under their own h2. */}
        <ArchiveGrid items={SHOWROOM_ITEMS} headingLevel="h2" />
      </SectionShell>
      {/* The same contact band every other page closes on. Inside the archive
          branch, so the desktop showroom (which owns the whole viewport) never
          gets it. */}
      <MainContactCapsule />
    </>
  );
}

export default function ShowroomPage() {
  return (
    <div className={`full ${showroomStyles.route}`}>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <ShowroomRoute archive={<ShowroomArchive />} />
    </div>
  );
}
