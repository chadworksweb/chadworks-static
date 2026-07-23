// Service: Website Design for Authors (/web-design-for-authors/). MVP breadth-first
// build in the Design lane. Angle: book launch pages, retailer buy-links, a
// mailing list driven by a reader magnet, series and backlist organization,
// and events. Lean data only (no bespoke art); deepened later.

import { type Service } from "@/lib/service";
import { TYPICAL_BAND, TYPICAL_BAND_DASH } from "@/lib/pricing";

export const authors: Service = {
  slug: "web-design-for-authors",
  lane: "design",
  laneLabel: "Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "Built for the next launch",
  title: "Website Design for Authors",
  intent:
    "chadworks builds author sites that drive book launches, send readers straight to every retailer, grow a mailing list with a reader magnet, and keep your series and backlist easy to navigate.",

  answer:
    `An author site has two jobs: sell the book a reader just heard about, and turn that reader into a subscriber you can reach the day the next one drops. I build for both. I'm Chad, and I've been designing and shipping sites since the MySpace days. Your author site gets a focused launch page for the current title, buy-links to Amazon, Barnes and Noble, Bookshop, and your own store, a mailing list fueled by a reader magnet so your list grows on its own, and a clean home for your series and backlist so readers binge in order. Custom builds run ${TYPICAL_BAND} depending on scope, quoted up front before any work begins.`,

  keyFactsHeading: "Author web design, at a glance",
  keyFacts: [
    "Each book gets a real launch page with buy-links to every retailer, so a reader who just heard about the title goes straight to checkout instead of hunting around.",
    "Your mailing list is the asset. A reader magnet (a free story, a sample chapter, a deleted scene) trades for an email, and that list is who you sell the next book to on day one.",
    "Series and backlist stay organized so a reader who finishes book one can find book two in seconds and read the whole run in order.",
    "Run by one person who designs, writes, codes, and ships the whole thing, so your site reads like your books and not like a template every other author is using.",
  ],

  problem: {
    heading: "Why most author websites quietly cost you readers",
    subheading: "A reader who cannot find the buy button or the list is a reader you lose.",
    body:
      "An author site is not a digital business card. It is a sales engine for the current book and a machine for growing the list that sells the next one, and most author sites do neither well.",
    more: {
      trigger: "The four things a real author site fixes",
      paragraphs: [
        <>
          <strong>The buy-links are missing or out of date.</strong>{" "}If a
          reader cannot get from your book page to a retailer in one tap, you
          lose the sale to the friction. Every title needs current links to
          every store where it lives.
        </>,
        <>
          <strong>There is no reason to join the list.</strong>{" "}A bare "sign
          up for my newsletter" box converts almost no one. A reader magnet, a
          free story or a sample, gives the reader a reason to hand over an
          email, and that is how the list actually grows.
        </>,
        <>
          <strong>The series is a jumble.</strong>{" "}A reader who finished book
          one and cannot quickly find book two in reading order does not buy it.
          Series and backlist need to be obvious, ordered, and one click from
          purchase.
        </>,
        <>
          <strong>Events and news go stale.</strong>{" "}Readers and event
          organizers check your site for signings, festivals, and launch dates.
          A page nobody can keep current tells them you are not active, even
          when you are.
        </>,
      ],
    },
  },

  approach: {
    heading: "How an author site gets built",
    steps: [
      {
        title: "Discovery and the author brand",
        body:
          "I learn your genre, your voice, your catalog, and what is coming next, a launch, a box set, or a push to grow the list ahead of both.",
      },
      {
        title: "Launch pages and buy-links",
        body:
          "Each book gets a focused page with retailer buy-links wired in, so a reader who just heard about a title lands one tap from checkout at the store they prefer.",
      },
      {
        title: "Reader magnet and mailing list",
        body:
          "I set up a reader magnet that trades a free story or sample for an email, feeding the list provider you choose, so your subscriber count grows without you chasing it.",
      },
      {
        title: "Series, backlist, events, and launch",
        body:
          "Your series and backlist get organized in reading order, your events page stays easy to update, and we go live in time for your next release.",
      },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "A site that reads like your books",
        detail:
          "Because I design and write every page myself, your site carries your voice and genre instead of the generic look every author template ships with.",
      },
      {
        label: "Twenty years of shipping",
        detail:
          "I have been building and launching sites since the MySpace days. The fundamentals of selling a thing and capturing an audience have not changed, and they run through every author build.",
      },
    ],
  },

  price: {
    heading: "What I quote up front is what you pay.",
    figure: TYPICAL_BAND_DASH,
    figureSub: "Custom build, scope-dependent",
    body:
      "Pricing is based on scope, not hours. A focused site with a launch page, buy-links, and a mailing list lands near the low end of the range. Add a reader-magnet delivery flow, a full series and backlist catalog, or per-book landing pages and the number moves up. You see the full quote before we start, and that is the number on the final invoice. When the next book is ready, you email me and I bill the new launch page.",
  },

  qualification: {
    heading: "Is this the right fit?",
    fitLabel: "A good fit if",
    fit: [
      "You have a book launching or a backlist that deserves a real home instead of a single retailer listing.",
      "You want your mailing list to grow on its own through a reader magnet, not a dead newsletter box.",
      "You write a series and want readers to find and buy the next book without hunting.",
      "You would rather hire one builder who handles design and copy than wrestle a template.",
    ],
    notLabel: "Probably not if",
    notFit: [
      "You want the cheapest possible page and nothing else matters. I am not the cheapest, deliberately.",
      "A single retailer author page is genuinely all you need, and you have no interest in owning a list.",
    ],
  },

  faqs: [
    {
      q: "Will my book page link to every retailer?",
      a: "Yes. Each title gets buy-links to wherever the book is sold, Amazon, Barnes and Noble, Bookshop, your own store, so a reader goes straight to the retailer they prefer in one tap instead of searching for it.",
    },
    {
      q: "How does the reader magnet and mailing list work?",
      a: "I set up a free offer, a short story, a sample chapter, a deleted scene, that a reader gets in exchange for an email. That feeds the list provider you choose, so your subscriber list grows on its own and is ready the day your next book launches.",
    },
    {
      q: "Can readers navigate my series and backlist easily?",
      a: "Yes. Your series and backlist get organized in reading order with clear covers and buy-links, so a reader who just finished one book can find and buy the next one in seconds.",
    },
    {
      q: "Can I keep my events and news current myself?",
      a: "Yes. Your events page for signings, festivals, and launch dates is built to be easy to update, so readers and organizers always see an active author rather than a stale page.",
    },
    {
      q: "How long does a build take?",
      a: "Two to three weeks from kickoff to launch for a focused author site. Bigger scopes with a full backlist catalog, a reader-magnet delivery flow, and multiple launch pages run four to six weeks. I quote a delivery date up front and aim it at your next release.",
    },
  ],

  cta: {
    heading: "If your books live on a retailer page and nowhere you own, let's fix that.",
    body:
      "No pitch, no pressure. Tell me what you are launching next and what your catalog looks like. I will tell you what I would build and what it would cost.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  meta: {
    title: "Website Design for Authors | chadworks",
    description:
      `Author websites built to sell the book and grow the list: launch pages, retailer buy-links, a mailing list driven by a reader magnet, organized series and backlist, and events. Custom builds run ${TYPICAL_BAND}, quoted up front.`,
  },
};
