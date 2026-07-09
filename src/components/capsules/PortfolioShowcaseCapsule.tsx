// PORTFOLIO SHOWCASE CAPSULE -- the full portfolio showroom (global, placed in
// multiple instances: the homepage and any service page that wants the real
// showcase instead of the lighter PortfolioCapsule).
//
// Owns the CANONICAL chadworks portfolio (the Rising Compass flagship + the
// archive of client builds) so every page that renders it stays identical
// line for line. Three parts: a gemstone titlebar, the FeaturedShowcase
// flagship, then the ArchiveGrid with the "view full portfolio" CTA.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { GemstoneMark } from "@/components/GemstoneMark";
import { isLaunched } from "@/lib/launch";
import { FeaturedShowcase, type FeaturedItem } from "@/components/portfolio/FeaturedShowcase";
import { ArchiveGrid, type ArchiveItem } from "@/components/portfolio/ArchiveGrid";

const FEATURED: FeaturedItem = {
  slug: "risingcompass",
  alt: "Rising Compass website, designed and developed by chadworks",
  url: "risingcompass.net",
  label: "Rising Compass",
  href: "https://risingcompass.net",
};

const ARCHIVE: ArchiveItem[] = [
  {
    key: "tomweather",
    slug: "tomweather",
    alt: "Weather Map Generator app, designed and developed by chadworks",
    url: "map.tomtheweatherwizard.com",
    label: "Weather Map Generator",
    blurb:
      "A broadcast-style tool that turns a raw forecast into a clean, shareable weather map. You sketch the snow zones and drop the cities right on the map, then export a finished graphic ready to post.",
  },
  {
    key: "rslgo",
    slug: "rslgo",
    alt: "RSLgo website, designed and developed by chadworks",
    url: "rslgo.com",
    label: "RSLgo",
    blurb:
      "A custom coded consulting practice website with ecommerce, custom-designed digital products and highly tailored landing/marketing pages.",
  },
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
    key: "chadlewine",
    slug: "chadlewine",
    alt: "chadlewine.com website, designed and developed by chadworks",
    url: "chadlewine.com",
    label: "Chad Lewine",
    href: "https://chadlewine.com",
    blurb:
      "My musician-first site, where I push the interaction further than a client brief usually allows. Proof of where the work can go.",
  },
];

// `archiveHeading` names the archive-grid block, so each host page can title
// it in its own context (the homepage frames it broadly, a service page frames
// it to that service). The rest of the showroom is identical everywhere.
export function PortfolioShowcaseCapsule({
  archiveHeading = "chadworks Project Showcase",
}: {
  archiveHeading?: string;
} = {}) {
  return (
    <>
      {/* PORTFOLIO -- a centered titlebar: the section name flanked by two
          mini, counter-rotating CW gemstones (the same cut crystal as the hero
          mark, at badge scale). Then the flagship piece and the archive grid. */}
      <SectionShell className="cw-port-titlebar">
        <div className="cw-port-titlebar__row">
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
          <h2 className="cw-port-titlebar__title">chadworks&trade; Portfolio</h2>
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
        </div>
      </SectionShell>

      {/* The flagship piece, then the archive grid. */}
      <SectionShell className="cw-port-feat-shell">
        <FeaturedShowcase
          primary={FEATURED}
          eyebrow="Featured build"
          heading="Rising Compass"
          headingAs="h3"
          ctaUnderLede
          lede="The Rising Compass is a ground-up, custom web app that tracks and measures the messages contained in the lyrics of the world's most popular songs. I built and manage this 100%, top to bottom."
        />
      </SectionShell>
      <SectionShell className="cw-port-archive-shell">
        <h2 className="cw-port-archive__heading">{archiveHeading}</h2>
        <ArchiveGrid items={ARCHIVE} />
        {isLaunched("/portfolio/") && (
          <div className="cw-port-archive__cta-row">
            <Link href="/portfolio/" className="svc-btn">
              <span className="svc-btn__label">View full portfolio</span>
              <svg className="svc-btn__arrow" viewBox="0 0 448 512" aria-hidden="true" focusable="false">
                <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
              </svg>
            </Link>
          </div>
        )}
      </SectionShell>
    </>
  );
}
