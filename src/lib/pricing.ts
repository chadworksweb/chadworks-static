// =====================================================================
// chadworks Static -- PRICING HUB ("the menu")
//
// The SINGLE source for every price that is not the calculator's own live
// state. package-builder.ts is the compute engine (BASE, the ladders, price(),
// weeks()); THIS file is the data layer that sits on top of it and is read by
// every page that quotes a number:
//
//   - MINUTELY / WORDPRESS_CARE : the after-launch rates, one definition each,
//     so /rates/, /faqs/, the calculator, the guide and RatesCapsule stop
//     retyping 5.25 and 550 in six different files.
//   - EXAMPLES                  : every worked use case, each a real Scope
//     priced BY the model, so a figure can never contradict the calculator and
//     a ladder retune moves every example in the same edit. The guide renders
//     these as its gallery; the shape-capture harness renders the same list to
//     the transparent object PNGs, so the picture and the number stay in step.
//   - MARKET / COMPONENTS       : (folded in during the page rewire) the
//     competitor and anatomy figures, sourced once and rendered by whichever
//     page wants them.
//
// The rule that makes this a hub and not just another file: numbers live here,
// pages import and render. A page never hand-types a figure the hub could own.
// =====================================================================

import { BASELINE, SMALL_BUSINESS, STORE, wire, type Scope } from "./package-builder";

// ---------------------------------------------------------------------
// AFTER-LAUNCH RATES -- one definition, imported everywhere.
// ---------------------------------------------------------------------
export const MINUTELY = 5.25; // $/min for work after launch. Also on /rates/.
export const WORDPRESS_CARE = 550; // $ per six months, the WordPress care plan.

// ---------------------------------------------------------------------
// WORKED-EXAMPLE USE CASES -- real scopes, priced by the model at render.
//
// Every figure is computed by price(ex.scope), never typed, so an example is
// always exactly what the same scope costs on the calculator. Each `slug` also
// names the object render in public/shapes/<slug>.webp, generated once from
// this same model by the shapecap harness (which reads THIS list, minus the
// hand-made `rushed` art). Keep slug and scope in step: a scope change means
// the shape must be regenerated, or the picture drifts from the number.
//
// The last three are the high end ($18k / $25k / $32k). They are use cases
// first; naming them as sellable "packages" is a later pass.
//
// integrations bitmask (see INTEGRATION_OPTIONS): 0 Calendly, 1 HubSpot,
// 2 Zapier, 3 Memberships/logins, 4 Subscriptions/billing, 5 Email marketing,
// 6 A CRM/database, 7 Anything with an API.
// ---------------------------------------------------------------------
export type Example = { slug: string; name: string; detail: string; scope: Scope };

export const EXAMPLES: Example[] = [
  {
    slug: "baseline",
    name: "A baseline website build costs",
    detail:
      "Three pages at four sections each, your brand already settled and your words already written. Focused, correct, and it does one job well.",
    scope: BASELINE,
  },
  {
    slug: "small-business",
    name: "A small business website costs",
    detail:
      "Five pages, a logo in hand but no system around it, light copy cleanup, and a bit of motion.",
    scope: SMALL_BUSINESS,
  },
  {
    slug: "ecommerce",
    name: "A real ecommerce store costs",
    detail:
      "Eight pages carrying a catalog, a payment path, a couple of systems wired in, and enough custom logic that it stops being a brochure.",
    scope: STORE,
  },
  {
    slug: "rushed",
    name: "A rushed business website costs",
    detail:
      "Identical scope to the small business site above with the timeline squeezed. Rush multiplies the whole build, because moving your project to the front of the line moves everything else back.",
    scope: { ...SMALL_BUSINESS, timeline: 2 },
  },
  {
    slug: "bespoke-motion",
    name: "A bespoke site with motion costs",
    detail:
      "Six pages art-directed end to end, with showroom-grade motion and a brand system built from scratch. The kind of site that has to feel like nobody else's.",
    scope: { ...BASELINE, pages: 6, ambition: 4, motion: 4, brandingDone: 3, content: 2, editability: 1 },
  },
  {
    slug: "multilingual",
    name: "A three-language website costs",
    detail:
      "A six page site built once and kept true in three languages, because each language is another whole site to maintain.",
    scope: { ...BASELINE, pages: 6, content: 2, editability: 1, locales: 3 },
  },
  {
    slug: "publication",
    name: "A multi-author digital publication costs",
    detail:
      "Fourteen pages with several people editing their own sections behind logins, on the custom structure a real publication runs on.",
    scope: { ...BASELINE, pages: 14, sections: 5, content: 1, editability: 3, mathDev: 1, integrations: wire(3), motion: 1 },
  },
  {
    slug: "web-app",
    name: "A custom web application costs",
    detail:
      "Six pages wrapped around real software: custom logic that has to be right every time, with a couple of systems wired in.",
    scope: { ...BASELINE, pages: 6, mathDev: 3, integrations: wire(3, 4, 6), editability: 2, ambition: 2 },
  },
  {
    slug: "service-booking",
    name: "A booking-driven service site costs",
    detail:
      "Five pages with a booking calendar and a CRM wired in, plus a couple of products to sell.",
    scope: { ...BASELINE, pages: 5, integrations: wire(0, 1), commerce: 1, ambition: 2, motion: 2, content: 2, brandingDone: 2 },
  },
  {
    slug: "membership",
    name: "A membership website costs",
    detail:
      "Eight pages behind a login wall, with subscriptions billed and the logic that keeps the right people in.",
    scope: { ...BASELINE, pages: 8, integrations: wire(3, 4), editability: 2, content: 1, mathDev: 2 },
  },
  // ------- the high end: use cases at $18k / $25k / $32k -------
  {
    slug: "course-platform",
    name: "An online course platform costs",
    detail:
      "Seven pages around a paid course: student logins, subscription billing, an email list wired in, and the custom logic that releases each lesson as people work through it.",
    // ~$18,300
    scope: {
      ...BASELINE,
      pages: 7,
      sections: 5,
      ambition: 3,
      mathDev: 3,
      brandingDone: 2,
      content: 2,
      editability: 2,
      motion: 2,
      commerce: 2,
      integrations: wire(3, 4, 5),
    },
  },
  {
    slug: "saas-app",
    name: "A SaaS product with billing costs",
    detail:
      "Ten pages wrapped around real software: a customer dashboard behind logins, billing that runs on its own, a CRM and an email tool wired in, and a brand system built from scratch.",
    // ~$25,300
    scope: {
      ...BASELINE,
      pages: 10,
      sections: 6,
      ambition: 4,
      mathDev: 4,
      brandingDone: 3,
      content: 2,
      editability: 3,
      motion: 2,
      integrations: wire(3, 4, 5, 6),
    },
  },
  {
    slug: "marketplace",
    name: "A custom marketplace platform costs",
    detail:
      "Twelve pages art-directed end to end: buyers and sellers behind their own logins, subscriptions and payouts, a CRM and an outside API wired in, and interactive motion across the whole thing.",
    // ~$31,800
    scope: {
      ...BASELINE,
      pages: 12,
      sections: 6,
      ambition: 4,
      mathDev: 4,
      brandingDone: 3,
      content: 3,
      editability: 3,
      motion: 3,
      commerce: 2,
      integrations: wire(3, 4, 5, 6, 7),
    },
  },
];

// ---------------------------------------------------------------------
// MARKET -- what a website costs by who builds it. Read by the guide.
//
// VERIFY THESE FIGURES BEFORE LAUNCH. They are other people's prices and they
// go stale; a wrong one is chadworks' credibility, not theirs. Last verified
// 2026-07-19 (WebFX, Outliant, offshore re-confirmed). The DIY builder range is
// the soft one: the builders render pricing in JS, so $16 to $99 is the
// annual-billing ladder corroborated by a third party, not read off first-party
// HTML. Eyeball it in a browser before this goes public.
// ---------------------------------------------------------------------
export type MarketRow = { method: string; range: string; note: string; href: string };

export const MARKET: MarketRow[] = [
  {
    method: "Do it yourself on a builder",
    range: "$16 to $99 a month",
    note: "Squarespace, Wix, and the rest. Cheap until you count the year, notice the template other businesses are also using, and realize you never own it.",
    href: "https://www.squarespace.com/blog/how-much-does-a-website-cost",
  },
  {
    method: "Hire a freelancer",
    range: "$500 to $5,000",
    note: "One person, one invoice, and a wide range because a freelancer might mean a student on a template or a twenty year veteran writing custom code. The word covers both.",
    href: "https://www.forbes.com/advisor/business/software/how-much-does-a-website-cost/",
  },
  {
    method: "Hire an agency",
    range: "$6,500 to $30,000+",
    note: "WebFX starts a small business site at $6,500, and a custom build from a firm like Outliant runs $25,000 to $30,000. Much of that is overhead and margin, not the website itself.",
    href: "https://www.webfx.com/web-design/pricing/",
  },
  {
    method: "Send it offshore",
    range: "$2,500 to $8,000",
    note: "Real fixed prices, often published without a form. What the figure leaves out is the distance: the person building it works a half day out of phase with yours, and you feel that every time something needs deciding.",
    href: "https://dixieraizpacheco.com/web-design-cost-philippines",
  },
];

// The single agency figure the economics argument references (WebFX, small
// business site). Kept here so the guide's "where the number comes from" prose
// and the market table cannot quote two different agency numbers.
export const AGENCY_SMALL_BUSINESS_RANGE = "$6,500 to $15,000";

// ---------------------------------------------------------------------
// COMPONENTS -- what a website is actually made of. Read by the guide.
// The recurring pieces, market range beside the chadworks reality. Domain and
// maintenance figures mirror the calculator and /rates/.
// ---------------------------------------------------------------------
export type ComponentRow = { part: string; range: string; note: string };

export const COMPONENTS: ComponentRow[] = [
  {
    part: "Domain name",
    range: "$12 to $20 a year",
    note: "The address itself, renewed yearly. On my builds it is registered in your name from day one, not held by me.",
  },
  {
    part: "Hosting",
    range: "$0 to $1,000 a month",
    note: "The whole spread of the industry. Most of my builds are static, so hosting is often free or close to it, and the bill is yours rather than routed through me.",
  },
  {
    part: "Design and the build",
    range: "the variable one",
    note: "Everything above rides on top of this. It is the piece that moves from a few thousand to six figures, and it is the piece the calculator prices to the dollar.",
  },
  {
    part: "Content and photos",
    range: "$0 to a few thousand",
    note: "Free if you write and shoot it, more if you want it done for you. On my calculator, copy is a line you can turn up or leave off.",
  },
  {
    part: "Maintenance",
    range: "$0 to $200 a month",
    note: "A static site can sit and cost nothing. WordPress genuinely needs looking after, so it does not. With me there is no forced retainer; you pay for the minutes you actually use.",
  },
];

// ---------------------------------------------------------------------
// AFTER-LAUNCH TASKS -- the ongoing-cost ledger. Read by the guide.
//
// NOTHING HERE IS A NEW PRICE. Each figure is MINUTELY applied to a task time,
// computed rather than typed. Minutes are lifted from RATE_EXAMPLES on /rates/;
// keep them in step.
// ---------------------------------------------------------------------
export type AfterLaunchTask = { task: string; min: number; max: number };

export const AFTER_LAUNCH: AfterLaunchTask[] = [
  { task: "Changing the text on a page", min: 1, max: 1 },
  { task: "Swapping an image", min: 1, max: 1 },
  { task: "Adding a page you did not plan for", min: 10, max: 10 },
  { task: "Fixing something small that broke", min: 10, max: 20 },
  { task: "Building a whole new page template", min: 30, max: 30 },
];

// ---------------------------------------------------------------------
// CALCULATORS -- the other cost calculators, and what each one does instead of
// answering you. Read by the calculator page's "what makes this different"
// section, where citing the alternatives is the point.
//
// VERIFY BEFORE LAUNCH, same as MARKET. websitecostcalculator.app has no
// first-party price to check; it is named for its behavior (industry averages),
// not a figure.
// ---------------------------------------------------------------------
// `mark` is the oversized glyph the page paints BEHIND the tag as a watermark:
// a drawn shorthand for the failure mode (X blocked, ~ approximate, [ ] a gap
// where the answer should be). Decoration only -- it is aria-hidden at render,
// so the tag is what any reader or engine actually gets.
export type CalculatorRow = {
  who: string;
  tag: string;
  mark: string;
  note: string;
  href: string;
};

export const CALCULATORS: CalculatorRow[] = [
  {
    who: "WebFX",
    tag: "Gated",
    mark: "X",
    note: "Puts the estimate behind a lead form. You answer their questions, then wait for an email with a range in it.",
    href: "https://www.webfx.com/web-design/learn/website-design-cost-calculator/",
  },
  {
    who: "Outliant",
    tag: "Gated",
    mark: "X",
    note: "Gates the number behind your contact details, built to open a sales conversation rather than answer you on the spot.",
    href: "https://www.outliant.com/website-cost-calculator",
  },
  {
    who: "websitecostcalculator.app",
    tag: "Averaged",
    mark: "~",
    note: "Returns an industry average (from 2018), which is a number no actual studio charges for an actual website.",
    href: "https://websitecostcalculator.app/",
  },
  {
    who: "Pronto",
    tag: "Too wide",
    mark: "[ ]",
    note: "Quotes a range so wide, $2,000 to $10,000 on a brochure site, that it defers the real answer to a phone call.",
    href: "https://www.prontomarketing.com/website-cost-calculator/",
  },
];
