// Service: WordPress (Websites lane) -- the familiar CMS route, done right.
// Real facts only: Chad hosts and maintains live WordPress client sites
// today, and the $550/6mo maintenance plan is the real number. Copy in
// Chad's public voice.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { WChip, PostChipDark, GearChip } from "@/components/art/MoreChips";
import { BrowserChip, ServerChip, DatabaseChip } from "@/components/art/WebDevHeroArt";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "w", svg: <WChip />, style: { left: "6%", width: "86px", animationDelay: "0s", animationDuration: "25.9s" } },              // 108/360
  { key: "post", svg: <PostChipDark />, style: { left: "44%", width: "140px", animationDelay: "4s", animationDuration: "22.2s" } },   // 298/360
  { key: "browser", svg: <BrowserChip />, style: { left: "20%", width: "158px", animationDelay: "10s", animationDuration: "28.4s" } }, // 230/360
  { key: "gear", svg: <GearChip />, style: { left: "72%", width: "80px", animationDelay: "2s", animationDuration: "24.1s" } },        // 339/360
  { key: "server", svg: <ServerChip />, style: { left: "12%", width: "136px", animationDelay: "14s", animationDuration: "20.6s" } },  // 179/360
  { key: "database", svg: <DatabaseChip />, style: { left: "58%", width: "74px", animationDelay: "8s", animationDuration: "26.8s" } }, // 283/360
  { key: "w2", svg: <WChip />, style: { left: "36%", width: "64px", animationDelay: "18s", animationDuration: "23.2s" } },            // 194/360
  { key: "post2", svg: <PostChipDark />, style: { left: "62%", width: "108px", animationDelay: "21s", animationDuration: "29.1s" } }, // 331/360
];

function WordPressHeroArt() {
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

export const wordpress: Service = {
  slug: "wordpress",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "The familiar CMS, done right",
  title: "WordPress",
  intent:
    "chadworks designs, builds, hosts, and maintains WordPress websites for businesses that want to manage their own content on a CMS the whole team knows.",

  answer: (
    <>
      WordPress is the route where you manage your own content on a CMS your
      whole team already knows. I&apos;m Chad, and I&apos;ve been building
      WordPress sites for businesses for most of my 20 years in this work. I
      host them, I maintain them, and I design over the platform until it
      stops reading as a theme, because the familiar route doesn&apos;t have
      to look like one.
    </>
  ),

  heroArt: <WordPressHeroArt />,

  keyFactsHeading: "WordPress, at a glance",
  keyFacts: [
    "WordPress earns its place when your team needs to edit content themselves. That's the honest reason to choose it, and it's a good one.",
    "I host and maintain live WordPress client sites today, so when something breaks, the person who built it is the person fixing it.",
    "Maintenance is $550 every six months: routine technical updates and small content changes, with no meter running.",
    "Custom design over the platform, not a purchased theme with your logo dropped in.",
  ],

  problem: {
    heading: "Why WordPress goes wrong",
    subheading: "The platform is fine. The way it's usually sold isn't.",
    body:
      "Most bad WordPress sites were born as a $60 theme stuffed with page-builder plugins, sold as custom work, and abandoned the day the invoice cleared. Then the updates pile up, the site slows down, and nobody knows which of the 30 plugins broke it.",
    more: {
      trigger: "What done-right looks like",
      paragraphs: [
        <>
          <strong>Lean</strong>{" "}is the build rule. A WordPress site needs far
          fewer plugins than the typical install carries. Every plugin is a
          thing that can break, slow the site, or get hacked, so each one has
          to earn its place.
        </>,
        <>
          <strong>Maintained</strong>{" "}is the survival rule. WordPress is
          software, and software needs updates. The sites that age badly are
          the ones nobody touched after launch. Mine are on a maintenance
          plan with a real person behind it.
        </>,
        <>
          <strong>Owned</strong>{" "}is the exit rule. The site, the hosting
          account, and the admin access live in your name. If we ever part
          ways, you keep everything and nothing goes dark.
        </>,
        "If you don't actually need to edit content yourself, I'll say so and point you at the custom-coded route instead. WordPress chosen for the wrong reason is just maintenance you didn't need.",
      ],
    },
  },

  approach: {
    heading: "How I build it",
    steps: [
      {
        title: "Custom design first",
        body:
          "The design gets settled before the platform enters the picture, so the site looks like your business instead of like WordPress.",
      },
      {
        title: "A lean install",
        body:
          "Every plugin has to earn its place. Fewer moving parts means a faster site, fewer updates, and fewer ways to break.",
      },
      {
        title: "Hosting handled",
        body:
          "I set the site up on hosting I trust and manage for clients today, with the account in your name from day one.",
      },
      {
        title: "Maintained by the builder",
        body:
          "Updates, backups, and small changes run through the maintenance plan. When something acts up, you email the person who built it.",
      },
    ],
  },

  paths: {
    heading: "Sure WordPress is the right route?",
    intro:
      "It's the right call for content-heavy teams. If that's not quite you, one of these probably fits better.",
    items: [
      {
        label: "Custom Coded / Static",
        detail: "No CMS, no updates, nothing to hack. The faster route when you don't need to self-edit.",
        href: "/custom-coded-static/",
      },
      {
        label: "Ecommerce",
        detail: "Selling on WordPress means WooCommerce, and that's its own conversation. Start here.",
        href: "/ecommerce/",
      },
      {
        label: "Web Design",
        detail: "Platform aside, the design decides whether anyone trusts the site. The visual angle lives here.",
        href: "/web-design/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Live client sites",
        detail: "I run WordPress builds for trade businesses, firms, and shops right now, hosted and maintained under the same roof.",
        href: "/portfolio/",
      },
      {
        label: "The maintenance plan",
        detail: "The $550-per-six-months number is real and published on the rates page, not quoted after you're locked in.",
        href: "/rates/",
      },
    ],
  },

  price: {
    heading: "What it costs, plainly",
    figure: "$3,200 - $6,200+",
    figureSub: "Value-based -- maintenance $550 / 6 months",
    body:
      "A WordPress build is priced like every build here: on what it wins for your business, starting at the $3,200 floor with most landing near $6,200. The difference from the static route is the ongoing side: WordPress needs maintenance, and mine is $550 every six months for updates and small content changes, stated here so it never surprises you.",
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}if a WordPress site is sold to you
        without a maintenance plan, you&apos;re being set up to pay for a
        rescue later. The plan isn&apos;t an upsell, it&apos;s how the
        platform survives.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about the WordPress route, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "Will I be able to edit the site myself?",
      a: "Yes, that's the point of choosing WordPress. You get backend access with guardrails: change what you please, and if something you change would hurt the site in search or usability, I'll say something. That veto is part of what you're paying for.",
    },
    {
      q: "Do you use page builders like Elementor or Divi?",
      a: "Sparingly and deliberately, never as a substitute for design. Page-builder tangle is the main reason WordPress sites get slow and fragile, so the install stays lean and the design comes from me, not from dragging blocks around.",
    },
    {
      q: "What does the maintenance plan actually cover?",
      a: "Routine technical updates, backups, and miscellaneous small content changes as needed, for $550 every six months. Bigger additions are scoped and billed as real work, and I tell you the number before doing them.",
    },
    {
      q: "Can you fix or redesign my existing WordPress site?",
      a: "Often, and I'll tell you honestly which case you are. If the bones are healthy, I can work with them. If it's a hack job held together by plugins, rebuilding is cheaper than rescuing, and I'll show you why before you spend anything.",
    },
    {
      q: "Who owns the site and the hosting?",
      a: "You do, from day one. The hosting account, the domain, and the admin access live in your name. If we ever stop working together, you keep everything and the site stays up.",
    },
  ],

  cta: {
    heading: "Want the familiar route, minus the mess?",
    body: "Tell me about your business and what your team needs to manage. You'll get a straight answer on whether WordPress is the right call for you, and what a clean build of it would take.",
    buttonLabel: "Tell me about your project",
    href: "/contact/",
  },

  form: {
    source: "wordpress page",
    subject: "New WordPress Inquiry -- chadworks",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "current_site", label: "Current Site (if any)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "situation",
        label: "The Situation",
        span: "half",
        options: [
          { value: "new", label: "New WordPress build" },
          { value: "redesign", label: "Fix or redesign my WordPress site" },
          { value: "rescue", label: "Something is broken" },
          { value: "unsure", label: "Not sure WordPress is right" },
        ],
      },
      {
        kind: "textarea",
        name: "details",
        label: "The Details",
        required: true,
        rows: 4,
        placeholder: "What does the site have to do, and what does your team need to edit themselves?",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is WordPress the right route?",
    fit: [
      "Your team genuinely needs to add and edit content without calling a developer.",
      "You want the platform everyone knows, built and maintained by one accountable person.",
    ],
    notFit: [
      "You'll never touch the content yourself. The static route is faster and lighter.",
      "You want to skip maintenance. WordPress without upkeep is a countdown.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The site, hosting, and admin access are in your name from day one.",
      "Every build includes two weeks of free fixes after launch.",
      "The maintenance number is published before you ever commit.",
      "You get a straight answer on whether WordPress even fits, first.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me about the business and the site through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "I'll tell you straight whether WordPress is the right route, or whether you'd be paying for upkeep you don't need." },
      { title: "A scoped plan", body: "If it's a fit, you get a written scope, the number, and the timeline before any payment." },
      { title: "Build, launch, maintain", body: "The site goes live in your name, and the maintenance plan keeps it healthy after." },
    ],
  },

  meta: {
    title: "WordPress -- The Familiar CMS, Done Right | chadworks",
    description:
      "Custom-designed WordPress websites for teams that manage their own content: lean installs, real hosting, and maintenance by the person who built it ($550 every six months). Never a theme with your logo dropped in.",
  },
};
