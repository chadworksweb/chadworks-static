// Route: / -- the chadworks homepage. A single-scroll page stringing the site's
// signature moments together: the hero, the faceted-glass CW gemstone, the "at a
// glance" band arc, the ribbons + knockout problem beat with its frosted expand
// panel, the portfolio showroom, the about-Chad human block, the FAQ accordion,
// and the dark contact band.
//
// Reuses the existing capsule layer and components verbatim; GemstoneCW is the
// ported WebGL2 mark. The header is bare here (brand only, no menu, see SiteNav);
// the inner pages this links to are reached from the full footer.

import type { Metadata } from "next";
import type { ReactNode, CSSProperties } from "react";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { LaunchLink } from "@/components/LaunchLink";
import { WaveText } from "@/components/WaveText";
import { emphasize } from "@/lib/emphasize";
import { MANIFESTO } from "@/lib/manifesto";
import {
  PageComposer,
  KeyFactsCapsule,
  ProblemCapsule,
  FaqCapsule,
  MainContactCapsule,
  PortfolioShowcaseCapsule,
  TestimonialsCapsule,
  AboutChadCapsule,
  RatesCapsule,
  FitCapsule,
} from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import { LANE_COLORS } from "@/lib/capsule";
import HomeHero from "@/components/HomeHero";
import { GemstoneCW } from "@/components/GemstoneCW";
import ManifestoAmbient from "@/components/ManifestoAmbient";
import { PixelDivider } from "@/components/PixelDivider";
import {
  BrowserChip,
  CodeChip,
  ServerChip,
  TerminalChip,
} from "@/components/art/WebDevHeroArt";
import {
  PaletteChip,
  LayoutChip,
  ButtonChip,
  TypeChipDark,
  WheelChip,
} from "@/components/art/WebDesignHeroArt";
import {
  SearchChip,
  RankChip,
  ChatChipDark,
  ChartChip,
  MailChip,
  PinChipDark,
} from "@/components/art/VisibilityHeroArt";
import { GoingToBat } from "@/components/GoingToBat";
import { BASE, money } from "@/lib/package-builder";
import { HIGH, LOW } from "@/lib/pricing";

// The Websites + Visibility chip sets COMBINED into one stream (copied from the
// /websites/ and /visibility/ hero art). They share a single sticky column on
// the one-pager while both lane blocks scroll past. Scatter keeps each set's
// tuned left%/width (left% x 360 + width <= 360).
// Durations are 20% slower than the source hero sets (each x1.2) so the popup
// chips drift up more gently on the one-pager.
const ALL_CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  // Websites set
  { key: "browser", svg: <BrowserChip />, style: { left: "4%", width: "176px", animationDelay: "0s", animationDuration: "31.8s" } },
  { key: "palette", svg: <PaletteChip />, style: { left: "56%", width: "126px", animationDelay: "5s", animationDuration: "26.3s" } },
  { key: "layout", svg: <LayoutChip />, style: { left: "24%", width: "150px", animationDelay: "11s", animationDuration: "34.6s" } },
  { key: "terminal", svg: <TerminalChip />, style: { left: "68%", width: "104px", animationDelay: "2s", animationDuration: "29s" } },
  { key: "code", svg: <CodeChip />, style: { left: "14%", width: "118px", animationDelay: "8s", animationDuration: "23.5s" } },
  { key: "button", svg: <ButtonChip />, style: { left: "46%", width: "110px", animationDelay: "15s", animationDuration: "30.4s" } },
  { key: "typedark", svg: <TypeChipDark />, style: { left: "60%", width: "94px", animationDelay: "13s", animationDuration: "35.9s" } },
  { key: "wheel", svg: <WheelChip />, style: { left: "36%", width: "70px", animationDelay: "18s", animationDuration: "24.8s" } },
  { key: "server", svg: <ServerChip />, style: { left: "6%", width: "130px", animationDelay: "21s", animationDuration: "27.6s" } },
  // Visibility set
  { key: "search", svg: <SearchChip />, style: { left: "4%", width: "170px", animationDelay: "3.5s", animationDuration: "32.2s" } },
  { key: "chat", svg: <ChatChipDark />, style: { left: "52%", width: "150px", animationDelay: "9s", animationDuration: "27.7s" } },
  { key: "rank", svg: <RankChip />, style: { left: "26%", width: "128px", animationDelay: "16s", animationDuration: "34.3s" } },
  { key: "chart", svg: <ChartChip />, style: { left: "64%", width: "112px", animationDelay: "6.5s", animationDuration: "29.3s" } },
  { key: "mail", svg: <MailChip />, style: { left: "14%", width: "98px", animationDelay: "12.5s", animationDuration: "25.1s" } },
  { key: "pin", svg: <PinChipDark />, style: { left: "46%", width: "70px", animationDelay: "19.5s", animationDuration: "30.2s" } },
  { key: "chart2", svg: <ChartChip />, style: { left: "70%", width: "96px", animationDelay: "17s", animationDuration: "35.2s" } },
  { key: "rank2", svg: <RankChip />, style: { left: "8%", width: "104px", animationDelay: "24s", animationDuration: "28.6s" } },
];

// Top-level info for each sub-service under the two lanes (the one-line summaries
// from the /websites/ and /visibility/ hubs). Indented under each lane so the
// section scrolls longer and shares more detail without leaving the page.
const WEBSITE_SUBS: { title: string; href: string; body: string }[] = [
  { title: "Web Design", href: "/web-design/", body: "This is usually what clients come to me for. They want a website. They don't know or care how it gets done, they just know they can't do it themselves. This is the standard 'I need a website' service for small to medium businesses or initiatives." },
  { title: "Web Development", href: "/web-development/", body: "Some clients already have a website that needs expansion or fixing, or they have a design that needs to be brought to life. This is the 'I have a complicated idea and need help making it real' service." },
  { title: "Web Design Packages", href: "/web-design-packages/", body: "This service is for clients who want a hands-off approach to their website project. Web design packages are flat-rate bundles with minimal customization in return for lower-budget access." },
  { title: "Web Hosting", href: "/web-hosting/", body: "The host your site lives on decides whether it stays up, loads fast, and stays secure. I keep client sites on privately managed, cutting-edge servers built for uptime, so you get Fortune 500 stability without the Fortune 500 IT department. Hosting stays in your name, never locked inside my account." },
  { title: "Custom Coded / Static", href: "/custom-coded-static/", body: "This is where the fun and flexibility is. The site you are on right now is a custom-coded, static site. No limits. These sites are super fast, too. We start from scratch and build *only* what you need, no more, no less. For higher budgets and hands-on clients with a vision that templates and builders like Elementor, Wix or GoDaddy Airo can't provide." },
  { title: "WordPress", href: "/wordpress/", body: "WordPress is best for projects that require multiple contributors, like a volunteer team, or clients that want to regularly publish, edit or change features or the layout of their site on their own. WordPress is still powerful, but I may try to talk you out of it and into a custom-coded site if it sounds like WordPress will be overkill for your needs." },
  { title: "Ecommerce", href: "/ecommerce/", body: "Ecommerce is for clients selling physical or digital products directly from their website. This service is specifically for custom-built, self-hosted and managed ecommerce projects that require total control and no limits." },
  { title: "Shopify", href: "/shopify/", body: "Shopify is the world's number one DIY ecommerce platform. It's a combination of WordPress and Squarespace, best for lower-budget access." },
];

const VISIBILITY_SUBS: { title: string; href: string; body: string | ReactNode }[] = [
  {
    title: "AI Visibility",
    href: "/ai-viz/",
    body: (
      <>
        AI Visibility (aka AI Viz) is an emerging service focused on getting
        found and recommended in the age of AI search. This is similar to SEO
        in that it&apos;s not one technique, but rather a toolkit of techniques
        that are selected and applied based on your specific market situation.
        This is for businesses where being the one the AI names is worth real
        money. Check out these pages too:{" "}
        <LaunchLink href="/show-up-on-chatgpt/">Show Up on ChatGPT</LaunchLink> and{" "}
        <LaunchLink href="/advertising-on-chatgpt/">Advertising on ChatGPT</LaunchLink>.
      </>
    ),
  },
  { title: "AI Visibility Audit", href: "/ai-visibility-audit/", body: "The AI Visibility Audit is for clients with an existing website who either want to know how their website performs in the AI search arena, or are already pushing visibility initiatives but aren't getting the results they want." },
  { title: "SEO", href: "/seo/", body: "SEO *didn't* die, it became the foundation. This is the classic discipline: ranking your pages for the phrases your buyers actually type into Google. It still works on its own, and it's also what the AI assistants read before they decide who to name." },
  { title: "Digital Marketing", href: "/digital-marketing/", body: "This is mostly a catch-all term to cover a broad range of services that help your business get seen online. Essentially, everything chadworks does is digital marketing, so this page exists to capture people looking for digital marketing, then share what I offer within that arena." },
  { title: "Email Marketing", href: "/email-marketing/", body: "E-mail is still the reigning champ of all direct to consumer digital marketing channels. Once a customer gives you their email address, they've given you a direct line to their inbox, the closest thing to the real mailbox any company can get. Email marketing should be a top priority for any serious business or initiative." },
];

// ---- HOME PATHS -- the two service lanes as cards under the hero. Both jump
// to their own block inside cw-lanes-scroll, below the manifesto. The third
// card in the row is the contact CTA, written inline in the JSX. ----
const HOME_PATHS = [
  {
    label: "Websites",
    detail:
      "The one piece of your business you fully own on the internet: the look, the code, the hosting, all custom built and all in your name.",
    href: "#lane-websites",
  },
  {
    label: "Visibility",
    detail:
      "Being found and chosen: in Google, in the AI assistants people now ask instead of Google, and in the inbox.",
    href: "#lane-visibility",
  },
];

// ---- MANIFESTO ("who is chadworks for?") -- the FULL manifesto now lives on the
// About page (<ManifestoSection />, sourced from @/lib/manifesto). The homepage
// only TEASES it: the eyebrow + heading right under the gemstone, then a frosted
// "Read the manifesto" CTA into /about/.

const PAGE_URL = `${SITE_URL}/`;
const TITLE = "chadworks | so you don't have to";
const DESCRIPTION =
  "chadworks plans and builds digital destinations (cutting edge websites) and helps them show up where customers are searching (Google/ChatGPT, etc).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // Override the site-wide noindex default (see layout.tsx). The homepage is
  // the only route exposed to search during the staged relaunch.
  robots: { index: true, follow: true },
};

// ---- BANDS ("At a glance") -- judgment count, every band earns its place. ----
const FACTS: ReactNode[] = [
  "I'm your point of contact from deal to delivery. No sales rep, no account manager, no ambiguity.",
  "The site and every working file behind it become your property, in full, upon final payment.",
  <>
    Speed and visibility (SEO/GEO) are built in, not upsell add-ons. Your site
    loads fast and shows up in Google and in AI search like ChatGPT.
    <span className="cw-aster" tabIndex={0}>
      *
      <span className="cw-aster__pop" role="note">
        you&apos;ll show up when someone searches you by name. showing up for
        &quot;dog groomer&quot; or &quot;account in new york&quot; takes
        specialized work and healthy budgets.
      </span>
    </span>
  </>,
  "I bring 20+ years of web, digital and business experience across hundreds of projects spanning a wide range of industries.",
];

// ---- RIBBONS (the broad beat) -- ribbons + knockout + frosted expand panel.
// Positive, philosophical framing: why a real site matters more as AI rises. ----
const PROBLEM = {
  heading: "Your website is more important than ever.",
  subheading: "Your digital home base must be authentic and distinguishable.",
  body: "When anyone can generate a passable page in seconds, what sets you apart is a site that is unmistakably, verifiably yours.",
  more: {
    trigger: "Expand to read more",
    paragraphs: [
      <>
        <strong>Speed is mission-critical.</strong> A page that opens and loads
        lightning fast will simultaneously keep the visitor you
        worked to attract <em>and</em> please search engines and AI search bots,
        helping with ranking.
      </>,
      <>
        <strong>Visibility optimization is required.</strong> Optimizing the site
        to show up on Google and AI assistants like ChatGPT is how people find
        you online. All my projects include baseline visibility optimization.
      </>,
      <>
        <strong>Authenticity breaks the market mold.</strong> As the web fills
        with interchangeable, indistinguishable, and machine-made websites, a
        site that carries your voice and your real work is what will build trust
        with your audience/customers.
      </>,
      <>
        <strong>Quality is retained.</strong> When a website is pixel-perfect and
        details are scrutinized like a work of art, visitors feel it. They&apos;ll know you will bring the same care to the work or
        products you offer them.
      </>,
    ],
  },
};

// ---- TESTIMONIALS -- real client voice, curated for the homepage. ----
// TestimonialsCapsule ships on six service pages but had never been on the
// homepage until now (CWS-EXPANSION-PLAN-01, item A). These are the fuller,
// named-with-company quotes the signed-off pages carry, not the short
// Google-review lines the trade pages run -- same register as web-development,
// which is where all three of these already appear together.
//
// Order is deliberate: the craft and partnership quotes lead, per the plan's
// "craft leads on premium surfaces" call. Chad's ruling 2026-07-16 is that only
// PRICE quotes ("keeps costs down") are off-message here; a rank quote is fine,
// so Ananda Forest keeps his and sits third.
const TESTIMONIALS = {
  heading: "What clients say",
  items: [
    {
      quote:
        "Chad went above and beyond and exceeded our expectations with the final product.",
      attribution: "Mary Lynn Renner, AAC Event Catering (Lansdale, PA)",
      img: "/people/mary-lynn-renner.webp",
    },
    {
      quote:
        "Chad is very professional, talented and skilled. He does not try to sell you on products or services that you don't need.",
      attribution: "Kimberly Dolan, K.I.M. Keep It Moving (Philadelphia)",
      img: "/people/kimberly-dolan.webp",
    },
    {
      quote:
        "Chad is a wonder worker! My website now shows up first or second in any searches. He is an SEO magician!",
      attribution: "Ananda Forest, author",
      img: "/people/ananda-forest.webp",
    },
  ],
};

// ---- FAQ -- a focused single-band accordion. ----
const FAQS = [
  {
    q: "Who actually builds the site?",
    a: "I build the website. You need to provide relevant assets, but besides that, I handle it autonomously from start to finish.",
  },
  {
    q: "Do I own everything when it's done?",
    a: "Yes, you own everything when it's done. Sites are hosted on my private client server, but your complete codebase is always available should you desire to move on from chadworks.",
  },
  {
    q: "Will my website show up on Google and in AI answers?",
    a: (
      <>
        Yes, your website will be findable on Google and AI. The pages are
        structured and schema-rich so classic search and AI assistants can both
        read and recommend them. However, that doesn&apos;t mean you will show up
        for people that aren&apos;t already looking for you by name. Visit{" "}
        <LaunchLink href="/visibility/">Visibility</LaunchLink> for more information on that.
      </>
    ),
  },
  {
    q: "What does a website cost?",
    a: (
      <>
        A website from chadworks starts at {money(BASE)} but typically crosses
        the {LOW} mark. A web app or more involved build beyond a brochure website
        will easily break {HIGH}. Visit my{" "}
        <LaunchLink href="/rates/">rates page</LaunchLink> for more info.
      </>
    ),
  },
];

// ---- CONTACT -- the dark band, quick and detailed forms (mirrors /contact/). ----
export default function Home() {
  return (
    <PageComposer>
      {/* 1. The existing homepage hero (bare: no CTAs, divider stretched). */}
      <HomeHero bare />

      {/* 1a. The three-up lane module: the two service lanes jump down to their
          blocks below the manifesto, the third is the inverted contact CTA card
          used on the /websites/ and /visibility/ hubs, pointing at the footer
          form. Same svc-lanes chrome as those hubs. */}
      <SectionShell className="svc-block cw-home-paths">
        <div className="svc-lanes">
          {HOME_PATHS.map((p, i) => (
            <a
              key={p.href}
              href={p.href}
              className="svc-lane"
              style={{ "--lane-color": LANE_COLORS[i] } as React.CSSProperties}
            >
              <span className="svc-lane__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="svc-lane__content">
                <span className="svc-lane__title">{p.label}</span>
                <span className="svc-lane__desc">{p.detail}</span>
                <span className="svc-lane__arrow" aria-hidden="true">Explore -&gt;</span>
              </span>
            </a>
          ))}
          <a href="#contact" className="svc-lane svc-lane--cta">
            <span className="svc-lane__content">
              <span className="svc-lane__title">Not sure which fits?</span>
              <span className="svc-lane__desc">
                Cut right to it and tell me your idea. I&apos;ll tell you what
                I&apos;d do for you.
              </span>
              <span className="svc-lane__arrow" aria-hidden="true">Contact me -&gt;</span>
            </span>
          </a>
        </div>
      </SectionShell>

      {/* 2 + 2.5. The CW gemstone and the manifesto share ONE ambient field: the
          Lyric-Transformer fbm cloud (<ManifestoAmbient />) is a full-bleed layer
          that begins in the lower third of the gemstone and runs through the
          manifesto, fading in at the top and out at the bottom. It sits behind
          both (z-index 0); the gem canvas is transparent so the cloud shows
          through. The shell+full wrapper re-grids its children so the gemstone
          still breaks out to viewport width. */}
      <div className="shell full cw-mani-field">
        {/* The band "window": absolute, anchored at the gemstone's lower third,
            carrying the top/bottom fade. The cloud inside is non-fixed -- it
            scrolls with the page (no longer pinned). */}
        <div className="cw-mani-field__bg" aria-hidden="true">
          <ManifestoAmbient />
        </div>

        {/* 2. The faceted-glass CW gemstone (the 3D CW shape), full width. */}
        <GemstoneCW />

        {/* 2.5. The manifesto TEASER -- the question right under the gemstone, then
            a frosted "Read the manifesto" CTA into /about/ where the full manifesto
            now lives, over the shared LT-style cloud. */}
        <SectionShell className="cw-manifesto">
          <p className="eyebrow">{MANIFESTO.eyebrow}</p>
          <h2>{MANIFESTO.heading}</h2>
          <p className="svc-lede measure-prose">{MANIFESTO.intro}</p>
          {isLaunched("/about/") && (
            <Link className="cw-manifesto__cta" href="/about/">
              Read the manifesto
            </Link>
          )}
        </SectionShell>
      </div>

      {/* 2a. The two lanes (Websites, then Visibility) scroll past a SINGLE
          sticky column that holds both chip streams combined. */}
      <section className="section full cw-lanes-scroll">
        <div className="cw-lanes-scroll__stack">
          <div className="cw-lanes-scroll__chips" aria-hidden="true">
            {ALL_CHIPS.map((c) => (
              <div key={c.key} className="hero-chip" style={c.style}>
                {c.svg}
              </div>
            ))}
          </div>
          <div className="cw-lanes-scroll__text">
            <div className="cw-lane-block" id="lane-websites">
              <p className="eyebrow">Service Lane 01</p>
              <h2 className="svc-hero__title">
                <span className="text-gradient">Websites</span>
              </h2>
              <p className="svc-lede measure-prose">
                A website is the one piece of your business you fully own on the
                internet. I&apos;ve been building websites for over 20 years
                (since 2002!) The websites I build for my clients are bespoke. I
                no longer use templates or builders, which makes each chadworks
                project truly 100% original. Below are the specific web design
                services I offer.
              </p>
              <div className="cw-lane-subs">
                {WEBSITE_SUBS.map((s) => (
                  <div className="cw-lane-sub" key={s.title}>
                    <h3 className="cw-lane-sub__title">
                      {isLaunched(s.href) ? (
                        <Link href={s.href} className="cw-lane-sub__link">
                          <WaveText text={s.title} />
                        </Link>
                      ) : (
                        <span className="cw-lane-sub__sealed">
                          <WaveText text={s.title} />
                        </span>
                      )}
                    </h3>
                    <p className="cw-lane-sub__body">{emphasize(s.body)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="cw-lane-block cw-lane-block--alt" id="lane-visibility">
              <p className="eyebrow">Service Lane 02</p>
              <h2 className="svc-hero__title">
                <span className="text-gradient">Visibility</span>
              </h2>
              <p className="svc-lede measure-prose">
                You want your current and potential customers or audience to
                find you online. Visibility is the art and science of making
                your website or web properties discoverable online. That means
                optimizing for both Google search (SEO) and more recently, AI
                chat bots (GEO/AEO).
              </p>
              <div className="cw-lane-subs">
                {VISIBILITY_SUBS.map((s) => (
                  <div className="cw-lane-sub" key={s.title}>
                    <h3 className="cw-lane-sub__title">
                      {isLaunched(s.href) ? (
                        <Link href={s.href} className="cw-lane-sub__link">
                          <WaveText text={s.title} />
                        </Link>
                      ) : (
                        <span className="cw-lane-sub__sealed">
                          <WaveText text={s.title} />
                        </span>
                      )}
                    </h3>
                    <p className="cw-lane-sub__body">
                      {typeof s.body === "string" ? emphasize(s.body) : s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The "at a glance" bands (computed dark -> lavender arc). */}
      <KeyFactsCapsule heading={"chadworks™ AT A GLANCE"} facts={FACTS} introClassName="cw-home-glance" />

      {/* 4. The ribbons + knockout problem beat, with the frosted expand panel. */}
      <ProblemCapsule problem={PROBLEM} />

      {/* 4a. TESTIMONIALS -- real client voice, answering the problem beat above
          it. First time this capsule has run on the homepage. */}
      <TestimonialsCapsule testimonials={TESTIMONIALS} />

      {/* 5. PORTFOLIO -- the shared global PortfolioShowcaseCapsule. The curated
          selection now lives in the capsule (HELD_BACK) and is the same on every
          surface, so there is no list to pass from here. */}
      <PortfolioShowcaseCapsule revealEarly />

      {/* 5a. Pixel divider -- the page-transition wipe as a thin rule, digitized
          in on scroll. Sits between the portfolio and the about block. */}
      <PixelDivider />

      {/* 6. About Chad -- the human block, now the shared global AboutChadCapsule
          so the homepage and the service pages render the same founder section. */}
      <AboutChadCapsule />

      {/* 6a. Good fit -- who I build for and who I don't, now the shared global
          FitCapsule so the homepage and the service pages match. */}
      <FitCapsule />

      {/* 6b. Pricing -- the real, public rates, now the shared global
          RatesCapsule so the homepage and the service pages match. */}
      <RatesCapsule />

      {/* 7. FAQs -- inverted dark band (septic-page treatment). */}
      <FaqCapsule
        heading="Common questions, answered"
        faqLead="The things people ask before they reach out. If yours isn't here, the form below reaches me directly."
        faqs={FAQS}
        scheme="inverted"
        schemeAuto
        evenSplit
      />

      {/* 7a. "Going to bat" -- the thread itself moved to the essay; this links out. */}
      <GoingToBat />

      {/* 8. Contact -- the dark band with the quick/detailed form. */}
      <MainContactCapsule />
    </PageComposer>
  );
}
