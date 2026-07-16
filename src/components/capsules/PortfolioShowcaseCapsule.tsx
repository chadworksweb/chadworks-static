// PORTFOLIO SHOWCASE CAPSULE -- the full portfolio showroom (global, placed in
// multiple instances: the homepage and any service page that wants the real
// showcase instead of the lighter PortfolioCapsule).
//
// Owns the CANONICAL chadworks portfolio (the Rising Compass flagship + the
// archive of client builds) so every page that renders it stays identical
// line for line -- the selection is fixed here (see HELD_BACK) and no caller
// can vary it. Three parts: a gemstone titlebar, the FeaturedShowcase
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

// Held back from the showcase everywhere. This list is applied unconditionally
// and there is no prop to override it: the capsule renders ONE selection on
// every surface it appears on (Chad, 2026-07-16). It used to be an `exclude`
// prop passed by the homepage alone, which is why the homepage showed 10 cards
// while /web-design and /web-development showed all 21 -- the capsule's own
// "identical line for line" promise above was not true. To change what the
// showcase holds back, edit THIS list and every surface moves together.
const HELD_BACK = [
  "edenscapes", "massagepros", "adsautomation", "salpattica", "ttww", "therapistexample",
  "videofeed", "abracadabragems", "videoplayer", "jeremyhayes", "rozariolaw",
];

// Exported so any other surface renders the exact same list. Note this is the
// FULL archive; consumers get the curated selection via the capsule itself.
export const ARCHIVE: ArchiveItem[] = [
  {
    key: "scinet",
    slug: "scinet",
    alt: "SciNet Industries website, designed and developed by chadworks",
    url: "scinet-industries.vercel.app",
    label: "SciNet Industries",
    href: "https://scinet-industries.vercel.app",
    blurb:
      "A brand and product site for SciNet Industries, a microbiome-therapeutics concept.",
  },
  {
    key: "tomweather",
    slug: "tomweather",
    alt: "Weather Map Generator app, designed and developed by chadworks",
    url: "map.tomtheweatherwizard.com",
    label: "Weather Map Generator",
    href: "https://map.tomtheweatherwizard.com",
    blurb:
      "Custom developed web and desktop app. A broadcast-style tool that turns a raw forecast into a clean, shareable weather map. You sketch the snow zones and drop the cities right on the map, then export a finished graphic ready to post.",
  },
  {
    key: "rslgo",
    slug: "rslgo",
    alt: "RSLgo website, designed and developed by chadworks",
    url: "rslgo.com",
    label: "RSLgo",
    href: "https://rslgo.com",
    blurb:
      "A custom coded consulting practice website with ecommerce, custom-designed digital products and highly tailored landing/marketing pages.",
  },
  {
    key: "audioplayer",
    slug: "audioplayer",
    alt: "Streaming Audio Player interface example, designed and developed by chadworks",
    url: "demos.chadworks.co/sap",
    label: "Streaming Audio Player",
    href: "https://demos.chadworks.co/sap",
    blurb:
      "A WINAMP imitation: LCD readout, a spectrum visualizer running on real Web Audio, a ten band equalizer, and a collapsible discography browser.",
  },
  {
    key: "sweatshop",
    slug: "sweatshop",
    alt: "Sweatshop website, designed and developed by chadworks",
    url: "sweatshop-studio.vercel.app",
    label: "Sweatshop",
    href: "https://sweatshop-studio.vercel.app",
    blurb:
      "A concept launch site for Sweatshop, an infrared fitness studio, with motion and heat worked into the design so the page carries the feel of the room.",
  },
  {
    key: "chadlewine",
    slug: "chadlewine",
    alt: "chadlewine.com website, designed and developed by chadworks",
    url: "chadlewine.com",
    label: "Chad Lewine",
    href: "https://chadlewine.com",
    blurb:
      "Likely the world's most immersive and custom-developed artist website. Custom: ecommerce shop, content development, AI integration, API integration, email campaign manager, 3D graphics, effects, branding, CMS and much more.",
  },
  {
    key: "aac",
    slug: "aac",
    alt: "AAC Event Catering website, designed and developed by chadworks",
    url: "aaceventcatering.com",
    label: "AAC Event Catering",
    href: "https://aaceventcatering.com",
    blurb:
      "Custom WordPress-to-static catering company website with pixel-perfection and custom form spam blocking.",
  },
  {
    key: "rozariolaw",
    slug: "rozariolaw",
    alt: "Rozario Law website, designed and developed by chadworks",
    url: "rozariolaw.com",
    label: "Rozario Law",
    href: "https://rozariolaw.com",
    blurb:
      "WordPress website for NYC law firm with a custom homepage and custom blog system.",
  },
  {
    key: "videofeed",
    slug: "videofeed",
    alt: "Short form vertical video feed interface example, designed and developed by chadworks",
    url: "demos.chadworks.co/sfvv",
    label: "Short Form Vertical Video",
    href: "https://demos.chadworks.co/sfvv",
    blurb:
      "A vertical feed that snaps clip to clip inside a phone frame, where only the clip you land on plays and sponsored cards fold into the run.",
  },
  {
    key: "thorobird",
    slug: "thorobird",
    alt: "Thorobird website, designed and developed by chadworks",
    url: "thorobird.com",
    label: "Thorobird",
    href: "https://thorobird.com",
    blurb:
      "WordPress website for NYC real estate brokerage firm with custom designed homepage.",
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
    key: "abracadabragems",
    slug: "abracadabragems",
    alt: "Abracadabra Gems website, designed and developed by chadworks",
    url: "abracadabragems.com",
    label: "Abracadabra Gems",
    href: "https://abracadabragems.com",
    blurb:
      "WordPress website for a permanent jewelry artisan out of California.",
  },
  {
    key: "aes",
    slug: "aes",
    alt: "Artist Empowerment Suite website, designed and developed by chadworks",
    url: "artistempowermentsuite.com",
    label: "Artist Empowerment Suite",
    href: "https://artistempowermentsuite.com",
    blurb:
      "A platform site for Artist Empowerment Suite, a toolkit that lets recording artists run their music and their fan base from one place instead of renting it back from the big-tech platforms. Custom hero, custom store, custom throughout.",
  },
  {
    key: "videoplayer",
    slug: "videoplayer",
    alt: "Traditional Video Player interface example, designed and developed by chadworks",
    url: "demos.chadworks.co/tvp",
    label: "Traditional Video Player",
    href: "https://demos.chadworks.co/tvp",
    blurb:
      "A CRT video player: monitor bezel, VHS counter, a searchable library, and playlists built from nested categories.",
  },
  {
    key: "jeremyhayes",
    slug: "jeremyhayes",
    alt: "Jeremy John Hayes website, designed and developed by chadworks",
    url: "jeremy-john-hayes.vercel.app",
    label: "Jeremy John Hayes",
    href: "https://jeremy-john-hayes.vercel.app",
    blurb:
      "A book-launch site for horror author Jeremy John Hayes and his collection The Possessing Hour, custom built to pull a reader into the mood of the book and carry them to the buy button.",
  },
  {
    key: "detrixhe",
    slug: "detrixhe",
    alt: "Dr. Jonathan Detrixhe website, designed and developed by chadworks",
    url: "jonathandetrixhe.com",
    label: "Dr. Jonathan Detrixhe",
    href: "https://jonathandetrixhe.com",
    blurb:
      "A practice site for Dr. Jonathan Detrixhe, a clinical psychologist in Greenpoint, Brooklyn, structured so a nervous new patient and an AI search engine both find the answer they came for.",
  },
  {
    key: "salpattica",
    slug: "salpattica",
    alt: "Salpattica website, designed and developed by chadworks",
    url: "salpattica.com",
    label: "Salpattica",
    href: "https://www.salpattica.com",
    blurb:
      "An online shop for Salpattica Creative Design Co., a stationery and fine-art studio, with the handmade character of the work carried through the storefront and the product kept front and center.",
  },
  {
    key: "ttww",
    slug: "ttww",
    alt: "Tom the Weather Wizard website, designed and developed by chadworks",
    url: "tomtheweatherwizard.com",
    label: "Tom the Weather Wizard",
    href: "https://tomtheweatherwizard.com",
    blurb:
      "A personality-forward brand and merch site for broadcast meteorologist Tom the Weather Wizard, custom built to turn a running joke about Midwest spring into a page people share and a shirt they buy.",
  },
  {
    key: "therapistexample",
    slug: "therapistexample",
    alt: "Mara Calloway, LPC therapy website, designed and developed by chadworks",
    url: "mara-calloway-lpc.vercel.app",
    label: "Mara Calloway, LPC",
    href: "https://mara-calloway-lpc.vercel.app",
    blurb:
      "An example build for a private therapy practice. Calm, credible, and organized so a first-time visitor knows within seconds they are in the right place, with the booking path never more than a tap away.",
  },
];

// The default flagship lede -- used everywhere unless a host page overrides it.
const FEATURED_LEDE =
  "The Rising Compass is a ground-up, custom web app that tracks and measures the messages contained in the lyrics of the world's most popular songs. I built and manage this 100%, top to bottom.";

// `archiveHeading` names the archive-grid block, so each host page can title
// it in its own context (the homepage frames it broadly, a service page frames
// it to that service). The rest of the showroom is identical everywhere.
//
// OPTIONAL per-page copy overrides (leave both unset for the canonical
// showroom): `featuredLede` swaps the flagship lede, and `blurbs` is a map
// keyed by archive-item `key` (e.g. "rslgo") that replaces just those blurbs.
// Any project not present in the map keeps its default blurb. Used by the
// web-development page to speak to the development aspect of each build.
// `maxItems` caps how many archive tiles render (the homepage shows a curated
// few, the /portfolio page and service pages show the full set). `showroomCta`
// swaps the "view full portfolio" button for a "view the showroom" button that
// links to /showroom/ -- used on the homepage, where the trimmed grid points a
// visitor to the full interactive showroom instead of the classic archive page.
// `revealEarly` fires this block's scroll-reveal BEFORE it reaches the fold
// rather than just after it (see PageMotion). Homepage-only by request (Chad,
// 2026-07-16), which is why it is a prop here and not a change to the shared
// `.reveal` class: the service pages keep the standard timing.
export function PortfolioShowcaseCapsule({
  archiveHeading = "chadworks Project Showcase",
  featuredLede,
  blurbs,
  maxItems,
  showroomCta = false,
  revealEarly = false,
}: {
  archiveHeading?: string;
  featuredLede?: string;
  blurbs?: Record<string, string>;
  maxItems?: number;
  showroomCta?: boolean;
  revealEarly?: boolean;
} = {}) {
  // Appended AFTER `reveal` by SectionShell, so the section carries both classes
  // and takes its look from `.reveal` while `.reveal-early` only picks which
  // observer watches it.
  const early = revealEarly ? "reveal-early" : undefined;
  const withBlurbs = blurbs
    ? ARCHIVE.map((item) =>
        blurbs[item.key] ? { ...item, blurb: blurbs[item.key] } : item
      )
    : ARCHIVE;
  const filtered = withBlurbs.filter((item) => !HELD_BACK.includes(item.key));
  const archive =
    typeof maxItems === "number" ? filtered.slice(0, maxItems) : filtered;
  return (
    <>
      {/* PORTFOLIO -- a centered titlebar: the section name flanked by two
          mini, counter-rotating CW gemstones (the same cut crystal as the hero
          mark, at badge scale). Then the flagship piece and the archive grid. */}
      <SectionShell className="cw-port-titlebar" trailingClassName={early}>
        <div className="cw-port-titlebar__row">
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
          <h2 className="cw-port-titlebar__title">chadworks&trade; Portfolio</h2>
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
        </div>
      </SectionShell>

      {/* The flagship piece, then the archive grid. */}
      <SectionShell className="cw-port-feat-shell" trailingClassName={early}>
        <FeaturedShowcase
          primary={FEATURED}
          eyebrow="Featured build"
          heading="Rising Compass"
          headingAs="h3"
          ctaUnderLede
          lede={featuredLede ?? FEATURED_LEDE}
        />
      </SectionShell>
      <SectionShell className="cw-port-archive-shell" trailingClassName={early}>
        <h2 className="cw-port-archive__heading">{archiveHeading}</h2>
        <ArchiveGrid items={archive} />
        {/* Both arms of the ternary that used to live here rendered identical
            markup and differed only in their condition, so it is one condition
            now: an explicit `showroomCta` forces the button, otherwise it shows
            once /showroom/ is launched. */}
        {(showroomCta || isLaunched("/showroom/")) && (
          <div className="cw-port-archive__cta-row">
            <Link href="/showroom/" className="svc-btn cw-port-archive__cta-btn">
              <span className="svc-btn__label">View the showroom</span>
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
