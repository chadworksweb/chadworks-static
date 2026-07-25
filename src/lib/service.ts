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
import type { LeadFormConfig } from "@/lib/forms";

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

// Lane 01 websites, Lane 02 visibility, Lane 03 consulting (added 2026-07-16,
// Chad). `design` is NOT a lane in the IA (which names two, now three); it sits
// in this union as a breadcrumb convenience for the specialized design pages,
// which all override `breadcrumbParent` to point at /industries-served/ or
// /my-service-areas/ rather than a /design/ hub. Do not read this union as the
// lane model -- CWS-INFORMATION-ARCHITECTURE.md is the lane model.
export type Lane = "websites" | "visibility" | "design" | "consulting";

// ---------------------------------------------------------------------
// WRITING PROMPTS -- "prompts only" authoring (ported from the chad site).
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
  // Finished prose, a prompt() placeholder, or inline markup (e.g. a step body
  // carrying a cross-link). The Approach/Process capsules render all three via <W>.
  body: Writable | ReactNode;
  // OPTIONAL mono supertitle naming what KIND of step this is ("The core move",
  // "The gate"). Read only by ActsCapsule, which needs a label the step's own
  // number cannot carry; ignored by Approach/Process (they derive "Step N").
  kind?: string;
};

export type ServiceProof = {
  // A concrete proof point: example, result, or portfolio link. No vague claims.
  label: string;
  detail?: Writable;
  href?: string;
};

export type ServiceFaq = {
  // Real question + self-contained answer (the chad-site FAQ method).
  q: string;
  a: Writable;
};

export type ServicePath = {
  // A linked route OUT of this page to a sub-option (e.g. a build option).
  // Used by hub-style services like web-development -> custom/wordpress/ecom/shopify.
  label: string;
  detail: Writable;
  href: string;
  // Decorative illustration for the lane's right column (the septic
  // industry_lane_viz pattern). Rendered aria-hidden.
  viz?: ReactNode;
};

export type Testimonial = {
  // Real client voice (social proof). quote + who said it. Use real reviews only.
  quote: Writable;
  attribution: Writable;
  // Optional headshot (e.g. "/people/mary-lynn-renner.webp"), rendered as a
  // round avatar beside the attribution. OPTIONAL on purpose: the premium
  // surfaces (homepage, web-design, web-development) run the three leads, who
  // all have one. The trade pages quote six people and only two have a photo,
  // so they pass no img and stay text-only rather than reading half-dressed.
  img?: string;
};

// --- TIERED OFFER (optional) ------------------------------------------
// A product-style Situation page (e.g. Leave Social Media / the Greenfield
// scaled to a small-business buyer) presents ONE attainable entry module plus
// stackable add-ons. Each add-on can deep-link to its own module page (often a
// stub during a spike). `price` fields are POSTURE labels, not committed
// numbers -- honesty rule holds (see buildServiceJsonLd's price-free Offer).
export type ServiceTierAddOn = {
  label: string;
  price: string; // posture label (e.g. "Add-on"), never a fake fixed number
  detail: Writable;
  href?: string; // deep-link to the module's own page
};

export type ServiceTiers = {
  heading: string;
  intro?: Writable;
  entry: {
    label: string;
    price: string; // posture label (e.g. "The entry point")
    priceSub?: string;
    detail: Writable;
    includes?: string[];
    href?: string;
  };
  addOnsLabel?: string;
  addOns: ServiceTierAddOn[];
  footnote?: Writable; // e.g. spike-placeholder pricing caveat
};

export type Service = {
  // --- identity / GEO intent (checklist 0) ---------------------------
  slug: string;            // lowercase, hyphenated, keyword-bearing
  lane: Lane;              // which lane page links to this service
  laneLabel: string;       // human label of the lane (breadcrumb)
  // OPTIONAL: override the middle breadcrumb crumb (the parent index) for pages
  // that do NOT sit under their lane hub. The flat-root design pages set this to
  // point at /industries-served/ or /my-service-areas/ instead of /lane/.
  breadcrumbParent?: { label: string; href: string };
  eyebrow: string;         // mono kicker
  title: string;           // the H1 -- matches the intent, one per page
  // OPTIONAL: a rich render of the H1 (e.g. one letter carrying a canvas fill).
  // `title` stays the plain-string source of truth for schema, breadcrumbs and
  // metadata; titleNode only changes what the hero PAINTS. Accessible text must
  // match `title` exactly.
  titleNode?: ReactNode;
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
  // A fact is finished prose, a TO-WRITE prompt, or inline markup (e.g. a fact
  // carrying an inline link). The KeyFacts capsule renders all three via <W>.
  keyFacts: (Writable | ReactNode)[];
  // OPTIONAL: indices of key facts that take the OUTLIER band color (purple
  // accent) instead of the default dark -> light ramp. Used sparingly, when one
  // fact needs to stand apart. The final band is always white (rule 10) and
  // ignores this. Empty / unset = pure ramp.
  outlierFacts?: number[];
  // OPTIONAL: extra class on the key-facts intro band, for page-scoped tweaks
  // (e.g. nudging the "at a glance" heading on a single service page).
  keyFactsIntroClassName?: string;

  // --- the canonical body sequence -----------------------------------
  // problemArt: OPTIONAL page-signature visual for the Problem section. When
  // set, the template renders IT instead of the default ribbon background +
  // knockout (which stay the web-development signature). One signature canvas/
  // visual moment per page -- see CWS-CREATIVE-ARSENAL.md.
  problemArt?: ReactNode;
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
    // hideBodyIntro drops the `body` paragraph that normally leads the panel,
    // for pages whose `paragraphs` already stand on their own.
    more?: { trigger: string; paragraphs: (ReactNode | Prompted)[]; hideBodyIntro?: boolean };
  };
  approach: { heading: string; steps: ServiceStep[] };

  // --- OPTIONAL funnel: route the reader to sub-options (hub pages) -----
  // `comingSoon` disables the lane links and greys the Explore button with a
  // "coming soon" tooltip (used while the sub-pages are still being built).
  paths?: { heading: string; intro?: Writable; items: ServicePath[]; comingSoon?: boolean };

  // --- OPTIONAL tiered offer: attainable entry module + stackable add-ons.
  // Product-style Situation pages only. Absent (and inert) on every existing
  // page. Renders via TiersCapsule, placed right after `approach`.
  tiers?: ServiceTiers;

  // OPTIONAL: concrete proof points. Absent on pages that deliberately drop the
  // "proof" section (e.g. the Leave Social Media spike + its module stubs).
  proof?: { heading: string; items: ServiceProof[] };

  // --- MADE-BY block (ported from the septic page's "Hi, I'm Chad") -----
  // The founder section: photo + caption card, manifesto rows, negation
  // list, close line, signature. Renders before Price.
  made?: {
    eyebrow?: string;
    heading: ReactNode;
    intro?: Writable;
    manifesto: { lead: string; aside: ReactNode }[];
    negation: string[];
    close?: Writable;
    img: string;
    imgAlt: string;
    captionMain: string;
    captionSub?: string;
    sig?: string;
    sigMeta?: string;
  };

  // Price -- value-based posture; no fake fixed price. `figure` + `figureSub`
  // render the septic glass-panel treatment (gradient numeral + mono sub);
  // `disclaimer` is the accent-bordered honesty note.
  price: {
    heading: string;
    figure?: string;
    figureSub?: string;
    body: Writable;
    disclaimer?: ReactNode;
  };

  // --- FAQ (checklist 1 + FAQPage schema) ----------------------------
  // Rendered as the septic-style accordion (sticky intro column + glass
  // toggle list). `faqLead` is the intro paragraph in the sticky column.
  faqLead?: Writable;
  faqs: ServiceFaq[];

  // --- conversion (checklist 7) --------------------------------------
  cta: { heading: string; body: Writable; buttonLabel: string; href: string };
  // OPTIONAL: a different button in the HERO than the one in the CTA section.
  // Absent everywhere by default, in which case the hero mirrors `cta`. Set it
  // when the hero's job is to move the reader DOWN the page (an in-page anchor
  // with `arrow: "down"`) rather than out to the contact form.
  heroCta?: { href: string; buttonLabel: string; arrow?: "right" | "down" };
  // The page's own comprehensive lead form, rendered in the RIGHT HALF of
  // the CTA section (Chad, 2026-06-11). When absent, the CTA keeps its
  // single-column button layout.
  form?: LeadFormConfig;

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
        name: s.breadcrumbParent ? s.breadcrumbParent.label : s.laneLabel,
        item: s.breadcrumbParent
          ? `${SITE_URL}${s.breadcrumbParent.href}`
          : `${SITE_URL}/${s.lane}/`,
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
