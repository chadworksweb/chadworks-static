// Route: /switch/leave-social-media/ -- a product-style Situation page (the
// Greenfield scaled to a small-business buyer). Thin by design, same 3-part
// pattern as every Service page; the tiered offer lives in the Service data.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { leaveSocialMedia as service } from "@/lib/services/leave-social-media";
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

export default function LeaveSocialMediaPage() {
  return <ServiceTemplate service={service} />;
}
