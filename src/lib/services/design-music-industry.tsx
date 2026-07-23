// Service: Specialized Web Design for the Music Industry (/music-industry-web-design/).
// MVP breadth-first build in the Design lane. Angle: SPECIALIZED DESIGN (not
// consulting) for labels, studios, managers, and producers. Roster and
// discography, studio booking, credibility. Lean data only; deepened later.

import { type Service } from "@/lib/service";
import { TYPICAL_BAND, TYPICAL_BAND_DASH } from "@/lib/pricing";

export const musicIndustry: Service = {
  slug: "music-industry-web-design",
  lane: "design",
  laneLabel: "Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "Specialized design for the business of music",
  title: "Web Design for the Music Industry",
  intent:
    "chadworks designs specialized websites for labels, studios, managers, and producers: roster and discography pages, studio booking, and the credibility that gets artists and clients to say yes.",

  answer:
    `This is specialized web design for the business behind the music: labels, recording studios, artist managers, and producers. Not consulting, the build itself. I'm Chad, I design and code every site myself, I make music too, and I have been shipping sites since the MySpace days, so I speak both sides. A label gets a roster and discography that signals real catalog. A studio gets a booking flow and a gear-and-room showcase that fills the calendar. A manager or producer gets a credits page that closes deals. Every build is fast, server-rendered, and readable by Google and the AI assistants. Custom builds run ${TYPICAL_BAND} depending on scope, quoted up front.`,

  keyFactsHeading: "Music-industry web design, at a glance",
  keyFacts: [
    "This is design and build work for the business of music, labels, studios, managers, and producers, not advice or strategy decks. You get a finished, working site.",
    "Labels get a roster and discography that reads like a real catalog, so artists, press, and partners take the operation seriously.",
    "Studios get a booking flow plus a rooms-and-gear showcase that turns a curious engineer or band into a confirmed session on the calendar.",
    "Run by one person who designs, writes, and codes the whole thing, and who actually makes music, so the site speaks the language instead of guessing at it.",
  ],

  problem: {
    heading: "Why generic web design fails the music business",
    subheading: "A label, a studio, and a producer each need a different machine.",
    body:
      "A general agency builds the same brochure for everyone, then asks the music business to live in it. Roster, discography, booking, and credits are specialized surfaces, and a site that ignores that loses the artist, the session, or the deal.",
    more: {
      trigger: "The four things specialized music design gets right",
      paragraphs: [
        <>
          <strong>The roster signals real catalog.</strong>{" "}For a label, the
          roster and discography are the credibility. A flat list of names does
          not do it. Artists, releases, and credits need to be organized so a
          prospect sees a real operation worth signing or partnering with.
        </>,
        <>
          <strong>The studio actually books.</strong>{" "}A studio site that just
          lists hours loses the session. A real booking flow, paired with photos
          of the rooms and a clear gear list, turns a curious engineer or band
          into a confirmed date on the calendar.
        </>,
        <>
          <strong>The credits close the deal.</strong>{" "}For a producer or
          manager, the work is the pitch. A credits and placements page that is
          easy to scan and verify does more to land the next client than any
          paragraph of self-description.
        </>,
        <>
          <strong>It is readable by Google and AI.</strong>{" "}When an artist or
          A and R searches for a studio, a producer, or a label in a city or a
          genre, server-rendered and schema-rich pages are what get named.
          Generic builds stay invisible to the search that matters.
        </>,
      ],
    },
  },

  approach: {
    heading: "How a music-industry site gets built",
    steps: [
      {
        title: "Discovery and your role in the business",
        body:
          "Label, studio, management, or production, each needs a different site. I learn your catalog, your rooms, your roster, or your credits, and who you are trying to win.",
      },
      {
        title: "The credibility surface",
        body:
          "I build the page that signals you are real: a roster and discography for a label, a credits and placements list for a producer or manager, organized to be scanned and trusted.",
      },
      {
        title: "Booking and conversion where it fits",
        body:
          "Studios get a booking flow and a rooms-and-gear showcase that fills the calendar. Labels and managers get the clear contact and submission paths their business actually runs on.",
      },
      {
        title: "Built to be found, then launched",
        body:
          "Every page is fast, server-rendered, and schema-rich so Google and the AI assistants name you in genre and city searches. We launch, test, and I stay reachable.",
      },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "Built by someone who knows the business",
        detail:
          "I make music and I have worked around the industry, so a roster, a session calendar, and a credits page get built by someone who understands what each one is for.",
      },
      {
        label: "Most-cited site in its market",
        detail:
          "After a rebuild aimed at being readable to AI, a client became the single most-cited site for its region, ahead of the directories. The same discipline applies when an artist asks an assistant which studio or producer to use.",
      },
    ],
  },

  price: {
    heading: "What I quote up front is what you pay.",
    figure: TYPICAL_BAND_DASH,
    figureSub: "Custom build, scope-dependent",
    body:
      "Pricing is based on scope, not hours. A focused credibility site, a producer credits page or a studio one-pager, lands near the low end of the range. Add a full label roster and discography, a studio booking flow, or a deep gear-and-rooms showcase and the number moves up. You see the full quote before we start, and that is the number on the final invoice. When you sign a new artist or add a room, you email me and I bill the update.",
  },

  qualification: {
    heading: "Is this the right fit?",
    fitLabel: "A good fit if",
    fit: [
      "You run a label, studio, management company, or production shop and your site does not match the level of work you do.",
      "You need a roster, discography, or credits page that makes artists and clients take you seriously.",
      "You run a studio and want a booking flow that actually fills the calendar.",
      "You would rather hire one builder who speaks music than explain the business to a general agency.",
    ],
    notLabel: "Probably not if",
    notFit: [
      "You are looking for strategy advice or a consultant, this is the build, not the coaching.",
      "You want the cheapest possible page and nothing else matters. I am not the cheapest, deliberately.",
    ],
  },

  faqs: [
    {
      q: "Is this consulting or actual design and build work?",
      a: "It is specialized design and build work. You get a finished, working website, not a strategy deck or a set of recommendations. I design and code the whole thing for labels, studios, managers, and producers.",
    },
    {
      q: "Can you build a roster and discography for my label?",
      a: "Yes. I organize your artists, releases, and credits into a roster and discography that reads like a real catalog, so artists, press, and partners see an operation worth signing or working with.",
    },
    {
      q: "Can my studio take bookings through the site?",
      a: "Yes. Studios get a booking flow paired with photos of the rooms and a clear gear list, so a curious engineer or band can go from browsing to a confirmed session on your calendar.",
    },
    {
      q: "Will my credits page help me land clients?",
      a: "That is what it is for. For a producer or manager, a credits and placements page that is easy to scan and verify does more to win the next client than any block of self-description. I build it to do that job.",
    },
    {
      q: "How long does a build take?",
      a: "Two to three weeks from kickoff to launch for a focused credibility site. Bigger scopes with a full label roster, a studio booking flow, and a deep gear showcase run four to six weeks. I quote a delivery date up front and stick to it.",
    },
  ],

  cta: {
    heading: "If your site does not match the work you put out, let's fix that.",
    body:
      "No pitch, no pressure. Tell me whether you run a label, a studio, a roster, or a production shop, and who you are trying to win. I will tell you what I would build and what it would cost.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  meta: {
    title: "Web Design for the Music Industry | chadworks",
    description:
      `Specialized website design for labels, studios, managers, and producers: roster and discography pages, studio booking flows, and credits that close deals. Built by a developer who makes music. Custom builds run ${TYPICAL_BAND}, quoted up front.`,
  },
};
