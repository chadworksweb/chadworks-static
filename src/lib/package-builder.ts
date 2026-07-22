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
export const BASE = 3250; // the baseline build: 3 pages, clean and correct

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
// NO GEO LADDER. Being readable and citable by the machines used to be a
// priced parameter; it is not one any more (Chad, 2026-07-19), because it is
// already part of every build. It is stated in the inclusions list instead of
// sold as a rung, which is also why `washA` is now a constant.
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
};

// The step ladder behind a `kind: "steps"` param, index-aligned to its options.
export function ladderFor(key: keyof Scope): number[] | undefined {
  return LADDER_BY_KEY[key];
}

// ---------------------------------------------------------------------
// INTEGRATIONS -- a checklist, not a count.
//
// This was a 0-to-8 slider, which asked the reader to translate "what do I
// need this thing to talk to" into a number before the tool would answer them
// (Chad, 2026-07-19). Naming the systems asks the question they can actually
// answer, and it costs nothing on the pricing side: each one is still
// PER_INTEGRATION, so eight checked is exactly what eight on the slider was.
//
// The first three are named systems and carry their real marks on the slab.
// Everything after is a capability rather than a vendor, because past the ones
// people ask for by name the question stops being WHICH system.
//
// ORDER IS LOAD-BEARING: `Scope.integrations` is a BITMASK over these indices
// and the slab reads the same indices to pick each tile's mark. Appending is
// safe; reordering or removing silently rewrites what an existing scope means.
export const INTEGRATION_OPTIONS = [
  "Calendly",
  "HubSpot",
  "Zapier",
  "Memberships and logins",
  "Subscriptions and billing",
  "Email marketing",
  "A CRM or database of your own",
  "Anything else with an API",
] as const;

/** Bitmask -> how many systems are checked. This is what actually gets billed. */
export function integrationCount(mask: number): number {
  let n = 0;
  for (let i = 0; i < INTEGRATION_OPTIONS.length; i++) if (mask & (1 << i)) n++;
  return n;
}

/** Build a mask from option indices. For the worked examples on the page. */
export const wire = (...idx: number[]) => idx.reduce((m, i) => m | (1 << i), 0);

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
  // A BITMASK over INTEGRATION_OPTIONS, not a count. Read it with
  // integrationCount(); never treat the raw value as a number of systems.
  integrations: number;
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
  // chip is picked. `at()` bills -1 as 0, so an untouched builder reads the BASE
  // headline and the first click is what moves the price.
  brandingDone: -1,
  content: -1,
  editability: 0,
  motion: 0,
  commerce: 0,
  integrations: 0,
  timeline: 0,
  locales: 1,
};

// ---------------------------------------------------------------------
// WORKED-EXAMPLE SCOPES -- shared by the calculator page and the cost guide.
//
// These two scopes are quoted as real numbers on BOTH /website-design-cost-
// calculator/ and /how-much-does-a-website-cost/. They live here, priced by the
// one model, so the two pages can never disagree about what a small business
// site or a store costs. Retuning a ladder moves both pages in the same edit.
// ---------------------------------------------------------------------

// Five pages, a logo in hand but no system around it, light copy cleanup, a bit
// of motion. The everyday small business build.
export const SMALL_BUSINESS: Scope = {
  ...BASELINE,
  pages: 5,
  ambition: 1,
  brandingDone: 1, // "A logo" -- a logo in hand, no system around it (matches the copy)
  content: 1,
  editability: 1,
  motion: 1,
};

// Eight pages carrying a catalog, a payment path, subscriptions and a mailing
// list wired in, and enough custom logic that it stops being a brochure.
export const STORE: Scope = {
  ...BASELINE,
  pages: 8,
  sections: 5,
  ambition: 2,
  mathDev: 1,
  brandingDone: 2,
  content: 1,
  editability: 2,
  motion: 1,
  commerce: 2,
  // Subscriptions and a mailing list: a bitmask over INTEGRATION_OPTIONS.
  integrations: wire(4, 5),
};

// ---------------------------------------------------------------------
// PARAMETER TABLE -- drives the controls AND the ledger labels.
// `kind: "range"` renders a slider; `kind: "steps"` renders option chips.
// ---------------------------------------------------------------------
export type Param = {
  key: keyof Scope;
  label: string;
  hint: string;
  // "range" renders a slider, "steps" a single-choice chip row, "checks" a
  // multi-select chip row backed by a bitmask.
  kind: "range" | "steps" | "checks";
  min?: number;
  max?: number;
  options?: string[];
};

export const PARAMS: Param[] = [
  {
    key: "pages",
    label: "Pages",
    hint: "Number of unique keystone pages, e.g. Home, About, Contact (not posts or products)",
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
    options: ["Straightforward", "Considered", "Layered", "Art-directed", "The (chad)works"],
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
    hint: "What the site has to talk to. Check every one that applies.",
    kind: "checks",
    options: [...INTEGRATION_OPTIONS],
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
// UNSET (-1) adds nothing. Branding and copy open with no chip picked, and an
// untouched builder has to read the BASE headline, so an unpicked ladder cannot
// bill its first rung. Level 1 and unset look identical on the slab; they are
// deliberately NOT identical on the ledger. Picking any chip starts charging.
const at = (ladder: number[], i: number) =>
  i < 0 ? 0 : ladder[Math.min(ladder.length - 1, Math.round(i))];

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
    { label: "Integrations", amount: integrationCount(s.integrations) * PER_INTEGRATION },
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

// The price contribution of ONE parameter, for the recap table. Mirrors the
// per-line math in ledger(), keyed by param so the table can pair each field's
// chosen level with its own cost. Timeline is a whole-build multiplier, so its
// "line" is the rush premium.
export function paramAmount(key: keyof Scope, s: Scope): number {
  switch (key) {
    case "pages": return Math.max(0, s.pages - PAGES_INCLUDED) * PER_PAGE;
    case "sections": return Math.max(0, s.sections - SECTIONS_INCLUDED) * PER_SECTION * s.pages;
    case "ambition": return at(AMBITION, s.ambition);
    case "mathDev": return at(MATH_DEV, s.mathDev);
    case "brandingDone": return at(BRANDING_DONE, s.brandingDone);
    case "content": return at(CONTENT_PER_PAGE, s.content) * s.pages;
    case "editability": return at(EDITABILITY, s.editability);
    case "motion": return at(MOTION, s.motion);
    case "commerce": return at(COMMERCE, s.commerce);
    case "integrations": return integrationCount(s.integrations) * PER_INTEGRATION;
    case "locales": return Math.max(0, s.locales - 1) * PER_LOCALE;
    case "timeline": return rushPremium(s);
    default: return 0;
  }
}

// Every parameter as a table row: label, chosen level, and its cost.
export function scopeRows(s: Scope): { label: string; value: string; amount: number }[] {
  return PARAMS.map((p) => ({
    label: p.label,
    value: paramValue(p, s),
    amount: paramAmount(p.key, s),
  }));
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

// ---------------------------------------------------------------------
// SCOPE DESCRIPTION -- the human-readable choices, for the send-to-Chad form.
//
// The visible recap in the form uses ledger() (label + price). This is the
// OTHER half: the actual selection behind each parameter, so the message that
// reaches Chad says "Visual ambition: Layered" rather than just a dollar figure.
// ---------------------------------------------------------------------

// The chosen option, in words, for one parameter.
export function paramValue(p: Param, s: Scope): string {
  const v = s[p.key];
  if (p.kind === "checks") {
    const names = (p.options ?? []).filter((_, i) => v & (1 << i));
    return names.length ? names.join(", ") : "None";
  }
  if (p.kind === "steps") return v < 0 ? "Not selected" : p.options?.[v] ?? String(v);
  if (p.key === "locales") return v === 1 ? "1 language" : `${v} languages`;
  return String(v); // pages, sections
}

export function describeScope(s: Scope): { label: string; value: string }[] {
  return PARAMS.map((p) => ({ label: p.label, value: paramValue(p, s) }));
}

// The full scope as one message body, for the form payload that reaches Chad.
export function scopeSummaryText(s: Scope): string {
  const head = `Estimate: ${money(price(s))} (${weeksLabel(s)})`;
  const lines = describeScope(s).map((d) => `${d.label}: ${d.value}`);
  return [head, "", ...lines].join("\n");
}

// ---------------------------------------------------------------------
// TIMELINE -- the delivery window.
//
// The calculator has always CHARGED for a squeezed timeline without ever
// saying how long the normal one is, which left rush as a premium with
// nothing to be a premium over. This derives the window from `subtotal`,
// the same figure that prices the build, because subtotal already is the
// measure of how much work there is. One number, two readings.
//
// The curve is deliberately sublinear (^0.7): a build twice the size does
// not take twice the weeks, since a wider scope parallelizes and the fixed
// start-up cost of any project is paid once. Anchored against the four
// worked examples on the page, which is what keeps it honest.
//
// TUNE THESE, CHAD. Delivery capacity is a promise about your calendar, and
// nobody else can set it. The shape is defensible; the constants are yours.
// ---------------------------------------------------------------------
// Tuned 2026-07-19 (Chad), in two passes. The floor took the 1.5x and kept it,
// because even the smallest build has a start-up cost that does not shrink.
// The span came back down to 6 after the 1.5x pass pushed a store to 12-16
// weeks, which overshot: a store should read as two to three months, not four.
//
// Chad's calibration case is Salpattica, which converted in about a month, but
// that build started from an existing site with Square already wired up, so it
// is the FLOOR of what a store can take rather than the typical figure. The
// curve is aimed at a store built from nothing.
const WEEKS_FLOOR = 3; // the baseline build, start to launched
const WEEKS_SPAN = 6; // weeks added by the first $10k of scope past baseline
const WEEKS_PIVOT = 10000;
const WEEKS_CURVE = 0.7;

// How far each timeline rung compresses the window. Index-aligned to
// TIMELINE_MULT, so "costs 15% more" and "lands 20% sooner" stay one choice.
const TIMELINE_SQUEEZE = [1, 0.8, 0.65];

export type Window = { low: number; high: number };

// The delivery window in weeks, rounded to whole weeks because no client has
// ever been served by an estimate that pretends to half-week precision.
export function weeks(s: Scope): Window {
  const over = Math.max(0, subtotal(s) - BASE);
  const raw = WEEKS_FLOOR + WEEKS_SPAN * Math.pow(over / WEEKS_PIVOT, WEEKS_CURVE);
  // NOT at(): that bills an unset ladder as 0, which is right for a price and
  // wrong for a multiplier (it would collapse the window to nothing).
  const squeeze =
    TIMELINE_SQUEEZE[Math.min(TIMELINE_SQUEEZE.length - 1, Math.max(0, Math.round(s.timeline)))];
  const low = Math.max(1, Math.round(raw * squeeze));
  // The spread widens with the build: a three page site lands when it lands,
  // a store has more places for someone else's dependency to slip.
  const high = low + Math.max(1, Math.round(low * 0.3));
  return { low, high };
}

export function weeksLabel(s: Scope): string {
  const { low, high } = weeks(s);
  return `${low} to ${high} weeks`;
}

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
//   editability  -> edit         (an edit badge in the panel's top-right: the
//                                 pencil @2, ringed @3, filled @4) + sheen
//   motion       -> spin         (how alive it is) + motionLevel (the braille
//                                 dot field breathing in behind the slab @2+)
//   commerce     -> washB        (the wash cools toward brand mid) + commerceLevel (the
//                                 cart + product grid in the middle column)
//   integrations -> spectrum     (more systems, more chromatic split)
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
  edit: number; // editability level: the edit badge on the panel (0..3)
  locales: number; // language count (1..6): drives the xN badge on the copy column
  motionLevel: number; // motion level: gates the dot field behind the slab (0..4)
  commerceLevel: number; // commerce level: the cart + product grid, middle column (0..4)
  wired: number; // integrations BITMASK: which connector tiles, last column
  rimGlow: number; // top ambition step only: light sustained inside the bevel
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

// How far the brand plaque sits in from the cover's rim. It is PackageScreen's
// OV_INSET, restated here because the bevel ladder has to know where the panel
// edge is in order to finish against it. Keep the two in step: if the plaque is
// re-inset, the top ambition step stops touching.
const PLAQUE_INSET = 0.07;
const BEVEL_MIN = 0.012; // the rim at "Straightforward": a hairline chamfer
// Overshoot past the panel edge, so the bevel starts just UNDER the plaque
// rather than exactly at it. Two things eat into a perfect meeting: the panel is
// lifted off the cap to avoid z-fighting and then scaled back down to correct
// its projection, which pulls its edge inboard a hair. Landing the bevel exactly
// on PLAQUE_INSET therefore left a sliver of bare cap showing between the two --
// and the cover's section rules run across that sliver, so the ridges peeked out
// at the seam. Overshooting puts the panel edge over the start of the slope and
// seals it shut.
const BEVEL_SEAL = 0.005;

// Brand anchors. These mirror the CSS color tokens; they are NOT imported from
// the gem's core, on purpose (see package-screen-core's isolation note).
const GREY: [number, number, number] = [0.62, 0.62, 0.66];
const WHITE: [number, number, number] = [1, 1, 1];
const BRAND: [number, number, number] = [0.502, 0.329, 0.737]; // #8054bc
const LILAC: [number, number, number] = [0.898, 0.824, 0.957]; // #e5d2f4
// Commerce used to pull the wash toward COPPER, which turned the whole slab
// reddish (Chad, 2026-07-19). It still shifts, just toward the brand mid
// periwinkle instead, and less far, so the change reads as the object cooling
// rather than changing material.
const MID: [number, number, number] = [0.337, 0.408, 0.678]; // #5668ad

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
    // Editability lays an edit badge in the panel's top-right, opposite the
    // gem. Level 1 is bare (you are not editing anything, so no badge), 2 is
    // the pencil alone, 3 rings it, 4 fills the ring with the brand gradient.
    // Raw level, like brandContent and copy, because the reveal is staged
    // rather than ramped.
    edit: s.editability,
    // Languages stamp an xN multiplier over the copy column's bottom-right
    // corner: one language is included (no badge), each extra one is another
    // copy of the whole site to keep true, so it reads as x2, x3, and up. Raw
    // count, like the staged levels above; the badge appears from 2.
    locales: s.locales,
    // Motion also lays the braille dot field in behind the slab from level 2
    // up. Raw level, because the field is a staged reveal; `spin` still carries
    // the continuous ramp.
    motionLevel: s.motion,
    // Commerce builds a cart-and-inventory mark in the middle third of the
    // plaque: the cart at 2, ringed with 8 cells at 3, filled with 16 at 4,
    // and glowing at 5. Raw level, staged like the others.
    commerceLevel: s.commerce,
    // Integrations fill the LAST third with one connector tile per system. The
    // raw BITMASK goes through, not a count, because the slab draws each
    // checked system's own mark and therefore has to know WHICH are checked,
    // not just how many. `spectrum` takes the count for the chromatic split.
    wired: s.integrations,
    // The lit bevel belongs to the LAST ambition step alone. It is the reward
    // for going all the way, so it does not ramp with ambitionT -- it is off at
    // every other level and on at the top. The render loop eases the switch, so
    // a hard 0/1 here still arrives as a slow fade rather than a snap.
    rimGlow: s.ambition >= AMBITION.length - 1 ? 1 : 0,
    // Pages append thin leaves behind the cover: one leaf per page past the
    // first, so more pages grow a real, ridged page block toward the back.
    strata: Math.max(0, Math.round(s.pages) - 1),
    spread: 0.03 + norm(s.locales, 1, 6) * 0.03,
    // Ambition widens the cover's bevel until it CLOSES on the plaque: the top
    // step lands the bevel exactly on PLAQUE_INSET, so the rim finishes its
    // travel against the panel's edge instead of stalling short of it. The old
    // 0.075 slope overshot that mark and then got clipped by buildScreen's
    // halfDepth ceiling, which is why steps 4 and 5 rendered identically.
    bevel: BEVEL_MIN + ambitionT * (PLAQUE_INSET + BEVEL_SEAL - BEVEL_MIN),
    // Depth is a FUNCTION of the bevel, not a free constant. buildScreen's rim
    // slopes at 45 degrees and it clamps the bevel to halfDepth * 0.9, so a thin
    // cover silently caps how far the rim can travel. Holding the floor at the
    // old 0.06 keeps the low steps exactly as they were and lets the cover
    // thicken only where the wide bevel actually needs the room.
    // (mathDev still does NOT drive the slab; its visual lives in the DOM
    // motherboard layer that plugs into the cover's left edge.)
    depth: Math.max(0.06, (BEVEL_MIN + ambitionT * (PLAQUE_INSET + BEVEL_SEAL - BEVEL_MIN)) / 0.9),
    grain: 0.5 * (1 - ambitionT), // low ambition reads rough; high reads polished
    // Tint is a constant now. Branding no longer dims the object: it always
    // reads fully lit (the old level-4 value), and the brand instead shows up
    // as the corner plaque (see the plaque channel). White is a neutral
    // multiplier, so the wash carries the colour untouched.
    tint: WHITE,
    // Constant since the geo ladder was cut. It was the halo the machines read
    // the object by, ramping brand -> indigo; with nothing driving it the base
    // brand violet is the level-0 value the slab always opened on.
    washA: BRAND,
    washB: mix3(BRAND, MID, norm(s.commerce, 0, COMMERCE.length - 1) * 0.42),
    washC: mix3(
      mix3(LILAC, GREY, 0.5),
      LILAC,
      norm(s.content, 0, CONTENT_PER_PAGE.length - 1)
    ),
    sheen: norm(s.editability, 0, EDITABILITY.length - 1) * 0.9,
    spin: 0.06 + norm(s.motion, 0, MOTION.length - 1) * 0.5,
    pulse: norm(s.timeline, 0, TIMELINE_MULT.length - 1),
    spectrum: norm(integrationCount(s.integrations), 0, INTEGRATION_OPTIONS.length),
  };
}

