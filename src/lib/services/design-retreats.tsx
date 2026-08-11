// Service: Website Design for Retreats (design vertical) -- spiritual-leaning
// retreats, where the guest travels and pays a deposit months ahead. Sibling
// of design-events.tsx and design-conferences.tsx.
//
// COPY NOTE: chadworks has NO retreat-vertical proof yet (Chad, 2026-08-11).
// Every claim is paid for with a mechanism or a disclosed limit rather than
// with claimed experience (CWS-VOICE section 6).
//
// REGISTER NOTE: this is the one of the three that could slide into the
// generic language its own copy criticizes. It stays plain on purpose. The
// page argues that the practical answers carry the trust, so the writing has
// to demonstrate that rather than assert it.

import Link from "next/link";
import type { Service } from "@/lib/service";
import { RetreatsHeroArt } from "@/components/art/ExperienceHeroArt";
import { HIGH, HOURLY, LOW, TYPICAL_BAND } from "@/lib/pricing";
import { BASE, money } from "@/lib/package-builder";

export const designRetreats: Service = {
  slug: "website-design-for-retreats",
  lane: "design",
  laneLabel: "Web Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "For retreats people travel to and pay for months ahead",
  title: "Website Design for Retreats",
  intent:
    "chadworks designs retreat websites for facilitators whose guests book months ahead and travel to get there.",

  answer: (
    <>
      Nobody books a retreat off a headline. They read everything you have
      published, then go looking for the part that says who is leading it and
      what actually happens each day. I&apos;m Chad Lewine, and I have been
      building websites for 20 years. A retreat site earns the deposit by
      answering the practical questions as carefully as it holds the feeling.
    </>
  ),

  heroArt: <RetreatsHeroArt />,

  keyFactsHeading: "Retreat websites, at a glance",
  keyFacts: [
    "Your guest is spending real money and a week of their life to be somewhere unfamiliar with people they have not met. They will read the entire site before they send a deposit.",
    "The practical page is where the decision gets made. Lodging, meals, what to bring, and what the property is like for someone with a bad knee get read more closely than the invitation does.",
    "A small cohort makes scarcity true, so nothing has to be manufactured. Twelve spots is a fact, and a fact does not need a countdown timer next to it.",
    (
      <>
        You own the site and the working files on final payment, and the domain
        stays in your name. Nothing about your practice should live inside
        someone else&apos;s account.{" "}
        <Link href="/about/" className="svc-inline-link">
          Read about the person building it.
        </Link>
      </>
    ),
  ],

  problem: {
    heading: "Trust is the whole conversion, and generic is where it leaks.",
    subheading:
      "A guest who cannot picture the room does not send the deposit.",
    body:
      "Retreat sites tend to be written beautifully and answer almost nothing. The feeling is there. The daily schedule is not, and the person deciding whether to spend a week with you is left guessing. (Every retreat site opens with a sunset. Yours does not have to.)",
    more: {
      trigger: "What a retreat site has to settle before the deposit",
      hideBodyIntro: true,
      paragraphs: [
        <>
          <strong>Who is leading it.</strong> A first name and a soft-focus
          photograph will not carry a week of somebody&apos;s life. Where you
          trained and how long you have been doing this belong on the page, in
          plain language, above the invitation rather than below it.
        </>,
        <>
          <strong>What happens each day.</strong> The hour by hour is not a
          spoiler, it is the product. People need to know when they wake up,
          how much silence there is, and whether anything is going to be asked
          of them that they did not sign up for.
        </>,
        <>
          <strong>What it costs and what is inside that number.</strong>{" "}
          Lodging tiers, meals, transfers from the airport, and the things that
          are not covered. Every question left unanswered here becomes an email
          you answer one at a time, or a booking you never hear about.
        </>,
        <>
          <strong>What happens if plans change.</strong> The deposit terms and
          the cancellation window. What you do if the retreat does not fill
          belongs here too, and publishing it plainly reads as confidence
          rather than as fine print.
        </>,
      ],
    },
  },

  approach: {
    heading: "How a retreat site gets built",
    steps: [
      {
        title: "Start with the real place",
        body:
          "The site gets built around photographs of your actual property and the room somebody will sleep in. I do not shoot the photography, and this is the one thing I will push you hardest on. Stock imagery is the fastest way to lose a guest who is trying to picture themselves there.",
      },
      {
        title: "Write the day before the invitation",
        body:
          "We map the daily rhythm first and design the poetic part around it. Pages built the other way around read well and convert badly, because the reader is hunting for specifics the whole time.",
      },
      {
        title: "Give the practical page equal weight",
        body:
          "Lodging, meals, accessibility and travel get real design attention rather than a link in the footer. This is the page your guest reads twice and forwards to whoever they are traveling with.",
      },
      {
        title: "Make the money legible",
        body:
          "Tiers, what each one includes, the deposit, and the date refunds stop. Written once, clearly, so it stops generating email and starts settling decisions.",
      },
      {
        title: "Build the step that fits how you accept people",
        body:
          "Some retreats sell a seat outright and some interview first. Those are different builds, and choosing the wrong one either scares people off or fills your cohort with people you would not have chosen.",
      },
      {
        title: "Hand it over, in your name",
        body:
          "The site and every working file behind it are yours on final payment. If you run one retreat a year or six, the same site carries them without a rebuild each season.",
      },
    ],
  },

  price: {
    heading: "What a retreat site costs",
    body:
      `Time bills at ${money(HOURLY)} an hour and projects start at a ${money(BASE)} baseline. Most builds settle between ${LOW} and ${HIGH}. A single annual retreat with one page of substance sits near the floor. A season of offerings with tiers, an application step, a lodging system and a run of dates sits above it. One honest note about this market. If your photography does not exist yet, budget for it before you budget for me. The best site in the world cannot carry images that do not show the place.`,
  },

  faqLead:
    "The questions retreat facilitators actually ask. If yours is not here, ask me directly.",

  faqs: [
    {
      q: "Can the site take deposits and payment plans?",
      a: "Yes, through a payment platform rather than something I build from scratch. Deposits and balances bring refund and dispute handling with them, plus tax obligations that established platforms have already solved, and rebuilding that would cost you more than it saves. My job is making the path to it clear and making the terms readable before someone commits.",
    },
    {
      q: "We interview people before accepting them. Can the site do that?",
      a: "Yes, and it changes the shape of the whole page. An application flow asks for a different kind of trust than a buy button does. The writing has to explain why you interview, which is usually reassuring rather than off-putting. What the site cannot do is make the decision for you, and I would be suspicious of anyone who offered to automate that part.",
    },
    {
      q: "What if the retreat does not fill?",
      a: "Then your cancellation terms are the most important paragraph on the site, and they should have been written before you needed them. I will push you to publish the minimum number, the date you decide, and what happens to deposits. Guests read that as confidence. Retreats that hide it generate the worst emails you will ever have to send.",
    },
    {
      q: "Can one site carry several retreats a year?",
      a: "Yes, and that is usually the right build if you run more than one. Each offering gets its own page with its own dates and pricing, sharing the parts that do not change, like who you are and how you work. Past retreats become an archive, which is worth more than you would think to somebody deciding whether you are established.",
    },
    {
      q: "Do you write the copy?",
      a: "I write structure and I will draft plainly, but the voice on a retreat site has to be yours. This is the one kind of site where borrowed language is obvious. The reader is trying to work out what it is like to be in a room with you. Expect to be interviewed rather than handed a questionnaire.",
    },
    {
      q: "Our photography is not great. Does that matter?",
      a: "More than anything else on the page, and I would rather tell you now than after you have paid me. A retreat is bought on the ability to picture yourself there. If the only images are stock, or phone photos of an empty room, the site will underperform no matter how it is designed. Hiring a photographer for a day is the higher-return purchase.",
    },
  ],

  cta: {
    heading: "Tell me about the retreat",
    body:
      "Where it is, when it runs, how many people you take, and how far ahead they book. Tell me what you want somebody to feel when they land on the page, and I will tell you what the page has to answer before they will feel it.",
    buttonLabel: "Tell me about your retreat",
    href: "/contact/",
  },

  form: {
    source: "retreats design page",
    subject: "New Retreat Website Inquiry (chadworks)",
    submitLabel: "Send it to Chad",
    successMessage:
      "Got it. I read every one of these myself, and you'll hear back from me within a day.",
    fields: [
      { kind: "section", label: "About you" },
      { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
      { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "practice", label: "Your practice or retreat name", required: true, span: "half" },
      { kind: "section", label: "About the retreat" },
      { kind: "text", name: "retreat_dates", label: "Dates or season", required: true, placeholder: "Approximate is fine", span: "half" },
      {
        kind: "select",
        name: "retreat_kind",
        label: "What kind of retreat?",
        span: "half",
        options: [
          { value: "meditation", label: "Meditation or silent" },
          { value: "yoga", label: "Yoga or movement" },
          { value: "plant-medicine", label: "Plant medicine or ceremony" },
          { value: "creative", label: "Creative or writing" },
          { value: "other", label: "Something else" },
        ],
      },
      { kind: "url", name: "current_site", label: "Current Site (if you have one)", placeholder: "https://", span: "half" },
      {
        kind: "select",
        name: "cohort_size",
        label: "How many guests?",
        span: "half",
        options: [
          { value: "under-12", label: "Under 12" },
          { value: "12-25", label: "12 to 25" },
          { value: "26-plus", label: "26 or more" },
          { value: "varies", label: "It varies" },
        ],
      },
      {
        kind: "textarea",
        name: "vision",
        label: "The retreat",
        required: true,
        rows: 4,
        placeholder: "Who comes, what happens while they are there, and what you want them leaving with.",
      },
      {
        kind: "select",
        name: "photography",
        label: "Do you have photography of the place?",
        span: "half",
        options: [
          { value: "professional", label: "Yes, professional images" },
          { value: "some", label: "Some, mixed quality" },
          { value: "phone", label: "Phone photos only" },
          { value: "none", label: "None yet" },
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
          { value: "beyond", label: "A season of offerings, bigger number" },
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
        title: "You tell me about the retreat",
        body: "Where it is and how many people you take. I usually reply within a day.",
      },
      {
        title: "A straight answer",
        body: "Including the awkward one about photography, which I would rather raise before you spend money than after.",
      },
      {
        title: "A scoped plan",
        body: "You get a detailed proposal-agreement: the scope, the fees, what each of us owes the other, and what happens if a date slips. Every deadline is written against your booking window.",
      },
      {
        title: "An interview, then direction",
        body: "The voice on this kind of site has to be yours, so I ask questions until I can hear it, and then you see a real design direction within days.",
      },
    ],
  },

  meta: {
    title: "Retreat Website Design by chadworks",
    description:
      "Website design for retreats. The daily rhythm, the lodging, the real cost and the cancellation terms, answered plainly enough to earn a deposit.",
  },
};
