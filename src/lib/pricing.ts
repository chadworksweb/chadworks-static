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
//
// ---------------------------------------------------------------------
// THREE KINDS OF MONEY LIVE IN THIS FILE, AND THEY ARE NOT INTERCHANGEABLE.
// The file is sectioned by which kind a figure is, because the kind decides
// who may change it, what happens when it is wrong, and how often to re-check
// it. Mixing them is how a competitor's stale quote ends up read as a chadworks
// promise.
//
//   1. WHAT CHADWORKS CHARGES  -- Chad's own prices. He is the only authority.
//      Wrong here means undercharging or a quote that does not match the site.
//      Changing one is a business decision and takes effect the moment it lands.
//
//   2. THIRD-PARTY SERVICES  -- what the client pays a vendor DIRECTLY,
//      alongside a chadworks engagement: Google Workspace, OpenAI's ad-spend
//      floor, the Shopify plan, Mailchimp, the domain registrar. Not
//      competitors; chadworks does not sell any of it and takes no margin on
//      it. Quoted so a client can see the whole cost of what they are buying,
//      and they move when the VENDOR says so, on no schedule of Chad's. Never
//      present one as a chadworks price.
//
//   3. WHAT OTHERS CHARGE FOR THE SAME WORK  -- the comparison set: agencies,
//      freelancers, DIY builders, offshore shops, WordPress hosts, rival cost
//      calculators. These exist to argue chadworks' value against an
//      alternative for the SAME job. They are somebody else's published prices,
//      they go stale on somebody else's schedule, and a wrong one is chadworks'
//      credibility, not theirs. RE-VERIFY ON A CADENCE, and cite a source.
//
// THE TEST that separates 2 from 3: could the client buy this INSTEAD of
// chadworks? A WordPress host could replace chadworks hosting, so it is a
// competitor (3). Google Workspace could not replace anything chadworks sells,
// so it is a pass-through (2). Both are "somebody else's price"; only one of
// them is an argument.
//
// FILE ORDER IS 1, 2, 3 AND THAT IS LOAD-BEARING: section 3's COMPONENTS table
// renders the domain figures declared in section 2, and a const cannot be read
// above its own declaration. Moving a section moves a build error with it.
//
// If a new figure does not clearly belong to one of the three, it does not
// belong in the hub yet. Work out which it is first.
// =====================================================================

import { BASE, BASELINE, SMALL_BUSINESS, STORE, money, wire, type Scope } from "./package-builder";

// =====================================================================
// SECTION 1 -- WHAT CHADWORKS CHARGES
//
// Chad's own prices, and the only figures on this site he is the authority
// for. Everything below this banner is revenue. Nothing below it is somebody
// else's number, so nothing below it needs re-verifying against an outside
// source: it is right when Chad says it is right.
// =====================================================================

// ---------------------------------------------------------------------
// AFTER-LAUNCH RATES -- one definition, imported everywhere.
// ---------------------------------------------------------------------
export const MINUTELY = 5.25; // $/min for work after launch. Also on /rates/.
export const HOURLY = MINUTELY * 60; // the same rate said the other way, for the pages that quote an hour.
export const WORDPRESS_CARE = 550; // $ per six months, the WordPress care plan.

// ---------------------------------------------------------------------
// RETAINERS -- flat monthly, NOT the minutely rate said monthly. A retainer
// buys a cycle of work at one number; deriving it from MINUTELY would make it
// move every time the after-launch rate does, which is not how it is sold.
// ---------------------------------------------------------------------
export const VISIBILITY_MONTHLY = 675; // $/month FLOOR for the AI search visibility retainer ("starts at").
export const VISIBILITY_AUDIT = 675; // $ FLAT for the one-time AI Visibility Audit, the gate into the retainer.
// The two figures above are equal TODAY and are not the same number: one is a
// recurring floor, the other a one-time flat. Move one without the other.

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
// THE TYPICAL BAND -- what most builds actually land at.
//
// Quoted on nearly every selling page ("most land between $5,000 and $10,000"),
// which made it the single most-retyped figure on the site: 100+ hand-typed
// occurrences before this pass. It is a POSTURE, not a computed figure -- the
// calculator prices a scope, this says where scopes usually come out -- so it
// is stated here rather than derived from a ladder.
//
// TYPICAL_HIGH doubles as the top of the "from the baseline to beyond" figures
// on the service cards, which is why BAND_FROM_BASE lives here too: the cards
// used to hand-type both ends of that range independently.
// ---------------------------------------------------------------------
export const TYPICAL_LOW = 5000;
export const TYPICAL_HIGH = 10000;

// The rendered forms.
//
// THE ENDS ARE EXPORTED SEPARATELY ON PURPOSE. Chad's copy joins them with
// whichever word the sentence wants -- "between $5,000 and $10,000", "runs
// $5,000 to $10,000", "$5,000 - $10,000" on a price card -- and swapping a
// numeral must never swap his connector word too. A page that says "and"
// interpolates the two ends; only a page that already said "to" or "-" uses a
// prejoined band.
export const LOW = money(TYPICAL_LOW); // "$5,000"
export const HIGH = money(TYPICAL_HIGH); // "$10,000"
export const HOURLY_RATE = `${money(HOURLY)}/hr`; // "$315/hr"
export const HOURLY_LONG = `${money(HOURLY)}/hour`; // "$315/hour"
export const TYPICAL_BAND = `${LOW} to ${HIGH}`; // "$5,000 to $10,000"
export const TYPICAL_BAND_DASH = `${LOW} - ${HIGH}`; // "$5,000 - $10,000"
export const BAND_FROM_BASE = `${money(BASE)} - ${HIGH}+`; // "$3,250 - $10,000+"

// ---------------------------------------------------------------------
// STANDALONE SERVICES -- sold on their own, not as part of a build.
//
// Added to the hub 2026-07-22 (Chad); the pages that sell them were rewired to
// read from here in the hand-typed-prices pass 2026-07-23, so the figures below
// are now the only place these numbers are written down.
//
// The three-way $675 collision is intentional on Chad's side (one number, three
// products) but it makes the constants easy to mix up, so each names its own
// unit: the audit is charged ONCE, the other two are PER MONTH.
//
// The ad SPEND that sits beside ADS_MONTHLY is not here. It is OpenAI's floor,
// billed to the client's own card, so it lives in section 2.
// ---------------------------------------------------------------------
// The audit's figure is VISIBILITY_AUDIT, up in the visibility block. `AUDIT`
// used to live here as a second 675 for the same product -- two constants meant
// a price change was two edits, and price-audit passed either way because both
// were legitimate hub references. Deleted 2026-08-01; every consumer now imports
// VISIBILITY_AUDIT.
export const ADS_MONTHLY = 675; // $ per month to manage ChatGPT ads. The management only.
export const AI_VIZ_MONTHLY = 675; // $ per month, the ongoing AI visibility campaign. The third of the three.

// Two products whose starting figure happens to equal BASE today. They are NOT
// wired to BASE, on purpose: a build baseline and a strategy session are
// separate products, and moving one must not silently move the other. Same
// reasoning as the $675 collision above -- one number, three meanings, three
// constants.
export const VSR_START = 3250; // $ to start a Vision / Strategy / Roadmap engagement.
export const REDESIGN_TYPICAL = 6200; // $ where most redesigns settle. A posture figure, like the band.

// ---------------------------------------------------------------------
// THE SWITCH LANE -- hosting and migration, sold off the /switch/ pages.
//
// Quoted across five service files that all describe the same two numbers, so
// a hosting change used to be a five-file edit. What a WordPress host charges
// instead is a competitor figure and lives in section 3.
// ---------------------------------------------------------------------
export const STATIC_HOSTING = 20; // $/month, chadworks static hosting.
export const STATIC_HOSTING_NONPROFIT = 10; // $/month, non-profits and tight-budget organizations.

// Google Workspace setup. Both of these are what CHADWORKS charges to do the
// migration; Google's own per-user subscription is a third-party service and
// lives in section 2.
export const WORKSPACE_SETUP = 300; // $ one-time to chadworks: setup, training, signature.
export const WORKSPACE_EXTRA_MAILBOX = 25; // $ per additional mailbox set up at the same time.

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

// =====================================================================
// SECTION 2 -- THIRD-PARTY SERVICES
//
// What the client pays a vendor DIRECTLY, alongside a chadworks engagement.
// Not competitors and not revenue: chadworks does not sell any of this and
// takes no margin on it. Each one is quoted so a client can see the whole cost
// of what they are buying, not just the chadworks half.
//
// THE RULE AT THE CALL SITE: never let one of these read as a chadworks price.
// Every sentence that renders one already names the vendor and says the money
// goes straight to them ("paid straight to OpenAI", "paid directly to Google").
// Keep that clause if you touch the copy -- it is the only thing separating a
// pass-through cost from a fee in the reader's mind.
//
// These move when the VENDOR says so, on no schedule of Chad's. Each carries
// the date it was last true.
// =====================================================================

// --- Google Workspace ------------------------------------------------
// Two readings of ONE vendor price, and both are published: /faqs/ quotes the
// real band, the switch page rounds to a ceiling. The ceiling is stated rather
// than derived, because "under $10" is a deliberately round promise and
// Math.ceil() off the band would silently restate it every time Google moves.
// If the band ever crosses the ceiling, the ceiling is the one that is wrong.
export const WORKSPACE_MONTHLY_LOW = 7; // $/user/month, Business Starter. As of July 2026.
export const WORKSPACE_MONTHLY_HIGH = 8; // $/user/month at the top of the entry tier.
export const WORKSPACE_MONTHLY_CEILING = 10; // the "under $X a month" the switch page rounds to.

// --- OpenAI ----------------------------------------------------------
export const ADS_MIN_DAILY_SPEND = 25; // $/day, OpenAI's own ad-spend floor, billed to the client's card. As of June 2026.

// --- Shopify ---------------------------------------------------------
// The platform under a Shopify build. SHOPIFY_BLOATED_BILL is the end state
// the /shopify/ page argues against (a lean plan buried under apps), not a
// price Shopify publishes; it is the illustration, kept here so it cannot
// contradict the two figures it is built from.
export const SHOPIFY_PLAN = 39; // $/month, the plan a small store starts on. As of July 2026.
export const SHOPIFY_APP_TYPICAL = 10; // $/month for one app that "solves everything".
export const SHOPIFY_BLOATED_BILL = 300; // $/month once the apps stack up. The cautionary total.

// --- Mailchimp -------------------------------------------------------
// Chad's real go-to line is the free tier, so the contact count is the figure
// that carries the argument. Not a dollar amount, but it prices the service.
export const MAILCHIMP_FREE_CONTACTS = 500; // contacts included before Mailchimp charges anything.

// --- Domain registration ---------------------------------------------
// Paid to whichever registrar holds the name, in the client's own account.
// Read by the cost guide's prose AND by the COMPONENTS table in section 3, so
// the anatomy row and the argument cannot quote different years.
export const DOMAIN_YEARLY_LOW = 12;
export const DOMAIN_YEARLY_HIGH = 20;

// =====================================================================
// SECTION 3 -- WHAT OTHERS CHARGE FOR THE SAME WORK
//
// The comparison set. Every figure below is an alternative a client could buy
// INSTEAD of chadworks for the same job: an agency, a freelancer, a DIY
// builder, an offshore shop, a WordPress host, a rival cost calculator. That
// is what separates this section from section 2, where the client pays a
// vendor ALONGSIDE chadworks rather than instead of it.
//
// These are other people's published prices. They go stale on other people's
// schedules, and a wrong one is chadworks' credibility, not theirs. Every entry
// carries a source and a last-verified date, and they get re-checked on a
// cadence rather than when somebody happens to notice.
// =====================================================================

// ---------------------------------------------------------------------
// WHAT A WORDPRESS HOST COSTS -- the alternative to chadworks static hosting.
//
// Read by /switch/leave-wordpress/, which argues the gap rather than the two
// prices: "leaving puts about $10 back in your pocket". That $10 is COMPUTED
// from the gap, so it can never contradict the two figures it sits between.
// ---------------------------------------------------------------------
export const WP_HOST_TYPICAL = 30; // $/month, roughly what a WordPress host runs.
export const WP_HOST_SAVING = WP_HOST_TYPICAL - STATIC_HOSTING; // the monthly gap, computed.

// ---------------------------------------------------------------------
// MARKET -- what a website costs by who builds it. Read by the guide.
//
// VERIFY THESE FIGURES BEFORE LAUNCH. They are other people's prices and they
// go stale; a wrong one is chadworks' credibility, not theirs.
//
// Last verified 2026-07-23, against each row's own href:
//   DIY builder   $16 to $99   CONFIRMED, and now first-party: Squarespace's
//                              own blog says "starting at around $16 per month
//                              ... up to $99 per month". It still does not say
//                              whether that is the annual or the monthly ladder,
//                              so that half of the old caveat stands.
//   Agency        $6,500+      CONFIRMED. WebFX now publishes "Basic web design
//                              costs $6,500 - $15,000" and an overall "$1,000 -
//                              $30,000+ in 2026", so both ends of this row and
//                              AGENCY_SMALL_BUSINESS_RANGE come straight off it.
//   Offshore      $2,500-8,000 CONFIRMED exactly: three published packages at
//                              $2,500 / $5,000 / $8,000, no form in the way.
//   Freelancer    $500-$15,000 RE-SOURCED. Forbes dropped the category, so the
//                              row moved to a freelance-specific study whose
//                              headline is "$500-$15,000 per website in 2026".
//                              Smallest publisher in this table; re-check it
//                              first. Full note sits on the row.
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
    // RE-SOURCED 2026-07-23 (Chad picked the replacement). The old href was
    // Forbes, which rewrote its guide as a "2026 Guide" and dropped the
    // freelancer category outright: the word stopped appearing on the page and
    // no figure on it matched $5,000 any more. It could not support this row.
    //
    // The new source prices freelance work specifically and publishes its
    // method (600+ scoped quotes across six markets, self-reported at +/-18%).
    // Its headline is "$500-$15,000 per website in 2026", which is where this
    // range now comes from. The top moved from $5,000 to $15,000 because that
    // is what the source says, and the wider spread happens to make the row's
    // own point harder rather than softer.
    //
    // Smaller publisher than the rest of this table, so it is the one to
    // re-check first. Its tiers, for a sanity read next time: landing page
    // $300-$1,500, brochure $800-$3,500, WordPress $1,200-$5,000, Shopify
    // $2,500-$8,000, custom app $10,000-$30,000.
    method: "Hire a freelancer",
    range: "$500 to $15,000",
    note: "One person, one invoice, and a wide range because a freelancer might mean a student on a template or a twenty year veteran writing custom code. The word covers both.",
    href: "https://projectcostestimator.com/freelance-website-cost",
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
    range: `${money(DOMAIN_YEARLY_LOW)} to ${money(DOMAIN_YEARLY_HIGH)} a year`,
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
// CALCULATORS -- the other cost calculators, and what each one does instead of
// answering you. Read by the calculator page's "what makes this different"
// section, where citing the alternatives is the point.
//
// VERIFY BEFORE LAUNCH, same as MARKET. websitecostcalculator.app has no
// first-party price to check; it is named for its behavior (industry averages),
// not a figure.
//
// Last verified 2026-07-23. Two rows had gone false and were corrected in the
// same pass: WebFX and Outliant BOTH show a range on the page now, so calling
// them "Gated" with the X watermark said they blocked something they no longer
// block. Both are "Range only" with the ~ watermark instead, which is the
// honest read: you get a number, just not a number anyone will stand behind
// without your contact details.
//
// This is the failure mode this block's own warning predicted, and it is worth
// naming: a competitor can fix the thing you criticised them for, and then the
// criticism is the inaccurate one. Re-read the BEHAVIOUR here, not just the
// figures. websitecostcalculator.app (still 2018 averages) and Pronto (still
// "$2,000 - $10,000" on a 1-6 page brochure site) both re-confirmed unchanged.
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
    tag: "Range only",
    mark: "~",
    note: "Gives you a range on the page, then puts the real number behind a lead form for a strategist to email you.",
    href: "https://www.webfx.com/web-design/learn/website-design-cost-calculator/",
  },
  {
    who: "Outliant",
    tag: "Range only",
    mark: "~",
    note: "Shows you a wide estimate, then asks for your contact details before anyone turns it into a quote, built to open a sales conversation rather than answer you on the spot.",
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
