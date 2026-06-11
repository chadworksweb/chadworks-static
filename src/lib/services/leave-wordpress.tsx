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

import { type Service, prompt } from "@/lib/service";

export const leaveWordpress: Service = {
  slug: "switch/leave-wordpress",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Switch: stop renting features you never use",
  title: "Leave WordPress",
  intent:
    "chadworks rebuilds WordPress sites that just sit there as fast, secure static sites and hosts them for less, for businesses near Philadelphia that pay for a CMS they almost never touch.",

  // Answer-first lede. PROMPT: Chad's hooks verbatim so the voice stays his.
  answer: prompt(
    "Answer-first lede (Chad's voice)",
    "Open with the flip from the emails: \"Does your site just sit there? Well, let it sit there for less.\" The argument: most small-business sites get picked on WordPress for features (edit-it-yourself, page builders) the owner never actually uses, and now that AI makes a clean static rebuild cheap and fast, there is no reason to keep paying for that bloat. You keep the site you have and leave the overhead. Quotable in the first 100 words. First-person, warm. Name the entity (WordPress) and answer the question (why leave, what you get) up front for GEO.",
  ),

  keyFactsHeading: "Leaving WordPress, at a glance",
  keyFacts: [
    "Static hosting from chadworks is $20 a month. Most WordPress hosts land around $30, so leaving puts about $10 back in your pocket every month for a site that also happens to be faster.",
    "There is no admin to log into and no database sitting behind your site, so there is almost nothing left for someone to hack or for you to keep patched. Security comes built in.",
    "WordPress only earns its monthly cost if you are actually publishing on it. If your site mostly just sits there, that edit-it-yourself feature is quietly costing you somewhere between a hundred and a thousand-plus dollars a year that you never get back.",
    "When you do need a wording change or a new page, you send it to me and I make it for you, usually fast, and for far less than a monthly maintenance retainer.",
    "Run a non-profit or a tight budget? Static hosting is $10 a month.",
  ],

  problem: {
    heading: "You are paying for a CMS you never log into",
    subheading: "WordPress is overkill for a site that barely changes.",
    body:
      "WordPress is built so you can edit your own site any time you want, and on day one that sounds great. But if you are like most small businesses, you set the site up once and then rarely touch it again. You keep paying for that flexibility every month anyway, and WordPress hosting gets a little more expensive to run every year.",
    more: {
      trigger: "Why it keeps costing more",
      paragraphs: [
        prompt(
          "The 'feature you never use' argument",
          "Chad's email, near-verbatim: paying for a site you can edit yourself but you really never touch, that extra feature is costing you $100, maybe a few hundred, sometimes over a thousand dollars a year, for a feature you never use. I can make those changes for you in a split second for a fraction of the cost of a retainer.",
        ),
        prompt(
          "Why WordPress gets heavier and pricier",
          "Expand on bloat and rising cost: WordPress carries plugins, page builders, a database, and a constant update cycle, all of which need hosting muscle, maintenance, and security patching. That is why WP hosting prices keep climbing. A static site drops all of it. Now that AI makes the rebuild cheap, the math finally flips for businesses that do not need a CMS.",
        ),
        prompt(
          "The reassurance: you don't lose anything",
          "Address the obvious fear: leaving WordPress does not mean losing your site or starting over. I rebuild what you have as a static site, same look, same content, same domain, and you just stop paying for the engine you never ran. And if you do need edits, I handle them faster and cheaper than a retainer.",
        ),
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
          "When you want a tweak or a new page down the road, you message me and I handle it, usually fast and for a fraction of what a maintenance retainer would have cost. You get the result without paying every month for a dashboard you never open.",
      },
    ],
  },

  paths: {
    heading: "Where this leads",
    intro:
      "Leaving WordPress lands you on a static build. If you want the full picture of what that actually is, start here.",
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
        detail: prompt(
          "Speed / cost proof point",
          "Add a concrete before-and-after once we have one: a real WordPress site rebuilt static, with the load-time drop, the monthly-cost drop, and the security surface that disappeared. Use a real client number, no vague claims (GEO checklist: proof not promises).",
        ),
      },
    ],
  },

  price: {
    heading: "What hosting costs after you leave",
    // PROMPT: pricing posture in Chad's voice; the numbers are fixed in the brief.
    body: prompt(
      "Static hosting pricing posture",
      "State it plainly in Chad's voice: static hosting is $20 a month, about $10 less than the typical $30 WordPress host, with no update cycle and security included because there is simply less that can break. Non-profits and tight-budget organizations pay $10 a month. Contrast it with the WordPress feature-you-never-use premium. Keep the chadworks honesty posture: if you really do live in your CMS, I will tell you to stay. Note that the one-time rebuild is quoted separately on the rates page; this number is the ongoing hosting.",
    ),
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
      a: prompt(
        "Local Philadelphia positioning",
        "Chad's angle: I am local and I stay within about 50 miles of Philadelphia, in PA. Decide how hard to gate this. The local-trust angle is a selling point for the outreach campaign, but we may still take a good remote fit. Phrase it warmly, in Chad's voice.",
      ),
    },
  ],

  cta: {
    heading: "Let your site sit there for less",
    body: prompt(
      "CTA body (local + low-friction)",
      "Close in Chad's voice: invite them to send the URL of their current WordPress site for a quick, no-pressure read on whether leaving makes sense and what they would save each month. Lean on the local Philadelphia angle. Reassure them that if they genuinely use WordPress, I will tell them to stay.",
    ),
    buttonLabel: "See what you'd save",
    href: "/contact/",
  },

  meta: {
    title: "Leave WordPress: Switch to Faster, Cheaper Static Hosting | chadworks",
    description:
      "Paying for a WordPress site that just sits there? I rebuild WordPress sites as fast, secure static sites and host them for $20 a month, where most WordPress hosts run around $30. Non-profits pay $10. Serving the Philadelphia area.",
  },
};
