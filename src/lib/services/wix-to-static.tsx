// Situation page: "Wix to Static" (/switch/wix-to-static/). Switch-lane
// acquisition surface funneling into the Websites lane (custom-coded / static).
// Signature: the CompareTable in the problemArt slot. Real numbers only:
// chadworks static hosting $20/mo ($10 non-profit); Wix's own pricing stays
// qualitative. The angle that separates Wix from Squarespace: the lock-in (Wix
// gives you no real way to export your site).

import { type Service } from "@/lib/service";
import { CompareTable } from "@/components/art/CompareTable";

export const wixToStatic: Service = {
  slug: "switch/wix-to-static",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Switch: take your site with you",
  title: "Wix to Static",
  intent:
    "chadworks rebuilds Wix sites as fast, custom-coded static sites the client owns and can actually take with them, for businesses stuck on a platform built to make leaving hard.",

  answer:
    "Wix is built to keep you. There's no real way to export your site and take it elsewhere, so the monthly bill never quite ends and the longer you stay the more locked in you get. A custom static site is the opposite. I rebuild what you have as fast, hand-coded pages on your own domain, hosted for $20 a month, and every file is yours to keep and move whenever you like. Same content, a design made for your business, and no platform holding the exit shut. You get a faster site and your freedom back in one move.",

  keyFactsHeading: "Wix to static, at a glance",
  keyFacts: [
    "A custom static site is genuinely yours. The code and the hosting account sit in your name, so you can move it, hand it to someone else, or simply keep it, with no platform owning the door out.",
    "Static hosting from chadworks is $20 a month, or $10 for a non-profit, with no platform plan layered on top of it and no upgrade nag waiting in the dashboard.",
    "Wix sites carry a lot of weight just to make the editor work, and that weight slows the public page; a static rebuild is lean and fast and clean for Google and the AI assistants to read.",
  ],

  problemArt: (
    <CompareTable
      them="Wix"
      rows={[
        { feature: "Who owns it", them: "Wix owns the platform", us: "You own all of it" },
        { feature: "Taking it with you", them: "No real way to export", us: "Every file is yours to move" },
        { feature: "What you pay", them: "A monthly Wix plan", us: "$20/mo hosting, $10 non-profit" },
        { feature: "The design", them: "A Wix template", us: "Built around your business" },
        { feature: "Speed and AI readiness", them: "Heavy editor overhead", us: "Lean, fast, schema-ready" },
        { feature: "Making an edit", them: "Do it in Wix yourself", us: "Send it over, it's handled" },
      ]}
    />
  ),
  problem: {
    heading: "Wix makes leaving hard on purpose",
    subheading: "The lock-in is the business model.",
    body:
      "Wix is friendly to start and quietly unfriendly to leave. There is no clean way to export your site and run it somewhere else, which means the only path is to keep paying, year after year, for a site you can never quite take with you. That is not an accident. It is how the platform keeps you.",
    more: {
      trigger: "Why the lock-in costs you",
      paragraphs: [
        "The trap is that everything you build only exists inside Wix. The pages, the layout, even the work you paid to polish all live on their system, in their format, going nowhere. The day you want to move, you discover you are not moving the site, you are rebuilding it. A custom static site is the opposite by design: hand-coded files on your own domain and hosting, yours to pick up and carry anywhere.",
        "There is a speed cost too, and visitors feel it. Wix loads a heavy editor framework just to show a page, so the public site runs slower than the content alone ever needed to. A static rebuild drops all of that weight, which is exactly what makes pages quick for people and easy for Google and the AI assistants to read.",
        "And leaving does not mean losing what you have. I rebuild your content as a custom static site, keeping your words and images, on a design shaped around your business rather than a Wix template. You walk away owning the result, and you stop renting a site you were never allowed to take.",
      ],
    },
  },

  approach: {
    heading: "How leaving Wix works",
    steps: [
      {
        title: "I look at what you actually have",
        body:
          "You send me your Wix URL and I tell you straight whether a static rebuild makes sense. Because Wix gives you so little to export, I rebuild from what is on the live site, which is usually all that is needed.",
      },
      {
        title: "I rebuild it as a custom static site",
        body:
          "I recreate your content as fast, hand-coded pages, with a design built around your business instead of the Wix template you started on. Same words and images, finally on a site that is only yours.",
      },
      {
        title: "I move it onto hosting you own",
        body:
          "I point your domain at static hosting in your own name and the Wix plan goes away. You drop to $20 a month, or $10 as a non-profit, and from that point on the entire site belongs to you, to keep or carry wherever you like.",
      },
      {
        title: "Need a change later? You just ask me",
        body:
          "When something needs updating down the road, you message me and I handle it, usually fast, so you are never the one stuck inside a dashboard at night trying to bend the editor toward what you actually meant.",
      },
    ],
  },

  paths: {
    heading: "Where this leads",
    intro:
      "Leaving Wix lands you on a custom static build. If you want the full picture of what that actually is and why it tends to win, start with the route below.",
    items: [
      {
        label: "Custom Coded / Static",
        detail:
          "Where most people leaving Wix end up. The fastest, most durable route, designed around your business and genuinely yours to take anywhere.",
        href: "/custom-coded-static/",
      },
      {
        label: "Web Design",
        detail:
          "What a design built around your own business looks like once it no longer has to live inside a Wix template you can never export.",
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
          "Real, live custom builds you can click through, every one of them owned outright by the business it was made for.",
        href: "/portfolio/",
      },
    ],
  },

  price: {
    heading: "What hosting costs after you leave",
    body:
      "Static hosting through chadworks is $20 a month, and $10 for non-profits and tight-budget organizations. There is no platform plan sitting on top of it, because there is no platform, just fast files on hosting you control. The one-time rebuild is a separate, scoped number you'll find on the rates page. And the honest caveat holds: if Wix is genuinely doing something your business depends on, I'll tell you to stay.",
  },

  qualification: {
    heading: "Is leaving Wix right for you?",
    fitLabel: "Leave if",
    fit: [
      "You want a site you can actually own and take with you, not one trapped inside a platform.",
      "The monthly Wix bill keeps coming for a site that barely changes and feels a little slow.",
      "You want a design that looks like your business, not a Wix template with your logo on it.",
      "You'd rather hand off the occasional edit than wrestle the Wix editor yourself.",
    ],
    notLabel: "Stay on Wix if",
    notFit: [
      "You depend on a specific Wix app or booking feature that genuinely earns its monthly keep.",
      "You publish and restyle constantly and want to do all of it yourself inside that one dashboard.",
    ],
  },

  faqs: [
    {
      q: "Can I even leave Wix? I heard you can't export your site.",
      a: "You're right that Wix gives you no clean export, and that is exactly the lock-in. The way out is not exporting, it is rebuilding. I recreate your site as custom static pages from what is on your live site, keeping your content and your domain, and the result is yours to keep with no platform standing between you and it.",
    },
    {
      q: "Will I lose my content when I leave?",
      a: "No. Your words and images carry over into the new static site; what stays behind is the Wix platform and its monthly fee. You come away owning everything, on your own domain, instead of renting a site you could never take with you.",
    },
    {
      q: "How much does hosting cost once I switch?",
      a: "Static hosting is $20 a month, or $10 for a non-profit, with no platform plan on top. The one-time rebuild is quoted separately based on your site, and the real numbers for that live on the rates page.",
    },
    {
      q: "Why would a static site be faster than my Wix site?",
      a: "Wix loads a heavy editor framework before your page even appears, which is overhead the public never needed. A static site is just fast, hand-built files with none of that weight, so pages load quickly and both search engines and the AI assistants can read them without fighting through the overhead.",
    },
    {
      q: "Do you only work with local businesses?",
      a: "I'm based near Philadelphia, and a good deal of this work is local on purpose, because there's real trust in hiring someone in your own area who picks up the phone. The work itself is remote-friendly, though, so if you're further out and it's a good fit, I'm not going to turn you away over a map.",
    },
  ],

  cta: {
    heading: "Take your site with you",
    body:
      "Send me your Wix URL and I'll take a quick look, no pressure, and tell you whether a custom static rebuild makes sense and what it would take to get you off the platform and onto a site you own. I'm right here near Philadelphia if you'd rather work with someone local.",
    buttonLabel: "See what a rebuild takes",
    href: "/contact/",
  },

  meta: {
    title: "Wix to Static: Own a Faster Site You Can Actually Take With You | chadworks",
    description:
      "Stuck on Wix with no way to export your site? I rebuild Wix sites as fast, custom-coded static sites you own outright, hosted for $20 a month ($10 non-profit), on a design built around your business. Serving the Philadelphia area.",
  },
};
