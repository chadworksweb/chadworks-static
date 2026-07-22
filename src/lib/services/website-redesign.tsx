// Service: Website Redesign (Websites lane) -- the REDESIGN-angle entry to the
// websites service. For buyers who ALREADY HAVE a site and want it torn down
// and rebuilt from the ground up. This is materially NOT a refresh/polish (that
// keeps the existing bones and updates the surface) and NOT a platform
// migration (that keeps the look and swaps the platform underneath, the /switch/
// lane). A redesign changes the design and the experience: the old site comes
// down and a new one goes up in its place, on the same domain.
//
// Built off the /web-design/ and /web-development/ references for tone,
// language and section arc. Copy in Chad's PUBLIC voice, run against the
// humanizing rules (no em-dashes, no triplets, reader-experience framing).
// Signature moment: DesignReveal (the same before/after wipe web-design uses,
// which is literally a real client redesign of Rozario Touma) placed in the
// Problem section via problemArt.

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

export const websiteRedesign: Service = {
  slug: "website-redesign",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "A total teardown, not a touch-up",
  title: "Website Redesign",
  intent:
    "chadworks tears down a business's existing website and rebuilds it from the ground up: a full redesign of the look, structure and experience on the same domain, distinct from a light refresh and from a platform migration.",

  // Answer-first lede (GEO checklist 1): defines a redesign in the first 100
  // words AND fences it off from a refresh and from a migration, in Chad's warm
  // first-person. ReactNode for the inline cross-links.
  answer: (
    <>
      A website redesign is a ground-up rebuild of a website you already own. The
      look, the structure, the navigation, and the words all get replaced, and
      the new site goes live on the same domain you have now. I&apos;m Chad, and
      I&apos;ve been designing and rebuilding websites for 20 years. This
      isn&apos;t a coat of fresh paint on the site you already have, and it
      isn&apos;t about moving you to a different platform. It&apos;s the old site
      coming down and a stronger one going up in its place. Bring me the site
      that stopped working for you and I&apos;ll tell you straight what it takes
      to replace it.
    </>
  ),

  heroArt: <WebDesignHeroArt />,

  keyFactsHeading: "Website redesign, at a glance",
  keyFacts: [
    "A redesign replaces the whole site, not just the parts that annoy you. Patching a site that has already aged badly tends to spread the problem around instead of fixing it. A clean rebuild is the honest repair, and often the cheaper one once you count the years.",
    (
      <>
        The person who redesigns the site is the person who builds it, hosts it,
        and answers the phone after launch. One person, start to finish, no
        handoff where your project gets lost between a designer and a
        developer.{" "}
        <Link href="/about/" className="svc-inline-link">
          Read about that person here.
        </Link>
      </>
    ),
    "A redesign done carelessly can erase the Google rankings you spent years earning. I map every old page to its new home and carry your search equity across, so the new site keeps the traffic the old one built.",
    "Twenty years of building and rebuilding sites means I can tell which parts of your current site are worth keeping and which ones are the reason it is dragging. You are not paying me to guess.",
  ],

  problemArt: <DesignReveal />,
  problem: {
    heading: "When a refresh won't cut it",
    subheading: "Some sites are past touching up. They need replacing.",
    body:
      "There is a point where a site is so dated, so off-brand, or so tangled underneath that fixing it piece by piece costs more than starting clean. Drag the line across the browser below to watch the same business go from the site that is holding it back to the one that isn't.",
    more: {
      trigger: "How to tell a redesign from a refresh",
      hideBodyIntro: true,
      paragraphs: [
        <>
          <strong>A refresh keeps the bones.</strong>{" "}New colors, a new font,
          fresh photos, a section rearranged. It is worth doing when the
          underlying site is still sound and just looks tired. If that is your
          site, I will tell you, and I will not sell you a rebuild you do not
          need.
        </>,
        <>
          <strong>A redesign replaces the bones.</strong>{" "}The layout, the page
          structure, the navigation, and the code underneath all get rebuilt.
          This is the move when the site fights you every time you try to change
          it, or when the design has fallen so far behind that no amount of new
          paint hides its age.
        </>,
        <>
          <strong>This is not a platform migration.</strong>{" "}Moving from one
          platform to another while keeping the same look is a different job. I
          do that too, but it isn&apos;t this. A redesign is about the design and
          the experience changing. It can happen on the platform you are already
          on, or we can choose a better one as part of the work.
        </>,
        <>
          <strong>The real tell is how you feel about your site.</strong>{" "}If you
          are a little embarrassed to send someone the link, if it looks nothing
          like the business you have become, if every small edit turns into a
          battle, that is a redesign. A refresh cannot fix a site you have
          outgrown.
        </>,
      ],
    },
  },

  approach: {
    heading: "The chadworks™ Website Redesign Process",
    // Teardown-framed skin of the standard small-business build lifecycle:
    // audit the site you have -> decide what carries over -> new architecture ->
    // homepage -> rebuild pages -> PRESERVE SEO (the step cheap redesigns botch)
    // -> test/launch on the same domain -> post-launch safety net.
    steps: [
      {
        title: "Audit of What You Have",
        body:
          "I go through your current site page by page: what is converting, what is confusing, which content is worth carrying over, and what is quietly costing you customers. A good redesign starts by understanding what is actually wrong, not by guessing at it.",
      },
      {
        title: "What Stays, What Goes",
        body:
          "Not everything on your site is broken. We decide together what earns a place in the new build, like a strong logo, real photography, or copy that already works, and what gets left behind. You are not starting from a blank page, you are starting from a clear one.",
      },
      {
        title: "New Architecture (Sitemap)",
        body:
          "I rebuild the structure from scratch around how people actually move through your site, instead of the tangle that grew over the years. This usually becomes the new main menu, and it is where a lot of a redesign's value quietly hides.",
      },
      {
        title: "Homepage Design",
        body:
          "The new direction shows up first as a redesigned homepage. Once we have steered it to right, the rest of the site inherits that design language, so every page reads as one coherent property.",
      },
      {
        title: "Rebuilding the Pages",
        body:
          "Every page gets rebuilt on the new design, with its content moved over and sharpened as it goes. Old pages that no longer serve a purpose get retired instead of dragged into the new site out of habit.",
      },
      {
        title: "Protecting Your Search Rankings",
        body:
          "This is the step most redesigns botch. I map every old URL to its new location with proper redirects, carry your metadata and structure across, and make sure Google and the AI engines read the new site as the same trusted site, not a stranger. You keep the rankings the old site earned.",
      },
      {
        title: "Testing, Mobile & Launch",
        body:
          "The rebuilt site gets tested across browsers, devices, and screen sizes, then we launch it on your existing domain. The old site comes down and the new one takes its place, usually with little to no downtime for your visitors.",
      },
      {
        title: "One Week Post-Launch Safety Net",
        body:
          "You get one week from launch for me to fix anything that slipped through, at no charge. A redesign touches every page on the site, so this net matters more here than almost anywhere else. New pages or new content are a separate thing, but fixing what launched is covered.",
      },
    ],
  },

  paths: {
    heading: "What the new site gets built on",
    intro:
      "A redesign still has to land on a platform, and this is where we choose it. Sometimes the right move is to rebuild on what you already use. Sometimes the redesign is the perfect moment to get off something that has been holding you back. We'll settle on the right one for your situation on a free consultation.",
    items: [
      {
        label: "Custom Coded",
        detail:
          "Custom code is how websites were built before CMS platforms like WordPress and builders like Squarespace came along, and in the age of deep internet saturation, custom coded websites are rising again as the go-to for those who want to stand out in a world of templates. Custom coded sites have total control over the design and the function of the website. It's like a block of clay that you get to sculpt into anything you want.",
        href: "/custom-coded-static/",
        viz: <CustomCodedViz />,
      },
      {
        label: "WordPress",
        detail:
          "WordPress powers over 40% of the internet, and for good reason. It's a CMS (content management system) with a user-friendly interface that lets non-designers edit their own content and much of the layout without touching code. The catch is that WordPress became ubiquitous, and an entire economy of templates grew up around it, which is a big part of why so much of the web now looks the same. If WordPress is right for your redesign, I'll make sure the result is not a cookie-cutter design.",
        href: "/wordpress/",
        viz: <WordPressViz />,
      },
      {
        label: "Ecommerce",
        detail:
          "Ecommerce is a website with a product and payment system built in. This can be as simple as a single PDF download or as complex as a multi-line fashion label. Ecommerce isn't its own separate platform so much as a set of functions that can be built custom, built into WordPress, or built on Shopify. If your redesigned site needs to sell online, this is the piece that does it.",
        href: "/ecommerce/",
        viz: <EcommerceViz />,
      },
      {
        label: "Shopify",
        detail:
          "Shopify is the DIY / Squarespace of ecommerce. I can build everything Shopify does as a bespoke site you own and control 100%, but Shopify is an option if you need to get selling on a budget. The trade-off for the speed and convenience is that you'll be using templates, and the monthly costs can pile up for special features. I'll happily work with Shopify, and I'll always tell you honestly if building custom serves your long-term needs better.",
        href: "/shopify/",
        viz: <ShopifyViz />,
      },
    ],
  },

  price: {
    heading: "What a redesign costs, plainly",
    body:
      "I price a redesign on the value of the new site, not on how small a number I can promise you. Time bills at $315 an hour, and projects start at a $3,250 floor. Most redesigns settle near $6,200, depending on how much of the old site carries over and how deep the rebuild goes. A redesign can actually come in lighter than a build from zero when your brand and content are already strong, or heavier when the old site is so tangled that untangling it is most of the work. Either way, I'll tell you which case you are before you commit. This puts me above the cheapest option out there, and that is on purpose, because the cheap redesign is usually the one you pay to redo again in two years.",
  },

  faqLead:
    "The questions people actually ask before redesigning a site they already have, answered the way I'd answer them on a call. If yours isn't here, ask me directly.",

  faqs: [
    {
      q: "What's the difference between a redesign and a refresh?",
      a: "A refresh keeps your existing site and updates the surface: colors, fonts, photos, maybe a rearranged section. A redesign tears the site down and rebuilds it from the structure up. If your site is fundamentally sound and just looks a little dated, a refresh is the honest call and I'll say so. If it fights you at every turn or looks nothing like the business you've become, that's a redesign.",
    },
    {
      q: "Will I lose my Google rankings if I redesign?",
      a: "Not if it's done right, and this is exactly where cheap redesigns go wrong. I map every existing URL to its new home with proper redirects and carry your metadata and structure across, so search engines and AI tools recognize the new site as the same trusted one. Handled carelessly, a redesign can wipe out years of ranking overnight. Handled properly, the new site keeps the traffic the old one built and usually climbs from there.",
    },
    {
      q: "Do I have to switch platforms to redesign?",
      a: "No. A redesign is about the design and the experience, not the platform underneath. We can rebuild on whatever you're already using, or use the redesign as the moment to move to something better if your current setup is part of the problem. That's a decision we make together, not a requirement I bolt on.",
    },
    {
      q: "Can I keep my content and copy?",
      a: "As much of it as is worth keeping. Part of the audit is deciding what carries over intact, what gets sharpened, and what quietly gets left behind. Strong copy, real photography, and a logo you like all come with you. You're not rewriting your whole business, you're rebuilding the site around the parts that already work.",
    },
    {
      q: "My site is on WordPress, Squarespace, Wix, or GoDaddy. Can you still redesign it?",
      a: "Yes, whatever it's built on now. I'll look at where it stands, tell you honestly whether the redesign is best done on that same platform or on a fresh build, and handle the whole thing either way. What you're on today doesn't limit what the new site can become.",
    },
    {
      q: "How is a redesign priced compared to a brand-new site?",
      a: "It's the same value-based pricing, and it can land on either side of a from-scratch build. When your brand and content are already strong, a redesign can come in lighter because we're not inventing everything from zero. When the old site is a tangle, untangling it is real work and the number reflects that. You get a straight, scoped answer before anyone commits.",
    },
  ],

  cta: {
    heading: "Ready to replace the site you've outgrown?",
    body:
      "Send me the address of your current site and tell me what's not working. I'll take a real look and give you a straight answer on whether it's a redesign or a refresh, what the rebuild would take, and whether we're a fit, before anyone commits to anything.",
    buttonLabel: "Show me your current site",
    href: "/contact/",
  },

  // The page's own comprehensive lead form (redesign-flavored fields). Mirrors
  // the web-design page pattern; the current overrides route the actual contact
  // through the shared MainContactCapsule, so this stands as parity + intent.
  form: {
    source: "website-redesign page",
    subject: "New Website Redesign Inquiry -- chadworks",
    submitLabel: "Send it to Chad",
    successMessage:
      "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "section", label: "About you" },
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "business", label: "Business Name", required: true, span: "half" },
      { kind: "section", label: "About the current site" },
      { kind: "url", name: "current_site", label: "Your Current Site", placeholder: "https://", required: true, span: "half" },
      {
        kind: "select",
        name: "current_platform",
        label: "What's it built on now?",
        span: "half",
        options: [
          { value: "wordpress", label: "WordPress" },
          { value: "squarespace", label: "Squarespace" },
          { value: "wix", label: "Wix" },
          { value: "godaddy", label: "GoDaddy" },
          { value: "shopify", label: "Shopify" },
          { value: "custom", label: "Custom / not sure" },
        ],
      },
      {
        kind: "select",
        name: "job_kind",
        label: "What do you think you need?",
        span: "half",
        options: [
          { value: "redesign", label: "A full redesign / rebuild" },
          { value: "refresh", label: "Maybe just a refresh" },
          { value: "unsure", label: "Not sure, that's why I'm asking" },
        ],
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
        kind: "textarea",
        name: "whats_wrong",
        label: "What's wrong with the current site?",
        required: true,
        rows: 4,
        placeholder: "What's it costing you, what looks or works badly, what do you want the new one to do that this one doesn't? Sites you admire are welcome here too.",
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  // REAL reviews (harvested verbatim from live chadworks.co). Two chosen for the
  // redesign angle: the finished-product reaction and the no-upsell honesty
  // (which lands doubly here, since half of an honest redesign pitch is telling
  // people when they only need a refresh).
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

  assurance: {
    heading: "chadworks tenets of transparency",
    items: [
      "Everything I create for you is legally yours, upon final payment.",
      "Every project includes at least one week of post-launch coverage.",
      "No nonsense or fluff. Direct questions and direct answers, in the name of protecting your business goals.",
      "No lock-in, no long-term contracts or chadworks' proprietary technology or platforms that hold your project hostage should you want to leave.",
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      {
        title: "You reach out",
        body: "Send me your current site and what's wrong with it, through the contact form or a quick email. I usually reply within a day.",
      },
      {
        title: "A straight answer",
        body: "I'll tell you honestly whether you need a redesign or just a refresh, with a rough scope and ballpark estimate, and no pressure to commit.",
      },
      {
        title: "A scoped plan",
        body: "You get a granular proposal-agreement laying out what's being rebuilt, what carries over from the old site, the fees involved, and what each side is responsible for.",
      },
      {
        title: "Direction, early",
        body: "You see a real design direction for the new site in days, not a surprise after weeks of silence, and we steer it together.",
      },
    ],
  },

  meta: {
    title: "Website Redesign by chadworks™",
    description:
      "A website redesign is a ground-up rebuild of a site you already own, replacing the look, the structure, the navigation, and the copy on your same domain. I redesign and rebuild custom, never from a theme, and carry your search rankings across so you keep the traffic you earned.",
  },
};
