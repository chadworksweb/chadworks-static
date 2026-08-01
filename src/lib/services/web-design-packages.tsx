// Service: Web Design Packages (Websites lane) -- the scoped route: a
// defined build at a defined number. No invented tiers: the three postures
// use the REAL locked economics, read from the hub (BASE / the typical band / beyond).
// Copy in Chad's public voice.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { ScopeChip, TagChip, BoxChipDark } from "@/components/art/MoreChips";
import { ButtonChip, LayoutChip, TypeChipDark } from "@/components/art/WebDesignHeroArt";
import { BrowserChip } from "@/components/art/WebDevHeroArt";
import { HIGH, HOURLY, LOW, TYPICAL_BAND } from "@/lib/pricing";
import { BASE, money } from "@/lib/package-builder";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "scope", svg: <ScopeChip />, style: { left: "5%", width: "132px", animationDelay: "0s", animationDuration: "21.6s" } },     // 150/360
  { key: "browser", svg: <BrowserChip />, style: { left: "40%", width: "160px", animationDelay: "4.1s", animationDuration: "18.5s" } }, // 304/360
  { key: "tag", svg: <TagChip />, style: { left: "70%", width: "92px", animationDelay: "1.6s", animationDuration: "20.4s" } },         // 344/360
  { key: "box", svg: <BoxChipDark />, style: { left: "22%", width: "90px", animationDelay: "7.4s", animationDuration: "23.1s" } },     // 169/360
  { key: "layout", svg: <LayoutChip />, style: { left: "52%", width: "140px", animationDelay: "10.8s", animationDuration: "17.1s" } }, // 327/360
  { key: "button", svg: <ButtonChip />, style: { left: "12%", width: "108px", animationDelay: "14s", animationDuration: "21.1s" } }, // 151/360
  { key: "typedark", svg: <TypeChipDark />, style: { left: "62%", width: "92px", animationDelay: "16.5s", animationDuration: "19.3s" } }, // 315/360
  { key: "tag2", svg: <TagChip />, style: { left: "32%", width: "76px", animationDelay: "19s", animationDuration: "22.9s" } },       // 191/360
];

function PackagesHeroArt() {
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

export const webDesignPackages: Service = {
  slug: "web-design-packages",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "A defined build at a defined number",
  title: "Web Design Packages",
  intent:
    "chadworks sells scoped website builds at known numbers (the baseline build, the typical build, and beyond) for buyers who want the decision made simple.",

  answer: (
    <>
      A web design package is a scoped website build at a number you know
      before any work starts. I&apos;m Chad, and after 20 years of building
      websites I price them on what they win for your business, not by the
      line item. There are no surprise invoices and no retainer humming in
      the background: you see the full quote first, and that&apos;s the
      number on the final bill.
    </>
  ),

  heroArt: <PackagesHeroArt />,

  keyFactsHeading: "Packages, at a glance",
  keyFacts: [
    "Every package is the same craft. The number scales with scope, never with how much polish you deserve.",
    `Projects start at a ${money(BASE)} baseline and most land between ${LOW} and ${HIGH} with design and development included.`,
    "The quote you approve is the invoice you get. Add nothing, and the number never moves.",
    "Packages still get custom design. A defined scope means a defined size, not a template.",
  ],

  problem: {
    heading: "Why scoped packages exist",
    subheading: "Most buyers don't want an estimate. They want a number.",
    body:
      "Hourly sounds fair until the hours run long, and open-ended projects are how websites end up costing twice what anyone said out loud. A scoped package trades a little flexibility for certainty: a defined site, a real number, and a clean finish line.",
    more: {
      trigger: "How the scoping actually works",
      paragraphs: [
        <>
          <strong>Scope</strong>{" "}is decided together, before money moves. We
          settle what the site needs to do, which pages earn their place, and
          what gets cut without hurting the result. You approve the written
          scope, and that document is the deal.
        </>,
        <>
          <strong>Changes</strong>{" "}are handled like an adult conversation. If
          you add something mid-build, I tell you what it costs before I build
          it. Nothing new appears on an invoice that didn&apos;t appear in a
          conversation first.
        </>,
        "And if your project genuinely doesn't fit a defined scope, I'll say so and point you at the hourly or custom route instead. A package forced onto the wrong project is how both sides end up unhappy.",
      ],
    },
  },

  approach: {
    heading: "How a package runs",
    steps: [
      {
        title: "Scope first, money second",
        body:
          "We settle exactly what the site includes, in writing, before any payment. You know the full number and the timeline before you commit to either.",
      },
      {
        title: "Design and build, one person",
        body:
          "The same person designs it and codes it, so nothing gets lost in a handoff and nothing gets quietly simplified.",
      },
      {
        title: "A real finish line",
        body:
          "The package ends with a launch, not a fade-out. The site goes live, the accounts in your name, with two weeks of fixes included.",
      },
      {
        title: "Additions priced before they happen",
        body:
          "Want more later? You email me and I bill the work, with the number stated up front. No retainer, no surprise line items.",
      },
    ],
  },

  paths: {
    heading: "Where packages point",
    intro:
      "A package defines the size of the build. These decide the shape of it.",
    items: [
      {
        label: "Web Design",
        detail: "The visual angle: what the package actually looks like, and why none of it starts from a theme.",
        href: "/web-design/",
      },
      {
        label: "Web Development",
        detail: "The build angle: the code and structure underneath every package.",
        href: "/web-development/",
      },
      {
        label: "Custom Coded / Static",
        detail: "The build route most packages land on: fast, secure, and entirely yours.",
        href: "/custom-coded-static/",
      },
      {
        label: "Ecommerce",
        detail: "Selling online changes the scope conversation. Start here if the site's job is the sale.",
        href: "/ecommerce/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "The showroom",
        detail: "Scoped builds that shipped: walk through the live work and judge the craft yourself.",
        href: "/showroom/",
      },
      {
        label: "The rates page",
        detail: "The full economics, stated plainly: the baseline, the typical build, and how hourly works.",
        href: "/rates/",
      },
    ],
  },

  price: {
    heading: "The three postures",
    figure: `${money(BASE)} / ${TYPICAL_BAND} / beyond`,
    figureSub: "The baseline build / the typical build / the big vision",
    body:
      `The baseline gets a focused site that does one job well. The typical build is where most businesses land: full design, development, and the launch handled. Past that, the number tracks the vision, and we scope it together. Hourly work bills at ${money(HOURLY)} when a defined package isn't the right shape.`,
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}these are postures, not a menu. The real
        number comes from a real conversation about scope, and you&apos;ll
        have it in writing before anything starts.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about scoped builds, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "What exactly is included in a package?",
      a: "Whatever the written scope says, which we settle together before you pay anything. A typical build includes the design, the development, the launch, and two weeks of free fixes after. If something matters to you, it goes in the scope, and the scope is the deal.",
    },
    {
      q: "What happens if I want something added mid-build?",
      a: "I tell you what it costs before I build it, and you decide. The original number never quietly grows. That rule exists because surprise invoices built this industry's reputation.",
    },
    {
      q: "Is a package cheaper than hourly?",
      a: "Usually, for a defined project. Hourly is for open-ended work, and open-ended work drifts. When a project has a clear shape, a package gets you a better number and a finish line. When it doesn't, I'll tell you hourly is the honest route.",
    },
    {
      q: "Do packages use templates to hit the price?",
      a: "No. The scope defines how big the site is, not how it gets made. Every package is custom designed and custom built, the same as the biggest project here.",
    },
    {
      q: "What if my budget is under the baseline?",
      a: "Then I'm probably not your builder right now, and I'd rather say that here than waste your time. The baseline exists because going under it means cutting the things that make the site worth building at all.",
    },
  ],

  cta: {
    heading: "Want the number before the work?",
    body: "That's the whole point of a package. Tell me about your business and what the site has to do, and you'll get a defined scope at a defined number, in writing, before anyone commits.",
    buttonLabel: "Scope it with Chad",
    href: "/contact/",
  },

  form: {
    source: "web-design-packages page",
    subject: "New Package Inquiry -- chadworks",
    submitLabel: "Start the scope",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      {
        kind: "select",
        name: "posture",
        label: "Which posture sounds like you?",
        span: "half",
        options: [
          { value: "baseline", label: `The baseline build (${money(BASE)})` },
          { value: "typical", label: `The typical build (${TYPICAL_BAND})` },
          { value: "beyond", label: "The big vision" },
          { value: "unsure", label: "Scope it for me" },
        ],
      },
      { kind: "url", name: "current_site", label: "Current Site (if any)", placeholder: "https://", span: "half" },
      {
        kind: "textarea",
        name: "scope_notes",
        label: "What does the site have to do?",
        required: true,
        rows: 4,
        placeholder: "The job the site has to win, the pages you think you need, anything already decided.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is a package the right shape?",
    fit: [
      "You want the full number in writing before any work starts.",
      "Your project has a clear job and a clear finish line.",
    ],
    notFit: [
      "The project is open-ended and still finding its shape. Hourly is honest there.",
      "You're shopping for the lowest number rather than a defined result.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The scope and the number are in writing before any payment.",
      "Every build includes two weeks of free fixes after launch.",
      "It works with a keyboard and a screen reader, because some of your visitors need it to.",
      "Nothing measures a visitor until they agree to it, and there are no ad pixels.",
      "The site, the code, and the hosting end up in your name.",
      "No retainer, no recurring charge you didn't ask for.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me about the business and the site through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "I'll tell you straight whether a package fits your project, and which posture it points at." },
      { title: "The written scope", body: "You get the defined scope and the defined number, in writing, before any payment." },
      { title: "The build runs", body: "Design, development, launch, and two weeks of fixes. The number you approved is the number you pay." },
    ],
  },

  meta: {
    title: "Web Design Packages -- A Defined Build at a Defined Number | chadworks",
    description:
      `A web design package is a scoped website build at a number you know before work starts: a ${money(BASE)} baseline, a ${TYPICAL_BAND} typical build, and custom beyond. The quote you approve is the invoice you get.`,
  },
};
