// Service: Show Up on ChatGPT (/show-up-on-chatgpt/) -- the AI-visibility work of
// art brought INTO the capsule system and reskinned to the global tokens (CWS
// directive 2026-06-15: reproduce every real section + mechanic faithfully,
// restyle to Lexend + indigo/purple, live under the global shell). The page's
// distinctive art carries over as bespoke sections (hero, why+chat, lanes,
// Q&A, stat grid, pricing duo) plus shared capsules (Scorecard problem
// signature, PortfolioCapsule, MadeByCapsule, FaqCapsule, ProcessCapsule,
// CtaCapsule). Copy is reproduced from the source, not paraphrased.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { Scorecard } from "@/components/Scorecard";
import { AUDIT } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

export const showUpOnChatgpt: Service = {
  slug: "show-up-on-chatgpt",
  lane: "visibility",
  laneLabel: "Visibility",
  breadcrumbParent: { label: "AI Visibility", href: "/ai-viz/" },
  eyebrow: "AI Visibility / GEO",
  title: "Show Up on ChatGPT",

  intent:
    `chadworks makes small-business sites readable and quotable to the AI crawlers behind ChatGPT, Claude, Gemini, and Perplexity, so your business gets named in the answer instead of your competitor. It starts with a ${money(AUDIT)} audit.`,

  answer: (
    <>
      To show up on ChatGPT you have to be readable and quotable to AI crawlers.
      That means letting bots like GPTBot and OAI-SearchBot in, adding structured
      data that names your business, and writing content that answers real
      questions. Most sites fail at least one of these, so they stay invisible. A
      {money(AUDIT)} audit tells you which ones are costing you. If you need to be visible
      tomorrow instead, see{" "}
      <Link href="/advertising-on-chatgpt/">advertising on ChatGPT</Link>.
    </>
  ),

  keyFactsHeading: "AI visibility, at a glance",
  keyFacts: [
    "When a customer asks ChatGPT, Claude, Gemini, or Perplexity for the best business near them, your name gets cited or someone else's does. A lot of sites never get named because the crawlers cannot even read them.",
    "The crawlers behind AI answers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) are often blocked by accident in a copied robots.txt. If they cannot fetch your pages, you are not in the running.",
    "Without structured data an AI has to guess what your business is from prose. With it you are a defined entity with a name, a service, an area, and reviews it can cite.",
    "AI answers lift short, clear statements. Direct answers, real FAQs, and plain descriptions of what you do are what get quoted back to the person asking.",
  ],

  problemArt: (
    <Scorecard
      label="Six-point AI visibility check"
      title="Tap the rows that apply."
      items={[
        { strong: "AI crawlers are allowed in your robots.txt and llms.txt", small: "GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended are not blocked." },
        { strong: "Your pages carry structured data", small: "Organization, Service, FAQ schema, not just a title tag." },
        { strong: "Your content answers real questions directly", small: "Short, quotable answers an AI can lift, not a wall of marketing copy." },
        { strong: "Your text is in the HTML, not painted by JavaScript", small: "A crawler sees your words without running scripts." },
        { strong: "Your business details match everywhere", small: "Same name, address, phone, and links across the web." },
        { strong: "You can already find yourself cited in an AI answer", small: "Ask ChatGPT a question you should win and see if you are named." },
      ]}
      verdicts={[
        { max: 0, tier: "0", text: "Tap each row that is true for your site. Most sites can honestly check two." },
        { max: 2, tier: "low", text: "Low score and you are probably invisible right now. The AI most likely cannot read you at all." },
        { max: 4, tier: "mid", text: "You are partway there. Closing the gaps is what turns a readable site into a cited one." },
        { max: 5, tier: "high", text: "Strong. One more fix and you are built to be cited." },
        { max: 6, tier: "max", text: "Six for six. You are built to be cited. The audit confirms it and finds the edge cases." },
      ]}
      ctaHref="/contact/"
      ctaDefault={`Get the ${money(AUDIT)} audit`}
      ctaMax="Audit me anyway"
    />
  ),

  problem: {
    heading: "Why your site is invisible to AI crawlers",
    subheading: "The six checks above take a minute. Here is what they are testing.",
    body:
      "A lot of sites never get named in an AI answer because the crawlers cannot even read them. The audit finds out why, and tells you which fix actually moves the needle in your market.",
  },

  // The six-step visibility timeline, rendered as the ProcessCapsule.
  approach: {
    heading: "From audit to cited, step by step.",
    steps: [
      { title: "Audit", body: "I check crawlability, structured data, content, and where you stand against the businesses already getting cited. You get a prioritized fix list and a realistic read on your market." },
      { title: "Open the doors", body: "Fix the robots.txt and llms.txt so AI crawlers can actually reach your pages, and clear anything blocking them at the server." },
      { title: "Wire the schema", body: "Add and repair structured data so you read as a defined entity: name, services, area, reviews, the things an AI attributes claims to." },
      { title: "Make it quotable", body: "Rewrite key pages with direct answers and real FAQs, niched to the questions your buyers actually ask, so the AI has something worth lifting." },
      { title: "Build presence", body: "On a campaign, this is where the monthly articles, posts, and review outreach compound your authority over time." },
      { title: "Track and adjust", body: "Watch the citations, positions, and topics the market is asking about, then aim the next month's work where it pays." },
    ],
  },

  proof: {
    heading: "What this looks like when it works.",
    items: [
      {
        label: "Most-cited domain in the category",
        detail:
          "Of 114 domains AI pulled from for southeast Wisconsin tree service, russtreeservice.com was cited the most, a 12.6% share, ahead of directories like BBB and Angi.",
      },
      {
        label: "Average AI position climbed",
        detail:
          "Where an AI placed the business when it named a tree service, climbing from position #6 to #3.1 in the first two weeks of tracking.",
      },
      {
        label: "The honest version",
        detail:
          "Not every client cracks it that fast. A Brooklyn psychologist came to me at 22% AI readiness and a month of work got him to 79%, invisible to ready. The audit gets you ready. Getting cited takes longer, and it comes faster when we niche down to the questions you can actually win.",
      },
    ],
  },

  portfolio: {
    heading: "A real result.",
    intro:
      "Rebuilt for AI visibility, niched to the exact phrases buyers search. Click anywhere on a shot to send a ripple through it.",
    items: [
      { label: "Russ Tree Service", img: "/portfolio/russtree.webp", alt: "Russ Tree Service homepage, rebuilt for AI visibility", href: "https://russtreeservice.com" },
      { label: "Service-area page", img: "/portfolio/russtree-bigbend.webp", alt: "Russ Tree Service Big Bend service-area page", href: "https://russtreeservice.com" },
      { label: "EdenScapes", img: "/portfolio/edenscapes.webp", alt: "EdenScapes Japanese garden design page", href: "https://eden-scapes.com/japanese-garden-design-installation/" },
    ],
  },

  made: {
    eyebrow: "Made in the USA",
    heading: "Hi, I'm Chad Lewine.",
    intro:
      "I've been getting trade and service businesses found online since the MySpace days. AI search is the newest place your customers look. The work to win it is the same work I've always done, aimed at a new target.",
    manifesto: [
      { lead: "I audit it.", aside: "(Myself.)" },
      { lead: "I fix it.", aside: "(At the source.)" },
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
    sig: "Chad Lewine",
    sigMeta: "chadworks - Greater Philadelphia",
  },

  price: {
    heading: "Start with the audit. Scale into the campaign.",
    figure: money(AUDIT),
    figureSub: "AI Visibility Audit, one-time",
    body:
      "The baseline. I check whether AI crawlers can reach you, whether your structured data is doing its job, whether your content is quotable, and where you stand against the businesses already getting cited. You get a prioritized fix list and a straight answer about what is realistic in your space.",
  },

  faqLead:
    "Straight answers on why you're invisible, how long it takes, and what actually moves the needle.",
  faqs: [
    {
      q: "Why isn't my website showing up on ChatGPT?",
      a: "Usually because the AI cannot read you. Your robots.txt may block crawlers like GPTBot and OAI-SearchBot, you may have no structured data so the AI cannot tell what you are, or your content may be painted in by JavaScript that crawlers do not run. An audit checks each one and tells you which apply.",
    },
    {
      q: "How do I get my business to show up on ChatGPT?",
      a: "Make your site readable and quotable. Let the AI crawlers in, add structured data that names your business and what it does, write content that answers the questions people ask, and keep your details consistent across the web. Do that and you become a source the AI can cite. The audit maps exactly what is missing.",
    },
    {
      q: "How long does it take to show up in AI search?",
      a: "Longer than paid ads, and not a fixed number. Crawlability and schema fixes can register in days. Earning citations in a competitive space takes weeks of content and consistency, and against entrenched legacy competitors it can take longer or not happen in the first month. If you need to be visible tomorrow, see advertising on ChatGPT.",
    },
    {
      q: "What is llms.txt and do I need it?",
      a: "It is a plain text file at the root of your site that points AI crawlers to the content you most want them to read and cite. A newer convention, not a guarantee, but cheap to add and a clear signal about which pages matter. It is part of the visibility setup, not the whole thing.",
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
    heading: "Find out if you're invisible to AI.",
    body:
      "Tell me your site and what you do. I'll run the audit, show you exactly why you do or don't show up on ChatGPT yet, and give you a straight read on what's realistic in your market. No pitch, no slide deck.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  form: {
    source: "Show Up on ChatGPT page",
    subject: "New chadworks Inquiry - AI Visibility",
    submitLabel: "Send",
    successMessage: "Thanks, got it. I'll reply within one business day.",
    fields: [
      { kind: "text", name: "name", label: "Your name", required: true, autocomplete: "name" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "website", label: "Your website", autocomplete: "url", placeholder: "yourbusiness.com", span: "half" },
      {
        kind: "textarea",
        name: "message",
        label: "What do you do, and where?",
        required: true,
        rows: 4,
        placeholder: "A line or two about your business, your service area, and a question a customer might ask an AI that you want to win...",
      },
    ],
  },

  meta: {
    title: "Show Up on ChatGPT | chadworks",
    description:
      "Get your business or website content named and cited in ChatGPT and other AI search assistants.",
  },
};
