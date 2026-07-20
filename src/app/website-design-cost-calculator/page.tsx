// Route: /website-design-cost-calculator/ -- the scope calculator.
//
// Renamed from /build-your-website-package/ on 2026-07-17. The slug is a SERP
// call: every calculator variant ("website cost calculator", "web design cost
// calculator", "website design pricing calculator") returns one near-identical
// SERP, so this is ONE keyword wearing different labels. The head-term slug
// (/website-cost-calculator/) is held by 7+ competitors including two
// exact-match domains sitting at #1/#2, which a solo studio cannot
// structurally beat. Only 3 pages hold exact match on the design-qualified
// variant, and pages cross-rank both ways, so this reaches the same SERP with
// a third of the competition. Chad's call.
//
// THE PAGE SHAPE. The spike's rule was "the tool IS the page: stage + footer".
// That rule now holds for the FOLD only. Everything below the stage is the
// citation layer, and it exists because of one hard finding: AI crawlers do
// not execute JavaScript (Vercel/MERJ, 1.3B crawler fetches: GPTBot,
// ClaudeBot and PerplexityBot all fetch js and none run it). A price that
// lives only in calculator state is a price no engine can read. So the rate
// card is ALSO server-rendered as static HTML, generated from the model in
// lib/package-builder so it can never drift from what the tool charges.
//
// THE DIFFERENTIATOR. Every ranking calculator either gates the number behind
// a form (WebFX, Outliant) or quotes "industry averages" nobody actually
// charges (websitecostcalculator.app). None publishes one real studio's real
// rate card with no gate. That gap is why this page can earn a link it did
// not buy.
//
// THE INTENT SPLIT (2026-07-20). This page serves TOOL intent only. The
// informational cluster ("how much does a website cost", cost by build method,
// the component breakdown, the USA framing) moved to
// /how-much-does-a-website-cost/, because that query returns a different SERP
// of editorial guides, not calculators (WebFX runs one page per intent). The
// two pages cross-link, and both read the SMALL_BUSINESS/STORE example scopes
// from lib/package-builder so their figures can never disagree.
//
// NOT in launch.ts, so the layout's noindex default keeps this sealed.

import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { PageComposer, MainContactCapsule, PathsCapsule } from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import { ScopeCalculator } from "@/components/package-builder/ScopeCalculator";
import {
  BASE,
  BASELINE,
  PARAMS,
  PER_PAGE_LADDER_KEYS,
  SMALL_BUSINESS,
  STORE,
  UNIT_RATES,
  ladderFor,
  money,
  paramValue,
  price,
  weeksLabel,
  wire,
  type Param,
  type Scope,
} from "@/lib/package-builder";

// The exact scope behind an example, as ticks under its timeline. Pages and
// sections always show (the spine of any build); everything else shows only
// when it is actually engaged, so the list reads as "what is in THIS build".
function scopeTicks(s: Scope): { label: string; value: string }[] {
  return PARAMS.filter((p) => {
    const v = s[p.key] as number;
    switch (p.key) {
      case "pages":
      case "sections":
        return true;
      case "locales":
        return v > 1;
      case "integrations":
        return v !== 0;
      case "timeline":
        return v > 0;
      case "brandingDone":
      case "content":
        return v >= 0; // a real choice was made (baseline leaves these unset)
      default:
        return v > 0; // ambition, mathDev, editability, motion, commerce
    }
  }).map((p) => ({ label: p.label, value: paramValue(p, s) }));
}

const PAGE_URL = `${SITE_URL}/website-design-cost-calculator/`;
const TITLE = "Website Design Cost Calculator: Priced to the Dollar | chadworks";
const DESCRIPTION =
  "A website design cost calculator running one studio's real rate card. Set your project scope and it prices the build to the dollar: a $3,200 baseline plus published figures for pages, custom development, branding, and a rush timeline.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Website Design Cost Calculator | chadworks",
    description:
      "A website design cost calculator that prices your build to the dollar from a working studio's published rate card, every line item shown.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Design Cost Calculator | chadworks",
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// --- JSON-LD: WebPage + 3-level BreadcrumbList, following /rates/. ---
//
// Deliberately NO FAQPage. The only controlled test of schema's effect on AI
// citation (Ahrefs difference-in-differences, 1,885 pages against 4,000
// controls) measured -4.6% on AI Overviews and statistical noise on ChatGPT
// and AI Mode, and Google deprecated FAQ rich results for non-government and
// non-health sites in 2023. The Q&A TEXT below is what gets retrieved; the
// markup would be decoration. /rates/ made the same call.
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Website Design Cost Calculator",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: { "@type": "Organization", name: "chadworks", url: SITE_URL },
  // E-E-A-T: the calculator and its rates are authored by a named expert. Points
  // at the canonical Person on /about/ (same name, url and jobTitle), so an
  // engine merges this into one author entity rather than a second Chad.
  author: {
    "@type": "Person",
    name: "Chad",
    url: `${SITE_URL}/about/`,
    jobTitle: "Web designer and developer",
    knowsAbout: ["Web design", "Web development", "Website pricing", "Ecommerce"],
  },
  // The baseline as a real, liftable price. Reads BASE, never a retyped number.
  mainEntity: {
    "@type": "Service",
    name: "Custom website design and development",
    // Country, not State: the targets are national (Chad, 2026-07-17). This
    // scopes the entity to the US without pinning it to a region.
    provider: { "@type": "Organization", name: "chadworks", url: SITE_URL },
    areaServed: { "@type": "Country", name: "United States" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: String(BASE),
        priceCurrency: "USD",
      },
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
    },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Websites", item: `${SITE_URL}/websites/` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Website Design Cost Calculator",
      item: PAGE_URL,
    },
  ],
};

// ---------------------------------------------------------------------
// WORKED EXAMPLES -- real scopes, priced by the real model at build time.
//
// Every figure is computed by price(), never typed by hand, so retuning a
// ladder rewrites these in the same edit. The rushed example is the small
// business scope with the timeline switched on, so the multiplier reads
// straight off the pair.
// ---------------------------------------------------------------------
// SMALL_BUSINESS and STORE now live in lib/package-builder, shared with the
// /how-much-does-a-website-cost/ guide so the two pages quote the same figures
// to the dollar. EXAMPLES composes them below.
// Each example carries a `slug` that also names its shape PNG in public/shapes/
// (a transparent render of the object at that scope, generated once from this
// same model). Keep the slug and the scope in step: a scope change means the
// shape PNG must be regenerated, or the picture drifts from the number.
const EXAMPLES: { slug: string; name: string; detail: string; scope: Scope }[] = [
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
];

// ---------------------------------------------------------------------
// AFTER LAUNCH -- the ongoing-cost question, held to the same discipline as
// the build.
//
// The biggest hole in every calculator on this SERP, including this one until
// now: they price the build and go quiet about everything after it. The
// anxiety underneath the query was never "what does it cost to make". It is
// "what happens the first time I need a word changed and I have to call
// somebody". A page that answers that outranks a page that dodges it.
//
// NOTHING HERE IS A NEW PRICE. Every figure is the minutely rate already
// published on /rates/ applied to the task times already published on
// /rates/, computed rather than typed so the two pages cannot drift.
// ---------------------------------------------------------------------
const MINUTELY = 5.25; // $/min. Also stated in /rates/, /faqs/ and RatesCapsule.

// Minutes are lifted from RATE_EXAMPLES on /rates/. Keep them in step.
const AFTER_LAUNCH: { task: string; min: number; max: number }[] = [
  { task: "Changing the text on a page", min: 1, max: 1 },
  { task: "Swapping an image", min: 1, max: 1 },
  { task: "Adding a page you did not plan for", min: 10, max: 10 },
  { task: "Fixing something small that broke", min: 10, max: 20 },
  { task: "Building a whole new page template", min: 30, max: 30 },
];

const cost = (mins: number) => money(Math.round(mins * MINUTELY));
const costRange = (r: { min: number; max: number }) =>
  r.min === r.max ? cost(r.min) : `${cost(r.min)} to ${cost(r.max)}`;

// What the rest of the industry quotes. Sourced, linked, and set against the
// numbers above, because citing sources is the strongest GEO lever available
// to a page that does not already rank (Princeton GEO, KDD 2024: rank-5 pages
// gained +115% visibility from citing sources, while rank-1 pages LOST 30%
// from the same move).
//
// VERIFY THESE FIGURES AGAIN BEFORE LAUNCH. They are other people's prices and
// they go stale, and a wrong one is chadworks' credibility, not theirs.
//
// Last verified 2026-07-19. WebFX, Pronto and Outliant all re-confirmed
// against their live pages, wording unchanged.
//
// SQUARESPACE IS THE SOFT ONE. Their pricing page renders the numbers in JS,
// so there is no first-party HTML to check them against; $16 to $99 is the
// annual-billing ladder corroborated by a third party (Website Builder Expert,
// June 2026), not read off Squarespace itself. Monthly billing runs $21 to
// $119. Chad: eyeball that one in a browser before this page goes public.
const INDUSTRY: { who: string; range: string; note: string; href: string }[] = [
  {
    who: "WebFX, small business site",
    range: "$6,500 to $15,000",
    note: "An agency whose baseline sits above most of my finished builds.",
    href: "https://www.webfx.com/web-design/pricing/",
  },
  {
    who: "Pronto, brochure site of 1 to 6 pages",
    range: "$2,000 to $10,000",
    note: "A five times spread on one sentence, which tells you the number was never the point.",
    href: "https://www.prontomarketing.com/website-cost-calculator/",
  },
  {
    who: "Outliant, basic custom build",
    range: "$25,000 to $30,000",
    note: "Real work at a real number, priced for a company that has a procurement department.",
    href: "https://www.outliant.com/website-cost-calculator",
  },
  {
    who: "An offshore studio, custom build",
    range: "$2,500 to $8,000",
    note: "Real fixed prices published without a form in front of them, which is more than most studios on this list manage. What the figure does not cover is the distance, because the person building it works a half day out of phase with yours and you will feel that every time something needs deciding.",
    href: "https://dixieraizpacheco.com/web-design-cost-philippines",
  },
  {
    who: "Squarespace and the builders, do it yourself",
    range: "$16 to $99 a month",
    note: "Cheap until you count the year, notice the template everyone else is also using, and realize you never own it.",
    href: "https://www.squarespace.com/blog/how-much-does-a-website-cost",
  },
];

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Why do website design quotes vary so much?",
    a: (
      <>
        Because most quotes are for different websites that share a word. One
        studio prices a template with your logo dropped in; another prices forty
        hours of custom design. A wide spread means the scope has not been pinned
        down yet. That is why this calculator gives you twelve real controls,
        pages and development and branding and commerce each priced on its own, so
        the number reflects your actual project.
      </>
    ),
  },
  {
    q: "Is this calculator accurate?",
    a: (
      <>
        It is accurate about my rates and honest about your project. Every
        number it adds up is published in the table above, so you can check the
        arithmetic yourself. What it cannot know is that your booking system has
        to talk to a twelve year old scheduling database, and that kind of thing
        is exactly where estimates die. Treat the number as a real starting point
        for a real conversation. It becomes a quote once we have talked through
        the parts a slider cannot see.
      </>
    ),
  },
  {
    q: "What is the most expensive part of a website?",
    a: (
      <>
        Almost never the design. Visual ambition on the table tops out at{" "}
        {money(ladderFor("ambition")?.at(-1) ?? 0)}. Custom development reaches{" "}
        {money(ladderFor("mathDev")?.at(-1) ?? 0)} and commerce reaches{" "}
        {money(ladderFor("commerce")?.at(-1) ?? 0)}, both far past it. The
        expensive part is machinery: logic that has to be right every single
        time, and systems that keep talking to each other long after I am gone.
      </>
    ),
  },
  {
    q: "Can I update the site myself after launch?",
    a: (
      <>
        As much as you want to pay for. It is a real line on the calculator,
        because editability is something I build into the site, and how much you
        get is priced by how much you want. Swapping text and images is close to
        free. Rebuilding a page layout on your own is{" "}
        {money(ladderFor("editability")?.at(-1) ?? 0)}, because I have to build
        you something that cannot break when you use it.
      </>
    ),
  },
  {
    q: "Why is there no form on this page?",
    a: (
      <>
        Because your budget is yours. You get the number here, and you email me
        only if you want to. Read the total, decide I am too expensive, and we
        both just saved a phone call. Nothing you do with this calculator reaches
        me until you send it.
      </>
    ),
  },
];

// ---------------------------------------------------------------------
// THE RATE CARD ROWS.
//
// One panel per scope layer, so the published card has the same 12 groups the
// calculator has. A step param lists its ladder; a counted param states its
// per-unit rate; timeline states its multiplier. Everything reads from the
// model, so nothing here can drift from what the tool charges.
// ---------------------------------------------------------------------
type CardRow = { opt: string; amt: string; zero?: boolean };

function rowsFor(p: Param): CardRow[] {
  const ladder = ladderFor(p.key);
  if (ladder && p.options) {
    const perPage = PER_PAGE_LADDER_KEYS.has(p.key);
    return p.options.map((opt, i) => ({
      opt,
      amt: ladder[i] === 0 ? "no charge" : money(ladder[i]) + (perPage ? " / page" : ""),
      zero: ladder[i] === 0,
    }));
  }

  switch (p.key) {
    case "pages":
      return [
        { opt: `The baseline covers ${UNIT_RATES.pagesIncluded} pages`, amt: "included", zero: true },
        { opt: "Each page after that", amt: money(UNIT_RATES.perPage) },
      ];
    case "sections":
      return [
        {
          opt: `The baseline covers ${UNIT_RATES.sectionsIncluded} per page`,
          amt: "included",
          zero: true,
        },
        { opt: "Each section after that, per page", amt: money(UNIT_RATES.perSection) },
      ];
    case "integrations":
      return [{ opt: "Each system wired in", amt: money(UNIT_RATES.perIntegration) }];
    case "locales":
      return [
        { opt: "The first language", amt: "included", zero: true },
        { opt: "Each language after that", amt: money(UNIT_RATES.perLocale) },
      ];
    case "timeline":
      return (p.options ?? []).map((opt, i) => {
        const mult = UNIT_RATES.timelineMult[i];
        return {
          opt,
          amt: mult === 1 ? "no change" : `+${Math.round((mult - 1) * 100)}% of the build`,
          zero: mult === 1,
        };
      });
    default:
      return [];
  }
}

// Longest tables first (Chad, 2026-07-17). Sorting by row count rather than by
// the model's order keeps the auto-fit grid from stranding a one-row panel
// beside a five-row one, so the card packs instead of leaving ragged holes.
// Array.sort is stable, so panels of equal length hold the calculator's order.
const CARD_GROUPS: { param: Param; rows: CardRow[] }[] = PARAMS.map((param) => ({
  param,
  rows: rowsFor(param),
})).sort((a, b) => b.rows.length - a.rows.length);

export default function WebsiteDesignCostCalculatorPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* The tool owns the fold, and the send-this-scope form sits right under
          it. Everything below that is the citation layer. */}
      <ScopeCalculator />

      {/* The hook: an answer-first, keyphrase-led intro (Yoast/GEO -- the phrase
          in sentence one, the baseline inside the first ~200 words) beside a
          static at-a-glance panel a JS-less crawler can still read. */}
      <SectionShell className="svc-block">
        <p className="eyebrow">The calculator, in the open</p>
        <h1 className="svc-block__heading svc-fill">
          Website Design Cost Calculator
        </h1>
        <div className="cw-calc-intro">
          <div className="svc-prose svc-prose--lead">
            <p>
              This website design cost calculator prices a custom website to the
              dollar, from a {money(BASE)} baseline. Set your scope on the tool
              above and the estimate builds line by line off one working
              studio&apos;s published rate card, covering pages, custom
              development, branding, ecommerce, and a rushed timeline.
            </p>
            <p>
              I am Chad, and I have designed and built custom websites for twenty
              years. This cost calculator runs on my own rates, priced the way I
              would quote your project in person. The full ladder is published
              below, so you can estimate your website down to the line without
              ever talking to me. Nothing is sent until you send it.
            </p>
          </div>
          <aside className="panel cw-calc-glance">
            <p className="cw-calc-glance__title">At a glance</p>
            <dl>
              <div className="cw-calc-glance__row">
                <dt className="cw-calc-glance__k">Baseline</dt>
                <dd className="cw-calc-glance__v">{money(BASE)}</dd>
              </div>
              <div className="cw-calc-glance__row">
                <dt className="cw-calc-glance__k">Cost factors priced</dt>
                <dd className="cw-calc-glance__v">{PARAMS.length}</dd>
              </div>
              <div className="cw-calc-glance__row">
                <dt className="cw-calc-glance__k">Baseline turnaround</dt>
                <dd className="cw-calc-glance__v">{weeksLabel(BASELINE)}</dd>
              </div>
              <div className="cw-calc-glance__row">
                <dt className="cw-calc-glance__k">Email to see it</dt>
                <dd className="cw-calc-glance__v">Never</dd>
              </div>
            </dl>
          </aside>
        </div>
      </SectionShell>

      {/* The rate card. THE citation layer: static HTML, generated from the
          model, readable by an engine that will never run the calculator. */}
      <SectionShell className="svc-block">
        <p className="eyebrow">The rate card</p>
        <h2 className="svc-block__heading svc-fill">
          What a website costs here, line by line
        </h2>
        <div className="svc-prose">
          <p>
            The baseline is {money(BASE)}. That buys {UNIT_RATES.pagesIncluded}{" "}
            pages at {UNIT_RATES.sectionsIncluded} sections each, custom
            designed and custom built, with your brand settled and your words
            written. Every line below adds to that baseline at the figure shown,
            and the calculator sums them.
          </p>
        </div>
        {/* The baseline stays a statement on its own: it is the one number that
            is not a modifier, so it does not belong in a group with them. */}
        <dl className="rates-ledger">
          <div className="rates-ledger__row">
            <dt className="rates-ledger__label">
              The baseline build: {UNIT_RATES.pagesIncluded} pages at{" "}
              {UNIT_RATES.sectionsIncluded} sections each
            </dt>
            <dd className="rates-ledger__num">{money(BASE)}</dd>
          </div>
        </dl>

        {/* One panel per scope layer, longest tables first. */}
        <div className="cw-ratecard">
          {CARD_GROUPS.map(({ param: p, rows }) => (
            <section key={p.key} className="cw-ratecard__group">
              <div className="cw-ratecard__head">
                <h3 className="cw-ratecard__title">{p.label}</h3>
                <p className="cw-ratecard__hint">{p.hint}</p>
              </div>
              <dl className="cw-ratecard__rows">
                {rows.map((r) => (
                  <div key={r.opt} className="cw-ratecard__row">
                    <dt className="cw-ratecard__opt">{r.opt}</dt>
                    <dd
                      className={`cw-ratecard__amt${
                        r.zero ? " cw-ratecard__amt--zero" : ""
                      }`}
                    >
                      {r.amt}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="svc-prose svc-prose--plain">
          <p>
            Rush is a percentage of the whole build, because urgency taxes every
            hour of a project at once. It is the one line that buys you something
            other than more website: the baseline build takes {weeksLabel(BASELINE)},
            and the rush premium pushes your project to the front of the queue, so
            the weeks drop as the price climbs. Branding works in reverse. The
            more you bring in hand, the less I build, so a full system in hand
            costs nothing and a blank start costs{" "}
            {money(ladderFor("brandingDone")?.[0] ?? 0)}.
          </p>
        </div>
      </SectionShell>

      {/* What the baseline actually buys. Without this the $3,200 is
          unfalsifiable, and it is also where the "lower, not lesser" argument
          gets its evidence: a list an engine can lift, rather than a paragraph
          asking to be believed.

          Nothing here was invented to fill the list out. The accessibility and
          privacy lines are Chad's call (2026-07-19): both are baselines on
          every build, and both are stated as PRACTICE rather than as a named
          standard, so there is no conformance claim to defend. Keep it that
          way. The same two baselines are stated on /faqs/ and the service
          pages; they should move together. */}
      <SectionShell className="svc-block">
        <p className="eyebrow">Always included</p>
        <h2 className="svc-block__heading svc-fill">
          What every build includes, whatever the number says
        </h2>
        <div className="svc-prose">
          <p>
            The calculator changes a lot from one project to the next. These
            parts stay the same on every build, at the baseline and at the top of
            the ladder alike. They are what a website has to do before I put my
            name on it.
          </p>
        </div>
        <ul className="cw-included">
          <li>
            The code, the domain, and the hosting all end up in your name, on
            day one.
          </li>
          <li>
            It is designed and built for your business alone, a layout no other
            company is running.
          </li>
          <li>
            It loads fast, because the pages are finished and waiting before
            anyone asks for them.
          </li>
          <li>
            There is no database sitting behind it for somebody to break into,
            which is most of what people mean when they say a site got hacked.
          </li>
          <li>
            Hosting a site built this way costs close to nothing, and the bill
            goes straight to you.
          </li>
          <li>
            It works on a phone, checked on real ones and not just by shrinking
            a browser window.
          </li>
          <li>
            Google is handed a map of your pages and the technical groundwork it
            needs to actually list you, and that same groundwork is what lets
            ChatGPT and the other engines read you and quote you correctly.
          </li>
          <li>
            It works with a keyboard and a screen reader, no mouse required, and
            it respects the setting a visitor turned on to stop things moving.
          </li>
          <li>
            Nothing measures your visitors until they agree to it, and there are
            no advertising or marketing pixels on it anywhere.
          </li>
        </ul>
        <div className="svc-prose svc-prose--plain">
          <p>
            The first one is worth reading twice. The code, the domain, and the
            hosting are in your name from the day it launches, including the parts
            that make it easy to walk to another builder. You own the whole
            website the moment it goes live, keys and all.
          </p>
        </div>
      </SectionShell>

      {/* Worked examples: the ladder turned into four real projects. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <p className="eyebrow">Worked examples</p>
        <h2 className="svc-block__heading svc-fill">
          Four Real-World Examples of Website Cost
        </h2>
        <div className="svc-prose">
          <p>
            Every figure here comes from the same model running the tool above,
            computed at build time. These are prices I would quote you today.
          </p>
        </div>
        <div className="cw-builds">
          {EXAMPLES.map((ex) => (
            <article key={ex.slug} className="cw-build">
              <div className="cw-build__body">
                <h3 className="cw-build__title">
                  {ex.name}{" "}
                  <span className="cw-build__price">
                    {money(price(ex.scope))}
                  </span>
                </h3>
                <p className="cw-build__detail">{ex.detail}</p>
                <p className="cw-build__meta">
                  Roughly {weeksLabel(ex.scope)} from starting to launched.
                </p>
                <ul className="cw-build__scope">
                  {scopeTicks(ex.scope).map((t) => (
                    <li key={t.label} className="cw-build__scope-item">
                      {t.label}: {t.value}
                    </li>
                  ))}
                </ul>
              </div>
              {/* The object at this exact scope, rendered once from the model to
                  a transparent PNG. Decorative, so alt is empty. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
              <img
                className="cw-build__shape"
                src={`/shapes/${ex.slug}.webp`}
                alt=""
                width="860"
                height="500"
                loading="lazy"
                decoding="async"
              />
            </article>
          ))}
        </div>
      </SectionShell>

      {/* After launch. Answers the question the calculator's number cannot:
          not what the site costs to build, what it costs to keep. Every figure
          is computed from the published minutely rate. */}
      <SectionShell className="svc-block">
        <p className="eyebrow">After launch</p>
        <h2 className="svc-block__heading svc-fill">
          What it costs after it launches
        </h2>
        <div className="svc-prose svc-prose--lead">
          <p>
            The number above buys a finished website. It does not answer the
            question you are actually going to have eight months from now, on
            the Tuesday you notice a price on your services page is wrong and
            you have to figure out who to call and what they are going to charge
            you for a sentence.
          </p>
          <p>
            Here is that answer. Nothing recurring comes to me. You will own
            a domain, which runs about $12 to $20 a year from whoever you
            registered it with, and the static builds I put most people on cost
            little or nothing to host because there is no database sitting there
            waiting to be attacked. When you need me after launch you pay for
            the minutes I actually spend, at the same {money(MINUTELY)} a minute
            published on my <Link href="/rates/">rates page</Link>. In practice
            that looks like this.
          </p>
        </div>
        <dl className="rates-ledger">
          {AFTER_LAUNCH.map((row) => (
            <div key={row.task} className="rates-ledger__row">
              <dt className="rates-ledger__label">{row.task}</dt>
              <dd className="rates-ledger__num">{costRange(row)}</dd>
            </div>
          ))}
        </dl>
        <div className="svc-prose svc-prose--plain">
          <p>
            Changing a line of text costs about five dollars because it takes
            about a minute. That is the whole model: you pay for the minutes the
            work takes, with no monthly plan for work that may never come. A
            WordPress site is the exception. It needs regular care, so it carries
            a plan at $550 every six months, because a WordPress site left alone
            is a WordPress site that gets hacked.
          </p>
        </div>
      </SectionShell>

      {/* Cite sources: the strongest lever a page like this has. */}
      <SectionShell className="svc-block">
        <p className="eyebrow">The market</p>
        <h2 className="svc-block__heading svc-fill">
          What everybody else quotes for the same website
        </h2>
        <div className="svc-prose">
          <p>
            Here is what the pages you probably just came from are quoting. Watch
            the spreads. A five times range on a six page brochure site is a way
            of putting the answer off until you are on a sales call. For the whole
            market broken down by who builds it, from a builder subscription up to
            an agency invoice, see{" "}
            <Link href="/how-much-does-a-website-cost/">
              how much a website costs
            </Link>
            .
          </p>
        </div>
        <dl className="rates-ledger">
          {INDUSTRY.map((row) => (
            <div key={row.who} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                <a href={row.href} rel="nofollow noopener" target="_blank">
                  {row.who}
                </a>
                . {row.note}
              </dt>
              <dd className="rates-ledger__num">{row.range}</dd>
            </div>
          ))}
        </dl>
        <div className="svc-prose svc-prose--plain">
          <p>
            My baseline of {money(BASE)} and a finished small business site at{" "}
            {money(price(SMALL_BUSINESS))} sit under most of that table. The
            offshore tier starts lower than mine, and there you trade the savings
            for distance: a builder working a half day out of phase with you is a
            cost you pay in every decision. The gap between my numbers and the
            agency numbers is arithmetic, and it is worth walking through.
          </p>
        </div>
      </SectionShell>

      {/* THE ARGUMENT. Why the baseline is lower without the work being lesser:
          agency capability, one person's overhead, no investors and no
          stakeholders, priced on what Chad needs plus what the thing is worth.
          Carries the honest downside too, because a claim this good is not
          believable without one. Dark for weight; rule 9 holds (the section
          before and after it are both light). */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <p className="eyebrow">The economics</p>
        <h2 className="svc-block__heading svc-fill">
          Where the number actually comes from
        </h2>
        <div className="cw-onep__layout">
        <div className="svc-prose svc-prose--lead">
          <p>
            When an agency quotes {INDUSTRY[0].range} for a five page website,
            most of that number pays for the building it happened in. An account
            manager answers your email, a salesperson booked a commission the day
            you signed, a project manager relays messages between them and the
            person doing the work, and everyone sits in an office the owners
            expect a margin on. The build underneath might be forty hours.
          </p>
          <p>
            I do not have any of that. There is no investor here waiting on a
            return, no board asking why revenue did not grow this quarter, no
            stakeholder who has never met you holding an opinion about your
            invoice, and nobody upstairs who needs this year to beat last year.
            There is me. So my number gets built out of two things and nothing
            else: what I need to earn as one person to keep doing this properly,
            and what the finished thing is actually worth to your business. No
            growth target is priced into your quote, because there is no growth
            target.
          </p>
          <p>
            The capability holds even as the overhead falls away. I have designed
            since I was eleven and built client websites since 2008, and I do both
            the design and the code myself, so your idea reaches the browser
            without a handoff that could dilute it. You get the full craft, and
            one person who carries the whole project start to finish.
          </p>
          <p>
            One person is one calendar. There is no bench to throw at your
            project when it doubles in size, and no second shift picking it up
            overnight. If I am booked, you wait or you go elsewhere. A project
            that genuinely needs guaranteed capacity and a backup team is a
            project for an agency, and I will say so on the call.
          </p>
          <p>
            My baseline is {money(BASE)} and it holds. Below it I would be cutting
            the parts that make a website worth building, so it stays where it is.
            You are paying for the work, and for the twenty years that make the
            work good and fast. That is the whole of the number.
          </p>

          {/* A real client corroborating the claim the section just made.
              Quotation Addition is the strongest measured GEO lever there is
              (Princeton, KDD 2024: 27.8% against a 19.5% baseline, +22% on
              live Perplexity), and a page that says "I will not upsell you"
              is worth more when somebody else says it. Same markup as
              TestimonialsCapsule so it inherits the styling and the headshot
              instead of inventing a second quote treatment. */}
          <figure className="svc-testimonial cw-onep__quote">
            <blockquote className="svc-testimonial__quote">
              Chad is very professional, talented and skilled. He does not try
              to sell you on products or services that you don&apos;t need.
            </blockquote>
            <figcaption className="svc-testimonial__byline">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
              <img
                className="svc-testimonial__avatar"
                src="/people/kimberly-dolan.webp"
                alt=""
                loading="lazy"
              />
              <p className="svc-testimonial__by">
                Kimberly Dolan, K.I.M. Keep It Moving (Philadelphia)
              </p>
            </figcaption>
          </figure>
        </div>
          {/* The portrait IS the argument: the section claims one person, so it
              shows the person rather than a logo. */}
          <figure className="cw-onep__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/cutouts/chad_cutout_home.webp"
              alt="Chad, the one person who designs and builds every chadworks site"
              decoding="async"
              loading="lazy"
            />
          </figure>
        </div>
      </SectionShell>

      {/* The FAQ. Content-first, question-shaped, no FAQPage markup (see the
          JSON-LD note above). The phrasings are the ones people really use. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <p className="eyebrow">Questions</p>
            <h2 className="svc-block__heading svc-fill">
              The questions people actually ask about website cost
            </h2>
            <p className="svc-faq__lead">
              Answered the way I would answer them on the phone, with the
              numbers left in.
            </p>
          </div>
          <div className="cw-rate-explainer__body">
            {FAQS.map((f) => (
              <div key={f.q} className="svc-prose svc-prose--plain">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <PathsCapsule
        paths={{
          heading: "Once you have a number:",
          items: [
            {
              label: "How Much Does a Website Cost?",
              detail:
                "The full guide behind the number: what a site costs depending on who builds it, and what every piece of it is actually for.",
              href: "/how-much-does-a-website-cost/",
            },
            {
              label: "Web Design Packages",
              detail:
                "The same build sold as a defined scope at a defined number, written down before any money moves.",
              href: "/web-design-packages/",
            },
            {
              label: "Rates",
              detail:
                "The full economics, including how hourly works when a project is too open-ended to scope.",
              href: "/rates/",
            },
            {
              label: "Web Design",
              detail:
                "What the money buys you visually, and why none of it starts from a theme.",
              href: "/web-design/",
            },
            {
              label: "Web Development",
              detail:
                "The code underneath, which is where the expensive half of that calculator lives.",
              href: "/web-development/",
            },
          ],
        }}
      />

      <MainContactCapsule />
    </PageComposer>
  );
}
