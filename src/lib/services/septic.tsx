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

  // The nine-step build timeline, rendered as the ProcessCapsule (page.tsx).
  approach: {
    heading: "From first call to live site, in nine steps.",
    steps: [
      { title: "Discovery", body: "I interview you to extract the necessary information about your business like company history, mission and vision, important products or services, milestones, etc." },
      { title: "Website Architecture (Sitemap)", body: "An SEO and user-friendly sitemap to visually organize all of your pages in an easy to read and digest visual." },
      { title: "Homepage Design", body: "The overall design of the site will be delivered with the first revision of the homepage." },
      { title: "Sub Page Build Out", body: "The rest of the website's pages will be built out with the design from the homepage and the content provided." },
      { title: "Search Optimization (SEO)", body: "The website pages and content will be optimized for search out of the box." },
      { title: "Mobile Optimization and Testing", body: "All content and pages must be complete before mobile testing and optimization is performed." },
      { title: "Soft Launch", body: "We launch the site on your main domain. We ask friends and family to visit the site and test it out to try and find any last bugs we did not catch or issues with specific operating systems, browsers or devices." },
      { title: "Official Launch", body: "We announce the launch of your website, and toast to a job well done for everyone involved. Congrats on your new web property, go get 'em. I'll be here for anything else you may need." },
      { title: "Post-Launch Safety Net", body: "For a limited period after official launch, I'll fix any issues or glaring mistakes that come up at no charge." },
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

  testimonials: {
    heading: "30+ reviews on Google. Read a few below.",
    items: [
      { quote: "He exceeded my expectations.", attribution: "Giselle" },
      { quote: "Easy to work with, responsive, and provides a fast turn-around.", attribution: "Jon Detrixhe" },
      { quote: "Very good at keeping costs down.", attribution: "Stacey Vey" },
      { quote: "He is an SEO magician!", attribution: "Ananda Forest" },
      { quote: "Chad is an amazing web designer and content creator.", attribution: "Rovin Rozario" },
      { quote: "Friendly, responsive and a good listener.", attribution: "Tim Noonan" },
    ],
  },

  made: {
    eyebrow: "Made in the USA",
    heading: "Hi, I'm Chad.",
    intro:
      "I've been building websites for trade and service businesses since the MySpace days.",
    manifesto: [
      { lead: "I design it.", aside: "(No template.)" },
      { lead: "I code it.", aside: "(No page builder.)" },
      { lead: "I maintain it.", aside: "(No ghosting.)" },
    ],
    negation: [
      "No subcontractors.",
      "No offshore.",
      "No AI slop.",
      "No warehouse agency you'll never hear from after the invoice clears.",
    ],
    close:
      "When you call, I pick up. When something breaks at 11pm before your busy season, I'm the one fixing it.",
    img: "/people/chad-cutout.webp",
    imgAlt: "Chad, founder of chadworks",
    captionMain: "Don't worry, I'm a professional.",
    captionSub: "(Web designer.)",
    sig: "Chad",
    sigMeta: "chadworks - Philadelphia, PA",
  },

  price: {
    heading: "What I quote up front is what you pay.",
    figure: "$5,200 - $8,200",
    figureSub: "Custom build, scope-dependent",
    body:
      "Pricing is based on scope, not hours. A focused conversion site lands near the low end of the range. Add intake forms, a real photo gallery, or service-area pages and the number moves up. You see the full quote before we start, and that's the number on the final invoice, no retainer running in the background. When you need something later, you email me and I bill the work.",
    disclaimer: (
      <>
        <strong>Heads up:</strong>{" "}the range above reflects the typical build.
        Larger scopes, complex requirements, or markets with heavy competition can
        easily push past the high end. Nothing on this page is a formal quote, real
        numbers come after a free consult where we scope your actual project
        together.
      </>
    ),
  },

  faqLead:
    "Questions that come up when septic owners compare what I build to what they see on the best-performing competitor sites.",
  faqs: [
    {
      q: "Top septic sites lead with their PSMA cert and license number. Will mine?",
      a: "Yes. Trust badges row above the fold, state license, PSMA cert, insurance carrier, BBB, NOWRA if applicable. Whatever credentials you actually carry. None of them faked.",
    },
    {
      q: "Sites like John Kline have a page for every town they serve. Do I get that?",
      a: "Yes, service-area pages are part of every build. Each one is real, real towns, real local content, real schema, not thin AI-spun duplicates Google will quietly de-index. Pricing tier determines how many; the base build typically covers 5 to 9, and we scale up from there.",
    },
    {
      q: "Do you separate residential and commercial flows?",
      a: "Yes. Residential optimizes for the panic homeowner with a backed-up tank at 11pm, fast load, tap-to-call CTA up top, license visible. Commercial gets a grease-trap intake form, fleet bio, named insurance carriers, and a quote workflow that doesn't pretend a restaurant chain is the same lead as a homeowner. Tell me your mix and I'll build for the heavier side.",
    },
    {
      q: "Top septic sites have a sticky Call Now bar on mobile. Is that standard?",
      a: "Standard. Every build ships with a tap-to-call sticky header on mobile and a tap-to-call CTA in the desktop nav. The phone number is the most clickable thing on the site, on purpose.",
    },
    {
      q: "Schema, AreaServed, LocalBusiness, what does any of that mean, and do I need it?",
      a: "It's the structured data Google, and now ChatGPT, Perplexity, and Gemini, read to know who you are, where you work, and what you do. Without it you're a name in a paragraph. With it you're an entity Google and AI search can cite. All wired up correctly in the build, no extra cost.",
    },
    {
      q: "Will live Google reviews show on my site, or do I have to screenshot them?",
      a: "Live, embedded via the Google Business Profile API so they update on their own. The Reviews page link buried in a footer is dead weight on most septic sites, visitors don't click it. We put the actual five-star content where customers are already looking.",
    },
    {
      q: "How long does a build take?",
      a: "2 to 3 weeks from kickoff to launch for a focused conversion site. Bigger scopes, multiple service-area pages, content migration, intake forms with custom routing, run 4 to 6 weeks. I quote a delivery date up front and stick to it.",
    },
    {
      q: "Can you migrate me off Wix, Squarespace, GoDaddy, or whatever I'm on now?",
      a: "Yes. Full migration is included in the build price. Wix and Squarespace make export painful on purpose, that's part of the racket. I handle the rebuild, you keep your domain and your hosting account in your name.",
    },
    {
      q: "Why do you show pricing when most septic-focused agencies don't?",
      a: "Because you should know roughly what you're going to spend before we talk. Most agencies hide pricing so they can size the quote to what they think you'll pay. The range here is honest: $5,200 to $8,200 based on scope, quoted up front.",
    },
    {
      q: "You're one person, what if something happens to you?",
      a: "Your site lives on your hosting account in your name. WordPress install, no proprietary lock-in. Any competent WordPress developer can take it over because nothing about the build is mine to hold over you. Admin access is yours from day one. I leave clean docs.",
    },
  ],

  cta: {
    heading: "If your septic services website looks like it was built in 2012, let's fix that.",
    body:
      "No pitch, no pressure, no slide deck. Tell me what's broken and what jobs you actually want more of. I'll tell you what I'd build and what it would cost.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  form: {
    source: "Septic services niche page",
    subject: "New chadworks Inquiry - Septic",
    submitLabel: "Send",
    successMessage: "Thanks, got it. I'll reply within one business day.",
    fields: [
      { kind: "text", name: "name", label: "Your name", required: true, autocomplete: "name" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "phone", label: "Phone", required: true, autocomplete: "tel", span: "half" },
      {
        kind: "textarea",
        name: "message",
        label: "Your message",
        required: true,
        rows: 4,
        placeholder: "A line or two about your current site, your service area, the jobs you wish you had more of...",
      },
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
      "Septic service websites built to win the 11pm emergency call: fast on a phone, tap-to-call in the header, license and insurance up top, and a page for every town you cover. Server-rendered and schema-rich so Google and the AI assistants name you. Custom builds run $5,200 to $8,200, quoted up front.",
  },
};
