// Service: Website Design for 5K Races (design vertical). Narrowed from the
// broader events page on 2026-08-11 (Chad): one race distance, one buyer, real
// flat-rate packages. Siblings are design-conferences.tsx and
// design-retreats.tsx, which stay broad.
//
// PROOF NOTE: chadworks has no 5K-vertical client work yet, so nothing on this
// page claims any. Every claim is instead paid for with a MARKET number from
// RunSignup's 2025 RaceTrends Report (published February 2026, drawn from a
// platform that carries at least half the US endurance market) or with a
// disclosed limit. CWS-VOICE section 6. The figures used here:
//   74%   of race website views come from mobile or tablet
//   63%   of transactions happen on mobile
//   23.7% of registrations land in race week
//   3%    register on race day itself
//   87%   of races have fewer than 500 participants
//   3x    donations at races running real fundraising vs a plain donate button
// If any of these are refreshed by a later RaceTrends report, update them here
// and in RacePackagesCapsule together; they are quoted in both.
//
// The AAC Event Catering testimonial stays OFF this page: catering at events is
// not building race websites.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { money } from "@/lib/package-builder";
import {
  RACE_STARTING_LINE,
  RACE_FULL_COURSE,
  RACE_ADDON_SELF_EDIT,
  RACE_ROLLOVER,
  STATIC_HOSTING_NONPROFIT,
} from "@/lib/pricing";

export const design5kRaces: Service = {
  slug: "website-design-for-5k-races",
  lane: "design",
  laneLabel: "Web Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "For a site that's right, long before race week",
  title: "Website Design for 5K Races",
  intent:
    "chadworks builds flat-rate websites for 5K races, priced in public and finished before registration opens.",

  // SHORT by design. This page runs the audit-page hero shape (Chad,
  // 2026-08-11), where the lede hands off to a bullet list rather than
  // carrying every specific itself. The specifics moved into the hero bullets
  // in the route file; do not fold them back in here or the page says each
  // thing twice.
  answer: (
    <>
      A 5K website has one job above all the others: move somebody from the
      flyer they just saw to the registration button. From runners to sponsors
      to volunteers, chadworks builds the site that attracts them all.
    </>
  ),

  // No `heroArt` field. The route overrides the hero slot entirely, so
  // HeroCapsule never runs and would never read it. The chip stream is mounted
  // in the route instead, inside the hero's right column.

  keyFactsHeading: "5K websites, at a glance",
  keyFacts: [
    "Your site is a phone. RunSignup's 2025 RaceTrends Report puts 74% of race website views on mobile or tablet, and 63% of transactions there, so the phone layout is the design rather than an afterthought.",
    "Almost a quarter of your registrations land in race week. That report puts race-week signups at 23.7%, with another 3% on race day, which is exactly when a site nobody can edit becomes expensive.",
    "This page is built for the small race. 87% of races run under 500 participants, and the packages below are sized for that rather than for a marathon's budget.",
    (
      <>
        You own the site and every working file on final payment, which matters
        when the committee changes hands after the race.{" "}
        <Link href="/about/" className="svc-inline-link">
          The person who designs it is the person you email next year.
        </Link>
      </>
    ),
  ],

  problem: {
    heading: "The date is fixed, so everything else has to be early.",
    subheading:
      "Most race sites get finished the same week registration opens.",
    body:
      "That is backward. The site is under the most pressure in the week it has been tested the least, and nearly a quarter of your signups arrive in that window.",
    more: {
      trigger: "What runners look for and most race sites leave out",
      hideBodyIntro: true,
      paragraphs: [
        <>
          <strong>The policies nobody publishes.</strong> Transfer, deferral, refund and
          cancellation terms are among the most-searched things on a race site
          and the most commonly missing. A runner who cannot find your refund policy
          reads that as an answer.
        </>,
        <>
          <strong>The five-second questions.</strong> The date, the start time,
          the place, the price, and where to sign up. If a visitor cannot answer
          every one of those without scrolling twice, nothing else on the site
          gets a chance.
        </>,
        <>
          <strong>Race day is a different website.</strong> On the morning of,
          nobody is reading your history. They want parking, packet pickup, the
          course map, the start time, and one clear line about what happens if
          it storms.
        </>,
        <>
          <strong>Last year&apos;s FAQ is this year&apos;s problem.</strong>{" "}
          Parking changes, the course changes, the packet pickup window moves, and the price goes up on a date you set months ago.
          An FAQ carried over untouched from last year quietly tells people your
          information cannot be trusted.
        </>,
      ],
    },
  },

  approach: {
    heading: "How a 5K site gets built",
    steps: [
      {
        title: "Start from the date, not the design",
        body:
          "We put your race date on the wall and count backward: registration opening, the schedule lock, sponsor logos, and the day your volunteers need details. Every deadline after that is derived from yours, not from mine.",
      },
      {
        title: "Design the phone first",
        body:
          "Three quarters of your visitors arrive on a phone, so that layout gets designed first and the desktop version follows from it. Most race sites are built the other way around, which is why they read as an afterthought on the device almost everyone uses.",
      },
      {
        title: "Publish the answers runners hunt for",
        body:
          "What registration includes, when the price goes up, the transfer and refund policy, parking, and packet pickup. These are the most-searched and least-published items on race sites, and putting them in writing cuts the email you answer one at a time.",
      },
      {
        title: "Wire the registration handoff",
        body:
          "You keep RunSignup or whoever else holds your money and your waivers. I build the path into it, then walk that path on a real phone. A handoff that dead-ends on mobile is the most expensive bug a race site can have.",
      },
      {
        title: "Build race day before race day",
        body:
          "Parking, packet pickup, the course map, and the weather line all ship early and sit ready. Writing that page while your phone is ringing at 5am is how the wrong information ends up published.",
      },
      {
        title: "Hand it over before registration opens",
        body:
          "The site is yours, finished, with the working files. A static site has no database to fall over, so a registration-day rush is a bandwidth question instead of a server question. That is a smaller set of things that can break, not a promise about any particular number of visitors.",
      },
    ],
  },

  // NOT RENDERED (Chad, 2026-08-11). The route drops PriceCapsule entirely,
  // because RacePackagesCapsule already carries every number and the prose
  // band restated it more weakly right above the table. `price` is a REQUIRED
  // field on the Service type, so the copy stays here rather than being
  // deleted, and it is the fallback if the packages table is ever pulled.
  price: {
    heading: "Flat rate, published",
    figure: money(RACE_STARTING_LINE),
    figureSub: "Starting Line, flat",
    body:
      `The full package table sits below, and both numbers are flat rather than a range you discover later. Starting Line is ${money(RACE_STARTING_LINE)} for a one-page race site. Full Course is ${money(RACE_FULL_COURSE)} for the multi-page version with the course, the sponsors, the race-day page and the results archive. Add-ons are priced against my hourly rate at realistic build hours, so the division works out if you do it. The one I argue hardest for is the self-edit layer at ${money(RACE_ADDON_SELF_EDIT)}, because race week is when you need to change things and cannot wait on me.`,
    disclaimer: (
      <>
        These are real flat rates for the scope described, not estimates.
        Anything outside that scope gets quoted before it gets built. Rolling
        the site to next year is {money(RACE_ROLLOVER)}, or nothing at all if
        you took the self-edit layer, and hosting for a registered non-profit
        runs {money(STATIC_HOSTING_NONPROFIT)} a month.
      </>
    ),
  },

  faqLead:
    "The questions race directors actually ask, answered the way I would answer them on a call. If yours is not here, ask me directly.",

  faqs: [
    {
      q: "Can it be ready before registration opens?",
      a: "That depends on how far out you are, and I will tell you straight rather than promise and scramble. Starting Line is a short build. Full Course is not. Come to me with months and the answer is usually yes. Come to me with weeks and the honest answer is the smaller package, or next year.",
    },
    {
      q: "Do we have to leave RunSignup or Eventbrite?",
      a: "No, and I would usually talk you out of it. Those platforms hold your money and your waivers, and they have solved refund and chargeback problems you do not want to pay me to solve again. RunSignup is free to the race and charges the registrant a processing fee per cart. Eventbrite charges per registration, which costs your groups more. Either way the site's job is the handoff, not the checkout.",
    },
    {
      q: "The schedule changes the week of the race. Then what?",
      a: `Then you change it yourself, if you took the self-edit layer at ${money(RACE_ADDON_SELF_EDIT)}. Race week is when 23.7% of your registrations arrive and when details move most, and it is the worst possible time to be waiting on a developer's inbox. Without that add-on, changes come to me and get billed at my hourly rate.`,
    },
    {
      q: "We run this every year. What happens between races?",
      a: `The site rolls over instead of being rebuilt. Last year becomes an archive people can still find, and the front resets to the next date. I charge ${money(RACE_ROLLOVER)} to do that, and nothing if you took the self-edit layer and want to do it yourself. This is the single biggest cost difference between a race site built once and one rebuilt annually by whoever is on the committee that year.`,
    },
    {
      q: "We are a charity race. Does the site handle donations?",
      a: "Through your registration platform rather than something I build separately, and the distinction matters more than it sounds. RunSignup reports that races running real fundraising, where participants create their own pages and chase their own networks, collect roughly three times what races with a plain donate button collect. Setting that up properly is an add-on, and for a charity race it is usually the one that pays for the whole site.",
    },
    {
      q: "Will it hold up when registration opens?",
      a: "A static site is plain files, so there is no database to fall over under a rush and no back end to time out. That removes the most common way race sites go down at the worst moment. It is not a guarantee about a specific number of simultaneous visitors, and anyone who gives you that number without testing your actual setup is guessing.",
    },
    {
      q: "Who owns it when the committee turns over?",
      a: "You do, in full, on final payment, including the working files and the code. Volunteer organizations change hands constantly, and the version of this that goes wrong is the one where the site lives in a former board member's personal account. Nothing here is registered in my name.",
    },
  ],

  cta: {
    heading: "Tell me your race date",
    body:
      "That is the first thing I need and it decides most of the rest. Tell me what the race is and when it happens, and I will tell you which package fits and what is realistic in the time left before registration opens.",
    buttonLabel: "Tell me about your race",
    href: "/contact/",
  },

  form: {
    source: "5k races design page",
    subject: "New 5K Race Website Inquiry (chadworks)",
    submitLabel: "Send it to Chad",
    successMessage:
      "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "section", label: "About you" },
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "organization", label: "Race or Organization Name", required: true, span: "half" },
      { kind: "section", label: "About the race" },
      { kind: "text", name: "race_date", label: "Race Date", required: true, placeholder: "Even an approximate one helps", span: "half" },
      {
        kind: "select",
        name: "package",
        label: "Which package fits?",
        span: "half",
        options: [
          { value: "starting-line", label: `Starting Line (${money(RACE_STARTING_LINE)})` },
          { value: "full-course", label: `Full Course (${money(RACE_FULL_COURSE)})` },
          { value: "unsure", label: "Not sure, tell me" },
          { value: "other", label: "Something else entirely" },
        ],
      },
      { kind: "url", name: "current_site", label: "Current Site (if you have one)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "registration_platform",
        label: "Registration platform",
        span: "half",
        options: [
          { value: "runsignup", label: "RunSignup" },
          { value: "eventbrite", label: "Eventbrite" },
          { value: "race-roster", label: "Race Roster" },
          { value: "other", label: "Something else" },
          { value: "none", label: "Nothing yet" },
        ],
      },
      {
        kind: "textarea",
        name: "vision",
        label: "The race",
        required: true,
        rows: 4,
        placeholder: "Roughly how many runners, whether it benefits a cause, and what has gone wrong with the site in past years.",
      },
      {
        kind: "select",
        name: "charity",
        label: "Does it raise money for a cause?",
        span: "half",
        options: [
          { value: "nonprofit", label: "Yes, for a registered non-profit" },
          { value: "informal", label: "Yes, informally" },
          { value: "no", label: "No" },
        ],
      },
      {
        kind: "select",
        name: "recurring",
        label: "Does it run every year?",
        span: "half",
        options: [
          { value: "annual", label: "Yes, annually" },
          { value: "first", label: "First time running it" },
          { value: "occasional", label: "Occasionally" },
          { value: "series", label: "Several times a year" },
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
        title: "You send me the date",
        body: "Tell me what the race is and when it happens. I usually reply within a day.",
      },
      {
        title: "A straight answer about the calendar",
        body: "I'll tell you which package fits and what can realistically be built in the time left, including when the honest answer is the smaller one.",
      },
      {
        title: "A flat quote, in writing",
        body: "The package, the add-ons you picked, and the total. Flat means flat: anything outside that scope gets quoted before it gets built.",
      },
      {
        title: "Direction, early",
        body: "You see a real design direction in days rather than a surprise after weeks of silence, and we steer it together while there is still room to steer.",
      },
    ],
  },

  meta: {
    title: "5K Race Website Design by chadworks",
    // The figure is interpolated, never typed: price-audit.mjs treats a
    // hand-typed chadworks price as a bug, and a meta description is exactly
    // where a stale number would go unnoticed longest.
    description:
      `Flat-rate websites for 5K races, from ${money(RACE_STARTING_LINE)}. Phone-first, finished before registration opens, with the registration handoff and race-day details built in.`,
  },
};
