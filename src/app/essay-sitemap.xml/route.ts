// /essay-sitemap.xml -- one entry per published essay.
// Child of the /sitemap.xml index. See src/lib/sitemap.ts.

import { essayRoutes, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return xmlResponse(urlsetXml(essayRoutes()));
}
