// Situation page: "Squarespace to Static" (/switch/squarespace-to-static/).
// A switch-lane acquisition surface that funnels into the Websites lane
// (custom-coded / static). Same Service shape as the other switch pages; the
// signature is the CompareTable (septic comparison-table lineage) in the
// problemArt slot. Real numbers only: chadworks static hosting is $20/mo ($10
// non-profit); Squarespace's own pricing is kept qualitative (it changes and
// is theirs to state), so the page leads with what chadworks actually charges.

import { type Service } from "@/lib/service";
import { CompareTable } from "@/components/art/CompareTable";

export const squarespaceToStatic: Service = {
  slug: "switch/squarespace-to-static",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Switch: own your site, stop renting it",
  title: "Squarespace to Static",
  intent:
    "chadworks rebuilds Squarespace sites as fast, custom-coded static sites the client owns outright, for businesses tired of renting a template on a monthly subscription.",

  answer:
    "Squarespace is rented, not owned. You pay every month to keep your site live on a template thousands of other businesses also picked, and the day you stop paying, it's gone. A custom static site flips that. I rebuild what you have as fast, hand-built pages on your own domain, hosted for $20 a month, and the whole thing is yours to keep. Same content, a design built around your business instead of a theme, and nothing holding you hostage. You leave the monthly platform fee and the cookie-cutter look behind in a single move.",

  keyFactsHeading: "Squarespace to static, at a glance",
  keyFacts: [
    "A custom static site is yours outright. Everything sits in your name, from the code down to the hosting account, with nothing that vanishes the month you stop paying a platform.",
    "Static hosting from chadworks is $20 a month, or $10 for a non-profit, with no platform subscription stacked on top of it and no plan tier waiting to upsell you.",
    "Squarespace hands everyone the same templates; a custom build is designed around your business and nobody else's, and it loads faster for both Google and the AI assistants.",
  ],

  problemArt: (
    <CompareTable
      them="Squarespace"
      rows={[
        { feature: "Who owns it", them: "Squarespace owns the platform", us: "You own all of it" },
        { feature: "What you pay", them: "A monthly platform plan", us: "$20/mo hosting, $10 non-profit" },
        { feature: "The design", them: "A shared template", us: "Built around your business" },
        { feature: "Speed and AI readiness", them: "Platform overhead", us: "Hand-built, fast, schema-ready" },
        { feature: "If you stop paying", them: "The site goes dark", us: "The files are still yours" },
        { feature: "Making an edit", them: "Wrestle the editor yourself", us: "Send it over, it's handled" },
      ]}
    />
  ),
  problem: {
    heading: "You are renting a template, not owning a site",
    subheading: "The monthly bill never actually buys you the site.",
    body:
      "Squarespace is easy to start on, and that is the hook. What it never tells you plainly is that you are renting. The design is a template other businesses share, the site lives on Squarespace's terms, and the monthly fee buys you another month of access rather than a thing you own. Stop paying and it disappears.",
    more: {
      trigger: "Why renting catches up with you",
      paragraphs: [
        "The template is the first thing that bites. Squarespace's whole model is a finite set of layouts dressed up with your photos, so the moment a visitor has seen one site like yours, yours reads as one more of the same. A design built around your actual business is the thing a template can never be.",
        "Then there is the part you only feel later: you never own any of it. The pages, the structure, even the polish you paid someone to add all stay locked inside the platform. Move on and you start over. A custom static build is the opposite, hand-coded files on your own domain and hosting, entirely in your name from day one.",
        "And a static rebuild is simply faster and easier to find. There is no platform engine to load before your content shows up, which is exactly what Google and the AI assistants reward. You stop paying a monthly fee for the privilege of running a little slower than your own site has any reason to.",
      ],
    },
  },

  approach: {
    heading: "How leaving Squarespace works",
    steps: [
      {
        title: "I look at what you actually have",
        body:
          "You send me your Squarespace URL and I tell you straight whether a static rebuild makes sense. If the platform is genuinely doing work you need, I will say so. For most small business sites, it isn't.",
      },
      {
        title: "I rebuild it as a custom static site",
        body:
          "I take your content and rebuild it as fast, hand-coded pages, with a design shaped around your business rather than the template you started on. Same words and images, a site that finally looks like only you.",
      },
      {
        title: "I move it onto hosting you own",
        body:
          "I point your domain at static hosting in your own name and the Squarespace plan goes away. You drop to $20 a month, or $10 as a non-profit, and the whole site is yours to keep for as long as you want it.",
      },
      {
        title: "Need a change later? You just ask me",
        body:
          "When something needs updating down the road, you message me and I handle it, usually fast and for a fraction of what your time fighting the editor was worth.",
      },
    ],
  },

  paths: {
    heading: "Where this leads",
    intro:
      "Leaving Squarespace lands you on a custom static build. If you want the full picture of what that actually is and why it tends to win, start with the route below.",
    items: [
      {
        label: "Custom Coded / Static",
        detail:
          "Where most people leaving Squarespace end up. The fastest, most durable route, designed around your business and entirely yours to keep.",
        href: "/custom-coded-static/",
      },
      {
        label: "Web Design",
        detail:
          "What a design built around your own business actually looks like once it no longer has to start from a template everyone else can buy too.",
        href: "/web-design/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "This site is the proof",
        detail:
          "chadworks.co is a custom-coded static site, the same build I would move you to, doing its own job fast and in public.",
        href: "/custom-coded-static/",
      },
      {
        label: "The portfolio",
        detail:
          "Real, live custom builds you can click through, none of them started from a template anyone else can buy.",
        href: "/portfolio/",
      },
    ],
  },

  price: {
    heading: "What hosting costs after you leave",
    body:
      "Static hosting through chadworks is $20 a month, and $10 for non-profits and tight-budget organizations. There is no platform subscription sitting on top of it, because there is no platform, just fast files on hosting you own. The one-time rebuild is a separate, scoped number you'll find on the rates page. And the honest caveat holds: if Squarespace is genuinely doing something your business depends on, I'll tell you to stay.",
  },

  qualification: {
    heading: "Is leaving Squarespace right for you?",
    fitLabel: "Leave if",
    fit: [
      "You want a site that looks like your business, not a template a hundred others also bought.",
      "You'd rather own your site outright than rent it back from a platform every month.",
      "Speed and getting found matter to you, and the monthly fee has started to feel like a tax.",
      "You'd rather hand off the occasional edit than wrestle a page builder yourself.",
    ],
    notLabel: "Stay on Squarespace if",
    notFit: [
      "You lean hard on a Squarespace feature, like its built-in scheduling or store, that genuinely earns its keep.",
      "You publish and restyle constantly and want to do all of it yourself inside one dashboard.",
    ],
  },

  faqs: [
    {
      q: "Will I lose my site or my content if I leave Squarespace?",
      a: "No. I rebuild your content as a custom static site on your own domain, keeping the words and images you already have. The only thing left behind is the Squarespace platform and its monthly fee. You come away owning everything instead of renting it.",
    },
    {
      q: "Will it still look as polished as Squarespace?",
      a: "It looks more like you, which is the point. Instead of a shared template, you get a design built around your business. A custom build can do anything a template can, plus the things a template never lets you change. If you love your current look, I can carry its spirit over; if you were never quite happy with it, this is the moment to fix that.",
    },
    {
      q: "How much does hosting cost once I switch?",
      a: "Static hosting is $20 a month, or $10 for a non-profit, with no platform subscription on top. The one-time rebuild is quoted separately based on your site, and the real numbers for that live on the rates page.",
    },
    {
      q: "Why is a static site faster and easier to find than Squarespace?",
      a: "A static site is just fast, hand-built files with no platform engine to load first, so pages appear quickly and search engines and AI assistants can read them cleanly. Drag-and-drop platforms carry overhead to make the editor work, and that overhead is exactly what slows the public site down.",
    },
    {
      q: "Do you only work with local businesses?",
      a: "I'm based near Philadelphia, and a good deal of this work is local on purpose, because there's real trust in hiring someone in your own area who picks up the phone. The work itself is remote-friendly, though, so if you're further out and it's a good fit, I'm not going to turn you away over a map.",
    },
  ],

  cta: {
    heading: "Own your site, stop renting it",
    body:
      "Send me your Squarespace URL and I'll take a quick look, no pressure, and tell you whether a custom static rebuild makes sense and what it would take. I'm right here near Philadelphia if you'd rather work with someone local, and if Squarespace is genuinely serving you, I'll say so.",
    buttonLabel: "See what a rebuild takes",
    href: "/contact/",
  },

  meta: {
    title: "Squarespace to Static: Own a Faster Custom Site | chadworks",
    description:
      "On Squarespace and tired of renting a template? I rebuild Squarespace sites as fast, custom-coded static sites you own outright, hosted for $20 a month ($10 non-profit). A design built around your business, not a shared theme. Serving the Philadelphia area.",
  },
};
