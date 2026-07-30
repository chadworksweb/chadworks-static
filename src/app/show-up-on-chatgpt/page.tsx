// Route: /show-up-on-chatgpt/ -- the AI-visibility work of art, reproduced
// section by section in the SOURCE ORDER and reskinned to the global tokens,
// under the site shell (CWS directive 2026-06-15). Bespoke composition (NOT the
// generic service template). Source order:
//   hero -> why-split (direct answer + animated ChadGPT chat) + four lanes
//   -> Scorecard band (is your site invisible to AI?)
//   -> Q&A (asked and answered) -> compare (invisible vs cited)
//   -> proof (eyebrow + heading + stat grid + 3-shot portfolio)
//   -> pricing duo -> made -> FAQ -> timeline -> contact CTA.

import type { Metadata } from "next";
import { Fragment } from "react";
import { showUpOnChatgpt as service } from "@/lib/services/show-up-on-chatgpt";
import {
  serviceUrl,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { SectionShell } from "@/components/capsules/SectionShell";
import {
  CtaCapsule,
  FaqCapsule,
  PortfolioCapsule,
  MadeByCapsule,
  ProcessCapsule,
} from "@/components/capsules";
import {
  ChatgptHero,
  ChatgptWhyLanes,
  ChatgptAnswers,
  ChatgptStatGrid,
  ChatgptPricingDuo,
} from "@/components/chatgpt/ChatgptArtSections";
import { isLaunched } from "@/lib/launch";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // Launch-driven: indexed only while launched (see launch.ts).
  robots: { index: isLaunched("/show-up-on-chatgpt/"), follow: true },
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
  ["robots.txt quietly blocks OAI-SearchBot", "The crawlers that cite you are allowed in"],
  ["Ranking nowhere in classic search", "Ranking underneath the AI answer that names you"],
  ["Content appears only after scripts run", "Answers sitting in the HTML, ready to quote"],
  ["Slogans with nothing quotable", "Direct answers and real FAQs"],
  ["Name, address, and phone differ across the web", "Consistent details the AI can trust"],
  ["Someone else gets named in the answer", "You get named in the answer"],
];

export default function ShowUpOnChatgptPage() {
  return (
    <PageComposer
      jsonLd={[
        buildBreadcrumbJsonLd(service),
        buildServiceJsonLd(service),
        buildFaqJsonLd(service),
      ]}
    >
      <ChatgptHero />
      <ChatgptWhyLanes />

      {/* Interactive six-point rubric on the dark inverted band, two-column. */}
      <SectionShell full className="cw-art-score-section" id="cw-art-score">
        <div className="cw-art-score-layout">
          <div className="cw-art-score-intro">
            <span className="cw-art-section__eyebrow">Check your own site</span>
            <h2 className="cw-art-section__heading">Is your site invisible to AI crawlers?</h2>
            <p className="cw-art-score-help">
              Tap each row that is true for your site. Your score and verdict update
              as you go. Six for six and you are built to be cited. Low score and
              you are probably invisible right now.
            </p>
          </div>
          <div className="cw-art-score-calc">{service.problemArt}</div>
        </div>
      </SectionShell>

      {/* Semantic Q&A coverage (AEO) + speed callout. */}
      <ChatgptAnswers />

      {/* Invisible to AI vs cited by AI (diagonal gradient band). */}
      <SectionShell full className="cw-art-section cw-art-compare-section">
        <div className="cw-art-section__eyebrow">The line you are on right now</div>
        <h2 className="cw-art-section__heading">Invisible to AI vs. cited by AI.</h2>
        <div
          className="cw-art-compare"
          role="table"
          aria-label="AI visibility comparison: invisible to AI vs cited by AI"
        >
          <div className="cw-art-compare__head cw-art-compare__head--lose" role="columnheader">Invisible to AI</div>
          <div className="cw-art-compare__head cw-art-compare__head--win" role="columnheader">Cited by AI</div>
          {COMPARE_ROWS.map(([lose, win]) => (
            <Fragment key={win}>
              <div className="cw-art-compare__cell cw-art-compare__cell--lose" role="cell">{lose}</div>
              <div className="cw-art-compare__cell cw-art-compare__cell--win" role="cell">{win}</div>
            </Fragment>
          ))}
        </div>
      </SectionShell>

      {/* Proof: eyebrow + heading + stat grid, then the 3-shot portfolio. */}
      <SectionShell className="cw-art-section cw-art-proof-section">
        <div className="cw-art-section__eyebrow">A real result</div>
        <h2 className="cw-art-section__heading">What this looks like when it works.</h2>
        <ChatgptStatGrid />
      </SectionShell>
      {service.portfolio && (
        <PortfolioCapsule portfolio={service.portfolio} slug={service.slug} />
      )}

      {/* Two-panel pricing duo. */}
      <ChatgptPricingDuo />

      {/* Founder bio + FAQ (existing capsules, source content). */}
      {service.made && <MadeByCapsule made={service.made} />}
      <FaqCapsule
        faqs={service.faqs}
        faqLead={service.faqLead}
        heading="The questions people ask when their business won't show up on ChatGPT."
        pageName={service.title}
        scheme="inverted"
        schemeAuto
      />

      {/* Six-step visibility timeline (bold timeline). */}
      {/* schemeAuto: the CTA below is a fixed dark band, so this one yields to
          rule 9 and renders light rather than stacking two darks. */}
      <ProcessCapsule
        heading={service.approach.heading}
        steps={service.approach.steps}
        stepLabel={(i) => `Step ${String(i + 1).padStart(2, "0")}`}
        scheme="inverted"
        schemeAuto
      />

      <CtaCapsule cta={service.cta} form={service.form} scheme="inverted" />
    </PageComposer>
  );
}
