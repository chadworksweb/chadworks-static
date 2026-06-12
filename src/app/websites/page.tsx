// Route: /websites/ -- the WEBSITES lane hub. Thin by design: hero, the
// seven service lanes, CTA + hub form. Copy in Chad's public voice.

import type { Metadata } from "next";
import type { ReactNode, CSSProperties } from "react";
import HubTemplate, { type HubConfig } from "@/components/HubTemplate";
import { SITE_URL } from "@/lib/service";
import {
  BrowserChip,
  CodeChip,
  ServerChip,
  TerminalChip,
} from "@/components/art/WebDevHeroArt";
import {
  PaletteChip,
  LayoutChip,
  ButtonChip,
  TypeChipDark,
  WheelChip,
} from "@/components/art/WebDesignHeroArt";
import {
  CustomCodedViz,
  WordPressViz,
  EcommerceViz,
  ShopifyViz,
} from "@/components/art/BuildPathViz";

// Mixed design + development chip set for the lane that contains both.
// Scatter constraint: left% x 360 + width <= 360 for every chip.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "browser", svg: <BrowserChip />, style: { left: "4%", width: "176px", animationDelay: "0s", animationDuration: "26.5s" } },   // 190/360
  { key: "palette", svg: <PaletteChip />, style: { left: "56%", width: "126px", animationDelay: "5s", animationDuration: "21.9s" } },  // 328/360
  { key: "layout", svg: <LayoutChip />, style: { left: "24%", width: "150px", animationDelay: "11s", animationDuration: "28.8s" } },   // 236/360
  { key: "terminal", svg: <TerminalChip />, style: { left: "68%", width: "104px", animationDelay: "2s", animationDuration: "24.2s" } }, // 349/360
  { key: "code", svg: <CodeChip />, style: { left: "14%", width: "118px", animationDelay: "8s", animationDuration: "19.6s" } },        // 168/360
  { key: "button", svg: <ButtonChip />, style: { left: "46%", width: "110px", animationDelay: "15s", animationDuration: "25.3s" } },   // 276/360
  { key: "typedark", svg: <TypeChipDark />, style: { left: "60%", width: "94px", animationDelay: "13s", animationDuration: "29.9s" } }, // 310/360
  { key: "wheel", svg: <WheelChip />, style: { left: "36%", width: "70px", animationDelay: "18s", animationDuration: "20.7s" } },      // 200/360
  { key: "server", svg: <ServerChip />, style: { left: "6%", width: "130px", animationDelay: "21s", animationDuration: "23s" } },      // 152/360
];

function WebsitesHubArt() {
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

const hub: HubConfig = {
  slug: "websites",
  eyebrow: "Lane one: the thing you own",
  title: "Websites",
  answer: (
    <>
      A website is the one piece of your business you fully own on the
      internet. I&apos;m Chad, and I&apos;ve been designing and developing
      websites for 20 years: the look, the code, the hosting, all custom
      built and all in your name. Two angles to start from, four ways to
      build, one person responsible for the whole thing.
    </>
  ),
  heroArt: <WebsitesHubArt />,
  lanesHeading: "Pick your way in",
  lanesIntro:
    "Start from the angle that matches how you already think about it. Every route below ends in the same place: a fast site that looks like your business and belongs to you.",
  lanes: [
    {
      label: "Web Design",
      detail: "The visual half: layout, color, type, and the path that turns a stranger into a customer. Never from a theme.",
      href: "/web-design/",
    },
    {
      label: "Web Development",
      detail: "The code half: the structure that makes a site fast, findable, and stable for years.",
      href: "/web-development/",
    },
    {
      label: "Web Design Packages",
      detail: "The scoped routes: a defined build at a defined number, for when you want the decision made simple.",
      href: "/web-design-packages/",
    },
    {
      label: "Custom Coded / Static",
      detail: "The purest build: custom code with nothing to update or break, and entirely yours.",
      href: "/custom-coded-static/",
      viz: <CustomCodedViz />,
    },
    {
      label: "WordPress",
      detail: "The familiar CMS, done right: you manage the content, I keep it from reading as a theme.",
      href: "/wordpress/",
      viz: <WordPressViz />,
    },
    {
      label: "Ecommerce",
      detail: "Selling directly: built around your products and how people actually buy them.",
      href: "/ecommerce/",
      viz: <EcommerceViz />,
    },
    {
      label: "Shopify",
      detail: "Selling without the upkeep: a custom face on the platform that does the heavy lifting.",
      href: "/shopify/",
      viz: <ShopifyViz />,
    },
  ],
  cta: {
    heading: "Know exactly what you need, or not even close?",
    body: "Both are fine starting points. Tell me about your business and I'll tell you straight which route fits, what it would take, and whether we're a match, before anyone commits to anything.",
  },
  form: {
    source: "websites hub",
    subject: "New Website Inquiry -- chadworks",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "current_site", label: "Current Site (if you have one)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "route",
        label: "Which route sounds like you?",
        span: "half",
        options: [
          { value: "design", label: "I need it designed" },
          { value: "development", label: "I need it built" },
          { value: "both", label: "Both, start to finish" },
          { value: "unsure", label: "No idea, that's why I'm here" },
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
};

export const metadata: Metadata = {
  title: "Websites -- Custom Designed, Custom Built, Yours | chadworks",
  description:
    "A website is the one piece of your business you fully own on the internet. I design and develop custom websites: the look, the code, and the hosting, all in your name. Four ways to build, two angles to start from.",
  alternates: { canonical: `${SITE_URL}/websites/` },
  openGraph: {
    title: "Websites -- Custom Designed, Custom Built, Yours | chadworks",
    description:
      "Custom websites designed and developed by one person: the look, the code, and the hosting, all in your name.",
    url: `${SITE_URL}/websites/`,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
};

export default function WebsitesHubPage() {
  return <HubTemplate hub={hub} />;
}
