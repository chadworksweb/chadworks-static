// Route: /design/septic/ -- the septic work of art, reproduced section by
// section and reskinned to the global tokens, under the site shell (CWS
// directive 2026-06-15). Bespoke composition (NOT the generic service
// template), in the source's order:
//   faucet hero -> why-split + mockup + 3 lanes + trust framework
//   -> methods walkthrough (intro/TOC + ch01 Services + ch02 Sitemap
//      + ch03 Wireframe=camera + ch04 Brand Kit + ch05 Sample Copy)
//   -> ch06 Visibility (ChatGPT/Google/Maps mockups)
//   -> passes-vs-fails compare -> the interactive rubric -> FAQ -> CTA.

import type { Metadata } from "next";
import { Fragment } from "react";
import { septic as service } from "@/lib/services/septic";
import {
  serviceUrl,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { SectionShell } from "@/components/capsules/SectionShell";
import { CtaCapsule, FaqCapsule, PortfolioCapsule } from "@/components/capsules";
import { WireframeCamera } from "@/components/art/WireframeCamera";
import { septicWireframe } from "@/components/art/wireframes/septic";
import { SepticHero, SepticBuild } from "@/components/septic/SepticArtSections";
import {
  SepticMethodsIntro,
  SepticServicesChapter,
  SepticSitemapChapter,
} from "@/components/septic/SepticMethods";
import { SepticBrandKit, SepticSampleCopy } from "@/components/septic/SepticBrandSample";
import { SepticVisibility } from "@/components/septic/SepticVisibility";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
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
  ["No PSMA cert or license info anywhere", "PSMA + state license + insurance above the fold"],
  ["Phone number buried in a footer image", "Sticky tap-to-call header for the emergency caller"],
  ["Inspection lumped onto the pumping page", "Routine + real-estate cert as separate ranking pages"],
  ["Service area named only in the footer", "Every local township in body text + schema"],
  ["Residential + commercial intake on one form", "Grease-trap intake separated from residential pumping"],
  ["Stock photos of generic trucks", "Real photos of your truck and crew"],
  ["Reviews on a hidden About page", "Live Google reviews embedded on the home page"],
];

export default function SepticDesignPage() {
  return (
    <PageComposer
      jsonLd={[
        buildBreadcrumbJsonLd(service),
        buildServiceJsonLd(service),
        buildFaqJsonLd(service),
      ]}
    >
      <SepticHero />
      <SepticBuild />

      {/* The "what goes into your site" walkthrough. ch03 (Wireframe) is the
          camera teardown; the other chapters are the reproduced blocks. */}
      <SectionShell reveal={false} className="cw-art-methods-section">
        <SepticMethodsIntro />
        <SepticServicesChapter />
        <SepticSitemapChapter />
        <div id="septic-ch03" className="cw-art-methods-chapter">
          <div className="cw-art-methods-chapter__intro">
            <div className="cw-art-methods-chapter__meta">
              <span className="cw-art-methods-chapter__num">03</span>
              <span className="cw-art-methods-chapter__label">Wireframe</span>
            </div>
            <h3 className="cw-art-methods-chapter__heading">
              Every page is fine-tuned for one purpose.
            </h3>
            <p className="cw-art-methods-chapter__lead">
              Below is what a routine pumping page looks like when it does two jobs
              at once: convince the homeowner with a backed-up tank to call, and
              convince Google and ChatGPT to surface you when they answer.
            </p>
          </div>
          <WireframeCamera
            sections={septicWireframe}
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
        <SepticBrandKit />
        <SepticSampleCopy />
      </SectionShell>

      <SepticVisibility />

      {/* Passes vs fails inspection */}
      <SectionShell className="cw-art-section">
        <h2 className="cw-art-section__heading">
          How your septic services website passes inspection vs. fails it.
        </h2>
        <div
          className="cw-art-compare"
          role="table"
          aria-label="Septic site: what fails inspection vs what passes"
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

      {/* The interactive six-point rubric (reuses the Scorecard config). */}
      <SectionShell className="cw-art-section">
        <h2 className="cw-art-section__heading">Inspect your current site.</h2>
        {service.problemArt}
      </SectionShell>

      <FaqCapsule
        faqs={service.faqs}
        faqLead={service.faqLead}
        pageName={service.title}
        scheme="inverted"
        schemeAuto
      />
      <CtaCapsule cta={service.cta} form={service.form} scheme="inverted" />
    </PageComposer>
  );
}
