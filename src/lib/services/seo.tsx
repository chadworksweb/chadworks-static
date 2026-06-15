// Service: SEO (Visibility lane) -- the classic discipline, sold honestly:
// still real, still working, and now the foundation layer of AI visibility.
// The narrative routes UP into /ai-viz/ per the consolidation thesis. Proof
// leads with the Brooklyn psychologist page-one result (ANONYMIZED per
// CWS-ARCHIVE-INTELLIGENCE; phrase paraphrased, no quote, until Chad clears
// it). problemArt = the VisibilitySpectrum scale. Copy in Chad's public
// voice. Real facts only.

import type { ReactNode, CSSProperties } from "react";
import Link from "next/link";
import type { Service } from "@/lib/service";
import { VisibilitySpectrum } from "@/components/art/VisibilitySpectrum";
import { SearchChip, RankChip, ChartChip, PinChipDark } from "@/components/art/VisibilityHeroArt";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "rank", svg: <RankChip />, style: { left: "8%", width: "132px", animationDelay: "0s", animationDuration: "27.2s" } },        // 161/360
  { key: "pin", svg: <PinChipDark />, style: { left: "66%", width: "74px", animationDelay: "3s", animationDuration: "23.3s" } },      // 312/360
  { key: "search", svg: <SearchChip />, style: { left: "30%", width: "156px", animationDelay: "8s", animationDuration: "28.8s" } },   // 264/360
  { key: "chart", svg: <ChartChip />, style: { left: "58%", width: "104px", animationDelay: "1s", animationDuration: "24.1s" } },     // 313/360
  { key: "rank2", svg: <RankChip />, style: { left: "44%", width: "108px", animationDelay: "13s", animationDuration: "21.9s" } },     // 266/360
  { key: "pin2", svg: <PinChipDark />, style: { left: "20%", width: "62px", animationDelay: "17s", animationDuration: "25.7s" } },    // 134/360
  { key: "chart2", svg: <ChartChip />, style: { left: "72%", width: "90px", animationDelay: "21s", animationDuration: "29.4s" } },    // 349/360
  { key: "search2", svg: <SearchChip />, style: { left: "4%", width: "118px", animationDelay: "24s", animationDuration: "22.6s" } },  // 132/360
];

function SeoHeroArt() {
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

export const seo: Service = {
  slug: "seo",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "Still real, still working",
  title: "SEO",
  intent:
    "chadworks does classic SEO, ranking pages for the phrases buyers actually type, as the foundation layer that AI answers are built on.",

  answer: (
    <>
      SEO still works. A Brooklyn psychologist I work with ranks page one
      for the exact phrase locals type when they look for a therapist in
      his neighborhood, and that ranking now feeds the AI answers that name
      him. I&apos;m Chad, I&apos;ve spent 20 years building websites that
      rank, and the honest update is that SEO didn&apos;t die. It became
      the foundation: search engines and AI assistants decide from the same
      signals, which is why this page eventually points you at{" "}
      <Link href="/ai-viz/">AI Visibility</Link>.
    </>
  ),

  heroArt: <SeoHeroArt />,

  keyFactsHeading: "SEO, at a glance",
  keyFacts: [
    "Page one still gets the call. A Brooklyn psychologist ranks page one for his neighborhood's therapy phrase, and it took structure and patience, not tricks.",
    "Rankings now do double duty: AI assistants read ranked pages before they answer, so SEO done right is the first half of AI visibility.",
    "No link schemes and no guarantees nobody can keep. The work is structure and consistency.",
    "20 years of doing this through every Google shake-up. The fundamentals survived all of them, and the shortcuts never did.",
  ],

  problemArt: <VisibilitySpectrum />,
  problem: {
    heading: "Page one isn't the finish line anymore",
    subheading: "It's the qualifying round.",
    body:
      "Ranking used to be the whole game: reach page one and the clicks came. Now an AI reads page one before your buyer does and names who it trusts, so ranking is what gets you read at all.",
    more: {
      trigger: "Where SEO fits now",
      paragraphs: [
        <>
          <strong>Invisible</strong>{" "}is where most businesses sit, and the
          marker on the scale below sits there for a reason: not ranking
          means not read.
        </>,
        <>
          <strong>Found</strong>{" "}is what SEO buys: standing in the results
          for the phrases your buyers type. Without it, nothing downstream
          can happen, because you&apos;re not in the room.
        </>,
        <>
          <strong>Chosen</strong>{" "}is what your pages do once a human or an
          engine actually reads them. Clear answers, real proof, structure
          an engine can lift. Ranking puts you in front of that judgment.
        </>,
        <>
          <strong>Cited</strong>{" "}is the new top of the scale: being the
          business the AI names. It&apos;s built on the first two. Nobody
          honest sells it without them.
        </>,
        "That's the spectrum on this page, and it's why SEO is sold here both on its own and as the first layer of the full AI Visibility retainer.",
      ],
    },
  },

  approach: {
    heading: "How I do SEO",
    steps: [
      {
        title: "Phrases come from buyers, not tools",
        body:
          "The target list starts with what your clients actually ask and say, then gets verified against real search data. Tools confirm, they don't decide.",
      },
      {
        title: "Pages get built to answer",
        body:
          "One page, one intent, with the direct answer up top. Engines rank pages that resolve a search, not pages that circle it.",
      },
      {
        title: "Structure carries the ranking",
        body:
          "Schema, clean headings, fast loads, and internal links. The technical layer is invisible and does half the lifting.",
      },
      {
        title: "Standing gets tracked and compounded",
        body:
          "You see ranking movement as it happens, not in a quarterly mystery PDF. Then I build on the pages that are already winning.",
      },
    ],
  },

  paths: {
    heading: "Where this road leads",
    intro:
      "SEO stands on its own. It also happens to be the first half of something bigger.",
    items: [
      {
        label: "AI Visibility",
        detail: "Rankings plus the AI answers they feed: the whole stack, retained and maintained.",
        href: "/ai-viz/",
      },
      {
        label: "AI Visibility Audit",
        detail: "Not sure where you stand? Measure first. The audit scores your rankings too.",
        href: "/ai-visibility-audit/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Page one in a brutal market",
        detail:
          "A Brooklyn psychologist ranks page one for the phrase locals actually type for therapy in his neighborhood. New York mental health is as contested as local search gets.",
      },
      {
        label: "Rankings that became AI answers",
        detail:
          "That same client is now named by AI assistants. The ranking work fed it directly, which is the whole thesis of this lane.",
      },
      {
        label: "Evidence over adjectives",
        detail:
          "Clients get ranking movement reported as it lands, screenshot by screenshot. The work proves itself or it gets changed.",
      },
      {
        label: "The same method ships here",
        detail:
          "Every page on this site runs structure-first, answer-first SEO with schema underneath. I don't sell anything my own pages don't do.",
      },
    ],
  },

  /* DRAFT -- testimonials held for permission (CWS-ARCHIVE-INTELLIGENCE 7.1).
     Real quotes from the Brooklyn psychologist (P2). DO NOT SHIP until Chad
     confirms the client OK'd name + quote. Flip live by uncommenting and
     filling the attribution.

  testimonials: {
    heading: "In their words",
    items: [
      {
        quote: "I'm AI-famous thanks to you, Chad!",
        attribution: "PENDING PERMISSION (P2)",
      },
      {
        quote: "Really impressed with your work, Chad.",
        attribution: "PENDING PERMISSION (P2)",
      },
    ],
  },
  */

  price: {
    heading: "What it costs, plainly",
    figure: "$315/hr",
    figureSub: "Scoped blocks or retained, in writing first",
    body:
      "SEO runs at $315 an hour, sold as scoped project blocks or a retainer, with the scope and number in writing before we start. It's priced on what owning your phrases is worth in your market, and in most markets that's a multiple of what the work costs. I'm not the cheapest, deliberately.",
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}SEO compounds slowly. If you need the
        phone ringing this month, this is the wrong tool, and I&apos;ll
        tell you what the right one is instead of selling you this one.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about SEO, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "Does SEO still matter now that AI answers questions?",
      a: "More than before. AI assistants read ranked, well-structured pages to decide what to say, so the businesses that kept their SEO healthy are the ones in AI answers now.",
    },
    {
      q: "How long until rankings move?",
      a: "Structure and profile fixes can show movement in weeks. Competitive phrases take months, and anyone promising faster is borrowing against your trust. You see the movement as it happens either way.",
    },
    {
      q: "Do you guarantee page one?",
      a: "No, and be careful with anyone who does. Rankings are decided by an engine neither of us controls. What I control is the work, and I show it to you as it lands.",
    },
    {
      q: "Should I buy a keyword domain or a second site?",
      a: "Please don't. SEO works per domain, so a second domain starts from square one and splits your strength. One strong site beats two thin ones every time.",
    },
    {
      q: "Do you do local SEO?",
      a: "Yes, and for most service businesses local is the whole game: the map results and the neighborhood phrases. A Brooklyn psychologist ranking page one for his neighborhood's therapy phrase is that work doing its job.",
    },
    {
      q: "What about backlinks?",
      a: "Earned mentions help, and schemes hurt more than they ever helped. I don't buy links. Real profiles and directories that engines trust get set straight in the identity work.",
    },
  ],

  cta: {
    heading: "Want rankings that feed the answers?",
    body:
      "Tell me your market and the phrases you think buyers type. You'll get a straight answer on what's winnable and what winning it is worth to you.",
    buttonLabel: "Start with the straight answer",
    href: "/contact/",
  },

  form: {
    source: "seo page",
    subject: "New SEO Inquiry (chadworks)",
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
          { value: "invisible", label: "Not ranking for anything yet" },
          { value: "stuck", label: "Stuck on page two or lower" },
          { value: "slipping", label: "Used to rank, slipping now" },
          { value: "unsure", label: "Not sure where I stand" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "What should you rank for?",
        required: true,
        rows: 4,
        placeholder: "The phrases you'd want to own, the area you serve, and who keeps outranking you.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is SEO the right move?",
    fit: [
      "Your buyers type real phrases, and owning them for years beats renting clicks.",
      "You can invest months for standing that compounds instead of expiring.",
    ],
    notFit: [
      "You need leads this week. That's advertising, and I'll say so.",
      "You want a page-one guarantee. Nobody honest sells one.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "Scope and number go in writing before any payment.",
      "Ranking movement gets reported as it happens, not hidden in quarterly decks.",
      "Everything built lives on your site and your accounts. Nothing is held hostage.",
      "You get a straight answer on what's winnable before committing to any of it.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me your market and phrases through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "What's winnable in your market, and whether SEO is even the move." },
      { title: "A scoped plan", body: "Pages, phrases, timeline, and the number, in writing before anything starts." },
      { title: "The standing compounds", body: "Rankings build, you watch them land, and the wins become the base for the next ones." },
    ],
  },

  meta: {
    title: "SEO Services: Rank for the Phrases Buyers Actually Type | chadworks",
    description:
      "Classic SEO, done honestly: structure-first pages that rank for real buying phrases and feed the AI answers engines now give. Proof: a Brooklyn psychologist on page one for his neighborhood's therapy phrase, now named in AI answers. $315/hr, scoped in writing, no guarantees nobody can keep.",
  },
};
