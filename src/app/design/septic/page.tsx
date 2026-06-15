// Route: /design/septic/ -- the septic work of art, reproduced section by
// section and reskinned to the global tokens, under the site shell (CWS
// directive 2026-06-15). Bespoke composition (NOT the generic service template):
// faucet hero -> why-split + browser mockup + three lanes + trust framework ->
// the WireframeCamera teardown -> the CTA + lead form. The remaining source
// sections (the six-chapter methods walkthrough, compare, rubric, reviews,
// ChatGPT mockup, FAQ) follow this same pattern.

import type { Metadata } from "next";
import { septic as service } from "@/lib/services/septic";
import {
  serviceUrl,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/service";
import { PageComposer } from "@/components/capsules/PageComposer";
import { SectionShell } from "@/components/capsules/SectionShell";
import { CtaCapsule } from "@/components/capsules";
import { WireframeCamera } from "@/components/art/WireframeCamera";
import { septicWireframe } from "@/components/art/wireframes/septic";
import { SepticHero, SepticBuild } from "@/components/septic/SepticArtSections";

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
      <SectionShell reveal={false} id="teardown">
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
      </SectionShell>
      <CtaCapsule cta={service.cta} form={service.form} scheme="inverted" />
    </PageComposer>
  );
}
