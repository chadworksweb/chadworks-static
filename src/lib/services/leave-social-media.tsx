// Situation page: "Leave Social Media" (/switch/leave-social-media/). A
// product-style Situation: the Greenfield thesis (own your audience, stop
// renting attention) scaled DOWN to a chadworks small-business buyer. Unlike
// the platform-migration switch pages, this one carries a TIERED offer: one
// affordable entry module (your own feed) plus stackable add-ons, each linking
// to its own module page (SFVV / World Pass / Proliferator / Content Engine /
// expLOREr -- stubbed during this spike).
//
// SPIKE PASS. Copy follows the voice profile + humanizing rules (no em-dashes,
// no clause triplets, no exact-three enumerations, reader-experience framing).
// Pricing FIGURES are deliberately posture-only; the tier SHAPE is the point.
// Source: Crystopa Forge "The Greenfield" flagship spec.

import { type Service } from "@/lib/service";

export const leaveSocialMedia: Service = {
  slug: "switch/leave-social-media",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "Switch: stop building on rented land",
  title: "Leave Social Media",
  intent:
    "chadworks builds small businesses their own owned platform, a feed and an engagement layer on their own domain, so they stop pouring hours into apps that own the audience and control the reach.",

  answer:
    "Every hour you put into social media builds someone else's platform, not yours. The app owns the audience and can change the rules any morning, and the reach you earned can vanish with one update. I'm Chad, and I build you the alternative: your own feed on your own domain, the kind people scroll the way they scroll an app, with a rewards layer that gives them a reason to come back. You start with one affordable piece and add the rest whenever you want. Social becomes the trailer that points home, and your site becomes the place people actually stay.",

  keyFactsHeading: "Owning your audience, at a glance",
  keyFacts: [
    "Every follower you have on a social app belongs to the app, not to you. Move the audience onto your own domain and the relationship is finally yours to keep.",
    "You start with one affordable piece, your own feed, and bolt on the rest (the rewards economy, the automated poster, and more) only when you are ready.",
    "The whole thing runs on your domain with first-party data, so no algorithm decides who sees you and no platform harvests what you learn about your customers.",
    "An automated poster turns your own content into social teasers that pull people back to your site, so social works as your billboard instead of your landlord.",
  ],

  problem: {
    heading: "You are pouring work into land you will never own",
    subheading: "Social platforms rent you attention and keep the audience.",
    body:
      "You post, you comment, you chase the trends, and the numbers still depend on an algorithm you do not control. The people who follow you are the platform's users, not your contacts, and the day the rules change or an account gets locked, that reach is simply gone. You did the work and the platform kept the asset.",
    more: {
      trigger: "Why the math never favors you",
      paragraphs: [
        "Reach keeps getting throttled on purpose. Your organic posts get shown to fewer of your own followers every year, because the platform would rather sell that reach back to you as ads. You end up renting access to an audience you already earned.",
        "None of it compounds for you. A year of posting leaves you with nothing you can pick up and move. If you left the app tomorrow, the followers and the content and the data would all stay behind. On your own domain, every visit and every signup and every reward you hand out builds equity you keep.",
        "Owning your own place used to be out of reach for a small business, and that is the part that changed. The same feed-and-rewards experience the big apps run can now sit on your domain at a price a small business can actually start at, one piece at a time.",
      ],
    },
  },

  approach: {
    heading: "How leaving social media works",
    steps: [
      {
        title: "We start with your own feed",
        body:
          "Your entry piece is a feed on your own domain, full-screen and swipeable, the format your customers already know from their phone. It is the front door people land on when they come off social.",
      },
      {
        title: "We give them a reason to stay and come back",
        body:
          "Add the engagement layer and your visitors earn rewards, unlock perks, and build a little history with you. That is what turns a one-time visitor into someone who returns on purpose.",
      },
      {
        title: "We point social back at your site",
        body:
          "The automated poster reads your new content and posts teasers to your social accounts that drive people home. You keep a presence on the apps without living inside them.",
      },
      {
        title: "You add pieces as you grow",
        body:
          "Every part is a module. Start with the feed, then bolt on the economy, the auto-poster, or a custom content world for your industry whenever the timing and the budget are right.",
      },
    ],
  },

  tiers: {
    heading: "Start small, own more over time",
    intro:
      "The whole platform is built in modules. You begin with one affordable piece and stack the rest whenever you want, so the entry price stays low and the thing grows with you.",
    entry: {
      label: "Your Own Feed",
      price: "Low five figures",
      priceSub: "where the entry build starts",
      detail:
        "A full-screen, swipeable video feed on your own domain, the format people already scroll for hours. It is the door everything else attaches to, and it works on its own from day one.",
      includes: [
        "Snap-to-slide vertical feed on your own domain",
        "Built-in view and engagement tracking that is yours to keep",
        "Product and offer cards woven into the scroll",
        "Your own ordering, with no outside algorithm deciding reach",
      ],
      href: "/switch/leave-social-media/sfvv/",
    },
    addOnsLabel: "Add-ons, stack any of them",
    addOns: [
      {
        label: "The engagement economy",
        price: "Add-on",
        detail:
          "Passes, rewards, achievements, referrals, and gifts. The layer that turns visitors into regulars and gives them reasons to keep coming back.",
        href: "/switch/leave-social-media/world-pass/",
      },
      {
        label: "The automated poster",
        price: "Add-on",
        detail:
          "Reads your content and posts teasers to your social accounts on a schedule, all pointing back to your site. Your billboard runs itself.",
        href: "/switch/leave-social-media/proliferator/",
      },
      {
        label: "Your industry content world",
        price: "Add-on",
        detail:
          "The content layer built for your specific business: your products, your stories, your kind of customer. Custom-built, no template.",
        href: "/switch/leave-social-media/content-engine/",
      },
      {
        label: "Your story as an archive",
        price: "Add-on",
        detail:
          "Your history and behind-the-scenes turned into an explorable archive people can dig through, instead of a flat About page nobody reads.",
        href: "/switch/leave-social-media/explorer/",
      },
    ],
    footnote:
      "The low-five-figure starting point is directional. Per-module add-on prices land once the scopes are locked, but the tier shape is real.",
  },

  price: {
    heading: "What it costs",
    figure: "Starts in the low five figures",
    figureSub: "one-time build, entry module in",
    body:
      "Because the platform is modular, you start with just the feed and only pay for the pieces you turn on after that. A full build begins in the low five figures, well under what a custom app or a year of social management runs, and every add-on stacks from there. I price on what the platform does for your business, not by the hour, and you see the whole number before anything starts.",
    disclaimer: (
      <>
        This is a <strong>spike</strong>: the low-five-figure starting point is
        directional, and the per-module add-on prices land once the scopes are
        locked.
      </>
    ),
  },

  qualification: {
    heading: "Is leaving social media right for you?",
    fitLabel: "This is for you if",
    fit: [
      "You are tired of pouring hours into apps that own your audience and throttle your reach.",
      "You want a place customers return to on purpose, not just scroll past in a feed full of strangers.",
      "You would rather build something you keep than rent attention that resets every year.",
      "You are ready to start with one piece and grow it, instead of paying for everything at once.",
    ],
    notLabel: "It is not for you if",
    notFit: [
      "Social media is genuinely working as your whole business and you have no interest in owning the audience.",
      "You want a quick single-page flyer with nothing for visitors to come back to.",
    ],
  },

  faqs: [
    {
      q: "Do I have to quit social media completely?",
      a: "No. You keep your accounts. The idea is to stop making them the whole business. Social becomes the trailer that drives people to a place you own, instead of the place your audience lives.",
    },
    {
      q: "What does it mean to own my audience?",
      a: "On a social app, your followers are the platform's users and you only reach them when the algorithm allows. On your own domain, the visits and signups and rewards you hand out are first-party and yours to keep, so no rule change can take the relationship away.",
    },
    {
      q: "Why can I start cheaper than a big custom app?",
      a: "Because it is built in modules. You start with just the feed on your domain, which is one affordable piece, and add the economy, the auto-poster, or a custom content world later. You are never forced to buy the whole platform up front.",
    },
    {
      q: "Is any of this actually built, or is it a concept?",
      a: "It is built. The feed and the engagement economy are live and handling real traffic on chadrising.com today. What is new here is packaging it as a modular offer a small business can start at.",
    },
  ],

  cta: {
    heading: "Stop building someone else's platform",
    body:
      "Send me your site and your social handles and I'll show you what your own feed and rewards layer would look like on your domain, and where the affordable entry point lands for your business. If social is genuinely doing the whole job for you, I'll tell you that too.",
    buttonLabel: "See your own platform",
    href: "/contact/",
  },

  meta: {
    title:
      "Leave Social Media: Own Your Audience on Your Own Platform | chadworks",
    description:
      "Stop pouring hours into apps that own your audience. I build small businesses their own feed and rewards layer on their own domain, starting with one affordable module and adding the rest as you grow. Serving the Philadelphia area.",
  },
};
