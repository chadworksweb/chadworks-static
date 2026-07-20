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
import { PageComposer, MainContactCapsule, PathsCapsule } from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import { BASE, SMALL_BUSINESS, STORE, money, price } from "@/lib/package-builder";

const PAGE_URL = `${SITE_URL}/how-much-does-a-website-cost/`;
const TITLE = "How Much Does a Website Cost in 2026? A Real Price Breakdown | chadworks";
const DESCRIPTION =
  "A website costs from nothing to six figures, and the number comes down to who builds it. Here is the real breakdown: builder, freelancer, and agency prices; what domain, hosting, design, and maintenance each cost; and one working studio's actual figures, starting at $3,200.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
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

const MINUTELY = 5.25; // $/min. Mirrors /rates/, /faqs/ and the calculator page.

// ---------------------------------------------------------------------
// COST BY BUILD METHOD -- the first thing that moves the number.
//
// VERIFY THESE FIGURES BEFORE LAUNCH. They are other people's prices and they
// go stale. A wrong one is chadworks' credibility, not theirs.
//
// Last verified 2026-07-19 against the calculator page's INDUSTRY block (WebFX,
// Outliant, offshore re-confirmed). The DIY builder range is the soft one: the
// builders render pricing in JS, so $16 to $99 is the annual-billing ladder
// corroborated by a third party, not read off a first-party HTML page. Eyeball
// it in a browser before this page goes public.
// ---------------------------------------------------------------------
const BUILD_METHODS: { method: string; range: string; note: ReactNode; href: string }[] = [
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

// ---------------------------------------------------------------------
// COMPONENT COSTS -- what a website is actually made of.
//
// The recurring pieces, with the market range and the chadworks reality side by
// side. Domain and maintenance figures mirror the calculator page and /rates/.
// ---------------------------------------------------------------------
const COMPONENTS: { part: string; range: string; note: ReactNode }[] = [
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
        unless you put me on a WordPress care plan, currently $550 every six
        months.
      </>
    ),
  },
  {
    q: "How much does it cost to maintain a website?",
    a: (
      <>
        A static site can sit for a year and cost you nothing. A site running on
        WordPress or a similar system needs regular updates or it drifts toward
        getting hacked, which is why I offer WordPress care at $550 every six
        months. Any other change I make after launch is billed at the minutes it
        takes, {money(Math.round(MINUTELY))} a minute, on the{" "}
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
];

export default function HowMuchDoesAWebsiteCostPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* The direct answer, number-first, because the query is a question. */}
      <SectionShell className="svc-block">
        <h1 className="svc-block__heading svc-fill">
          How much does a website cost?
        </h1>
        <div className="svc-prose">
          <p>
            A website in 2026 costs anywhere from nothing to six figures, and
            that spread is the honest answer rather than a dodge. What you
            actually pay comes down to one question the guides tend to bury: who
            builds it, and how much of it belongs to you when they are done.
            Build it yourself on a template and you are paying little more than a
            monthly subscription. Hire someone to design and code a site you
            actually own and you are into the thousands, sometimes the tens of
            thousands once an agency with a sales team and an office adds its
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
          {BUILD_METHODS.map((row) => (
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
            that comes with it, is laid out on the{" "}
            <Link href="/website-design-cost-calculator/">
              calculator page
            </Link>
            .
          </p>
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
            WordPress care plan at $550 every six months, and for anything else I
            bill the minutes the work takes at {money(Math.round(MINUTELY))} a
            minute, listed in full on the <Link href="/rates/">rates page</Link>.
            There is no retainer humming in the background that you did not ask
            for.
          </p>
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
