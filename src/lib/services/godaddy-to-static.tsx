// Situation page: "GoDaddy to Static" (/switch/godaddy-to-static/). Switch-lane
// acquisition surface funneling into the Websites lane (custom-coded / static).
// Signature: the CompareTable in the problemArt slot. Real numbers only:
// chadworks static hosting $20/mo ($10 non-profit); GoDaddy's own pricing stays
// qualitative. The angle: most GoDaddy sites began as a domain-purchase upsell
// into the Website Builder, and the owner has outgrown the starter site.

import { type Service } from "@/lib/service";
import { CompareTable } from "@/components/art/CompareTable";

export const godaddyToStatic: Service = {
  slug: "switch/godaddy-to-static",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Switch: from a builder to a real site",
  title: "GoDaddy to Static",
  intent:
    "chadworks rebuilds GoDaddy Website Builder sites as fast, custom-coded static sites designed around the business, for owners who bought a domain, got upsold a builder, and outgrew it.",

  answer:
    "Most GoDaddy sites started as an upsell. You bought a domain, got nudged into the website builder, and ended up with a tidy little template that does the job but never really looks like you mean business. A custom static site is the step up. I rebuild what you have as fast, hand-coded pages on the same domain you already own, hosted for $20 a month, with a design made for your business instead of a builder's default. You keep the domain, drop the monthly builder fee, and finally get a site that carries some weight.",

  keyFactsHeading: "GoDaddy to static, at a glance",
  keyFacts: [
    "A custom static site is designed around your business, not assembled from a builder's stock blocks, so it stops reading as a starter site and starts reading as a real one.",
    "Static hosting from chadworks is $20 a month, or $10 for a non-profit, with no website-builder subscription on top. You keep the GoDaddy domain you already own; only the builder fee goes away.",
    "Static pages are lean and quick, which your visitors and the AI assistants both notice, where a drag-and-drop builder tends to leave a site slower and thinner than it needs to be.",
  ],

  problemArt: (
    <CompareTable
      them="GoDaddy Builder"
      rows={[
        { feature: "Who designed it", them: "A stock builder template", us: "Built around your business" },
        { feature: "What you pay", them: "A monthly builder plan", us: "$20/mo hosting, $10 non-profit" },
        { feature: "The ceiling", them: "What the builder allows", us: "Whatever your site needs" },
        { feature: "Speed and AI readiness", them: "Builder overhead", us: "Lean, fast, schema-ready" },
        { feature: "Your domain", them: "Stays at GoDaddy, fine", us: "Stays yours, points anywhere" },
        { feature: "Making an edit", them: "Do it in the builder", us: "Send it over, it's handled" },
      ]}
    />
  ),
  problem: {
    heading: "A website builder is where a site starts, not where it stays",
    subheading: "You outgrew the starter site.",
    body:
      "GoDaddy's builder is great at one thing: getting something live fast after you buy a domain. The catch is that it was never meant to be where your site ended up. It hands you a stock template with a ceiling on it, charges you every month to keep it, and quietly signals to anyone who lands on it that the website was an afterthought.",
    more: {
      trigger: "Why the builder holds you back",
      paragraphs: [
        "The template is the giveaway. A builder works by handing everyone the same blocks, so your site reads as generic before a visitor has taken in a word, no matter how good your business actually is. A design built around what you do is the thing a stock template structurally cannot be, and it is what makes a site finally look like it belongs to a real company.",
        "Then there is the ceiling. The moment you want something the builder does not offer, you are stuck, and the answer is always to upgrade a plan or do without. A custom static site has no such wall. It does whatever your site genuinely needs, because it is built for you rather than rented from a menu.",
        "And you do not have to give up your domain to fix any of this. You bought it through GoDaddy and it stays yours; I simply point it at fast static hosting and rebuild the site behind it. The monthly builder fee goes away, the starter look goes with it, and your address stays exactly the same.",
      ],
    },
  },

  approach: {
    heading: "How leaving the GoDaddy builder works",
    steps: [
      {
        title: "I look at what you actually have",
        body:
          "You send me your GoDaddy site and I tell you straight whether a custom rebuild is worth it. For a simple brochure site that mainly needs to look credible and load quickly, the answer is almost always yes.",
      },
      {
        title: "I rebuild it as a custom static site",
        body:
          "I recreate your content as fast, hand-coded pages, with a design built around your business instead of the builder template you started on. Same information, finally on a site that looks like you meant it.",
      },
      {
        title: "I move it onto hosting, your domain stays put",
        body:
          "Your GoDaddy domain stays right where it is and stays yours. I point it at static hosting in your own name and the monthly builder fee simply drops off, landing you at $20 a month, or $10 if you run as a non-profit.",
      },
      {
        title: "Need a change later? You just ask me",
        body:
          "When something needs updating down the road, you message me and I handle it, usually fast, instead of logging back into a builder to nudge blocks around until they line up.",
      },
    ],
  },

  paths: {
    heading: "Where this leads",
    intro:
      "Leaving the GoDaddy builder lands you on a custom static build. If you want the full picture of what that actually is and why it wins, start with the route below.",
    items: [
      {
        label: "Custom Coded / Static",
        detail:
          "Where most people leaving a website builder end up. The fastest, most durable route, designed around your business and entirely yours to keep.",
        href: "/custom-coded-static/",
      },
      {
        label: "Web Design",
        detail:
          "What a design built around your own business looks like once it no longer has to come out of a builder's stock template menu.",
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
        label: "The showroom",
        detail:
          "Real, live custom builds you can click through, none of them assembled from a template anyone else can rent.",
        href: "/showroom/",
      },
    ],
  },

  price: {
    heading: "What hosting costs after you leave",
    body:
      "Static hosting through chadworks is $20 a month, and $10 for non-profits and tight-budget organizations. There is no builder subscription sitting on top of it, just fast files on hosting you control, with your GoDaddy domain pointed at it. The one-time rebuild is a separate, scoped number you'll find on the rates page. And the honest caveat holds: if the builder is genuinely all your business needs, I'll tell you to keep it.",
  },

  qualification: {
    heading: "Is leaving the GoDaddy builder right for you?",
    fitLabel: "Leave if",
    fit: [
      "Your site started as a domain-purchase upsell and has quietly outgrown the builder.",
      "You want a site that looks like a real business, not a starter template with your name dropped in.",
      "The monthly builder fee keeps coming for a site that feels basic and a little slow.",
      "You'd rather hand off the occasional edit than nudge builder blocks around yourself.",
    ],
    notLabel: "Keep the builder if",
    notFit: [
      "You have a one-page placeholder that genuinely only needs to exist, and looking sharp does not matter yet.",
      "You are happy editing constantly inside the builder and the starter look is exactly what you want.",
    ],
  },

  faqs: [
    {
      q: "Do I lose my GoDaddy domain if I leave the builder?",
      a: "No. Your domain stays yours and stays at GoDaddy if you like; I just point it at fast static hosting and rebuild the site behind it. The only thing that goes away is the monthly website-builder fee. Your address does not change at all.",
    },
    {
      q: "Will my new site look better than the builder template?",
      a: "That's the whole point. Instead of a stock template, you get a design built around your business, which is what makes a site read as established rather than improvised. A custom build can do anything the builder does, plus everything the builder's ceiling never let you reach.",
    },
    {
      q: "How much does hosting cost once I switch?",
      a: "Static hosting is $20 a month, or $10 for a non-profit, with no builder subscription on top. The one-time rebuild is quoted separately based on your site, and the real numbers for that live on the rates page.",
    },
    {
      q: "Why would a static site be faster than the GoDaddy builder?",
      a: "A builder loads extra machinery to make its drag-and-drop work, and that machinery slows the public page. A static site is just fast, hand-built files with none of that overhead, so pages load quickly and both search engines and the AI assistants can read them without wading through it.",
    },
    {
      q: "Do you only work with local businesses?",
      a: "I'm based near Philadelphia, and a good deal of this work is local on purpose, because there's real trust in hiring someone in your own area who picks up the phone. The work itself is remote-friendly, though, so if you're further out and it's a good fit, I'm not going to turn you away over a map.",
    },
  ],

  cta: {
    heading: "Outgrow the builder",
    body:
      "Send me your GoDaddy site and I'll take a quick look, no pressure, and tell you whether a custom static rebuild is worth it and what it would take. Your domain stays yours the whole time. I'm right here near Philadelphia if you'd rather work with someone local.",
    buttonLabel: "See what a rebuild takes",
    href: "/contact/",
  },

  meta: {
    title: "GoDaddy to Static: Trade the Builder for a Real Custom Site | chadworks",
    description:
      "Outgrown the GoDaddy website builder? I rebuild GoDaddy Builder sites as fast, custom-coded static sites designed around your business, hosted for $20 a month ($10 non-profit). Keep your domain, drop the builder fee. Serving the Philadelphia area.",
  },
};
