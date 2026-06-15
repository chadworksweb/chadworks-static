// Route: /advertising-on-chatgpt/ -- a Service page, ported from the live niche
// page (decision #7: own flat page at the old URL, 1:1 carryover). The approach
// slot renders as the bold ProcessCapsule timeline (the managed-campaign launch
// sequence).

import type { Metadata } from "next";
import ServiceTemplate from "@/components/ServiceTemplate";
import { advertisingOnChatgpt as service } from "@/lib/services/advertising-on-chatgpt";
import { serviceUrl } from "@/lib/service";
import { ProcessCapsule } from "@/components/capsules";

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

export default function AdvertisingOnChatgptPage() {
  return (
    <ServiceTemplate
      service={service}
      overrides={{
        approach: (
          <ProcessCapsule
            heading="From eligible to live, step by step"
            steps={service.approach.steps}
            scheme="inverted"
          />
        ),
      }}
    />
  );
}
