// Service: Digital Marketing (Visibility lane) -- the broad sweep, sold as
// HONEST CHANNEL TRIAGE: which channels this business actually needs, run
// properly, and which ones to skip. Routes into the other Visibility
// services. ChatGPT-ads beta access is real (CWS-ARCHIVE-INTELLIGENCE P3,
// anonymized). Copy in Chad's public voice. Real facts only.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { ChartChip, MailChip, SearchChip } from "@/components/art/VisibilityHeroArt";
import { PostChipDark, BoltChip } from "@/components/art/MoreChips";
import { HOURLY, HOURLY_RATE } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "chart", svg: <ChartChip />, style: { left: "6%", width: "128px", animationDelay: "0s", animationDuration: "26.9s" } },     // 150/360
  { key: "post", svg: <PostChipDark />, style: { left: "56%", width: "120px", animationDelay: "4s", animationDuration: "23.6s" } },  // 322/360
  { key: "search", svg: <SearchChip />, style: { left: "28%", width: "150px", animationDelay: "9s", animationDuration: "28.4s" } },  // 251/360
  { key: "mail", svg: <MailChip />, style: { left: "68%", width: "92px", animationDelay: "2s", animationDuration: "24.7s" } },       // 337/360
  { key: "bolt", svg: <BoltChip />, style: { left: "18%", width: "72px", animationDelay: "13s", animationDuration: "21.5s" } },      // 137/360
  { key: "chart2", svg: <ChartChip />, style: { left: "44%", width: "104px", animationDelay: "16s", animationDuration: "27.7s" } },  // 262/360
  { key: "post2", svg: <PostChipDark />, style: { left: "10%", width: "88px", animationDelay: "20s", animationDuration: "22.4s" } }, // 124/360
  { key: "mail2", svg: <MailChip />, style: { left: "74%", width: "70px", animationDelay: "23s", animationDuration: "29.2s" } },     // 336/360
];

function MarketingHeroArt() {
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

export const digitalMarketing: Service = {
  slug: "digital-marketing",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "The honest channel triage",
  title: "Digital Marketing",
  intent:
    "chadworks sells digital marketing as triage: a straight answer on which channels a business actually needs, then proper work on the ones that earn their place.",

  answer: (
    <>
      Digital marketing covers every channel a business can buy attention
      on, which is exactly the problem: most businesses get sold all of
      them. What I sell is triage. I&apos;m Chad, I&apos;ve built websites
      for 20 years and watched which channels actually move for the
      businesses on them, and the work here is picking the few yours needs
      and telling you plainly which ones to skip.
    </>
  ),

  heroArt: <MarketingHeroArt />,

  keyFactsHeading: "Digital marketing, at a glance",
  keyFacts: [
    "Most businesses need fewer channels than they're sold. The expensive part of marketing is usually the part you didn't need.",
    "Search and AI answers come first for service businesses, because that's where buyers with intent already are.",
    "Every channel gets a written why: what it should return, and the date it gets reviewed or killed.",
    "The triage stays honest even when it shrinks my own invoice. Telling you what to skip is most of the value.",
  ],

  problem: {
    heading: "Marketing gets sold as a bundle of everything",
    subheading: "Your business doesn't need everything.",
    body:
      "Agencies quote the full menu because the full menu pays them best. Owners end up funding six channels at mediocre depth instead of dominating the two that fit how their buyers buy.",
    more: {
      trigger: "How the triage reads your business",
      paragraphs: [
        <>
          <strong>Where your buyers start.</strong>{" "}Someone with a burst
          pipe searches or asks an AI. Someone discovering a product
          scrolls. The channel has to match the moment of intent, or the
          spend is decoration.
        </>,
        <>
          <strong>What the math says.</strong>{" "}Every channel has a real
          cost-to-return shape for your kind of business. Some never pencil
          out at your ticket size, and it&apos;s cheaper to know that
          before the retainer than after it.
        </>,
        <>
          <strong>The load you can sustain.</strong>{" "}Channels die when
          feeding them becomes a second job nobody owns. The triage weighs
          what your business will actually keep up, not what a pitch deck
          assumes.
        </>,
        "Then the budget goes deep on the survivors instead of wide on everything, and each one carries a number and a review date.",
      ],
    },
  },

  approach: {
    heading: "How the triage works",
    steps: [
      {
        title: "The read on your buyers",
        body:
          "How people actually find and choose a business like yours: the searches, the questions, the moments of intent worth showing up in.",
      },
      {
        title: "Channels get scored against that",
        body:
          "Each candidate channel gets weighed on intent match and what it demands of you. Most don't survive, on purpose.",
      },
      {
        title: "The survivors get built properly",
        body:
          "The channels that earn their place get real setup and real craft, not a thin presence on six platforms at once.",
      },
      {
        title: "Everything carries a number",
        body:
          "Each channel gets a written expected return and a review date. Underperformers get killed in writing too.",
      },
    ],
  },

  paths: {
    heading: "The channels, sold on their own",
    intro:
      "When the triage points somewhere specific, these are the doors it points to.",
    items: [
      {
        label: "AI Search Visibility",
        detail: "The umbrella for being found and recommended: search, AI answers, and the profiles engines trust.",
        href: "/ai-search-visibility/",
      },
      {
        label: "SEO",
        detail: "Owning the phrases your buyers type, for years instead of per click.",
        href: "/seo/",
      },
      {
        label: "Email Marketing",
        detail: "The channel you own outright: the list, the segments, the sends that get opened.",
        href: "/email-marketing/",
      },
      {
        label: "Advertising on ChatGPT",
        detail: "The newest paid channel there is, explained by someone running it.",
        href: "/advertising-on-chatgpt/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Inside the ChatGPT advertising beta",
        detail:
          "I run a wildlife-removal company's campaigns inside OpenAI's advertising beta. Early access means the triage covers channels most agencies haven't even seen.",
      },
      {
        label: "The channels I won't sell you",
        detail:
          "I don't sell follower counts, and I'll say when social is a maintenance channel for your business instead of a growth one. The no is part of the service.",
      },
      {
        label: "300 plus clients of watching what works",
        detail:
          "chadworks has served over 300 clients 1:1 since launching in 2011. The triage is pattern recognition from all of them, applied to yours.",
      },
      {
        label: "Recommendations with receipts",
        detail:
          "Every channel call comes with the why written down, so you can hold the plan accountable.",
      },
    ],
  },

  // Testimonials consciously waived: no cleared client quotes for this
  // service yet (CWS-SERVICE-PAGE-CHECKLIST base 7; never invent quotes).

  price: {
    heading: "What it costs, plainly",
    figure: HOURLY_RATE,
    figureSub: "The triage is billable, and it's the point",
    body:
      `The triage itself is billable time at ${money(HOURLY)} an hour, because it's the most valuable thing I do: it's the difference between funding the two channels that fit your buyers and funding six that don't. Ongoing channel work gets scoped in writing after it, and only for the channels that survived.`,
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}free marketing strategy is a sales
        call wearing a costume. The advice points wherever the agency makes
        its margin. Paid triage answers to you, and that&apos;s the entire
        difference.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about digital marketing, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "Do I need social media?",
      a: "Probably alive, probably not viral. Engines and buyers both check that your profiles exist and match your business, so maintenance matters. Follower-chasing rarely pencils out for service businesses, and I'll tell you which side of that line you're on.",
    },
    {
      q: "What channels do you actually run?",
      a: "Search and AI visibility, email, your site itself, and paid placement inside the ChatGPT advertising beta. If the triage points somewhere I don't run, I'll help you hire it.",
    },
    {
      q: "Why pay for strategy?",
      a: "Because answering it properly takes the same judgment the work does. A triage looks at your buyers and your numbers, and stays honest because you're paying for it.",
    },
    {
      q: "Can you just run my ads?",
      a: "If the triage says ads, yes, with a budget and a kill date in writing. If it says your money works harder somewhere else, you'll hear that instead.",
    },
    {
      q: "How do you report?",
      a: "As it happens, in plain language. Clients get the actual movement, screenshots included, not a quarterly deck built to justify the retainer.",
    },
  ],

  cta: {
    heading: "Want the straight answer on your channels?",
    body:
      "Tell me your business and what you're spending on now. You'll get a plain answer on which channels deserve your money and which ones are decoration.",
    buttonLabel: "Get the triage",
    href: "/contact/",
  },

  form: {
    source: "digital-marketing page",
    subject: "New Digital Marketing Inquiry (chadworks)",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "current_site", label: "Your Website", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "situation",
        label: "The Situation",
        span: "half",
        options: [
          { value: "scattered", label: "Spending on several channels, unsure what works" },
          { value: "starting", label: "Starting from zero marketing" },
          { value: "agency", label: "Have an agency, want a second opinion" },
          { value: "unsure", label: "Not sure what I need" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "What are you doing now?",
        required: true,
        rows: 4,
        placeholder: "The channels you're paying for, roughly what they cost, and what you honestly think they return.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is the triage the right move?",
    fit: [
      "You want one straight answer instead of six vendor pitches.",
      "You're ready to fund the surviving channels properly once the triage picks them.",
    ],
    notFit: [
      "You've already decided you need everything. The triage will frustrate you.",
      "Price is the only lens. Cheap marketing is the most expensive kind a business can buy.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "Every recommendation comes with the why in writing.",
      "Channels get review dates, and underperformers get killed instead of defended.",
      "Your accounts and your data. Nothing hidden from you.",
      "The triage answers to you, including when the answer shrinks my invoice.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me what you're doing and spending now through the form here. I usually reply within a day." },
      { title: "The triage", body: "Your channels scored against how your buyers actually buy, with the why for each call." },
      { title: "A scoped plan", body: "The surviving channels, their budgets, their review dates, and the number, in writing." },
      { title: "Deep, not wide", body: "The work goes deep on the channels that earned it, and you watch the numbers as they land." },
    ],
  },

  meta: {
    title: "Digital Marketing: Honest Channel Triage, Not the Full Menu | chadworks",
    description:
      `Digital marketing sold as triage: a paid, straight answer on which channels your business actually needs, then proper work on the survivors. Search and AI visibility come first; follower-chasing never makes the list. Run by someone working inside OpenAI's ChatGPT advertising beta. ${HOURLY_RATE}, every call in writing.`,
  },
};
