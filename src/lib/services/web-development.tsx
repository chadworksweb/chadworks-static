// Service: Web Development (Websites lane) -- the DEVELOPMENT-angle entry to
// the websites service. For buyers searching "web development": they either
// already have a design or use the term as a catch-all for needing a site.
// Describes the development side, then funnels to the four build options.
// Mirror page: /web-design/ (same service, design angle).
//
// .tsx (not .ts) so the answer-first lede can carry an inline cross-link to
// the web design page. Copy in Chad's PUBLIC voice
// (the chad voice profile), run against the humanizing
// voice rules. First-person "I", warm. GEO sign-off still pending before ship.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { WebDevHeroArt } from "@/components/art/WebDevHeroArt";
import { HIGH, HOURLY, LOW } from "@/lib/pricing";
import { BASE, money } from "@/lib/package-builder";

export const webDevelopment: Service = {
  slug: "web-development",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "The code behind the design",
  title: "Web Development",
  intent:
    "chadworks develops fast, search-ready websites and helps the buyer choose how the site gets built (custom, WordPress, ecommerce, or Shopify).",

  // Answer-first, development-framed (GEO checklist 1). Two real cases, with
  // an inline link to the web design page for the "needs a design too" reader.
  answer: (
    <>
      Web development is the technology behind a website: the code and the
      structural foundation that connects the site to the server and host and
      makes the visual design interactive. I&apos;m Chad Lewine, and I&apos;ve been
      developing websites for 20 years. Whether you
      already have a design in hand or you need one{" "}
      <Link href="/web-design/" className="svc-inline-link">
        designed
      </Link>{" "}
      as well as developed, I&apos;ll bring your website vision to life.
    </>
  ),

  heroArt: <WebDevHeroArt />,

  keyFactsHeading: "Web development, at a glance",
  keyFactsIntroClassName: "cw-webdev-glance",
  keyFacts: [
    "A site is only doing its job when it wins you customers, not just compliments. I build for speed, search, and conversions.",
    "I develop custom code on a modern stack, so your site isn't carrying the weight of plugins and page-builder bloat it never needed.",
    "How you want it built is your call. I'll walk you through different build options and tell you honestly which one fits, instead of pushing the one that pays me most.",
    "Twenty years of building means I've already hit the problems your project will run into, so we get ahead of them instead of finding them at launch.",
  ],

  problem: {
    heading: "Why web development actually matters",
    subheading: "No one sees it, everyone feels it.",
    body:
      "You choose a website by how it looks, but it's the development underneath that decides whether it loads fast, gets found by search and AI, and wins you customers.",
    // The prose opens in the frosted pop-down (off the ribbons). `body` leads
    // the panel; these paragraphs expand on it.
    more: {
      trigger: "More reasons it matters",
      paragraphs: [
        <>
          <strong>Speed</strong>. If a site loads slowly, how long do you stick
          around? A slow site loses people before the design ever gets to do its
          part. Proper development ensures a fast site.
        </>,
        <>
          <strong>Visibility</strong>. Search engines and the AI search and
          chatbots people now use for recommendations and shopping don&apos;t
          see your site the way you do, they read the structure underneath. I
          develop websites with comprehensive markup and structure that gets you
          found, ranked and cited.
        </>,
        <>
          <strong>Stability</strong>. Any two websites can look exactly the same
          on day one, but without proper development, one that is built on
          fragile or rigged infrastructure can quickly become dilapidated,
          leading to ongoing labor costs to fix and/or maintain the site, costs
          that the more structurally-sound site doesn&apos;t incur because it has
          higher quality development and code behind it.
        </>,
        <>
          <strong>Security</strong>. Hacking is at an all-time high. If your
          website isn&apos;t protected, you will be hacked eventually. It
          doesn&apos;t matter if you are a multinational brand or a hobbyist.
          Commercial-grade development practices are essential in defending
          against hacking, spam and other bad actors lurking on the net.
        </>,
      ],
    },
  },

  approach: {
    heading: "The chadworks™ Web Development Process",
    // Development-leaning skin of the same project arc the web design page walks
    // (Chad, 2026-07-11): the standard small-business build lifecycle, named by
    // dev stage and language. Discovery -> architecture/stack -> design handoff
    // -> front-end -> back-end/integrations -> performance & technical SEO ->
    // QA -> deployment -> post-launch safety net.
    steps: [
      {
        title: "Discovery & Requirements",
        body:
          "Before any code, I pull the technical requirements out of your business: what the site has to do, what it needs to connect to, where the content will live, and which features actually earn their place.",
      },
      {
        title: "Architecture & the Right Stack",
        body:
          "With the requirements in hand, I map the site's structure and choose the stack it should be built on: a custom-coded build on a modern JavaScript framework, WordPress and PHP when your team needs to manage content itself, or an ecommerce setup when you're selling.",
      },
      {
        title: "Working From Your Design",
        body: (
          <>
            If you already have a design, I develop straight to spec. If you
            don&apos;t, I can{" "}
            <Link href="/web-design/" className="svc-inline-link">
              create a custom design
            </Link>{" "}
            for your project and develop around it, so you&apos;re never stuck
            waiting on visuals to get started. Bring me the idea and
            we&apos;ll get right to it.
          </>
        ),
      },
      {
        title: "Front-End Development",
        body:
          "I build the interface itself in HTML, CSS, and JavaScript (or TypeScript and React on a custom build), turning the design into a fast, responsive, genuinely interactive site. The markup is clean and semantic from the first line, because that is what search engines and AI actually read.",
      },
      {
        title: "Back-End Development & Integrations",
        body:
          "Then the machinery underneath: the server-side logic, the database, the CMS, the contact forms, and any third-party tools your site has to talk to. This is where PHP, SQL, and server code come in.",
      },
      {
        title: "Performance & Technical SEO",
        body:
          "Speed and visibility aren't an add-on. I optimize assets, caching, and load times against Core Web Vitals, and I ensure search engines and AI scan clean structured data (JSON-LD schema), so your pages get found, ranked, and quoted instead of skipped.",
      },
      {
        title: "Testing & QA",
        body:
          "Every page gets tested across browsers, devices, and screen sizes, and each feature gets checked to confirm it does exactly what it's supposed to. I squash bugs before your customers do.",
      },
      {
        title: "Deployment & Launch",
        body:
          "When it's ready, I move the site from staging to the live production server, wire up your domain and SSL certificate, and run the final checks before it goes public.",
      },
      {
        title: "Post-Launch Safety Net",
        body:
          "You get a week after launch where I fix any bug or issue we didn't catch, at no charge. After that I'm still here for whatever the site needs next, whenever you need it.",
      },
    ],
  },

  // Platform Options now render from the shared PlatformOptionsCapsule (Chad,
  // 2026-07-19), so this page carries no build-options list of its own.

  price: {
    heading: "What it costs, plainly",
    // NOTE: this field does not render on /web-development/. The page sets
    // `price: null` (see app/web-development/page.tsx:72), so anything written
    // here is dead on the only route that reads this file. Put page-visible
    // price copy in the FAQ list below instead.
    body:
      `I price on the value of the work, not on how small a number I can promise you. Time bills at ${money(HOURLY)} an hour, and projects start at a ${money(BASE)} baseline. Most builds settle between ${LOW} and ${HIGH}, depending on scope and which route you take. I'm honest that this puts me above the cheapest option you'll find, and that is deliberate, because the cheap option is usually the one you pay to rebuild in two years. If a strict fixed budget matters to you more than the result, I'll tell you straight that we probably aren't a match, and I would rather say so now than after you've spent the money.`,
  },

  faqs: [
    {
      q: "Do I need a design before you start?",
      a: "If you have one, that's great, I'll develop it. If you don't, I'll create something spectacular that matches your vision for the project.",
    },
    {
      q: "What's the difference between this and the web design page?",
      a: "The web design page describes the website process from the design side, while this page describes it more from the development side. Both design and development are equally needed for any web project, and most clients need both, but I offer them separately for special cases.",
    },
    {
      q: "Which build option should I pick?",
      // Chad's answer verbatim. The calculator sentence this once carried moved
      // into the cost FAQ below (Chad, 2026-08-12), which is now this page's
      // contextual link into the calculator.
      a: "That depends on your project's overall technical needs. If you aren't selling anything, you wouldn't want to use Shopify. Or even if you are selling one or two items, still, Shopify might be overkill. If you aren't writing blogs regularly, you probably don't need WordPress, and a traditional, custom coded static site would be the way to go. You don't have to know before you contact me. That is part of what I help you determine.",
    },
    {
      q: "How much does website development cost?",
      // Chad's answer verbatim (2026-08-12), as JSX so "website design cost
      // calculator" carries the page's contextual link. Figures render from
      // pricing.ts so they move when the rates do.
      a: (
        <>
          Web development starts at {money(BASE)} but can easily reach {LOW} and
          higher. Use my{" "}
          <Link href="/website-design-cost-calculator/">
            website design cost calculator
          </Link>{" "}
          for a near-exact estimate of your project.
        </>
      ),
      // REQUIRED because `a` above is JSX: buildFaqJsonLd drops any JSX answer
      // that has no aText, so without this the question vanishes from the
      // FAQPage schema. Keep the two in sync sentence for sentence.
      aText: `Web development starts at ${money(BASE)} but can easily reach ${LOW} and higher. Use my website design cost calculator for a near-exact estimate of your project.`,
    },
    {
      q: "How long does a build take?",
      a: "Most projects take a few weeks. It all comes down to the ambition of your vision, your communication and decision-making speed, and the overall technical scope of the project. My proposal-agreement includes a timeline so you won't be left guessing once we begin.",
    },
    {
      q: "What happens if we stop working together?",
      a: "Beyond the terms of your project's agreement, I don't operate on long-term commitments. The only ongoing fee is hosting, which is billed monthly with no commitment. As far as your content, you own it all from the code to the copy to the images, so you are free to take your site elsewhere should you need to.",
    },
  ],

  cta: {
    heading: "Not sure which way to build?",
    body:
      "Tell me what you're building toward and where your current site is letting you down. I'll give you a straight answer on the best way to build it and what the work would really take, before either of us commits to anything.",
    buttonLabel: "Tell me about your project",
    href: "/contact/",
  },

  // No `portfolio` block: this page's portfolio slot is overridden in
  // app/web-development/page.tsx with the shared PortfolioShowcaseCapsule, so
  // any data here would never render. It used to carry a full ripple-grid
  // config that had gone silently dead behind that override.

  // --- conversion-support sections. ---
  // Testimonials are REAL client reviews harvested from the live chadworks.co
  // page (verbatim, real attribution). Three chosen for the development angle:
  // Ananda (search-result proof, cross-sells visibility), Kimberly (no-upsell
  // honesty), Mary Lynn (a nameable local build).
  testimonials: {
    heading: "What clients say",
    items: [
      {
        quote:
          "Chad is a wonder worker! My website now shows up first or second in any searches. He is an SEO magician!",
        attribution: "Ananda Forest, author",
        img: "/people/ananda-forest.webp",
      },
      {
        quote:
          "Chad is very professional, talented and skilled. He does not try to sell you on products or services that you don't need.",
        attribution: "Kimberly Dolan, K.I.M. Keep It Moving (Philadelphia)",
        img: "/people/kimberly-dolan.webp",
      },
      {
        quote:
          "Chad went above and beyond and exceeded our expectations with the final product.",
        attribution: "Mary Lynn Renner, AAC Event Catering (Lansdale, PA)",
        img: "/people/mary-lynn-renner.webp",
      },
    ],
  },

  qualification: {
    heading: "Is this the right fit?",
    fit: [
      "You care more about the result than finding the lowest possible price.",
      "You've outgrown a page builder and want a site that's genuinely fast and yours to keep.",
    ],
    notFit: [
      "A strict fixed budget matters to you more than the outcome.",
      "You want the cheapest option you can find, or the whole thing built over a weekend.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "You own the code and the hosting outright -- nothing of yours is ever locked inside my account.",
      "Every build includes two weeks of free bug fixes after launch.",
      "It works with a keyboard and a screen reader, because some of your visitors need it to.",
      "Nothing measures a visitor until they agree to it, and there are no ad pixels.",
      "I give you a straight answer on fit before either of us commits to anything.",
      "You get the working files handed over, no lock-in, nothing held hostage.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      {
        title: "You reach out",
        body: "Tell me what you're building toward through the contact form or a quick email. I usually reply within a day.",
      },
      {
        title: "A straight answer",
        body: "I'll tell you straight whether chadworks is the right fit, with a rough shape and cost, and no pressure either way.",
      },
      {
        title: "A scoped plan",
        body: "If it's a fit, you get a clear written scope and timeline before any work or payment starts.",
      },
    ],
  },

  meta: {
    title: "Website Development by chadworks™",
    description:
      "chadworks can develop your idea into a reality using commercial grade development practices that get you ranked and cited.",
  },
};
