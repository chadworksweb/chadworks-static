// Route: /how-much-does-a-website-cost/ -- the cost GUIDE.
//
// Created 2026-07-20 out of the SERP split. "how much does a website cost" and
// "website cost calculator" return two different SERPs with two different
// intents: the first is dominated by editorial guides (GoDaddy, Forbes, Wix,
// Squarespace, Leadpages), the second by interactive tools. The strongest
// competitor runs one page per intent (WebFX: /web-design/pricing/website-costs
// for the guide, /web-design/learn/website-design-cost-calculator for the tool),
// and the only real hybrid (Sayenko) is a guide that embeds a calculator, not
// a tool that absorbs a guide. So this page owns the INFORMATIONAL cluster and
// hands the tool intent to /website-design-cost-calculator/, cross-linked both
// ways.
//
// WHAT LIVES HERE. The direct "how much" answer, cost by build method
// (DIY / freelancer / agency / offshore), the component breakdown (domain,
// hosting, design + build, content, maintenance), cost by site type, the
// ongoing/per-month question, the USA framing, and the informational FAQs. All
// of that used to sit on the calculator page and was pulling it off intent.
//
// NUMBERS. Every chadworks figure is computed by the package-builder model, the
// same one behind the calculator, so the two pages cannot disagree. Competitor
// figures are sourced and carry a VERIFY comment on the data block below.
//
// NOT in launch.ts, so the layout's noindex default keeps this sealed.

import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { PageComposer, MainContactCapsule, PathsCapsule } from "@/components/capsules";
import { HeroCapsule } from "@/components/capsules/HeroCapsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import {
  BASE,
  PARAMS,
  SMALL_BUSINESS,
  STORE,
  ladderFor,
  money,
  paramValue,
  price,
  weeksLabel,
  type Scope,
} from "@/lib/package-builder";
import {
  AFTER_LAUNCH,
  AGENCY_SMALL_BUSINESS_RANGE,
  COMPONENTS,
  EXAMPLES,
  MARKET,
  MINUTELY,
  WORDPRESS_CARE,
} from "@/lib/pricing";

const PAGE_URL = `${SITE_URL}/how-much-does-a-website-cost/`;
const TITLE = "How Much Does a Website Cost in 2026? A Real Price Breakdown | chadworks";
const DESCRIPTION =
  `A website costs from nothing to six figures, and the number comes down to who builds it. Here is the real breakdown: builder, freelancer, and agency prices; what domain, hosting, design, and maintenance each cost; and one working studio's actual figures, starting at ${money(BASE)}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // Index only when launched (layout default is noindex). Tied to launch.ts so
  // the two states move together.
  robots: { index: isLaunched("/how-much-does-a-website-cost/"), follow: true },
  openGraph: {
    title: "How Much Does a Website Cost in 2026? | chadworks",
    description:
      "The real cost of a website, broken down by who builds it and what each piece costs, with one studio's published numbers instead of an industry average.",
    url: PAGE_URL,
    type: "article",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much Does a Website Cost in 2026? | chadworks",
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// --- JSON-LD: WebPage + 3-level BreadcrumbList, matching the calculator page. ---
//
// Deliberately NO FAQPage, for the same reason stated on the calculator page:
// the only controlled test (Ahrefs, 1,885 pages) measured schema doing nothing
// or slightly negative for AI citation, and Google deprecated FAQ rich results
// for non-government, non-health sites in 2023. The Q&A text is what gets
// retrieved; the markup would be decoration.
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "How Much Does a Website Cost?",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: { "@type": "Organization", name: "chadworks", url: SITE_URL },
  mainEntity: {
    "@type": "Service",
    name: "Custom website design and development",
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
      name: "How Much Does a Website Cost?",
      item: PAGE_URL,
    },
  ],
};

// Market figures (by build method), the website anatomy (COMPONENTS), the
// after-launch task ledger, MINUTELY and WORDPRESS_CARE all come from the hub
// (lib/pricing) now, so a number changes in one place and cascades here.

// The after-launch tasks price out at MINUTELY, computed rather than typed.
const cost = (mins: number) => money(Math.round(mins * MINUTELY));
const costRange = (r: { min: number; max: number }) =>
  r.min === r.max ? cost(r.min) : `${cost(r.min)} to ${cost(r.max)}`;

// ---------------------------------------------------------------------
// COST BY SITE TYPE -- four real shapes, priced by the real model.
//
// Anchored to the shared example scopes so the numbers match the calculator to
// the dollar. Four, not three, so it reads as a range rather than a set.
// ---------------------------------------------------------------------
const SITE_TYPES: { type: string; detail: string; figure: string }[] = [
  {
    type: "A landing page or one-pager",
    detail:
      "One page doing one job, built to sell a single thing or announce a single event. The smallest real project there is.",
    figure: `from ${money(BASE)}`,
  },
  {
    type: "A small business website",
    detail:
      "The everyday five page site: home, about, services, contact, and one more, with a logo already in hand and light copy help.",
    figure: money(price(SMALL_BUSINESS)),
  },
  {
    type: "An ecommerce store",
    detail:
      "Pages carrying a catalog, a payment path, subscriptions and a mailing list wired in, and enough custom logic that it stops being a brochure.",
    figure: `near ${money(price(STORE))}`,
  },
  {
    type: "A web application",
    detail:
      "A site that is really software, with user accounts and logic that has to be right every single time. This is where five figures turns into more.",
    figure: "$20,000 and up",
  },
];

// ---------------------------------------------------------------------
// WORKED EXAMPLES -- the use-case list now lives in lib/pricing (EXAMPLES), so
// the guide gallery and the shapecap harness render one source. Every figure is
// computed by price() at render, never typed, so a ladder retune rewrites them
// all in the same edit.
// ---------------------------------------------------------------------

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

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "How much does a website cost for a small business?",
    a: (
      <>
        Most small business sites land between $2,000 and $10,000 when a person
        builds them, and cheaper if you do it yourself on a builder. My own
        number for the everyday five page version, with a logo already in hand,
        is {money(price(SMALL_BUSINESS))}, and you can move the scope on my{" "}
        <Link href="/website-design-cost-calculator/">cost calculator</Link> to
        see your own.
      </>
    ),
  },
  {
    q: "How much does an ecommerce website cost?",
    a: (
      <>
        More than a brochure site, because a store has machinery a brochure does
        not: a catalog that has to stay true, a payment path that has to work
        every time, and usually a system or two wired in behind it. A real store
        on my model lands near {money(price(STORE))}. Agencies routinely quote
        $20,000 and up for the same thing.
      </>
    ),
  },
  {
    q: "Is it cheaper to build a website yourself?",
    a: (
      <>
        Up front, yes. A builder runs $16 to $99 a month and you can be live this
        weekend. The cost shows up later, when you count the yearly total, notice
        the template is doing your brand no favors, and find out that moving off
        it means starting over because you never owned the thing you built.
      </>
    ),
  },
  {
    q: "How much does a website cost per month?",
    a: (
      <>
        If you build it yourself, $16 to $99 a month covers the builder and the
        hosting together. If someone builds you a custom site, the monthly cost
        can be close to zero: you own a domain at about $12 to $20 a year, and a
        static site hosts for little or nothing. There is no monthly fee to me
        unless you put me on a WordPress care plan, currently {money(WORDPRESS_CARE)}{" "}
        every six months.
      </>
    ),
  },
  {
    q: "How much does it cost to maintain a website?",
    a: (
      <>
        A static site can sit for a year and cost you nothing. A site running on
        WordPress or a similar system needs regular updates or it drifts toward
        getting hacked, which is why I offer WordPress care at {money(WORDPRESS_CARE)}{" "}
        every six months. Any other change I make after launch is billed at the
        minutes it takes, {money(Math.round(MINUTELY))} a minute, on the{" "}
        <Link href="/rates/">rates page</Link>.
      </>
    ),
  },
  {
    q: "Why do website quotes vary so much?",
    a: (
      <>
        Because most of them are not quoting the same website. One studio is
        pricing a template with your logo dropped in, another is pricing forty
        hours of custom design, and both are saying the word &quot;website&quot;
        at you. The spread is not always dishonesty, but it always means nobody
        has agreed on scope yet. That is the entire reason my{" "}
        <Link href="/website-design-cost-calculator/">calculator</Link> makes you
        move twelve things instead of picking a tier.
      </>
    ),
  },
  {
    q: "How much should I actually pay for a website?",
    a: (
      <>
        Enough that the person building it can afford to do it properly, and not
        a dollar of somebody&apos;s quarterly growth target on top. For most
        small businesses that is a few thousand dollars for a site that is yours,
        loads fast, and does not lock you in. If you are still testing whether the
        business exists at all, pay almost nothing on a builder and come back when
        the site is costing you money by being bad.
      </>
    ),
  },
  {
    q: "How much does a website redesign cost?",
    a: (
      <>
        Usually less than the first build, because the thinking is done and the
        content mostly exists. What decides the number is whether you are
        restyling what is there or rebuilding underneath it. A fresh coat of paint
        is a small project; moving off a platform you have outgrown is close to a
        new site. The <Link href="/website-design-cost-calculator/">calculator</Link>{" "}
        prices either one the same way.
      </>
    ),
  },
  {
    q: "What is the most expensive part of a website?",
    a: (
      <>
        Almost never the design. Visual ambition on my calculator tops out at{" "}
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
        As much as you want to pay for. Editability is a real line on the{" "}
        <Link href="/website-design-cost-calculator/">calculator</Link>, because
        it is something I build into the site, and how much you get is priced by
        how much you want. Swapping text and images is close to free. Rebuilding a
        page layout on your own is {money(ladderFor("editability")?.at(-1) ?? 0)},
        because I have to build you something that cannot break when you use it.
      </>
    ),
  },
];

export default function HowMuchDoesAWebsiteCostPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* Standard hero: breadcrumb + eyebrow + gradient H1 + answer-first lede
          + CTA to the tool, matching /rates/ and /faqs/. The lede is the page's
          verbatim opening sentence; the rest of the opener runs in the content
          section right below. */}
      <HeroCapsule
        className="cost-guide-hero"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Websites", href: "/websites/" },
          { label: "How much does a website cost?" },
        ]}
        eyebrow="Real prices, not averages"
        title="How much does a website cost?"
        lede="A website in 2026 costs anywhere from nothing to six figures, and that spread is the honest answer rather than a dodge."
        cta={{ href: "/website-design-cost-calculator/", buttonLabel: "Price your project" }}
      />

      {/* The direct answer continues, number-first, because the query is a question. */}
      <SectionShell className="svc-block">
        <div className="svc-prose">
          <p>
            What you actually pay comes down to one question the guides tend to
            bury: who builds it, and how much of it belongs to you when they are
            done. Build it yourself on a template and you are paying little more
            than a monthly subscription. Hire someone to design and code a site
            you actually own and you are into the thousands, sometimes the tens
            of thousands once an agency with a sales team and an office adds its
            overhead on top. The common routes, and what each really runs, are
            broken out just below.
          </p>
          <p>
            So here is a real floor to stand on, not an average. These are my own
            published numbers, computed by the same model behind my calculator. A
            focused three page site is {money(BASE)}. A five page small business
            site with a logo already in hand is {money(price(SMALL_BUSINESS))}. A
            real store carrying a catalog and a payment path lands near{" "}
            {money(price(STORE))}. Those are prices at one working studio, and the
            rest of this page is what they are made of.
          </p>
        </div>
        <p className="svc-prose">
          <Link href="/website-design-cost-calculator/">
            Skip the reading and price your own project on the calculator.
          </Link>
        </p>
      </SectionShell>

      {/* Cost by build method: the biggest single lever on the number. */}
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading svc-fill">
          What a website costs, by who builds it
        </h2>
        <div className="svc-prose">
          <p>
            The same five page site can cost $200 a year or $20,000, and the
            thing that moves it that far is not the pages. It is who you hire.
            Read the ranges as four different answers to four different questions,
            not four prices for one thing.
          </p>
        </div>
        <dl className="rates-ledger">
          {MARKET.map((row) => (
            <div key={row.method} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                <a href={row.href} rel="nofollow noopener" target="_blank">
                  {row.method}
                </a>
                . {row.note}
              </dt>
              <dd className="rates-ledger__num">{row.range}</dd>
            </div>
          ))}
        </dl>
        <div className="svc-prose">
          <p>
            I am one person who does the whole build, so I sit where a good
            freelancer sits on price and where an agency sits on capability. My
            baseline is {money(BASE)} and a finished small business site is{" "}
            {money(price(SMALL_BUSINESS))}, under most agency starting points for
            the same work. The reason that is possible, and the honest downside
            that comes with it, is laid out just below.
          </p>
        </div>
      </SectionShell>

      {/* Where the number comes from: the agency-overhead argument, moved from
          the calculator because it is website-cost content. Dark for weight, and
          it sits between two light sections so the band rhythm holds. The
          Kimberly testimonial stayed on the calculator (it backs the no-gate
          ethos, not the cost breakdown); the portrait moves here because the
          section's whole claim is "one person". */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <h2 className="svc-block__heading svc-fill">
          Where the number actually comes from
        </h2>
        <div className="cw-onep__layout">
          <div className="svc-prose svc-prose--lead">
            <p>
              When an agency quotes {AGENCY_SMALL_BUSINESS_RANGE} for a five page
              website, most of that number pays for the building it happened in.
              An account manager answers your email, a salesperson booked a
              commission the day you signed, a project manager relays messages
              between them and the person doing the work, and everyone sits in an
              office the owners expect a margin on. The build underneath might be
              forty hours.
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
              The capability holds even as the overhead falls away. I have
              designed since I was eleven and built client websites since 2008,
              and I do both the design and the code myself, so your idea reaches
              the browser without a handoff that could dilute it. You get the full
              craft, and one person who carries the whole project start to finish.
            </p>
            <p>
              One person is one calendar. There is no bench to throw at your
              project when it doubles in size, and no second shift picking it up
              overnight. If I am booked, you wait or you go elsewhere. A project
              that genuinely needs guaranteed capacity and a backup team is a
              project for an agency, and I will say so on the call.
            </p>
            <p>
              My baseline is {money(BASE)} and it holds. Below it I would be
              cutting the parts that make a website worth building, so it stays
              where it is. You are paying for the work, and for the twenty years
              that make the work good and fast. That is the whole of the number.
            </p>
          </div>
          {/* The portrait IS the argument: the section claims one person, so it
              shows the person rather than a logo. */}
          <figure className="cw-onep__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/cutouts/chad_cutout_home.webp"
              alt="Chad Lewine, the one person who designs and builds every chadworks site"
              decoding="async"
              loading="lazy"
            />
          </figure>
        </div>
      </SectionShell>

      {/* The component breakdown: a website is a few purchases, not one. */}
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading svc-fill">
          What actually goes into the cost
        </h2>
        <div className="svc-prose">
          <p>
            A website is not one purchase. It is a few, and the pages quoting you
            one big number rarely separate them. Some of these are paid once, some
            come back every year, and one of them is the whole reason the total
            swings so wide.
          </p>
        </div>
        <dl className="rates-ledger">
          {COMPONENTS.map((row) => (
            <div key={row.part} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                {row.part}. {row.note}
              </dt>
              <dd className="rates-ledger__num">{row.range}</dd>
            </div>
          ))}
        </dl>
        <div className="svc-prose">
          <p>
            The domain and the hosting are the small, predictable costs, the ones
            that fit on a single line and stay roughly the same whether your site
            is plain or elaborate. The build is the one that moves. That is why a
            cost calculator exists at all: to price the one piece that a fixed
            range cannot. Everything else is close to a rounding error next to it.
          </p>
        </div>
      </SectionShell>

      {/* Cost by site type: named shapes, real numbers, cross-linked to the tool. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <h2 className="svc-block__heading svc-fill">
          What it costs by the kind of site you need
        </h2>
        <div className="svc-prose">
          <p>
            &quot;A website&quot; covers a one page announcement and a piece of
            custom software, and those do not cost the same. Here is where the
            common shapes land, using my own numbers where the site is one I would
            build, computed by the calculator so nothing here is guessed.
          </p>
        </div>
        <dl className="rates-ledger">
          {SITE_TYPES.map((row) => (
            <div key={row.type} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                {row.type}. {row.detail}
              </dt>
              <dd className="rates-ledger__num">{row.figure}</dd>
            </div>
          ))}
        </dl>
        <div className="svc-prose">
          <p>
            The store and the small business figures are exact, not rounded, and
            you can reproduce them by moving the scope on the{" "}
            <Link href="/website-design-cost-calculator/">
              website cost calculator
            </Link>{" "}
            until it matches your project. The web application number is the one I
            will not pin down here, because software is priced by what it has to
            do, and that is a conversation rather than a slider.
          </p>
        </div>
      </SectionShell>

      {/* Ongoing cost: the per-month / per-year question the build price hides. */}
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading svc-fill">
          What a website costs after it launches
        </h2>
        <div className="svc-prose">
          <p>
            The build price answers what a site costs to make. It says nothing
            about what it costs to keep, and that second number is the one people
            get surprised by. On a builder, the monthly fee never stops: $16 to
            $99 a month, every month, for as long as the site is up. On a custom
            site the ongoing cost can be almost nothing, because a domain runs
            about $12 to $20 a year and a static site hosts for little or free.
          </p>
          <p>
            The variable is maintenance. A plain static site can sit untouched
            and stay fine. A site on WordPress or a similar system needs regular
            care or it drifts toward getting hacked, which most people budget for
            at $50 to $200 a month with an agency. My version of that is a
            WordPress care plan at {money(WORDPRESS_CARE)} every six months, and
            for anything else I bill the minutes the work takes at{" "}
            {money(Math.round(MINUTELY))} a minute, listed in full on the{" "}
            <Link href="/rates/">rates page</Link>.
            There is no retainer humming in the background that you did not ask
            for.
          </p>
          <p>
            In practice, once a site of mine is live, the ordinary things you
            will need cost about this much, every figure the same{" "}
            {money(MINUTELY)} a minute applied to the time the job takes.
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
      </SectionShell>

      {/* Worked examples: the ladder turned into real projects, each priced by
          the same model to the dollar. Dark for weight, and it sits in the
          light-light gap so the band alternation holds (rule 9). The shapes are
          transparent renders that live on this dark band. */}
      <SectionShell
        full
        id="worked-examples"
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <h2 className="svc-block__heading svc-fill">
          Examples of What A Website Costs
        </h2>
        <div className="svc-prose">
          <p>
            Every figure here is computed at build time by the same model behind
            the{" "}
            <Link href="/website-design-cost-calculator/">
              website cost calculator
            </Link>
            . These are prices I would quote you today.
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

      {/* The national framing: cost does not move with the zip code. */}
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
            pay somebody else to rebuild in eighteen months. Both of those are the
            American website market, and neither is telling you what the work
            costs.
          </p>
          <p>
            I build remotely for clients across the country, and the number does
            not move with your zip code. The small business site above is{" "}
            {money(price(SMALL_BUSINESS))} whether you are in Ohio or Oregon,
            because it is the same work either way and I am not pricing your area
            code. The only thing your location changes is what the shops down the
            street from you have quoted, which is most of the reason this page
            publishes real figures instead of a range.
          </p>
        </div>
      </SectionShell>

      {/* The FAQ. Content-first, question-shaped, no FAQPage markup (see note). */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <h2 className="svc-block__heading svc-fill">
              The cost questions people actually ask
            </h2>
            <p className="svc-faq__lead">
              Answered the way I would answer them on the phone, with the numbers
              left in.
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
          heading: "Ready to price your own:",
          items: [
            {
              label: "Website Cost Calculator",
              detail:
                "Move the scope and watch the number move. The same model behind every figure on this page, running one real rate card with no email gate.",
              href: "/website-design-cost-calculator/",
            },
            {
              label: "Rates",
              detail:
                "The full economics, including the per-minute rate for work after launch and how hourly works when a project is too open-ended to scope.",
              href: "/rates/",
            },
            {
              label: "Web Design Packages",
              detail:
                "The build sold as a defined scope at a defined number, written down before any money moves.",
              href: "/web-design-packages/",
            },
            {
              label: "Web Development",
              detail:
                "The code underneath, which is where the expensive half of any website cost actually lives.",
              href: "/web-development/",
            },
          ],
        }}
      />

      <MainContactCapsule />
    </PageComposer>
  );
}
