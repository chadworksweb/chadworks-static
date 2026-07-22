// Service: Web Design (Websites lane) -- the DESIGN-angle entry to the
// websites service; the mirror of /web-development/ (same service, visual
// angle). For buyers searching "web design": they're choosing on looks,
// taste, and trust. Describes the design side, then funnels to the four
// build options.
//
// CALIBRATION PAGE (2026-06-11): the first page of the autonomous v1 build,
// judged against the locked references (web-dev sections 1-3, homepage hero,
// septic/chatgpt pages). Signature moments: ChromaLetter (living color in the
// "g" of Design -- the CF forge-"g" lineage) and DesignReveal (before/after
// wipe in the Problem section, replacing the web-dev ribbons via problemArt).
// Copy in Chad's PUBLIC voice, run against the humanizing rules.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { WebDesignHeroArt } from "@/components/art/WebDesignHeroArt";
import { DesignReveal } from "@/components/art/DesignReveal";
// No BuildPathViz icons on this page's platform lanes (Chad, 2026-07-17). The
// icons are per-item DATA (`viz`), not part of PathsCapsule, so dropping them
// here is scoped to /web-design/ and needs no fork: the capsule renders `viz`
// only when an item carries one. /websites/ and /ecommerce/ keep theirs.

export const webDesign: Service = {
  slug: "web-design",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "The design in front of the code",
  title: "Web Design",
  intent:
    "chadworks designs custom websites (the visual half of the websites service) and funnels the buyer to how the design gets built.",

  // Answer-first, design-framed (GEO checklist 1), authority woven, with the
  // inline cross-link to the development mirror.
  answer: (
    <>
      Web design is everything a visitor sees and feels on your website: the
      layout, the color, the type, and the path that turns a stranger into a
      customer. I&apos;m Chad, and I&apos;ve been designing websites for 20
      years. Bring me a brand and I&apos;ll design a site that earns trust on
      sight, or bring me the idea and we&apos;ll find the look
      together.
    </>
  ),

  heroArt: <WebDesignHeroArt />,

  keyFactsHeading: "Web design, at a glance",
  keyFacts: [
    "People size up a website in about one second, but what they're really sizing up is your business. The quality of your website design is what makes or breaks a first impression.",
    "All projects are built from the ground up, meaning no templates or page builders. Your website will be distinguished and unique in the truest sense.",
    (
      <>
        The person who designs is the person who builds, and is also the person
        who does the sale, the proposal and the maintenance.{" "}
        <Link href="/about/" className="svc-inline-link">
          Read about that person here.
        </Link>
      </>
    ),
    "I've been designing websites for 20 years, long enough to know which trends will still look right in five, and which ones are already aging.",
  ],

  problemArt: <DesignReveal />,
  problem: {
    heading: "Why web design actually matters",
    subheading: "Aesthetics psychologically build trust before content.",
    body:
      "Visitors decide how much to trust your business before they read a single word, and the design is what they're deciding on. Drag the line across the browser below and watch the same business make two completely different first impressions.",
    more: {
      trigger: "More on what design decides",
      hideBodyIntro: true,
      paragraphs: [
        <>
          <strong>Thoughtful Design &amp; Details.</strong>{" "}A thoughtful
          design indicates that a business cares about details, which translates
          into quality of product or service a potential customer can expect to
          receive. A website with loose ends, broken assets, misalignment or
          chaotic branding is an indicator the business does not care about the
          details. You can guess what that translates to regarding the service
          or product.
        </>,
        <>
          <strong>User Interface &amp; Navigation.</strong>{" "}A site can be
          beautiful yet still leave the visitor hanging and cause them to
          bounce. A great website design includes effective interface and
          navigational design decisions. This covers concepts like what feels
          clickable, scrollable, and what action an individual page moves the
          visitors towards.
        </>,
        <>
          <strong>Memory and Impact.</strong>{" "}Most people browsing for a
          product or service online are simultaneously doing other things, which
          means your website has to stand out from the amalgam of social media,
          YouTube, news and competitor websites a visitor may be surfing, along
          with your site. These days, impactful design requires a bespoke
          design that stops a visitor in their tracks and leaves an imprint in
          their mind long after they leave. &quot;Oh, that was the site with the
          yellow glowing rectangle!&quot; kind of thing.
        </>,
      ],
    },
  },

  approach: {
    heading: "The chadworks™ Web Design Process",
    // Verbatim restoration of the original chadworks.co "Website Design Process"
    // bold-timeline steps (9 steps), sourced from the old-site copy doc.
    steps: [
      {
        title: "Discovery",
        body:
          "I interview you to extract the necessary information about your business like company history, mission and vision, important products or services, milestones, etc.",
      },
      {
        title: "Website Architecture (Sitemap)",
        body:
          "Based on the information and content collected in the discovery phase, I build an SEO and user-friendly sitemap to visually organize all of your pages in an easy to read and digest visual. This usually becomes the main menu.",
      },
      {
        title: "Homepage Design",
        body:
          "The overall design of the site will be delivered with the first revision of the homepage. The rest of the pages will mimic this overall design but have their own content in the main part of the page.",
      },
      {
        title: "Sub Page Build Out",
        body:
          "The rest of the website's pages will be built out with the design from the homepage and the content provided. This includes product pages and blog posts.",
      },
      {
        title: "Search Optimization (SEO)",
        body:
          "The website pages and content will be optimized for search out of the box. This does not mean you will show up #1 for \"dog groomers\" but it means the site will be in the best shape it can be to begin competing for ranking on Google/Bing.",
      },
      {
        title: "Mobile Optimization & Testing",
        body:
          "This is the last step. All content and pages must be complete before mobile testing and optimization is performed.",
      },
      {
        title: "Soft Launch",
        body:
          "We launch the site on your main domain. We ask friends and family to visit the site and test it out to try and find any last bugs we did not catch or issues with specifics operating systems, browsers or devices.",
      },
      {
        title: "Official Launch",
        body:
          "We announce the launch of your website, and toast to a job well done for everyone involved. Congrats on your new web property, go get 'em. I'll be here for anything else you may need.",
      },
      {
        title: "One Week Post-Launch Safety Net",
        body:
          "You have one week from \"official launch\" for me to fix any issues or glaring mistakes that have been discovered at no charge. This does not include new pages or content of any kind, only fixing what was already on the site upon official launch.",
      },
    ],
  },

  // Platform Options now live in the shared PlatformOptionsCapsule (Chad,
  // 2026-07-19), the single source for the four build platforms across the
  // Websites lane. This page renders it via the `paths` slot override.

  price: {
    heading: "What design costs, plainly",
    body:
      "I price on the value of the work, not on how small a number I can promise you. Time bills at $315 an hour, and projects start at a $3,250 baseline. Most builds settle between $5,000 and $10,000, depending on scope and which route you choose. Design and development are the same job to me, so that number covers both halves, not a mockup you then pay someone else to build. This puts me above the cheapest option you'll find, and that is on purpose, because the cheap option is usually the one you pay to rebuild in two years. If a fixed budget matters to you more than the result, I'd rather tell you now than after you've spent the money.",
  },

  faqLead:
    "The questions buyers actually ask about web design, answered the way I'd answer them on a call. If yours isn't here, ask me directly.",

  faqs: [
    {
      q: "What is web design?",
      // Blank lines are paragraph breaks (FaqAccordion splits on them). Chad's
      // wording is untouched; only the breaks are new.
      a: "Website design is the visual aspect of a website.\n\nThis includes the UI (user interface), which includes colors, fonts, images and other media. It also covers UX (user experience), which is the way a visitor explores the website; the path they take, the links they click and where those links go, the forms they fill out and the buttons they push.\n\nUI and UX work together to make it easy for your visitors to find what they're looking for. The design is the aesthetic of that interface and experience.\n\nWithout design, you'd be looking at indecipherable lines of code and spreadsheet-like data, and would not be able to find what you need.",
    },
    {
      q: "Do you design from templates or themes?",
      a: "No. Every design is custom built around your business, which is the point of hiring a designer instead of buying a theme. The only time a theme enters the picture is when you deliberately choose the WordPress route for managing your own content, and even then I design on top of it until it doesn't read as one.",
    },
    {
      q: "What's the difference between web design and web development?",
      a: "Design is what you see and feel. Development is the code that makes it real and keeps it fast. They're two halves of the same job, and I do both, so start on whichever word matches how you think about it. The result is the same site either way.",
    },
    {
      q: "Can you redesign my current site without rebuilding it?",
      a: "Sometimes, and I'll tell you honestly which case you are. If the bones are healthy, a redesign can ride on them. If the site is held together by page-builder duct tape, redesigning on top of it just paints over the problem, and you'd be paying twice. I look first, then recommend.",
    },
    {
      q: "How much say do I get in the design?",
      a: "All of it, with guardrails. You see a real direction early and we steer it together, and you always hold the veto. The flip side is that if something you ask for would hurt the site, in usability or in search, I'll say something. That honesty is part of what you're paying for.",
    },
    {
      q: "What do I need to have ready before we start?",
      a: "Less than you'd think. A sense of what the site has to accomplish, plus any photos and words you already have. Real photos of your work beat stock photography every time. Logo, colors, and the rest can be designed along the way if you don't have them yet.",
    },
  ],

  cta: {
    heading: "Have a vision, or only a hunch?",
    body:
      "Either works. Tell me about your business and what you want people to feel the moment they land. I'll give you a straight answer on what the design needs before anyone commits.",
    buttonLabel: "Tell me about your project",
    href: "/contact/",
  },

  // The page's own comprehensive form (CTA right half).
  form: {
    source: "web-design page",
    subject: "New Web Design Inquiry -- chadworks",
    submitLabel: "Send it to Chad",
    successMessage:
      "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "section", label: "About you" },
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "section", label: "About the site" },
      { kind: "url", name: "current_site", label: "Current Site (if you have one)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "site_kind",
        label: "What kind of site?",
        span: "half",
        options: [
          { value: "new-design", label: "A new design from zero" },
          { value: "redesign", label: "Redesign of my current site" },
          { value: "ecommerce", label: "A store / ecommerce" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
      {
        kind: "textarea",
        name: "vision",
        label: "The Vision",
        required: true,
        rows: 4,
        placeholder: "What should people feel when they land? What does the site have to win for you? Sites you admire are welcome here too.",
      },
      {
        kind: "select",
        name: "timeline",
        label: "Timeline",
        span: "half",
        options: [
          { value: "immediate", label: "As soon as possible" },
          { value: "1-3-months", label: "1 - 3 months" },
          { value: "exploring", label: "Just exploring" },
        ],
      },
      {
        kind: "select",
        name: "budget_posture",
        label: "Budget Posture",
        span: "half",
        options: [
          { value: "baseline", label: "Around the $3,250 baseline" },
          { value: "typical", label: "The typical build ($5,000 to $10,000)" },
          { value: "beyond", label: "Bigger vision, bigger number" },
          { value: "unsure", label: "Tell me what it takes" },
        ],
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  // REAL reviews (harvested verbatim from live chadworks.co). Two chosen for
  // the design angle: the finished-product reaction and the no-upsell honesty.
  testimonials: {
    heading: "What clients say",
    items: [
      {
        quote:
          "Chad went above and beyond and exceeded our expectations with the final product.",
        attribution: "Mary Lynn Renner, AAC Event Catering (Lansdale, PA)",
        img: "/people/mary-lynn-renner.webp",
      },
      {
        quote:
          "Chad is very professional, talented and skilled. He does not try to sell you on products or services that you don't need.",
        attribution: "Kimberly Dolan, K.I.M. Keep It Moving (Philadelphia)",
        img: "/people/kimberly-dolan.webp",
      },
    ],
  },

  // No assurance slot: the tenets of transparency moved to /about/ on
  // 2026-07-17 and now live in TenetsCapsule, which is their canonical home.
  // Do not retype them here.

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      {
        title: "You reach out",
        body: "Tell me about your business through the contact form or a quick email. I usually reply within a day.",
      },
      {
        title: "A straight answer",
        body: "I'll tell you straight whether chadworks is the right fit, with a rough scope and ballpark estimate, and no pressure to commit.",
      },
      {
        title: "A scoped plan",
        body: "You get a granular and detailed proposal-agreement, outlining the scope of the project, the fees involved and the expectations of both parties.",
      },
      {
        title: "Direction, early",
        body: "You see an actual design direction in days, not a surprise after weeks of silence, and we steer it together.",
      },
    ],
  },

  meta: {
    title: "Website Design by chadworks™",
    description:
      "Web design is everything a visitor sees and feels on your website: the layout, color, type, and the path that turns a stranger into a customer. I design custom sites around your business, never from a theme, and develop them too.",
  },
};
