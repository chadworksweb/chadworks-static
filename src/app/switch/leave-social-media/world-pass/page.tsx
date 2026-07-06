// Route: /switch/leave-social-media/world-pass/ -- STUB module page. Thin wrapper;
// copy lives (as prompt() blocks) in the module Service data.

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { lsmWorldPass as service } from "@/lib/services/leave-social-media-modules";
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

export default function LsmWorldPassPage() {
  return <ServiceTemplate service={service} />;
}
