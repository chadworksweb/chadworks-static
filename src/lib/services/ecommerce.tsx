// Service: Ecommerce (Websites lane) -- selling directly. Real credentials:
// Chad has run Shopify for a multi-million dollar manufacturing company and
// builds/maintains WooCommerce stores for product businesses today. Copy in
// Chad's public voice.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { CartChip, TagChip, CardChipDark, BagChip } from "@/components/art/MoreChips";
import { BrowserChip } from "@/components/art/WebDevHeroArt";
import { EcommerceViz } from "@/components/art/BuildPathViz";
import { BAND_FROM_BASE, HIGH, LOW } from "@/lib/pricing";
import { BASE, money } from "@/lib/package-builder";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "cart", svg: <CartChip />, style: { left: "6%", width: "100px", animationDelay: "0s", animationDuration: "21.5s" } },        // 122/360
  { key: "card", svg: <CardChipDark />, style: { left: "48%", width: "126px", animationDelay: "3.3s", animationDuration: "18.6s" } },    // 299/360
  { key: "browser", svg: <BrowserChip />, style: { left: "20%", width: "156px", animationDelay: "8.3s", animationDuration: "23.6s" } }, // 228/360
  { key: "tag", svg: <TagChip />, style: { left: "70%", width: "88px", animationDelay: "1.6s", animationDuration: "20s" } },           // 340/360
  { key: "bag", svg: <BagChip />, style: { left: "36%", width: "84px", animationDelay: "11.5s", animationDuration: "17.1s" } },          // 214/360
  { key: "cart2", svg: <CartChip />, style: { left: "58%", width: "78px", animationDelay: "14.9s", animationDuration: "22.8s" } },       // 287/360
  { key: "tag2", svg: <TagChip />, style: { left: "12%", width: "70px", animationDelay: "17.4s", animationDuration: "19.8s" } },         // 113/360
  { key: "card2", svg: <CardChipDark />, style: { left: "30%", width: "104px", animationDelay: "19.8s", animationDuration: "24.1s" } },  // 212/360
];

function EcommerceHeroArt() {
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

export const ecommerce: Service = {
  slug: "ecommerce",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Design in service of the sale",
  title: "Ecommerce",
  intent:
    "chadworks designs and builds ecommerce stores (WooCommerce and Shopify) around the products and the way the business actually fulfills orders.",

  answer: (
    <>
      An ecommerce site is a website whose whole job is the sale: the
      product, the cart, the checkout, and everything that gets a stranger
      to the buy button. I&apos;m Chad, I&apos;ve been building websites for
      20 years, and I&apos;ve run stores from artisan shops to a
      multi-million dollar manufacturer. I build the store around your
      products and how you actually fulfill orders, not around a theme.
    </>
  ),

  heroArt: <EcommerceHeroArt />,

  keyFactsHeading: "Ecommerce, at a glance",
  keyFacts: [
    "A store earns its design differently: every page is judged by whether it moves someone toward checkout.",
    "I've run ecommerce for businesses from artisan jewelers to a multi-million dollar manufacturing company.",
    "Platform chosen for your business, not mine: WooCommerce when you need control, Shopify when you want the upkeep handled.",
    "The store, the product data, and the customer list end up in your name. No platform hostage situations.",
  ],

  problem: {
    heading: "Why ecommerce builds fail",
    subheading: "Most stores are themes wearing a business's logo.",
    body:
      "The typical store is a purchased theme with products poured in: generic photo grids, a checkout flow nobody questioned, and product pages that read like spec sheets. It works right up until a customer compares it with a store designed to sell.",
    more: {
      trigger: "What a designed store does differently",
      paragraphs: [
        <>
          <strong>Product pages</strong>{" "}carry the weight. Real photography
          presented properly, the buying question answered before it&apos;s
          asked, and the add-to-cart visible without hunting. Amateur product
          images turn buyers off faster than price does, and I&apos;ll tell
          you if yours do.
        </>,
        <>
          <strong>Checkout</strong>{" "}is where stores quietly bleed. Every
          extra field and surprise cost loses real money. I build the
          shortest honest path from cart to paid, on rails your fulfillment
          can actually keep up with.
        </>,
        <>
          <strong>The platform bill</strong>{" "}deserves honesty. Shopify's base
          price looks small, and the monthly bill can add up as apps stack
          on. WooCommerce trades that for hosting and upkeep you control. I
          lay out both costs before you choose, because you'll live with the
          choice monthly.
        </>,
        "Whichever platform wins, the store ends up yours: the products, the customers, and the accounts, all in your name.",
      ],
    },
  },

  approach: {
    heading: "How I build it",
    steps: [
      {
        title: "Start with the catalog and the fulfillment",
        body:
          "How many products, how they vary, and how orders actually leave your building. The store gets shaped around those answers, not the other way around.",
      },
      {
        title: "Pick the platform honestly",
        body:
          "WooCommerce or Shopify, chosen on your catalog, your team, and your tolerance for upkeep, with the real monthly costs of each on the table.",
      },
      {
        title: "Design for the sale",
        body:
          "Custom design over the platform: product pages that present, a checkout that doesn't leak, and a brand that doesn't read as a theme.",
      },
      {
        title: "Launch on your accounts",
        body:
          "Payments, shipping, and the store itself configured in your name, with a real handover so your team can run daily operations.",
      },
    ],
  },

  paths: {
    heading: "The two store routes",
    intro:
      "Both end in a store that sells. The split is control versus upkeep.",
    items: [
      {
        label: "Shopify",
        detail: "The platform handles hosting, security, and updates. You run the store. Strong default for most product businesses.",
        href: "/shopify/",
        viz: <EcommerceViz />,
      },
      {
        label: "WordPress + WooCommerce",
        detail: "Full control on your own hosting. The right call for catalogs and flows Shopify boxes in.",
        href: "/wordpress/",
      },
      {
        label: "Web Design",
        detail: "Store or not, the design decides whether buyers trust you. The visual angle lives here.",
        href: "/web-design/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Real stores, real volume",
        detail: "I've used Shopify for a multi-million dollar manufacturing company and run WooCommerce for product businesses shipping today.",
      },
      {
        label: "The showroom",
        detail: "Walk through live builds and judge the craft with your own eyes.",
        href: "/showroom/",
      },
    ],
  },

  price: {
    heading: "What it costs, plainly",
    figure: BAND_FROM_BASE,
    figureSub: "Value-based -- platform costs stated before you choose",
    body:
      `Store builds are priced on what they win for your business, from the ${money(BASE)} baseline with most landing between ${LOW} and ${HIGH}. Catalog size and custom flows move the number, and you'll see it in writing before anything starts. The platform's own monthly costs get laid out at the same time, because a store bill you didn't see coming is the oldest trick in this industry.`,
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}if your product photos are weak,
        I&apos;ll tell you before we build, because no design rescues a
        store from amateur images. People will be turned off by them, and
        fixing that first is worth more than any feature.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about store builds, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "Shopify or WooCommerce?",
      a: "Tell me your catalog and your team and I'll tell you straight. Shopify wins when you want the platform headaches handled for a monthly bill. WooCommerce wins when you need control, custom flows, or to escape per-month app costs. Both are real answers; the wrong one is just expensive.",
    },
    {
      q: "Can you move my existing store without losing orders?",
      a: "Yes. Products, customers, and order history migrate, and the cutover is planned so the store doesn't go dark mid-business. I've moved stores between hosts and platforms without dropping a sale.",
    },
    {
      q: "What about payments, taxes, and shipping?",
      a: "All configured as part of the build, in your accounts: the payment processor, the tax settings, and shipping rules that match how you actually fulfill. You're not left googling 'how to connect Stripe' after launch.",
    },
    {
      q: "Will I be able to manage products myself?",
      a: "Yes, that's non-negotiable for a store. You get a real handover on adding products, processing orders, and running daily operations, and I stay reachable after.",
    },
    {
      q: "How long does a store build take?",
      a: "Longer than a marketing site, usually by a few weeks, and the real variable is product content: photos, descriptions, and prices coming from your side. I scope the timeline with you up front so nothing is a quiet surprise.",
    },
  ],

  cta: {
    heading: "Ready to sell like you mean it?",
    body: "Tell me what you sell and how orders leave your building. You'll get a straight answer on the right platform, the real costs of each, and what a store designed to sell would take.",
    buttonLabel: "Tell me about your store",
    href: "/contact/",
  },

  form: {
    source: "ecommerce page",
    subject: "New Ecommerce Inquiry -- chadworks",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "current_site", label: "Current Store or Site (if any)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "catalog_size",
        label: "How many products?",
        span: "half",
        options: [
          { value: "1-10", label: "1 - 10" },
          { value: "11-50", label: "11 - 50" },
          { value: "51-200", label: "51 - 200" },
          { value: "200+", label: "200+" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "What do you sell, and how does it ship?",
        required: true,
        rows: 4,
        placeholder: "The products, how orders get fulfilled, and anything already decided about platforms.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is this the right fit?",
    fit: [
      "You sell real products and want a store designed around them.",
      "You want the platform decision made honestly.",
    ],
    notFit: [
      "You want a theme filled in as-is. That's buyable for $60 elsewhere.",
      "The lowest bid matters more than whether the store converts.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The store, product data, and customer list live in your accounts.",
      "Every build includes two weeks of free fixes after launch.",
      "It works with a keyboard and a screen reader, because some of your visitors need it to.",
      "Nothing measures a visitor until they agree to it, and there are no ad pixels.",
      "Platform monthly costs are on the table before you choose one.",
      "You get a real operations handover, not a goodbye email.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me what you sell through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "Platform, costs, and whether your catalog needs anything special, stated plainly." },
      { title: "A scoped plan", body: "Written scope, number, and timeline before any payment." },
      { title: "Build, launch, handover", body: "The store goes live in your accounts, and your team learns to run it." },
    ],
  },

  meta: {
    title: "Ecommerce Websites -- Stores Designed to Sell | chadworks",
    description:
      "Custom ecommerce builds on WooCommerce or Shopify, designed around your products and how you actually fulfill orders. Real platform costs on the table, the store in your name, from a builder who has run multi-million dollar stores.",
  },
};
