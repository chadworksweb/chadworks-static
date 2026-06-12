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
import {
  CustomCodedViz,
  WordPressViz,
  EcommerceViz,
  ShopifyViz,
} from "@/components/art/BuildPathViz";

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
      sight, or bring me the business alone and we&apos;ll find the look
      together. When the design is settled, I{" "}
      <Link href="/web-development/" className="svc-inline-link">
        develop
      </Link>{" "}
      it too.
    </>
  ),

  heroArt: <WebDesignHeroArt />,

  keyFactsHeading: "Web design, at a glance",
  keyFacts: [
    "People size up a website in about a twentieth of a second, and what they're really sizing up is your business. Design decides what that first instant says.",
    "Nothing here starts from a theme. Every site is designed around your business, so it can never look like the competitor who bought the same template.",
    "The person who designs your site is the same person who builds it, so nothing gets lost between a designer's mockup and a developer's compromise.",
    "I've been designing websites for 20 years, long enough to know which trends will still look right in five, and which ones are already aging.",
  ],

  problemArt: <DesignReveal />,
  problem: {
    heading: "Why web design actually matters",
    subheading: "You're judged before you're read.",
    body:
      "Visitors decide how much to trust your business before they read a single word, and the design is what they're deciding on. Drag the line across the browser below and watch the same business make two completely different first impressions.",
    more: {
      trigger: "More on what design decides",
      paragraphs: [
        <>
          <strong>Trust</strong> comes first. A visitor can&apos;t inspect
          your work from a search result, so the website stands in for it. A
          considered design reads as a business that sweats the details. A
          stale template reads as a business that doesn&apos;t, even when the
          work behind it is excellent.
        </>,
        <>
          <strong>Direction</strong> is the quiet job. Good design decides
          where the eye goes, what feels clickable, and which action the whole
          page leans toward. A site can be beautiful and still point nowhere,
          which is why I design the path to contact before I pick a single
          color.
        </>,
        <>
          <strong>Memory</strong> is the long game. You are almost never the
          only tab open. Template sites blur into each other the moment the
          visitor moves on, while a site designed around your business is the
          one they can still picture the next day.
        </>,
        "And design never works alone. The code underneath has to keep those pages fast and findable, which is why I handle the development side too instead of handing the design off and hoping.",
      ],
    },
  },

  approach: {
    heading: "How I design it",
    steps: [
      {
        title: "I start with your business, not a moodboard",
        body:
          "Before anything visual, I learn what the site has to win: who it speaks to, what they need to feel, and the action that pays you. Every design choice afterward has a job to do.",
      },
      {
        title: "Structure first, decoration second",
        body:
          "The layout and hierarchy get designed before the styling. Where the eye lands, what feels clickable, where a page sends the reader next. If the bones don't sell, no color rescues it.",
      },
      {
        title: "A design system, not a lucky page",
        body:
          "Colors, type, and spacing get locked as one system, so every page matches and the pages you add next year still look like they belong. One good-looking homepage is easy. A site that holds together is design.",
      },
      {
        title: "Designed to be built",
        body:
          "I develop what I design, so nothing dies in translation. Every idea in the mockup ships as fast, working code, instead of getting quietly simplified by whoever builds it.",
      },
    ],
  },

  paths: {
    heading: "Choose how it's built",
    intro:
      "A design needs a build to live on. Same four routes as the development side. If you're not sure which fits, that's part of the conversation.",
    items: [
      {
        label: "Custom Coded / Static",
        detail:
          "The purest canvas. Custom built around the design with nothing to update or break, and entirely yours.",
        href: "/custom-coded-static/",
        viz: <CustomCodedViz />,
      },
      {
        label: "WordPress",
        detail:
          "Design on a CMS your team can manage. I design over it so it never reads as a theme.",
        href: "/wordpress/",
        viz: <WordPressViz />,
      },
      {
        label: "Ecommerce",
        detail:
          "Design in service of the sale. Built around your products and how people actually buy them.",
        href: "/ecommerce/",
        viz: <EcommerceViz />,
      },
      {
        label: "Shopify",
        detail:
          "A custom face on the platform that does the heavy lifting, so the store reads as yours.",
        href: "/shopify/",
        viz: <ShopifyViz />,
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Specialized design pages",
        detail:
          "Whole pages designed for a single trade, like septic services and foundation repair, each with a look pulled from that industry's world instead of a generic business template.",
        href: "/design/",
      },
      {
        label: "The portfolio",
        detail:
          "Walk through the live builds in the immersive portfolio and judge the design work with your own eyes.",
        href: "/portfolio/",
      },
    ],
  },

  made: {
    eyebrow: "Who makes it",
    heading: "Hi, I'm Chad.",
    intro:
      "I've been designing websites for 20 years, since the Xanga and MySpace days, and every site that leaves here is custom built by me.",
    manifesto: [
      { lead: "I design it.", aside: "(No template.)" },
      { lead: "I code it.", aside: "(No page builder.)" },
      { lead: "I maintain it.", aside: "(No ghosting.)" },
    ],
    negation: [
      "No subcontractors.",
      "No offshore.",
      "No AI slop.",
      "No warehouse agency you'll never hear from after the invoice clears.",
    ],
    close:
      "When you email, I answer. When something breaks at 11pm, I'm the one fixing it.",
    img: "/people/chad-cutout.webp",
    imgAlt: "Chad Lewine, the designer and developer behind chadworks",
    captionMain: "Don't worry, I'm a professional.",
    captionSub: "(Web designer.)",
    sig: "Chad Lewine",
    sigMeta: "chadworks -- designing since age 11",
  },

  price: {
    heading: "What it costs, plainly",
    figure: "$3,200 - $6,200+",
    figureSub: "Value-based -- most builds land near $6,200",
    body:
      "Design is priced on what it's worth to your business, not on how fast a font can be picked. Projects start at a $3,200 floor, most land near $6,200 with the development included, and hourly work bills at $315. There are cheaper designers, plenty of them. The difference is that you're not buying a template with your logo dropped in. You're buying a design that belongs to your business alone, built by the same person who codes it.",
    disclaimer: (
      <>
        <strong>Straight up:</strong> if the lowest number is the goal, we
        probably aren&apos;t a match, and I&apos;d rather say so here than
        after you&apos;ve spent the money. Real numbers come from a real
        conversation about scope, not a pricing table.
      </>
    ),
  },

  faqLead:
    "The questions buyers actually ask about web design, answered the way I'd answer them on a call. If yours isn't here, ask me directly.",

  faqs: [
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
      "Either works. Tell me about your business and what you want people to feel the moment they land. I'll give you an honest read on what the design needs, before anyone commits to anything.",
    buttonLabel: "Tell me about your project",
    href: "/contact/",
  },

  portfolio: {
    heading: "Click into the work",
    intro:
      "Four live builds, four different personalities, none of them started from a theme. Click anywhere on a shot to send a ripple through it.",
    items: [
      { label: "chadlewine.com", img: "/portfolio/chadlewine.png", alt: "chadlewine.com, a custom-designed musician website", href: "https://chadlewine.com" },
      { label: "The Rising Compass", img: "/portfolio/risingcompass.png", alt: "risingcompass.net, a custom-designed song-analysis web app", href: "https://risingcompass.net" },
      { label: "Rozario Touma, P.C.", img: "/portfolio/rozariolaw.png", alt: "rozariolaw.com, a corporate law firm website designed for New York City clients", href: "https://rozariolaw.com" },
      { label: "Abracadabra Gems", img: "/portfolio/abracadabragems.png", alt: "abracadabragems.com, an artisan jeweler's website with a handcrafted look", href: "https://abracadabragems.com" },
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
      },
      {
        quote:
          "Chad is very professional, talented and skilled. He does not try to sell you on products or services that you don't need.",
        attribution: "Kimberly Dolan, K.I.M. Keep It Moving (Philadelphia)",
      },
    ],
  },

  qualification: {
    heading: "Is this the right fit?",
    fit: [
      "You want a site that looks like your business, no one else's.",
      "You see design as the thing that wins customers, not a coat of paint at the end.",
    ],
    notFit: [
      "You already bought a theme and want it filled in as-is.",
      "The lowest bid matters more than what the site wins you.",
    ],
  },

  assurance: {
    heading: "Why it's safe to start",
    items: [
      "The design files and the finished site are yours outright, down to the working files.",
      "Every build includes two weeks of free fixes after launch.",
      "You get an honest read on fit before either of us commits to anything.",
      "No lock-in. Everything lives in your name, and you can take it anywhere.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      {
        title: "You reach out",
        body: "Tell me about your business through the contact form or a quick email. I usually reply within a day.",
      },
      {
        title: "An honest read",
        body: "I'll tell you straight whether chadworks is the right fit, with a rough shape and cost, no pressure.",
      },
      {
        title: "A scoped plan",
        body: "If it's a fit, you get a clear written scope and timeline before any work or payment starts.",
      },
      {
        title: "Direction, early",
        body: "You see an actual design direction in days, not a surprise after weeks of silence, and we steer it together.",
      },
    ],
  },

  meta: {
    title: "Web Design -- Custom Website Design Around Your Business | chadworks",
    description:
      "Web design is everything a visitor sees and feels on your website: the layout, color, type, and the path that turns a stranger into a customer. I design custom sites around your business, never from a theme, and develop them too.",
  },
};
