// Route: /switch/squarespace-to-static/ -- a switch-lane Situation page
// (renders the Service template through the capsule layer). Thin by design.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { squarespaceToStatic as service } from "@/lib/services/squarespace-to-static";
import { serviceUrl } from "@/lib/service";

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

export default function SquarespaceToStaticPage() {
  return <ServiceTemplate service={service} />;
}
