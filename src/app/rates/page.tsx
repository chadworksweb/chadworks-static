// Route: /rates/ -- standalone page. Value-based pricing with the math
// showing. Real numbers only, every one of them read from the pricing hub
// (MINUTELY, BASE, the typical band, WORDPRESS_CARE). Signature moment (CWS-CREATIVE-ARSENAL):
// the glass price panel + scanning border + a show-the-math ledger. Copy in
// Chad's public voice, big-ticket posture (never apologize for the number).
// JSON-LD: WebPage + FAQPage + BreadcrumbList.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { ORG_ID, ref } from "@/lib/jsonld";
import { isLaunched } from "@/lib/launch";
import {
  PageComposer,
  RatesCapsule,
  MainContactCapsule,
  PathsCapsule,
  RateDefenseCapsule,
  CalcCtaCapsule,
} from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import { BASE, money } from "@/lib/package-builder";
import { HIGH, HOURLY, LOW, MINUTELY, WORDPRESS_CARE } from "@/lib/pricing";

// The minutely-rate explainer: real task -> real time, shown in the page's
// existing show-the-math ledger (label + mono figure per row).
const RATE_EXAMPLES: { task: string; time: string }[] = [
  { task: "Swapping an image", time: "60 seconds" },
  { task: "Changing text on a page", time: "60 seconds" },
  { task: "Create a new page", time: "10 minutes" },
  { task: "Create a new template", time: "30 minutes" },
  { task: "Minor bug fixing", time: "10-20 minutes" },
  { task: "Image editing", time: "5 minutes" },
  { task: "On-page optimization", time: "5-10 min per page" },
  { task: "Existing client consultation phone call", time: "10-30 min" },
  { task: "Recovering hacked website", time: "60-120 minutes" },
  { task: "Changing the colors of the site's text or single UI element", time: "120 seconds" },
];

const PAGE_PATH = "/rates/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const TITLE = "chadworks Rates | What it costs to work with chadworks";
const DESCRIPTION =
  `Rates start at ${money(MINUTELY)}/minute and ${money(BASE)} for flat rate builds. Visit this page to learn more.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: isLaunched(PAGE_PATH), follow: true },
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

// --- JSON-LD (GEO checklist 2): WebPage + 2-level BreadcrumbList. ---
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Rates",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: ref(ORG_ID),
  // Real, public numbers as a price specification an engine can lift.
  mainEntity: {
    "@type": "Service",
    name: "Website design and development",
    provider: ref(ORG_ID),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(HOURLY),
        priceCurrency: "USD",
        unitText: "HUR",
      },
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
    },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Rates", item: PAGE_URL },
  ],
};

export default function RatesPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* The shared rates band, with the heading in the standard hero-H1 style. */}
      <RatesCapsule standalone />
      {/* Explainer for the per-minute rate. Repurposes the FAQ inverted band:
          sticky intro column (heading + the "why 10 min minimum") on the left,
          the task -> time ledger + closing note on the right. */}
      <SectionShell
        full
        className="svc-block svc-faq-section cw-rate-explainer"
        trailingClassName="svc-faq-section--dark"
      >
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <h2 className="svc-block__heading svc-fill">
              Explanation of the minutely rate
            </h2>
            <p className="svc-faq__lead">
              A request is not just the end result. To fulfill a client request,
              the process usually includes:
            </p>
            <ol className="cw-rate-explainer__steps">
              <li>Discover the task</li>
              <li>Plan the task</li>
              <li>Load the working environment</li>
              <li>Make the actual change</li>
              <li>Publish the change</li>
              <li>Test the change</li>
            </ol>
          </div>
          <div className="cw-rate-explainer__body">
            <h3 className="cw-rate-explainer__eyebrow">
              Example of common web design/development tasks and how long they
              take:
            </h3>
            <dl className="rates-ledger">
              {RATE_EXAMPLES.map((ex) => (
                <div key={ex.task} className="rates-ledger__row">
                  <dt className="rates-ledger__label">{ex.task}</dt>
                  <dd className="rates-ledger__num">{ex.time}</dd>
                </div>
              ))}
            </dl>
            <p className="svc-faq__lead cw-rate-explainer__note">
              Keep in mind, this is not clicking a button and letting AI do it
              from start to finish, this is directing AI to perform very specific
              tasks for a very specific outcome, all guided by a{" "}
              <Link href="/about/">20 year web design and marketing veteran</Link>.
            </p>
          </div>
        </div>
      </SectionShell>
      {/* IN DEFENSE OF THE RATE -- the argument the ledger does not make. Sits
          after the math on purpose: how long the work takes, then who is doing
          it. Runs the /about/ aperture with the role list as its payload. */}
      {/* The calculator hand-off, directly after the minutely-rate explainer
          (Chad). The explainer prices a REQUEST; the calculator prices a BUILD,
          so the two sit together as the page's two costing tools before the
          argument for the rate follows them. */}
      <CalcCtaCapsule />
      <RateDefenseCapsule />
      {/* Standard lane modules out to the service lanes + about. */}
      <PathsCapsule
        paths={{
          heading: "Explore chadworks™",
          items: [
            {
              label: "Websites",
              detail:
                "Website design and development services. A website is the one place you own on the internet. Make it yours.",
              href: "/websites/",
            },
            {
              label: "Visibility",
              detail:
                "Being found and chosen: in Google, in the AI assistants people now ask instead of Google, and in the inbox.",
              href: "/visibility/",
            },
            {
              label: "About",
              detail:
                "chadworks is one person: Chad Lewine. Designing, developing and marketing for clients since 2011.",
              href: "/about/",
            },
          ],
        }}
      />
      {/* The contact CTA below it. */}
      <MainContactCapsule />
    </PageComposer>
  );
}
