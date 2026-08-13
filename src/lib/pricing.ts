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

// The top of the band chadworks publishes on the MARKET comparison table below
// (Chad, 2026-08-13). A posture figure like REDESIGN_TYPICAL: it is not the
// model's ceiling, which runs far higher on the biggest worked examples, and it
// is not TYPICAL_HIGH either, which is where MOST builds land rather than where
// they stop. It is the number that says how far a studio engagement realistically
// goes. Named rather than typed into the row so it stays retunable and off the
// price-audit allowlist.
export const STUDIO_HIGH = 20000; // $ top of the chadworks row on the market table.

// The Website Transformation Audit (/ai-generated-website-audit/): the UI/UX
// layer sold on its own, priced as a BAND rather than a flat fee (Chad,
// 2026-08-08), because what the audit costs tracks how many screens and flows
// the generated site actually has. The band is the one published in the
// 2026-08-05 essay "AI-Generated Websites are Making UI and UX Expertise A Real
// Premium, Real Fast", so the essay and the page cannot quote each other wrong.
//
// Both ends exported separately, for the reason the TYPICAL_LOW/HIGH block
// above spells out: Chad's sentences pick their own connector word.
export const TRANSFORMATION_LOW = 1000;
export const TRANSFORMATION_HIGH = 2500;
// No rendered-value comment on either of these, unlike the TYPICAL_* band
// above. price-audit.mjs scans comments as well as code, so annotating these
// with the strings they produce reads as two hand-typed chadworks prices and
// has to be blessed in the allowlist to pass. Blessing a real chadworks price
// is the exact bug that script exists to catch, so the annotation goes instead.
// Read the constants above for the figures.
export const TRANSFORMATION_BAND = `${money(TRANSFORMATION_LOW)} to ${money(TRANSFORMATION_HIGH)}`;
export const TRANSFORMATION_BAND_DASH = `${money(TRANSFORMATION_LOW)} - ${money(TRANSFORMATION_HIGH)}`;

// ---------------------------------------------------------------------
// THE SWITCH LANE -- hosting and migration, sold off the /switch/ pages.
//
// Quoted across five service files that all describe the same two numbers, so
// a hosting change used to be a five-file edit. What a WordPress host charges
// instead is a competitor figure and lives in section 3.
// ---------------------------------------------------------------------
export const STATIC_HOSTING = 20; // $/month, chadworks static hosting. The floor.
export const STATIC_HOSTING_NONPROFIT = 10; // $/month, non-profits and tight-budget organizations.
// The top of the hosting band the cost guide publishes (Chad, 2026-08-13:
// hosting "goes up from there"). A posture figure, like REDESIGN_TYPICAL: it
// says where ordinary hosting lands, not a ceiling anything is capped at.
// Named rather than typed into the row so it stays off the price-audit
// allowlist and moves with one edit.
export const STATIC_HOSTING_HIGH = 50; // $/month, top of the published band.

// Google Workspace setup. Both of these are what CHADWORKS charges to do the
// migration; Google's own per-user subscription is a third-party service and
// lives in section 2.
export const WORKSPACE_SETUP = 300; // $ one-time to chadworks: setup, training, signature.
export const WORKSPACE_EXTRA_MAILBOX = 25; // $ per additional mailbox set up at the same time.

// ---------------------------------------------------------------------
// THE 5K RACE LANE -- flat-rate packages sold off /website-design-for-5k-races/.
//
// FLAT RATES, not posture figures (Chad, 2026-08-11). These are the first
// numbers on the site that get published INSIDE the JSON-LD Offer rather than
// shown on the page over a price-free Offer, which means an assistant can quote
// them back at a race director. Treat every figure here as a public commitment.
//
// THE FLOOR HOLDS. Chad's ruling 2026-08-11: nothing chadworks builds starts
// below the baseline, so the entry package sits AT it rather than under it. The
// packages lane does not get to undercut the number /rates/ publishes.
//
// Deliberately NOT wired to BASE, for the reason VSR_START spells out above: a
// build baseline and a race package are separate products, and moving one must
// not silently move the other. They happen to be equal today.
export const RACE_STARTING_LINE = 3250; // $ flat. One page, phone-first, registration handoff.
export const RACE_FULL_COURSE = 5500;   // $ flat. The multi-page race site.

// ADD-ONS. Each is priced as realistic build hours against HOURLY rather than
// picked as a round number, so a client who does the division gets an answer
// that holds up. The hour estimate is in each comment; re-derive if HOURLY moves.
export const RACE_ADDON_REGISTRATION = 650;  // ~2h: wiring + testing the handoff to RunSignup, Eventbrite or Race Roster.
export const RACE_ADDON_SELF_EDIT = 1850;    // ~6h: the CMS layer, so the committee can change the schedule in race week.
export const RACE_ADDON_SPONSORS = 650;      // ~2h: the tiered sponsor wall.
export const RACE_ADDON_RESULTS = 950;       // ~3h: results plus the past-year archive.
export const RACE_ADDON_FUNDRAISING = 650;   // ~2h: donation and fundraising integration, for the charity races.
export const RACE_ADDON_COURSE_MAP = 650;    // ~2h: the course map and elevation.
export const RACE_ROLLOVER = 950;            // $ per year: roll the site to next year's date and archive the last one.

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
// WIDENED 2026-08-13 (Chad), from 12/20 to 20/100. His new COMPONENTS note
// quotes this band in prose, and the old ceiling was the old FLOOR of what he
// wrote, so the row would have contradicted itself on one line. Both the note
// and the row's range read these constants, so they cannot disagree again.
export const DOMAIN_YEARLY_LOW = 20;
export const DOMAIN_YEARLY_HIGH = 100;

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
    range: "$16 - $99 a month",
    // Chad's copy, 2026-08-13, verbatim.
    note: "Squarespace, Wix, GoDaddy Airo and countless others. These DIY builders are dirt cheap, until you add up your time spent on researching basic web design principles and running into the platforms' limitations.",
    href: "https://www.squarespace.com/blog/how-much-does-a-website-cost",
  },
  {
    // MOVED to second position and REPRICED 2026-08-13 (Chad). It used to sit
    // last at a much higher band, sourced to a Philippines article that priced
    // agencies in the low thousands. Chad: "we need a link that shows the dirt
    // cheap prices of offshore agencies."
    //
    // RE-SOURCED the same day to NetizenWorks, a Philippine agency that
    // publishes its whole package ladder openly, in pesos and dollars, with no
    // form in the way. That is a better citation than the old one on two counts:
    // it lands inside this row's band instead of above it, and it shows the
    // row's own claim rather than describing it, since the note calls these
    // prices fixed and cut-rate and the source is a published package ladder
    // doing exactly that.
    //
    // ONE GAP, LEFT FOR CHAD. Their entry package sits somewhat above this
    // row's floor, and the tier above the band's top is only a little over it.
    // So the source supports the SHAPE of the row and most of its span, but not
    // the very bottom of it. Raising the floor to their entry price would make
    // the row fully sourced; Chad set the floor deliberately, so it stands.
    method: "Send it offshore",
    range: "$100 - $1,000",
    // Chad's copy, 2026-08-13, verbatim.
    note: "Often fixed, cut-rate prices for passable products and services. The alluring price is made up for in poor communication or language and timezone barriers, and sometimes poor development practices.",
    href: "https://netizenworks.com/pricing/",
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
    range: "$500 - $15,000",
    // Chad's copy, 2026-08-13, verbatim. Inner double quotes are escaped rather
    // than swapped for curly ones: this string is rendered as text, so a plain
    // ASCII quote is what reaches the reader.
    note: "Affordable for most initiatives with a budget, but the term freelancer doesn't say much more than \"independent\" and \"solo.\" Prices might be affordable, but reliability, quality of work, communication style, candor and client experience can swing widely. Sometimes you have to go through a few to find one that you like (and likes you!)",
    href: "https://projectcostestimator.com/freelance-website-cost",
  },
  {
    // ADDED 2026-08-13 (Chad: "we need a fifth, small studio, before agency").
    //
    // CHADWORKS IS THIS ROW (Chad, 2026-08-13): "we are the small studio.
    // chadworks is the source. link to our rates page. we are a studio even if
    // it's one human."
    //
    // THIS ROW IS A DIFFERENT KIND OF MONEY FROM THE OTHER FOUR. Per
    // CWS-PRICING-HUB, the rest of this table is kind 3, what OTHERS charge:
    // somebody else's published figure, carrying a source href and a
    // re-verification duty, where a wrong number is chadworks' credibility. This
    // one is kind 1, what chadworks charges. It needs no outside source and no
    // re-check, because it is right when Chad says it is.
    //
    // Consequences, both deliberate:
    //   - `href` is INTERNAL. The renderer sends internal hrefs through <Link>
    //     with no nofollow and no target=_blank; you do not nofollow your own
    //     page or open your own site in a new tab.
    //   - `range` is COMPUTED from the hub, not typed, so it moves when the
    //     model is retuned and never lands on the price-audit allowlist. It
    //     runs from the published baseline to the top of the typical band.
    //
    // An earlier draft sourced this row to a small agency blog citing a Clutch
    // survey with no sample size. Chad called it unreliable and he was right;
    // do not reintroduce a third-party source here. The row is chadworks now.
    method: "Hire a small studio",
    range: `${money(BASE)} - ${money(STUDIO_HIGH)}`,
    // Chad's copy, 2026-08-13, verbatim. The *asterisks* mark emphasis: this is
    // a .ts file and cannot hold JSX, so the page wraps the delimited span in
    // <em> at render (see emphasize() in the cost-guide route). Chad asked for
    // "not" italicized; the marker is what carries that here.
    note: "This raises the price but also the bar slightly more than a solo freelancer because you get 2-4 specialists instead of one. You're paying for payroll but also *not* paying for agency overhead. (Due to the power of AI development, it's increasingly common for one person to do the job of a small studio, like chadworks!)",
    href: "/rates/",
  },
  {
    method: "Hire an agency",
    range: "$6,500 - $30,000+",
    // Opening sentence is Chad's copy, 2026-08-13, verbatim. The two sourced
    // figures behind it are unchanged.
    note: "Agencies are for big, healthy budgets. WebFX starts a small business site at $6,500, and a custom build from a firm like Outliant runs $25,000 to $30,000. Much of that is overhead and margin, not the website itself.",
    href: "https://www.webfx.com/web-design/pricing/",
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
    range: `${money(DOMAIN_YEARLY_LOW)} - ${money(DOMAIN_YEARLY_HIGH)} a year`,
    // Chad's copy, 2026-08-13, verbatim. He typed the band; it interpolates from
    // the same two constants the `range` above uses, so the sentence and the
    // number beside it move together. His one-dollar-sign form is preserved: the
    // low end goes through money(), the high end is the bare number.
    // (No figure is restated in this comment -- price-audit reads comments.)
    note: `This is what you type into your browser to reach your website. Typically billed annually or on multi-year terms that work out to around ${money(DOMAIN_YEARLY_LOW)}-${DOMAIN_YEARLY_HIGH}/year for standard TLDs (.com, .net, .org, etc.) Note that some domain names are already taken and might be wholly unavailable or come at a premium one-time price to buy it from the current owner.`,
  },
  {
    part: "Hosting",
    // REPRICED 2026-08-13 (Chad): chadworks hosting is never free, it starts at
    // the STATIC_HOSTING floor and goes up from there. The old floor was zero,
    // which contradicted the note beside it. Both ends now read constants, so
    // the row cannot disagree with the rest of the site.
    range: `${money(STATIC_HOSTING)} - ${money(STATIC_HOSTING_HIGH)}+ a month`,
    // Chad's copy, 2026-08-13, verbatim.
    note: "Hosting is a required recurring fee for any website. Whether a monthly or annual bill from your host/webmaster or part of the monthly fee you pay DIY builders like Squarespace, if you have a website, you are paying for hosting.",
  },
  {
    part: "Design and the build",
    // PRICED 2026-08-13 (Chad). This used to read "the variable one" rather than
    // a figure. The span is the MARKET's, not chadworks': the floor sits far
    // below BASE because anyone can be paid to build something, and the row
    // describes the component of a website's cost generally. Typed rather than
    // hub-read for that reason, same as the other spans in this table.
    range: "$100 - $25,000+",
    // Chad's copy, 2026-08-13, verbatim. The [label](/href) marker is rendered
    // as a link by inlineMarkup() on the cost-guide route; this file is .ts and
    // cannot hold JSX. His "(link to that page)" instruction becomes the link
    // itself rather than surviving as parenthetical text.
    note: "This is the fee to build the site itself. It's what most of this page is about and is, unsurprisingly, the largest single cost of having a website built by a professional. This is what my [website design cost calculator](/website-design-cost-calculator/) scopes and prices.",
  },
  {
    part: "Content Development",
    range: "$0 - $1,000+",
    // Chad's copy, 2026-08-13, verbatim. Inner double quotes are escaped rather
    // than swapped for curly ones: this renders as text, so a plain ASCII quote
    // is what reaches the reader.
    note: "This includes copy: the \"written\" words on your site and visual media: photos, images, videos, textures, logos, and any non-text or interface elements. Easy to mention, harder to develop and definitely not cheap if you want original and/or high quality content.",
  },
  {
    part: "Maintenance",
    range: "$0 - $200 a month",
    // Chad's copy, 2026-08-13, verbatim.
    note: "This word is thrown around a lot, but here it means keeping a website's moving parts healthy and updated. This is technical maintenance, which applies on a case-by-case basis. WordPress requires maintenance. Static sites usually do not.",
  },
  {
    // ADDED 2026-08-13 (Chad). Sits after Maintenance because its first words
    // define it against that row.
    part: "Content Updates",
    // No band: this is billed by time, not scoped as a range, which is the whole
    // argument the note makes against monthly update packages. Reads MINUTELY so
    // it cannot drift from /rates/ or the after-launch ledger further down the
    // page, both of which quote the same rate.
    range: `${money(MINUTELY)}/min`,
    // Chad's copy, 2026-08-13, verbatim. Both of his "(link to ...)" instructions
    // become the links themselves rather than surviving as parenthetical text;
    // the [label](/href) marker is rendered by inlineMarkup() on the route.
    note: "Distinct from technical maintenance, content updates covers updating the actual content on your website. Posts, pages, images and text. Most web designers and agencies offer monthly update packages, but chadworks bills updates at his [minutely rate](/rates/). [Click here](/essays/is-your-agency-ripping-you-off/) to read an essay about maintenance retainers.",
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
//
// Re-verified 2026-08-05 during the calc backlink run. All four existing rows
// re-confirmed. Brantley Sites ADDED, and it is a different KIND of row from the
// other four, which is the reason it earns a slot. The others all fail by
// refusing to give a real number. Brantley gives one, ungated, and still cannot
// answer, because the figure is pre-baked per business type and never touches
// your scope. That makes it the foil for this page's PRIMARY argument (a scope
// you build and watch priced in real time) rather than for the secondary
// no-gate argument, which Brantley actually matches us on. Naming it costs us a
// little of the ungated claim and buys a much sharper contrast. Chad's call.
//
// DELIBERATELY LEFT OUT: websitecostcalculator.io (a Softeko product, low/high
// columns, no methodology, every price renders as zero in the static HTML). It is
// a duplicate of the averaged/opaque failure mode the .app row already covers,
// so it would add a row without adding an argument. This list is an ARGUMENT,
// not a census of competitors. Fourteen more were logged in the quest doc's
// skip list on 2026-08-05 and none of them belong here either.
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
  {
    who: "Brantley Sites",
    tag: "Pre-baked",
    mark: "[ ]",
    note: "Assumes all websites in the same industry share the same baseline. Range is bucketed by business type rather than built from your scope.",
    href: "https://brantleysites.com/website-cost-calculator/",
  },
];
