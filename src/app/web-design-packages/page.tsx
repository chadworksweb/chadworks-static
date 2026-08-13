// Route: /web-design-packages/ -- a Service page. Thin by design.
//
// THE GALLERY (2026-08-13). The worked-examples section moved
// here from /how-much-does-a-website-cost/, which now shows the first three and
// links back. A package IS a named combination of calculator scope, so the
// packages are the EXAMPLES list: same data, same component, no second source
// and no invented tiers. Every figure is computed by price() at render.
//
// It goes in the `explainer` slot, which is free on this page and sits between
// approach and paths. The reader meets how a package runs, then sees thirteen
// of them priced.

import type { Metadata } from "next";
import Link from "next/link";
import ServiceTemplate from "@/components/ServiceTemplate";
import { webDesignPackages as service } from "@/lib/services/web-design-packages";
import { serviceUrl } from "@/lib/service";
import { SectionShell } from "@/components/capsules/SectionShell";
import { BuildCards } from "@/components/BuildCards";
import { EXAMPLES } from "@/lib/pricing";

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

// Dark band with transparent shape renders on it, matching how this section read
// on the cost guide. The CSS (.cw-builds / .cw-build) is global and unchanged.
function PackageGallery() {
  return (
    <SectionShell
      full
      id="packages"
      className="svc-block svc-faq-section"
      trailingClassName="svc-faq-section--dark"
    >
      <h2 className="svc-block__heading svc-fill">Website Packages and Prices</h2>
      <div className="svc-prose">
        <p>
          Each of these is a real scope, priced at build time by the same model
          behind the{" "}
          <Link href="/website-design-cost-calculator/">
            website design cost calculator
          </Link>
          . These are prices I would quote you today. If none of them is the
          shape of your project, move the scope on the calculator and the number
          follows.
        </p>
      </div>
      <BuildCards items={EXAMPLES} />
    </SectionShell>
  );
}

export default function WebDesignPackagesPage() {
  return (
    <ServiceTemplate service={service} overrides={{ explainer: <PackageGallery /> }} />
  );
}
