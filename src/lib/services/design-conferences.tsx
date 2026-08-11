// Service: Website Design for Conferences (design vertical) -- industry
// conferences through fan conventions. Sibling of design-events.tsx and
// design-retreats.tsx.
//
// COPY NOTE: chadworks has NO conference-vertical proof yet (Chad,
// 2026-08-11). Every claim is paid for with a mechanism or a disclosed limit
// rather than with claimed experience (CWS-VOICE section 6), and the
// testimonials are the two non-event quotes, matching the events page.
//
// Written against CWS-VOICE.md: median 13-word sentences, second person
// dominant, colon as the joint, no triplets, no three-item lists.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { ConferencesHeroArt } from "@/components/art/ExperienceHeroArt";
import { HIGH, HOURLY, LOW, TYPICAL_BAND } from "@/lib/pricing";
import { BASE, money } from "@/lib/package-builder";

export const designConferences: Service = {
  slug: "website-design-for-conferences",
  lane: "design",
  laneLabel: "Web Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "For conferences and cons, from tech to comics",
  title: "Website Design for Conferences",
  intent:
    "chadworks designs conference and convention websites where the schedule and the guest list are the product.",

  answer: (
    <>
      A conference website sells twice. Once when you announce, and again when
      somebody standing in a hallway needs to know what starts in ten minutes.
      I&apos;m Chad Lewine, and I have been building websites for 20 years. Your
      schedule and your guest list are the product here, so the site gets built
      around keeping both current without a developer in the loop.
    </>
  ),

  heroArt: <ConferencesHeroArt />,

  keyFactsHeading: "Conference websites, at a glance",
  keyFacts: [
    "Guest announcements are the campaign. You need to publish one on a Tuesday afternoon and have it land on the site and in the schedule at the same time, without waiting on anyone.",
    "During the show your site is a phone in a crowded hall on strained wifi. Page weight matters more that weekend than in the whole rest of the year.",
    "Exhibitors arrive through a different door than attendees. Their applications and the sponsor prospectus run on their own track, with their own deadlines.",
    (
      <>
        You own the site and the working files on final payment, which matters
        for an event that hands off between volunteer chairs.{" "}
        <Link href="/about/" className="svc-inline-link">
          The person who designs it is the person you email next year.
        </Link>
      </>
    ),
  ],

  problem: {
    heading: "The schedule is the product, and most conference sites bury it.",
    subheading:
      "By the time an attendee finds the grid, they have decided how organized you are.",
    body:
      "A schedule that lives in a PDF, or in a page somebody rebuilds manually every time a session moves, is the single most common failure on a conference site. It is also the most fixable, because the problem is structural rather than visual.",
    more: {
      trigger: "What a conference site actually has to carry",
      hideBodyIntro: true,
      paragraphs: [
        <>
          <strong>The announcement cadence is the marketing.</strong> Guests and
          speakers get revealed on a rhythm, and each reveal is a reason for
          people to come back. If publishing one means emailing a developer,
          the rhythm dies quietly and the sales curve follows it.
        </>,
        <>
          <strong>Multi-track grids break on phones.</strong> A four-track
          Saturday is a comfortable table on a laptop and a disaster at 390
          pixels wide. The grid has to be designed twice, because your attendees
          are reading it in a hallway rather than at a desk.
        </>,
        <>
          <strong>Last year is proof, not clutter.</strong> Photos, the previous
          guest list, the attendance number, and the exhibitor roster are what
          convince a first-timer that you are real. Wiping the site every year
          throws away the evidence you spent a year earning.
        </>,
        <>
          <strong>Exhibitors are a second audience with a deadline.</strong>{" "}
          Booth applications and the sponsor prospectus have nothing to do with
          the attendee path, and stapling them onto the same navigation is why
          both get harder to find.
        </>,
      ],
    },
  },

  approach: {
    heading: "How a conference site gets built",
    steps: [
      {
        title: "Model the schedule as data",
        body:
          "Sessions, rooms, tracks and times get structured once, then rendered wherever they are needed: the full grid, a single guest's page, the day view, the printable version. Moving a panel becomes one edit rather than five.",
      },
      {
        title: "Make an announcement a five-minute job",
        body:
          "Adding a guest means filling in a name, a photo, a bio, and which sessions they are in. The site handles where they appear. This is the piece that decides whether your announcement rhythm survives contact with a busy month.",
      },
      {
        title: "Design the grid for the hallway",
        body:
          "The schedule gets a phone layout of its own rather than a shrunken table, and it stays fast on bad wifi. Attendees checking what starts next are the heaviest users your site will ever have.",
      },
      {
        title: "Split the exhibitor path from the attendee path",
        body:
          "The applications and the prospectus live on their own track, with booth deadlines attached. Neither audience wades through the other's information to find its own.",
      },
      {
        title: "Keep the archive, sell the next year",
        body:
          "Previous years move into an archive that stays findable, while the front of the site resets to the year you are selling. You keep the proof and lose the confusion.",
      },
      {
        title: "Hand it over, in your name",
        body:
          "The site and every working file behind it are yours on final payment. Nothing is registered to me, which is the difference that matters when the chair role changes hands.",
      },
    ],
  },

  price: {
    heading: "What a conference site costs",
    body:
      `Time bills at ${money(HOURLY)} an hour and projects start at a ${money(BASE)} baseline. Most builds settle between ${LOW} and ${HIGH}. A single-track one-day conference sits near the floor. A multi-track weekend sits well above it: guest pages, an exhibitor application, a sponsor program, and a public archive. The schedule system is the real work, and it does not shrink. If you are running a first-year event with no attendance history, say so, and I will tell you honestly whether the smaller build is the right call this time.`,
  },

  faqLead:
    "The questions conference and convention organizers actually ask. If yours is not here, ask me directly.",

  faqs: [
    {
      q: "Can we edit the schedule ourselves the morning of the show?",
      a: "Yes, and that requirement shapes the whole build. Anything that moves close to the date is built so your team can change it without me. A panel that shifts rooms at 9am has to be correct on the site by 9:05, and no arrangement where that depends on my inbox is acceptable.",
    },
    {
      q: "How do guest and speaker announcements work?",
      a: "You add the person once and the site places them everywhere they belong, including their own page and their sessions in the grid. The reason this matters is rhythm: announcements work as a campaign only if publishing one is quick enough that you actually keep doing it in a busy month.",
    },
    {
      q: "Do you handle ticketing?",
      a: "I build the path to whichever platform you sell through, and I would usually talk you out of replacing it. Ticketing platforms hold money and handle refunds, and they carry tax and fraud obligations you do not want to pay me to rebuild. Where I can help is making sure the tiers and the deadlines are legible before someone clicks through.",
    },
    {
      q: "We have exhibitors and an artist alley. Can applications live on the site?",
      a: "Yes. The applications and the prospectus download get their own track, separate from the attendee navigation, with booth deadlines attached. Whether an application lands in a simple form or in a system you already use depends on your volume and your review process. That is a conversation before it is a build.",
    },
    {
      q: "What happens to last year's site?",
      a: "It becomes an archive rather than a deletion. Photos and numbers from previous years are the evidence that convinces a first-time exhibitor. They stay findable, while the front of the site resets to the year you are selling.",
    },
    {
      q: "Will it hold up on announcement day?",
      a: "A static site is plain files with no database to fall over, which removes the most common way a site dies the hour a big guest is revealed. That is a smaller set of failure modes rather than a promise about a specific number of simultaneous visitors. Anyone quoting you that number without testing your actual setup is guessing.",
    },
  ],

  cta: {
    heading: "What are you running, and when?",
    body:
      "Tell me the dates and roughly how many tracks you are trying to fit into a weekend. I will tell you what the schedule system needs to be before we talk about anything else.",
    buttonLabel: "Tell me about your conference",
    href: "/contact/",
  },

  form: {
    source: "conferences design page",
    subject: "New Conference Website Inquiry (chadworks)",
    submitLabel: "Send it to Chad",
    successMessage:
      "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "section", label: "About you" },
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "organization", label: "Conference or Organization", required: true, span: "half" },
      { kind: "section", label: "About the conference" },
      { kind: "text", name: "event_dates", label: "Dates", required: true, placeholder: "Approximate is fine", span: "half" },
      {
        kind: "select",
        name: "conference_kind",
        label: "What kind of conference?",
        span: "half",
        options: [
          { value: "industry", label: "Industry or professional conference" },
          { value: "fan-con", label: "Fan convention (comics, anime, gaming)" },
          { value: "tech", label: "Tech or developer conference" },
          { value: "academic", label: "Academic or research" },
          { value: "other", label: "Something else" },
        ],
      },
      { kind: "url", name: "current_site", label: "Current Site (if you have one)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "tracks",
        label: "How many tracks?",
        span: "half",
        options: [
          { value: "single", label: "Single track" },
          { value: "2-3", label: "2 to 3 tracks" },
          { value: "4-plus", label: "4 or more tracks" },
          { value: "unsure", label: "Still deciding" },
        ],
      },
      {
        kind: "textarea",
        name: "vision",
        label: "The conference",
        required: true,
        rows: 4,
        placeholder: "Who attends, and what breaks down on the current site every year?",
      },
      {
        kind: "select",
        name: "exhibitors",
        label: "Exhibitors or vendors?",
        span: "half",
        options: [
          { value: "yes-both", label: "Yes, exhibitors and sponsors" },
          { value: "sponsors", label: "Sponsors only" },
          { value: "artist-alley", label: "Artist alley or maker tables" },
          { value: "none", label: "Neither" },
        ],
      },
      {
        kind: "select",
        name: "budget_posture",
        label: "Budget Posture",
        span: "half",
        options: [
          { value: "baseline", label: `Around the ${money(BASE)} baseline` },
          { value: "typical", label: `The typical build (${TYPICAL_BAND})` },
          { value: "beyond", label: "Bigger event, bigger number" },
          { value: "unsure", label: "Tell me what it takes" },
        ],
      },
      { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
    ],
  },

  testimonials: {
    heading: "What clients say",
    items: [
      {
        quote:
          "Chad is very professional, talented and skilled. He does not try to sell you on products or services that you don't need.",
        attribution: "Kimberly Dolan, K.I.M. Keep It Moving (Philadelphia)",
        img: "/people/kimberly-dolan.webp",
      },
      {
        quote:
          "Chad is a wonder worker! My website now shows up first or second in any searches. He is an SEO magician!",
        attribution: "Ananda Forest, author",
        img: "/people/ananda-forest.webp",
      },
    ],
  },

  nextSteps: {
    heading: "What happens after you reach out",
    steps: [
      {
        title: "You tell me the shape of it",
        body: "The dates, the rough attendance, how many tracks, and whether exhibitors are part of it. I usually reply within a day.",
      },
      {
        title: "A straight answer about scope",
        body: "The schedule system is where conference budgets go, so I will tell you early what yours needs to be and where you can spend less.",
      },
      {
        title: "A scoped plan",
        body: "You get a detailed proposal-agreement: the scope, the fees, the deadlines, and what happens when a guest cancels. It is written against your announcement calendar rather than a generic timeline.",
      },
      {
        title: "Direction, early",
        body: "You see a real design direction in days, and the schedule structure gets settled before the visual work goes far enough to be expensive to change.",
      },
    ],
  },

  meta: {
    title: "Conference Website Design by chadworks",
    description:
      "Website design for conferences and conventions. Multi-track schedules that work on a phone, and guest announcements you publish yourself.",
  },
};
