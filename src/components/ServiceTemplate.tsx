// =====================================================================
// chadworks Static -- SERVICE TEMPLATE (thin composition)
// EVERY service/situation page renders through this. It is now a thin default
// composition over the global capsule layer: it hands its Service to
// composeService(), which places the canonical ordered capsule list inside
// <PageComposer> (motion + Service/FAQPage/BreadcrumbList JSON-LD). A page that
// needs to swap/drop a section passes `overrides` (e.g. web-design swaps the
// approach slot for <ProcessCapsule/>) without forking this file.
//
// See CWS-GLOBAL-CAPSULES-PLAN.md. The section markup lives in the capsules
// under src/components/capsules/; the canonical order lives in lib/compose.
// =====================================================================

import type { Service } from "@/lib/service";
import { composeService, type ServiceOverrides } from "@/lib/compose";

// Back-compat re-exports: standalone pages (about/rates/faqs) import these from
// here. They migrate to the capsule layer in Phase D; until then the imports
// keep working.
export { CtaButton } from "@/components/capsules/shared";
export { statementTone } from "@/lib/capsule";

export default function ServiceTemplate({
  service,
  overrides,
}: {
  service: Service;
  overrides?: ServiceOverrides;
}) {
  return composeService(service, overrides);
}
