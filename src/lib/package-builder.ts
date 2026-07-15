// =====================================================================
// chadworks Static -- PACKAGE BUILDER MODEL (pure, no React)
// The scope model behind /build-your-website-package/. Two jobs:
//   1. price(scope)  -> the number
//   2. channels(scope) -> the screen augmentation each scope layer drives
// Kept pure so the pricing can be tuned (and eventually tested) without
// touching the renderer. SPIKE: every number in TUNING is a placeholder
// posture, not locked economics. The only locked figures are the $3,200
// floor and the ~$6,200 typical (see lib/services/web-design-packages).
// =====================================================================

// ---------------------------------------------------------------------
// TUNING -- the whole pricing surface, in one block, on purpose.
// ---------------------------------------------------------------------
export const BASE = 3200; // the floor build: 3 pages, clean and correct

const PER_PAGE = 260; // each page past the 3 the base covers
const PAGES_INCLUDED = 3;
const PER_SECTION = 55; // each section per page past the 4 the base covers
const SECTIONS_INCLUDED = 4;
const PER_INTEGRATION = 450;
const PER_LOCALE = 800; // each locale past the first

// Step ladders. Index = the option index on that parameter.
const FANCY = [0, 400, 1100, 2200, 3600];
const MATH_DEV = [0, 600, 1800, 4200, 9000];
const BRANDING_DONE = [1400, 800, 150, 0]; // nothing done -> full system in hand
const CONTENT_PER_PAGE = [0, 60, 140, 240]; // you have it -> I write every word
const EDITABILITY = [0, 500, 1200, 2000];
const MOTION = [0, 500, 1400, 3000, 6000];
const COMMERCE = [0, 900, 2200, 4500, 9000];
const GEO = [0, 600, 1500, 3000];
const TIMELINE_MULT = [1, 1.15, 1.35]; // applied to the whole build, last

// ---------------------------------------------------------------------
// SCOPE
// ---------------------------------------------------------------------
export type Scope = {
  pages: number;
  sections: number; // per page
  fancy: number;
  mathDev: number;
  brandingDone: number;
  content: number;
  editability: number;
  motion: number;
  commerce: number;
  integrations: number;
  geo: number;
  timeline: number;
  locales: number;
};

// The floor build. Every ladder sits at the index that adds nothing, so an
// untouched builder reads exactly BASE.
export const FLOOR: Scope = {
  pages: PAGES_INCLUDED,
  sections: SECTIONS_INCLUDED,
  fancy: 0,
  mathDev: 0,
  brandingDone: 3,
  content: 0,
  editability: 0,
  motion: 0,
  commerce: 0,
  integrations: 0,
  geo: 0,
  timeline: 0,
  locales: 1,
};

// ---------------------------------------------------------------------
// PARAMETER TABLE -- drives the controls AND the ledger labels.
// `kind: "range"` renders a slider; `kind: "steps"` renders option chips.
// ---------------------------------------------------------------------
export type Param = {
  key: keyof Scope;
  label: string;
  hint: string;
  kind: "range" | "steps";
  min?: number;
  max?: number;
  options?: string[];
};

export const PARAMS: Param[] = [
  {
    key: "pages",
    label: "Pages",
    hint: "How many pages earn their place.",
    kind: "range",
    min: 1,
    max: 24,
  },
  {
    key: "sections",
    label: "Sections per page",
    hint: "How much each page has to say.",
    kind: "range",
    min: 2,
    max: 10,
  },
  {
    key: "fancy",
    label: "How fancy",
    hint: "How far the visual treatment goes.",
    kind: "steps",
    options: ["Plain", "Clean", "Considered", "Rich", "The full chadworks"],
  },
  {
    key: "mathDev",
    label: "Math and development",
    hint: "Custom logic under the hood.",
    kind: "steps",
    options: ["None", "A little", "Real features", "An application", "Rising Compass"],
  },
  {
    key: "brandingDone",
    label: "Branding already done",
    hint: "What you bring versus what I build.",
    kind: "steps",
    options: ["Nothing yet", "A logo", "A brand guide", "A full system"],
  },
  {
    key: "content",
    label: "Words",
    hint: "Who writes the copy.",
    kind: "steps",
    options: ["I have it", "Cleanup", "Most of it", "Every word"],
  },
  {
    key: "editability",
    label: "Who edits it",
    hint: "How much you change without me.",
    kind: "steps",
    options: ["I handle edits", "Light content", "Most of the page", "Everything"],
  },
  {
    key: "motion",
    label: "Motion",
    hint: "How alive the thing feels.",
    kind: "steps",
    options: ["Still", "Subtle", "Animated", "Interactive", "Showroom grade"],
  },
  {
    key: "commerce",
    label: "Selling",
    hint: "What the site sells and how.",
    kind: "steps",
    options: ["Nothing", "A few products", "A real store", "A catalog", "A platform"],
  },
  {
    key: "integrations",
    label: "Integrations",
    hint: "Booking, CRM, memberships, APIs.",
    kind: "range",
    min: 0,
    max: 8,
  },
  {
    key: "geo",
    label: "AI visibility",
    hint: "Whether the machines can read and cite you.",
    kind: "steps",
    options: ["Skip it", "The basics", "Structured", "The full pass"],
  },
  {
    key: "timeline",
    label: "Timeline",
    hint: "Rush costs money. It always has.",
    kind: "steps",
    options: ["Normal", "Tightened", "Rush"],
  },
  {
    key: "locales",
    label: "Languages",
    hint: "Each one is another site to keep true.",
    kind: "range",
    min: 1,
    max: 6,
  },
];

// ---------------------------------------------------------------------
// PRICING
// ---------------------------------------------------------------------
const at = (ladder: number[], i: number) =>
  ladder[Math.max(0, Math.min(ladder.length - 1, Math.round(i)))];

export type LedgerLine = { label: string; amount: number };

// The itemized build. `subtotal` is pre-timeline; the timeline multiplier
// applies to the whole thing last, because rush taxes the entire build and
// not any single line of it.
export function ledger(s: Scope): LedgerLine[] {
  const extraPages = Math.max(0, s.pages - PAGES_INCLUDED);
  const extraSections = Math.max(0, s.sections - SECTIONS_INCLUDED);
  const lines: LedgerLine[] = [
    { label: "The floor build", amount: BASE },
    { label: `Pages past ${PAGES_INCLUDED}`, amount: extraPages * PER_PAGE },
    {
      label: `Sections past ${SECTIONS_INCLUDED}`,
      amount: extraSections * PER_SECTION * s.pages,
    },
    { label: "How fancy", amount: at(FANCY, s.fancy) },
    { label: "Math and development", amount: at(MATH_DEV, s.mathDev) },
    { label: "Branding to build", amount: at(BRANDING_DONE, s.brandingDone) },
    { label: "Words", amount: at(CONTENT_PER_PAGE, s.content) * s.pages },
    { label: "Who edits it", amount: at(EDITABILITY, s.editability) },
    { label: "Motion", amount: at(MOTION, s.motion) },
    { label: "Selling", amount: at(COMMERCE, s.commerce) },
    { label: "Integrations", amount: s.integrations * PER_INTEGRATION },
    { label: "AI visibility", amount: at(GEO, s.geo) },
    { label: "Languages", amount: Math.max(0, s.locales - 1) * PER_LOCALE },
  ];
  return lines.filter((l) => l.amount > 0);
}

export function subtotal(s: Scope): number {
  return ledger(s).reduce((sum, l) => sum + l.amount, 0);
}

export function price(s: Scope): number {
  const mult = at(TIMELINE_MULT, s.timeline);
  // Round to the nearest $50 so the readout reads like a quote, not a sum.
  return Math.round((subtotal(s) * mult) / 50) * 50;
}

export function rushPremium(s: Scope): number {
  return price(s) - Math.round(subtotal(s) / 50) * 50;
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

// ---------------------------------------------------------------------
// SCREEN CHANNELS -- the augmentation each scope layer drives.
//
// Every value here is consumed by PackageScreen as a shader uniform or a
// geometry input, so a scope change morphs the object itself rather than
// decorating it. One scope layer, one channel:
//
//   pages        -> scale        (the screen gets bigger)
//   sections     -> strata       (each section stacks another layer)
//   fancy        -> bevel        (a plain edge cuts into a jeweled one)
//   mathDev      -> depth        (thickness: real machinery underneath)
//   brandingDone -> tint         (grey and unresolved -> full brand)
//   content      -> washC        (the wash gains its third color)
//   editability  -> sheen        (surface you can touch)
//   motion       -> spin         (how alive it is)
//   commerce     -> washB        (copper enters the wash)
//   integrations -> spectrum     (more systems, more chromatic split)
//   geo          -> washA        (the halo the machines read it by)
//   timeline     -> pulse        (rush reads as urgency)
//   locales      -> spread       (the strata fan apart: parallel sites)
//
// `fancy` also drives polish (grain, inverted), because refinement and edge
// treatment are the same idea seen twice. That is the one deliberate double.
// ---------------------------------------------------------------------
export type Channels = {
  scale: number;
  strata: number;
  spread: number;
  bevel: number;
  depth: number;
  grain: number;
  tint: [number, number, number];
  washA: [number, number, number];
  washB: [number, number, number];
  washC: [number, number, number];
  sheen: number;
  spin: number;
  pulse: number;
  spectrum: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const norm = (v: number, min: number, max: number) =>
  Math.max(0, Math.min(1, (v - min) / (max - min)));

// Brand anchors. These mirror the CSS color tokens; they are NOT imported from
// the gem's core, on purpose (see package-screen-core's isolation note).
const GREY: [number, number, number] = [0.62, 0.62, 0.66];
const WHITE: [number, number, number] = [1, 1, 1];
const BRAND: [number, number, number] = [0.502, 0.329, 0.737]; // #8054bc
const LILAC: [number, number, number] = [0.898, 0.824, 0.957]; // #e5d2f4
const COPPER: [number, number, number] = [0.831, 0.647, 0.455]; // #d4a574
const INDIGO: [number, number, number] = [0.141, 0.224, 0.537]; // #243989

export function channels(s: Scope): Channels {
  const fancyT = norm(s.fancy, 0, FANCY.length - 1);
  const brandT = norm(s.brandingDone, 0, BRANDING_DONE.length - 1);

  return {
    scale: 0.62 + norm(s.pages, 1, 24) * 0.4,
    // Sections stack literally: one stratum per section past the first.
    strata: Math.max(0, Math.round(s.sections) - 1),
    spread: 0.055 + norm(s.locales, 1, 6) * 0.14,
    bevel: 0.012 + fancyT * 0.075,
    depth: 0.05 + norm(s.mathDev, 0, MATH_DEV.length - 1) * 0.34,
    grain: 0.5 * (1 - fancyT), // plain reads rough; fancy reads polished
    // Branding runs backwards: index 0 means nothing exists yet, so the object
    // reads grey and unresolved until a real system is in hand.
    // The stage is light (the site's lavender surface), so the object carries
    // the dark: indigo -> brand -> lilac across the face, which is the same
    // ramp the KeyFacts band arc walks. Tint multiplies that wash, so grey
    // reads as "the brand is not resolved yet" without going invisible.
    tint: mix3(GREY, WHITE, brandT),
    washA: mix3(BRAND, INDIGO, norm(s.geo, 0, GEO.length - 1)),
    washB: mix3(BRAND, COPPER, norm(s.commerce, 0, COMMERCE.length - 1) * 0.65),
    washC: mix3(
      mix3(LILAC, GREY, 0.5),
      LILAC,
      norm(s.content, 0, CONTENT_PER_PAGE.length - 1)
    ),
    sheen: norm(s.editability, 0, EDITABILITY.length - 1) * 0.9,
    spin: 0.06 + norm(s.motion, 0, MOTION.length - 1) * 0.5,
    pulse: norm(s.timeline, 0, TIMELINE_MULT.length - 1),
    spectrum: norm(s.integrations, 0, 8),
  };
}

