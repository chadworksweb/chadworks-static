// Situation page: "Leave WordPress" (/switch/leave-wordpress/), a high-intent
// acquisition surface that funnels into the Websites lane (custom-coded / static).
// Per CWS-INFORMATION-ARCHITECTURE.md, Situation pages share the Service
// template so rigor and GEO dimensions stay identical; lane points at the funnel
// target.
//
// WIREFRAME PASS, built from Chad's concept emails (May 28 to May 30, 2026).
// Written copy follows the voice profile + humanizing rules (no em-dashes, no
// triplets, no exact-three lists, reader-experience framing). Voice-critical
// persuasion is left as prompt() amber blocks carrying Chad's verbatim angles,
// so he writes the final lines himself.
//
// CAMPAIGN NOTES (not page copy, kept here so they aren't lost):
//   Targeting splits WordPress vs everything-else; this page hammers WordPress.
//   Outreach scans local businesses on divi/elementor/squarespace/WP and leads
//   with "it looks like your site hasn't been updated since [date]".
//   Geo: 50-mile radius of Philadelphia, PA only (local-trust angle).
//   LEGAL: before any "looks like WordPress / WP Engine" visual mimicry in ads,
//   check advertising / trademark IP law first (Chad flagged this 2026-05-28).

import { type Service } from "@/lib/service";

export const leaveWordpress: Service = {
  slug: "switch/leave-wordpress",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Switch: stop renting features you never use",
  title: "Leave WordPress",
  intent:
    "chadworks rebuilds WordPress sites that just sit there as fast, secure static sites and hosts them for less, for businesses near Philadelphia that pay for a CMS they almost never touch.",

  // Answer-first lede: names WordPress + answers why-leave / what-you-get in
  // the first 100 words (GEO), in Chad's warm first-person.
  answer:
    "Does your site just sit there? Then let it sit there for less. Most small businesses pick WordPress for a feature they're sure they'll use, editing the site themselves whenever they want, and then almost never do. You keep paying for that engine every month regardless. Now that a clean static rebuild is fast and affordable, there's no reason to keep renting it. I rebuild your WordPress site as fast, secure static pages on the same domain, with the same look and the same words you already have, and host it for about ten dollars a month less. You keep the site. You just stop paying for the parts you never touch.",

  keyFactsHeading: "Leaving WordPress, at a glance",
  keyFacts: [
    "Static hosting from chadworks is $20 a month, where most WordPress hosts land around $30, so leaving puts about $10 back in your pocket every month for a site that also happens to be faster. Non-profits pay $10.",
    "There is no admin to log into and no database sitting behind your site, so there is almost nothing left for someone to hack or for you to keep patched. Security comes built in.",
    "WordPress only earns its monthly cost if you are actually publishing on it. If your site mostly just sits there, that edit-it-yourself feature is quietly costing you somewhere between a hundred and a thousand-plus dollars a year that you never get back.",
  ],

  problem: {
    heading: "You are paying for a CMS you never log into",
    subheading: "WordPress is overkill for a site that barely changes.",
    body:
      "WordPress is built so you can edit your own site any time you want, and on day one that sounds great. But if you are like most small businesses, you set the site up once and then rarely touch it again. You keep paying for that flexibility every month anyway, and WordPress hosting gets a little more expensive to run every year.",
    more: {
      trigger: "Why it keeps costing more",
      paragraphs: [
        "Here's the part that stings once you see it. You're paying for the ability to edit the site yourself, and you almost never do. That one feature can run anywhere from a hundred dollars a year to well over a thousand, depending on your host, for something you don't touch. When you do need a change, I make it for you in a few minutes, at a fraction of what a monthly retainer costs.",
        "WordPress is never just WordPress. Underneath it sits a stack of plugins, a page builder, a database, and a never-ending update cycle, and all of it needs hosting muscle and steady security patching to stay safe. That is why WordPress hosting costs a little more every year. A static site drops the whole apparatus. Now that a rebuild is fast and affordable, the math finally tips for the many businesses that never needed a CMS in the first place.",
        "And leaving WordPress doesn't mean losing your site or starting from a blank page. I rebuild exactly what you have, the same look and the same words, sitting on the same domain. The only thing that disappears is the engine you were never really running. If an edit comes up later, you send it to me and it's handled, faster and cheaper than any retainer.",
      ],
    },
  },

  approach: {
    heading: "How leaving WordPress works",
    steps: [
      {
        title: "I check whether you actually use WordPress",
        body:
          "If you publish often and run a lot of your own content, I will tell you straight to stay put, because WordPress is doing real work for you. This page is for the sites that just sit there, and honestly that is most of them.",
      },
      {
        title: "I rebuild it as a static site",
        body:
          "I take the site you already have, with the same look and the same content on your same domain, and rebuild it as fast, custom-coded static pages. Nothing left running behind it that can slow down or get hacked.",
      },
      {
        title: "I move your hosting and the savings start",
        body:
          "I point your domain at static hosting and your old WordPress bill goes away. You drop to $20 a month, or $10 if you are a non-profit, with no update cycle to keep up with and security already handled.",
      },
      {
        title: "Need a change later? You just ask me",
        body:
          "When you want a tweak or a new page down the road, you message me and I handle it, usually fast and for a fraction of the cost of a standing monthly maintenance retainer.",
      },
    ],
  },

  paths: {
    heading: "Where this leads",
    intro:
      "Leaving WordPress lands you on a static build. If you want the full picture of what that actually is and why it tends to win, start with the custom-coded route below.",
    items: [
      {
        label: "Custom Coded / Static",
        detail:
          "Where most people leaving WordPress end up. The fastest, most secure route, with nothing to update and the whole site yours to keep.",
        href: "/custom-coded-static/",
      },
      {
        label: "Web Development",
        detail:
          "The bigger picture of how I build, and the other routes worth a look if static turns out not to be the right fit for you.",
        href: "/web-development/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "The portfolio",
        detail:
          "Real, live static builds you can click through. Same custom-built speed underneath, whatever the look on top.",
        href: "/portfolio/",
      },
      {
        label: "A real before-and-after",
        detail:
          "A documented before-and-after is on the way. The first WordPress-to-static rebuild I publish here will carry the real numbers, how much faster the site loads and how much the monthly bill dropped, instead of a vague promise. Until that client case is live, I would rather show you nothing than show you something invented.",
      },
    ],
  },

  price: {
    heading: "What hosting costs after you leave",
    body:
      "Static hosting through chadworks is $20 a month. The typical WordPress host runs around $30, so leaving puts roughly $10 back in your pocket every month, for a site that also loads faster and has far less that can break. There is no update cycle to keep up with, and security comes built in because there is so little surface left to attack. Non-profits and tight-budget organizations pay $10 a month. The one-time rebuild is a separate, scoped number you'll find on the rates page. And the honest caveat stands: if you truly live inside your CMS and publish all the time, I'll tell you to keep it.",
  },

  qualification: {
    heading: "Is leaving WordPress right for you?",
    fitLabel: "Leave if",
    fit: [
      "Your site mostly just sits there. You set it up once and barely log in.",
      "The hosting bill keeps creeping up every year for a site that has not really changed.",
      "Speed and simplicity matter to you more than a dashboard you never open.",
      "You would rather just ask someone for the occasional edit than manage it yourself.",
    ],
    notLabel: "Stay on WordPress if",
    notFit: [
      "You publish often and genuinely run a lot of your own content.",
      "You sell online or rely on features that truly need a live CMS or a database.",
    ],
  },

  faqs: [
    {
      q: "Will I lose my website if I leave WordPress?",
      a: "No. I rebuild the site you already have as a static site, keeping the same look and content on your same domain. You keep everything. The only thing that goes away is the WordPress engine underneath that you were paying for.",
    },
    {
      q: "What if I need to make changes after I switch?",
      a: "You message me and I make the change for you, usually quickly and for far less than a monthly maintenance retainer. Most businesses change their site so rarely that paying every month for a self-edit dashboard never actually pays off.",
    },
    {
      q: "How is static hosting cheaper and more secure?",
      a: "A static site is just fast files with no database behind it and no admin to log into, so there is very little left to break or hack and very little to maintain. That is why it runs $20 a month instead of the $30 or so that is typical for WordPress.",
    },
    {
      q: "Do you offer a discount for non-profits?",
      a: "Yes. Static hosting is $10 a month for non-profits and tight-budget organizations.",
    },
    {
      q: "Do you only work with local businesses?",
      a: "I'm based near Philadelphia, and a lot of this work is local on purpose. There's a real trust in hiring someone in your own area who actually picks up the phone. That said, the work itself is remote-friendly, so if you're further out and it's a good fit, I'm not going to turn you away over a map. Reach out and we'll figure it out.",
    },
  ],

  cta: {
    heading: "Let your site sit there for less",
    body:
      "Send me the address of your current WordPress site and I'll take a quick look, no pressure, and tell you whether leaving actually makes sense and what you'd save each month. I'm right here near Philadelphia if you'd rather work with someone local. And if it turns out you really do use WordPress, I'll be the first to tell you to stay put.",
    buttonLabel: "See what you'd save",
    href: "/contact/",
  },

  meta: {
    title: "Leave WordPress: Switch to Faster, Cheaper Static Hosting | chadworks",
    description:
      "Paying for a WordPress site that just sits there? I rebuild WordPress sites as fast, secure static sites and host them for $20 a month, where most WordPress hosts run around $30. Non-profits pay $10. Serving the Philadelphia area.",
  },
};
