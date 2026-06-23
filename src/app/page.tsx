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
import { WaveText } from "@/components/WaveText";
import { SpeedDemon } from "@/components/SpeedDemon";
import { emphasize } from "@/lib/emphasize";
import { MANIFESTO } from "@/lib/manifesto";
import {
  PageComposer,
  KeyFactsCapsule,
  ProblemCapsule,
  MadeByCapsule,
  QualificationCapsule,
  FaqCapsule,
  ContactCapsule,
} from "@/components/capsules";
import { SectionShell } from "@/components/capsules/SectionShell";
import HomeHero from "@/components/HomeHero";
import { GemstoneCW } from "@/components/GemstoneCW";
import ManifestoAmbient from "@/components/ManifestoAmbient";
import { PixelDivider } from "@/components/PixelDivider";
import { GemstoneMark } from "@/components/GemstoneMark";
import { GlobalMotionToggle } from "@/components/GlobalMotionToggle";
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
import { SepticVoicebox } from "@/components/septic/SepticVoicebox";
import { FeaturedShowcase } from "@/components/portfolio/FeaturedShowcase";
import { ArchiveGrid, type ArchiveItem } from "@/components/portfolio/ArchiveGrid";
import type { LeadFormConfig } from "@/lib/forms";

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
        <Link href="/show-up-on-chatgpt/">Show Up on ChatGPT</Link> and{" "}
        <Link href="/advertising-on-chatgpt/">Advertising on ChatGPT</Link>.
      </>
    ),
  },
  { title: "AI Visibility Audit", href: "/ai-visibility-audit/", body: "The AI Visibility Audit is for clients with an existing website who either want to know how their website performs in the AI search arena, or are already pushing visibility initiatives but aren't getting the results they want." },
  { title: "SEO", href: "/seo/", body: "SEO *didn't* die, it became the foundation. This is the classic discipline: ranking your pages for the phrases your buyers actually type into Google. It still works on its own, and it's also what the AI assistants read before they decide who to name." },
  { title: "Digital Marketing", href: "/digital-marketing/", body: "This is mostly a catch-all term to cover a broad range of services that help your business get seen online. Essentially, everything chadworks does is digital marketing, so this page exists to capture people looking for digital marketing, then share what I offer within that arena." },
  { title: "Email Marketing", href: "/email-marketing/", body: "E-mail is still the reigning champ of all direct to consumer digital marketing channels. Once a customer gives you their email address, they've given you a direct line to their inbox, the closest thing to the real mailbox any company can get. Email marketing should be a top priority for any serious business or initiative." },
];

// ---- MANIFESTO ("who is chadworks for?") -- the FULL manifesto now lives on the
// About page (<ManifestoSection />, sourced from @/lib/manifesto). The homepage
// only TEASES it: the eyebrow + heading right under the gemstone, then a frosted
// "Read the manifesto" CTA into /about/.

const PAGE_URL = `${SITE_URL}/`;
const EMAIL = "chad@chadworks.co";
const TITLE = "chadworks | Websites and visibility, built by one person";
const DESCRIPTION =
  "Websites and visibility, designed and developed by one person, and owned outright by the business it serves.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
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
  body: "When anyone can generate a passable page in seconds, the thing that sets you apart is a site that is unmistakably, verifiably yours.",
  more: {
    trigger: "Expand to read more",
    paragraphs: [
      <>
        <strong>Speed is mission-critical.</strong> A page that opens at once
        keeps the visitor you worked to attract, and search engines reward the
        very same thing, so a fast site pays you back twice over.
      </>,
      <>
        <strong>Visibility optimization (SEO/GEO) is required.</strong> Showing up
        in Google and in the AI assistants people now ask is structural work, set
        into the build, so your business is the answer when someone goes looking.
      </>,
      <>
        <strong>Authenticity breaks the market mold.</strong> As the
        web fills with interchangeable, machine-made pages, a site that carries
        your real voice and your real work reads as human, and that is exactly
        what earns trust now.
      </>,
      <>
        <strong>Quality is retained.</strong> When the type
        is considered and the details are clearly built on purpose, a visitor
        reads that as a promise: you bring the same care to the work you would do
        for them.
      </>,
    ],
  },
};

// ---- PORTFOLIO -- the flagship piece + a trimmed archive (real client sites). ----
const FEATURED = {
  slug: "risingcompass",
  alt: "Rising Compass website, designed and developed by chadworks",
  url: "risingcompass.net",
  label: "Rising Compass",
  href: "https://risingcompass.net",
};

const ARCHIVE: ArchiveItem[] = [
  {
    key: "aac",
    slug: "aac",
    alt: "AAC Event Catering website, designed and developed by chadworks",
    url: "aaceventcatering.com",
    label: "AAC Event Catering",
    href: "https://aaceventcatering.com",
    blurb:
      "A catering brand that needed to look as polished as the events it runs. Booking-ready, and built to win the search.",
  },
  {
    key: "edenscapes",
    slug: "edenscapes",
    alt: "EdenScapes Japanese garden design website, designed and developed by chadworks",
    url: "eden-scapes.com",
    label: "EdenScapes",
    href: "https://eden-scapes.com/japanese-garden-design-installation/",
    blurb:
      "Japanese garden design deserves a quiet, deliberate site. I gave the craft room to breathe and the work room to sell itself.",
  },
  {
    key: "massagepros",
    slug: "massagepros",
    alt: "Massage Professionals website, designed and developed by chadworks",
    url: "massageprofessionalsllc.com",
    label: "Massage Professionals",
    href: "https://massageprofessionalsllc.com",
    blurb:
      "A calm, trustworthy front door for a local practice, with the booking path one tap away on a phone.",
  },
  {
    key: "rozariolaw",
    slug: "rozariolaw",
    alt: "Rozario Law website, designed and developed by chadworks",
    url: "rozariolaw.com",
    label: "Rozario Law",
    href: "https://rozariolaw.com",
    blurb:
      "A law practice has seconds to earn trust. This one opens steady and serious, and tells a visitor exactly what to do next.",
  },
  {
    key: "thorobird",
    slug: "thorobird",
    alt: "Thorobird website, designed and developed by chadworks",
    url: "thorobird.com",
    label: "Thorobird",
    href: "https://thorobird.com",
    blurb:
      "A brand site with a distinct point of view, custom built so it carries the personality the business actually has.",
  },
  {
    key: "chadlewine",
    slug: "chadlewine",
    alt: "Chad Lewine website, designed and developed by chadworks",
    url: "chadlewine.com",
    label: "Chad Lewine",
    href: "https://chadlewine.com",
    blurb:
      "My musician-first site, where I push the interaction further than a client brief usually allows. Proof of where the work can go.",
  },
];

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
        <Link href="/visibility/">Visibility</Link> for more information on that.
      </>
    ),
  },
  {
    q: "What does a website cost?",
    a: (
      <>
        A website from chadworks starts at $3,200 but typically crosses the
        $5,000 mark. A web app or more involved build beyond a brochure website
        will easily break $10,000. Visit my{" "}
        <Link href="/rates/">rates page</Link> for more info.
      </>
    ),
  },
];

// ---- CONTACT -- the dark band, quick and detailed forms (mirrors /contact/). ----
const QUICK: LeadFormConfig = {
  source: "one-pager (quick)",
  subject: "New Quick Contact from the One Pager (chadworks)",
  submitLabel: "Send message to Chad",
  successMessage:
    "Got it. This lands straight in my inbox and I read every one myself. You'll hear back within a day.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    {
      kind: "textarea",
      name: "message",
      label: "What's going on?",
      required: true,
      rows: 4,
      placeholder: "The business, and where it's stuck right now.",
    },
  ],
};

const DETAILED: LeadFormConfig = {
  source: "one-pager (detailed)",
  subject: "New Detailed Inquiry from the One Pager (chadworks)",
  submitLabel: "Send message to Chad",
  successMessage:
    "Got it, and thanks for the detail. I read every inquiry myself, and you'll hear back within a day with a straight answer on the number.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    { kind: "text", name: "business", label: "Business Name", span: "half" },
    {
      kind: "textarea",
      name: "details",
      label: "What are you building?",
      required: true,
      rows: 5,
      placeholder: "What the site needs to do, and where it's stuck today.",
    },
    { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
  ],
};

export default function Home() {
  return (
    <PageComposer>
      {/* The single, always-sticky motion toggle (top-right). Owns all motion. */}
      <GlobalMotionToggle />

      {/* 1. The existing homepage hero (bare: no CTAs, divider stretched). */}
      <HomeHero bare />

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
          <Link className="cw-manifesto__cta" href="/about/">
            Read the manifesto
          </Link>
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
            <div className="cw-lane-block">
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
                      <Link href={s.href} className="cw-lane-sub__link">
                        <WaveText text={s.title} />
                      </Link>
                    </h3>
                    <p className="cw-lane-sub__body">{emphasize(s.body)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="cw-lane-block cw-lane-block--alt">
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
                      <Link href={s.href} className="cw-lane-sub__link">
                        <WaveText text={s.title} />
                      </Link>
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
      <KeyFactsCapsule heading={"chadworks™ AT A GLANCE"} facts={FACTS} />

      {/* 4. The ribbons + knockout problem beat, with the frosted expand panel. */}
      <ProblemCapsule problem={PROBLEM} />

      {/* 5. PORTFOLIO -- a centered titlebar: the section name flanked by two
          mini, counter-rotating CW gemstones (the same cut crystal as the hero
          mark, at badge scale). Then the flagship piece and the archive grid. */}
      <SectionShell className="cw-port-titlebar">
        <div className="cw-port-titlebar__row">
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
          <h2 className="cw-port-titlebar__title">chadworks&trade; Portfolio</h2>
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
        </div>
      </SectionShell>

      {/* 5a. The flagship piece, then the archive grid. */}
      <SectionShell className="cw-port-feat-shell">
        <FeaturedShowcase
          primary={FEATURED}
          eyebrow="Featured build"
          heading="Rising Compass"
          headingAs="h3"
          ctaUnderLede
          lede="The Rising Compass is a ground-up, custom web app that tracks and measures the messages contained in the lyrics of the world's most popular songs. I built and manage this 100%, top to bottom."
        />
      </SectionShell>
      <SectionShell className="cw-port-archive-shell">
        <h2 className="cw-port-archive__heading">More sites I&apos;ve custom built</h2>
        <p className="svc-lede measure-prose">
          A wider sample of client work. Switch any card between desktop, tablet,
          and mobile, or open it live. Each was designed and developed by one
          person, start to finish.
        </p>
        <ArchiveGrid items={ARCHIVE} />
        <div className="cw-port-archive__cta-row">
          <Link href="/portfolio/" className="svc-btn">
            <span className="svc-btn__label">View full portfolio</span>
            <svg className="svc-btn__arrow" viewBox="0 0 448 512" aria-hidden="true" focusable="false">
              <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
            </svg>
          </Link>
        </div>
      </SectionShell>

      {/* 5b. Pixel divider -- the page-transition wipe as a thin rule, digitized
          in on scroll. Sits between the portfolio and the about block. */}
      <PixelDivider />

      {/* 6. About Chad -- the human block. */}
      <MadeByCapsule
        variant="split"
        made={{
          heading: (
            <>
              the <em>Chad</em> behind chadworks
            </>
          ),
          img: "/people/chad-cutout.webp",
          imgAlt: "Chad Lewine, the person behind chadworks",
          captionMain: "Yes, this is the whole company.",
          captionSub: "(That's the point.)",
          manifesto: [
            { lead: "Clear communication.", aside: "(no fluff, no fuss)" },
            { lead: "Transparent fees and terms.", aside: "(always)" },
            { lead: "Based in Philadelphia.", aside: "(U.S. made)" },
            {
              lead: "Blazing fast turnaround.",
              aside: (
                <>
                  (<SpeedDemon href="https://www.youtube.com/watch?v=l039y9FaIjc">speed demon</SpeedDemon>)
                </>
              ),
            },
          ],
          negation: [
            "No subcontractors.",
            "No offshore handoffs.",
            "No invented case studies.",
            "No pretending I'm an agency or that the web is a perfect system.",
          ],
          close: "Trends come and go and the web changes. My values don't.",
          sig: "Chad Lewine",
        }}
      />

      {/* 6a. Good fit -- who I build for and who I don't, so the wrong-fit
          noise filters itself out before anyone reaches out. */}
      <QualificationCapsule
        qualification={{
          heading: "Who I Work With",
          fitLabel: "chadworks is for you if:",
          notLabel: "Probably not if:",
          fit: [
            "You want what you want, and you'd rather pay to have it built right than negotiate it down to almost right.",
            "You see your project as an integral part of your initiative, not just the brochure for it.",
            "You're building something you intend to keep for a long time.",
          ],
          notFit: [
            "You're on a strict, low budget. In the Venn diagram of good, fast, and cheap, I'm fast and good.",
            "You want a template with your logo dropped in. Plenty of builders do that, but I'm not one of them.",
            "You're building this as a hobby, not a business, product or organization.",
          ],
        }}
      />

      {/* 6b. Pricing -- the real, public rates. Hourly + flat on top, audit +
          monthly below (2x2). Numbers from the rates page; shown in full. */}
      <SectionShell full className="cw-pricing">
        <div className="cw-pricing__head">
          <p className="eyebrow">What it costs</p>
          <h2 className="cw-pricing__heading">Transparent rates.</h2>
        </div>
        <div className="cw-pricing__grid">
          <div className="cw-price-card panel">
            <p className="cw-price-card__label">Hourly</p>
            <p className="cw-price-card__figure">$315<span className="cw-price-card__unit"> / hour</span></p>
            <p className="cw-price-card__note">
              I bill increments of 10 minutes. No &quot;1 hour minimum&quot;
              invoices.
            </p>
          </div>
          <div className="cw-price-card panel">
            <p className="cw-price-card__label">Flat-rate builds</p>
            <p className="cw-price-card__figure">From $3,200</p>
            <p className="cw-price-card__note">
              Most sites land around the $5,000 mark. That represents a full,
              custom build that you own outright.
            </p>
          </div>
        </div>
        <p className="cw-pricing__disclaimer">
          Flat rates shown are general estimates
          for information only, not a formal quote or binding offer. Your actual
          price is set in a written proposal before any work begins.
        </p>
        <div className="cw-pricing__cta">
          <Link href="/rates/" className="svc-btn cw-pricing__cta-btn">
            <span className="svc-btn__label">View rate details</span>
            <svg className="svc-btn__arrow" viewBox="0 0 448 512" aria-hidden="true" focusable="false">
              <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
            </svg>
          </Link>
        </div>
      </SectionShell>

      {/* 7. FAQs -- inverted dark band (septic-page treatment). */}
      <FaqCapsule
        heading="Common questions, answered"
        faqLead="The things people ask before they reach out. If yours isn't here, the form below reaches me directly."
        faqs={FAQS}
        scheme="inverted"
        schemeAuto
        evenSplit
      />

      {/* 7a. "Going to bat" -- the real anti-agency email thread (septic page). */}
      <SectionShell reveal={false} className="cw-art-voice-section">
        <SepticVoicebox />
      </SectionShell>

      {/* 8. Contact -- the dark band with the quick/detailed form. */}
      <ContactCapsule
        scheme="inverted"
        heading="Tell me about your project."
        intro="Send me a message about your business, project or initiative. No ideas are dumb, no questions stupid. Tell me your vision, big or small."
        emailLabel="Email directly"
        email={EMAIL}
        phoneLabel="Call directly"
        phone="(215) 872-1240"
        locationNote="Based in Pennsylvania, working with businesses across the country and beyond."
        quick={QUICK}
        detailed={DETAILED}
        quickLabel="Quick message"
        detailedLabel="Detailed inquiry"
      />
    </PageComposer>
  );
}
