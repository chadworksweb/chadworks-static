// Route: /build-your-vision/ -- a Situation page (renders the Service template).
// Thin by design, same 3-part pattern as every Service page.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { buildYourVision as service } from "@/lib/services/build-your-vision";
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

export default function BuildYourVisionPage() {
  return <ServiceTemplate service={service} />;
}
