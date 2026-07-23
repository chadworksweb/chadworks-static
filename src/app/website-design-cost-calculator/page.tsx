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
import ManifestoAmbient from "@/components/ManifestoAmbient";
import { LaunchLink } from "@/components/LaunchLink";
import { InlineMore } from "@/components/InlineMore";
import { ScopeCalculator } from "@/components/package-builder/ScopeCalculator";
import { PackageAssemble } from "@/components/package-builder/PackageAssemble";
import {
  BASE,
  PARAMS,
  PER_PAGE_LADDER_KEYS,
  UNIT_RATES,
  ladderFor,
  money,
  type Param,
} from "@/lib/package-builder";
import { CALCULATORS } from "@/lib/pricing";

const PAGE_URL = `${SITE_URL}/website-design-cost-calculator/`;
const TITLE = "chadworks Website Design Cost Calculator";
const DESCRIPTION =
  "Use this free website cost calculator to estimate the budget required to build your ideal website.";

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
    name: "Chad Lewine",
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

// The intro TOC and the "about the calculator" sections it links to. Chad turned
// the tool's FAQ into first-class sections (2026-07-21): the five questions people
// ask about the calculator each become a headed section, and the old "no form" and
// "accuracy" answers fold into the "why" and "difference" sections. The rate card,
// the always-included list and the worked-examples link stay as their own sections.
// The TOC links to every section, in page order. Purpose leads (it sits right
// under the hero), then the rate card and the rest.
const TOC: { href: string; label: string }[] = [
  { href: "#purpose", label: "What it's for" },
  { href: "#rate-card", label: "The numbers behind it" },
  { href: "#included", label: "What every build includes" },
  { href: "#how-built", label: "How I built it" },
  { href: "#who", label: "Who it's for" },
  { href: "#other-calculators", label: "Other calculators I can build" },
  { href: "#why", label: "Why I built it" },
  { href: "#difference", label: "What makes it different" },
];

// Chad's headings, in his order. Each body is the exact answer text from the old
// FAQ, verbatim; the "why" section carries the old "no form" answer as its second
// paragraph. The "accuracy" answer is folded into the difference section below.
const META_SECTIONS: {
  id: string;
  eyebrow: string;
  heading: string;
  body: ReactNode;
  modules?: { label: string; items: string[] }[];
  aside?: ReactNode;
  lede?: ReactNode;
  // Render the eyebrow and H2 INSIDE the body instead of full-width above it
  // (Chad, 2026-07-22). Only "who" wants this: its body is a two-column split,
  // and the heading belongs at the top of the left column with the prose it
  // introduces, not spanning both columns. The section owns the markup in that
  // case, so it can place them in the right grid cell.
  headInBody?: boolean;
}[] = [
  {
    id: "how-built",
    eyebrow: "Under the hood",
    heading: "How did you build the website cost calculator?",
    // Chad's copy, verbatim (2026-07-22). The closing line links to the VSR
    // service; /vision-strategy-roadmap/ is not launched yet, so LaunchLink
    // renders it as the sealed "coming soon" affordance and turns into a real
    // link on its own the moment that route lands in launch.ts.
    lede: (
      <>
        <p>
          I asked Claude Code to build me a calculator and with one detailed
          prompt it built this. SIKE. I spent nearly an entire week on just
          this. I had the vision in my head of visualizing something that has
          never been visualized. Mockups aren&apos;t a visualization. This is a
          true visualization of an abstract concept (scope) turned into a
          tangible, interactive tool.
        </p>
        <p>
          The reality is, that I built this with my words, explaining what I
          wanted to Claude Code and guiding the AI until it came out to my
          liking. It&apos;s a prime example of the kind of assets chadworks can
          build, seemingly out of thin air. All it takes is a clear vision.{" "}
          <LaunchLink href="/vision-strategy-roadmap/">
            Let me help you pull that vision out.
          </LaunchLink>
        </p>
      </>
    ),
    body: (
      <p>
        The pricing is wired to a master price list within the site&apos;s
        codebase. When I change a price there, it changes anywhere else that
        specific feature or packaged scope is displayed, including the
        calculator. Fancy, huh?
      </p>
    ),
  },
  {
    id: "purpose",
    eyebrow: "The purpose",
    heading: "What is the purpose of a website cost calculator?",
    aside: <PackageAssemble />,
    lede: (
      <p>
        This calculator turns a vague idea or question into a visual entity with a
        number attached. Its purpose is to make scoping your website project and
        budgeting for it easier and clearer than ever.
      </p>
    ),
    body: (
      <p>
        It was built to help clients figure out where their idea sits in their own
        realm of financial possibility. It also helps clients mix and mold their
        features to fit their budget, without having to talk to someone or without
        knowing what each and every technical aspect means and does. Its purpose is
        to translate complicated tech scopes into easy to read and understand
        packages so they feel comfortable enough and educated enough to start a
        conversation with me about their project.
      </p>
    ),
  },
  {
    id: "who",
    eyebrow: "Who it's for",
    heading: "Who would use a website cost calculator?",
    headInBody: true,
    body: (
      // Lede and list sit side by side, half the row each: the paragraph ends on
      // "for:" and the list answers it, so they belong on one line rather than
      // stacked with the answer pushed down the section. The list rides in a
      // frosted card, which has real backdrop to work with here because the
      // hero's manifesto cloud runs behind this part of the page.
      <div className="cw-split">
        {/* The two paragraphs are wrapped, not siblings of the frost card:
            .cw-split is a two-column grid, so a bare second <p> would become a
            THIRD grid item and land in the wrong column. */}
        <div className="cw-split__col">
          {/* Heading lives in the column, not above the split (headInBody). */}
          <p className="eyebrow">Who it&apos;s for</p>
          <h2 className="svc-block__heading svc-fill">
            Who would use a website cost calculator?
          </h2>
          <p>
            <strong>
              I built this website cost calculator for the client that has been
              shafted in the past.
            </strong>
          </p>
          <p>
            The web design world can be misleading and scammy. It often runs on
            the charm-offensive.
          </p>
          <p>
            I created this website calculator for clients that aren&apos;t that
            familiar with website design and development.
          </p>
        </div>
        <div className="cw-split__frost">
          {/* The line the list answers, moved out of the lede and into the card
              with it (Chad, 2026-07-22). It picks up .svc-prose h3 styling from
              the enclosing prose block. */}
          <h3>I built this website cost calculator for:</h3>
          <ul className="cw-glow-list">
            <li>
              Clients that want to build their own package and have a better idea
              of what costs are involved.
            </li>
            <li>
              Clients that aren&apos;t ready to have a direct call or face to face
              meeting, but still want to be informed.
            </li>
            <li>
              Clients that want a visualization rather than a list of features
              they have no context of.
            </li>
            <li>
              Clients that want to know what they&apos;re getting for their
              investment.
            </li>
            <li>
              Clients that want an easy way to spec and budget their website or
              web development projects.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "other-calculators",
    eyebrow: "Custom calculator builds",
    heading: "Can you build other types of calculators?",
    body: (
      <p>
        If your calculations run on numbers, I can build it. I&apos;m no
        mathematician, but I do know how to explain ideas and get them out of your
        head and into the real (digital) world. I can build calculators for all
        kinds of situations and businesses, like these.
      </p>
    ),
    modules: [
      {
        label: "Geographic",
        items: [
          "Delivery radius checkers",
          "Shipping cost calculators",
          "Service-area and travel-fee estimators",
        ],
      },
      {
        label: "Business",
        items: [
          "Instant price quotes",
          "Package and scope builders (like this one)",
          "Product configurators",
        ],
      },
      {
        label: "Financial",
        items: [
          "Savings and ROI calculators",
          "Financing and payment schedules",
          "Cost and material estimators",
        ],
      },
      {
        label: "Fun and misc",
        items: [
          "Quizzes and assessments",
          "Tests and scorecards",
          "Unit and measurement converters",
        ],
      },
    ],
  },
  {
    id: "why",
    eyebrow: "Why it exists",
    heading: "Why did you build the website cost calculator?",
    body: (
      <>
        <p>
          I built this because every website cost calculator I could find was
          boring or technical. Some were a literal web form, some a bunch of
          toggles, and one was entirely slider based. It made my eyes hurt. Few
          were treated as a product itself, and absolutely
          none had a visualization paired with the calculator. I like to build
          things <em>all the way</em>, so I built this <em>all the way</em>, as
          an example of just how far <em>all the way</em> is.
        </p>
        <p>
          I also built this to cut right to the money conversation, or avoid it
          entirely. This calculator puts the actual numbers in the
          client&apos;s head before they even contact me, saving both parties
          time.
        </p>
        <p>
          I also made it free and un-gated because I am not interested in
          farming contact info of strangers in an attempt to sell them
          something down the line. I&apos;m interested in people that want what
          they want and know when they want it, whether now or in the future.
          This calculator was designed to kick the tire kickers and attract the
          real partner clients that I want to work with.
        </p>
        <p>
          If you are that client partner,{" "}
          <Link href="/contact/">contact me here</Link>.
        </p>
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
          amt: mult === 1 ? "no change" : `+${Math.round((mult - 1) * 100)}% of the subtotal`,
          zero: mult === 1,
        };
      });
    default:
      return [];
  }
}

// PARAMS order, matching the calculator's panels top to bottom (Chad,
// 2026-07-22). This replaces the longest-first sort: a reader who just moved
// the sliders should find the tables in the order they met the controls, and
// the ragged-hole problem that sort was solving is now handled in CSS, where
// every panel is stretched to the tallest in its row.
const CARD_GROUPS: { param: Param; rows: CardRow[] }[] = PARAMS.map((param) => ({
  param,
  rows: rowsFor(param),
}));

export default function WebsiteDesignCostCalculatorPage() {
  // One template for every "about the calculator" section. Used for the purpose
  // section (hoisted up under the hero) and the rest (rendered in place below).
  const renderMetaSection = (s: (typeof META_SECTIONS)[number]) => (
    <SectionShell
      key={s.id}
      className={`svc-block${s.headInBody ? " svc-block--head-in-body" : ""}`}
      id={s.id}
    >
      {s.headInBody ? null : (
        <>
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 className="svc-block__heading svc-fill">{s.heading}</h2>
        </>
      )}
      {s.aside ? (
        <div className="cw-purpose-grid">
          <div className="cw-purpose-text">
            {s.lede ? <div className="svc-lede">{s.lede}</div> : null}
            <div className="svc-prose svc-prose--plain">{s.body}</div>
          </div>
          <div className="cw-purpose-aside">{s.aside}</div>
        </div>
      ) : (
        // A lede renders here too, not just in the aside branch. It used to be
        // reachable only when a section had an aside, so `lede` on a plain
        // section silently rendered nothing.
        <>
          {s.lede ? <div className="svc-lede">{s.lede}</div> : null}
          <div className="svc-prose">{s.body}</div>
        </>
      )}
      {s.modules && (
        <div className="cw-calc-kinds">
          {s.modules.map((cat) => (
            <div key={cat.label} className="panel cw-calc-kinds__module">
              <p className="cw-calc-kinds__cat">{cat.label}</p>
              <ul className="cw-calc-kinds__list">
                {cat.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
  const purposeSection = META_SECTIONS.find((s) => s.id === "purpose");

  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* The tool owns the fold, and the send-this-scope form sits right under
          it. Everything below that is the citation layer. */}
      <ScopeCalculator />

      {/* The hook: an answer-first, keyphrase-led intro (Yoast/GEO -- the phrase
          in sentence one, the baseline inside the first ~200 words) beside a
          static at-a-glance panel a JS-less crawler can still read. */}
      <SectionShell className="svc-block cw-calc-hero" bg={<ManifestoAmbient />}>
        <div className="cw-calc-intro">
          <div className="cw-calc-intro__lead">
            <p className="eyebrow">Easy web design budgeting</p>
            <h1 className="svc-block__heading svc-fill">
              Website Design Cost Calculator
            </h1>
            <div className="svc-prose svc-prose--lead">
              <p>
                This website design cost calculator specs/scopes and prices a
                custom website to the dollar (estimate), starting from a{" "}
                {money(BASE)}{" "}baseline. Set your preferred scope parameters
                like number of pages, visual ambition and features, and watch
                both the estimate and the scope visualizer change with each
                click.
              </p>
              <p>
                Hi, I&apos;m <Link href="/about/">Chad Lewine</Link> and I got tired
                of all the boring, or complicated, or gated, or outdated website
                cost calculators out there, so I built my own. My brand is built on
                transparency and novel design. This calculator started as a vision
                in my head and I built it from scratch. I can do the same for your
                project. <Link href="/contact/">Contact me here.</Link>
              </p>
            </div>
          </div>
          {/* Table of contents: an in-page nav to every section below, in page
              order. Replaces the old "at a glance" stat panel. */}
          <nav className="panel cw-calc-toc" aria-label="On this page">
            <p className="cw-calc-toc__title">On this page</p>
            <ol className="cw-calc-toc__list">
              {TOC.map((t) => (
                <li key={t.href}>
                  <a href={t.href}>{t.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </SectionShell>

      {/* The purpose section leads, right under the hero: the assemble object is
          the strongest visual on the page, so it opens the citation layer. */}
      {purposeSection && renderMetaSection(purposeSection)}

      {/* The rate card. THE citation layer: static HTML, generated from the
          model, readable by an engine that will never run the calculator. */}
      <SectionShell className="svc-block" id="rate-card">
        <p className="eyebrow">The Calculated Rates</p>
        <h2 className="svc-block__heading svc-fill">
          The prices behind the calculator
        </h2>
        <div className="svc-prose">
          <p>
            The baseline fee for a chadworks website is {money(BASE)}. That buys
            a small, simple, but professional website. See{" "}
            {/* Explicit {" "} on BOTH sides of the link. This <p> has
                expression children ({money(BASE)}), so the compiler drops the
                leading space of the text node after </a> and it rendered as
                "sectionfor". Same trap the Visible bullet documents below. */}
            <a href="#included">the next section</a>{" "}
            for what&apos;s included in the baseline. Every feature or level-up in the calculator adds to the
            baseline fee. See the tables below for a granular look at those
            features and levels that modify the estimate.
          </p>
        </div>
        {/* One panel per scope layer, in the calculator's own param order. */}
        <div className="cw-ratecard">
          {CARD_GROUPS.map(({ param: p, rows }) => (
            <section key={p.key} className="cw-ratecard__group">
              <div className="cw-ratecard__head">
                <h3 className="cw-ratecard__title">
                  {p.label}
                  {p.note ? <span aria-hidden="true">*</span> : null}
                </h3>
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
              {/* The asterisk's other half. Inside the panel so the caveat
                  travels with the table an engine lifts, not stranded in a
                  page-level footnote it will never quote alongside it. */}
              {p.note ? (
                <p className="cw-ratecard__note" id={`note-${p.key}`} tabIndex={-1}>
                  * {p.note}
                </p>
              ) : null}
            </section>
          ))}
        </div>

      </SectionShell>

      {/* What the baseline actually buys. Without this the BASE figure is
          unfalsifiable, and it is also where the "lower, not lesser" argument
          gets its evidence: a list an engine can lift, rather than a paragraph
          asking to be believed.

          Nothing here was invented to fill the list out; the whole list is
          Chad's copy (2026-07-22). The old privacy line is gone, replaced by
          the DATA COMPLIANT and ANALYTICS bullets, which promise specific
          artifacts (a privacy policy, a terms page, cookie controls) rather
          than a practice.

          ACCESSIBILITY is deliberately practice-stated (Chad, 2026-07-22). It
          briefly read "meets baseline ADA and ARIA requirements", which is a
          conformance claim, and it was reverted for two reasons. The ADA is a
          statute with no technical spec for private-sector websites, so the
          measurable standard is WCAG rather than the ADA itself; and ARIA is an
          authoring spec for describing custom widgets, not a bar a site can
          "meet". The wording now matches the same promise made on /faqs/ (the
          "Can people with disabilities use my site?" answer, which also feeds
          the FAQPage JSON-LD) and the one-line version on the five service
          pages. All three describe what the build does, name no standard, and
          say the same thing. If a named claim is ever wanted, the defensible
          form is WCAG 2.2 AA, and it wants an audit behind it -- automated
          tooling only catches a third or so of the criteria. Move all three
          together or they drift apart again.
          Every build has to actually ship them. */}
      {/* THE INVERTED BAND (Chad, 2026-07-22). This borrows the FAQ section's
          shape wholesale: `full` breakout, the dark plum->navy gradient with its
          lavender washes, svc-faq__layout's 2fr 3fr grid, the sticky intro
          column left and a frosted card right. It reuses those exact classes
          rather than cloning them, so a change to the FAQ band moves this one
          too. The only new CSS is what turns .cw-included from a bare list into
          the glass card the accordion is on the other bands.

          NOT the accordion itself: .svc-acc is a button/disclosure structure and
          this is a static list an engine can lift in one piece. Same surface, no
          behavior. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
        id="included"
      >
        {/* No baseline ledger line here. It was moved in from the rate card on
            2026-07-22 and back out the same day (Chad): the heading already
            names the baseline, and the section's job is what the baseline BUYS,
            not restating what it costs. The figure lives on the rate card and
            in the hero lede. */}
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <p className="eyebrow">BASELINE TECHNICAL SPECS AND FEATURES</p>
            <h2 className="svc-block__heading svc-fill">
              What&apos;s included in the website calculator&apos;s Baseline?
            </h2>
            <p className="svc-faq__lead">
              The website calculator&apos;s estimate changes a lot depending on
              the features and levels you select, but what doesn&apos;t change is
              the foundation beneath it. Here&apos;s a list of everything
              that&apos;s already included in every chadworks website:
            </p>
          </div>
          <ul className="cw-included">
          <li>
            <strong>Standard pages.</strong> Home, Services, About, Contact
            (swap any for your specific needs).
          </li>
          <li>
            <strong>Page sections.</strong> Header, hero, intro, expansion,
            CTA, footer.
          </li>
          {/* The space after the label is an explicit {" "} here, NOT the plain
              source space every other bullet uses. This <li> has expression
              children ({" "} + the LaunchLink), and in that case the compiler
              drops the leading space of the text node that follows </strong>,
              so the label ran straight into "Basic". Keep the explicit form on
              any bullet that mixes text with expressions. */}
          <li>
            <strong>Visible.</strong>{" "}
            Basic, yet comprehensive SEO and GEO (AI search visibility) is
            included in all builds. Your site will show for your business,
            project or person&apos;s name. Ranking and competing for terms
            beyond that is not guaranteed, but is available via{" "}
            {/* /visibility/ is not in launch.ts LAUNCHED, so LaunchLink renders
                this as the site's standard sealed affordance: dimmed, not
                clickable, "coming soon" on hover/focus. It becomes a real link
                the moment that route is launched, with no edit here. */}
            <LaunchLink href="/visibility/">Visibility services</LaunchLink>.
          </li>
          <li>
            <strong>Responsive.</strong> All chadworks websites and digital
            productions are mobile friendly, and where required, mobile first.
          </li>
          <li>
            <strong>Novel design.</strong> It is designed and built for your
            business alone, a layout no other company is running.
          </li>
          <li>
            <strong>Speed.</strong> All chadworks sites are tuned for maximum
            performance that the technology stack will allow.
          </li>
          <li>
            <strong>Security.</strong> All sites are either inherently secure
            with SSL and static infrastructure, or hardened with commercial
            grade tools to protect exposure like logins or databases.
          </li>
          <li>
            <strong>Data compliant.</strong> Privacy policy, terms of service
            pages and cookie controls are included in all sites. Additional
            protection is available as needed for an additional, custom scope
            and fee.
          </li>
          <li>
            <strong>Accessible.</strong>{" "}
            {/* Chad's line was "meet baseline ADA and ARIA requirements". Same
                promise, corrected on two counts (2026-07-22): the ADA is a
                statute with no technical spec for private-sector sites, so the
                standard anyone actually measures against is WCAG; and ARIA is
                an authoring spec for describing custom controls, not a bar a
                site can "meet". Naming WCAG and keeping the ADA as the reason
                it matters holds the claim up without losing the term buyers
                search for. The practices and the paid tier sit behind the
                disclosure, which ships its copy in the static HTML, so an
                engine still reads every word of it. */}
            All chadworks websites are built to WCAG, the accessibility standard
            the ADA is enforced against.{" "}
            <InlineMore trigger="Click here for more details">
              <p>
                That means every site works with a keyboard for the people who
                cannot use a mouse, labels its buttons and images so a screen
                reader can say what they are out loud, keeps enough contrast
                between text and background to stay readable, and honors the
                setting a visitor switched on to stop things from moving. ARIA
                gets used where plain HTML cannot describe a control on its own,
                and not where it can.
              </p>
              <p>
                What costs extra is the proof. Formal WCAG 2.2 AA conformance
                takes an audit and hands-on testing with the assistive tech
                itself, so it is quoted as its own scope and fee.
              </p>
            </InlineMore>
          </li>
          <li>
            <strong>Analytics.</strong> Google Analytics and PostHog are both
            available for integration into your website or project. Leveraging
            the data collected, however, is a separate service.
            </li>
          </ul>
        </div>
      </SectionShell>

      {/* The "about the calculator" cluster: Chad's questions, each its own headed
          section, in his order (2026-07-21). Bodies are the old-FAQ answers,
          verbatim. Purpose is hoisted above (under the hero); the rest render
          here. The difference section below closes the cluster. */}
      {META_SECTIONS.filter((s) => s.id !== "purpose").map(renderMetaSection)}

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
        id="difference"
      >
        <p className="eyebrow">The calculated difference</p>
        <h2 className="svc-block__heading svc-fill">
          What makes this different from other website cost calculators?
        </h2>
        <div className="svc-prose svc-prose--lead">
          <p>It visualizes the product.</p>
          <p>
            Despite their interfaces leaving much to be desired, all the other
            calculators get you some sort of number &mdash; that isn&apos;t what
            makes this different. What makes this website cost calculator different is
            its interactivity and its visual depiction of your custom scope, in
            real time.
          </p>
        </div>
        <dl className="rates-ledger">
          {CALCULATORS.map((row) => (
            <div key={row.who} className="rates-ledger__row">
              {/* The mark is painted BEHIND the label as an oversized,
                  low-alpha watermark. aria-hidden, so a screen reader and an
                  engine both get the name and note and never a stray glyph.
                  `data-mark` lets CSS size a thin glyph up to match the ink of
                  a heavy one without special-casing the markup. */}
              <dt className="rates-ledger__label">
                <a href={row.href} rel="nofollow noopener" target="_blank">
                  {row.who}
                </a>
                . <span className="rates-ledger__label-note">{row.note}</span>
              </dt>
              <dd className="rates-ledger__num">
                <span
                  className="rates-ledger__mark"
                  data-mark={row.mark}
                  aria-hidden="true"
                >
                  {row.mark}
                </span>
                <span className="rates-ledger__tag">{row.tag}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="svc-prose svc-prose--plain cw-calc-closer">
          <p>
            The chadworks website cost calculator gives you everything, for
            free, up front, in granular detail and with an easy to understand
            visualization. Every figure it adds up is published above, computed
            by the same model I quote from, so you can check the arithmetic and
            walk away without ever telling me your name. (If you find an error,
            please <Link href="/contact/">let me know</Link>.) I would rather you
            read the total, decide whether or not it&apos;s in your budget, and
            proceed accordingly. Whether that&apos;s walking away or making an
            inquiry, it&apos;s the right move.
          </p>
          <p>
            What it cannot know is that your booking system has to talk to a
            twelve year old scheduling database, and that kind of thing is
            exactly why this is an estimate generator, not a proposal generator.
            Treat the number as a real starting point for a real conversation.
            It becomes a quote once we have talked through the parts the
            calculator can&apos;t take into consideration.
          </p>
        </div>

        {/* Real clients corroborating the two claims this section makes: no
            upsell, and a finished product that lands. Both are verbatim from
            live chadworks.co and both also run on /web-design/. Markup mirrors
            TestimonialsCapsule (ul > li.svc-testimonial.panel) so it inherits
            the card, the grid and the headshot rather than restating them --
            the old single <figure> had no `panel` and no grid, which is why it
            sat on this band as bare dark-on-dark text. */}
        <ul className="svc-testimonials">
          <li className="svc-testimonial panel">
            <blockquote className="svc-testimonial__quote">
              Chad is very professional, talented and skilled. He does not try
              to sell you on products or services that you don&apos;t need.
            </blockquote>
            <div className="svc-testimonial__byline">
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
            </div>
          </li>
          <li className="svc-testimonial panel">
            <blockquote className="svc-testimonial__quote">
              Chad went above and beyond and exceeded our expectations with the
              final product.
            </blockquote>
            <div className="svc-testimonial__byline">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
              <img
                className="svc-testimonial__avatar"
                src="/people/mary-lynn-renner.webp"
                alt=""
                loading="lazy"
              />
              <p className="svc-testimonial__by">
                Mary Lynn Renner, AAC Event Catering (Lansdale, PA)
              </p>
            </div>
          </li>
        </ul>
      </SectionShell>

      {/* The /rates/ three-door exit, re-pointed: the two halves of what the
          calculator prices, then the person doing it. Every one of the three is
          launched, so none of them needs a sealed affordance. */}
      <PathsCapsule
        paths={{
          heading: "Explore chadworks™",
          items: [
            {
              label: "Web Design",
              detail: "Learn more about my website design services.",
              href: "/web-design/",
            },
            {
              label: "Web Development",
              detail: "Learn more about my web development services.",
              href: "/web-development/",
            },
            {
              label: "About",
              detail: "Learn more about the Chad behind chadworks.",
              href: "/about/",
            },
          ],
        }}
      />

      <MainContactCapsule />
    </PageComposer>
  );
}
