// =====================================================================
// chadworks Static -- THE SERVICE ENTITY (the atomic unit)
// A Service is the first-class, self-contained content unit. Every Service
// page is data fed to <ServiceTemplate>. Lanes, packages, and Situation
// pages compose from / funnel into Services. See CWS-INFORMATION-ARCHITECTURE.md.
//
// Canonical shape (the template renders this sequence, always, in order):
//   hero -> key facts -> problem -> approach -> proof -> price posture -> faq -> cta
//
// This shape is also the GEO spine: answer-first lede, extractable key facts,
// self-contained FAQ, and JSON-LD (Service + FAQPage + BreadcrumbList).
// =====================================================================

import type { ReactNode } from "react";

export const SITE_URL = "https://chadworks.co";

// Organization identity -- kept consistent site-wide (GEO checklist 2 + 6).
export const ORG = {
  name: "chadworks",
  legalName: "chadworks",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  founder: "Chad Lewine",
  sameAs: [] as string[],
} as const;

export type Lane = "websites" | "visibility";

// ---------------------------------------------------------------------
// WRITING PROMPTS -- "prompts only" authoring (ported from chadlewine).
// A content field holds EITHER finished prose (string / ReactNode) OR a
// prompt() placeholder. The template renders prompts as visible amber
// "TO WRITE" blocks (see <Prompt>), so Chad writes the real copy in his
// own voice. Prompts are excluded from JSON-LD until written.
// ---------------------------------------------------------------------
export type Prompted = { __prompt: true; label: string; brief: string };

export function prompt(label: string, brief: string): Prompted {
  return { __prompt: true, label, brief };
}

export function isPrompt(v: unknown): v is Prompted {
  return (
    typeof v === "object" && v !== null && (v as Prompted).__prompt === true
  );
}

// A text field that may be written (string) or still a prompt().
export type Writable = string | Prompted;

// For JSON-LD: the written string, or null when still a prompt (skip it).
export function asText(v: Writable): string | null {
  return isPrompt(v) ? null : v;
}

export type ServiceStep = {
  // One step in the approach. Title is a crisp claim an AI can lift.
  title: string;
  body: Writable;
};

export type ServiceProof = {
  // A concrete proof point: example, result, or portfolio link. No vague claims.
  label: string;
  detail: Writable;
  href?: string;
};

export type ServiceFaq = {
  // Real question + self-contained answer (Chad-Lewine FAQ method).
  q: string;
  a: Writable;
};

export type ServicePath = {
  // A linked route OUT of this page to a sub-option (e.g. a build option).
  // Used by hub-style services like web-development -> custom/wordpress/ecom/shopify.
  label: string;
  detail: Writable;
  href: string;
};

export type Testimonial = {
  // Real client voice (social proof). quote + who said it. Use real reviews only.
  quote: Writable;
  attribution: Writable;
};

export type Service = {
  // --- identity / GEO intent (checklist 0) ---------------------------
  slug: string;            // lowercase, hyphenated, keyword-bearing
  lane: Lane;              // which lane page links to this service
  laneLabel: string;       // human label of the lane (breadcrumb)
  eyebrow: string;         // mono kicker
  title: string;           // the H1 -- matches the intent, one per page
  intent: string;          // one sentence: primary entity + the question answered

  // --- answer-first lede (checklist 1): quotable in first 100 words ---
  // ReactNode so a service can drop an inline cross-link into the lede
  // (e.g. web-development -> web-design). A plain string is valid, or a
  // prompt() placeholder for unwritten copy.
  answer: ReactNode | Prompted;

  // Optional decorative hero illustration (sits in the hero's right third,
  // behind the text). Purely visual -- not content, so it's authored, not prompted.
  heroArt?: ReactNode;

  // --- TL;DR / key facts: extractable chunks an engine can summarize --
  // Optional keyword-bearing heading (an <h2> is a GEO signal). Defaults to
  // "At a glance" in the template when a service doesn't set one.
  keyFactsHeading?: string;
  keyFacts: Writable[];
  // OPTIONAL: indices of key facts that take the OUTLIER band color (purple
  // accent) instead of the default dark -> light ramp. Used sparingly, when one
  // fact needs to stand apart. The final band is always white (rule 10) and
  // ignores this. Empty / unset = pure ramp.
  outlierFacts?: number[];

  // --- the canonical body sequence -----------------------------------
  problem: {
    heading: string;
    subheading?: string;
    body: Writable;
    // OPTIONAL: lift the prose off the ribbon background into an on-demand
    // frosted disclosure. When set, the template renders a CTA trigger (instead
    // of the inline body) that pops a frosted panel with the expanded copy --
    // legible because it's a deliberate opened surface, not a permanent scrim.
    // `body` stays the one-line summary / no-disclosure fallback.
    // Paragraphs are ReactNode so lead words can carry inline <strong>.
    more?: { trigger: string; paragraphs: (ReactNode | Prompted)[] };
  };
  approach: { heading: string; steps: ServiceStep[] };

  // --- OPTIONAL funnel: route the reader to sub-options (hub pages) -----
  paths?: { heading: string; intro?: Writable; items: ServicePath[] };

  proof: { heading: string; items: ServiceProof[] };
  price: { heading: string; body: Writable }; // value-based posture; no fake fixed price

  // --- FAQ (checklist 1 + FAQPage schema) ----------------------------
  faqs: ServiceFaq[];

  // --- conversion (checklist 7) --------------------------------------
  cta: { heading: string; body: Writable; buttonLabel: string; href: string };

  // --- OPTIONAL conversion-support sections (see CWS-SERVICE-PAGE-CHECKLIST.md) ---
  testimonials?: { heading: string; items: Testimonial[] };           // social proof
  qualification?: {                                                   // who it's for / not
    heading: string;
    fitLabel?: string;
    fit: Writable[];
    notLabel?: string;
    notFit: Writable[];
  };
  assurance?: { heading: string; items: Writable[] };                 // risk reversal
  nextSteps?: { heading: string; steps: ServiceStep[] };              // what happens next

  // Portfolio shots with the water-ripple cursor effect (WaterShot).
  portfolio?: {
    heading: string;
    intro?: Writable;
    items: { label: string; img: string; alt: string; href?: string }[];
  };

  // --- metadata (checklist 3) ----------------------------------------
  meta: { title: string; description: string };
};

// ---------------------------------------------------------------------
// JSON-LD builders -- emitted inline in the static HTML (checklist 2 + 4).
// Returned as plain objects; the template serializes them into a
// <script type="application/ld+json"> tag.
// ---------------------------------------------------------------------

export function serviceUrl(s: Service): string {
  return `${SITE_URL}/${s.slug}/`;
}

// Site-wide Organization identity (GEO checklist 2 + 6). Emitted once in the
// root layout so every page carries a consistent provider entity. `sameAs`
// fills in as real profiles are confirmed; `logo` points at /logo.png (asset
// pending -- add before ship).
export function buildOrgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    founder: { "@type": "Person", name: ORG.founder },
    ...(ORG.sameAs.length ? { sameAs: ORG.sameAs } : {}),
  };
}

export function buildServiceJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.meta.description,
    url: serviceUrl(s),
    serviceType: s.title,
    provider: {
      "@type": "Organization",
      name: ORG.name,
      url: ORG.url,
    },
    // Value-based posture: an Offer with no fixed price, not a fake number.
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: serviceUrl(s),
    },
  };
}

// Only WRITTEN answers go into FAQPage schema. Returns null if none are
// written yet (the template then skips emitting the FAQ JSON-LD entirely).
export function buildFaqJsonLd(s: Service) {
  const written = s.faqs.filter((f) => !isPrompt(f.a));
  if (written.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: written.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a as string },
    })),
  };
}

export function buildBreadcrumbJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: s.laneLabel,
        item: `${SITE_URL}/${s.lane}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: s.title,
        item: serviceUrl(s),
      },
    ],
  };
}
