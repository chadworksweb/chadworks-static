// Route: /website-design-for-lansdale-pa/ -- a Service page. Thin by design:
// import the Service data, set metadata from it, render the shared template.
// Every Service page follows this exact 3-part pattern.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { lansdale as service } from "@/lib/services/design-city-lansdale";
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

export default function LansdaleDesignPage() {
  return <ServiceTemplate service={service} />;
}
