// Service: Advertising on ChatGPT (Visibility lane) -- the managed paid-placement
// page, a PORT of the live niche page (CWS-PORT-LIST.md). Re-expressed through
// the capsule layer: the mechanics carry over (the budget-burns-vs-pays-off
// compare, the eligible-vs-blocked categories, the launch timeline, the founder
// block); the wiring does not. This is a genuinely flat-fee managed product, so
// the real $675/mo management fee and the $25/day OpenAI spend floor are kept as
// hard facts (NOT the $315/hr posture -- see CWS-BUILD-LOG NEEDS-CHAD). Beta
// proof is anonymized per CWS-ARCHIVE-INTELLIGENCE. Real facts only.

import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { CompareTable } from "@/components/art/CompareTable";
import { SearchChip, RankChip, ChatChipDark } from "@/components/art/VisibilityHeroArt";
import { ShieldChipDark, GearChip } from "@/components/art/MoreChips";

// Scatter constraint (rule 13): left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "chat", svg: <ChatChipDark />, style: { left: "10%", width: "150px", animationDelay: "0s", animationDuration: "24.9s" } },    // 186/360
  { key: "rank", svg: <RankChip />, style: { left: "52%", width: "138px", animationDelay: "6s", animationDuration: "27.6s" } },       // 325/360
  { key: "search", svg: <SearchChip />, style: { left: "28%", width: "120px", animationDelay: "12s", animationDuration: "23.1s" } },  // 221/360
  { key: "gear", svg: <GearChip />, style: { left: "71%", width: "86px", animationDelay: "3s", animationDuration: "25.8s" } },        // 342/360
  { key: "shield", svg: <ShieldChipDark />, style: { left: "16%", width: "90px", animationDelay: "9s", animationDuration: "21.9s" } }, // 148/360
  { key: "rank2", svg: <RankChip />, style: { left: "44%", width: "108px", animationDelay: "16s", animationDuration: "28.7s" } },     // 266/360
  { key: "search2", svg: <SearchChip />, style: { left: "64%", width: "92px", animationDelay: "20s", animationDuration: "22.3s" } },  // 322/360
  { key: "gear2", svg: <GearChip />, style: { left: "9%", width: "74px", animationDelay: "24s", animationDuration: "29.6s" } },       // 106/360
];

function AdsHeroArt() {
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

export const advertisingOnChatgpt: Service = {
  slug: "advertising-on-chatgpt",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "ChatGPT Ads, managed",
  title: "Advertising on ChatGPT",
  intent:
    "chadworks runs managed advertising on ChatGPT: account verification, campaign build, creative, and optimization for the sponsored slot at the bottom of a ChatGPT answer.",

  answer: (
    <>
      Advertising on ChatGPT means paying to place your business in the
      sponsored slot at the bottom of a ChatGPT answer, shown to logged-in
      adults on the free and Go tiers. chadworks runs it as a managed service
      for a flat $675 a month: I verify your advertiser account, build the
      campaign, write the creative, and optimize it. You fund the ad spend
      separately, $25 a day minimum, paid straight to OpenAI, so nothing about
      your media routes through me. If your category is blocked, or you would
      rather earn the citation than pay for it, the organic route is{" "}
      <Link href="/show-up-on-chatgpt/">showing up on ChatGPT</Link>, which gets
      you cited in the answer itself over time.
    </>
  ),

  heroArt: <AdsHeroArt />,

  keyFactsHeading: "Advertising on ChatGPT, at a glance",
  keyFacts: [
    "ChatGPT runs ads in a labeled box at the bottom of its answers, shown to free and Go users and never to Plus, Pro, or Enterprise. It does not change the answer the model gives.",
    "It is genuinely fast: account verification takes a few business days, then a new ad usually clears review in about 24 hours. You can be live as soon as tomorrow.",
    "Managed for a flat $675 a month. Your ad spend is separate, starts at the $25-a-day floor, and is billed by OpenAI straight to your card, so there is no markup on your media.",
    "Run from inside the platform by someone already operating a client account in OpenAI's advertising beta, not from screenshots and press releases.",
  ],

  problemArt: (
    <CompareTable
      them="On your own"
      usLabel="Managed by chadworks"
      rows={[
        { feature: "Where the click lands", them: "A slow homepage", us: "A fast page that answers the prompt" },
        { feature: "The creative", them: "One ad for every kind of buyer", us: "Creative matched to the question being asked" },
        { feature: "The management", them: "Set a budget and walk away", us: "Watching the Ads Manager, cutting what fails" },
        { feature: "The daily spend", them: "Guessing at the number", us: "Start at the $25 floor, scale what converts" },
        { feature: "Eligibility", them: "Advertising a category OpenAI rejects", us: "Confirming you're eligible before a dollar is spent" },
      ]}
    />
  ),
  problem: {
    heading: "Where ChatGPT ad budget pays off, and where it burns",
    subheading: "The placement is fast to buy. Making it pay is the work.",
    body:
      "Switching the ad on is the easy part. The difference between budget that converts and budget that evaporates is in the details: where the click lands, what the creative says, and what gets cut when it underperforms.",
    more: {
      trigger: "How advertising on ChatGPT actually works",
      paragraphs: [
        <>
          <strong>Your ad shows inside the answer, not beside it.</strong>{" "}
          ChatGPT places ads in a labeled, lightly tinted box at the bottom of
          its reply. No sidebar, no banner, no interruption. It reads as a
          suggestion attached to the thing the person was already asking about,
          and it does not alter the answer the model gives.
        </>,
        <>
          <strong>ChatGPT picks the moment, not a keyword.</strong>{" "}There is
          no keyword auction the way Google works. Placement is matched to the
          topic of the live conversation, recent chat history, and how the
          person has engaged with ads before. The targeting is contextual, so
          the creative has to fit the context.
        </>,
        <>
          <strong>You buy it through the Ads Manager.</strong>{" "}OpenAI runs a
          self-serve Ads Manager with cost-per-click and cost-per-thousand
          bidding and no account minimum to get in the door. The daily spend
          floor is $25. I set up the verified advertiser account, build the
          campaign, and manage the bids and creative from there.
        </>,
        <>
          <strong>It is genuinely fast to launch.</strong>{" "}Verification takes
          a few business days, then a new ad usually clears review in about 24
          hours. That speed is the real appeal of advertising over organic
          visibility: you can be in front of people tomorrow instead of waiting
          out a content campaign.
        </>,
      ],
    },
  },

  // approach is overridden in page.tsx with the ProcessCapsule timeline.
  approach: {
    heading: "How a managed campaign runs",
    steps: [
      {
        title: "Confirm eligibility",
        body:
          "Before anything else, I confirm your category is allowed to advertise so we don't hit a wall at verification. If it's blocked, I'll point you to the organic route instead.",
      },
      {
        title: "Set up the account",
        body:
          "I handle the verified advertiser account with you: a real business entity, tax ID, and address. It lives in your name with your card on file.",
      },
      {
        title: "Build the campaign",
        body:
          "Campaign structure built in the OpenAI Ads Manager, with CPC or CPM bidding set to chase the outcome you actually want.",
      },
      {
        title: "Write the creative",
        body:
          "Ad copy written to match the prompts real buyers type, not one generic ad bolted onto every conversation.",
      },
      {
        title: "Launch and monitor",
        body:
          "Live as soon as tomorrow, then I watch the Ads Manager, manage the bids, and cut what isn't converting.",
      },
      {
        title: "Report monthly",
        body:
          "A plain report you can actually read, no dashboard homework, showing what ran and what it returned.",
      },
    ],
  },

  paths: {
    heading: "The route that fits your situation",
    intro:
      "Advertising buys you speed, while the organic lane earns you durable presence. Most businesses end up using a mix of both.",
    items: [
      {
        label: "Show Up on ChatGPT",
        detail: "The organic route: earn a citation in the answer itself, the only way in for blocked categories.",
        href: "/show-up-on-chatgpt/",
      },
      {
        label: "AI Visibility",
        detail: "The ongoing service that keeps you in AI answers and the classic search underneath them.",
        href: "/ai-viz/",
      },
      {
        label: "Digital Marketing",
        detail: "The honest channel triage, for when paid ChatGPT placement is one piece of a bigger question.",
        href: "/digital-marketing/",
      },
      {
        label: "Web Design",
        detail: "A site worth sending paid clicks to. A fast page that answers the prompt is half the battle in any paid campaign.",
        href: "/web-design/",
      },
    ],
  },

  proof: {
    heading: "Why trust me with this",
    items: [
      {
        label: "Operating inside the advertising beta",
        detail:
          "I run a live client account in OpenAI's advertising beta, so I see the paid side of AI answers from the inside, not from screenshots or a press release.",
      },
      {
        label: "Twenty years of running campaigns",
        detail:
          "ChatGPT ads are new. The discipline of matching creative to intent, watching what converts, and cutting what doesn't is the same work I've done since the MySpace days.",
      },
      {
        label: "No markup, account in your name",
        detail:
          "Your spend is billed by OpenAI straight to your card and never routes through me. The account stays in your name, so there's no question about where your money went.",
      },
    ],
  },

  made: {
    eyebrow: "Made in the USA",
    heading: "Hi, I'm Chad.",
    intro:
      "I've been building and marketing websites for trade and service businesses since the MySpace days. ChatGPT ads are new, but the discipline behind running them well has not changed at all.",
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
      "When you call, I pick up. If your category can't advertise, I'll tell you straight before you spend a single dollar.",
    img: "/people/chad-cutout.webp",
    imgAlt: "Chad Lewine, founder of chadworks, who manages your ChatGPT advertising",
    captionMain: "It's me. I run the ads.",
    captionSub: "(Not a media-buying floor.)",
    sig: "Chad",
    sigMeta: "chadworks - Greater Philadelphia",
  },

  price: {
    heading: "What it costs, plainly",
    figure: "$675 / mo",
    figureSub: "Managed ChatGPT Ads, your account, your name",
    body:
      "The flat $675 a month covers advertiser-account verification, the campaign build, the ad creative, ongoing optimization, and a monthly report you can actually read. Your ad spend is separate: it starts at the $25-a-day minimum and is billed by OpenAI straight to your card, so there's no markup on your media and no question about where your money went.",
    disclaimer: (
      <>
        <strong>Heads up:</strong>{" "}the $675 covers the management. What you
        spend on ads is your call and tracks the results we see. Eligibility
        depends on your category, and we confirm it before launch. Nothing here
        is a formal quote, and the real numbers come after a quick consult call.
      </>
    ),
  },

  faqLead:
    "Straight answers on cost, eligibility, speed, and how the placement really works.",
  faqs: [
    {
      q: "How much does it cost to advertise on ChatGPT?",
      a: "Two numbers, kept separate on purpose. I manage your ChatGPT advertising for a flat $675 a month. Your ad spend is its own line, paid directly to OpenAI from your card, starting at the $25-a-day minimum. The fee covers setup, verification, the campaign build, the creative, and monthly optimization. The spend is yours and you control it.",
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
      a: "The daily floor is $25, billed by OpenAI directly to your card. That spend never routes through chadworks. You can start at the floor, watch what converts in the Ads Manager, and scale from there.",
    },
    {
      q: "Do I need my own OpenAI advertiser account?",
      a: "Yes, and it has to be a verified business entity with a tax ID and a real business address, similar to setting up Google Ads or Meta Business. I handle the setup with you and run the account, but it lives in your name and your card is the one on file.",
    },
    {
      q: "What is the difference between advertising on ChatGPT and showing up organically?",
      a: "Advertising is paid placement you can switch on tomorrow if your category is allowed. Showing up organically means earning a citation in the answer itself, which costs less over time but takes weeks of crawlability, schema, and content work. If you want speed, advertise. If you want durable presence, do the visibility work. Most businesses end up doing both.",
    },
  ],

  cta: {
    heading: "Want to start advertising on ChatGPT?",
    body:
      "Tell me your business type and what you sell. I'll confirm you're eligible, sketch the campaign, and tell you what to expect once it's live. No pitch, no slide deck.",
    buttonLabel: "Start managed ChatGPT Ads",
    href: "/contact/",
  },

  form: {
    source: "Advertising on ChatGPT page",
    subject: "New chadworks Inquiry - ChatGPT Advertising",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "tel", name: "phone", label: "Phone", autocomplete: "tel", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      {
        kind: "select",
        name: "category",
        label: "Your Category",
        span: "half",
        options: [
          { value: "consumer-local", label: "Consumer or local business" },
          { value: "retail-dtc", label: "Retail, ecommerce, or DTC" },
          { value: "regulated", label: "Financial, health, or legal" },
          { value: "unsure", label: "Not sure if I'm eligible" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "What do you sell, and where?",
        required: true,
        rows: 4,
        placeholder: "A line or two about your business and the customer you want in front of.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Can your business advertise on ChatGPT?",
    fitLabel: "Clear to advertise",
    fit: [
      "Household and consumer goods, retail, ecommerce, and direct-to-consumer brands.",
      "Local services and trades, travel and experiences, digital products and education.",
    ],
    notLabel: "Off-limits at any budget",
    notFit: [
      "Dating and adult content, alcohol and tobacco, gambling, recreational drugs, and political content.",
      "Financial services, healthcare, and legal services are gated for paid placement. Those earn their way in through showing up on ChatGPT instead.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "Eligibility is confirmed before a dollar is spent.",
      "The advertiser account stays in your name, with your card on file.",
      "Your media is billed by OpenAI directly, with no markup from me.",
      "If your category can't advertise, I'll say so and point you to the organic route.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "A quick consult", body: "Tell me your business and what you sell. I confirm you're eligible and answer what you need before anything starts." },
      { title: "The account", body: "We set up the verified advertiser account in your name. Verification takes a few business days." },
      { title: "The campaign", body: "I build the structure, write the creative to match real prompts, and set the bids." },
      { title: "Live and reported", body: "Ads usually clear review in about 24 hours, then I run, optimize, and report it monthly." },
    ],
  },

  meta: {
    title: "Advertising on ChatGPT: Managed ChatGPT Ads, Done For You | chadworks",
    description:
      "Managed advertising on ChatGPT: account verification, campaign build, creative, and optimization for the sponsored slot at the bottom of a ChatGPT answer. Flat $675 a month, your ad spend separate at the $25-a-day OpenAI floor. Run from inside OpenAI's advertising beta. Live as soon as tomorrow.",
  },
};
