// =====================================================================
// chadworks Static -- PAGE COMPOSER (the capsule-of-capsules wrapper)
// A page PLACES capsules inside <PageComposer>. The composer renders
// <PageMotion> once and emits the page-level JSON-LD passed to it, then the
// capsule children in order.
//
// Phase A: motion + page JSON-LD + children (matches the old template prelude
// exactly: PageMotion, then the JSON-LD <script> tags, then the sections).
// Phase C will add the rule-9 scheme-adjacency pass over the children here,
// replacing the manual `faqDark` boolean in the template.
// =====================================================================

import type { ReactNode } from "react";
import { PageMotion } from "@/components/PageMotion";

// Inline structured data. dangerouslySetInnerHTML is the standard, safe pattern
// for JSON-LD (the payload is our own static data, no user input). Skips
// rendering when a builder returns null (e.g. no written FAQs yet). Exported so
// pages/capsules that need a one-off script can reuse it.
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type PageComposerProps = {
  // Page-level structured data, emitted in order before the sections (e.g.
  // BreadcrumbList, Service, FAQPage, AboutPage, Person). Nulls are skipped.
  jsonLd?: Array<object | null>;
  children: ReactNode;
};

export function PageComposer({ jsonLd = [], children }: PageComposerProps) {
  return (
    <>
      {/* NO PARTICLES anywhere on the site (Chad, 2026-06-11). */}
      <PageMotion />
      {jsonLd.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {children}
    </>
  );
}
