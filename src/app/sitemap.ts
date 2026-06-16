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
    // ChatGPT ports (own flat pages at their old URLs)
    "/show-up-on-chatgpt/",
    "/advertising-on-chatgpt/",
    // Standalone pages
    "/about/",
    "/rates/",
    "/faqs/",
    "/contact/",
    // Situation pages
    "/build-your-vision/", // (Build Your Vision -- ambitious custom builds)
    "/switch/leave-wordpress/",
    "/switch/gmail-to-workspace/",
    "/switch/squarespace-to-static/",
    "/switch/wix-to-static/",
    "/switch/godaddy-to-static/",
    // Industry web design -- flat root slugs (match the old live URLs) + index
    "/my-industry-specialties/",
    "/website-design-for-septic-services/",
    "/website-design-for-foundation-repair/",
    "/website-design-for-tree-companies/",
    "/website-design-for-bands-musicians/",
    "/web-design-for-authors/",
    "/music-industry-web-design/",
    "/web-design-for-pa-preferred-members/",
    // Local PA web design -- flat root slugs (match the old live URLs) + index
    "/my-service-areas/",
    "/website-design-for-norristown-pa/",
    "/website-design-for-ambler-pa/",
    "/website-design-for-lansdale-pa/",
    "/website-design-for-conshohocken-pa/",
    "/website-design-for-doylestown-pa/",
    "/website-design-for-lancaster-pa/",
    "/website-design-for-pottstown-pa/",
    "/website-design-for-collegeville-pa/",
    "/website-design-for-phoenixville-pa/",
    // Portfolio
    "/portfolio/",
    // Legal
    "/terms-of-service/",
    "/privacy-policy/",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
