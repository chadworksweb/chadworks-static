// /page-sitemap.xml -- the launched, indexable routes from launch.ts.
// Child of the /sitemap.xml index. See src/lib/sitemap.ts.

import { pageRoutes, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return xmlResponse(urlsetXml(pageRoutes()));
}
