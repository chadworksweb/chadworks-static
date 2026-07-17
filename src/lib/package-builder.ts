// =====================================================================
// chadworks Static -- PACKAGE BUILDER MODEL (pure, no React)
// The scope model behind /website-design-cost-calculator/. Two jobs:
//   1. price(scope)  -> the number
//   2. channels(scope) -> the screen augmentation each scope layer drives
// Kept pure so the pricing can be tuned (and eventually tested) without
// touching the renderer.
//
// NUMBERS: this model owns its own. Nothing in TUNING is inherited from, or
// answerable to, the figures quoted on any other page. Do not "reconcile" it
// against them. Chad tunes these here; every value is open.
// =====================================================================

// ---------------------------------------------------------------------
// TUNING -- the whole pricing surface, in one block, on purpose.
// ---------------------------------------------------------------------
// "Baseline", never "floor" (Chad, 2026-07-17). The readout already says
// "Baseline price" at rest, so the copy and the tool now use one word.
export const BASE = 3200; // the baseline build: 3 pages, clean and correct

const PER_PAGE = 260; // each page past the 3 the base covers
const PAGES_INCLUDED = 3;
const PER_SECTION = 55; // each section per page past the 4 the base covers
const SECTIONS_INCLUDED = 4;
const PER_INTEGRATION = 450;
const PER_LOCALE = 800; // each locale past the first

// Step ladders. Index = the option index on that parameter.
// Ambition prices SURFACE AREA of art direction, not quality of craft. The
// craft is constant at every index; what grows is how much of the page gets
// it. Renaming this off "How fancy" (2026-07-17, Chad's call) is what keeps
// the calculator from contradicting the packages page, which promises the
// number never scales with "how much polish you deserve".
const AMBITION = [0, 400, 1100, 2200, 3600];
const MATH_DEV = [0, 600, 1800, 4200, 9000];
const BRANDING_DONE = [1400, 800, 150, 0]; // nothing done -> full system in hand
const CONTENT_PER_PAGE = [0, 60, 140, 240]; // you have it -> I write every word
const EDITABILITY = [0, 500, 1200, 2000];
const MOTION = [0, 500, 1400, 3000, 6000];
const COMMERCE = [0, 900, 2200, 4500, 9000];
const GEO = [0, 600, 1500, 3000];
const TIMELINE_MULT = [1, 1.15, 1.35]; // applied to the whole build, last

// ---------------------------------------------------------------------
// RATE CARD -- the ladders above, exported so the page can SERVER-RENDER them
// as a static HTML table.
//
// Why this exists: AI crawlers do not execute JavaScript. Vercel/MERJ
// instrumented 1.3 billion crawler fetches and found GPTBot, ClaudeBot and
// PerplexityBot all REQUEST js files and none of them RUN one. A price that
// only exists in calculator state is a price no engine can read, so the whole
// ladder is published as HTML too.
//
// It is derived FROM these consts rather than retyped in the copy, so the
// published card cannot drift from what the calculator actually charges.
// Retuning a ladder retunes the table in the same edit.
// ---------------------------------------------------------------------
const LADDER_BY_KEY: Partial<Record<keyof Scope, number[]>> = {
  ambition: AMBITION,
  mathDev: MATH_DEV,
  brandingDone: BRANDING_DONE,
  content: CONTENT_PER_PAGE,
  editability: EDITABILITY,
  motion: MOTION,
  commerce: COMMERCE,
  geo: GEO,
};

// The step ladder behind a `kind: "steps"` param, index-aligned to its options.
export function ladderFor(key: keyof Scope): number[] | undefined {
  return LADDER_BY_KEY[key];
}

// The per-unit rates behind the `kind: "range"` params, plus the multiplier.
export const UNIT_RATES = {
  perPage: PER_PAGE,
  pagesIncluded: PAGES_INCLUDED,
  perSection: PER_SECTION,
  sectionsIncluded: SECTIONS_INCLUDED,
  perIntegration: PER_INTEGRATION,
  perLocale: PER_LOCALE,
  timelineMult: TIMELINE_MULT,
} as const;

// `content` bills per page, not once. The table has to say so or the figure
// reads as a flat fee and understates a long site.
export const PER_PAGE_LADDER_KEYS: ReadonlySet<keyof Scope> = new Set(["content"]);

// ---------------------------------------------------------------------
// SCOPE
// ---------------------------------------------------------------------
export type Scope = {
  pages: number;
  sections: number; // per page
  ambition: number;
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

// The baseline build. Every ladder sits at the index that adds nothing, so an
// untouched builder reads exactly BASE.
export const BASELINE: Scope = {
  pages: PAGES_INCLUDED,
  sections: SECTIONS_INCLUDED,
  ambition: 0,
  mathDev: 0,
  // Branding and copy default to UNSET (-1): no chip selected, no plaque, no
  // gem, no copy lines -- the slab opens bare and each effect is a reveal once a
  // chip is picked. `at()` clamps -1 to index 0 for pricing, so the quote reads
  // as "nothing provided" (full branding to build, client copy) by default.
  brandingDone: -1,
  content: -1,
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
    key: "ambition",
    label: "Visual ambition",
    hint: "How much of the page gets art direction.",
    kind: "steps",
    options: ["Straightforward", "Considered", "Layered", "Art-directed", "The full chadworks"],
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
    label: "Branding",
    hint: "What you bring versus what I build.",
    kind: "steps",
    options: ["Nothing yet", "A logo", "A brand guide", "A full system"],
  },
  {
    key: "content",
    label: "Copy (Text content)",
    hint: "Who writes the copy.",
    kind: "steps",
    options: ["Client provides", "Cleanup", "Most of it", "Every word"],
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
    label: "Ecommerce",
    hint: "What the site sells and how.",
    kind: "steps",
    options: ["Nothing", "A few products", "A real store", "A catalog", "A platform"],
  },
  {
    key: "integrations",
    label: "Integrations",
    hint: "Calendly, HubSpot, memberships, subscriptions, APIs.",
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
    { label: "The baseline build", amount: BASE },
    { label: `Pages past ${PAGES_INCLUDED}`, amount: extraPages * PER_PAGE },
    {
      label: `Sections past ${SECTIONS_INCLUDED}`,
      amount: extraSections * PER_SECTION * s.pages,
    },
    { label: "Visual ambition", amount: at(AMBITION, s.ambition) },
    { label: "Math and development", amount: at(MATH_DEV, s.mathDev) },
    { label: "Branding to build", amount: at(BRANDING_DONE, s.brandingDone) },
    { label: "Copy", amount: at(CONTENT_PER_PAGE, s.content) * s.pages },
    { label: "Who edits it", amount: at(EDITABILITY, s.editability) },
    { label: "Motion", amount: at(MOTION, s.motion) },
    { label: "Ecommerce", amount: at(COMMERCE, s.commerce) },
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
//   pages        -> strata       (thin ridged leaves stacked behind: a book)
//   sections     -> height       (cover grows a unit taller + a face divider each)
//   ambition     -> bevel        (a plain edge cuts into a jeweled one)
//   mathDev      -> plug         (a 3D connector seated in the cover's left edge;
//                                 more pins/body/cable the higher the level)
//   brandingDone -> brandContent (the plaque panel is constant; this ladder lays
//                                 marks on it: gem @2, + wordmark @3, + cloud @4)
//   content      -> washC        (the wash gains its third color)
//   editability  -> sheen        (surface you can touch)
//   motion       -> spin         (how alive it is)
//   commerce     -> washB        (copper enters the wash)
//   integrations -> spectrum     (more systems, more chromatic split)
//   geo          -> washA        (the halo the machines read it by)
//   timeline     -> pulse        (rush reads as urgency)
//   locales      -> spread       (the strata fan apart: parallel sites)
//
// `ambition` also drives polish (grain, inverted), because refinement and edge
// treatment are the same idea seen twice. That is the one deliberate double.
// ---------------------------------------------------------------------
export type Channels = {
  scale: number;
  heightHalf: number; // cover half-height, driven by sections
  sections: number; // section count, ruled across the cover face
  plug: number; // mathDev level: complexity of the 3D plug in the left edge
  plaque: number; // constant: the brand plaque panel, held at its level-2 state
  brandContent: number; // brandingDone level: the marks laid on the plaque
  copy: number; // content level: skeleton copy lines laid under the gem (0..3)
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
  const ambitionT = norm(s.ambition, 0, AMBITION.length - 1);

  return {
    // Overall object size is now constant (no slider drives it); sections drive
    // HEIGHT, not scale. Bumped 25% from 0.72 for a larger default presence.
    scale: 0.9,
    // Height is one unit PER section: the cover is short at a few sections and
    // grows a fixed step taller with each one added.
    heightHalf: 0.1 * s.sections,
    // The raw count, ruled onto the cover face as section dividers.
    sections: s.sections,
    // mathDev level drives the 3D plug seated in the cover's left edge.
    plug: s.mathDev,
    // The brand plaque PANEL is constant (the modest translucent level-2 panel);
    // it is always shown. brandingDone drives the MARKS laid on it: the CW gem
    // at level 2, the wordmark beside it at 3, the manifesto cloud at 4.
    plaque: 1,
    brandContent: s.brandingDone,
    // content level also lays skeleton "copy" lines under the gem: 1 line at the
    // first level up to 4 at "Every word".
    copy: s.content,
    // Pages append thin leaves behind the cover: one leaf per page past the
    // first, so more pages grow a real, ridged page block toward the back.
    strata: Math.max(0, Math.round(s.pages) - 1),
    spread: 0.03 + norm(s.locales, 1, 6) * 0.03,
    bevel: 0.012 + ambitionT * 0.075,
    // Cover depth is now a constant: mathDev no longer drives the slab at all.
    // Its visual moved OUT of the WebGL object to a DOM motherboard layer that
    // plugs into the cover's left edge (see Motherboard.tsx), so the object
    // keeps a fixed, modest cover thickness.
    depth: 0.06,
    grain: 0.5 * (1 - ambitionT), // low ambition reads rough; high reads polished
    // Tint is a constant now. Branding no longer dims the object: it always
    // reads fully lit (the old level-4 value), and the brand instead shows up
    // as the corner plaque (see the plaque channel). White is a neutral
    // multiplier, so the wash carries the colour untouched.
    tint: WHITE,
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

