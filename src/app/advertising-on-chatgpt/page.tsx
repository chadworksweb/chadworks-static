// Route: /advertising-on-chatgpt/ -- the managed ChatGPT Ads work of art,
// reproduced section by section in the SOURCE ORDER and reskinned to the global
// tokens, under the site shell (CWS directive 2026-06-16). Bespoke composition
// (NOT the generic service template), sibling of /show-up-on-chatgpt/. Source
// order:
//   hero -> why-split (direct answer + animated ChadGPT chat with a Sponsored
//   result) + four lanes -> eligibility grid -> compare (burns vs pays off)
//   -> single pricing panel -> FAQ -> made -> contact CTA.

import type { Metadata } from "next";
import { Fragment } from "react";
import { advertisingOnChatgpt as service } from "@/lib/services/advertising-on-chatgpt";
import {
  serviceUrl,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { SectionShell } from "@/components/capsules/SectionShell";
import { CtaCapsule, FaqCapsule, MadeByCapsule } from "@/components/capsules";
import {
  AdvertisingHero,
  AdvertisingWhyLanes,
  AdvertisingEligibility,
  AdvertisingPricing,
} from "@/components/chatgpt/AdvertisingArtSections";
import { isLaunched } from "@/lib/launch";
import { ADS_MIN_DAILY_SPEND } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // Launch-driven: indexed only while launched (see launch.ts).
  robots: { index: isLaunched("/advertising-on-chatgpt/"), follow: true },
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

const COMPARE_ROWS: [string, string][] = [
  ["Sending the click to a slow homepage", "Sending it to a fast page that answers the prompt"],
  ["One ad for every kind of buyer", "Creative matched to the question being asked"],
  ["Setting a budget and walking away", "Watching the Ads Manager and cutting what fails"],
  ["Guessing at the daily spend", `Starting at the ${money(ADS_MIN_DAILY_SPEND)} floor and scaling what converts`],
  ["Advertising a category OpenAI will reject", "Checking eligibility before a dollar is spent"],
];

export default function AdvertisingOnChatgptPage() {
  return (
    <PageComposer
      jsonLd={[
        buildBreadcrumbJsonLd(service),
        buildServiceJsonLd(service),
        buildFaqJsonLd(service),
      ]}
    >
      <AdvertisingHero />
      <AdvertisingWhyLanes />

      {/* Eligibility grid (new bespoke pattern). */}
      <AdvertisingEligibility />

      {/* Where budget burns vs where it pays off (diagonal gradient band). */}
      <SectionShell full className="cw-art-section cw-art-compare-section">
        <div className="cw-art-section__eyebrow">The work is in the details</div>
        <h2 className="cw-art-section__heading">
          What makes advertising on ChatGPT pay off vs. burn out.
        </h2>
        <div
          className="cw-art-compare"
          role="table"
          aria-label="ChatGPT advertising comparison: where budget burns vs where it pays off"
        >
          <div className="cw-art-compare__head cw-art-compare__head--lose" role="columnheader">Where budget burns</div>
          <div className="cw-art-compare__head cw-art-compare__head--win" role="columnheader">Where it pays off</div>
          {COMPARE_ROWS.map(([lose, win]) => (
            <Fragment key={win}>
              <div className="cw-art-compare__cell cw-art-compare__cell--lose" role="cell">{lose}</div>
              <div className="cw-art-compare__cell cw-art-compare__cell--win" role="cell">{win}</div>
            </Fragment>
          ))}
        </div>
      </SectionShell>

      {/* Single managed-ads pricing panel. */}
      <AdvertisingPricing />

      {/* FAQ + founder bio (existing capsules, source content). */}
      <FaqCapsule
        faqs={service.faqs}
        faqLead={service.faqLead}
        heading="The questions people actually ask before they advertise on ChatGPT."
        pageName={service.title}
        scheme="inverted"
        schemeAuto
      />
      {service.made && <MadeByCapsule made={service.made} />}

      <CtaCapsule cta={service.cta} form={service.form} scheme="inverted" />
    </PageComposer>
  );
}
