// Service: Web Design for PA Preferred Members (/web-design-for-pa-preferred-members/).
// MVP breadth-first build in the Design lane. Angle: websites for PA Preferred
// program members, Pennsylvania-grown and made farms, food producers, and
// makers, with local-PA credibility, farm-stand and market info, and buy-local
// trust signals. Lean data only (no bespoke art); deepened later.

import { type Service } from "@/lib/service";

export const paPreferredMembers: Service = {
  slug: "web-design-for-pa-preferred-members",
  lane: "design",
  laneLabel: "Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "Built for PA-grown and PA-made",
  title: "Web Design for PA Preferred Members",
  intent:
    "chadworks builds websites for PA Preferred members, the Pennsylvania-grown and made farms, food producers, and makers, with local-PA credibility, farm-stand and market hours up front, and buy-local trust signals that turn neighbors into regulars.",

  answer:
    "If you carry the PA Preferred mark, your website should make a shopper trust you the way the program intends: Pennsylvania-grown, Pennsylvania-made, and worth a drive. I build exactly that. I'm Chad, I am based in Pennsylvania, and I have been shipping sites since the MySpace days. Your site leads with your farm-stand or market hours and location, puts the PA Preferred and any organic or local credentials up top, shows real photos of your land and your products, and reads like a neighbor you can trust rather than a faceless brand. It loads fast on a phone so a shopper at the market can find you. Custom builds run $5,000 to $10,000 depending on scope, quoted up front.",

  keyFactsHeading: "PA Preferred web design, at a glance",
  keyFacts: [
    "Your farm-stand or market hours, your location, and your season come first, because a local shopper deciding whether to drive out needs those answers before anything else.",
    "The PA Preferred mark and any organic, humane, or local certifications go up top as trust signals, so buy-local shoppers see the credentials that earned their loyalty.",
    "Real photos of your land, your animals, and your products do the selling. Stock farm imagery reads as fake to exactly the shoppers who care most about local and real.",
    "Run by one person who designs, writes, and codes the whole thing, and who is based in Pennsylvania, so your site sounds like you and not like a national chain template.",
  ],

  problem: {
    heading: "Why a generic site undercuts a buy-local business",
    subheading: "The shoppers who value local can smell a faceless brand.",
    body:
      "A buy-local customer chooses you over the grocery store because you are real, nearby, and theirs. A generic stock-photo website quietly tells them the opposite, and the trust the PA Preferred mark earned never lands.",
    more: {
      trigger: "The four things a real PA Preferred site fixes",
      paragraphs: [
        <>
          <strong>Hours and location are buried.</strong>{" "}A shopper deciding
          whether to drive out to your stand or find you at a market needs your
          hours, your address, and your season in the first glance. Hide them
          and you lose the visit to the store that was easier to find.
        </>,
        <>
          <strong>The local credentials are missing.</strong>{" "}The PA Preferred
          mark, plus any organic, humane, or grass-fed credentials, are exactly
          what your customers are buying. Left off the page, they cannot do the
          trust-building work that earned them.
        </>,
        <>
          <strong>The photos are stock.</strong>{" "}Generic farm imagery reads as
          fake to the very shoppers who care about real and local. Photos of
          your actual land, animals, and products are what convince a neighbor
          you are who you say you are.
        </>,
        <>
          <strong>It is hard to find on a phone.</strong>{" "}A lot of these
          decisions happen on a phone at a farmers market or in a car. A site
          that loads slowly or hides the basics loses the shopper standing right
          near your stand.
        </>,
      ],
    },
  },

  approach: {
    heading: "How a PA Preferred member site gets built",
    steps: [
      {
        title: "Discovery and your local story",
        body:
          "I learn what you grow or make, where shoppers find you, your season, and the story behind the operation, the parts that make a customer choose you over the grocery store.",
      },
      {
        title: "Hours, location, and the buy-local trust signals",
        body:
          "Your stand or market hours, your location, and your PA Preferred and other credentials go up top, so a shopper deciding whether to drive out gets the answers and the trust at a glance.",
      },
      {
        title: "Real photos and your products",
        body:
          "We feature real photos of your land and your goods, and lay out what you sell and when it is in season, so the site reads as authentically local as your stand does.",
      },
      {
        title: "Built fast on a phone, then launched",
        body:
          "The site loads fast on a phone for the shopper at the market, and we go live before your busy season. When the season shifts, you email me and I update it.",
      },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "Based in Pennsylvania",
        detail:
          "I am a Pennsylvania builder, so the local angle is not a guess. I know what buy-local credibility looks like to a shopper here and I build the site to carry it.",
      },
      {
        label: "The trade and local-business track record",
        detail:
          "I have built sites for trade and service businesses since the MySpace days, the kind of local, trust-driven work where a real site beats a chain every time. That carries straight into farms, food producers, and makers.",
      },
    ],
  },

  price: {
    heading: "What I quote up front is what you pay.",
    figure: "$5,000 - $10,000",
    figureSub: "Custom build, scope-dependent",
    body:
      "Pricing is based on scope, not hours. A focused site with your hours, location, story, and product list lands near the low end of the range. Add a real photo gallery, a market and events calendar, or online ordering and the number moves up. You see the full quote before we start, and that is the number on the final invoice. When the season changes, you email me and I bill the update.",
  },

  qualification: {
    heading: "Is this the right fit?",
    fitLabel: "A good fit if",
    fit: [
      "You are a PA Preferred member, a Pennsylvania farm, food producer, or maker, and your website does not match the quality of what you grow or make.",
      "You want shoppers to find your stand or market hours and trust you before they drive out.",
      "You want your PA Preferred mark and other credentials working for you up top, where they build buy-local loyalty.",
      "You would rather hire one Pennsylvania builder who gets the local angle than feed a national template.",
    ],
    notLabel: "Probably not if",
    notFit: [
      "You want the cheapest possible page and nothing else matters. I am not the cheapest, deliberately.",
      "A free social profile is genuinely all you need, and you have no interest in a site you own.",
    ],
  },

  faqs: [
    {
      q: "Will my farm-stand or market hours be easy to find?",
      a: "Yes. Your hours, location, and season go right up top, because that is the first thing a local shopper needs before deciding to drive out. The site also loads fast on a phone so they can check from the market or the car.",
    },
    {
      q: "Can you feature my PA Preferred mark and other certifications?",
      a: "Yes. The PA Preferred mark and any organic, humane, grass-fed, or other credentials you carry go up top as trust signals, so buy-local shoppers see exactly the credentials that earn their loyalty.",
    },
    {
      q: "Do you use my real photos or stock images?",
      a: "Your real photos, always. Generic stock farm imagery reads as fake to the shoppers who care most about local and real. If you do not have good shots yet, I will tell you exactly what to capture so your land and products do the selling.",
    },
    {
      q: "Can the site list my products and what is in season?",
      a: "Yes. We lay out what you grow or make and when it is available, so a shopper knows what to expect at your stand and when to come back. If you want online ordering, that can be part of the build too.",
    },
    {
      q: "How long does a build take?",
      a: "Two to three weeks from kickoff to launch for a focused site. Bigger scopes with a full photo gallery, a market and events calendar, or online ordering run four to six weeks. I quote a delivery date up front and aim it ahead of your busy season.",
    },
  ],

  cta: {
    heading: "If your site doesn't match the quality of what you grow or make, let's fix that.",
    body:
      "No pitch, no pressure. Tell me what you produce, where shoppers find you, and what your season looks like. I will tell you what I would build and what it would cost.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  meta: {
    title: "Web Design for PA Preferred Members | chadworks",
    description:
      "Websites for PA Preferred members: Pennsylvania-grown and made farms, food producers, and makers. Farm-stand and market hours up front, the PA Preferred mark and local credentials as trust signals, real photos, and fast on a phone. Custom builds run $5,000 to $10,000, quoted up front.",
  },
};
