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
// informational cluster (cost by build method, the component breakdown, worked
// examples, after-launch costs, the market table, the "where the number comes
// from" economics, and the USA framing) moved to /how-much-does-a-website-cost/,
// because that query returns a different SERP of editorial guides, not
// calculators (WebFX runs one page per intent). What stays here is about the
// TOOL: the live calculator, its published rate card, and the questions people
// ask about the calculator itself.
//
// ONE HUB (2026-07-20). Every figure that is not the calculator's own live
// state comes from lib/pricing (MINUTELY, the worked-example scopes, the market
// and other-calculator references). Both pages read it, so a number changes in
// one place and cascades. This page pulls CALCULATORS for the differentiator.
//
// NOT in launch.ts, so the layout's noindex default keeps this sealed.

import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { PageComposer, MainContactCapsule, PathsCapsule } from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import { ScopeCalculator } from "@/components/package-builder/ScopeCalculator";
import {
  BASE,
  BASELINE,
  PARAMS,
  PER_PAGE_LADDER_KEYS,
  UNIT_RATES,
  ladderFor,
  money,
  weeksLabel,
  type Param,
} from "@/lib/package-builder";
import { CALCULATORS } from "@/lib/pricing";

const PAGE_URL = `${SITE_URL}/website-design-cost-calculator/`;
const TITLE = "Website Design Cost Calculator: Priced to the Dollar | chadworks";
const DESCRIPTION =
  "A website design cost calculator running one studio's real rate card. Set your project scope and it prices the build to the dollar: a $3,200 baseline plus published figures for pages, custom development, branding, and a rush timeline.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // Index only when launched (layout default is noindex). Tied to launch.ts so
  // the two states move together.
  robots: { index: isLaunched("/website-design-cost-calculator/"), follow: true },
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

// After-launch costs, the competitor market, and the "where the number comes
// from" economics moved to /how-much-does-a-website-cost/ on 2026-07-20: that is
// website-cost content, not calculator content. The other-calculator references
// this page still needs (for the differentiator below) live in lib/pricing as
// CALCULATORS. The Kimberly testimonial stayed here, attached to that section.

// The calculator's own questions. Cost questions ("what is the most expensive
// part", "can I update it myself", "why do quotes vary") moved to the guide with
// the rest of the cost content; what stays is about the TOOL.
const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "What is a website cost calculator for?",
    a: (
      <>
        It turns a vague question, what will my website cost, into a real number
        you can act on. You describe the site you actually need, and it prices
        that exact scope off a published rate card instead of handing you an
        industry average or a range wide enough to hide in. The point is to let
        you find out where you stand before you spend a phone call finding out.
      </>
    ),
  },
  {
    q: "Who would use a website cost calculator?",
    a: (
      <>
        Anyone trying to budget a site before they talk to a builder. A small
        business owner sizing up a first real website, a founder checking whether
        a store is a few thousand dollars or a few tens of thousands, a marketer
        pricing a redesign for a boss who wants a number by Friday. It is for the
        moment before the conversation, when you just need to know the shape of
        the spend.
      </>
    ),
  },
  {
    q: "How did you build this calculator?",
    a: (
      <>
        It runs on a small pricing model I wrote, the same one I use to quote in
        real life: a {money(BASE)} baseline plus a published figure for each
        thing that moves the number, pages and development and branding and
        commerce and the rest. Nothing is a lookup of somebody&apos;s averages.
        Every figure on the rate card above is generated straight from that model,
        so the tool and the table can never say two different numbers.
      </>
    ),
  },
  {
    q: "Why did you build it?",
    a: (
      <>
        Because every other website cost calculator I found either hid the number
        behind a form or made one up. I already price this way in person, off a
        rate card I am happy to publish, so putting that same card behind a tool
        cost me nothing and saved you a sales call. I would rather you read the
        total, decide I am too expensive, and never email me, than gate the answer
        to farm your contact details.
      </>
    ),
  },
  {
    q: "Can you build a calculator like this for my business?",
    a: (
      <>
        Yes, and it is some of my favorite work. A pricing tool, a quote builder,
        a savings or ROI calculator, an estimator that reads your inputs and
        returns a real answer: this page is one example of the kind of custom
        interactive tool I build. If you have a number your customers keep asking
        you for, I can put it behind a tool like this one. Tell me what it should
        work out.
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

      {/* Worked examples moved to the guide on 2026-07-20 (informational
          intent). This cross-link points at them so a reader who wants real
          priced builds can jump straight there. */}
      <SectionShell className="svc-block">
        <p className="eyebrow">Worked examples</p>
        <h2 className="svc-block__heading svc-fill">
          See it priced as real projects
        </h2>
        <div className="svc-prose">
          <p>
            Real builds, from a focused baseline site up to a custom marketplace
            platform, each scoped and priced to the dollar by the same model that
            runs this calculator. They live on the{" "}
            <Link href="/how-much-does-a-website-cost/#worked-examples">
              how much a website costs
            </Link>{" "}
            guide.
          </p>
        </div>
      </SectionShell>

      {/* What makes this calculator different: the no-gate, real-rate-card
          argument, with the other calculators cited (CALCULATORS from the hub,
          the source-citation GEO lever) and the Kimberly testimonial backing the
          no-upsell ethos (Quotation Addition, the strongest measured GEO lever;
          it stayed here from the moved economics section because it is about the
          tool's honesty, not about website cost). Dark for weight; the sections
          around it are light. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <p className="eyebrow">The difference</p>
        <h2 className="svc-block__heading svc-fill">
          What makes this different from other website cost calculators
        </h2>
        <div className="svc-prose svc-prose--lead">
          <p>
            Every other website cost calculator I tried does one of two things.
            It hides the number behind a form, so you answer a page of questions
            and then wait for a salesperson to email you a range. Or it makes the
            number up, averaging industry data into a figure no actual studio
            charges for an actual website. Either way you leave without the one
            thing you came for.
          </p>
          <p>
            This one publishes a real rate card and prices your exact scope off
            it, in the open, with no email gate. Here is what the others hand you
            instead.
          </p>
        </div>
        <dl className="rates-ledger">
          {CALCULATORS.map((row) => (
            <div key={row.who} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                <a href={row.href} rel="nofollow noopener" target="_blank">
                  {row.who}
                </a>
                . {row.note}
              </dt>
              <dd className="rates-ledger__num">{row.tag}</dd>
            </div>
          ))}
        </dl>
        <div className="svc-prose svc-prose--plain">
          <p>
            Mine is the one that just shows you the card. Every figure it adds up
            is published above, computed by the same model I quote from, so you
            can check the arithmetic and walk away without ever telling me your
            name. I would rather you read the total, decide I am too expensive,
            and never email me, than gate the answer to farm your contact
            details.
          </p>
        </div>

        {/* A real client corroborating the no-upsell claim. Same markup as
            TestimonialsCapsule so it inherits the styling and the headshot. */}
        <figure className="svc-testimonial">
          <blockquote className="svc-testimonial__quote">
            Chad is very professional, talented and skilled. He does not try to
            sell you on products or services that you don&apos;t need.
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
            <p className="eyebrow">About the tool</p>
            <h2 className="svc-block__heading svc-fill">
              Questions about this calculator
            </h2>
            <p className="svc-faq__lead">
              What it is, who it is for, and how it works, answered the way I
              would answer them on the phone.
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
