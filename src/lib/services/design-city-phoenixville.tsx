// Service: Website Design in Phoenixville, PA (/website-design-for-phoenixville-pa/).
// Local SEO/GEO city page in the Design lane. Phoenixville is a Chester County
// borough: a revitalized former steel town whose Bridge Street is now an arts,
// brewery, and foundry scene, capped by the annual Firebird Festival. MVP build.

import { type Service } from "@/lib/service";
import { TYPICAL_BAND } from "@/lib/pricing";

export const phoenixville: Service = {
  slug: "website-design-for-phoenixville-pa",
  lane: "design",
  laneLabel: "Design",
  breadcrumbParent: { label: "Service Areas", href: "/my-service-areas/" },
  eyebrow: "Website design in Phoenixville, PA",
  title: "Website Design in Phoenixville, PA",
  intent:
    "chadworks designs and builds custom websites for Phoenixville, PA businesses, the revitalized Chester County steel town whose Bridge Street is now a magnet for breweries, arts, and the Firebird Festival.",

  answer:
    `If you run a business in Phoenixville, PA, here is what you get: a custom website with the personality to fit a town that reinvented itself, fast on a phone and tuned so Google and the AI answer engines surface you. I am Chad, a solo builder in Greater Philadelphia, building sites since the MySpace days. Most projects run ${TYPICAL_BAND} depending on scope, quoted up front before work starts. Phoenixville went from a shuttered steel town to one of the most alive main streets around: Bridge Street breweries, the Colonial Theatre, the foundry, and the Firebird Festival burning every December. The crowd this draws expects character. A generic site reads as out of step with the place.`,

  keyFactsHeading: "Phoenixville web design, at a glance",
  keyFacts: [
    "Custom websites for Phoenixville businesses, built for a revitalized Chester County steel town whose Bridge Street now runs on breweries, arts, the Colonial Theatre, and the Firebird Festival.",
    "Designed with real character, because the crowd Phoenixville draws expects personality and a generic template reads as a poor fit for the town.",
    `Value-based pricing: ${TYPICAL_BAND}, scope-dependent, quoted up front. No template rent, no surprise invoices.`,
    "Local or remote both work: I am based in Greater Philadelphia, an easy reach to Chester County, and I run plenty of projects fully remote.",
  ],

  problem: {
    heading: "Phoenixville rewards character, not cookie-cutter",
    subheading: "A reinvented town expects a site with personality.",
    body:
      "Phoenixville earned its comeback on character: independent breweries, the restored Colonial Theatre, working artists, a festival that sets a giant bird on fire every winter. The people drawn to that scene have an eye for what feels authentic. A flat, templated website reads as a chain in a town that defined itself against chains, and it undersells a genuinely interesting business.",
    more: {
      trigger: "Why this matters for a Phoenixville business",
      paragraphs: [
        "This town did not revitalize by being generic. Bridge Street came back on the strength of distinctive places: the breweries, the foundry-turned-venue, the indie shops, the Firebird Festival that ends the year in flames. That identity is the draw, and the audience it pulls notices when a business does not live up to it.",
        "So a website here is doing more than listing hours. It is signaling whether you are part of what makes Phoenixville Phoenixville, or just renting a storefront. A site with real personality fits in; a stock template quietly marks you as not getting the place.",
        "I build with that in mind: a site that carries your character, loads fast on a phone, and is structured so local search and AI answers surface you to the people seeking out exactly the kind of distinctive spot Phoenixville is known for.",
      ],
    },
  },

  approach: {
    heading: "How a Phoenixville build runs",
    steps: [
      {
        title: "We start with your character",
        body:
          "I learn what makes your business distinct and design from that, so the site fits a town built on personality instead of reading like a template.",
      },
      {
        title: "I design it mobile-first",
        body:
          "The Bridge Street crowd decides on a phone, often on the go, so I design for that screen first and make the character read at small sizes.",
      },
      {
        title: "I build it custom and fast",
        body:
          "You get a distinctive, quick site you own outright, not a heavy template you rent. Personality and speed both matter to this audience.",
      },
      {
        title: "I tune it for local and AI search",
        body:
          "Phoenixville and Chester County go into the page text and structured data, so the engines and answer tools place you for nearby searches.",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "One builder, twenty years",
        detail:
          "You work directly with the person who designs and codes the site. No agency layers, no handoff, no template assembly line.",
      },
      {
        label: "Designed with character, built to be fast",
        detail:
          "Every site is built around your actual personality and coded to load quickly, which is the combination Phoenixville's crowd responds to.",
      },
    ],
  },

  price: {
    heading: "What a Phoenixville site costs",
    figure: TYPICAL_BAND,
    figureSub: "scope-dependent, quoted up front",
    body:
      `A custom site for a Phoenixville business runs ${TYPICAL_BAND}, depending on page count and how much custom design the project calls for. You get the exact figure before any work begins. This is a value-based build for a site with genuine character that fits the town and that you fully own, not a template you rent month to month.`,
  },

  qualification: {
    heading: "Is this a fit?",
    fitLabel: "A good fit if",
    fit: [
      "You run a brewery, restaurant, shop, venue, or service in or near Phoenixville where character matters.",
      "Your current site feels generic for a town that runs on personality.",
      "You would rather own a distinctive custom site than rent a template by the month.",
      "You want one accountable builder, in person or remote.",
    ],
    notLabel: "Probably not if",
    notFit: [
      "You just need the cheapest possible placeholder page.",
      "You want a DIY drag-and-drop builder you run entirely yourself.",
    ],
  },

  faqs: [
    {
      q: "Do you work with businesses in Phoenixville?",
      a: "Yes, Phoenixville is part of my service area. I am based in Greater Philadelphia, so meeting in person around Chester County is workable, and I also run plenty of projects fully remote. The custom design and direct access to me are the same either way.",
    },
    {
      q: "How much does a website cost?",
      a: `Most custom builds run ${TYPICAL_BAND}, depending on scope. I quote the exact number up front before any work starts. It is value-based pricing for a site you own, not a recurring template fee.`,
    },
    {
      q: "Why does character matter so much for a Phoenixville site?",
      a: "Because Phoenixville came back on the strength of distinctive places, the breweries, the Colonial Theatre, the Firebird Festival, and the crowd it draws notices authenticity. A generic template marks you as a poor fit for the town. A site with real personality signals you are part of what makes the place worth visiting.",
    },
    {
      q: "Do I own the website when it is done?",
      a: "Yes, completely. The code, content, and domain are yours. No platform lock-in, no monthly rent for your own site. If you ever move on from me, the whole thing goes with you.",
    },
    {
      q: "How long does a build take?",
      a: "A typical custom site takes a few weeks from kickoff to launch, depending on how fast we settle the content and the size of the site. I give you a realistic timeline with the quote and keep you updated as we go.",
    },
  ],

  cta: {
    heading: "Let's build your Phoenixville site",
    body:
      "If your Phoenixville business deserves a site with as much character as the town, let's build it. Tell me what you do and I will come back with a real plan and a real number, quoted up front, for a custom site that carries your personality, loads fast on a phone, and gets found by the people drawn to Bridge Street. No pressure, just a clear answer.",
    buttonLabel: "Start your project",
    href: "/contact/",
  },

  meta: {
    title: "Website Design in Phoenixville, PA | chadworks",
    description:
      `Custom website design for Phoenixville, PA businesses in the revitalized Chester County steel town, from Bridge Street breweries to the arts and foundry scene. Distinctive, fast, built for local search. ${TYPICAL_BAND}, quoted up front.`,
  },
};
