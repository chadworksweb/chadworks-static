// Service: Custom Coded / Static (Websites lane) -- the flagship build
// route: custom code, no CMS, nothing to update or hack. The site serving
// this page IS one, which is the best proof on the menu. Copy in Chad's
// public voice.

import type { ReactNode, CSSProperties } from "react";
import type { Service } from "@/lib/service";
import { BoltChip, ShieldChipDark } from "@/components/art/MoreChips";
import { CodeChip, TerminalChip, BracketsChip, BrowserChip } from "@/components/art/WebDevHeroArt";

// Scatter constraint: left% x 360 + width <= 360 per chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "terminal", svg: <TerminalChip />, style: { left: "5%", width: "120px", animationDelay: "0s", animationDuration: "26.4s" } }, // 138/360
  { key: "bolt", svg: <BoltChip />, style: { left: "66%", width: "84px", animationDelay: "3s", animationDuration: "22.8s" } },        // 322/360
  { key: "code", svg: <CodeChip />, style: { left: "30%", width: "132px", animationDelay: "9s", animationDuration: "28.3s" } },        // 240/360
  { key: "shield", svg: <ShieldChipDark />, style: { left: "54%", width: "86px", animationDelay: "1s", animationDuration: "24.6s" } }, // 280/360
  { key: "brackets", svg: <BracketsChip />, style: { left: "16%", width: "70px", animationDelay: "13s", animationDuration: "20.4s" } }, // 128/360
  { key: "browser", svg: <BrowserChip />, style: { left: "40%", width: "150px", animationDelay: "16s", animationDuration: "27.2s" } }, // 294/360
  { key: "bolt2", svg: <BoltChip />, style: { left: "76%", width: "64px", animationDelay: "20s", animationDuration: "23.6s" } },       // 338/360
  { key: "terminal2", svg: <TerminalChip />, style: { left: "24%", width: "92px", animationDelay: "23s", animationDuration: "29.4s" } }, // 178/360
];

function StaticHeroArt() {
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

export const customCodedStatic: Service = {
  slug: "custom-coded-static",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "The purest build there is",
  title: "Custom Coded / Static",
  intent:
    "chadworks builds custom-coded static websites: no CMS, no plugins, nothing to update or hack, the fastest and most secure way a marketing site can exist.",

  answer: (
    <>
      A custom-coded static site is a website with nothing between your
      visitor and the page: no CMS, no plugins, no database, just fast,
      custom-built code. I&apos;m Chad, I&apos;ve been developing websites
      for 20 years, and this is the route I trust most. The site you&apos;re
      reading right now is one.
    </>
  ),

  heroArt: <StaticHeroArt />,

  keyFactsHeading: "Custom static, at a glance",
  keyFacts: [
    "Static sites are the fastest sites on the internet, because the page is already built before anyone asks for it.",
    "There is no software to update and effectively nothing to hack. The maintenance bill on the platform itself is zero.",
    "Every line is custom built for your business. No theme, no page builder, no plugin tax slowing things down.",
    "You own the code and the hosting outright, and the hosting for a site like this costs next to nothing.",
  ],

  problem: {
    heading: "Why custom static actually matters",
    subheading: "Most websites carry weight they never needed.",
    body:
      "The typical business site runs a CMS, a theme, and a stack of plugins just to show pages that almost never change. All of it has to load, update, and stay secure, forever. A static build deletes that entire layer, and everything left over is speed.",
    more: {
      trigger: "Where the advantage shows up",
      paragraphs: [
        <>
          <strong>Speed</strong>{" "}is structural, not optimized-in. The pages
          are pre-built files served instantly, which visitors feel and
          search engines reward. There is no slower version of this site
          waiting to happen.
        </>,
        <>
          <strong>Security</strong>{" "}becomes a non-topic. No login page, no
          database, no plugin vulnerabilities. The attack surface of a
          static site is close to nothing, which is why this site runs no
          security software at all.
        </>,
        <>
          <strong>Cost</strong>{" "}flips after launch. No maintenance plan for
          the platform, no plugin licenses, hosting measured in single
          dollars. The route costs more attention up front and almost
          nothing to keep alive.
        </>,
        "The honest trade: you edit content through me instead of a CMS dashboard. For sites that change weekly that's the wrong trade, and I'll point you at WordPress. For everyone else, it's the best deal in web development.",
      ],
    },
  },

  approach: {
    heading: "How I build it",
    steps: [
      {
        title: "Architecture before pixels",
        body:
          "The structure gets designed for speed and searchability first, because that's the part that's expensive to retrofit later.",
      },
      {
        title: "Custom code, modern stack",
        body:
          "The same stack I use for my own flagship builds: modern frameworks compiled down to pure, fast, static output.",
      },
      {
        title: "GEO baked in",
        body:
          "Answer-first structure and clean markup are how the pages get written, not a later phase. Static HTML is what search engines and AI assistants read best.",
      },
      {
        title: "Launched in your name",
        body:
          "The code, the hosting, and the domain end up yours. Edge hosting for a static site is fast everywhere and costs almost nothing.",
      },
    ],
  },

  paths: {
    heading: "Make sure it's the right route",
    intro:
      "Custom static wins on speed, security, and cost. These are the routes for the jobs it doesn't do.",
    items: [
      {
        label: "WordPress",
        detail: "When your team needs to edit content weekly without a developer in the loop.",
        href: "/wordpress/",
      },
      {
        label: "Ecommerce",
        detail: "Selling needs carts, payments, and inventory. That's a different build conversation.",
        href: "/ecommerce/",
      },
      {
        label: "Web Design",
        detail: "Whatever the build route, the design decides whether anyone trusts it. The visual angle lives here.",
        href: "/web-design/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "This site",
        detail: "chadworks.co is a custom-coded static build: the speed you're feeling right now is the product.",
      },
      {
        label: "The live builds",
        detail: "Custom-coded client and flagship sites, live in the portfolio.",
        href: "/showroom/",
      },
    ],
  },

  portfolio: {
    heading: "Click into the work",
    intro:
      "Live custom-coded builds. Click anywhere on a shot to send a ripple through it.",
    items: [
      { label: "chadlewine.com", img: "/portfolio/chadlewine.png", alt: "chadlewine.com, a custom-coded musician website", href: "https://chadlewine.com" },
      { label: "The Rising Compass", img: "/portfolio/risingcompass.png", alt: "risingcompass.net, a custom-coded song-analysis web app", href: "https://risingcompass.net" },
    ],
  },

  price: {
    heading: "What it costs, plainly",
    figure: "$3,200 - $10,000+",
    figureSub: "Value-based -- near-zero running costs after",
    body:
      "Custom static is priced like every build here: on what it wins for your business, from the $3,200 baseline with most landing between $5,000 and $10,000. The difference is everything after launch. No platform maintenance, no plugin renewals, hosting that rounds to nothing. Content changes go through me and bill at $315 an hour, which for most marketing sites means a handful of small invoices a year instead of a monthly subscription.",
    disclaimer: (
      <>
        <strong>Straight up:</strong>{" "}if your content changes every week,
        this is the wrong route and I&apos;ll tell you so. Static earns its
        keep on sites that need to be fast and found, not edited daily.
      </>
    ),
  },

  faqLead:
    "The questions buyers ask about static builds, answered the way I'd answer them on a call.",
  faqs: [
    {
      q: "What does 'static' actually mean?",
      a: "The pages are built once, ahead of time, and served as finished files. Nothing gets assembled on demand, which is why static sites load instantly and have almost nothing to attack or maintain.",
    },
    {
      q: "How do I change content without a CMS?",
      a: "You email me and it's handled, usually same or next day, billed honestly by the hour. For most marketing sites that's a far better deal than carrying a CMS, its hosting, and its maintenance all year for edits that happen monthly.",
    },
    {
      q: "Is static worse for SEO or AI visibility?",
      a: "The opposite. Static HTML is the easiest thing on the internet for search engines and AI assistants to read, and the speed helps you rank. The visibility work I sell is built on exactly this kind of output.",
    },
    {
      q: "Can a static site have forms and interactive parts?",
      a: "Yes. Forms, animations, and interactive sections all work, this site has all of them. What static skips is the heavy machinery: databases, logins, and plugin stacks.",
    },
    {
      q: "What if I outgrow it?",
      a: "Then we add exactly what you grew into, or move the content to a CMS build. Nothing about starting static locks you in. The code is yours, and clean, fast content moves anywhere.",
    },
  ],

  cta: {
    heading: "Want the fast, quiet, yours-forever version?",
    body: "Tell me about your business and what the site needs to do. I'll give you a straight answer on whether static is your route, and what the build would take.",
    buttonLabel: "Tell me about your project",
    href: "/contact/",
  },

  form: {
    source: "custom-coded-static page",
    subject: "New Custom Static Inquiry -- chadworks",
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
        name: "update_frequency",
        label: "How often does content change?",
        span: "half",
        options: [
          { value: "rarely", label: "Rarely -- a few times a year" },
          { value: "monthly", label: "Monthly-ish" },
          { value: "weekly", label: "Weekly or more" },
          { value: "unsure", label: "Not sure" },
        ],
      },
      {
        kind: "textarea",
        name: "vision",
        label: "The Vision",
        required: true,
        rows: 4,
        placeholder: "What does the site have to win for you? What's wrong with the current one, if there is one?",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  qualification: {
    heading: "Is static the right route?",
    fit: [
      "Speed, security, and ownership matter more to you than self-editing.",
      "Your content changes occasionally, not weekly.",
    ],
    notFit: [
      "Your team needs to publish content constantly without a developer.",
      "You need carts and checkout. That's the ecommerce conversation.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "You own the code and the hosting outright, from day one.",
      "Every build includes two weeks of free fixes after launch.",
      "It works with a keyboard and a screen reader, because some of your visitors need it to.",
      "Nothing measures a visitor until they agree to it, and there are no ad pixels.",
      "Running costs after launch round to nothing, stated up front.",
      "You get a straight answer on fit before either of us commits.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      { title: "You reach out", body: "Tell me about the business and the site through the form here. I usually reply within a day." },
      { title: "A straight answer", body: "I'll tell you straight whether static fits how your content actually lives." },
      { title: "A scoped plan", body: "If it's a fit, you get a written scope, number, and timeline before any payment." },
      { title: "Build and launch", body: "Custom code, GEO baked in, launched in your name with two weeks of free fixes." },
    ],
  },

  meta: {
    title: "Custom Coded Static Websites -- Fast, Secure, Yours | chadworks",
    description:
      "A custom-coded static website has no CMS, no plugins, and nothing to hack: just fast, custom-built code you own outright. The fastest way a marketing site can exist, with near-zero running costs.",
  },
};
