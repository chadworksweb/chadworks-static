// Route: /visibility/ -- the VISIBILITY lane hub. Carries the "do it all"
// consolidation thesis, then lanes out to every visibility service. Copy in
// Chad's public voice.

import type { Metadata } from "next";
import HubTemplate, { type HubConfig } from "@/components/HubTemplate";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { VisibilityHeroArt } from "@/components/art/VisibilityHeroArt";

const hub: HubConfig = {
  slug: "visibility",
  eyebrow: "chadworks Service Lane 02",
  title: "Visibility",
  answer: (
    <>
      Visibility is the state of being found on the internet. That covers
      ranking on Google and getting cited or suggested by the AI chatbots and
      assistants people now ask instead. Do you want to be found online? Good.
      I&apos;ll make it
      happen. You don&apos;t need to know the acronyms to know what you want,
      and I don&apos;t need to sell you each piece as an add-on or an upcharge.
    </>
  ),
  heroArt: <VisibilityHeroArt />,
  thesis: {
    heading: "Want to be visible online in the AI era?",
    subheading: "Then you have to do it all.",
    paragraphs: [
      <>
        Before AI, you could put in the work to show up on Google Search and
        get somewhere. You could also build a following on social media and
        convert from there. You could get lots of reviews on Google Maps and
        show up there. Now, with AI assistants like ChatGPT taking over how
        consumers find what they&apos;re looking for, you have to do it all.
      </>,
      { heading: 'What does "do it all" mean?' },
      <>
        Clients, customers and consumers don&apos;t just search Google anymore.
        In fact, many are ditching Google&apos;s traditional search results
        entirely in favor of the AI answers and leading AI assistants like
        ChatGPT and Perplexity. These AI assistants use more rigorous methods
        of ranking than Google search did, placing more weight on external
        sources and consistency across platforms like social media, Reddit,
        YouTube, press and directories.
      </>,
      { heading: 'How can I "do it all?"' },
      <>
        Well, it&apos;s not easy! Or fast. Or obvious. But it can be done,
        especially with my help. The services on this page all contribute to
        your overall visibility. The first step is having me complete an AI
        Visibility Audit. From there, we&apos;ll be able to pinpoint exactly
        where to start to increase your overall visibility online, leading to
        more leads, sales or sign ups, depending on what your goals are.{" "}
        <a href="#contact">Contact me</a> to start a conversation about your
        online visibility.
      </>,
    ],
  },
  lanes: [
    {
      label: "AI Search Visibility",
      detail: "A package of services that help you get found on AI search assistants like ChatGPT and Perplexity for a flat monthly rate.",
      href: "/ai-search-visibility/",
    },
    {
      label: "AI Visibility Audit",
      detail: "A one-time deep dive into the state of your brand's visibility, including on-site content and technical issues, and off-site signals. Delivered as an actionable report document.",
      href: "/ai-visibility-audit/",
    },
    {
      label: "SEO",
      detail: "Traditional search engine optimization service that helps you rank higher on Google. Separate from but a foundation of AI search visibility.",
      href: "/seo/",
    },
    {
      label: "Digital Marketing",
      detail: "Consulting service to determine what marketing channels you actually need to meet your brand or business goals online. May be followed up with bespoke execution.",
      href: "/digital-marketing/",
    },
    {
      label: "Email Marketing",
      detail: "The long-running champ of digital marketing channels with the highest ROI. I'll help you build your email list and market directly to them.",
      href: "/email-marketing/",
    },
    {
      label: "Show Up on ChatGPT",
      detail: "Detailed and interactive explainer page of what goes into showing up on ChatGPT.",
      href: "/show-up-on-chatgpt/",
    },
    {
      label: "Advertising on ChatGPT",
      detail: "Informative and interactive page about paid advertising on ChatGPT.",
      href: "/advertising-on-chatgpt/",
    },
  ],
  cta: {
    heading: "Want to know where you actually stand?",
    body: "Tell me your business and I'll look at where you show up right now: in search, in the AI assistants, and everywhere your buyers check. You'll get a straight answer on the gap, before anyone commits to anything.",
  },
  form: {
    source: "visibility hub",
    subject: "New Visibility Inquiry -- chadworks",
    submitLabel: "Send it to Chad",
    successMessage: "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "url", name: "site", label: "Your Site", required: true, placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "goal",
        label: "The Goal",
        span: "half",
        options: [
          { value: "ai", label: "Show up in AI answers" },
          { value: "search", label: "Rank in Google" },
          { value: "both", label: "All of it" },
          { value: "audit", label: "Just tell me where I stand" },
        ],
      },
      {
        kind: "textarea",
        name: "situation",
        label: "Where do you show up today?",
        rows: 4,
        placeholder: "What do people find when they search for what you do? Have you ever asked ChatGPT about your own business?",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },
};

export const metadata: Metadata = {
  title: "Visibility | Stay visible online with chadworks",
  description:
    "Visibility is being found online. It includes SEO, AIO/GEO, digital marketing and social media presence.",
  alternates: { canonical: `${SITE_URL}/visibility/` },
  // Launch-driven, and REQUIRED: layout.tsx defaults every route to noindex, so being
  // in launch.ts alone would put this in the sitemap while still serving noindex.
  robots: { index: isLaunched("/visibility/"), follow: true },
  openGraph: {
    // Mirrors the meta title, as it did before -- the two were the same string.
    title: "Visibility | Stay visible online with chadworks",
    description:
      "Be found in Google and quoted by AI assistants. One umbrella service with every piece underneath.",
    url: `${SITE_URL}/visibility/`,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
};

export default function VisibilityHubPage() {
  return <HubTemplate hub={hub} />;
}
