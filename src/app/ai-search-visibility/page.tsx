// Route: /ai-search-visibility/ -- a Service page. Thin by design.
// The one non-default slot: `afterHero` carries the query-shaped breakdown
// section (the ChatGPT questions buyers actually ask), placed between the hero
// and the key facts.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { aiSearchVisibility as service } from "@/lib/services/ai-search-visibility";
import {
  AiSearchFacetsCapsule,
  AiDemoSplitCapsule,
  ProblemCapsule,
  ProcessCapsule,
  PathsCapsule,
  PriceCapsule,
  FaqCapsule,
  MainContactCapsule,
  NextStepsCapsule,
  SectionShell,
} from "@/components/capsules";
import { LaunchLink } from "@/components/LaunchLink";
import { serviceUrl } from "@/lib/service";
import { isLaunched } from "@/lib/launch";

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: serviceUrl(service) },
  // Launch-driven, and REQUIRED: layout.tsx defaults every route to noindex, so being
  // in launch.ts alone would put this in the sitemap while still serving noindex.
  // The literal path, not serviceUrl(): isLaunched normalizes PATHS and returns false
  // for an absolute URL.
  robots: { index: isLaunched("/ai-search-visibility/"), follow: true },
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

export default function AiSearchVisibilityPage() {
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        // The chat mock runs SECOND, straight under the hero: the argument is
        // easier to show than to state. It moved up from the problem section,
        // so `problemArt` is dropped rather than rendering the same demo twice.
        demo: <AiDemoSplitCapsule />,
        afterHero: <AiSearchFacetsCapsule />,
        // Ribbon triad rotated one step on this page: same three brand hues,
        // moved round to the next path each.
        problem: <ProblemCapsule problem={service.problem} ribbonRotate={1} />,
        problemArt: null,
        // The retainer steps run as the bold ProcessCapsule timeline (inverted),
        // the same treatment every launched service page uses, instead of the
        // default numbered ApproachCapsule grid.
        //
        // Step 01 names the audit, which is sold on its own, so it carries a
        // cross-link to that page. /ai-visibility-audit/ is still sealed, so it
        // goes through LaunchLink: dimmed + "coming soon" on hover/focus now,
        // and a real link the moment the route lands in launch.ts.
        approach: (
          <ProcessCapsule
            pageName="AI search visibility"
            className="cw-process--nested"
            heading={service.approach.heading}
            steps={service.approach.steps.map((step, i) =>
              i === 0
                ? {
                    ...step,
                    cta: (
                      <LaunchLink href="/ai-visibility-audit/">
                        See the audit -&gt;
                      </LaunchLink>
                    ),
                  }
                : step
            )}
            scheme="inverted"
          />
        ),
        // The service lanes run the /websites/ hub treatment: each lane locks
        // itself against launch.ts (`autoSeal`), so the four routes that are not
        // live yet carry the "coming soon" tooltip instead of linking into a
        // noindex page, and the grid closes on the hubs' inverted contact lane.
        paths: (
          <PathsCapsule
            paths={service.paths!}
            className="cw-visibility-paths"
            autoSeal
            cta={{
              title: "Not sure which piece you need?",
              body: (
                <>
                  Say what you sell and who buys it. I&apos;ll tell you which of
                  these actually moves your visibility, and which you can skip.
                </>
              ),
              label: "Contact me",
              href: "#contact",
            }}
          />
        ),
        // The cost section runs the global rates band's design language rather
        // than the glass price panel: this price is one flat monthly figure, so
        // the argument holds the left column and the number sits in a rates card
        // on the right.
        price: (
          <PriceCapsule
            price={service.price}
            // Jumps to this page's own form rather than out to /contact/.
            ctaHref="#contact"
            ctaLabel="Inquire"
            variant="rates"
            cardLabel="Starting at"
            unit="/month"
          />
        ),
        // What the engagement asks of the CLIENT, straight after the number.
        // Default (white) section, so it reads as its own room between the
        // tinted price band and the qualification block.
        afterPrice: (
          <SectionShell className="svc-block">
            <p className="eyebrow">IMPORTANT - READ THIS</p>
            <h2 className="svc-block__heading">
              Client Expectations During an AI Search Visibility Campaign
            </h2>
            <p className="svc-block__body measure-prose">
              This should be seen as an investment, and one that requires input
              from you, the client. I can build the airplane but I need to know
              where to fly it, how many seats, what food to serve and what
              materials to build with, ya know? This is not a push-button
              service. It requires your knowledge, expertise and feedback on a
              regular basis. Not every day, but once a week.
            </p>
          </SectionShell>
        ),
        // "Proof, not promises" is off this page (Chad, 2026-07-29). Dropped at
        // the slot rather than deleted from the service, so the written proof
        // points stay one line away if it comes back. Nothing else reads them:
        // `proof` feeds no JSON-LD.
        proof: null,
        // Same as the composer default, plus the halftone dot field behind the
        // heading + lede. scheme/schemeAuto are restated verbatim so the rule-9
        // pass still demotes this band when the dark CTA follows it.
        faq: (
          <FaqCapsule
            faqs={service.faqs}
            faqLead={service.faqLead}
            pageName={service.title}
            halftone
            scheme="inverted"
            schemeAuto
          />
        ),
        // "Why it's safe to start" is off this page (Chad, 2026-07-29).
        assurance: null,
        // "What happens after you reach out" moves BELOW the contact section,
        // the order /web-design/ runs. That page gets it by swapping its
        // nextSteps and cta slots; this CTA carries the form, so the steps take
        // the afterCta tail slot instead and the form stays in place.
        nextSteps: null,
        // The global contact block closes the page instead of the service CTA +
        // its own form. It carries id="contact" itself, so the price button and
        // the lanes' contact card still land on it. `scheme` is restated for the
        // rule-9 pass, which reads it off the placed element.
        cta: (
          <MainContactCapsule
            heading="Want to be the answer AI assistants give out?"
            scheme="inverted"
          />
        ),
        afterCta: <NextStepsCapsule nextSteps={service.nextSteps!} />,
      }}
    />
  );
}
