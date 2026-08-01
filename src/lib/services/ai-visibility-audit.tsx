// Service: AI Visibility Audit (Visibility lane) -- the ONE-TIME read,
// distinct from the ongoing AI Visibility retainer. The deliverable IS the
// GEO checklist (CWS-GEO-CHECKLIST.md sections 0-8), run against the
// client's site and scored. problemArt = the interactive Scorecard (the
// audit is the demo). Copy in Chad's public voice. Real facts only.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { Scorecard } from "@/components/Scorecard";
import { SearchChip, ChatChipDark } from "@/components/art/VisibilityHeroArt";
// RankChip (the "#1 result" card) is deliberately NOT used here: this audit
// does not cover Google rankings, so the hero art must not imply it.
import { PromptChip } from "@/components/art/AiSearchHeroArt";
import { ShieldChipDark, GearChip } from "@/components/art/MoreChips";
import { LaunchLink } from "@/components/LaunchLink";
import { HOURLY, HOURLY_RATE } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "search", svg: <SearchChip />, style: { left: "6%", width: "160px", animationDelay: "0s", animationDuration: "21.8s" } },     // 182/360
  { key: "chat", svg: <ChatChipDark />, style: { left: "54%", width: "144px", animationDelay: "3.3s", animationDuration: "19.4s" } },    // 338/360
  { key: "prompt", svg: <PromptChip />, style: { left: "28%", width: "126px", animationDelay: "8.3s", animationDuration: "23.3s" } },       // 227/360
  { key: "shield", svg: <ShieldChipDark />, style: { left: "70%", width: "84px", animationDelay: "1.6s", animationDuration: "20.3s" } }, // 336/360
  { key: "gear", svg: <GearChip />, style: { left: "16%", width: "92px", animationDelay: "6.6s", animationDuration: "17.6s" } },         // 150/360
  { key: "search2", svg: <SearchChip />, style: { left: "40%", width: "118px", animationDelay: "11.5s", animationDuration: "22.6s" } },  // 262/360
  { key: "prompt2", svg: <PromptChip />, style: { left: "62%", width: "98px", animationDelay: "14.9s", animationDuration: "18.8s" } },       // 321/360
  { key: "gear2", svg: <GearChip />, style: { left: "10%", width: "70px", animationDelay: "18.1s", animationDuration: "24s" } },       // 106/360
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
    "chadworks sells a one-time AI visibility audit: a documented, scored read on where a business stands in AI answers, including the mentions, citations, and profiles the assistants cross-check.",

  answer: (
    <>
      The AI Visibility Audit is a one-time deep dive into how your business
      is showing up on AI platforms like ChatGPT and the signals driving (or
      not driving) the current level of visibility. This includes measuring
      mentions and citations across a series of relevant prompts. A formal
      report with current status and a list of actionable steps is delivered
      at the end of the audit.
    </>
  ),

  heroArt: <AuditHeroArt />,

  keyFactsHeading: "The audit, at a glance",
  keyFacts: [
    "One-time and self-contained: a documented pass over AI answers, mentions and citations, schema, social profiles, business directories, and page structure, scored check by check.",
    "The parts of the audit service are 1) a process I perform, mostly autonomously, and 2) a formal document I deliver.",
    <>
      There is no commitment beyond the audit itself. You are not required to
      have me execute the actions suggested in the audit, but if you&apos;d
      like me to, please check out my{" "}
      <LaunchLink href="/ai-search-visibility/">
        AI Search Visibility
      </LaunchLink>{" "}
      service.
    </>,
    "In 2026 alone I've had several clients go from not being found to being surfaced on the first results of a non-branded prompt.",
  ],

  problemArt: (
    <Scorecard
      layout="split"
      label="quick check"
      title="AI Visibility Preliminary Audit"
      blurb="Use this checklist to get a loose idea of where you actually stand right now when it comes to your brand's AI search visibility."
      items={[
        { strong: "AI assistants mention you", small: "Ask ChatGPT who does what you do in your area. Are you in the answer?" },
        { strong: "Something outside your site names you", small: "A directory, a forum thread, a press mention. Assistants lean on sources you don't own." },
        { strong: "Your Google Business Profile is current", small: "Hours, photos, services, reviews answered." },
        { strong: "Your pages answer questions directly", small: "An engine can lift a clean answer from your copy." },
        { strong: "Your site carries valid schema", small: "The structured data engines read before your prose." },
        { strong: "Your social presence looks alive", small: "Alive, not viral: recent activity that matches your business." },
        { strong: "Your details match everywhere they appear", small: "Same name, same services, same address. Assistants cross-check before they recommend." },
        { strong: "Your industry's directories list you", small: "Trade lists, association pages, and local directories get cited constantly." },
      ]}
      verdicts={[
        // Empty on purpose: no verdict shows until something is tapped.
        { max: 0, tier: "0", text: "" },
        // Every string is written to land inside the three-line box the split
        // layout reserves. Keep new ones under ~110 characters.
        { max: 3, tier: "low", text: "You're close to invisible where buyers now ask. The audit shows the gaps and which ones matter first." },
        { max: 5, tier: "mid", text: "A real base. The unchecked rows are usually what stands between you and the AI answers." },
        { max: 7, tier: "high", text: "Strong. The last gaps at this level are usually schema or answer-shaped copy." },
        { max: 8, tier: "max", text: "All eight? You're ahead of nearly every competitor. The audit becomes proof, and maintenance." },
      ]}
      ctaHref="/contact/"
      ctaDefault="Get the full audit"
      ctaMax="Get the audit that proves it"
    />
  ),
  problem: {
    heading: "Most businesses are guessing about their visibility",
    subheading: "Don't leave it up to chance.",
    body:
      "Owners hear that AI is answering their buyers now and feel behind, but nobody has shown them where they actually stand. The fix starts with a measurement, not a subscription.",
    more: {
      trigger: "What the audit actually measures",
      paragraphs: [
        <>
          <strong>Your standing.</strong>{" "}Where you appear today across a
          series of prompts your market would actually ask: which assistants
          name you, which name a competitor instead, and what they cite when
          they do.
        </>,
        <>
          <strong>The structure underneath.</strong>{" "}Whether an engine can
          read your pages at all: schema, headings, answer-shaped copy, and
          the performance scores engines treat as trust signals.
        </>,
        <>
          <strong>Every identity cross-check.</strong>{" "}Your Google Business
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
          "The area you serve and the questions you think buyers ask. An hour of your time, none of your passwords.",
      },
      {
        title: "I run the full checklist",
        body:
          "AI answers, mentions and citations, schema, profiles, page structure, and performance, documented as I go.",
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
        label: "AI Search Visibility",
        detail: "The ongoing version: the audit plus the fixes plus the monthly cycle that keeps you in the answers.",
        href: "/ai-search-visibility/",
      },
      {
        label: "SEO",
        detail: "Ranking in Google is its own discipline, and a foundation the AI assistants read from. The audit doesn't cover it; this is where it gets handled.",
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
    figureSub: `Priced from ${HOURLY_RATE}, in writing before you commit`,
    body:
      `The audit is a fixed piece of work priced from my ${money(HOURLY)} hourly rate and quoted as one flat number before you commit. The number depends on the size of your site and your market, and it goes in writing first. No subscription hides inside it, and nothing renews.`,
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}the audit might tell you things are
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

  // The hero hands off DOWN the page instead of out to the contact form.
  heroCta: { href: "#key-facts", buttonLabel: "Explore the Audit", arrow: "down" },

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
        placeholder: "What you do, the area you serve, and what happens today when you ask ChatGPT about it.",
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
    title: "AI Visibility Audit by chadworks™",
    description:
      "The chadworks™ AI Visibility Audit will tell you what's working, what's not and what you need to improve your AI citations and mentions.",
  },
};
