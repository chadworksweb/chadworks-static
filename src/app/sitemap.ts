// sitemap.xml -- generated at build into the static export (GEO checklist 4).
// List every shippable, rankable route here; the path mirrors trailingSlash.
// Append new Service/Lane/situational routes as they go live.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/service";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/", // home
    "/web-development/",
    "/build-your-vision/", // Situation page (Build Your Vision -- ambitious custom builds)
    "/switch/leave-wordpress/", // Situation page (Leave WordPress)
    "/switch/gmail-to-workspace/", // Situation page (Gmail to Google Workspace)
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
