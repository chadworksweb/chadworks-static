// Service: Show Up on ChatGPT (Visibility lane) -- the high-intent landing for
// "how do I get my business on ChatGPT". A PORT of the live niche page
// (CWS-PORT-LIST.md), re-expressed through the capsule layer: the mechanics
// (six-point scorecard, the why-invisible diagnosis, the audit-to-cited
// timeline, the founder block) carry over; the wiring does not. Pricing is the
// new flat-quote posture, NOT the old $675 number: this page funnels to the AI
// Visibility Audit (the one-time read) and AI Visibility (the retainer), and
// cross-links Advertising on ChatGPT for the paid route. Proof is anonymized
// per CWS-ARCHIVE-INTELLIGENCE until Chad clears names. Real facts only.

import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { Scorecard } from "@/components/Scorecard";
import { SearchChip, RankChip, ChatChipDark } from "@/components/art/VisibilityHeroArt";
import { ShieldChipDark, GearChip } from "@/components/art/MoreChips";

// Scatter constraint (rule 13): left% x 360 + width <= 360 per chip. Themed to
// the AI-answer subject, with two inverted chips carrying the contrast.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "chat", svg: <ChatChipDark />, style: { left: "8%", width: "150px", animationDelay: "0s", animationDuration: "25.6s" } },    // 178/360
  { key: "search", svg: <SearchChip />, style: { left: "50%", width: "150px", animationDelay: "5s", animationDuration: "23.8s" } },   // 330/360
  { key: "rank", svg: <RankChip />, style: { left: "30%", width: "118px", animationDelay: "11s", animationDuration: "28.4s" } },      // 224/360
  { key: "shield", svg: <ShieldChipDark />, style: { left: "72%", width: "82px", animationDelay: "2s", animationDuration: "24.2s" } }, // 341/360
  { key: "gear", svg: <GearChip />, style: { left: "15%", width: "94px", animationDelay: "9s", animationDuration: "21.7s" } },        // 148/360
  { key: "search2", svg: <SearchChip />, style: { left: "42%", width: "112px", animationDelay: "15s", animationDuration: "27.1s" } }, // 263/360
  { key: "rank2", svg: <RankChip />, style: { left: "63%", width: "96px", animationDelay: "19s", animationDuration: "22.5s" } },      // 323/360
  { key: "gear2", svg: <GearChip />, style: { left: "10%", width: "72px", animationDelay: "23s", animationDuration: "29.4s" } },      // 108/360
];

function ShowUpHeroArt() {
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

export const showUpOnChatgpt: Service = {
  slug: "show-up-on-chatgpt",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "Getting named in the answer",
  title: "Show Up on ChatGPT",
  intent:
    "chadworks gets a business named in AI answers: when someone asks ChatGPT, Claude, Gemini, or Perplexity who to hire, the work here is being the name that comes back.",

  answer: (
    <>
      To show up on ChatGPT you have to be readable and quotable to the AI
      crawlers. That means letting bots like GPTBot and OAI-SearchBot in,
      carrying structured data that names your business, and writing pages that
      answer the questions buyers actually ask. Most sites fail at least one of
      those and stay invisible, so the answer names a competitor instead.
      I&apos;m Chad, and the starting move is the{" "}
      <Link href="/ai-visibility-audit/">AI Visibility Audit</Link>, a documented
      read on exactly which of those is costing you. Need to be live tomorrow
      instead?{" "}
      <Link href="/advertising-on-chatgpt/">Advertising on ChatGPT</Link> is the
      faster paid route, and it can put you in front of buyers within days.
    </>
  ),

  heroArt: <ShowUpHeroArt />,

  keyFactsHeading: "Showing up on ChatGPT, at a glance",
  keyFacts: [
    "Buyers now ask an assistant who to hire, and it names one or two businesses. If the AI cannot read your site, you are not in the running.",
    "This is the organic side of AI search, sometimes called GEO. You earn the citation in the answer instead of paying for the slot beneath it.",
    "It starts with a documented audit, not a subscription: the read on why you are invisible, scored, with the fixes in priority order.",
    "Run by someone whose client results include a Pennsylvania law firm in Google's AI Overview and a tree service cited ahead of the directories in its market.",
  ],

  problemArt: (
    <Scorecard
      label="Six-point AI visibility check"
      title="Is your site invisible to AI?"
      items={[
        { strong: "AI crawlers are allowed in your robots.txt and llms.txt", small: "GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended are not blocked." },
        { strong: "Your pages carry structured data", small: "Organization, Service, and FAQ schema, not just a title tag." },
        { strong: "Your content answers real questions directly", small: "Short, quotable answers an AI can lift, not a wall of marketing copy." },
        { strong: "Your text is in the HTML, not painted by JavaScript", small: "A crawler sees your words without running scripts." },
        { strong: "Your business details match everywhere", small: "Same name, address, phone, and links across the web." },
        { strong: "You can already find yourself cited in an AI answer", small: "Ask ChatGPT a question you should win and see if you are named." },
      ]}
      verdicts={[
        { max: 0, tier: "0", text: "Tap each row that is true for your site. Most businesses can honestly check two." },
        { max: 2, tier: "low", text: "Your site is likely invisible to AI crawlers. Right now the answer names someone else." },
        { max: 4, tier: "mid", text: "Partly visible. A few fixable gaps are keeping you out of the answer." },
        { max: 5, tier: "high", text: "Close. One more signal and you are genuinely citable." },
        { max: 6, tier: "max", text: "You are built to be cited. The audit confirms it is actually happening." },
      ]}
      ctaHref="/ai-visibility-audit/"
      ctaDefault="Get the audit"
      ctaMax="Audit it anyway"
    />
  ),
  problem: {
    heading: "Why your site is invisible to AI crawlers",
    subheading: "The six checks above take sixty seconds. Here is what they are testing.",
    body:
      "When a customer asks an assistant for the best of what you do near them, your business gets named or someone else does. A lot of sites never get named because the AI cannot even read them.",
    more: {
      trigger: "The four reasons the AI skips you",
      paragraphs: [
        <>
          <strong>The crawlers are blocked at the door.</strong>{" "}Plenty of
          sites quietly block the exact bots that feed AI answers, usually by
          accident in a robots.txt copied from somewhere else. If GPTBot,
          OAI-SearchBot, ClaudeBot, and PerplexityBot cannot fetch your pages,
          you are not in the running.
        </>,
        <>
          <strong>There is no structured data to read.</strong>{" "}Without
          schema, an AI has to guess what your business is from prose. With it,
          you are a defined entity with a name, a service, an area, and reviews
          it can cite. Most small-business sites have none, or have it wired up
          wrong.
        </>,
        <>
          <strong>The content only exists after JavaScript runs.</strong>{" "}If
          your text is painted in by a script, a crawler that does not run
          scripts sees an empty page. Server-rendered HTML means the answer is
          right there in the source, which is what AI crawlers actually read.
        </>,
        <>
          <strong>Nothing on the page is quotable.</strong>{" "}AI answers lift
          short, clear statements. A page that is all slogans and stock
          photography gives it nothing to pull. Direct answers, real FAQs, and
          plain descriptions of what you do are what get quoted back to the
          person asking.
        </>,
      ],
    },
  },

  // approach is overridden in page.tsx with the ProcessCapsule timeline; this
  // step list feeds it (audit -> cited).
  approach: {
    heading: "How the work runs",
    steps: [
      {
        title: "Audit",
        body:
          "I check crawlability, structured data, content, and where you stand against the businesses already getting cited. You get a prioritized fix list and a realistic read on your market.",
      },
      {
        title: "Open the doors",
        body:
          "Fix the robots.txt and llms.txt so AI crawlers can actually reach your pages, and clear whatever is blocking them at the server level.",
      },
      {
        title: "Wire the schema",
        body:
          "Add and repair structured data so you read as a defined entity: name, services, area, and reviews, the things an AI attributes claims to.",
      },
      {
        title: "Make it quotable",
        body:
          "Rewrite key pages with direct answers and real FAQs, niched to the questions your buyers actually ask, so the AI has something worth lifting.",
      },
      {
        title: "Build presence",
        body:
          "On the retainer, this is where the monthly articles, posts, and review outreach compound your authority over time.",
      },
      {
        title: "Track and adjust",
        body:
          "Watch the citations, positions, and topics the market is asking about, then aim the next month's work where it pays.",
      },
    ],
  },

  paths: {
    heading: "The route that fits your situation",
    intro:
      "Showing up organically earns you presence, while the paid lane buys you speed. Most businesses end up using a mix of both.",
    items: [
      {
        label: "AI Visibility Audit",
        detail: "The one-time read on why you are invisible and what to fix, scored and yours to act on with anyone.",
        href: "/ai-visibility-audit/",
      },
      {
        label: "AI Visibility",
        detail: "The ongoing version: the audit, the fixes, and a monthly cycle that keeps you living in the answers month after month.",
        href: "/ai-viz/",
      },
      {
        label: "Advertising on ChatGPT",
        detail: "The sponsored slot at the bottom of the answer, for when you need to be live tomorrow and the category is eligible.",
        href: "/advertising-on-chatgpt/",
      },
      {
        label: "SEO",
        detail: "The classic discipline underneath all of it. Rankings are what AI reads before it answers.",
        href: "/seo/",
      },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "Most-cited domain in its category",
        detail:
          "After a rebuild aimed at AI visibility, a tree service became the single most-cited site for its region, ahead of directories like BBB and Angi. Real client, real result, a month being a very short window.",
      },
      {
        label: "A law firm in Google's AI Overview",
        detail:
          "The same checklist treatment put a Pennsylvania criminal-defense firm into Google's AI Overview for its practice area, with page one of classic search underneath it.",
      },
      {
        label: "The version that is not magic",
        detail:
          "Not every client cracks it fast. A Brooklyn psychologist came in nearly invisible, his content buried in accordions and an image-only homepage. A month of work took him from invisible to ready. Against entrenched legacy competitors, steady citations take longer, and I said so going in. The audit gets you ready; getting cited comes faster when we niche down to the questions you can actually win.",
      },
    ],
  },

  made: {
    eyebrow: "Made in the USA",
    heading: "Hi, I'm Chad.",
    intro:
      "I've been getting trade and service businesses found online since the MySpace days. AI search is the newest place your customers look. The work to win it is the same work I've always done, aimed at a new target.",
    manifesto: [
      { lead: "I audit it.", aside: "(At the source.)" },
      { lead: "I fix it.", aside: "(Where it's broken.)" },
      { lead: "I write it.", aside: "(To be quoted.)" },
      { lead: "I track it.", aside: "(And show you.)" },
    ],
    negation: [
      "No guarantees I can't keep.",
      "No AI-spun filler content.",
      "No black-box reports.",
      "No selling you a campaign your market won't reward.",
    ],
    close:
      "When you call, I pick up. When the audit turns up something ugly, I tell you straight.",
    img: "/people/chad-cutout.webp",
    imgAlt: "Chad Lewine, founder of chadworks, who runs the AI visibility work",
    captionMain: "I do the audit myself.",
    captionSub: "(Line by line.)",
    sig: "Chad",
    sigMeta: "chadworks - Greater Philadelphia",
  },

  price: {
    heading: "What it costs, plainly",
    figure: "Start with the audit",
    figureSub: "Priced from $315/hr, in writing before you commit",
    body:
      "Showing up on ChatGPT starts with the audit: a fixed piece of work priced from my $315 hourly rate and quoted as one flat number first. From there the fixes can be a project or an ongoing retainer, sized to what being the recommended answer is worth in your market. I'm not the cheapest option, deliberately, and there is no subscription hiding inside the audit.",
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}nobody honest guarantees a citation,
        because engines decide what to quote and they change constantly. What I
        can do is remove the reasons you are invisible and stack the signals in
        your favor, and tell you plainly if your competition is too entrenched
        to crack in a month.
      </>
    ),
  },

  faqLead:
    "Straight answers on why you're invisible, how long it takes, and what actually moves the needle.",
  faqs: [
    {
      q: "Why isn't my website showing up on ChatGPT?",
      a: "Usually because the AI cannot read you. Your robots.txt may block crawlers like GPTBot and OAI-SearchBot, you may have no structured data so the AI cannot tell what you are, or your content may be painted in by JavaScript that crawlers do not run. The audit checks each one and tells you which apply.",
    },
    {
      q: "How do I get my business to show up on ChatGPT?",
      a: "Make your site readable and quotable. Let the AI crawlers in, add structured data that names your business and what it does, write content that answers the questions people ask, and keep your details consistent across the web. Do that and you become a source the AI can cite. The audit maps exactly what is missing.",
    },
    {
      q: "How long does it take to show up in AI search?",
      a: "Longer than paid ads, and not a fixed number. Crawlability and schema fixes can register in days. Earning citations in a competitive space takes weeks of content and consistency, and against entrenched legacy competitors it can take longer or not happen in the first month. If you need to be visible tomorrow, advertising on ChatGPT is the faster route.",
    },
    {
      q: "What is llms.txt and do I need it?",
      a: "It is a plain text file at the root of your site that points AI crawlers to the content you most want them to read and cite. A newer convention, not a guarantee, but cheap to add and a clear signal about which pages matter most. It is one part of the visibility setup, never the whole job.",
    },
    {
      q: "Does schema markup help me get cited by AI?",
      a: "Yes. Structured data is how Google and now ChatGPT, Perplexity, Gemini, and Claude understand who you are, where you work, and what you do. Without it you are a name in a paragraph. With it you are an entity an AI can reference with confidence. It is one of the highest-leverage fixes in the audit.",
    },
    {
      q: "Can you guarantee my business will get cited by ChatGPT?",
      a: "No, and anyone who guarantees it is selling you something. AI engines decide what to cite and they change constantly. What I can do is remove the reasons you are invisible and stack the signals in your favor, the same way good SEO improves your odds without promising the top spot. I will also tell you honestly if your competition is too entrenched to crack in a month.",
    },
    {
      q: "What is the difference between showing up on ChatGPT and advertising on ChatGPT?",
      a: "Showing up means earning a citation in the answer itself through visibility work, which is durable and costs less over time. Advertising means paying for the sponsored slot at the bottom of the answer, which is fast but only open to certain categories. If you need speed and you are eligible, advertising on ChatGPT gets you live tomorrow.",
    },
  ],

  cta: {
    heading: "Find out if you're invisible to AI",
    body:
      "Tell me your site and what you do. I'll run the audit, show you exactly why you do or don't show up on ChatGPT yet, and give you a straight read on what's realistic in your market. No pitch, no slide deck.",
    buttonLabel: "Get the audit",
    href: "/contact/",
  },

  form: {
    source: "Show Up on ChatGPT page",
    subject: "New chadworks Inquiry - AI Visibility",
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
          { value: "invisible", label: "AI never mentions my business" },
          { value: "inconsistent", label: "I show up sometimes, inconsistently" },
          { value: "audit", label: "I want the audit first" },
          { value: "unsure", label: "Not sure what I need" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "What do you do, and where?",
        required: true,
        rows: 4,
        placeholder: "Your business, your service area, and a question a customer might ask an AI that you want to win.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is this the right move?",
    fit: [
      "Buyers in your market are starting to ask AI who to hire, and you want to be the name that comes back.",
      "You'd rather pay for a measurement than guess with a subscription.",
    ],
    notFit: [
      "You need to be live tomorrow and your category is eligible to advertise. Start with advertising on ChatGPT.",
      "You're after a free automated scan. Those exist, and they're worth what they cost.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The audit is one flat number, quoted in writing before you commit.",
      "It's yours forever, with no retainer obligation attached.",
      "Every check is explained in plain English, not jargon.",
      "If your market is too entrenched to crack soon, I'll say so before you pay for it.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me your business and market through the form here. I usually reply within a day." },
      { title: "A flat quote", body: "One number and a timeline, in writing, before you decide anything." },
      { title: "The audit runs", body: "The full checklist, run and documented against your site and your market." },
      { title: "The walkthrough", body: "You get the scored document plus a plain-English read on what to fix first." },
    ],
  },

  meta: {
    title: "Show Up on ChatGPT: Get Your Business Named in AI Answers | chadworks",
    description:
      "Show up on ChatGPT, Claude, Gemini, and Perplexity. Your site may be invisible to AI crawlers right now. chadworks audits why, fixes crawlability and schema, and builds the content that earns the citation. Starts with a flat-quoted AI Visibility Audit, priced from $315/hr.",
  },
};
