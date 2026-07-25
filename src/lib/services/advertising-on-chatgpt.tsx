// Service: Advertising on ChatGPT (/advertising-on-chatgpt/) -- the managed
// ChatGPT Ads work of art brought INTO the capsule system and reskinned to the
// global tokens (CWS directive 2026-06-16: reproduce every real section +
// mechanic faithfully, restyle to Lexend + indigo/purple, live under the global
// shell). The distinctive art carries over as bespoke sections (hero, why+chat
// with a Sponsored result, four lanes, the eligibility grid, the single pricing
// panel) plus shared capsules (MadeByCapsule, FaqCapsule, CtaCapsule). Copy is
// reproduced from the source, not paraphrased. Sibling of show-up-on-chatgpt.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { ADS_MIN_DAILY_SPEND, ADS_MONTHLY } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

export const advertisingOnChatgpt: Service = {
  slug: "advertising-on-chatgpt",
  lane: "visibility",
  laneLabel: "Visibility",
  breadcrumbParent: { label: "AI Search Visibility", href: "/ai-search-visibility/" },
  eyebrow: "ChatGPT Ads / Managed campaigns",
  title: "Advertising on ChatGPT",

  intent:
    `chadworks runs managed ChatGPT advertising for small businesses: I verify your advertiser account, build the campaign, write the creative, and manage it for a flat ${money(ADS_MONTHLY)} a month, with your ad spend paid straight to OpenAI. It gets eligible businesses into the sponsored slot as soon as tomorrow.`,

  answer: (
    <>
      Advertising on ChatGPT means paying to place your business in the sponsored
      slot at the bottom of a ChatGPT answer, shown to logged-in adults on the free
      and Go tiers. chadworks runs it as a managed service for {money(ADS_MONTHLY)} a month. You fund
      the ad spend separately, {money(ADS_MIN_DAILY_SPEND)} a day minimum, paid straight to OpenAI. If your
      category is blocked or you want durable presence instead of paid placement,
      see <Link href="/show-up-on-chatgpt/">showing up on ChatGPT</Link>.
    </>
  ),

  keyFactsHeading: "Managed ChatGPT Ads, at a glance",
  keyFacts: [
    "ChatGPT places ads in a labeled, lightly tinted box at the bottom of its reply. There is no sidebar and no banner, so it reads as a suggestion attached to the thing the person was already asking about.",
    "There is no keyword auction the way Google works. Placement is matched to the topic of the live conversation, recent chat history, and how the person has engaged with ads before, so the creative has to fit the context.",
    `OpenAI runs a self-serve Ads Manager with cost-per-click and cost-per-thousand bidding and a ${money(ADS_MIN_DAILY_SPEND)} a day spend floor billed straight to your card. It never routes through chadworks, so there is no markup on your media.`,
    "Account verification takes a few business days, then a new ad usually clears review in about 24 hours. That speed is the real appeal of advertising over organic visibility: you can be in front of people tomorrow.",
  ],

  problem: {
    heading: "Why most ChatGPT ad budgets burn out.",
    body:
      "The platform is fast to launch and easy to waste money on. The budget burns when the click lands on a slow homepage, when one ad is written for every kind of buyer, or when a category gets rejected at verification. The work is in the details: confirm eligibility first, match the creative to the question being asked, and cut what fails.",
  },

  // No timeline section on this page; the approach captures how the engagement
  // runs, derived from the lanes and the pricing block (four steps).
  approach: {
    heading: "How the managed engagement runs.",
    steps: [
      { title: "Confirm eligibility", body: "Before a dollar is spent, I check your category against what OpenAI allows and blocks, so we never hit a wall at verification." },
      { title: "Verify and build", body: "I set up your verified advertiser account in your own name, then build the campaign structure inside the OpenAI Ads Manager." },
      { title: "Write to the prompt", body: "I write the ad creative to match the real prompts your buyers type, and check that the click lands on a fast page that answers the question." },
      { title: "Run and report", body: "I manage the bids and budget against what converts, cut what fails, and send a plain monthly report. You do nothing month to month." },
    ],
  },

  proof: {
    heading: "What managed ChatGPT advertising covers.",
    items: [
      {
        label: "The placement is inside the answer",
        detail:
          "Your ad shows in a labeled, lightly tinted Sponsored box at the bottom of the reply, shown to free and Go users, never to Plus or Enterprise. It does not alter the answer the model gives.",
      },
      {
        label: "Fast to launch",
        detail:
          "Business verification takes a few business days, once. After that a new ad usually clears review in about 24 hours, so a campaign can be live as soon as tomorrow.",
      },
      {
        label: "Your spend stays yours",
        detail:
          `The ${money(ADS_MIN_DAILY_SPEND)} a day minimum is billed by OpenAI straight to your card. It never passes through me, so there is no markup on your media and no question about where your money went.`,
      },
    ],
  },

  made: {
    eyebrow: "Made in the USA",
    heading: "Hi, I'm Chad Lewine.",
    intro:
      "I've been building and marketing websites for trade and service businesses since the MySpace days. ChatGPT ads are new. The discipline behind running them well is not.",
    manifesto: [
      { lead: "I set it up.", aside: "(Your account, your name.)" },
      { lead: "I write it.", aside: "(To match real prompts.)" },
      { lead: "I run it.", aside: "(And cut what fails.)" },
      { lead: "I report it.", aside: "(In plain English.)" },
    ],
    negation: [
      "No markup on your ad spend.",
      "No offshore account farm.",
      "No locking the account away from you.",
      "No selling you ads your category can't run.",
    ],
    close:
      "When you call, I pick up, and I will tell you straight whether your category can even run.",
    img: "/people/chad-cutout.webp",
    imgAlt: "Chad Lewine, founder of chadworks, who manages your ChatGPT advertising",
    captionMain: "It's me. I run the ads.",
    captionSub: "(Not a media buying floor.)",
    sig: "Chad Lewine",
    sigMeta: "chadworks - Greater Philadelphia",
  },

  price: {
    heading: "One flat monthly fee to run, monitor, and optimize your ads.",
    figure: money(ADS_MONTHLY),
    figureSub: "Managed ChatGPT Ads, per month",
    body:
      `The flat fee covers advertiser-account verification, the campaign build, the ad creative, ongoing optimization, and a monthly report you can actually read. I run it inside your own Ads Manager so the account stays in your name. Your ad spend is separate, starting at the ${money(ADS_MIN_DAILY_SPEND)} a day minimum, billed by OpenAI straight to your card.`,
  },

  faqLead:
    "Straight answers on cost, eligibility, speed, and how the placement really works.",
  faqs: [
    {
      q: "How much does it cost to advertise on ChatGPT?",
      a: `Two numbers, kept separate on purpose. I manage your ChatGPT advertising for a flat ${money(ADS_MONTHLY)} a month. Your ad spend is its own line, paid directly to OpenAI from your card, starting at the ${money(ADS_MIN_DAILY_SPEND)} a day minimum. The fee covers setup, verification, the campaign build, the creative, and monthly optimization. The spend is yours and you control it.`,
    },
    {
      q: "Can any business advertise on ChatGPT?",
      a: "Not every business. Consumer and local categories are clear: household goods, local services, travel, digital products. A flat-no list stays off at any budget: dating and adult content, alcohol and tobacco, gambling, recreational drugs, and political content. Financial services, healthcare, and legal services are also blocked for paid placement. If you are in a blocked category, the organic route on the Show Up on ChatGPT page is how you get into the answer.",
    },
    {
      q: "How fast can my ChatGPT ad go live?",
      a: "Once your advertiser account clears verification, which takes a few business days, individual ads are usually approved within about 24 hours. A campaign can be running as soon as tomorrow. That speed is the whole reason a business in a hurry chooses advertising over the slower organic route.",
    },
    {
      q: "Do ChatGPT ads change the answer the AI gives?",
      a: "No. Ads sit in a clearly labeled, lightly tinted box at the bottom of the response, separate from the answer. The model still answers on its own. The ad is an additional placement underneath, not a thumb on the scale.",
    },
    {
      q: "Who actually sees ChatGPT ads?",
      a: "Logged-in adults on the free and Go tiers in supported countries. People paying for Plus, Pro, Business, Enterprise, or Edu see no ads at all. Your reach is the large free user base, not the paying-subscriber segment.",
    },
    {
      q: "What is the minimum I can spend on ChatGPT advertising?",
      a: `The daily floor is ${money(ADS_MIN_DAILY_SPEND)}, billed by OpenAI directly to your card. That spend never routes through chadworks. You can start at the floor, watch what converts in the Ads Manager, and scale from there.`,
    },
    {
      q: "What is the difference between advertising on ChatGPT and showing up organically?",
      a: "Advertising is paid placement you can switch on tomorrow if your category is allowed. Showing up organically means earning a citation in the answer itself, which costs less over time but takes weeks of crawlability, schema, and content work. If you want speed, advertise. If you want durable presence, do the visibility work on the Show Up on ChatGPT page. Most businesses end up doing both.",
    },
  ],

  cta: {
    heading: "Want to start advertising on ChatGPT?",
    body:
      "Tell me your business type and what you sell. I'll confirm you're eligible, sketch the campaign, and tell you what to expect once it's live. No pitch, no slide deck.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  form: {
    source: "Advertising on ChatGPT page",
    subject: "New chadworks Inquiry - ChatGPT Advertising",
    submitLabel: "Send",
    successMessage: "Thanks, got it. I'll reply within one business day.",
    fields: [
      { kind: "text", name: "name", label: "Your name", required: true, autocomplete: "name" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "tel", name: "phone", label: "Phone", required: true, autocomplete: "tel", span: "half" },
      {
        kind: "textarea",
        name: "message",
        label: "What do you sell, and where?",
        required: true,
        rows: 4,
        placeholder: "A line or two about your business and the customer you want in front of...",
      },
    ],
  },

  meta: {
    title: "Advertise on ChatGPT | chadworks",
    description:
      "Want to advertise your business on ChatGPT? Now you can. chadworks can design and manage ChatGPT ad campaigns.",
  },
};
