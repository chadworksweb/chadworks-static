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
  // Chad, 2026-07-30. This is the founding date of chadworks THE STUDIO, not
  // the length of Chad's career (which is longer, and belongs on the Person
  // node if it is ever asserted). Every off-site profile that carries a
  // founded/since field must say 2021 too -- LinkedIn, Crunchbase, and later
  // Wikidata all get cross-checked against each other, and a mismatch is the
  // cheapest way to break the entity resolution this whole pass exists to build.
  foundingDate: "2021",
  numberOfEmployees: 1,
  // The canonical one-paragraph description of the studio. This is the SAME
  // string used on every off-site placement (LinkedIn, Crunchbase, GitHub,
  // directory rows) -- see CHADWORKS-PLACEMENT-ASSETS.md blurb 1d. Consistent
  // wording across surfaces is itself an entity-resolution signal, so change it
  // in both places or in neither. Sentence one restates the manifesto intro
  // that renders on / and /about/, which keeps it inside the "schema must
  // match visible content" rule.
  description:
    "chadworks is a one-person web studio run by Chad Lewine. It builds custom coded websites and platforms for motivated individuals and organizations that want to double down on authentic digital presence as a counter measure to social media burnout and AI saturation. Every build is written from scratch. No Squarespace, no Wix, no Divi, no Elementor, no templates, no retainers.",
  // Both are already published in the footer and on /contact/, so the schema
  // only restates what a visitor can see (the toolkit's "schema must match
  // visible content" rule).
  email: "chad@chadworks.co",
  telephone: "+1-215-872-1240",
  // NATIONAL, deliberately. chadworks is not run as a local-search business and
  // is not targeting Greater Philadelphia as a market (Chad, 2026-07-28), so
  // there is no LocalBusiness node, no address, and no metro areaServed here.
  // "US" is the same claim /contact/'s ContactPage already makes and the same
  // one /faqs/ makes in prose ("clients across the USA").
  areaServed: "US",
  // THE LEDGER. This array is no longer empty (it was, through 2026-07-28, when
  // the studio ran no profiles of its own). It is now the running record of
  // every off-site profile that IS chadworks the organization, added one at a
  // time as each placement in CHADWORKS-PLACEMENT-MAP.md lands. Populating it is
  // the entire payoff of the Part 1 hygiene pass: a claimed profile nobody has
  // asserted ownership of is just a page, and a sameAs turns it into evidence.
  //
  // THE ONE RULE: a URL goes here only if the profile IS THE ORGANIZATION.
  // Profiles that are Chad Lewine the person (personal LinkedIn, GitHub user,
  // MusicBrainz, bylines, speaker pages) go on PERSON.sameAs below. Asserting a
  // person's profile as an organization's sameAs fuses two entities that are not
  // the same thing, which is the fragmentation jsonld.ts exists to prevent.
  sameAs: [
    // Company Page, created 2026-07-30. Slug was free, so the handle matches the
    // studio name exactly.
    "https://www.linkedin.com/company/chadworks",
    // GitHub ORG (not Chad's personal account, which is `chadlewine` and belongs
    // on PERSON.sameAs if it is ever asserted). Profile README added 2026-07-30
    // via the `.github` repo at profile/README.md.
    "https://github.com/chadworksweb",
    // Crunchbase, created 2026-07-31 (placement map Part 1, item 7). Nofollow,
    // but Crunchbase is verifiably cited by ChatGPT and Perplexity for company
    // queries, which is the whole reason it is here. Filled completely rather
    // than stubbed: a half-empty row on a DR 90 domain gets cited half-empty.
    // Its `legalName` field was deliberately left BLANK there, matching this
    // file's position that nothing is filed under the name yet -- revisit both
    // when the LLC files (Chad, 2026-07-31).
    "https://www.crunchbase.com/organization/chadworks",
    // Reddit, added 2026-07-31. ORG rather than PERSON, deliberately: the handle
    // is `chadworksweb`, which is the STUDIO's fallback handle (it matches the
    // GitHub org, not Chad's personal `chadlewine` account), so this is the
    // studio's voice rather than Chad's. Reddit has no organization account
    // type, only users, so the judgment is about how the account is OPERATED.
    // Move it to PERSON if it ever becomes Chad posting as himself.
    //
    // Note the placement map's read on Reddit: every link there is nofollow, and
    // the value is entity mention plus months of answering well, not the link.
    // This sameAs is the entity half of that; it does not replace the work.
    "https://www.reddit.com/user/chadworksweb/",
    // Contra STUDIO profile. This is the organization's Contra presence, which
    // is why it sits here rather than on PERSON alongside Chad's individual
    // profile (contra.com/chadlewine, which stays below as a separate identity).
    "https://contra.com/studio/chadworks",
  ] as string[],
} as const;

// Person identity -- Chad Lewine, the founder. Separate from ORG on purpose:
// sameAs is an identity claim ("this profile IS this entity"), so the two
// cannot share one array. jsonld.ts emits these as two @id'd nodes linked by
// founder/employee/worksFor.
export const PERSON = {
  name: "Chad Lewine",
  jobTitle: "Web Designer and Developer",
  // The ONLY social profile anywhere in the entity graph, deliberately.
  // Profiles that ARE Chad Lewine the person. The studio's own profiles go on
  // ORG.sameAs above -- see the ledger rule there.
  sameAs: [
    "https://www.linkedin.com/in/chadlewine/",
    // Personal GitHub account. Deliberately NOT on ORG.sameAs: the org is
    // `chadworksweb`, and asserting a person's account as the organization
    // would fuse two entities that are not the same thing. Note the account
    // currently hosts no public repos -- the chadlewine.com codebase was moved
    // to chadworksweb/chadlewine on 2026-07-30 so it could be pinned with the
    // rest of the portfolio. This stays because sameAs is an identity claim
    // ("this account IS Chad Lewine"), which is true regardless of contents.
    "https://github.com/chadlewine",
    // Contra, created 2026-07-31. Server-rendered, indexable, no noindex, and
    // Contra's robots.txt declares `ai-train=no, search=yes, ai-input=yes` --
    // the same training-vs-retrieval split this site adopted in robots.ts, so
    // the profile is reachable by the retrieval crawlers that matter.
    //
    // PERSON, not ORG, and the URL is the reason: Contra separates individual
    // profiles (`/handle`) from studio profiles (`/studio/handle`). This is the
    // individual one. The chadworks STUDIO profile at contra.com/studio/chadworks
    // exists but was still unpublished (404 to a logged-out visitor) as of
    // 2026-07-31; when it goes public it belongs on ORG.sameAs above, not here.
    //
    // The handle was changed from Contra's auto-generated `chad_lewine_ldkphbbg`
    // BEFORE this URL was asserted anywhere. sameAs is a durable identity claim,
    // so a handle carrying a random suffix would have rotted the moment it was
    // cleaned up. The old URL 301s here, verified.
    "https://contra.com/chadlewine",
  ] as string[],
} as const;

// Lane 01 websites, Lane 02 visibility, Lane 03 consulting (added 2026-07-16,
// Chad). `design` is NOT a lane in the IA (which names two, now three); it sits
// in this union as a breadcrumb convenience for the specialized design pages,
// which all override `breadcrumbParent` to point at /industries-served/ rather
// than a /design/ hub. (It used to also point at /my-service-areas/; the geo
// pages were scrapped 2026-07-28.) Do not read this union as the lane model --
// CWS-INFORMATION-ARCHITECTURE.md is the lane model.
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
  // A plain string in almost every case. JSX is allowed for an answer that
  // needs an inline link, and THEN `aText` is required: the FAQPage schema
  // lifts this value into acceptedAnswer.text, and a JSX node would serialize
  // an object into the structured data. Same split /faqs/ already runs.
  a: Writable | ReactNode;
  // Plain-text mirror of a JSX answer, for the schema only.
  aText?: string;
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
  // point at /industries-served/ instead of /lane/.
  breadcrumbParent?: { label: string; href: string };
  eyebrow: string;         // mono kicker
  // OPTIONAL: a rich render of the kicker (e.g. one word in italic). `eyebrow`
  // stays the plain-string source of truth; eyebrowNode only changes what the
  // hero PAINTS, and its text must read the same.
  eyebrowNode?: ReactNode;
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
    // ReactNode as well as Writable, matching `hero.body` and `faqs.a`, so a
    // price paragraph can carry an inline link. Nothing reads this field for
    // JSON-LD (buildServiceJsonLd emits a price-free Offer), so widening it
    // cannot leak markup into structured data.
    body: Writable | ReactNode;
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
  // `null` drops the hero button entirely (a hero that hands off to the section
  // below it rather than to a link).
  heroCta?: { href: string; buttonLabel: string; arrow?: "right" | "down" } | null;
  // OPTIONAL: a SECOND hero button, rendered as the ghost/outline treatment
  // beside the first. HeroCapsule has always been able to draw it (standalone
  // pages like the cost guide pass `ctaSecondary` directly); this is the field
  // that lets a Service-driven page ask for one too.
  // Use it when the hero has two honest next moves -- typically the primary
  // sends the reader DOWN this page and the secondary sends them ACROSS to a
  // sibling page. Ignored when `heroCta` is null, since there is no first
  // button for it to sit beside.
  heroCtaSecondary?: { href: string; buttonLabel: string; arrow?: "right" | "down" };
  // The page's own comprehensive lead form, rendered in the RIGHT HALF of
  // the CTA section (Chad, 2026-06-11). When absent, the CTA keeps its
  // single-column button layout.
  form?: LeadFormConfig;

  // --- OPTIONAL conversion-support sections (see CWS-SERVICE-PAGE-CHECKLIST.md) ---
  testimonials?: { heading: string; items: Testimonial[] };           // social proof
  qualification?: {                                                   // who it's for / not
    heading: string;
    fitLabel?: string;
    // Strings, or JSX for a line that carries an inline link. The capsule
    // renders these through <W/>, which already takes a ReactNode; nothing
    // lifts them into structured data, unlike the FAQ answers.
    fit: (Writable | ReactNode)[];
    notLabel?: string;
    notFit: (Writable | ReactNode)[];
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

// The canonical Organization @id, written literally rather than imported from
// lib/jsonld.ts -- that module imports THIS one, so importing back would close
// a cycle. Keep the string in step with jsonld.ts's ORG_ID.
const ORG_REF = { "@id": `${SITE_URL}/#organization` } as const;

export function buildServiceJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.meta.description,
    url: serviceUrl(s),
    serviceType: s.title,
    provider: ORG_REF,
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
  // Schema text is the string answer, or `aText` when the rendered answer is
  // JSX. An answer that is neither (a Prompt, or JSX with no aText) is left OUT
  // rather than stringified -- "[object Object]" in acceptedAnswer is exactly
  // the kind of thing an assistant would quote back.
  const written = s.faqs
    .filter((f) => !isPrompt(f.a))
    .map((f) => ({ q: f.q, text: typeof f.a === "string" ? f.a : f.aText }))
    .filter((f): f is { q: string; text: string } => typeof f.text === "string");
  if (written.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: written.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.text },
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
