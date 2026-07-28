// /project-sitemap.xml -- one entry per /showroom/<slug>/ project page.
// Child of the /sitemap.xml index. See src/lib/sitemap.ts.

import { projectRoutes, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return xmlResponse(urlsetXml(projectRoutes()));
}
