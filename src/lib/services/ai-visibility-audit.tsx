// Service: AI Visibility Audit (Visibility lane) -- the ONE-TIME read,
// distinct from the ongoing AI Visibility retainer. The deliverable IS the
// GEO checklist (CWS-GEO-CHECKLIST.md sections 0-8), run against the
// client's site and scored. problemArt = the interactive Scorecard (the
// audit is the demo). Copy in Chad's public voice. Real facts only.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { Scorecard } from "@/components/Scorecard";
import { SearchChip, RankChip, ChatChipDark } from "@/components/art/VisibilityHeroArt";
import { ShieldChipDark, GearChip } from "@/components/art/MoreChips";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "search", svg: <SearchChip />, style: { left: "6%", width: "160px", animationDelay: "0s", animationDuration: "26.4s" } },     // 182/360
  { key: "chat", svg: <ChatChipDark />, style: { left: "54%", width: "144px", animationDelay: "4s", animationDuration: "23.5s" } },    // 338/360
  { key: "rank", svg: <RankChip />, style: { left: "28%", width: "126px", animationDelay: "10s", animationDuration: "28.2s" } },       // 227/360
  { key: "shield", svg: <ShieldChipDark />, style: { left: "70%", width: "84px", animationDelay: "2s", animationDuration: "24.6s" } }, // 336/360
  { key: "gear", svg: <GearChip />, style: { left: "16%", width: "92px", animationDelay: "8s", animationDuration: "21.3s" } },         // 150/360
  { key: "search2", svg: <SearchChip />, style: { left: "40%", width: "118px", animationDelay: "14s", animationDuration: "27.4s" } },  // 262/360
  { key: "rank2", svg: <RankChip />, style: { left: "62%", width: "98px", animationDelay: "18s", animationDuration: "22.8s" } },       // 321/360
  { key: "gear2", svg: <GearChip />, style: { left: "10%", width: "70px", animationDelay: "22s", animationDuration: "29.1s" } },       // 106/360
];

function AuditHeroArt() {
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

export const aiVisibilityAudit: Service = {
  slug: "ai-visibility-audit",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "The one-time measurement",
  title: "AI Visibility Audit",
  intent:
    "chadworks sells a one-time AI visibility audit: a documented, scored read on where a business stands in AI answers and classic search, plus the profiles engines cross-check.",

  answer: (
    <>
      The AI Visibility Audit is a one-time, documented read on where your
      business stands in AI answers and classic search, plus the profiles
      engines cross-check before they recommend anyone. You get the full
      checklist run against your site, scored, with the fixes in priority
      order. It&apos;s yours to act on with anyone, including me. I&apos;m
      Chad, I&apos;ve spent 20 years building websites that get found, and
      this is the same first step every retained client gets, sold on its
      own.
    </>
  ),

  heroArt: <AuditHeroArt />,

  keyFactsHeading: "The audit, at a glance",
  keyFacts: [
    "One-time and self-contained: a documented pass over search standing, AI answers, schema, profiles, and page structure, scored check by check.",
    "The checklist is the deliverable. It's the same gate every page on this site passes before it ships, run against yours.",
    "No retainer hides inside it. Act on it with your own developer or with me, on your own time. The audit doesn't expire and doesn't obligate you.",
    "Run by someone whose client results include a law firm in Google's AI Overview and a psychologist named in AI answers. Same checklist, run on yours.",
  ],

  problemArt: (
    <Scorecard
      label="The quick version"
      title="Six checks, sixty seconds"
      items={[
        { strong: "AI assistants mention you", small: "Ask ChatGPT who does what you do in your area. Are you in the answer?" },
        { strong: "Page one for a buying phrase", small: "Not your business name. A phrase a stranger would actually type." },
        { strong: "Your Google Business Profile is current", small: "Hours, photos, services, reviews answered." },
        { strong: "Your pages answer questions directly", small: "An engine can lift a clean answer from your copy." },
        { strong: "Your site carries valid schema", small: "The structured data engines read before your prose." },
        { strong: "Your social presence looks alive", small: "Alive, not viral: recent activity that matches your business." },
      ]}
      verdicts={[
        { max: 0, tier: "0", text: "Tap what's true today. Most businesses can honestly check two." },
        { max: 2, tier: "low", text: "You're close to invisible where buyers now ask. The full audit shows exactly where the gaps are and which ones matter first." },
        { max: 4, tier: "mid", text: "A real base. The unchecked rows are usually the ones standing between you and AI answers." },
        { max: 5, tier: "high", text: "Strong. One gap left, and at this level it's usually schema or answer-shaped copy." },
        { max: 6, tier: "max", text: "All six? You're ahead of nearly every competitor. The audit becomes proof, and maintenance." },
      ]}
      ctaHref="/contact/"
      ctaDefault="Get the full audit"
      ctaMax="Get the audit that proves it"
    />
  ),
  problem: {
    heading: "Most businesses are guessing about their visibility",
    subheading: "The six checks below take sixty seconds.",
    body:
      "Owners hear that AI is answering their buyers now and feel behind, but nobody has shown them where they actually stand. The fix starts with a measurement, not a subscription.",
    more: {
      trigger: "What the audit actually measures",
      paragraphs: [
        <>
          <strong>Your standing.</strong> Where you appear today: classic
          rankings for real buying phrases, AI answers for the questions
          your market asks, and the map results local buyers see first.
        </>,
        <>
          <strong>The structure underneath.</strong> Whether an engine can
          read your pages at all: schema, headings, answer-shaped copy, and
          the performance scores engines treat as trust signals.
        </>,
        <>
          <strong>Every identity cross-check.</strong> Your Google Business
          Profile, your reviews, your socials, and the site they should all
          match. Engines verify before they recommend, the same way buyers
          do.
        </>,
        "Every check lands as pass or fail with the why in plain English. No mystery scores, no scare tactics.",
      ],
    },
  },

  approach: {
    heading: "How the audit runs",
    steps: [
      {
        title: "You tell me your market",
        body:
          "The area you serve and the phrases you think buyers type. An hour of your time, none of your passwords.",
      },
      {
        title: "I run the full checklist",
        body:
          "Search standing, AI answers, schema, profiles, page structure, and performance, documented as I go.",
      },
      {
        title: "You get the scored audit",
        body:
          "Every check marked pass or fail, with the fixes ranked by what moves your visibility first.",
      },
      {
        title: "You decide what happens next",
        body:
          "Run the fixes yourself or have me do them. The audit stands on its own either way.",
      },
    ],
  },

  paths: {
    heading: "If you already know you want more",
    intro:
      "The audit is the measurement. These are the doors it usually opens.",
    items: [
      {
        label: "AI Visibility",
        detail: "The ongoing version: the audit plus the fixes plus the monthly cycle that keeps you in the answers.",
        href: "/ai-viz/",
      },
      {
        label: "SEO",
        detail: "When the audit shows the gap is classic rankings, this is the discipline that closes it.",
        href: "/seo/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "The same checks behind the AI Overview win",
        detail:
          "The Pennsylvania law firm now in Google's AI Overview got the same checklist treatment: the same checks and the same priority order, run on its market.",
      },
      {
        label: "This site passes it",
        detail:
          "Every page on this site ships only after the same checklist passes. The audit you buy is the gate I hold my own work to.",
      },
    ],
  },

  // Testimonials consciously waived: no cleared client quotes for this
  // service yet (CWS-SERVICE-PAGE-CHECKLIST base 7; never invent quotes).

  price: {
    heading: "What it costs, plainly",
    figure: "One flat number",
    figureSub: "Priced from $315/hr, in writing before you commit",
    body:
      "The audit is a fixed piece of work priced from my $315 hourly rate and quoted as one flat number before you commit. The number depends on the size of your site and your market, and it goes in writing first. No subscription hides inside it, and nothing renews.",
    disclaimer: (
      <>
        <strong>Straight up:</strong> the audit might tell you things are
        mostly fine. When that happens you&apos;ll know exactly which two or
        three fixes matter, and you won&apos;t need a retainer. That outcome
        counts as a win, and it does happen.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about the audit, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "What do I actually receive?",
      a: "A scored, documented checklist: every check pass or fail with the why in plain English, and the fixes in order. It reads like a punch list, not a research paper.",
    },
    {
      q: "Is this an automated report?",
      a: "No. Tools are involved, but every check gets read and judged against your actual market by me. Automated reports are the reason owners stopped trusting audits.",
    },
    {
      q: "Do I have to hire you for the fixes?",
      a: "No. The audit is yours, and it's written so any competent developer can act on it. Taking it in-house is the design, not a loophole.",
    },
    {
      q: "How is this different from a free SEO audit?",
      a: "Free audits are lead magnets: automated and built to scare you toward a retainer. This one is paid and stands alone, so it doesn't expire when you say no thanks.",
    },
    {
      q: "How long does it take?",
      a: "The timeline comes with the flat quote, and it's measured in days, not months. You'll know both numbers before you commit.",
    },
  ],

  cta: {
    heading: "Want the honest measurement?",
    body:
      "Tell me your business and market. You'll get a flat quote and a plain answer on whether the audit is what you need.",
    buttonLabel: "Get your audit quoted",
    href: "/contact/",
  },

  form: {
    source: "ai-visibility-audit page",
    subject: "New AI Visibility Audit Inquiry (chadworks)",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "current_site", label: "Your Website", required: true, placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "situation",
        label: "The Situation",
        span: "half",
        options: [
          { value: "audit-only", label: "Just the audit, for now" },
          { value: "audit-then-fixes", label: "Audit, then likely the fixes" },
          { value: "agency-compare", label: "Comparing this to an agency audit" },
          { value: "unsure", label: "Not sure this is what I need" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "What's your market?",
        required: true,
        rows: 4,
        placeholder: "What you do, the area you serve, and what happens today when you search for it.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is the audit the right move?",
    fit: [
      "You want the real picture before spending another dollar on marketing.",
      "You'd rather pay for a measurement than guess with a subscription.",
    ],
    notFit: [
      "You already know you want ongoing work. Start at AI Visibility and the audit comes with it.",
      "You're after a free automated scan. Those exist, and they're worth what they cost.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "One flat number, quoted in writing before you commit.",
      "The audit is yours forever, with no retainer obligation attached.",
      "Every check explained in plain English, not jargon.",
      "If the audit isn't what you need, I'll say so before you pay for it.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me your business and market through the form here. I usually reply within a day." },
      { title: "A flat quote", body: "One number and a timeline, in writing, before you decide anything." },
      { title: "The audit runs", body: "The full checklist, run and documented against your site and your market." },
      { title: "The walkthrough", body: "You get the scored document plus a plain-English walkthrough of what matters first." },
    ],
  },

  meta: {
    title: "AI Visibility Audit: A Scored Read on Your Search and AI Standing | chadworks",
    description:
      "A one-time, documented AI visibility audit: where your business stands in ChatGPT answers, Google's AI Overview, classic rankings, schema, and profiles, scored with fixes in priority order. Flat quote up front, yours to act on with anyone. No retainer hidden inside.",
  },
};
