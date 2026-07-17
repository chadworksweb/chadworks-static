// Service: Shopify (Websites lane) -- selling without the upkeep. Real
// credential: Shopify for a multi-million dollar manufacturing company.
// Honest about the platform economics (the base plan is priced well, the
// monthly bill can add up). Copy in Chad's public voice.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { BagChip, StoreChipDark, CartChip, TagChip } from "@/components/art/MoreChips";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "store", svg: <StoreChipDark />, style: { left: "5%", width: "138px", animationDelay: "0s", animationDuration: "26.6s" } },  // 156/360
  { key: "bag", svg: <BagChip />, style: { left: "64%", width: "88px", animationDelay: "3s", animationDuration: "22.9s" } },          // 318/360
  { key: "cart", svg: <CartChip />, style: { left: "34%", width: "98px", animationDelay: "9s", animationDuration: "28.5s" } },        // 220/360
  { key: "tag", svg: <TagChip />, style: { left: "52%", width: "82px", animationDelay: "1s", animationDuration: "24.9s" } },          // 269/360
  { key: "bag2", svg: <BagChip />, style: { left: "16%", width: "66px", animationDelay: "13s", animationDuration: "20.5s" } },        // 124/360
  { key: "store2", svg: <StoreChipDark />, style: { left: "42%", width: "112px", animationDelay: "17s", animationDuration: "27.8s" } }, // 263/360
  { key: "cart2", svg: <CartChip />, style: { left: "72%", width: "72px", animationDelay: "21s", animationDuration: "23.7s" } },      // 331/360
  { key: "tag2", svg: <TagChip />, style: { left: "26%", width: "64px", animationDelay: "24s", animationDuration: "29.6s" } },        // 158/360
];

function ShopifyHeroArt() {
  return (
    <>
      {CHIPS.map((c) => (
        <div key={c.key} className="hero-chip" style={c.style}>
          {c.svg}
        </div>
      ))}
    </>
  );
}

export const shopify: Service = {
  slug: "shopify",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Selling without the upkeep",
  title: "Shopify",
  intent:
    "chadworks designs custom Shopify stores so the platform handles hosting and updates while the store still looks like the business, not like Shopify.",

  answer: (
    <>
      Shopify is the route where the platform carries the load: hosting,
      security, updates, and checkout all handled, so you can run the store
      instead of maintaining it. I&apos;m Chad, I&apos;ve used Shopify for
      businesses up to a multi-million dollar manufacturer, and my job on
      this route is simple: make your store look like your business instead
      of like Shopify.
    </>
  ),

  heroArt: <ShopifyHeroArt />,

  keyFactsHeading: "Shopify, at a glance",
  keyFacts: [
    "Shopify removes the platform headaches: hosting, security, and updates are its problem, not yours.",
    "I've run Shopify for a multi-million dollar manufacturing company, so your store won't be my first rodeo.",
    "Custom design over the platform. The store reads as your brand, not as a recognizable Shopify theme.",
    "Honest economics up front: the base plan is priced well, and the monthly bill can add up as apps stack on.",
  ],

  problem: {
    heading: "Why Shopify stores all look the same",
    subheading: "The platform is strong. The themes are everywhere.",
    body:
      "Shopify's strength is that anyone can launch a store from a theme in a weekend, which is exactly why so many stores look like the same weekend. Buyers notice, even when they can't say what they noticed. The platform deserves better than its default face.",
    more: {
      trigger: "What I change about that",
      paragraphs: [
        <>
          <strong>The face</strong>{" "}gets designed. Your typography, your
          colors, your product presentation, built over Shopify&apos;s rails
          until the theme underneath stops being visible.
        </>,
        <>
          <strong>The apps</strong>{" "}get audited. Shopify&apos;s app store
          solves everything for $10 a month each, and that&apos;s how a $39
          plan becomes a $300 monthly bill. Every app has to earn its slot,
          and most don&apos;t.
        </>,
        <>
          <strong>The product pages</strong>{" "}get the real attention. That&apos;s
          where buying happens, and where stock themes settle for a photo
          grid and a description box. Yours get built to answer the buying
          question before it&apos;s asked.
        </>,
        "And if Shopify is the wrong platform for your catalog or your margins, I'll say so before you're subscribed to it. That honesty is cheaper than a year of the wrong monthly bill.",
      ],
    },
  },

  approach: {
    heading: "How I build it",
    steps: [
      {
        title: "The catalog decides the structure",
        body:
          "Your products, variants, and collections shape the store's architecture before any visual work starts.",
      },
      {
        title: "Custom design over the rails",
        body:
          "Shopify handles the machinery while the design layer gets fully customized, so the store reads as yours at a glance.",
      },
      {
        title: "A lean app stack",
        body:
          "Only the apps that earn their monthly cost survive. Your bill stays close to the base plan instead of quietly tripling.",
      },
      {
        title: "Handover and your accounts",
        body:
          "The store, payments, and shipping live in your accounts, and your team gets a real handover on running it daily.",
      },
    ],
  },

  paths: {
    heading: "Make sure it's the right platform",
    intro:
      "Shopify is a strong default for product businesses. These are the doors out when it isn't.",
    items: [
      {
        label: "Ecommerce",
        detail: "The full store conversation: WooCommerce versus Shopify, costs on the table, chosen for your catalog.",
        href: "/ecommerce/",
      },
      {
        label: "WordPress",
        detail: "WooCommerce on your own hosting: more control, more upkeep, no platform rent.",
        href: "/wordpress/",
      },
      {
        label: "Web Design",
        detail: "Whatever the platform, the design decides whether buyers trust the store.",
        href: "/web-design/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Multi-million dollar volume",
        detail: "I've used Shopify for a manufacturing company doing millions in revenue. The platform holds, and I know where it strains.",
      },
      {
        label: "The portfolio",
        detail: "Live builds, walkable right now, in the immersive portfolio.",
        href: "/portfolio/",
      },
    ],
  },

  price: {
    heading: "What it costs, plainly",
    figure: "$3,200 - $6,200+",
    figureSub: "Value-based -- plus Shopify's own monthly plan",
    body:
      "A Shopify build is priced on what it wins for your business, from the $3,200 baseline with most landing near $6,200. Shopify's own monthly plan sits on top, and I'll lay out that real number, including what the apps you actually need cost, before you ever commit to the platform.",
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}Shopify&apos;s base plan is
        competitively priced, and the monthly bill can quickly add up as
        apps pile on. Keeping that stack lean is part of the build, not an
        afterthought.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about the Shopify route, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "Why Shopify instead of WooCommerce?",
      a: "Pick Shopify when you want the platform headaches handled for a monthly bill, and WooCommerce when control or custom flows matter more than convenience. Tell me your catalog and your team, and I'll tell you straight which side you're on.",
    },
    {
      q: "Can you redesign my existing Shopify store?",
      a: "Yes, and often without rebuilding it. If the store's bones are healthy, the design layer can be rebuilt over them. If it's drowning in apps and patches, I'll show you the honest math on starting clean.",
    },
    {
      q: "Will my store stop looking like a template?",
      a: "That's the whole job. Custom typography, your brand's color system, and product pages designed around your actual products. The theme underneath becomes invisible.",
    },
    {
      q: "What will Shopify really cost me monthly?",
      a: "The base plan, plus payment processing, plus whatever apps survive the audit. I put the full expected monthly number in front of you before you subscribe, because the advertised price and the lived price are different animals.",
    },
    {
      q: "Do I own the store?",
      a: "You own the account, the products, the customer list, and the design work I deliver. Shopify owns the platform, which is the trade you're making for never thinking about servers. I make sure your side of that trade is everything it can be.",
    },
  ],

  cta: {
    heading: "Want Shopify without the Shopify look?",
    body: "Tell me what you sell and where the store stands today. You'll get a straight answer on whether Shopify is your platform, what it really costs monthly, and what a custom face on it would take.",
    buttonLabel: "Tell me about your store",
    href: "/contact/",
  },

  form: {
    source: "shopify page",
    subject: "New Shopify Inquiry -- chadworks",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "current_site", label: "Current Store (if any)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "situation",
        label: "The Situation",
        span: "half",
        options: [
          { value: "new", label: "New Shopify store" },
          { value: "redesign", label: "Redesign my Shopify store" },
          { value: "migrate", label: "Move my store to Shopify" },
          { value: "unsure", label: "Not sure Shopify is right" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "What do you sell?",
        required: true,
        rows: 4,
        placeholder: "The products, roughly how many, and what's bugging you about the current setup if there is one.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is Shopify the right route?",
    fit: [
      "You want to run a store, not maintain a platform.",
      "A predictable monthly bill beats managing hosting and updates.",
    ],
    notFit: [
      "Your catalog or flows need things Shopify boxes in. WooCommerce is the door.",
      "You want zero monthly platform rent. The static + WooCommerce math wins there.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The store account, products, and customers are yours from day one.",
      "Every build includes two weeks of free fixes after launch.",
      "The full monthly platform cost is on the table before you subscribe.",
      "You get a straight answer on platform fit before any payment.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me about the store through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "Whether Shopify fits, what it really costs monthly, and what the build would take." },
      { title: "A scoped plan", body: "Written scope, number, and timeline before any payment." },
      { title: "Build, launch, handover", body: "A store that reads as yours, live in your accounts, with your team running it." },
    ],
  },

  meta: {
    title: "Shopify Stores -- Custom Design, Platform Handled | chadworks",
    description:
      "Custom Shopify stores that look like your business, not like Shopify: lean app stacks, honest monthly costs up front, and product pages designed to sell. Built by someone who has run Shopify at multi-million dollar volume.",
  },
};
