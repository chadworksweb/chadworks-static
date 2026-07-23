// Service: Website Design for Bands and Musicians (/website-design-for-bands-musicians/).
// MVP breadth-first build in the Design lane. Angle: tour dates, EPK, streaming
// and merch links, mailing list capture, and a site that loads fast on a phone
// for a fan standing at a show. Lean data only (no bespoke art); deepened later.

import { type Service } from "@/lib/service";
import { TYPICAL_BAND, TYPICAL_BAND_DASH } from "@/lib/pricing";

export const bandsMusicians: Service = {
  slug: "website-design-for-bands-musicians",
  lane: "design",
  laneLabel: "Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "Built for the phone at the show",
  title: "Website Design for Bands and Musicians",
  intent:
    "chadworks builds artist sites that put tour dates, your EPK, streaming and merch links, and a mailing list signup in one fast home that loads instantly on a fan's phone at a show.",

  answer:
    `A fan at your show pulls out a phone, taps your name, and decides in seconds whether to follow you home. I build the site that turns that moment into a mailing list signup, a stream, or a merch sale. I'm Chad, I've built and shipped sites since the MySpace days, and I make music too, so I get the difference between a press kit and a poster. Your artist site loads fast on a phone, keeps tour dates current, links straight to Spotify, Apple Music, Bandcamp, and your merch, and captures emails so you own your audience instead of renting it from an algorithm. Custom builds run ${TYPICAL_BAND} depending on scope, quoted up front.`,

  keyFactsHeading: "Artist web design, at a glance",
  keyFacts: [
    "The fan at the show is on a phone. The site has to load instantly, show the next tour dates, and make following you and grabbing your email effortless before the moment passes.",
    "One home for everything: tour dates, your EPK for bookers and press, links to every streaming platform, and your merch store, instead of a scattered link-in-bio you do not control.",
    "Mailing list capture is built in, because the email list is the one part of your audience no platform can take away or throttle.",
    "Run by one person who designs, writes, codes, and ships the whole thing, and who actually makes music, not a template farm cranking out the same band site twice a week.",
  ],

  problem: {
    heading: "Why a link-in-bio is not enough for a working artist",
    subheading: "You are renting your audience from someone else's algorithm.",
    body:
      "A scattered set of social links and a third-party link page means every fan you reach lives on a platform that can throttle, change, or vanish overnight. A real site is the home you own.",
    more: {
      trigger: "The four things a real artist site fixes",
      paragraphs: [
        <>
          <strong>It is slow or clunky on a phone.</strong>{" "}Nearly every fan
          who looks you up is on mobile, often standing in a crowd. A site that
          loads slowly or fights their thumb loses them before the next song
          starts.
        </>,
        <>
          <strong>Tour dates are stale or missing.</strong>{" "}If a fan cannot
          find your next show in one tap, you lose the ticket. Dates need to be
          front and center and easy for you to keep current.
        </>,
        <>
          <strong>There is no real EPK.</strong>{" "}Bookers and press want a
          clean press kit: bio, photos, music, and contact, in one link. A
          buried PDF or none at all costs you gigs and coverage.
        </>,
        <>
          <strong>You are not capturing emails.</strong>{" "}Followers belong to
          the platform. An email list belongs to you. Without a signup working
          on every page, you are leaving your most loyal fans on rented land.
        </>,
      ],
    },
  },

  approach: {
    heading: "How an artist site gets built",
    steps: [
      {
        title: "Discovery and the artist story",
        body:
          "I learn your sound, your story, where you play, and what you are pushing right now, a release, a tour, or building the mailing list ahead of both.",
      },
      {
        title: "Built mobile-first for the fan at the show",
        body:
          "Tour dates, streaming links, and a mailing list signup all load instantly on a phone, so a fan can follow you and grab a ticket without pinching and zooming.",
      },
      {
        title: "EPK, merch, and streaming wired in",
        body:
          "A clean press kit for bookers and press, direct links to every streaming platform and your merch store, and an email capture that feeds the list you own.",
      },
      {
        title: "Launch and stay reachable",
        body:
          "We go live in time for your next push, and when you need a date updated or a release page before a drop, you email me and I handle it.",
      },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "Built by someone who makes music",
        detail:
          "I write and record too, so I know the difference between a site that looks like a band and one that actually books shows, sells merch, and grows the list.",
      },
      {
        label: "Twenty years of shipping",
        detail:
          "I have been building and launching sites since the MySpace days, back when artists first learned the page they own beats the profile they rent. That lesson runs through every build.",
      },
    ],
  },

  price: {
    heading: "What I quote up front is what you pay.",
    figure: TYPICAL_BAND_DASH,
    figureSub: "Custom build, scope-dependent",
    body:
      "Pricing is based on scope, not hours. A focused site with tour dates, streaming links, and a mailing list lands near the low end of the range. Add a full EPK section, a merch store integration, or per-release landing pages and the number moves up. You see the full quote before we start, and that is the number on the final invoice. When you need a new release page later, you email me and I bill the work.",
  },

  qualification: {
    heading: "Is this the right fit?",
    fitLabel: "A good fit if",
    fit: [
      "You play out or release regularly and you are tired of duct-taping a link-in-bio together.",
      "You want to own your mailing list instead of renting your audience from a platform.",
      "You need a real EPK that bookers and press can use in one link.",
      "You would rather hire one builder who actually gets music than feed a template farm.",
    ],
    notLabel: "Probably not if",
    notFit: [
      "You want the absolute cheapest site and nothing else matters. I am not the cheapest, deliberately.",
      "A free third-party profile is genuinely all you need right now, and you are fine renting that reach.",
    ],
  },

  faqs: [
    {
      q: "Can fans buy tickets and find shows from my site?",
      a: "Yes. Tour dates sit front and center and link straight to wherever you sell tickets, and the whole thing loads fast on a phone so a fan standing at a show can grab the next date in one tap.",
    },
    {
      q: "Will the site link to Spotify, Apple Music, Bandcamp, and my merch?",
      a: "Yes. I wire in direct links to every streaming platform you are on and to your merch store, so a fan lands in one place and goes straight to listening or buying without hunting around.",
    },
    {
      q: "Do I get a real EPK for bookers and press?",
      a: "Yes. A clean press kit with your bio, photos, music, and contact lives in one shareable link, so when a booker or a writer asks for materials you send a URL instead of scrambling for a PDF.",
    },
    {
      q: "How does the mailing list capture work?",
      a: "An email signup runs on every page and feeds the list provider you choose, so the fans who care most end up on a list you own and control, not a follower count a platform can throttle.",
    },
    {
      q: "How long does a build take?",
      a: "Two to three weeks from kickoff to launch for a focused artist site. Bigger scopes with a full EPK, a merch integration, and per-release pages run four to six weeks. I quote a delivery date up front and aim it at your next release or tour.",
    },
  ],

  cta: {
    heading: "If your music lives on six platforms and no home of your own, let's fix that.",
    body:
      "No pitch, no pressure. Tell me what you are pushing next and where your fans actually find you. I will tell you what I would build and what it would cost.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  meta: {
    title: "Website Design for Bands and Musicians | chadworks",
    description:
      `Artist websites built for the fan at the show: tour dates, a real EPK, streaming and merch links, and a mailing list signup, all fast on a phone. Built by a developer who makes music. Custom builds run ${TYPICAL_BAND}, quoted up front.`,
  },
};
