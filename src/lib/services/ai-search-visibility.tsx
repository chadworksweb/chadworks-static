// Service: AI Search Visibility (Visibility lane) -- THE UMBRELLA. Sold as an
// ongoing retained service; the GEO checklist is the spine ("the checklist
// is the deliverable"). Proof leads: the Pennsylvania criminal-defense firm
// in Google's AI Overview and the Brooklyn psychologist named in AI answers
// (both ANONYMIZED per CWS-ARCHIVE-INTELLIGENCE until Chad clears names).
// Copy in Chad's public voice. Real facts only.

import type { Service } from "@/lib/service";
import { AiSearchHeroArt } from "@/components/art/AiSearchHeroArt";
import { SECTION_ID } from "@/components/capsules/AiSearchFacetsCapsule";
import { AiChatDemo } from "@/components/art/AiChatDemo";
import { HOURLY, HOURLY_RATE } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

export const aiSearchVisibility: Service = {
  slug: "ai-search-visibility",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "Being the answer, not just a result",
  title: "AI Search Visibility",
  intent:
    "chadworks runs AI visibility as an ongoing service: the SEO, structured data, profiles, and answer-shaped pages that get a business recommended by ChatGPT and Google's AI.",

  answer: (
    <>
      AI search visibility is a suite of practices, implementations and
      optimizations that help a brand name or web property show up and/or
      get cited on AI search platforms like ChatGPT and Gemini (among
      others.) I&apos;m Chad Lewine, and I&apos;ve been optimizing websites
      for AI search visibility before the term even existed. AI search
      optimization is built on a foundation of traditional SEO, but takes
      it further because it accounts for the new signals and parameters
      that these AI-driven technologies rely on when deciding which
      results, names and links to surface.
    </>
  ),

  heroArt: <AiSearchHeroArt />,

  // The hero sends the reader DOWN into the breakdown rather than out to the
  // form; the CTA section at the foot of the page is what asks for contact.
  heroCta: {
    href: `#${SECTION_ID}`,
    buttonLabel: "Learn more",
    arrow: "down",
  },

  keyFactsHeading: "AI search visibility, at a glance",
  keyFactsIntroClassName: "cw-aisearch-glance",
  keyFacts: [
    "Times have changed, and will continue to change over the next few years.",
    "If you aren't optimized for AI search visibility now, you will get left behind. The market is becoming unforgiving.",
    "Small businesses have a shot to compete with large, as the large are slower to evolve to new technologies.",
    "AI search visibility is complex, but not impossible. It takes vision and commitment. Be prepared.",
  ],
  outlierFacts: [1],

  problemArt: <AiChatDemo />,
  problem: {
    heading: "The search results page quietly changed",
    subheading: "Your buyers ask and something answers. Is it you?",
    body:
      "Buyers used to scan ten blue links and click around. Now an assistant reads everything and names one or two businesses. Most owners never find out they were skipped.",
    more: {
      trigger: "What decides who gets named",
      paragraphs: [
        <>
          <strong>Engines read structure first.</strong>{" "}Schema and
          headings that match real questions. An AI decides what your page
          says before any human does, and messy structure reads as
          silence.
        </>,
        <>
          <strong>They cross-check identity.</strong>{" "}Your Google Business
          Profile, your reviews, your socials, and the site they all need
          to match. Inconsistency reads as risk, and engines don&apos;t
          recommend risk.
        </>,
        <>
          <strong>The quotable gets quoted.</strong>{" "}Pages that answer the
          question in the first two sentences get lifted into answers.
          Pages that warm up for four paragraphs get read and discarded.
        </>,
        "None of that is a trick, and no part of it is bought. It's craft, applied page by page, and it's checkable. That's the whole service.",
      ],
    },
  },

  approach: {
    heading: "How the retainer runs",
    steps: [
      {
        title: "The audit comes first",
        body:
          "Where you stand today in AI answers and the classic search they're built on. It's the same audit I sell on its own.",
      },
      {
        title: "Every page gets one intent",
        body:
          "Each page answers one real buyer question. Pages that blend two intents lose both, in rankings and in answers.",
      },
      {
        title: "Pages get answer-shaped",
        body:
          "Direct answers up top, structured data underneath. The craft is invisible until you ask an AI about you.",
      },
      {
        title: "Identity gets consistent",
        body:
          "Google Business Profile and every profile AI cross-checks, all telling the same story. Engines recommend what they can verify.",
      },
      {
        title: "It stays maintained",
        body:
          "Engines re-decide constantly, so the checklist runs on a cycle and you see what changed, in writing, every month.",
      },
    ],
  },

  paths: {
    heading: "The pieces, sold on their own",
    intro:
      "The retainer is the whole stack. These are the parts it's made of.",
    items: [
      {
        label: "AI Visibility Audit",
        detail: "The one-time measurement: where you stand and what to fix. Yours to act on with anyone.",
        href: "/ai-visibility-audit/",
      },
      {
        label: "SEO",
        detail: "The classic discipline underneath all of it. Rankings are what AI reads before it answers.",
        href: "/seo/",
      },
      {
        label: "Show Up on ChatGPT",
        detail: "The specific question everyone suddenly has, answered in plain English.",
        href: "/show-up-on-chatgpt/",
      },
      {
        label: "Digital Marketing",
        detail: "The honest channel triage, for when visibility is one piece of a bigger marketing question.",
        href: "/digital-marketing/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "A law firm in Google's AI Overview",
        detail:
          "After this work, a Pennsylvania criminal-defense firm surfaced in Google's AI Overview for its practice area, with page one of classic search underneath it.",
      },
      {
        label: "A psychologist named in AI answers",
        detail:
          "A Brooklyn psychologist ranks page one for the phrase locals type when they look for a therapist in his neighborhood, and AI assistants now name him.",
      },
      {
        label: "Inside the ChatGPT advertising beta",
        detail:
          "I run a client inside OpenAI's advertising beta, so I see the paid side of AI answers from the inside, not from screenshots.",
      },
      {
        label: "50 plus engagements behind it",
        detail:
          "The client archive runs from 2019 through 2025 and past fifty businesses. This service grew out of what those clients actually needed next.",
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
    figure: HOURLY_RATE,
    figureSub: "Retained monthly, scoped in writing first",
    body:
      `AI visibility runs as a monthly retainer built on my ${money(HOURLY)} hourly rate. The scope goes in writing before anything is billed: which pages get which checks, and what you'll see each month. I'm not the cheapest option, deliberately. This is for businesses where being the recommended answer is worth real money, and the retainer is sized to what that's worth in your market.`,
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}if the one-time audit is all your
        situation needs, I&apos;ll tell you before you commit to a retainer.
        The audit stands on its own, and you can act on it with anyone.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about AI visibility, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "What is AI visibility, exactly?",
      a: "Being found and recommended by AI assistants like ChatGPT, and by Google's AI answers, instead of just appearing in classic results. The work is real SEO plus structured data, consistent profiles, and pages written so an engine can quote them.",
    },
    {
      q: "Is SEO dead, then?",
      a: "No. AI assistants lean on the same signals search engines built, so classic SEO is the foundation. What died is doing SEO alone and calling the job finished.",
    },
    {
      q: "How fast does it show results?",
      a: "Slower than ads, faster than waiting. Profile and structure fixes can surface in weeks, while new standing for competitive phrases takes months. You see the checklist progress every month, so nothing rides on faith.",
    },
    {
      q: "Can you guarantee I'll show up in ChatGPT?",
      a: "No, and nobody honest can, because engines re-decide constantly and don't publish their rules. What I guarantee is the work: every check run and every change documented, with real precedent that it lands. The law firm now in Google's AI Overview started exactly where you are.",
    },
    {
      q: "Why a retainer instead of a one-time fix?",
      a: "Because the answer box is re-decided every time someone asks. A one-time pass exists, and it's the AI Visibility Audit. The retainer is for staying in the answers instead of visiting them once.",
    },
  ],

  cta: {
    heading: "Want to be the answer?",
    body:
      "Tell me your business and your market. You'll get a straight answer on where you stand in AI answers today and what a retainer would actually change.",
    buttonLabel: "Get the straight answer",
    href: "/contact/",
  },

  form: {
    source: "ai-search-visibility page",
    subject: "New AI Search Visibility Inquiry (chadworks)",
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
        label: "Where do buyers find you today?",
        required: true,
        rows: 4,
        placeholder: "Your market, your area, and what happens now when someone searches for what you do.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is the retainer the right move?",
    fit: [
      "Being the business AI recommends is worth real money in your market.",
      "You want one accountable person running the whole stack, not three vendors pointing at each other.",
    ],
    notFit: [
      "You're deciding on price. This is an investment, and I'm not the lowest number.",
      "You want overnight ranking hacks. Engines punish those, and I won't run them.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "Scope and number go in writing before any payment.",
      "The audit and every monthly report are yours to keep and act on with anyone.",
      "Every change lands in the monthly report, dated.",
      "You get a straight answer before committing. If the audit is all you need, that's what I'll say.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me your business and market through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "Where you stand in AI answers and classic search today, and whether a retainer is even the move." },
      { title: "A scoped retainer", body: "Pages, checks, cadence, and the monthly number, in writing before anything starts." },
      { title: "The checklist runs", body: "The first full pass lands, then the cycle keeps you in the answers, with progress you can read every month." },
    ],
  },

  meta: {
    title: "AI Search Visibility: Get Recommended by ChatGPT and Google AI | chadworks",
    description:
      `AI visibility as an ongoing service: SEO, schema, profiles, and answer-shaped pages that get businesses into ChatGPT answers and Google's AI Overview. Real precedent: a PA law firm in the AI Overview, a Brooklyn psychologist named in AI answers. ${HOURLY_RATE}, scoped in writing.`,
  },
};
