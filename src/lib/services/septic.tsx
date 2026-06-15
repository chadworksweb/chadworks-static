// Service: Website Design for Septic Companies (/design/septic/) -- the septic
// niche page brought INTO the capsule system, styled to the global tokens (CWS
// directive 2026-06-15: works of art become capsules, CSS matches the global
// site). The distinctive art carries over as capsule sections: the interactive
// Scorecard (problem signature), the bold ProcessCapsule timeline (approach),
// and the WireframeCamera teardown (portfolio slot, the scroll zoom-and-pan over
// a sample septic page). Copy preserves the source's angles -- the 11pm panic
// call, the trust trio, per-town local SEO, AI-answer readability. Real facts;
// pricing is the site's value-based posture (from $315/hr, quoted flat).

import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { Scorecard } from "@/components/Scorecard";
import { LayoutChip, PaletteChip, WheelChip, PenChipDark } from "@/components/art/WebDesignHeroArt";
import { BoltChip } from "@/components/art/MoreChips";
import { PinChipDark } from "@/components/art/VisibilityHeroArt";

// Scatter constraint (rule 13): left% x 360 + width <= 360 per chip. Themed to
// septic web design: layout / speed / local / brand, with two inverted chips
// (PinChipDark for the local-area play, PenChipDark for the craft).
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "layout", svg: <LayoutChip />, style: { left: "8%", width: "150px", animationDelay: "0s", animationDuration: "25.6s" } },
  { key: "pin", svg: <PinChipDark />, style: { left: "50%", width: "150px", animationDelay: "5s", animationDuration: "23.8s" } },
  { key: "bolt", svg: <BoltChip />, style: { left: "30%", width: "104px", animationDelay: "11s", animationDuration: "28.4s" } },
  { key: "palette", svg: <PaletteChip />, style: { left: "70%", width: "92px", animationDelay: "2s", animationDuration: "24.2s" } },
  { key: "pen", svg: <PenChipDark />, style: { left: "15%", width: "96px", animationDelay: "9s", animationDuration: "21.7s" } },
  { key: "wheel", svg: <WheelChip />, style: { left: "44%", width: "104px", animationDelay: "15s", animationDuration: "27.1s" } },
  { key: "layout2", svg: <LayoutChip />, style: { left: "62%", width: "100px", animationDelay: "19s", animationDuration: "22.5s" } },
  { key: "bolt2", svg: <BoltChip />, style: { left: "10%", width: "72px", animationDelay: "23s", animationDuration: "29.4s" } },
];

function SepticHeroArt() {
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

export const septic: Service = {
  slug: "design/septic",
  lane: "design",
  laneLabel: "Design",
  eyebrow: "Built for the 11pm panic call",
  title: "Website Design for Septic Companies",
  intent:
    "chadworks builds septic service websites that win the emergency call and rank for every town you cover: fast on a phone, license and insurance up top, and readable by Google and the AI assistants buyers now ask.",

  answer: (
    <>
      A septic website has one job at 11pm: get the homeowner with a backed-up
      tank to tap your number before they tap a competitor&apos;s. Most septic
      sites lose that job on load speed, a buried phone number, and no proof
      you&apos;re licensed. I build the opposite, and I&apos;ve been building for
      trade businesses since the MySpace days. I&apos;m Chad. Every page is fast
      on a phone, leads with your license and insurance, and is written so Google
      and the assistants name you for{" "}
      <Link href="/design/">your town and your service</Link>. Want it found in
      AI answers too?{" "}
      <Link href="/ai-viz/">AI visibility</Link> rides on top of the same build.
    </>
  ),

  heroArt: <SepticHeroArt />,

  keyFactsHeading: "Septic web design, at a glance",
  keyFacts: [
    "The emergency caller decides in seconds. The site has to load fast on a phone, put tap-to-call in the header, and show the trust trio (state license, PSMA cert, insurance) before anything else.",
    "Every town you serve gets its own page. That is the local SEO play that catches septic pumping searches for each township, not just your home base.",
    "Built server-rendered and schema-rich so Google and the AI assistants can read you. When a homeowner asks ChatGPT who to call, you want to be the name that comes back.",
    "Run by one person who builds, writes, and ships the whole thing. Not a template farm, not an offshore queue.",
  ],

  problemArt: (
    <Scorecard
      label="Six-point septic site check"
      title="Is your septic site winning the call?"
      items={[
        { strong: "It loads in two to three seconds on a phone", small: "Mobile is the site, not an afterthought. The panic search happens on a phone." },
        { strong: "Tap-to-call is in a sticky header on mobile", small: "One thumb-press away on every page, every scroll." },
        { strong: "License, PSMA cert, and insurance are above the fold", small: "The trust trio, visible before any scrolling." },
        { strong: "Every town you serve has its own page", small: "Not ten townships listed in a footer." },
        { strong: "Real photos of your truck and crew, not stock", small: "Generic tanker stock gets filtered out in seconds." },
        { strong: "It is server-rendered and carries schema", small: "So Google and the AI assistants can actually read you." },
      ]}
      verdicts={[
        { max: 0, tier: "0", text: "Tap each row that is true for your site. Most septic sites can honestly check two." },
        { max: 2, tier: "low", text: "Your site is invisible to the panic search. Most of those leads are slipping past you." },
        { max: 4, tier: "mid", text: "You are in the game. Closing the gaps would lock in more of the high-intent calls." },
        { max: 5, tier: "high", text: "Strong. You are catching most of the panic leads in your area." },
        { max: 6, tier: "max", text: "You are already winning the 11pm calls. This site is a closer." },
      ]}
      ctaHref="/contact/"
      ctaDefault="Let's fix that"
      ctaMax="Build me one anyway"
    />
  ),
  problem: {
    heading: "Why most septic websites fail their owners",
    subheading: "The six checks above take a minute. Here is what they are testing.",
    body:
      "A septic site is not a brochure. It is a closer for a homeowner in a small panic, and most of them lose the job before the phone rings.",
    more: {
      trigger: "The four reasons the call goes to someone else",
      paragraphs: [
        <>
          <strong>It is slow on a phone.</strong>{" "}The panic search happens on
          a phone, in a hurry. A site that takes five seconds to load on mobile
          has already lost to the one that loaded in two. Speed is not a nicety
          here, it is the whole game.
        </>,
        <>
          <strong>The phone number is buried.</strong>{" "}If tap-to-call is not
          in the header on every page, every scroll, the homeowner has to hunt
          for it, and they will not. The number is the most important element on
          a septic site and it belongs one thumb-press away.
        </>,
        <>
          <strong>There is no proof you are real.</strong>{" "}Someone is about to
          let a stranger in a vacuum truck onto their property. State license,
          PSMA cert, and a named insurance carrier, visible above the fold, clear
          that bar. Bury them on an About page and the doubt wins.
        </>,
        <>
          <strong>It is invisible for the towns you cover.</strong>{" "}One page
          that lists ten townships in a footer does not rank for any of them.
          Each service area needs its own real page, with the local detail Google
          and the AI assistants actually reward.
        </>,
      ],
    },
  },

  // approach renders as the bold ProcessCapsule timeline (overridden in page.tsx).
  approach: {
    heading: "How the build runs",
    steps: [
      {
        title: "Map the jobs",
        body:
          "We list your services and every town you cover, then decide which pages do the selling: routine pumping, inspections, real-estate certs, drain field, plus a page per service area.",
      },
      {
        title: "Build for the phone first",
        body:
          "Mobile is the site, not an afterthought. Tap-to-call in a sticky header, fast load, and the trust trio above the fold on every page.",
      },
      {
        title: "Write it to be found",
        body:
          "Plain-language service pages and real FAQs, niched to what your buyers actually search and ask an assistant, with the local detail each town page needs.",
      },
      {
        title: "Wire the schema",
        body:
          "LocalBusiness, Service, and AreaServed structured data so Google and the AI crawlers read you as a defined entity, not a guess from prose.",
      },
      {
        title: "Launch and watch",
        body:
          "Soft launch, check it on real phones, then go live. Afterward I watch what is ranking and where the calls come from, and aim the next round of work there.",
      },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "Most-cited site in its market",
        detail:
          "After a rebuild aimed at being readable to AI, a trade-service client became the single most-cited site for its region, ahead of the directories. The same build discipline carries straight into septic.",
      },
      {
        label: "The trade-business track record",
        detail:
          "I have been getting service businesses found online since the MySpace days. Septic is local, urgent, and trust-driven, exactly the kind of work this approach was built for.",
      },
      {
        label: "A teardown, not a promise",
        detail:
          "Scroll the sample septic page below. Every section is there for a reason, and I will walk you through why before I build yours.",
      },
    ],
  },

  portfolio: {
    heading: "Sites I've built for trade and service businesses.",
    intro:
      "Trade service, event hospitality, specialty landscape, and a solo wellness practice. Click anywhere on a shot to send a ripple through it.",
    items: [
      { label: "Russ Tree Service", img: "/portfolio/russtree.webp", alt: "Russ Tree Service homepage", href: "https://russtreeservice.com" },
      { label: "AAC Event Catering", img: "/portfolio/aac.webp", alt: "AAC Event Catering homepage", href: "https://aaceventcatering.com" },
      { label: "EdenScapes", img: "/portfolio/edenscapes.webp", alt: "EdenScapes Japanese garden design page", href: "https://eden-scapes.com/japanese-garden-design-installation/" },
      { label: "Massage Professionals", img: "/portfolio/massagepros.webp", alt: "Massage Professionals LLC homepage", href: "https://massageprofessionalsllc.com" },
      { label: "ADS Automation", img: "/portfolio/adsautomation.webp", alt: "ADS Automation homepage", href: "https://adsautomation.com" },
      { label: "Thorobird", img: "/portfolio/thorobird.webp", alt: "Thorobird homepage", href: "https://thorobird.com" },
    ],
  },

  made: {
    eyebrow: "Made in the USA",
    heading: "Hi, I'm Chad.",
    intro:
      "I've been building websites for trade and service businesses since the MySpace days. Septic is the kind of work I like: local, hands-on, and won or lost on whether the site does its job at the worst possible moment for the customer.",
    manifesto: [
      { lead: "I design it.", aside: "(For the phone.)" },
      { lead: "I write it.", aside: "(To be found.)" },
      { lead: "I build it.", aside: "(Fast and clean.)" },
      { lead: "I launch it.", aside: "(And watch it.)" },
    ],
    negation: [
      "No bloated page-builder themes.",
      "No stock photos of generic tankers.",
      "No offshore content farm.",
      "No selling you pages your market won't reward.",
    ],
    close:
      "When you call, I pick up. When something on your current site is costing you calls, I tell you straight.",
    img: "/people/chad-cutout.webp",
    imgAlt: "Chad Lewine, founder of chadworks, who builds the septic websites",
    captionMain: "I build it myself.",
    captionSub: "(Page by page.)",
    sig: "Chad",
    sigMeta: "chadworks - Greater Philadelphia",
  },

  price: {
    heading: "What it costs, plainly",
    figure: "Quoted flat, up front",
    figureSub: "Priced from $315/hr, in writing before you commit",
    body:
      "A septic site is scoped to the services and towns you actually cover, then quoted as one flat number before you commit, priced from my $315 hourly rate. I'm not the cheapest option, deliberately. You're hiring one builder who does the whole thing, not a template you fight with for a year.",
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}a great site is the foundation, not a
        magic switch. It wins the calls it can win and ranks for what the market
        will give it. If your area is a slow build or a fast one, I'll tell you
        which before you spend a dollar.
      </>
    ),
  },

  faqLead:
    "Straight answers on speed, local ranking, the emergency call, and what it takes to be found in AI answers.",
  faqs: [
    {
      q: "Why does my septic website need to load fast on a phone?",
      a: "Because the emergency caller is on a phone, in a hurry, with a tank backing up. A site that takes five seconds to load on mobile loses that caller to the one that loaded in two. Speed is the single biggest lever on a septic site, so the whole build is mobile-first: fast load, tap-to-call in the header, and the important things visible without scrolling.",
    },
    {
      q: "How do I rank for all the towns I service, not just my home base?",
      a: "Each service area gets its own real page, with the local detail that town's searchers and Google reward: permit notes, county rules, and the specific service. One page that lists ten townships in a footer ranks for none of them. A page per town, written properly, is the local SEO play that catches septic pumping searches across your whole coverage area.",
    },
    {
      q: "Do top septic sites really need a sticky tap-to-call bar on mobile?",
      a: "Yes, and every build I ship has one. The phone number is the most clickable thing on a septic site, on purpose. A sticky header keeps tap-to-call one thumb-press away on every page and every scroll, which is exactly what the 11pm panic caller needs.",
    },
    {
      q: "What should be above the fold on a septic homepage?",
      a: "The trust trio and the phone. State license, PSMA cert, and a named insurance carrier, plus tap-to-call, all visible before any scrolling. A homeowner is about to let a stranger onto their property, so clearing the credibility bar in the first two seconds is what earns the call.",
    },
    {
      q: "Will my new septic site show up when someone asks ChatGPT who to call?",
      a: "It is built to. The site is server-rendered and carries LocalBusiness, Service, and AreaServed schema, so Google and the assistants can actually read who you are and where you work. Getting named in AI answers is the ongoing AI visibility work that rides on top of the build; a readable, schema-rich site is the prerequisite, and that is what I ship.",
    },
    {
      q: "Can you rebuild my existing septic site, or do I need to start over?",
      a: "Either, depending on what's there. Sometimes the bones are fine and the fixes are speed, the missing trust signals, and the town pages. Sometimes a builder-bloated site is faster to replace than to repair. I'll audit what you have and tell you honestly which path costs you less for the same result.",
    },
  ],

  cta: {
    heading: "Let's win the 11pm call",
    body:
      "Tell me about your septic business, the services you run, and the towns you cover. I'll show you exactly where your current site is leaking calls and what a build that closes those leaks looks like. No pitch, no slide deck.",
    buttonLabel: "Start a conversation",
    href: "/contact/",
  },

  form: {
    source: "Septic Web Design page",
    subject: "New chadworks Inquiry - Septic Web Design",
    submitLabel: "Send it to Chad",
    successMessage:
      "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "current_site", label: "Your Current Website", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "situation",
        label: "The Situation",
        span: "half",
        options: [
          { value: "no-site", label: "I don't have a site yet" },
          { value: "rebuild", label: "I have one and it isn't working" },
          { value: "slow", label: "Mine is slow or hard to find" },
          { value: "unsure", label: "Not sure what I need" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "Your services and towns",
        required: true,
        rows: 4,
        placeholder: "The septic services you run and the towns you cover.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is this the right fit?",
    fit: [
      "You run a real septic operation and you're losing calls to a slow or thin website.",
      "You cover multiple towns and want to rank for each one, not just your home base.",
      "You'd rather hire one builder who owns the whole thing than wrestle a template.",
    ],
    notFit: [
      "You want the cheapest possible site and the number is the only thing that matters. I'm not the cheapest, deliberately.",
      "You want a free automated scan and a logo in a day. That's a different shop.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The build is quoted as one flat number, in writing, before you commit.",
      "You own the site, the domain, and the content, fully.",
      "Built fast and clean, not on a bloated page-builder you'll fight for years.",
      "If a rebuild is cheaper than a repair, or the reverse, I'll tell you which.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me your services and the towns you cover through the form here. I usually reply within a day." },
      { title: "A quick audit", body: "I look at your current site and market and find where the calls are leaking." },
      { title: "A flat quote", body: "One number and a timeline, in writing, before you decide anything." },
      { title: "The build", body: "Designed for the phone, written to be found, launched and watched." },
    ],
  },

  meta: {
    title: "Website Design for Septic Companies | chadworks",
    description:
      "Septic service websites built to win the 11pm emergency call: fast on a phone, tap-to-call in the header, license and insurance up top, and a page for every town you cover. Server-rendered and schema-rich so Google and the AI assistants name you. Quoted flat, priced from $315/hr.",
  },
};
