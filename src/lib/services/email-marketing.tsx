// Service: Email Marketing (Visibility lane) -- the channel you own. Real
// facts from Chad's own practice and published tips: Mailchimp free up to
// 500 contacts (his real go-to line), segment your list, don't over-send,
// buttons get pressed. Wallet protection is the differentiator. Copy in
// Chad's public voice.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { MailChip } from "@/components/art/VisibilityHeroArt";
import { TagChip, ShieldChipDark } from "@/components/art/MoreChips";
import { ButtonChip } from "@/components/art/WebDesignHeroArt";
import { HOURLY, HOURLY_RATE, MAILCHIMP_FREE_CONTACTS } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "mail", svg: <MailChip />, style: { left: "8%", width: "124px", animationDelay: "0s", animationDuration: "22s" } },        // 153/360
  { key: "shield", svg: <ShieldChipDark />, style: { left: "64%", width: "86px", animationDelay: "2.5s", animationDuration: "19.3s" } },// 316/360
  { key: "button", svg: <ButtonChip />, style: { left: "32%", width: "136px", animationDelay: "6.6s", animationDuration: "23.4s" } },   // 251/360
  { key: "tag", svg: <TagChip />, style: { left: "58%", width: "84px", animationDelay: "0.9s", animationDuration: "20.5s" } },          // 293/360
  { key: "mail2", svg: <MailChip />, style: { left: "46%", width: "96px", animationDelay: "9.9s", animationDuration: "17.9s" } },      // 262/360
  { key: "tag2", svg: <TagChip />, style: { left: "18%", width: "64px", animationDelay: "13.3s", animationDuration: "22.8s" } },        // 129/360
  { key: "shield2", svg: <ShieldChipDark />, style: { left: "76%", width: "62px", animationDelay: "16.5s", animationDuration: "18.9s" } }, // 336/360
  { key: "button2", svg: <ButtonChip />, style: { left: "4%", width: "108px", animationDelay: "19s", animationDuration: "24.4s" } },  // 122/360
];

function EmailHeroArt() {
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

export const emailMarketing: Service = {
  slug: "email-marketing",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "The channel you own",
  title: "Email Marketing",
  intent:
    "chadworks builds email marketing that earns its opens: a clean, segmented list and sends with restraint, on platforms whose costs are named up front.",

  answer: (
    <>
      Email is the one channel you own. The list is yours and no algorithm
      sits between you and the people on it. The platform can start free:
      Mailchimp costs nothing up to {MAILCHIMP_FREE_CONTACTS}{" "}contacts. I&apos;m Chad, I&apos;ve
      built websites and their email for 20 years, and the work here is
      making the channel earn its place: a clean, segmented list and
      sends people open.
    </>
  ),

  heroArt: <EmailHeroArt />,

  keyFactsHeading: "Email marketing, at a glance",
  keyFacts: [
    "You own the list. Rankings and social reach are rented from an algorithm; the email list leaves with you, whatever platform it lives on.",
    `It can start at $0. Mailchimp is free up to ${MAILCHIMP_FREE_CONTACTS} contacts, and I'll tell you when free is all you need.`,
    "Segments beat blasts. Every client list I've set up across 20 years of website builds proves it: relevance is the open rate.",
    "Restraint is the strategy. Over-sending burns a list faster than anything else, so the calendar is part of the build.",
  ],

  problem: {
    heading: "Most business email is sent to be deleted",
    subheading: "The list deserved better than the blast.",
    body:
      "Businesses collect addresses for years, then send everyone the same newsletter until the opens die. The list grows while the channel stops working, and the platform bill grows with it.",
    more: {
      trigger: "Where the channel actually breaks",
      paragraphs: [
        <>
          <strong>The list decays.</strong>{" "}Dead addresses and never-opens
          pile up, providers notice, and your legitimate sends start
          landing in spam for everyone else too.
        </>,
        <>
          <strong>Blasts bore.</strong>{" "}A customer who bought twice and a
          stranger who downloaded a PDF get the same email, so it&apos;s
          relevant to neither. Segments exist to fix exactly this.
        </>,
        <>
          <strong>Over-sending burns.</strong>{" "}Every send spends a little
          of the list&apos;s patience. Send too often and the unsubscribes
          and spam flags eat the channel from the inside.
        </>,
        "None of this needs a bigger platform plan. It needs the setup done properly once, and a calendar with some discipline in it.",
      ],
    },
  },

  approach: {
    heading: "How I build the channel",
    steps: [
      {
        title: "The list gets cleaned",
        body:
          "Dead weight comes off and the senders get authenticated, so providers trust the domain before the first real send goes out.",
      },
      {
        title: "Segments get built from behavior",
        body:
          "Repeat buyers and the merely curious each get their own slice. Relevance is the entire open rate.",
      },
      {
        title: "Sends get designed to be pressed",
        body:
          "One job per email and a button instead of a buried link. People love pressing buttons.",
      },
      {
        title: "The cadence gets a calendar",
        body:
          "A sending rhythm the list can sustain, written down. Restraint keeps the channel alive longer than any clever subject line.",
      },
    ],
  },

  paths: {
    heading: "Where email fits in the bigger picture",
    intro:
      "Email compounds best when the rest of the funnel feeds it. These are its neighbors.",
    items: [
      {
        label: "Digital Marketing",
        detail: "The honest triage on every channel, email included. Start here if you're not sure email is the gap.",
        href: "/digital-marketing/",
      },
      {
        label: "Ecommerce",
        detail: "For stores, email is revenue you already paid to acquire. The store and the list belong together.",
        href: "/ecommerce/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "The recommendation leads with the cost",
        detail:
          `Mailchimp is my go-to, and the first fact I give every client is that it's free up to ${MAILCHIMP_FREE_CONTACTS} contacts. The wallet comes first, every time.`,
      },
      {
        label: "The same advice, every time",
        detail:
          "Ask me in person or read my writing: segment your list and don't over-send. The rules don't change, because they're the ones that work.",
      },
      {
        label: "Forms that feed the list properly",
        detail:
          "I build the site forms too, so subscribers land tagged into the right segment from the first click instead of dumped into one bucket.",
      },
      {
        label: "Setups that outlive me",
        detail:
          "The platform lives in your account with the segments documented. If we ever stop working together, the channel keeps working.",
      },
    ],
  },

  // Testimonials consciously waived: no cleared client quotes for this
  // service yet (CWS-SERVICE-PAGE-CHECKLIST base 7; never invent quotes).

  price: {
    heading: "What it costs, plainly",
    figure: HOURLY_RATE,
    figureSub: "Setup as a scoped block, in writing first",
    body:
      `Email setup runs at ${money(HOURLY)} an hour as a scoped block: list cleanup, authentication, segments, templates, and the calendar, with the number in writing before we start. Ongoing sends can be scoped after, or your team can run the system themselves. It's documented for exactly that.`,
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}if your list is under {MAILCHIMP_FREE_CONTACTS}{" "}contacts,
        your platform is free and the spend here is setup only. I will
        never move you onto a paid plan you don&apos;t need.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about email marketing, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "Which platform should I use?",
      a: `Mailchimp is my go-to, and it's free up to ${MAILCHIMP_FREE_CONTACTS} contacts. Other platforms are fine too. The platform matters far less than the list hygiene and the segments, which is where the actual work is.`,
    },
    {
      q: "How often should I send?",
      a: "Less often than you think. Every send spends some of the list's patience, and over-sending burns a list faster than anything else. The calendar gets set to what your business can sustain with quality.",
    },
    {
      q: "Can you write the emails?",
      a: "Yes, matched to your voice, or I can set up the system and templates so your team writes them. Either way the structure that gets emails opened and pressed is built in.",
    },
    {
      q: "Is email still worth doing?",
      a: "It's the only channel you own outright. Algorithms change, rankings move, ad costs climb, and the inbox keeps being the inbox. For businesses with repeat customers it's usually the highest-return channel on the menu.",
    },
    {
      q: "Why do my emails land in spam?",
      a: "Usually unauthenticated sending domains and a decayed list. Providers score senders the way banks score credit. The cleanup and authentication pass fixes the score, and the calendar keeps it healthy.",
    },
  ],

  cta: {
    heading: "Want the channel you own working?",
    body:
      "Tell me about your list, even if it's a messy export nobody has touched in a year. You'll get a straight answer on what the channel could return and what the setup takes.",
    buttonLabel: "Get the straight answer",
    href: "/contact/",
  },

  form: {
    source: "email-marketing page",
    subject: "New Email Marketing Inquiry (chadworks)",
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
          { value: "no-list", label: "No list yet, want to start one" },
          { value: "dormant", label: "Have a list, haven't sent in ages" },
          { value: "underperforming", label: "Sending, but opens are dying" },
          { value: "unsure", label: "Not sure email is my gap" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "Where does your list stand?",
        required: true,
        rows: 4,
        placeholder: "Roughly how many contacts, what platform if any, and the last time anything was sent.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is email the right move?",
    fit: [
      "You have customers worth talking to more than once.",
      "You want owned reach that compounds instead of rented impressions.",
    ],
    notFit: [
      "You want to buy a list. That burns the channel and the domain, and I won't do it.",
      "You need mass volume this week. That's advertising.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The platform and the list live in your accounts from day one.",
      "Scope and number go in writing before any payment.",
      "Segments and the calendar get documented, so your team can run it without me.",
      "If free is all your list needs, that's exactly what I'll tell you.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me where the list stands through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "What the channel could return for your business, and whether it's even your gap." },
      { title: "A scoped setup", body: "Cleanup, segments, templates, calendar, and the number, in writing before anything starts." },
      { title: "The channel runs", body: "Sends go out to people who want them, and the list stays yours." },
    ],
  },

  meta: {
    title: "Email Marketing: The Channel You Own, Built to Get Opened | chadworks",
    description:
      `Email marketing built honestly: list cleanup, real segments, authenticated sending, and a calendar with discipline. Mailchimp free up to ${MAILCHIMP_FREE_CONTACTS} contacts, and you'll hear when free is all you need. Setup at ${HOURLY_RATE}, scoped in writing. The list stays yours.`,
  },
};
