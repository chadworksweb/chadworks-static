// Route: /faqs/ -- standalone page. The FaqAccordion engine, generous, run as
// four themed groups that alternate dark and light bands (rule 9: never two
// inverted sections consecutive; the group before the dark CTA is light). One
// FAQPage JSON-LD covers every question on the page. Copy in Chad's public
// voice, real facts only. Answers are always in the static HTML (GEO/no-JS).

import type { Metadata } from "next";
import { LaunchLink } from "@/components/LaunchLink";
import { Fragment, type ReactNode } from "react";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import {
  PageComposer,
  HeroCapsule,
  FaqCapsule,
  MainContactCapsule,
} from "@/components/capsules";
import { FaqParas } from "@/components/FaqAccordion";
import { BASE, money } from "@/lib/package-builder";
import {
  ADS_MIN_DAILY_SPEND,
  VISIBILITY_AUDIT,
  HIGH,
  HOURLY_LONG,
  LOW,
  MINUTELY,
  STATIC_HOSTING,
  WORKSPACE_MONTHLY_HIGH,
  WORKSPACE_MONTHLY_LOW,
  WORDPRESS_CARE,
} from "@/lib/pricing";

const ROUTE = "/faqs/";
const PAGE_URL = `${SITE_URL}${ROUTE}`;
const TITLE = "FAQs | chadworks";
const DESCRIPTION =
  "Frequently asked questions about working with chadworks, including prices, process and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // Launch-driven, and REQUIRED: layout.tsx defaults every route to noindex, so
  // being in launch.ts alone would still serve noindex. Both edits or neither.
  robots: { index: isLaunched(ROUTE), follow: true },
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
    theme: "General FAQs",
    lead:
      "Frequently asked questions about working with chadworks",
    items: [
      {
        q: "Who actually builds my site?",
        a: "Me, I build your site. There is no team behind a curtain and no account manager translating your notes to someone offshore. The same person who answers the first message designs the site and writes the code, which is the whole point of hiring one experienced builder instead of an agency.",
        aText:
          "Me, I build your site. There is no team behind a curtain and no account manager translating your notes to someone offshore. The same person who answers the first message designs the site and writes the code, which is the whole point of hiring one experienced builder instead of an agency.",
      },
      {
        // The availability posture (CWS-EXPANSION-PLAN-01 item K), in Chad's
        // words. Sits directly under "who builds it" because it is the follow-up
        // question to "there is no team": one person means a real ceiling, and
        // the ceiling is the product rather than an apology for it.
        q: "How many projects do you take on at once?",
        a: (
          <>
            I can take on 3-5 substantial projects at once. I take on clients
            based on the philosophy outlined in my{" "}
            <LaunchLink href="/are-we-a-good-fit/">Are We A Good Fit</LaunchLink>{" "}
            page, not capacity or who has the biggest budget.
          </>
        ),
        aText:
          "I can take on 3-5 substantial projects at once. I take on clients based on the philosophy outlined in my Are We A Good Fit page, not capacity or who has the biggest budget.",
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
        a: `Yes, and I recommend it for anyone who wants to be taken seriously. A branded address at your own domain conveys a professionalism in a way that a free Gmail or Yahoo address never will.\n\nMost clients I set up on Google Workspace, which is Gmail with your domain plus Docs, Drive, and the rest, and runs about ${money(WORKSPACE_MONTHLY_LOW)} to ${money(WORKSPACE_MONTHLY_HIGH)} a month per account.\n\nIf your work calls for Microsoft 365 instead, I can handle that too, though I only find it necessary for corporate or enterprise setups.`,
        aText:
          `Yes, and I recommend it for anyone who wants to be taken seriously. A branded address at your own domain conveys a professionalism in a way that a free Gmail or Yahoo address never will. Most clients I set up on Google Workspace, which is Gmail with your domain plus Docs, Drive, and the rest, and runs about ${money(WORKSPACE_MONTHLY_LOW)} to ${money(WORKSPACE_MONTHLY_HIGH)} a month per account. If your work calls for Microsoft 365 instead, I can handle that too, though I only find it necessary for corporate or enterprise setups.`,
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
    theme: "Pricing FAQs",
    lead:
      "Frequently asked questions about the costs, fees and pricing of website design and development.",
    items: [
      {
        q: "How much does a website cost?",
        a: (
          <FaqParas
            items={[
              // A Fragment rather than a string because of the closing link
              // (Chad, 2026-08-17). Same keying rule as the paragraph below.
              <Fragment key="baseline">
                My baseline fee for full builds, including redesigns, is{" "}
                {money(BASE)}. Most projects end up between {LOW} and {HIGH},
                though it is not uncommon for ambitious projects to crack{" "}
                {HIGH}. Visit my{" "}
                <LaunchLink href="/how-much-does-a-website-cost/">
                  website costs page
                </LaunchLink>{" "}
                for a detailed breakdown.
              </Fragment>,
              // KEYED FRAGMENT, not a bare <> (fixed 2026-08-14). This array is
              // built here and passed to FaqParas as a prop, so React validates
              // it as a list at the point of creation and the <p key={i}> inside
              // FaqParas does not satisfy it. One unkeyed element here was the
              // "Each child in a list should have a unique key prop" error this
              // page threw on every render. The string item above needs no key;
              // only elements are validated. A bare <> cannot take a key.
              <Fragment key="minutely">
                If your website needs work, not a redesign, I charge by the minute
                at {money(MINUTELY)}/min, which adds up to {HOURLY_LONG}.
                Read more about my fees on my{" "}
                <LaunchLink href="/rates/">rates page</LaunchLink>, or put a
                number on your own scope with the{" "}
                <LaunchLink href="/website-design-cost-calculator/">
                  website design cost calculator
                </LaunchLink>.
              </Fragment>,
            ]}
          />
        ),
        // aText is the FAQPage JSON-LD twin of the visible answer above. Keep the
        // two in sync sentence for sentence, or an assistant quotes the old one.
        aText:
          `My baseline fee for full builds, including redesigns, is ${money(BASE)}. Most projects end up between ${LOW} and ${HIGH}, though it is not uncommon for ambitious projects to crack ${HIGH}. Visit my website costs page for a detailed breakdown. If your website needs work, not a redesign, I charge by the minute at ${money(MINUTELY)}/min, which adds up to ${HOURLY_LONG}. Read more about my fees on my rates page, or put a number on your own scope with the website design cost calculator.`,
      },
      {
        q: "Do you have a lower rate for special cases?",
        a: "I am always open to hearing out special situations, especially mission driven and social good initiatives. However, if your project has the potential for revenue of any kind, my posted rate is almost certainly what will be charged.",
        aText:
          "I am always open to hearing out special situations, especially mission driven and social good initiatives. However, if your project has the potential for revenue of any kind, my posted rate is almost certainly what will be charged.",
      },
      {
        q: "Is there an ongoing cost after the site is built?",
        a: `Every website has, at the very least, a monthly hosting fee and an annual domain name fee. My in-house hosting starts at ${money(STATIC_HOSTING)}. Domain fees are set and billed by your domain registrar directly, e.g. GoDaddy, NameCheap, etc.\n\nIf you need to change or expand your site, that work is billed at my minutely rate, or a new flat rate is scoped and assessed to cover the limited update as its own new project.`,
        aText:
          `Every website has, at the very least, a monthly hosting fee and an annual domain name fee. My in-house hosting starts at ${money(STATIC_HOSTING)}. Domain fees are set and billed by your domain registrar directly, e.g. GoDaddy, NameCheap, etc. If you need to change or expand your site, that work is billed at my minutely rate, or a new flat rate is scoped and assessed to cover the limited update as its own new project.`,
      },
      {
        q: "How much does website maintenance cost?",
        // The figure was hand-typed and contradicted the hub's WORDPRESS_CARE,
        // which is what /rates/ and the cost guide have been rendering. The hub is
        // correct (Chad, 2026-07-22). Reads WORDPRESS_CARE now, so the two can
        // never disagree again -- this answer also feeds the FAQPage JSON-LD,
        // so the wrong number was the one an assistant would quote back.
        a: `Most new sites I build are custom coded and static, which don't require maintenance. However, WordPress sites do require ongoing maintenance, which is covered by my WordPress care plan at ${money(WORDPRESS_CARE)} every six months. The care plan covers routine WordPress core, plugin and theme updates, as well as daily backups.`,
        aText: `Most new sites I build are custom coded and static, which don't require maintenance. However, WordPress sites do require ongoing maintenance, which is covered by my WordPress care plan at ${money(WORDPRESS_CARE)} every six months. The care plan covers routine WordPress core, plugin and theme updates, as well as daily backups.`,
      },
    ],
  },
  {
    theme: "Websites FAQ",
    lead:
      "Frequently asked questions about web design and development.",
    items: [
      {
        q: "Custom-coded or WordPress: which is right for me?",
        a: "This comes down to one thing: editability.\n\nOver the last decade, 90% of clients that say \"editing the website is a requirement\" never edit the website, the content or the layout, so I've stopped selling WordPress as a frontrunner and am being honest with clients about whether WordPress is overkill for their needs.\n\nIf you don't already have a plan to update the site's content, whether that be a blog, photo gallery or product catalog, you almost certainly don't need WordPress. We'll discuss this on our first consultation call.",
        aText:
          "This comes down to one thing: editability. Over the last decade, 90% of clients that say \"editing the website is a requirement\" never edit the website, the content or the layout, so I've stopped selling WordPress as a frontrunner and am being honest with clients about whether WordPress is overkill for their needs. If you don't already have a plan to update the site's content, whether that be a blog, photo gallery or product catalog, you almost certainly don't need WordPress. We'll discuss this on our first consultation call.",
      },
      {
        q: "Do I own my website when it is finished?",
        a: "Yes, once you make the final payment, you own everything completely. The site lives on my private server, but the content: the code, the images, the copy, everything that was developed for the project is legally yours. If you ever decide you need to move hosts, you get a package with all of that in it, no hoops to jump through and no tech jargon to decipher.",
        aText:
          "Yes, once you make the final payment, you own everything completely. The site lives on my private server, but the content: the code, the images, the copy, everything that was developed for the project is legally yours. If you ever decide you need to move hosts, you get a package with all of that in it, no hoops to jump through and no tech jargon to decipher.",
      },
      {
        q: "Will my site actually be fast?",
        a: (
          <>
            Yes, all websites chadworks develops are fast by design. Speed is not
            an add-on, and any vendor selling it as such is trying to get one over
            on you. If your site is not fast, it may as well not exist in 2026. For
            the fastest sites, go with{" "}
            <LaunchLink href="/custom-coded-static/">custom coded/static</LaunchLink>, as they
            don't have the same bloat and oftentimes server crowding that
            WordPress, Shopify and pagebuilders come with.
          </>
        ),
        aText:
          "Yes, all websites chadworks develops are fast by design. Speed is not an add-on, and any vendor selling it as such is trying to get one over on you. If your site is not fast, it may as well not exist in 2026. For the fastest sites, go with custom coded/static, as they don't have the same bloat and oftentimes server crowding that WordPress, Shopify and pagebuilders come with.",
      },
      {
        q: "Can you redesign my site or move me off Squarespace or Wix?",
        a: "Yes, chadworks does lots of redesigning or platform-migration projects. I'll listen to your situation to see if we need to redesign, switch platform but keep the design, or both redesign and switch platforms while we're at it.",
        aText:
          "Yes, chadworks does lots of redesigning or platform-migration projects. I'll listen to your situation to see if we need to redesign, switch platform but keep the design, or both redesign and switch platforms while we're at it.",
      },
      {
        q: "Can I edit the site myself after it's built?",
        a: "Yes, I can build your site to be editable, but these days I press my clients to determine if they really need that feature, given the pros and cons involved.\n\nA WordPress site comes with a dashboard, and most builds include a 30-minute tutorial so you can update text and images with confidence. A custom-coded static site has no dashboard by design, which is part of what makes it fast and secure, so content changes come back through me at my minutely rate.\n\nHowever, I can also build micro-admin functions to edit specific parts of your site, like a micro blog editor or a photo gallery manager, either as part of the initial project or an additional fee down the road.",
        aText:
          "Yes, I can build your site to be editable, but these days I press my clients to determine if they really need that feature, given the pros and cons involved. A WordPress site comes with a dashboard, and most builds include a 30-minute tutorial so you can update text and images with confidence. A custom-coded static site has no dashboard by design, which is part of what makes it fast and secure, so content changes come back through me at my minutely rate. However, I can also build micro-admin functions to edit specific parts of your site, like a micro blog editor or a photo gallery manager, either as part of the initial project or an additional fee down the road.",
      },
      {
        q: "Will my site be secure?",
        a: "Yes, every site is secured with an SSL certificate and form spam prevention. For sites with login forms, additional security is available on a case by case basis, depending on the level of traffic anticipated, exposure surface and sensitivity of information held behind the login.\n\nStill, it's true that no site anywhere is completely hacker-proof, since even Visa and the Social Security system have been breached. What I can promise is that your site is built to remove the easy targets.",
        aText:
          "Yes, every site is secured with an SSL certificate and form spam prevention. For sites with login forms, additional security is available on a case by case basis, depending on the level of traffic anticipated, exposure surface and sensitivity of information held behind the login. Still, it's true that no site anywhere is completely hacker-proof, since even Visa and the Social Security system have been breached. What I can promise is that your site is built to remove the easy targets.",
      },
      {
        q: "Do you handle privacy policy, cookies, and GDPR?",
        a: "Yes, data privacy assets like Privacy Policy, Terms of Service and cookie consent controls are built into every new chadworks website. Those consent controls actually gate the tracking rather than just announcing it, so nothing measures a visitor until they agree to it, and there are no advertising or marketing pixels on your site at all. Some sites may require more complex controls, which may require an additional fee. Your site will be covered for relevant US-based laws like CCPA and GDPR and can be tweaked to cover specifics you may need.\n\nDisclaimer: I am not a lawyer and my proposal-agreement waives my liability for such exposure your site may face, so a business with serious compliance exposure should have counsel review the language, but you won't launch missing the standard protections.",
        aText:
          "Yes, data privacy assets like Privacy Policy, Terms of Service and cookie consent controls are built into every new chadworks website. Those consent controls actually gate the tracking rather than just announcing it, so nothing measures a visitor until they agree to it, and there are no advertising or marketing pixels on your site at all. Some sites may require more complex controls, which may require an additional fee. Your site will be covered for relevant US-based laws like CCPA and GDPR and can be tweaked to cover specifics you may need. Disclaimer: I am not a lawyer and my proposal-agreement waives my liability for such exposure your site may face, so a business with serious compliance exposure should have counsel review the language, but you won't launch missing the standard protections.",
      },
      {
        q: "Can people with disabilities use my site?",
        a: "Yes, and it is part of the build rather than an upgrade I sell you later. Every site works with a keyboard for the people who cannot use a mouse, labels its buttons and images so a screen reader can say what they are out loud, keeps enough contrast between text and background to stay readable, and honors the setting a visitor switched on to stop things from moving when animation makes them queasy.\n\nA share of the people landing on your site browse this way and will never once mention it to you. They just leave when a site fights them, which means the cost of getting this wrong is invisible and you would never know it was happening. Formal WCAG 2.2 AA conformance, the kind with an audit and a written statement behind it, is a separate piece of work I quote on its own.",
        aText:
          "Yes, and it is part of the build rather than an upgrade I sell you later. Every site works with a keyboard for the people who cannot use a mouse, labels its buttons and images so a screen reader can say what they are out loud, keeps enough contrast between text and background to stay readable, and honors the setting a visitor switched on to stop things from moving when animation makes them queasy. A share of the people landing on your site browse this way and will never once mention it to you. They just leave when a site fights them, which means the cost of getting this wrong is invisible and you would never know it was happening. Formal WCAG 2.2 AA conformance, the kind with an audit and a written statement behind it, is a separate piece of work I quote on its own.",
      },
      {
        q: "Can you set up a newsletter or mailing list?",
        a: "Yes. All sites include one subscribe form if desired, wired directly into your email platform of choice. Connecting and configuring the email platform behind it is usually an add-on service, since the tool and its pricing depend on how you plan to use it.",
        aText:
          "Yes. All sites include one subscribe form if desired, wired directly into your email platform of choice. Connecting and configuring the email platform behind it is usually an add-on service, since the tool and its pricing depend on how you plan to use it.",
      },
      {
        q: "Do I get analytics to see my traffic?",
        a: "Yes. Every site launches with Google Analytics wired in, so from day one you can see who is visiting and which pages actually hold their attention. It is the free, industry-standard tracking the big sites run on, and I confirm it is reading correctly before the site goes live.",
        aText:
          "Yes. Every site launches with Google Analytics wired in, so from day one you can see who is visiting and which pages actually hold their attention. It is the free, industry-standard tracking the big sites run on, and I confirm it is reading correctly before the site goes live.",
      },
    ],
  },
  {
    theme: "Visibility FAQs",
    lead:
      "Frequently asked questions about SEO/GEO and how to show up on Google, ChatGPT and other search platforms.",
    items: [
      {
        q: "Can you get my business to show up in ChatGPT and Google's AI Overview?",
        a: (
          <>
            Yes, SEO and now GEO/AI search visibility is a pillar chadworks
            service, since 2010. Your site will be built with the basics
            included, but competition is heavy and to rank or show up where you
            want will likely take an additional budget dedicated solely to this
            goal. Check out the <LaunchLink href="/visibility/">Visibility page</LaunchLink>{" "}
            for more info.
          </>
        ),
        aText:
          "Yes, SEO and now GEO/AI search visibility is a pillar chadworks service, since 2010. Your site will be built with the basics included, but competition is heavy and to rank or show up where you want will likely take an additional budget dedicated solely to this goal. Check out the Visibility page for more info.",
      },
      {
        q: "Is SEO dead now that everyone uses AI?",
        a: (
          <>
            No. Classic <LaunchLink href="/seo/">SEO</LaunchLink> is the foundation that AI
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
            see exactly what is working and what is not. It's charged as a flat
            rate of {money(VISIBILITY_AUDIT)} with no strings attached, no commitment to hire me for
            anything further. Check out the{" "}
            <LaunchLink href="/ai-visibility-audit/">AI visibility audit page</LaunchLink> for
            more info.
          </>
        ),
        aText:
          `A one-time, documented read on where a business stands in AI answers, including the mentions and citations behind them, its structured data, and its profiles, scored so you can see exactly what is working and what is not. It's charged as a flat rate of ${money(VISIBILITY_AUDIT)} with no strings attached, no commitment to hire me for anything further. Check out the AI visibility audit page for more info.`,
      },
      {
        q: "Do you do advertising on ChatGPT?",
        a: (
          <>
            Yes, I have access to OpenAI's beta advertising platform. Their
            minimum spend is {money(ADS_MIN_DAILY_SPEND)}/day (as of June 2026) and some industries are
            prohibited, like legal and financial services. Check out the{" "}
            <LaunchLink href="/advertising-on-chatgpt/">
              Advertising on ChatGPT page
            </LaunchLink>{" "}
            for detailed information.
          </>
        ),
        aText:
          `Yes, I have access to OpenAI's beta advertising platform. Their minimum spend is ${money(ADS_MIN_DAILY_SPEND)}/day (as of June 2026) and some industries are prohibited, like legal and financial services. Check out the Advertising on ChatGPT page for detailed information.`,
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
        lede="A wide array of questions people ask while considering hiring chadworks, including questions grouped based on specific categories: general, pricing, websites and visibility."
      />

      {/* FOUR THEMED GROUPS -- each a full band; dark and light alternate by
          index (inside the capsule) so no two dark sections ever stack (rule 9).
          The last group lands light, ahead of the dark CTA. */}
      <FaqCapsule variant="groups" groups={GROUPS} />

      <MainContactCapsule
        heading="Still have a question?"
        intro="Ask it directly and you will get the same straight answer, from the person who would actually do the work, usually within a day."
      />
    </PageComposer>
  );
}
