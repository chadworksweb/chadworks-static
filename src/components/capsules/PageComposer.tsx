// =====================================================================
// chadworks Static -- PAGE COMPOSER (the capsule-of-capsules wrapper)
// A page PLACES capsules inside <PageComposer>. The composer renders
// <PageMotion> once, emits the page-level JSON-LD passed to it, and runs the
// rule-9 scheme-adjacency pass over its capsule children before rendering them
// in order.
//
// RULE 9 (CWS-DESIGN-SYSTEM): two fully inverted (dark) sections can never be
// consecutive. Each capsule that participates declares a `scheme` prop; a
// capsule that PREFERS dark but yields (e.g. the FAQ) also sets `schemeAuto`.
// The pass demotes an auto-inverted section to "default" when the previous or
// next present section is also inverted -- replacing the old manual `faqDark`
// boolean. Fixed-inverted sections (approach, CTA, process) keep their scheme;
// if two fixed darks would still stack, we warn at build time.
// =====================================================================

import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { type Scheme, isDarkScheme } from "@/lib/capsule";
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

type SchemeProps = { scheme?: Scheme; schemeAuto?: boolean };

export function PageComposer({ jsonLd = [], children }: PageComposerProps) {
  // Flat list of placed capsule elements, in render order.
  const kids = Children.toArray(children);

  // Preferred scheme + auto flag per child (non-elements resolve to no scheme).
  const prefs: SchemeProps[] = kids.map((k) =>
    isValidElement(k) ? (k.props as SchemeProps) : {}
  );

  // Resolve schemes left-to-right, demoting auto-inverted sections that would
  // sit next to another inverted section.
  const resolved: (Scheme | undefined)[] = [];
  for (let i = 0; i < prefs.length; i++) {
    let sc = prefs[i].scheme;
    if (prefs[i].schemeAuto && isDarkScheme(sc)) {
      const prev = resolved[i - 1];
      const next = prefs[i + 1]?.scheme;
      if (isDarkScheme(prev) || isDarkScheme(next)) sc = "default";
    }
    resolved[i] = sc;
    // Build-time guard: two FIXED inverted sections still adjacent is a rule-9
    // violation the author must fix (insert a light section between them).
    if (
      i > 0 &&
      isDarkScheme(resolved[i]) &&
      isDarkScheme(resolved[i - 1]) &&
      !prefs[i].schemeAuto &&
      !prefs[i - 1].schemeAuto
    ) {
      // Name the offending pair. Without this the warning says a rule is broken
      // somewhere on some page and nothing else, which is how it survives.
      const nameOf = (n: number) => {
        const k = kids[n];
        if (!isValidElement(k)) return `child ${n}`;
        const t = k.type as { displayName?: string; name?: string } | string;
        const nm = typeof t === "string" ? t : t.displayName || t.name || "Unknown";
        const id = (k.props as { id?: string }).id;
        return id ? `${nm}#${id} (index ${n})` : `${nm} (index ${n})`;
      };
      console.warn(
        `[PageComposer] rule 9: two inverted sections are consecutive -- ` +
          `${nameOf(i - 1)} then ${nameOf(i)}. Insert a light section between them, ` +
          `or give one of them schemeAuto so it demotes itself.`
      );
    }
  }

  return (
    <>
      {/* NO PARTICLES anywhere on the site (Chad, 2026-06-11). */}
      <PageMotion />
      {jsonLd.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {kids.map((k, i) => {
        // Re-inject the resolved scheme only where the pass actually changed an
        // auto section's scheme, so untouched capsules render byte-identically.
        if (
          isValidElement(k) &&
          prefs[i].schemeAuto &&
          resolved[i] !== prefs[i].scheme
        ) {
          return cloneElement(k as React.ReactElement<SchemeProps>, {
            scheme: resolved[i],
          });
        }
        return k;
      })}
    </>
  );
}
