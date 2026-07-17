// Route: /faqs/ -- standalone page. The FaqAccordion engine, generous, run as
// four themed groups that alternate dark and light bands (rule 9: never two
// inverted sections consecutive; the group before the dark CTA is light). One
// FAQPage JSON-LD covers every question on the page. Copy in Chad's public
// voice, real facts only. Answers are always in the static HTML (GEO/no-JS).

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/service";
import {
  PageComposer,
  HeroCapsule,
  FaqCapsule,
  CtaCapsule,
} from "@/components/capsules";

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
        a: "Me, I build your site. There is no team behind a curtain and no account manager translating your notes to someone offshore. The same person who answers the first message designs the site and writes the code, which is the whole point of hiring one experienced builder instead of an agency.",
        aText:
          "Me, I build your site. There is no team behind a curtain and no account manager translating your notes to someone offshore. The same person who answers the first message designs the site and writes the code, which is the whole point of hiring one experienced builder instead of an agency.",
      },
      {
        q: "Do you work with businesses outside Pennsylvania?",
        a: "Yes, I work with clients across the USA. chadworks is based in Greater Philadelphia, PA, but has worked with clients in many states, and every US mainland timezone.",
        aText:
          "Yes, I work with clients across the USA. chadworks is based in Greater Philadelphia, PA, but has worked with clients in many states, and every US mainland timezone.",
      },
      {
        q: "How long does a website take to build?",
        a: "It depends on the scope of the project. A brochure site with limited content and functionality can take as little as a week. A complex build with custom features, lots of pages and other bells and whistles can take a month, sometimes a few.",
        aText:
          "It depends on the scope of the project. A brochure site with limited content and functionality can take as little as a week. A complex build with custom features, lots of pages and other bells and whistles can take a month, sometimes a few.",
      },
      {
        q: "What do you need from me to get started?",
        a: "First thing is a conversation to set the scope. Then I'll provide a list of what is needed, ranging from hosting/domain access to content like text and images. You will also need to make a deposit, typically 50% of the total cost, for work to commence.",
        aText:
          "First thing is a conversation to set the scope. Then I'll provide a list of what is needed, ranging from hosting/domain access to content like text and images. You will also need to make a deposit, typically 50% of the total cost, for work to commence.",
      },
      {
        q: "Do I need to have the whole scope figured out before we start?",
        a: "No, you don't have to have the scope figured out when you come to me, but part of the first stage of our working relationship will be developing a detailed scope. This way, my proposal-agreement will be robust in a way that prevents scope-creep, which isn't fun for either party.",
        aText:
          "No, you don't have to have the scope figured out when you come to me, but part of the first stage of our working relationship will be developing a detailed scope. This way, my proposal-agreement will be robust in a way that prevents scope-creep, which isn't fun for either party.",
      },
      {
        q: "Can you get a domain name for me?",
        a: "Yes, securing your domain is part of getting set up. If the name you want is already taken, buying it from whoever holds it is sometimes possible, though the price for that swings widely and is never guaranteed.\n\nYour domain name lives in your own account that I am given access to. It doesn't live in my account, so you never have to worry about it being out of reach.",
        aText:
          "Yes, securing your domain is part of getting set up. If the name you want is already taken, buying it from whoever holds it is sometimes possible, though the price for that swings widely and is never guaranteed. Your domain name lives in your own account that I am given access to. It doesn't live in my account, so you never have to worry about it being out of reach.",
      },
      {
        q: "Can you set up branded email accounts for me?",
        a: "Yes, and I recommend it for anyone who wants to be taken seriously. A branded address at your own domain conveys a professionalism in a way that a free Gmail or Yahoo address never will.\n\nMost clients I set up on Google Workspace, which is Gmail with your domain plus Docs, Drive, and the rest, and runs about $7 to $8 a month per account.\n\nIf your work calls for Microsoft 365 instead, I can handle that too, though I only find it necessary for corporate or enterprise setups.",
        aText:
          "Yes, and I recommend it for anyone who wants to be taken seriously. A branded address at your own domain conveys a professionalism in a way that a free Gmail or Yahoo address never will. Most clients I set up on Google Workspace, which is Gmail with your domain plus Docs, Drive, and the rest, and runs about $7 to $8 a month per account. If your work calls for Microsoft 365 instead, I can handle that too, though I only find it necessary for corporate or enterprise setups.",
      },
      {
        q: "Do you use AI to build the sites?",
        a: "Yes, but as a tool that allows me to deliver complex and agency-level work at a fraction of the cost and faster than ever before, not as a replacement for the craft. There is a clear line between using AI to do the heavy lifting and handing the actual creative work to a machine.",
        aText:
          "Yes, but as a tool that allows me to deliver complex and agency-level work at a fraction of the cost and faster than ever before, not as a replacement for the craft. There is a clear line between using AI to do the heavy lifting and handing the actual creative work to a machine.",
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
        a: [
          "My baseline fee for full builds, including redesigns, is $3,250. Most projects end up between $5,000 and $6,000, though it is not uncommon for ambitious projects to crack $10,000.",
          <>
            If your website needs work, not a redesign, I charge by the minute at
            $5.25/min, which adds up to $315/hour. Read more about my fees on my{" "}
            <Link href="/rates/">rates page</Link>.
          </>,
        ],
        aText:
          "My baseline fee for full builds, including redesigns, is $3,250. Most projects end up between $5,000 and $6,000, though it is not uncommon for ambitious projects to crack $10,000. If your website needs work, not a redesign, I charge by the minute at $5.25/min, which adds up to $315/hour. Read more about my fees on my rates page.",
      },
      {
        q: "Do you have a lower rate for special cases?",
        a: "I am always open to hearing out special situations, especially mission driven and social good initiatives. However, if your project has the potential for revenue of any kind, my posted rate is almost certainly what will be charged.",
        aText:
          "I am always open to hearing out special situations, especially mission driven and social good initiatives. However, if your project has the potential for revenue of any kind, my posted rate is almost certainly what will be charged.",
      },
      {
        q: "Is there an ongoing cost after the site is built?",
        a: "Every website has, at the very least, a monthly hosting fee and an annual domain name fee. My in-house hosting starts at $20. Domain fees are set and billed by your domain registrar directly, e.g. GoDaddy, NameCheap, etc.\n\nIf you need to change or expand your site, that work is billed at my minutely rate, or a new flat rate is scoped and assessed to cover the limited update as its own new project.",
        aText:
          "Every website has, at the very least, a monthly hosting fee and an annual domain name fee. My in-house hosting starts at $20. Domain fees are set and billed by your domain registrar directly, e.g. GoDaddy, NameCheap, etc. If you need to change or expand your site, that work is billed at my minutely rate, or a new flat rate is scoped and assessed to cover the limited update as its own new project.",
      },
      {
        q: "How much does website maintenance cost?",
        a: "Most new sites I build are custom coded and static, which don't require maintenance. However, WordPress sites do require ongoing maintenance, which is covered by my Baseline Maintenance Plan at $675 every six months. The BMP covers routine WordPress core, plugin and theme updates, as well as daily backups.",
        aText:
          "Most new sites I build are custom coded and static, which don't require maintenance. However, WordPress sites do require ongoing maintenance, which is covered by my Baseline Maintenance Plan at $675 every six months. The BMP covers routine WordPress core, plugin and theme updates, as well as daily backups.",
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
      {
        q: "Can I edit the site myself after it's built?",
        a: "It depends on how the site is built. A WordPress site comes with a dashboard, and most builds include a 30-minute tutorial so you can update text and images with confidence. A custom-coded static site has no dashboard by design, which is part of what makes it fast and secure, so content changes come back through me. Either way, you own everything and nothing is locked away, and if a WordPress edit ever goes sideways, backups make it easy to roll back.",
        aText:
          "It depends on how the site is built. A WordPress site comes with a dashboard, and most builds include a 30-minute tutorial so you can update text and images with confidence. A custom-coded static site has no dashboard by design, which is part of what makes it fast and secure, so content changes come back through me. Either way, you own everything and nothing is locked away, and if a WordPress edit ever goes sideways, backups make it easy to roll back.",
      },
      {
        q: "Will my site be secure?",
        a: "Yes. Every site ships with an SSL certificate, and a custom-coded static build raises the bar further: with no database and no login to attack, most of the usual break-in routes simply are not there. Still, it's true that no site anywhere is completely hacker-proof, since even Visa and the Social Security system have been breached. What I can promise is that your site is built to remove the easy targets.",
        aText:
          "Yes. Every site ships with an SSL certificate, and a custom-coded static build raises the bar further: with no database and no login to attack, most of the usual break-in routes simply are not there. Still, it's true that no site anywhere is completely hacker-proof, since even Visa and the Social Security system have been breached. What I can promise is that your site is built to remove the easy targets.",
      },
      {
        q: "Do you handle privacy policy, cookies, and GDPR?",
        a: "Yes. Every site launches with a privacy policy and, where it is needed, a cookie notice and consent banner, so you are covered on the basics from day one. If your audience reaches into the EU or the UK, I build in the GDPR pieces that apply to how your site actually collects data. I am not your lawyer, and a business with serious compliance exposure should have counsel review the language, but you won't launch missing the standard protections.",
        aText:
          "Yes. Every site launches with a privacy policy and, where it is needed, a cookie notice and consent banner, so you are covered on the basics from day one. If your audience reaches into the EU or the UK, I build in the GDPR pieces that apply to how your site actually collects data. I am not your lawyer, and a business with serious compliance exposure should have counsel review the language, but you won't launch missing the standard protections.",
      },
      {
        q: "Can you set up a newsletter or mailing list?",
        a: "Yes. Most sites include a subscribe form in the spots where a visitor is most likely to sign up, feeding straight into your list. Connecting and configuring the email platform behind it is usually an add-on service, since the tool and its pricing depend on how you plan to use it.",
        aText:
          "Yes. Most sites include a subscribe form in the spots where a visitor is most likely to sign up, feeding straight into your list. Connecting and configuring the email platform behind it is usually an add-on service, since the tool and its pricing depend on how you plan to use it.",
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
      {
        q: "Do I get analytics to see my traffic?",
        a: "Yes. Every site launches with Google Analytics wired in, so from day one you can see who is visiting and which pages actually hold their attention. It is the free, industry-standard tracking the big sites run on, and I confirm it is reading correctly before the site goes live.",
        aText:
          "Yes. Every site launches with Google Analytics wired in, so from day one you can see who is visiting and which pages actually hold their attention. It is the free, industry-standard tracking the big sites run on, and I confirm it is reading correctly before the site goes live.",
      },
      {
        q: "How long does SEO take to work?",
        a: "Expect the first upward movement around the three-month mark. Reaching page one, and then the top of it, usually runs from six months to a year, and the most competitive terms can take longer still. It comes down to who you are up against: outranking a National Geographic on nature terms or a VistaPrint on printing terms is a different mountain than owning your own niche. I'm realistic with my clients when we discuss and set these kinds of goals.",
        aText:
          "Expect the first upward movement around the three-month mark. Reaching page one, and then the top of it, usually runs from six months to a year, and the most competitive terms can take longer still. It comes down to who you are up against: outranking a National Geographic on nature terms or a VistaPrint on printing terms is a different mountain than owning your own niche. I'm realistic with my clients when we discuss and set these kinds of goals.",
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
    <PageComposer jsonLd={[breadcrumbJsonLd, faqJsonLd]}>
      <HeroCapsule
        className="faqs-hero"
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
        eyebrow="Common questions about websites and visibility"
        title="Frequently Asked Questions"
        lede="Everything people ask before hiring chadworks, grouped so you can jump to what you came for: working together, what it costs, how the site gets built, and getting found in search and AI."
      />

      {/* FOUR THEMED GROUPS -- each a full band; dark and light alternate by
          index (inside the capsule) so no two dark sections ever stack (rule 9).
          The last group lands light, ahead of the dark CTA. */}
      <FaqCapsule variant="groups" groups={GROUPS} />

      <CtaCapsule
        scheme="inverted"
        cta={{
          heading: "Still have a question?",
          body:
            "Ask it directly and you will get the same straight answer, from the person who would actually do the work, usually within a day.",
          buttonLabel: "Ask Chad directly",
          href: "/contact/",
        }}
      />
    </PageComposer>
  );
}
