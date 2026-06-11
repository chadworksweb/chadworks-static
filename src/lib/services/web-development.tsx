// Service: Web Development (Websites lane) -- the DEVELOPMENT-angle entry to
// the websites service. For buyers searching "web development": they either
// already have a design or use the term as a catch-all for needing a site.
// Describes the development side, then funnels to the four build options.
// Mirror page: /web-design/ (same service, design angle).
//
// .tsx (not .ts) so the answer-first lede can carry an inline cross-link to
// the web design page. Copy in Chad's PUBLIC voice
// (chad-lewine-crystopa-forge-voice-profile.md), run against the humanizing
// voice rules. First-person "I", warm. GEO sign-off still pending before ship.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { WebDevHeroArt } from "@/components/art/WebDevHeroArt";

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
      makes the visual design interactive. I&apos;m Chad, and I&apos;ve been
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
  keyFacts: [
    "A site is only doing its job when it wins you customers, not just compliments -- so I build for speed, search, and conversion, not just looks.",
    "I write custom code on a modern stack, so your site isn't carrying the weight of plugins and page-builder bloat it never needed.",
    "How you want it built is your call. I'll walk you through every build option and tell you honestly which one fits, instead of pushing the one that pays me most.",
    "Twenty years of building means I've already hit the problems your project will run into, so we get ahead of them instead of finding them at launch.",
  ],

  problem: {
    heading: "Why web development actually matters",
    subheading: "No one sees it, everyone feels it.",
    body:
      "You choose a website by how it looks, but it's the development underneath that decides whether it loads fast, gets found by search and AI, and wins you customers, or quietly bleeds them while the homepage still looks perfect.",
    // The prose opens in the frosted pop-down (off the ribbons). `body` leads
    // the panel; these paragraphs expand on it.
    more: {
      trigger: "More reasons it matters",
      paragraphs: [
        <>
          <strong>Speed</strong> is the obvious one. A slow site loses people
          before the design ever gets a chance to work on them, and search
          engines notice the same thing your visitors do. The code underneath
          decides that, not the colors.
        </>,
        <>
          <strong>Visibility</strong> is the quieter one. Search engines and
          the AI tools people now ask for recommendations don&apos;t see your
          site the way you do. They read the structure under it. Clean markup
          gets found and quoted, while page-builder tangle gets skipped.
        </>,
        <>
          <strong>Stability</strong> is the one you find out about later. A
          custom-coded site and a page-builder site can look exactly the same
          on day one. The difference shows up after that. One stays fast and
          costs almost nothing to run. The other gets slower and more expensive
          every year. Pick wrong and you end up paying for the same website
          twice.
        </>,
        "That's why I walk you through the build options before any code gets written. Get the development right at the start, and the design gets to do its job for years.",
      ],
    },
  },

  approach: {
    heading: "How I develop it",
    steps: [
      {
        title: "I start under the hood",
        body:
          "Before anything visual, I work out how the site needs to be structured to load fast and stay readable to search engines and AI. The architecture comes first, because it is the part that gets expensive to fix later.",
      },
      {
        title: "I build to your design, or help you find one",
        body:
          "If you already have a design, I develop straight to it. If you don't, we can build a clean one together or start from the web design side, so you are never stuck waiting because the visuals aren't ready.",
      },
      {
        title: "Performance and visibility are part of the build",
        body:
          "Fast load times and answer-first markup aren't a later phase. They are how I write the site in the first place, which is why the sites I build tend to rank without a separate rescue project.",
      },
      {
        title: "You own the result",
        body:
          "However we build it, the finished site and its hosting end up in your name. No platform holds your business hostage, and you can take it anywhere.",
      },
    ],
  },

  paths: {
    heading: "Choose how it's built",
    intro:
      "Same service, four ways to build it. If you're not sure which is right, that's what the conversation is for. Here's the short version of each.",
    items: [
      {
        label: "Custom Coded / Static",
        detail:
          "The fastest, most secure route. Custom-built with nothing to update or break, and yours completely. Best when performance and ownership lead.",
        href: "/custom-coded-static/",
      },
      {
        label: "WordPress",
        detail:
          "The familiar route, done right. Good when you want to manage a lot of content yourself on a CMS your whole team already knows.",
        href: "/wordpress/",
      },
      {
        label: "Ecommerce",
        detail:
          "For selling directly. Built around your products and the way you actually fulfill orders, not a generic store theme.",
        href: "/ecommerce/",
      },
      {
        label: "Shopify",
        detail:
          "Selling without the upkeep. A strong call when you'd rather hand the platform headaches to Shopify and focus on your products.",
        href: "/shopify/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Specialized design pages",
        detail:
          "Industry-specific builds, like the septic and foundation-repair pages, developed to rank and convert for one trade rather than everyone at once.",
        href: "/design/",
      },
      {
        label: "The portfolio",
        detail:
          "Walk through a live build in the immersive portfolio instead of taking my word for any of this.",
        href: "/portfolio/",
      },
    ],
  },

  price: {
    heading: "What it costs, plainly",
    body:
      "I price on the value of the work, not on how small a number I can promise you. Time bills at $315 an hour, and projects start at a $3,200 floor. Most builds settle near $6,200, depending on scope and which route you take. I'm honest that this puts me above the cheapest option you'll find, and that is deliberate, because the cheap option is usually the one you pay to rebuild in two years. If a strict fixed budget matters to you more than the result, I'll tell you straight that we probably aren't a match, and I would rather say so now than after you've spent the money.",
  },

  faqs: [
    {
      q: "Do I need a design before you start?",
      a: "Not at all. If you have one, I'll develop straight to it. If you don't, we can create something together or start from the web design side, and I won't let a missing mockup stall your project.",
    },
    {
      q: "What's the difference between this and the web design page?",
      a: "Same end result, a website, approached from two directions. This page is about how the site gets built and made to perform. The web design page is about how it looks and feels. Most people need both, and I handle both, so start on whichever word matches how you already think about it.",
    },
    {
      q: "Which build option should I pick?",
      a: "Tell me what you're trying to do and I'll tell you straight. Custom is the move when speed and ownership lead. WordPress earns its place with content-heavy teams that want to self-manage. If you're selling, the ecommerce and Shopify routes are built for exactly that. You don't have to know going in, sorting that out is part of the job.",
    },
    {
      q: "How long does a build take?",
      a: "Most run a few weeks, and the real variable is usually how fast content and feedback come back from your side, not the coding itself. I scope the timeline with you up front so there are no quiet surprises halfway through.",
    },
    {
      q: "What happens if we stop working together?",
      a: "You keep everything. The code and the hosting are already in your name, so there is no handover hostage situation and nothing of yours goes dark. I hand over working files without being asked, the same way I would want it done for me.",
    },
  ],

  cta: {
    heading: "Not sure which way to build?",
    body:
      "Tell me what you're building toward and where your current site is letting you down. I'll give you an honest read on the best way to build it and what the work would really take, before either of us commits to anything.",
    buttonLabel: "Tell me about your project",
    href: "/contact/",
  },

  // Portfolio shots -- REAL live client builds, captured full-width (1920px) for
  // the water-ripple effect. Local raster PNGs (cross-origin getImageData taints
  // the canvas, so the source must be local). Labels link to the live sites.
  portfolio: {
    heading: "Click into the work",
    intro:
      "Click anywhere on a shot to send a ripple through it. Real, live client builds -- the same custom-built performance underneath, whatever the look.",
    items: [
      { label: "chadlewine.com", img: "/portfolio/chadlewine.png", alt: "chadlewine.com, a custom Next.js musician site", href: "https://chadlewine.com" },
      { label: "The Rising Compass", img: "/portfolio/risingcompass.png", alt: "risingcompass.net, a custom-built song-analysis web app", href: "https://risingcompass.net" },
      { label: "Rozario Touma, P.C.", img: "/portfolio/rozariolaw.png", alt: "rozariolaw.com, a corporate law firm website in New York City", href: "https://rozariolaw.com" },
      { label: "Abracadabra Gems", img: "/portfolio/abracadabragems.png", alt: "abracadabragems.com, an artisan jeweler's website", href: "https://abracadabragems.com" },
    ],
  },

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
      },
      {
        quote:
          "Chad is very professional, talented and skilled. He does not try to sell you on products or services that you don't need.",
        attribution: "Kimberly Dolan, K.I.M. Keep It Moving (Philadelphia)",
      },
      {
        quote:
          "Chad went above and beyond and exceeded our expectations with the final product.",
        attribution: "Mary Lynn Renner, AAC Event Catering (Lansdale, PA)",
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
      "I give you an honest read on fit before either of us commits to anything.",
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
        title: "An honest read",
        body: "I'll tell you straight whether chadworks is the right fit, with a rough shape and cost, and no pressure either way.",
      },
      {
        title: "A scoped plan",
        body: "If it's a fit, you get a clear written scope and timeline before any work or payment starts.",
      },
    ],
  },

  meta: {
    title: "Web Development -- How Your Website Gets Built | chadworks",
    description:
      "Web development is the technology behind your website: the code and structure that connect it to the server and make the design interactive. I custom-build fast, search-ready sites and help you choose how it's built.",
  },
};
