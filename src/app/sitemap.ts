// sitemap.xml -- generated at build into the static export (GEO checklist 4).
// List every shippable, rankable route here; the path mirrors trailingSlash.
// Append new Service/Lane/situational routes as they go live.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/service";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/", // home
    // Lane hubs
    "/websites/",
    "/visibility/",
    // Websites services
    "/web-development/",
    "/web-design/",
    "/web-design-packages/",
    "/wordpress/",
    "/custom-coded-static/",
    "/ecommerce/",
    "/shopify/",
    // Visibility services
    "/ai-viz/",
    "/ai-visibility-audit/",
    "/seo/",
    "/digital-marketing/",
    "/email-marketing/",
    // Standalone pages
    "/about/",
    "/rates/",
    "/faqs/",
    // Situation pages
    "/build-your-vision/", // (Build Your Vision -- ambitious custom builds)
    "/switch/leave-wordpress/",
    "/switch/gmail-to-workspace/",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
