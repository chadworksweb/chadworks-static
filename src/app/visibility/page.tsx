// Route: /visibility/ -- the VISIBILITY lane hub. Carries the "do it all"
// consolidation thesis, then lanes out to every visibility service. Copy in
// Chad's public voice.

import type { Metadata } from "next";
import HubTemplate, { type HubConfig } from "@/components/HubTemplate";
import { SITE_URL } from "@/lib/service";
import { VisibilityHeroArt } from "@/components/art/VisibilityHeroArt";

const hub: HubConfig = {
  slug: "visibility",
  eyebrow: "Lane two: being found",
  title: "Visibility",
  answer: (
    <>
      Visibility is being found and chosen: in Google, in the AI assistants
      people now ask instead of Google, and in the inbox. I&apos;m Chad, and
      I&apos;ve spent 20 years getting businesses in front of the people
      looking for them. The work has consolidated, and so has the way I sell
      it: one umbrella, with every piece underneath.
    </>
  ),
  heroArt: <VisibilityHeroArt />,
  thesis: {
    heading: "Want to be visible in this day and age?",
    subheading: "Then you have to do it all.",
    paragraphs: [
      <>
        Buyers don&apos;t just search anymore. They ask ChatGPT who to hire,
        skim a Google page that now answers questions itself, and check that
        your business looks alive before they reach out. Showing up in one
        of those places and missing the others reads as not showing up.
      </>,
      <>
        That&apos;s why AI visibility is the umbrella here, not an add-on.
        Being quoted by AI assistants requires real SEO underneath. It
        requires a social presence that exists and matches your business,
        though not follower-chasing, which I don&apos;t sell. Each layer
        pulls in the next, so the honest offer is the whole stack, retained
        and maintained, by the same person who builds the sites it points to.
      </>,
    ],
  },
  lanesHeading: "The visibility services",
  lanesIntro:
    "AI Visibility is the complete answer. The rest are real, sellable pieces of it, here for when you know exactly which piece you need.",
  lanes: [
    {
      label: "AI Visibility",
      detail: "The umbrella, sold as an ongoing service: be found and quoted by the AI assistants people now ask, with the SEO and presence work that requires.",
      href: "/ai-viz/",
    },
    {
      label: "AI Visibility Audit",
      detail: "The one-time version: where you show up today, where you don't, and exactly what it would take. Yours to act on with anyone.",
      href: "/ai-visibility-audit/",
    },
    {
      label: "SEO",
      detail: "The classic discipline, still real: ranking in search for the phrases your buyers actually type.",
      href: "/seo/",
    },
    {
      label: "Digital Marketing",
      detail: "The broad sweep: the channels, the strategy, and the straight answer on which ones your business actually needs.",
      href: "/digital-marketing/",
    },
    {
      label: "Email Marketing",
      detail: "The channel you own: the list, the sends, and the setup that doesn't land in spam.",
      href: "/email-marketing/",
    },
    {
      label: "Show Up on ChatGPT",
      detail: "The specific question everyone suddenly has, answered: how a business gets recommended by AI assistants.",
      href: "/show-up-on-chatgpt/",
    },
    {
      label: "Advertising on ChatGPT",
      detail: "The other half of that question: what paid placement in AI assistants is, and what's actually worth buying.",
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
  title: "Visibility -- Found in Google, Quoted by AI | chadworks",
  description:
    "Visibility is being found and chosen: in Google, in the AI assistants people now ask instead, and in the inbox. AI visibility is the umbrella; SEO, presence, and email are the pieces underneath. I do it all, as one ongoing service.",
  alternates: { canonical: `${SITE_URL}/visibility/` },
  openGraph: {
    title: "Visibility -- Found in Google, Quoted by AI | chadworks",
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
