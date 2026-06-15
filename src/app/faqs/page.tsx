// Route: /faqs/ -- standalone page. The FaqAccordion engine, generous, run as
// four themed groups that alternate dark and light bands (rule 9: never two
// inverted sections consecutive; the group before the dark CTA is light). One
// FAQPage JSON-LD covers every question on the page. Copy in Chad's public
// voice, real facts only. Answers are always in the static HTML (GEO/no-JS).

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/service";
import { CtaButton } from "@/components/ServiceTemplate";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageMotion } from "@/components/PageMotion";

const PAGE_URL = `${SITE_URL}/faqs/`;
const TITLE = "FAQs: Working With chadworks, Costs, and Getting Found | chadworks";
const DESCRIPTION =
  "Straight answers about working with chadworks: who builds your site, what it costs ($315/hour, $3,200 floor, most near $6,200), how the site gets built and owned, and how a business gets found in classic search and AI assistants.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// Each group is one full band; the page alternates dark/light by index so no
// two dark sections ever stack (rule 9). `a` holds ReactNode for inline links;
// `aText` is the plain-text twin that goes into FAQPage schema (GEO checklist 2).
type Faq = { q: string; a: ReactNode; aText: string };
type FaqGroup = { theme: string; lead: string; items: Faq[] };

const GROUPS: FaqGroup[] = [
  {
    theme: "Working together",
    lead:
      "What it's actually like to hire chadworks, before you send the first email.",
    items: [
      {
        q: "Who actually builds my site?",
        a: "Chad Lewine, the person you email. There is no team behind a curtain and no account manager translating your notes to someone offshore. The same person who answers the first message designs the site and writes the code, which is the whole point of hiring one experienced builder instead of an agency.",
        aText:
          "Chad Lewine, the person you email. There is no team behind a curtain and no account manager translating your notes to someone offshore. The same person who answers the first message designs the site and writes the code, which is the whole point of hiring one experienced builder instead of an agency.",
      },
      {
        q: "Do you work with businesses outside Pennsylvania?",
        a: "Yes. The work is remote, and clients sit across the country and beyond, from Brooklyn to North Alabama. chadworks is based in Pennsylvania, but where you are has never decided whether the work fits.",
        aText:
          "Yes. The work is remote, and clients sit across the country and beyond, from Brooklyn to North Alabama. chadworks is based in Pennsylvania, but where you are has never decided whether the work fits.",
      },
      {
        q: "How long does a website take to build?",
        a: "It depends on the scope, and you get a real timeline with your quote rather than a guess here. A focused site moves faster than a full build with deep structure and visibility work. What does not change is that you stay in the loop the whole way, with no long silences where you wonder what is happening.",
        aText:
          "It depends on the scope, and you get a real timeline with your quote rather than a guess here. A focused site moves faster than a full build with deep structure and visibility work. What does not change is that you stay in the loop the whole way, with no long silences where you wonder what is happening.",
      },
      {
        q: "What do you need from me to get started?",
        a: (
          <>
            A conversation. Tell me the business, what you want the site to do,
            and where it is stuck today. From there you get a straight answer on
            whether it is a fit and what it would take. The{" "}
            <Link href="/contact/">contact page</Link> is the fastest way to
            start.
          </>
        ),
        aText:
          "A conversation. Tell me the business, what you want the site to do, and where it is stuck today. From there you get a straight answer on whether it is a fit and what it would take. The contact page is the fastest way to start.",
      },
    ],
  },
  {
    theme: "What it costs",
    lead:
      "The money questions, answered the same way they are on the rates page: plainly.",
    items: [
      {
        q: "How much does a website cost?",
        a: (
          <>
            Work bills at $315 an hour. The smallest engagement is $3,200, and
            most websites land near $6,200. Those are the real numbers, scoped
            to what you actually want before any work begins. The{" "}
            <Link href="/rates/">rates page</Link> lays out the full breakdown,
            with the math showing.
          </>
        ),
        aText:
          "Work bills at $315 an hour. The smallest engagement is $3,200, and most websites land near $6,200. Those are the real numbers, scoped to what you actually want before any work begins. The rates page lays out the full breakdown, with the math showing.",
      },
      {
        q: "Why are you not the cheapest option?",
        a: "Deliberately. The rate reflects twenty years of doing this and a result you can point to, not a number set to undercut the next bid. If the lowest price is the thing that decides it, there are cheaper builders who will be glad to help, and that is an honest answer rather than a sales dodge.",
        aText:
          "Deliberately. The rate reflects twenty years of doing this and a result you can point to, not a number set to undercut the next bid. If the lowest price is the thing that decides it, there are cheaper builders who will be glad to help, and that is an honest answer rather than a sales dodge.",
      },
      {
        q: "Is there an ongoing cost after the site is built?",
        a: (
          <>
            Only if you want one. WordPress maintenance runs $550 every 6 months
            for clients who want the site cared for: updates, backups, and a
            human watching for quiet breakage. A{" "}
            <Link href="/custom-coded-static/">custom-coded static site</Link>{" "}
            needs far less upkeep, which is part of why it costs less to own over
            the years.
          </>
        ),
        aText:
          "Only if you want one. WordPress maintenance runs $550 every 6 months for clients who want the site cared for: updates, backups, and a human watching for quiet breakage. A custom-coded static site needs far less upkeep, which is part of why it costs less to own over the years.",
      },
      {
        q: "Do you offer monthly payments for a website?",
        a: "Monthly website financing is not something chadworks offers anymore. Projects are typically split into milestones instead, so you pay against work that has been delivered rather than all at once up front.",
        aText:
          "Monthly website financing is not something chadworks offers anymore. Projects are typically split into milestones instead, so you pay against work that has been delivered rather than all at once up front.",
      },
    ],
  },
  {
    theme: "How the site gets built",
    lead:
      "The build choices behind the site, and what stays yours when it ships.",
    items: [
      {
        q: "Custom-coded or WordPress: which is right for me?",
        a: (
          <>
            It depends on who needs to edit the site and how much it changes. A{" "}
            <Link href="/custom-coded-static/">custom-coded static site</Link> is
            the fastest and most durable route. <Link href="/wordpress/">WordPress</Link>{" "}
            makes sense when a non-technical team needs to publish often. You get
            a straight recommendation for your situation, not a default pushed on
            everyone.
          </>
        ),
        aText:
          "It depends on who needs to edit the site and how much it changes. A custom-coded static site is the fastest and most durable route. WordPress makes sense when a non-technical team needs to publish often. You get a straight recommendation for your situation, not a default pushed on everyone.",
      },
      {
        q: "Do I own my website when it is finished?",
        a: "Completely, from day one. Code, hosting, domain, and every account are in your name. Nothing is held hostage and there is no platform lock-in designed to keep you paying. If you ever move on, you take all of it with you.",
        aText:
          "Completely, from day one. Code, hosting, domain, and every account are in your name. Nothing is held hostage and there is no platform lock-in designed to keep you paying. If you ever move on, you take all of it with you.",
      },
      {
        q: "Will my site actually be fast?",
        a: (
          <>
            That is the priority, not an afterthought. A{" "}
            <Link href="/custom-coded-static/">custom-coded static build</Link> is
            the fastest route there is, and chadworks.co is one of them, doing
            its own job in public. Speed is also a visibility advantage now,
            because clean, fast pages are easier for both search engines and AI
            assistants to read.
          </>
        ),
        aText:
          "That is the priority, not an afterthought. A custom-coded static build is the fastest route there is, and chadworks.co is one of them, doing its own job in public. Speed is also a visibility advantage now, because clean, fast pages are easier for both search engines and AI assistants to read.",
      },
      {
        q: "Can you redesign my site or move me off Squarespace or Wix?",
        a: (
          <>
            Yes, and a common reason people reach out. Moving to a clean, custom
            build is usually faster and easier for AI tools to read. On WordPress
            and want off? The{" "}
            <Link href="/switch/leave-wordpress/">leave WordPress</Link> page
            walks through exactly what the move looks like.
          </>
        ),
        aText:
          "Yes, and a common reason people reach out. Moving to a clean, custom build is usually faster and easier for AI tools to read. On WordPress and want off? The leave WordPress page walks through exactly what the move looks like.",
      },
    ],
  },
  {
    theme: "Getting found in search and AI",
    lead:
      "How a business shows up in Google, in AI assistants, and in the answers people actually read.",
    items: [
      {
        q: "Can you get my business to show up in ChatGPT and Google's AI Overview?",
        a: (
          <>
            It is the work chadworks leads with, and there is real precedent for
            it. A Pennsylvania criminal-defense firm now appears in Google's AI
            Overview for its practice area, and a Brooklyn psychologist is named
            by AI assistants in his market. The{" "}
            <Link href="/ai-viz/">AI visibility</Link> page lays out the full
            approach.
          </>
        ),
        aText:
          "It is the work chadworks leads with, and there is real precedent for it. A Pennsylvania criminal-defense firm now appears in Google's AI Overview for its practice area, and a Brooklyn psychologist is named by AI assistants in his market. The AI visibility page lays out the full approach.",
      },
      {
        q: "Is SEO dead now that everyone uses AI?",
        a: (
          <>
            No. Classic <Link href="/seo/">SEO</Link> is the foundation that AI
            visibility is built on, because the assistants pull from the same
            search index and the same structured pages. A site that ranks on page
            one is a site the AI answers are more likely to cite. The two reinforce
            each other rather than replace each other.
          </>
        ),
        aText:
          "No. Classic SEO is the foundation that AI visibility is built on, because the assistants pull from the same search index and the same structured pages. A site that ranks on page one is a site the AI answers are more likely to cite. The two reinforce each other rather than replace each other.",
      },
      {
        q: "What is an AI visibility audit?",
        a: (
          <>
            A one-time, documented read on where a business stands in AI answers,
            classic search, structured data, and its profiles, scored so you can
            see exactly what is working and what is not. It comes as a flat quote
            with no retainer inside. The{" "}
            <Link href="/ai-visibility-audit/">AI visibility audit</Link> page
            shows what gets checked.
          </>
        ),
        aText:
          "A one-time, documented read on where a business stands in AI answers, classic search, structured data, and its profiles, scored so you can see exactly what is working and what is not. It comes as a flat quote with no retainer inside. The AI visibility audit page shows what gets checked.",
      },
      {
        q: "Do you do advertising on ChatGPT?",
        a: (
          <>
            chadworks has access to OpenAI's ChatGPT advertising beta and can set
            it up and manage it. The honest part: OpenAI requires a minimum spend
            of $25 a day, billed by OpenAI directly, on top of the management.
            Whether it is worth it depends on the business, and the{" "}
            <Link href="/digital-marketing/">digital marketing</Link> page gives
            you a straight read.
          </>
        ),
        aText:
          "chadworks has access to OpenAI's ChatGPT advertising beta and can set it up and manage it. The honest part: OpenAI requires a minimum spend of $25 a day, billed by OpenAI directly, on top of the management. Whether it is worth it depends on the business, and the digital marketing page gives you a straight read.",
      },
    ],
  },
];

// FAQPage JSON-LD (GEO checklist 2): one page entity covering every question
// across all four groups, built from the plain-text answer twins.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROUPS.flatMap((g) =>
    g.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.aText },
    }))
  ),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "FAQs", item: PAGE_URL },
  ],
};

export default function FaqsPage() {
  return (
    <>
      <PageMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO -- the only H1. Answer-first lede orients the page. */}
      <section className="section svc-hero faqs-hero">
        <nav className="svc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">FAQs</span>
        </nav>

        <p className="eyebrow">Questions, answered</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">Frequently asked questions</span>
        </h1>
        <p className="svc-lede measure-prose">
          Everything people ask before hiring chadworks, grouped so you can jump
          to what you came for: working together, what it costs, how the site
          gets built, and getting found in search and AI.
        </p>
      </section>

      {/* FOUR THEMED GROUPS -- each a full band; dark and light alternate by
          index so no two dark sections ever stack (rule 9). The group before
          the dark CTA lands light. Each group reuses the svc-faq layout
          (sticky theme column left, accordion right). */}
      {GROUPS.map((group, gi) => {
        const dark = gi % 2 === 0;
        return (
          <section
            key={group.theme}
            className={`section full svc-block svc-faq-section reveal${dark ? " svc-faq-section--dark" : ""}`}
          >
            <div className="svc-faq__layout">
              <div className="svc-faq__intro">
                <p className="cw-faq-group__kicker">{String(gi + 1).padStart(2, "0")}</p>
                <h2 className="svc-block__heading svc-fill">{group.theme}</h2>
                <p className="svc-faq__lead">{group.lead}</p>
              </div>
              <FaqAccordion items={group.items.map((f) => ({ q: f.q, a: f.a }))} />
            </div>
          </section>
        );
      })}

      {/* CTA -- dark band. The group above it is light (group 4), so two dark
          bands never stack. */}
      <section className="section full band-dark svc-cta reveal">
        <div className="svc-cta__panel">
          <h2 className="svc-cta__heading">Still have a question?</h2>
          <p className="svc-cta__body measure-prose">
            Ask it directly and you will get the same straight answer, from the
            person who would actually do the work, usually within a day.
          </p>
          <CtaButton href="/contact/" label="Ask Chad directly" />
        </div>
      </section>
    </>
  );
}
