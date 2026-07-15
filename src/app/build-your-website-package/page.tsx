// Route: /build-your-website-package/ -- the scope calculator.
//
// A LEAD MAGNET, not a service page. The tool is the whole page: a
// self-contained full-screen stage (the salt-crystal-builder container
// contract, same ~100dvh breakout the showroom uses), then the footer. No
// capsules, no service composition. The page's supporting copy will be custom
// and is not written yet.
//
// NOT in launch.ts, so the layout's noindex default keeps this spike sealed
// until Chad launches it.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { PackageBuilderStage } from "@/components/package-builder/PackageBuilderStage";

const PAGE_URL = `${SITE_URL}/build-your-website-package/`;

export const metadata: Metadata = {
  title: "Build Your Website Package -- The Scope Calculator | chadworks",
  description:
    "Move the scope and watch the number move. Assemble pages, sections, development, branding, words, and more, and see what the build actually costs. The floor is $3,200. Nothing is sent until you send it.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Build Your Website Package | chadworks",
    description:
      "Move the scope and watch the number move. See what a website build actually costs, before anyone asks for your email.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
};

export default function BuildYourWebsitePackagePage() {
  return <PackageBuilderStage />;
}
