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
// INDEXING IS DECIDED IN launch.ts, NOT HERE. The layout defaults to noindex and
// metadata.robots below reads isLaunched(), so adding or removing this route's
// entry in launch.ts is the whole switch. Do not restate the launched/sealed
// state in this comment: the identical line on the calculator page went stale
// the day that page launched and ended up asserting the opposite of the code.

import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import {
  PageComposer,
  MainContactCapsule,
  CalcCtaCapsule,
} from "@/components/capsules";
import { HeroCapsule } from "@/components/capsules/HeroCapsule";
import { CostHeroArt } from "@/components/art/CostHeroArt";
import { SectionShell } from "@/components/capsules/SectionShell";
import { CtaButton } from "@/components/capsules/shared";
import { BuildCards } from "@/components/BuildCards";
import { FaqAccordion, FaqParas } from "@/components/FaqAccordion";
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
  AGENCY_SMALL_BUSINESS_RANGE,
  DOMAIN_YEARLY_HIGH,
  DOMAIN_YEARLY_LOW,
  COMPONENTS,
  EXAMPLES,
  HIGH,
  LOW,
  MARKET,
  MINUTELY,
  POST_LAUNCH,
  WORDPRESS_CARE,
} from "@/lib/pricing";

const PAGE_URL = `${SITE_URL}/how-much-does-a-website-cost/`;
const TITLE = "How Much Does a Website Cost in 2026? | chadworks™";
// Chad's copy, 2026-08-13, verbatim. Plain string, not a template: the old one
// interpolated money(BASE) and this one quotes no figure, so there is nothing
// left for the hub to own here.
const DESCRIPTION =
  "What a website costs depends on what the site needs to do. This page breaks down what professional web design costs in 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // Index only when launched (layout default is noindex). Tied to launch.ts so
  // the two states move together.
  robots: { index: isLaunched("/how-much-does-a-website-cost/"), follow: true },
  openGraph: {
    title: "How Much Does a Website Cost in 2026? | chadworks",
    // The const, not a copy of it (Chad, 2026-08-13): meta, OG and Twitter now
    // read one string, so the three cannot drift apart on the next copy pass.
    description: DESCRIPTION,
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

// Market figures (by build method), the website anatomy (COMPONENTS), MINUTELY
// and WORDPRESS_CARE all come from the hub (lib/pricing) now, so a number
// changes in one place and cascades here.

// THE AFTER-LAUNCH TASK LEDGER IS GONE (Chad, 2026-08-13). It listed the per-task
// cost of ordinary post-launch jobs (text change, image swap, a new page) priced
// off MINUTELY. Its `cost()` and `costRange()` helpers went with it; nothing else
// used them. AFTER_LAUNCH still lives in the hub for any page that wants it.

// COST BY SITE TYPE -- REMOVED 2026-08-13 (Chad). The SITE_TYPES ledger read the
// same three scopes as the worked-example cards (BASE / SMALL_BUSINESS / STORE)
// and showed less of each, so it was a summary of the list sitting under it. The
// cards took its slot on the page. Its one non-duplicate row, the web
// application, survives as prose under the cards.

// ---------------------------------------------------------------------
// Inline markup for ledger notes. lib/pricing is a .ts file and cannot hold
// JSX, so a note marks up what it needs and the wrapping happens here.
//
// Two markers, deliberately the smallest set that does the job:
//   *stress*                 -> <em>
//   [label](/href)           -> <Link>
//
// One level, no nesting, no other syntax. A note containing neither marker
// renders exactly as it did before this existed. Links go through next/link
// because every href used here so far is internal; a note needing an outbound
// link would want a plain <a> and a rel, which is a reason to extend this
// rather than to smuggle a full URL through it.
function inlineMarkup(text: string) {
  return text.split(/(\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <Link key={i} href={link[2]}>
          {link[1]}
        </Link>
      );
    }
    return part;
  });
}

// WORKED EXAMPLES -- the use-case list now lives in lib/pricing (EXAMPLES), so
// the guide gallery and the shapecap harness render one source. Every figure is
// computed by price() at render, never typed, so a ladder retune rewrites them
// all in the same edit.
//
// The gallery markup and scopeTicks() moved to components/BuildCards.tsx on
// 2026-08-13, when /web-design-packages/ became the second caller. This page
// now shows the first three as a teaser and sends the reader there for the
// rest.
// ---------------------------------------------------------------------

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
    // FaqParas, not a bare fragment: an inline <>...</> evaluates to a plain
    // array, which the Answer renderer wraps in a SINGLE <p>. FaqParas is the
    // component built for a multi-paragraph answer that also carries links.
    a: (
      <FaqParas
        items={[
          <>
            More than a brochure site, because a store has machinery a brochure
            does not: a catalog that has to stay true, a payment path that has to
            work every time, and usually a system or two wired in behind it. A
            real store on my model lands near {money(price(STORE))}. Agencies
            routinely quote $20,000 and up for the same thing.
          </>,
          <>
            Keep in mind, adding commerce functionality to your site is different
            than building an ecommerce storefront. If you don&apos;t know, please{" "}
            <Link href="#contact">consult with me</Link> to determine which yours
            is.
          </>,
        ]}
      />
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
        can be close to zero: you own a domain at about {money(DOMAIN_YEARLY_LOW)} to {money(DOMAIN_YEARLY_HIGH)} a year, and a
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
          opening statement (Chad's copy, verbatim); the rest of the opener runs
          in the content section right below. */}
      {/* NO EYEBROW (Chad, 2026-08-13). HeroCapsule now drops the element
          entirely when none is passed, rather than rendering an empty <p> that
          would still hold its margin under the breadcrumb. */}
      <HeroCapsule
        className="cost-guide-hero"
        heroArt={<CostHeroArt />}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Websites", href: "/websites/" },
          { label: "How much does a website cost?" },
        ]}
        title="How much does a website cost?"
        lede="The cost of a website in 2026 can be literally zero dollars plus a Claude subscription. However, what you get for that might not be enough. This page outlines what it costs to have a website professionally designed and developed for you."
        cta={{
          href: "#who-is-building-it",
          buttonLabel: "Skip to the hard numbers",
          arrow: "down",
        }}
        ctaSecondary={{
          href: "/website-design-cost-calculator/",
          buttonLabel: "Price your project",
        }}
      />

      {/* The direct answer continues, number-first, because the query is a question. */}
      <SectionShell className="svc-block cost-guide-answer">
        {/* Copy left, portrait right. The row is a plain wrapper so .svc-prose
            keeps its own paragraph rhythm and its --lead sizing rule, both of
            which only reach DIRECT children. */}
        <div className="cost-guide-answer__row">
          <div className="svc-prose svc-prose--lead">
            {/* Chad's copy, verbatim. The floor reads through money(BASE) rather
                than a typed figure so it cannot drift from the pricing hub the
                rest of the page computes from. The two reach figures come from
                the hub for the same reason. */}
            <p>
              <strong>Here&apos;s what a website costs:</strong> When chadworks
              builds a website, it costs a minimum of {money(BASE)}{" "}
              but easily reaches past {LOW} and often past {HIGH}. The price of a
              website is also not entirely monetary. You pay with your time and
              the type of experience you want to have as a client.
            </p>
            <p>
              Cheaper rates tend to be more of a headache for you (the client)
              and might take longer or have limitations. Higher rates typically
              reflect more flexibility in the build, faster and/or smoother
              production processes and concierge-level client experiences.
            </p>
          </div>
          {/* Bottom-aligned so the cutout stands ON the CTA box. It comes AFTER
              the copy in the DOM so a screen reader and a phone both get the
              answer before the picture. */}
          <img
            className="cost-guide-portrait"
            src="/people/chad-cutout.webp"
            alt="Chad Lewine, the person behind chadworks"
            loading="lazy"
            decoding="async"
          />
        </div>
        {/* Boxed handoff to the tool, replacing the plain text link that used to
            sit here. Chad's copy. INVERTED: dark indigo card, so it does NOT
            take the shared .panel glass, which is a light surface. Its own
            row, full content width, under the opening answer. */}
        <aside className="cost-guide-cta">
          <p className="cost-guide-cta__text">
            Want to know exactly what your website will cost?
          </p>
          {/* TWO LABELS, one per size (Chad, 2026-08-13). The full sentence is
              the desktop label; a phone gets "Price your website", because at
              that width the long one wraps to three lines inside the pill and
              stops reading as a button. Both are Chad's wording, verbatim.

              Swapped with display, not with `content` or a JS width check:
              display:none takes the hidden one out of the accessibility tree
              too, so a screen reader hears exactly one label rather than both
              run together. */}
          <CtaButton
            href="/website-design-cost-calculator/"
            label={
              <>
                <span className="cost-guide-cta__label-full">
                  Try my Website Design Cost Calculator
                </span>
                <span className="cost-guide-cta__label-short">
                  Price your website
                </span>
              </>
            }
          />
        </aside>
      </SectionShell>

      {/* Cost by build method: the biggest single lever on the number. */}
      {/* The hero's "Skip to the hard numbers" jumps HERE (Chad, 2026-08-13).
          The id needs a matching scroll-margin-top rule in global.css or the
          fixed header eats the heading on arrival. */}
      <SectionShell className="svc-block" id="who-is-building-it">
        <h2 className="svc-block__heading svc-fill">
          What a website costs depends on who is building it
        </h2>
        <div className="svc-prose">
          {/* Chad's copy, 2026-08-13, verbatim. Both figures are MARKET-side
              (what others charge), not chadworks revenue, so they are typed here
              rather than read from the hub, and they ride the price-audit
              allowlist. The yearly one sits inside the builder row's monthly
              range below; the one-time one sits inside the agency row. Stating
              the amounts again HERE would add real hits to the audit's count,
              because it reads comments as well as code. */}
          <p>
            A five page website can cost $300/year or $20,000 one time plus
            hosting. It&apos;s not about the number of pages, but what goes into
            them. Here is some clarity on what the same site might cost when
            created by various types of designers/developers.
          </p>
        </div>
        <dl className="rates-ledger">
          {MARKET.map((row) => (
            <div key={row.method} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                {/* An internal href means the row is chadworks' own (the small
                    studio row points at /rates/). Send those through <Link>:
                    nofollow would throw away internal link equity, and
                    target=_blank would open the site inside itself. Outbound
                    competitor citations keep both. */}
                {row.href.startsWith("/") ? (
                  <Link href={row.href}>{row.method}</Link>
                ) : (
                  <a href={row.href} rel="nofollow noopener" target="_blank">
                    {row.method}
                  </a>
                )}
                . {inlineMarkup(row.note)}
              </dt>
              <dd className="rates-ledger__num">{row.range}</dd>
            </div>
          ))}
        </dl>
        {/* Panelled so it stops reading as a sixth ledger row (see
            .cw-market-verdict). It is chadworks answering the table, not another
            entry in it. */}
        <div className="svc-prose cw-market-verdict">
          {/* Chad's copy, 2026-08-13, verbatim. It replaced a version that
              interpolated the baseline and the small-business figure from the
              hub; this one quotes no number, so there is nothing here for the
              hub to own. The figures still appear above in the table and below
              in the worked examples. */}
          <p>
            chadworks sits between a freelancer and a small studio. Agile enough
            to give you personal, round the clock attention, and skilled enough
            to deliver agency quality work on agency sized scopes. The reason
            that is possible, and the honest tradeoff that comes with it, is
            laid out just below.
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
          {/* &trade; as the entity, not a literal glyph: CWS-VOICE rule 6 keeps
              parsed files ASCII and uses entities where a page must render a
              non-ASCII character. (The meta title is the exception, since
              metadata strings are escaped and would print the entity itself.) */}
          How does chadworks&trade; decide what a website project costs?
        </h2>
        <div className="cw-onep__layout">
          <div className="svc-prose svc-prose--lead">
            <p>
              When an agency quotes {AGENCY_SMALL_BUSINESS_RANGE} for a five page
              website, most of that number pays for the building it happened in.
            </p>
            {/* Second half of the lede, so it keeps lede size and leading
                rather than dropping to body copy. See .svc-lede-continue. */}
            <p className="svc-lede-continue">
              {/* First / Then / Then is Chad's structure (2026-08-13), and it is
                  an instructed exception to CWS-VOICE rule 2, which bans clause
                  triplets. The steps are a real sequence, not a rhetorical set.
                  Do not flatten it to two or pad it to four on a voice sweep. */}
              First, an account manager answers your email. Then, a salesperson
              booked a commission the day you signed. Then, designers and
              developers get to work while a project manager relays messages
              between them and an account manager synthesizes the status of the
              project to you. Every hour the agency bills has to pay for the
              concurrent hours of the team.
            </p>
            {/* --break is load-bearing: the base .svc-block__subheading carries a
                NEGATIVE top margin to pull itself up under an h2. This one sits
                mid-prose after the lede, so it needs a real gap instead. */}
            <h3 className="svc-block__subheading svc-block__subheading--break">
              Why my fees are lower than an agency&apos;s
            </h3>
            <p>
              {/* Three-item list, instructed by Chad 2026-08-13: he cut the
                  fourth clause and asked for the "and" moved up. Another
                  deliberate exception to CWS-VOICE rule 2, like the
                  First/Then/Then sequence above. */}
              I do not have any of that. There is no investor here waiting on a
              return, no board asking why revenue did not grow this quarter, and
              no stakeholder who has never met you holding an opinion about your
              invoice. <strong>There is only me.</strong> Therefore, the cost of
              my websites gets built out of two things: what I need to earn as one
              person to keep doing this properly, and what the finished product
              is worth to your business in the current market.
            </p>
            <h3 className="svc-block__subheading svc-block__subheading--break">
              Why my fees are higher than most freelancers
            </h3>
            {/* Chad's copy, 2026-08-13, verbatim. It replaced the
                "capability holds / 300 clients since 2011" paragraph, so this
                page no longer carries that credential; it still runs elsewhere
                on the site. */}
            <p>
              Even without the overhead agencies have, my capabilities rival
              them. This includes not only the work I produce, but the planning,
              time and project management, discernment, decision making,
              perception, communication and overall client experience.
            </p>
            <p>
              I wear many, many hats at once. You get the breadth of expertise an
              agency offers in a one-person package. You can read about why my
              rate and fees are what they are{" "}
              {/* Deep link to the rate-defense section on /rates/, which is
                  launched, so a plain <Link> is correct here rather than
                  LaunchLink. The anchor id lives on RateDefenseCapsule. */}
              <Link href="/rates/#in-defense-of-the-rate">here</Link>.
            </p>
            <p>
              {/* Chad's copy, 2026-08-13. He typed the amount; it is interpolated
                  through money(BASE) instead, so it tracks the hub and stays off
                  the price-audit allowlist. (Naming the amount in this comment
                  would itself fail the audit, which reads comments.) */}
              It costs a minimum of {money(BASE)} for chadworks to build a
              website. Below that, I would be making personal sacrifices and
              cutting corners that would lead to degradation of your client
              experience and the quality of the output. You are paying for the
              work, and in the Venn diagram of good, fast and cheap, for the
              twenty years that make the work good and fast.
            </p>
          </div>
          {/* The portrait IS the argument: the section claims one person, so it
              shows the person rather than a logo. */}
          <figure className="cw-onep__figure">
            {/* The _full cutout (660x1580), not the 167x400 one that was here.
                This figure paints up to 380px wide, so the small file was
                upscaled well past 2x on an ordinary display and further on a
                retina one. The small file is a decorative CHIP asset: it is
                sized 74-80px in AboutHeroArt, which is the only place it
                belongs. WorldviewCapsule already uses _full for this same
                portrait slot. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/cutouts/chad_cutout_home_full.webp"
              alt="Chad Lewine, the one person who designs and builds every chadworks site"
              decoding="async"
              loading="lazy"
            />
          </figure>
        </div>
      </SectionShell>

      {/* The component breakdown: a website is a few purchases, not one.
          Also the hero CTA's jump target ("Skip to the hard numbers"). */}
      <SectionShell className="svc-block" id="what-goes-into-the-cost">
        <h2 className="svc-block__heading svc-fill">
          What goes into the cost of a website?
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
              {/* The part name takes a vertical gradient fill so it separates
                  from the sentence after it without changing weight (see
                  .cw-part-label). The colon this ledger briefly used was
                  reverted to a period, so both ledgers punctuate alike again. */}
              <dt className="rates-ledger__label">
                <span className="cw-part-label">{row.part}</span>.{" "}
                {inlineMarkup(row.note)}
              </dt>
              <dd className="rates-ledger__num">{row.range}</dd>
            </div>
          ))}
        </dl>
      </SectionShell>

      {/* Worked examples: the ladder turned into real projects, each priced by
          the same model to the dollar. Dark for weight, and it sits in the
          light-light gap so the band alternation holds (rule 9). The shapes are
          transparent renders that live on this dark band.

          MOVED HERE 2026-08-13 (Chad), into the slot the "what it costs by the
          kind of site you need" ledger used to hold. That ledger read the SAME
          three scopes as the cards below it (BASE / SMALL_BUSINESS / STORE) and
          rendered them with less: no timeline, no scope ticks, no shape. It was
          a four-row summary of a three-card list directly beneath it, so it was
          cut. The shell config is identical to the one it replaced, so the
          light/dark band alternation is unchanged. Its one non-duplicate row,
          the web application, survives as the closing line below.

          THE FIRST THREE ONLY (Chad, 2026-08-13). The full gallery moved to
          /web-design-packages/; this page keeps a teaser and sends the reader
          there. The three are the floor, the everyday build and the one that
          shows the number climbing, which is the shape of the whole argument in
          three cards. A list of exactly three is a deliberate, instructed
          exception to CWS-VOICE rule 10.2 -- do not "fix" it to four on a later
          voice sweep. The slice is taken here rather than stored as its own
          list so the teaser can never drift from the gallery it teases. */}
      <SectionShell
        full
        id="worked-examples"
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        {/* Chad's wording, 2026-08-13, verbatim. It replaced "What are some
            examples of website packages?" -- the question form now matches the
            other section headings on the page, which all ask what a thing
            costs. */}
        <h2 className="svc-block__heading svc-fill">
          What do website packages cost?
        </h2>
        <div className="svc-prose">
          <p>
            Every figure here is computed at build time by the same model behind
            the{" "}
            <Link href="/website-design-cost-calculator/">
              website design cost calculator
            </Link>
            . These are prices I would quote you today.
          </p>
        </div>
        <BuildCards items={EXAMPLES.slice(0, 3)} />
        <div className="cw-builds__more">
          {/* h3 to sit level with the card titles above it, which are also h3
              under this section's h2. */}
          <h3 className="cw-builds__more-heading">
            {/* The break is authored for the two-line desktop shape. Below 480px
                the phrase no longer fits two lines at any leading, so the break
                stops balancing them and just forces a short orphan line
                ("examples of") in the middle. The class lets CSS drop it at
                that width and hand the wrapping back to the browser. */}
            Want to see more examples of <br className="cw-builds__more-break" />
            custom website packages?
          </h3>
          {/* DEFAULT solid, not ghost. Every other CTA on an inverted band uses
              the plain filled button (CtaCapsule and ActsCapsule both sit on
              dark bands and pass no variant): the lavender fill with purple text
              is what reads on navy. The ghost outline is a light-surface
              treatment and went muddy here. */}
          <CtaButton
            href="/web-design-packages/"
            label="Explore more website packages"
          />
        </div>
      </SectionShell>

      {/* Ongoing cost: the per-month / per-year question the build price hides. */}
      <SectionShell className="svc-block">
        <h2 className="svc-block__heading svc-fill">
          What does a website cost after it launches?
        </h2>
        <div className="svc-prose">
          {/* Chad's copy, 2026-08-13, verbatim. It replaced a paragraph that
              quoted the builder monthly range and the domain band; both still
              run in the anatomy ledger above, so nothing was lost. It also
              carried "a static site hosts for little or free", one of the
              free-hosting claims that contradicts the hosting floor in that
              ledger. (No figure named here: price-audit reads comments.) */}
          <p>
            A website&apos;s cost is not limited to its initial build price.
            There are ongoing and perpetual operational costs as well, costs
            that escalate with scope and the technology behind it.
          </p>
          {/* Chad's copy, 2026-08-13, verbatim. The domain band interpolates
              from the hub rather than sitting typed, so it cannot drift from the
              anatomy ledger above that quotes the same two constants. The
              builder figures stay typed, matching how that MARKET row states
              them. "Hosts for relatively little" replaces the old "little or
              free", which contradicted the hosting floor. */}
          <p>
            On DIY builder platforms, the monthly fee never stops: $16 to $99 a month (or
            more, if we&apos;re talking Shopify), every month, for as long as the
            site is up. On a custom static site the ongoing cost can be almost
            nothing, because a domain runs about {money(DOMAIN_YEARLY_LOW)} to{" "}
            {money(DOMAIN_YEARLY_HIGH)} a year and a static site hosts for
            relatively little.
          </p>
          {/* Chad's copy, 2026-08-13, verbatim, replacing the old "the variable
              is maintenance" paragraph. That one carried the WordPress care-plan
              figure, the minutely rate, a link to /rates/ and the no-retainer
              line; none survive here. The care plan is still quoted on /rates/
              and /wordpress/, and the minutely rate still runs in the ledger
              below this. */}
        </div>
        <dl className="rates-ledger">
          {POST_LAUNCH.map((row) => (
            <div key={row.part} className="rates-ledger__row">
              <dt className="rates-ledger__label">
                <span className="cw-part-label">{row.part}</span>.{" "}
                {inlineMarkup(row.note)}
              </dt>
              <dd className="rates-ledger__num">{row.range}</dd>
            </div>
          ))}
        </dl>
      </SectionShell>

      {/* The national framing: cost does not move with the zip code.
          INVERTED 2026-08-13 (Chad), same shell config as the page's other dark
          bands so the treatment is identical rather than a second way of going
          dark. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
      >
        <h2 className="svc-block__heading svc-fill">
          How much does a website cost in the USA?
        </h2>
        <div className="svc-prose">
          {/* Floated FIRST so the text flows around it. shape-outside reads the
              webp's own alpha channel, so the wrap follows the monitor's
              silhouette (including under the angled stand) rather than its
              bounding box. Same-origin, which shape-outside requires. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cost-usa__mockup"
            src="/mockups/hyperising_mockup.webp"
            alt="Hyperising, a chadworks build, shown on a desktop display"
            width="771"
            height="678"
            loading="lazy"
            decoding="async"
          />
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

      {/* The calculator hand-off, straight after the national framing (Chad,
          2026-08-13). Same capsule /rates/ and /websites/ run, so the hand-off
          looks identical wherever it appears. It quotes no figure of its own:
          every number stays in the hub and the capsule points at the tool. */}
      <CalcCtaCapsule />

      {/* The FAQ. Content-first, question-shaped, no FAQPage markup (see note). */}
      <SectionShell
        full
        className="svc-block svc-faq-section cost-guide-faq"
        trailingClassName="svc-faq-section--dark"
      >
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <h2 className="svc-block__heading svc-fill">
              Frequently asked questions about the cost of website design
            </h2>
          </div>
          {/* FaqAccordion, not a hand-rolled list (fixed 2026-08-13). This
              page was rendering the questions as bare <h3>/<p> inside
              `.cw-rate-explainer__body`, a class borrowed from the rate
              explainer, so it got none of the accordion styling and had no
              toggle at all -- every answer sat open, unstyled, on a band built
              to hold panels. Every other FAQ on the site renders through this
              component, which owns the open/closed state, the button, aria-expanded
              and the `.svc-acc` styling the dark band already themes. */}
          <FaqAccordion items={FAQS.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </SectionShell>


      <MainContactCapsule />
    </PageComposer>
  );
}
