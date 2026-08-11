// Route: /website-design-for-5k-races/ -- a Service page in the design
// vertical. Narrowed from the broader /website-design-for-events/ on
// 2026-08-11 (Chad); that route never launched, so there is nothing to
// redirect. Siblings: /website-design-for-conferences/ and
// /website-design-for-retreats/.
//
// THIS PAGE PUBLISHES REAL PRICES IN ITS SCHEMA (Chad, 2026-08-11), which no
// other service page does. composeService always emits the price-free Offer
// from buildServiceJsonLd, so the priced OfferCatalog below is added on top
// through the afterPrice slot rather than by forking the composer. Both
// describe the same service; the catalog is the specific one.
//
// UNLAUNCHED as of 2026-08-11. The robots line gates on isLaunched.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { design5kRaces as service } from "@/lib/services/design-5k-races";
import { serviceUrl, SITE_URL } from "@/lib/service";
import { ORG_ID, ref } from "@/lib/jsonld";
import { isLaunched } from "@/lib/launch";
import {
  ProcessCapsule,
  ProblemCapsule,
  PortfolioShowcaseCapsule,
  AboutChadCapsule,
  FitCapsule,
  JsonLd,
  ArrowRight,
  W,
} from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import { RacePackagesCapsule } from "@/components/capsules/RacePackagesCapsule";
import { PixelDivider } from "@/components/PixelDivider";
import { RaceHeroFilm } from "@/components/RaceHeroFilm";
import ManifestoAmbient from "@/components/ManifestoAmbient";
import { money } from "@/lib/package-builder";
import {
  RACE_STARTING_LINE,
  RACE_FULL_COURSE,
  RACE_ADDON_REGISTRATION,
  RACE_ADDON_SELF_EDIT,
  RACE_ADDON_SPONSORS,
  RACE_ADDON_RESULTS,
  RACE_ADDON_FUNDRAISING,
  RACE_ADDON_COURSE_MAP,
} from "@/lib/pricing";

const PAGE_PATH = "/website-design-for-5k-races/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  robots: { index: isLaunched(PAGE_PATH), follow: true },
  openGraph: {
    title: service.meta.title,
    description: service.meta.description,
    url: serviceUrl(service),
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: service.meta.title,
    description: service.meta.description,
    images: ["/og-default.png"],
  },
};

// The priced catalog. Every figure reads from the pricing hub, so a price
// change moves the page copy and the structured data in the same edit.
const offer = (name: string, price: number, description: string) => ({
  "@type": "Offer",
  name,
  description,
  price: String(price),
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  url: PAGE_URL,
  seller: ref(ORG_ID),
});

const offerCatalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "5K race website packages",
  url: PAGE_URL,
  provider: ref(ORG_ID),
  itemListElement: [
    offer(
      "Starting Line",
      RACE_STARTING_LINE,
      "One-page 5K race website, phone-first, including the registration handoff, race-day essentials and published transfer and refund policy."
    ),
    offer(
      "Full Course",
      RACE_FULL_COURSE,
      "Multi-page 5K race website including the course page, tiered sponsor wall, race-day page and results archive."
    ),
    offer("Registration platform wiring", RACE_ADDON_REGISTRATION, "Wiring and mobile testing of the handoff to RunSignup, Eventbrite or Race Roster."),
    offer("Self-edit layer", RACE_ADDON_SELF_EDIT, "Content management so the race committee can change the schedule and race-day details without a developer."),
    offer("Donations and fundraising", RACE_ADDON_FUNDRAISING, "Donation and peer-to-peer fundraising integration for charity races."),
    offer("Results and past-year archive", RACE_ADDON_RESULTS, "Published results plus an archive of previous years."),
    offer("Sponsor wall", RACE_ADDON_SPONSORS, "Tiered sponsor logo rows sized by sponsorship level."),
    offer("Course map and elevation", RACE_ADDON_COURSE_MAP, "Course map, water station locations and elevation profile."),
  ],
};

export default function FiveKDesignPage() {
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        // THE HERO -- the /ai-generated-website-audit/ shape (Chad,
        // 2026-08-11): eyebrow, h1, a SHORT lede, then the glow-bullet list
        // that carries the specifics, with a panel in the right column. The
        // panel there is a lead form; here it is the rising chip stream, which
        // is the one thing Chad wanted kept from the standard service hero.
        //
        // reveal={false} for the reason HeroCapsule and the calculator hero
        // both carry it: `.reveal` starts an element at opacity 0 behind an
        // IntersectionObserver, which is the wrong contract for the first thing
        // on the page. The .eyebrow / .svc-prose / .svc-hero__cta entrance
        // cascade animates it in instead.
        //
        // TRADE-OFF, noted rather than hidden: overriding the hero slot means
        // HeroCapsule does not run, so the VISIBLE breadcrumb is gone from this
        // page (the audit page ships without one too). The BreadcrumbList
        // JSON-LD still emits from composeService, so the structured data is
        // unaffected.
        hero: (
          <SectionShell
            full
            className="svc-block cw-race-hero"
            reveal={false}
            bg={<ManifestoAmbient />}
          >
            {/* THE FILM -- the right half of the hero, bleeding to the
                viewport edge rather than sitting inside the content rail.
                A direct child of the section (not of the grid below) so it can
                take `grid-column: full` and escape the rail, which is the same
                move .cw-shell__bg needs here for the cloud. Boxed inside the
                rail it cropped a 16:9 clip into a square and read as a grey
                rectangle parked beside the copy.

                REPLACED the rising chip stream (Chad, 2026-08-11): both in one
                hero was noise. The empty right track in the grid below is what
                keeps the copy off it. */}
            <div className="cw-race-film" aria-hidden="true">
              <RaceHeroFilm />
            </div>

            <div className="cw-calc-intro cw-race-intro">
              <div className="cw-calc-intro__lead">
                <p className="eyebrow">{service.eyebrow}</p>
                {/* text-gradient, NOT svc-fill: svc-fill is a scroll-driven
                    wipe, so an h1 this near the top of the page paints
                    part-filled and holds its tail in grey. */}
                <h1 className="svc-block__heading text-gradient">
                  {service.title}
                </h1>
                <div className="svc-prose svc-prose--lead">
                  {/* Through <W>, not rendered raw: `answer` is typed
                      ReactNode | Prompted, and W is what turns an unwritten
                      prompt() into the amber TO-WRITE block instead of a type
                      error. Same contract HeroCapsule uses. */}
                  <p><W value={service.answer} /></p>
                  {/* .cw-glow-list is styled as `.svc-prose ul.cw-glow-list`,
                      so it has to stay INSIDE this .svc-prose block to pick up
                      the glyphs. Four bullets, not three (CWS-VOICE 10.2).
                      The price is interpolated from the hub, never typed:
                      price-audit reads comments too, so this note cannot spell
                      one either. */}
                  <ul className="cw-glow-list">
                    <li>
                      Flat rate from {money(RACE_STARTING_LINE)}, published on
                      this page
                    </li>
                    <li>
                      Built phone first, where 74% of race website views happen
                    </li>
                    <li>
                      Packet pickup, parking, the price-increase date and the
                      refund policy runners go looking for
                    </li>
                    <li>Finished before registration opens, not during race week</li>
                  </ul>
                </div>
                <div className="svc-hero__cta">
                  <a href="#race-packages" className="svc-btn">
                    <span className="svc-btn__label">See the packages</span>
                    <ArrowRight down />
                  </a>
                </div>
              </div>

            </div>
          </SectionShell>
        ),
        // THE RIBBON BAND, MOVED UP (Chad, 2026-08-11). It normally sits after
        // the key facts; here it lands directly under the hero. The canonical
        // slot order cannot be reordered per page, so the section is placed in
        // the `afterHero` slot and its own slot is emptied. Rendering it in
        // both would run the band twice.
        //
        // `ribbonPalette="race"` swaps the brand triad for the high-visibility
        // one (see Ribbon). The palette goes through ProblemCapsule rather than
        // onto the Ribbon directly so the colour band and the knockout coverage
        // pass are guaranteed to get the same value.
        // THE FLAT-RATE PROSE SECTION IS GONE (Chad, 2026-08-11). PriceCapsule
        // rendered `service.price` as its own band; it was briefly moved up
        // here to lead the page and is now cut entirely. The package table
        // below already carries every number, so the prose section was saying
        // the same thing again in a weaker form directly above it.
        //
        // `demo` is therefore empty and the packages are the first thing under
        // the hero. The ribbon band renders in the `price` slot, which is now
        // purely a position in the canonical order rather than a price section.
        // `problem` stays null so the band is not drawn twice.
        demo: null,
        afterHero: <RacePackagesCapsule />,
        price: (
          <ProblemCapsule problem={service.problem} ribbonPalette="race" />
        ),
        problem: null,
        approach: (
          <ProcessCapsule
            pageName="5K race website design"
            heading={service.approach.heading}
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
        // The platform-options lanes are GONE from this page (Chad,
        // 2026-08-11). A race director choosing between WordPress and Shopify
        // is not the conversation here; the packages are. The pixel wipe stays
        // as the beat between the process and the portfolio.
        paths: <PixelDivider />,
        portfolio: <PortfolioShowcaseCapsule archiveHeading="Website Design Showcase" />,
        made: (
          <AboutChadCapsule
            captionMain="Don't worry, I'm a professional."
            captionSub="(Web designer.)"
          />
        ),
        // The packages table sits immediately after the page's own price
        // section, which introduces it, and carries the priced catalog schema.
        // The packages table moved up to `afterHero`; only the priced catalog
        // stays down here. It is structured data with no visual output, so its
        // position in the slot order is irrelevant to the reader.
        afterPrice: <JsonLd data={offerCatalogJsonLd} />,
        qualification: <FitCapsule />,
      }}
    />
  );
}
