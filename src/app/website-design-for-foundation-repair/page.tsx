// Route: /website-design-for-foundation-repair/ -- the foundation-repair work of art,
// reproduced section by section in the SOURCE ORDER and reskinned to the global
// tokens, under the site shell (CWS directive 2026-06-15). Bespoke composition
// (NOT the generic service template), same faithful-reskin pattern as the septic
// pilot. Source order:
//   hero -> why-split + lanes + framework
//   -> methods walkthrough (intro/TOC + ch01 Services + ch02 Sitemap
//      + ch03 Wireframe=camera + ch04 Brand Kit + ch05 Sample Copy + ch06 Visibility)
//   -> compare -> portfolio -> inspect quiz -> made -> pricing -> FAQ
//   -> anti-agency email thread -> nine-step timeline -> testimonials
//   -> contact CTA -> cross-industry grid.
//
// The anti-agency email thread is the SAME real Brixhollow exchange the septic
// page shows (the foundation source reproduces it verbatim), so we reuse the
// existing SepticVoicebox component rather than duplicate it.

import type { Metadata } from "next";
import { Fragment } from "react";
import { foundationRepair as service } from "@/lib/services/foundation-repair";
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
  PriceCapsule,
  TestimonialsCapsule,
  ProcessCapsule,
} from "@/components/capsules";
import { WireframeCamera } from "@/components/art/WireframeCamera";
import { foundationWireframe } from "@/components/art/wireframes/foundation-repair";
import { FoundationHero, FoundationBuild } from "@/components/foundation/FoundationArtSections";
import {
  FoundationMethodsIntro,
  FoundationServicesChapter,
  FoundationSitemapChapter,
} from "@/components/foundation/FoundationMethods";
import { FoundationBrandKit, FoundationSampleCopy } from "@/components/foundation/FoundationBrandSample";
import { FoundationVisibility } from "@/components/foundation/FoundationVisibility";
import { SepticVoicebox } from "@/components/septic/SepticVoicebox";
import { FoundationOthers } from "@/components/foundation/FoundationOthers";
import { isLaunched } from "@/lib/launch";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // Launch-driven: indexed only while launched (see launch.ts).
  robots: { index: isLaunched("/website-design-for-foundation-repair/"), follow: true },
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
  ["4 to 6 second load on mobile", "2 to 3 seconds on a mid-range Android"],
  ["No PE engineer signoff or transferable warranty mentioned", "Engineer signoff + transferable warranty above the fold"],
  ["Every method lumped onto one Services page", "A dedicated ranking page for every method you offer"],
  ["Vague \"we install piers\"", "Helical vs. push vs. slab pier explained per page"],
  ["Stock photos of generic basements and cracks", "Real before-and-after photos of your jobs"],
  ["Phone number buried in a footer image", "Tap-to-call CTA in the sticky header"],
  ["Service area named only in the footer", "Each town named in body text + schema"],
  ["Reviews on a hidden About page", "Live Google reviews embedded on the home page"],
];

export default function FoundationDesignPage() {
  return (
    <PageComposer
      jsonLd={[
        buildBreadcrumbJsonLd(service),
        buildServiceJsonLd(service),
        buildFaqJsonLd(service),
      ]}
    >
      <FoundationHero />
      <FoundationBuild />

      {/* "What goes into your site" walkthrough. ch03 = the camera teardown. */}
      <SectionShell full reveal={false} className="cw-art-methods-section">
        <FoundationMethodsIntro />
        <FoundationServicesChapter />
        <FoundationSitemapChapter />
        <div id="foundation-ch03" className="cw-art-methods-chapter">
          <div className="cw-art-methods-chapter__intro">
            <div className="cw-art-methods-chapter__meta">
              <span className="cw-art-methods-chapter__num">03</span>
              <span className="cw-art-methods-chapter__label">Wireframe</span>
            </div>
            <h3 className="cw-art-methods-chapter__heading">
              Every page is fine tuned and robust.
            </h3>
            <p className="cw-art-methods-chapter__lead">
              Each page is built to capture the attention of both the human user
              and the algorithms of Google search and AI search platforms like
              ChatGPT, Perplexity, Gemini and Claude. Here&apos;s an example of the
              content that your <strong>Foundation Piering</strong> service page
              might contain.
            </p>
          </div>
          <WireframeCamera
            sections={foundationWireframe}
            intro={{
              eyebrow: "A teardown, section by section",
              heading: "See your site before I build it",
              lede: (
                <>
                  Scroll the sample page below. The view zooms into each section so
                  you can see what it does and why it earns its place, from the
                  sticky tap-to-call header to the schema in the footer.
                </>
              ),
            }}
          />
        </div>
        <FoundationBrandKit />
        <FoundationSampleCopy />
      </SectionShell>

      <FoundationVisibility />

      {/* Passes vs fails inspection (diagonal gradient band). */}
      <SectionShell full className="cw-art-section cw-art-compare-section">
        <h2 className="cw-art-section__heading">
          How your foundation repair website passes inspection vs. fails it.
        </h2>
        <div
          className="cw-art-compare"
          role="table"
          aria-label="Foundation repair site: what fails inspection vs what passes"
        >
          <div className="cw-art-compare__head cw-art-compare__head--lose" role="columnheader">Fails inspection</div>
          <div className="cw-art-compare__head cw-art-compare__head--win" role="columnheader">Passes inspection</div>
          {COMPARE_ROWS.map(([lose, win]) => (
            <Fragment key={win}>
              <div className="cw-art-compare__cell cw-art-compare__cell--lose" role="cell">{lose}</div>
              <div className="cw-art-compare__cell cw-art-compare__cell--win" role="cell">{win}</div>
            </Fragment>
          ))}
        </div>
      </SectionShell>

      {/* Sites I've built (real client shots, water-ripple on hover). */}
      {service.portfolio && (
        <PortfolioCapsule portfolio={service.portfolio} slug={service.slug} />
      )}

      {/* The interactive six-point rubric on the dark inverted band, two-column. */}
      <SectionShell full className="cw-art-score-section">
        <div className="cw-art-score-layout">
          <div className="cw-art-score-intro">
            <span className="cw-art-section__eyebrow">Inspect your own site</span>
            <h2 className="cw-art-section__heading">Inspect your current site.</h2>
            <p className="cw-art-score-help">
              Tap each row that applies to your site. Your score and verdict
              update as you go.
            </p>
          </div>
          <div className="cw-art-score-calc">{service.problemArt}</div>
        </div>
      </SectionShell>

      {/* Founder bio + pricing + FAQ (existing capsules, exact source content). */}
      {service.made && <MadeByCapsule made={service.made} />}
      <PriceCapsule price={service.price} ctaHref={service.cta.href} />
      <FaqCapsule
        faqs={service.faqs}
        faqLead={service.faqLead}
        heading="The best foundation repair websites all share similar aspects that make them successful. Yours will have them all and then some."
        pageName={service.title}
        scheme="inverted"
        schemeAuto
      />

      {/* The real anti-agency email thread (shared with the septic page). */}
      <SectionShell reveal={false} className="cw-art-voice-section">
        <SepticVoicebox />
      </SectionShell>

      {/* Nine-step build process (bold timeline). */}
      <ProcessCapsule
        heading={service.approach.heading}
        steps={service.approach.steps}
        scheme="inverted"
      />

      {service.testimonials && (
        <TestimonialsCapsule testimonials={service.testimonials} />
      )}

      <CtaCapsule cta={service.cta} form={service.form} scheme="inverted" />

      {/* Cross-industry network grid (full-bleed). */}
      <FoundationOthers />
    </PageComposer>
  );
}
