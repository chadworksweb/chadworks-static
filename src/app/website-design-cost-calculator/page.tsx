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
// NOT in launch.ts, so the layout's noindex default keeps this sealed.

import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { PageComposer, MainContactCapsule, PathsCapsule } from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import { PackageBuilderStage } from "@/components/package-builder/PackageBuilderStage";
import {
  BASE,
  BASELINE,
  PARAMS,
  PER_PAGE_LADDER_KEYS,
  UNIT_RATES,
  ladderFor,
  money,
  price,
  type Param,
  type Scope,
} from "@/lib/package-builder";

const PAGE_URL = `${SITE_URL}/website-design-cost-calculator/`;
const TITLE = "Website Design Cost Calculator: My Real Rates, No Email | chadworks";
const DESCRIPTION =
  "Move the scope and watch the number move. A website design cost calculator running one studio's actual rate card, not an industry average. The baseline is $3,200, every line item is published, and nothing is sent until you send it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Website Design Cost Calculator | chadworks",
    description:
      "See what a website build actually costs, before anyone asks for your email. Real rates from a working studio, published in full.",
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
// ladder rewrites these in the same edit. Four of them, and the fourth is the
// second one with rush switched on, so the multiplier reads straight off the
// pair.
// ---------------------------------------------------------------------
const SMALL_BUSINESS: Scope = {
  ...BASELINE,
  pages: 5,
  ambition: 1,
  brandingDone: 2,
  content: 1,
  editability: 1,
  motion: 1,
  geo: 1,
};

const STORE: Scope = {
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
  integrations: 2,
  geo: 2,
};

const EXAMPLES: { name: string; detail: string; scope: Scope }[] = [
  {
    name: "The baseline build",
    detail:
      "Three pages at four sections each, your brand already settled and your words already written. Focused, correct, and it does one job well.",
    scope: BASELINE,
  },
  {
    name: "A small business site",
    detail:
      "Five pages, a logo in hand but no system around it, light copy cleanup, a bit of motion, and the basics of being readable by the machines.",
    scope: SMALL_BUSINESS,
  },
  {
    name: "A real store",
    detail:
      "Eight pages carrying a catalog, a payment path, a couple of systems wired in, and enough custom logic that it stops being a brochure.",
    scope: STORE,
  },
  {
    name: "That same small business site, rushed",
    detail:
      "Identical scope to the second one with the timeline squeezed. Rush multiplies the whole build, because moving your project to the front of the line moves everything else back.",
    scope: { ...SMALL_BUSINESS, timeline: 2 },
  },
];

// What the rest of the industry quotes. Sourced, linked, and set against the
// numbers above, because citing sources is the strongest GEO lever available
// to a page that does not already rank (Princeton GEO, KDD 2024: rank-5 pages
// gained +115% visibility from citing sources, while rank-1 pages LOST 30%
// from the same move).
//
// VERIFY THESE FIGURES AGAIN BEFORE LAUNCH. They are other people's prices and
// they go stale, and a wrong one is chadworks' credibility, not theirs.
const INDUSTRY: { who: string; range: string; note: string; href: string }[] = [
  {
    who: "WebFX, small business site",
    range: "$6,500 to $15,000",
    note: "An agency whose baseline sits above most of my finished builds.",
    href: "https://www.webfx.com/web-design/pricing/website-costs/",
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
    who: "Squarespace and the builders, do it yourself",
    range: "$17 to $99 a month",
    note: "Cheap until you count the year, notice the template everyone else is also using, and realize you never own it.",
    href: "https://www.squarespace.com/blog/how-much-does-a-website-cost",
  },
];

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "How much does a website cost in 2026?",
    a: (
      <>
        Somewhere between free and six figures, which is why that question has
        never once been answered honestly by a page trying to rank for it. Here
        is my version. My baseline is {money(BASE)}, a five page small business
        site with a logo already in hand runs {money(price(SMALL_BUSINESS))},
        and a store carrying a catalog with a couple of systems wired in lands
        near {money(price(STORE))}. Those are my prices at my studio, not an
        average of everyone&apos;s.
      </>
    ),
  },
  {
    q: "Why do website design quotes vary so much?",
    a: (
      <>
        Because most of them are not quoting the same website. One studio is
        pricing a template with your logo dropped into it, another is pricing
        forty hours of custom design, and both are saying the word
        &quot;website&quot; at you. The spread is not dishonesty in every case,
        but it is always a sign that nobody has agreed on scope yet. That is the
        entire reason this calculator makes you move thirteen things instead of
        picking a tier.
      </>
    ),
  },
  {
    q: "Is there a monthly fee to have a website?",
    a: (
      <>
        Not to me. No retainer, no recurring charge you did not ask for. You
        will pay for a domain, roughly $12 to $20 a year, and for hosting, and
        on the static builds I usually put people on, hosting is often free or
        close to it. If you want me on call afterwards, that is billed when you
        use it at the rate on the <Link href="/rates/">rates page</Link>, never
        as a subscription humming in the background.
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
        is exactly where estimates die. Treat the number as the real starting
        point of a real conversation, not as a quote I have signed.
      </>
    ),
  },
  {
    q: "Can I create a website for free?",
    a: (
      <>
        Yes, and sometimes you should. If you are still testing whether the
        business exists at all, go put something up on a free builder this
        weekend and find out. Come back when the site is costing you money by
        being bad. I would rather say that here than take {money(BASE)} from
        someone who needed a landing page and a phone number.
      </>
    ),
  },
  {
    q: "What is the most expensive part of a website?",
    a: (
      <>
        Almost never the design. Look at the table: visual ambition tops out at{" "}
        {money(ladderFor("ambition")?.at(-1) ?? 0)}, while custom development
        tops out at {money(ladderFor("mathDev")?.at(-1) ?? 0)} and selling tops
        out at {money(ladderFor("commerce")?.at(-1) ?? 0)}. What costs money is
        machinery: logic that has to be right every single time, a catalog that
        has to stay true, systems that have to keep talking to each other long
        after I am gone.
      </>
    ),
  },
  {
    q: "Can I update the site myself after launch?",
    a: (
      <>
        As much as you want to pay to be able to. That is a real line on the
        calculator rather than a yes or a no, because editability gets built, it
        does not get granted. Letting you swap text and images is close to free.
        Letting you rebuild a page layout without calling me is{" "}
        {money(ladderFor("editability")?.at(-1) ?? 0)}, because then I have to
        build you something that cannot break when you use it.
      </>
    ),
  },
  {
    q: "Why is there no form on this page?",
    a: (
      <>
        Because every other calculator I tested makes you hand over your email
        to see your own number, and then a salesperson calls you. Your budget is
        not a lead magnet. I would rather you got the number, decided I am too
        expensive, and never emailed me at all. That outcome costs me nothing
        and saves us both a call.
      </>
    ),
  },
];

// ---------------------------------------------------------------------
// THE RATE CARD ROWS.
//
// One panel per scope layer, so the published card has the same 13 groups the
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
      {/* The tool owns the fold. Everything below it is the citation layer. */}
      <PackageBuilderStage />

      {/* The hook: what this is, and why it is not like the others. */}
      <SectionShell className="svc-block">
        <h1 className="svc-block__heading svc-fill">
          Website Design Cost Calculator
        </h1>
        <div className="svc-prose">
          <p>
            Every other website cost calculator I tried wanted my email before
            it would show me my own number, or it quoted an &quot;industry
            average&quot; that no working studio actually charges. This one does
            neither. Move the scope above, watch the number move, then close the
            tab. Nothing is sent until you send it.
          </p>
          <p>
            The number it gives you is not a range and not a posture. It is my
            rate card doing arithmetic in front of you. I am Chad, I have been
            building websites for twenty years, and the whole ladder is printed
            below so you can check my math or price your project without ever
            talking to me. That is the point of it.
          </p>
        </div>
      </SectionShell>

      {/* The rate card. THE citation layer: static HTML, generated from the
          model, readable by an engine that will never run the calculator. */}
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading svc-fill">
          What a website costs here, line by line
        </h2>
        <div className="svc-prose">
          <p>
            The baseline is {money(BASE)}. That buys {UNIT_RATES.pagesIncluded}{" "}
            pages at {UNIT_RATES.sectionsIncluded} sections each, custom
            designed and custom built, assuming your brand is settled and your
            words are written. Everything below is what moves that number, and
            these are the actual figures the calculator adds up.
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

        <div className="svc-prose">
          <p>
            Rush is a percentage of the whole build rather than a line item,
            because urgency taxes every hour of a project and not one task
            inside it. Branding runs backwards on purpose: the more you already
            have in hand the less I have to build, so a full system in hand
            costs nothing and starting from nothing costs{" "}
            {money(ladderFor("brandingDone")?.[0] ?? 0)}.
          </p>
        </div>
      </SectionShell>

      {/* Worked examples: the ladder turned into four real projects. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <h2 className="svc-block__heading svc-fill">
          Four scopes, four real numbers
        </h2>
        <div className="svc-prose">
          <p>
            Every figure here is calculated by the same model running the tool
            above. None of it is typed in by hand, so none of it can drift from
            what I would actually charge you.
          </p>
        </div>
        <dl className="rates-ledger">
          {EXAMPLES.map((ex) => (
            <div key={ex.name} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                {ex.name}. {ex.detail}
              </dt>
              <dd className="rates-ledger__num">{money(price(ex.scope))}</dd>
            </div>
          ))}
        </dl>
      </SectionShell>

      {/* Cite sources: the strongest lever a page like this has. */}
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading svc-fill">
          What everybody else quotes for the same website
        </h2>
        <div className="svc-prose">
          <p>
            I am not going to pretend my number is the only honest one on the
            internet, so here is what the pages you probably just came from are
            asking. Read the spreads rather than the figures. When a page quotes
            a five times range for a six page brochure site, that range is not a
            price, it is a way of not answering you until you are on a call.
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
        <div className="svc-prose">
          <p>
            My baseline of {money(BASE)} sits under most of that, and a finished
            small business site at {money(price(SMALL_BUSINESS))} lands below
            WebFX&apos;s starting point for the same thing. That gap is not a
            discount and it is not a lesser website. It is arithmetic, and it is
            worth explaining properly.
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
        <h2 className="svc-block__heading svc-fill">
          Why one person&apos;s baseline is lower than an agency&apos;s
        </h2>
        <div className="cw-onep__layout">
        <div className="svc-prose">
          <p>
            When an agency quotes {INDUSTRY[0].range} for a five page website,
            most of that number is not the website. It is the
            account manager who answers your email, the salesperson who earned a
            commission the day you signed, the project manager translating
            between them and the person actually doing the work, the office all
            of them sit in, and the margin the owners expect on top of the whole
            arrangement. The build underneath might be forty hours. You are
            paying for the building it happened in.
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
            The part that surprises people is that the capability does not scale
            down with the overhead. I have been designing since I was eleven and
            custom building client websites since 2008. I design it and I write
            the code myself, so there is no handoff where your idea gets quietly
            simplified by somebody who was not in the room when you explained
            it. An agency splits that same work across four people and then
            bills you for the coordination between them. You are not buying less
            here. You are buying the same craft without the org chart attached
            to it.
          </p>
          <p>
            Here is the other side of it, because you should hear it from me
            before you email me. One person is one calendar, so there is no
            bench to throw at your project when it doubles in size and no team
            in another timezone picking up where I left off at night. If I am
            booked, I am booked, and you either wait or you go elsewhere. An
            agency is selling you capacity and redundancy as much as craft, and
            there are real projects where that is genuinely the right thing to
            buy. If yours is one of them, I will tell you that instead of taking
            the work.
          </p>
          <p>
            None of this makes me cheap. My baseline is {money(BASE)} and it does
            not move, because underneath it I would be cutting the things that
            make a website worth building at all, and I would rather lose the
            job than hand you that. What it makes me is honest about what the
            number is made of. You are paying for the work, and for the twenty
            years that make the work good and fast. You are not paying for
            anybody&apos;s quarterly target.
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

      {/* The national version of the cost question. Was a Pennsylvania block;
          Chad's targets are national, so it answers for the whole US and the
          number deliberately does not move with the buyer's zip code. */}
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading svc-fill">
          How much does a website cost in the USA?
        </h2>
        <div className="svc-prose">
          <p>
            Anywhere from a free weekend on a builder to six figures, and the
            spread usually has more to do with who you called than with what you
            asked for. A Manhattan or San Francisco shop will price a five page
            site at a number that would cover a small company&apos;s whole year.
            An overseas shop will quote you $500 for something you will quietly
            pay somebody else to rebuild in eighteen months. Both of those are
            the American website market, and neither of them is telling you what
            the work costs.
          </p>
          <p>
            I build remotely for clients across the country, and the number does
            not move with your zip code. The small business site on this
            calculator is {money(price(SMALL_BUSINESS))} whether you are in Ohio
            or Oregon, because it is the same work either way and I am not
            pricing your area code. The only thing your location changes is what
            you have been quoted by the shops down the street from you, which is
            most of the reason this page publishes real figures instead of a
            range.
          </p>
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
              <div key={f.q} className="svc-prose">
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
