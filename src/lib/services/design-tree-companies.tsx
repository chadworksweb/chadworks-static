// Service: Website Design for Tree Companies (/website-design-for-tree-companies/). MVP
// breadth-first build in the Design lane. Angle: win the storm-response and
// emergency-removal call, a page per town served, real crew and crane-truck
// photos, fast tap-to-call. Lean data only (no bespoke art); deepened later.

import { type Service } from "@/lib/service";
import { TYPICAL_BAND, TYPICAL_BAND_DASH } from "@/lib/pricing";

export const treeCompanies: Service = {
  slug: "website-design-for-tree-companies",
  lane: "design",
  laneLabel: "Design",
  breadcrumbParent: { label: "Industries Served", href: "/industries-served/" },
  eyebrow: "Built for the storm-down call",
  title: "Website Design for Tree Companies",
  intent:
    "chadworks builds tree service websites that win the storm-response and emergency-removal call, with a page for every town you cover, real crew and crane-truck photos, and tap-to-call one thumb-press away.",

  answer:
    `When a limb is through a roof or a trunk is across the driveway, the homeowner is on a phone, scared, and calling the first tree company that looks real and answers fast. I build the site that wins that call. I'm Chad, and I've been getting trade businesses found online since the MySpace days. Your tree service site loads fast on a phone, puts tap-to-call in the header on every page, leads with your insurance and certifications, and gets a real page for each town you serve so you rank where the storm actually hit. Custom builds run ${TYPICAL_BAND} depending on scope, quoted up front before any work starts.`,

  keyFactsHeading: "Tree service web design, at a glance",
  keyFacts: [
    "Emergency removal is a phone search in a hurry. The site has to load fast on mobile, put tap-to-call in a sticky header, and show your insurance and certifications before anything else.",
    "Every town you cover gets its own real page. That is how you rank for emergency tree removal in each township when a storm rolls through, not just your home base.",
    "Real photos of your crew, your bucket truck, and your crane do the selling. A backed-up gallery of stock chainsaws gets filtered out in seconds.",
    "Run by one person who designs, writes, codes, and ships the whole site. Not a template farm, not an offshore queue you never hear from again.",
  ],

  problem: {
    heading: "Why most tree service websites lose the emergency call",
    subheading: "The call goes to whoever looks real and answers fast.",
    body:
      "A tree service site is not a brochure. It is a closer for a homeowner staring at a tree on their house, and most sites lose that job before the phone ever rings.",
    more: {
      trigger: "The four reasons the call goes to a competitor",
      paragraphs: [
        <>
          <strong>It is slow on a phone.</strong>{" "}The storm-damage search
          happens outside, on mobile, fast. A site that crawls to load on a
          phone has already lost to the one that opened in two seconds. Speed
          is the whole game here, not a nicety.
        </>,
        <>
          <strong>The phone number is buried.</strong>{" "}If tap-to-call is not
          in the header on every page and every scroll, the homeowner has to
          hunt for it, and they will not. Your number is the most important
          element on the site, so it belongs one thumb-press away.
        </>,
        <>
          <strong>There is no proof you are insured.</strong>{" "}Tree work is
          high-risk, and a homeowner is about to let a crew with a chainsaw and
          a crane onto their property. Liability insurance, workers' comp, and
          any ISA or arborist certification, shown up top, clear that bar fast.
        </>,
        <>
          <strong>It is invisible for the towns you cover.</strong>{" "}One page
          listing a dozen townships in a footer ranks for none of them. Each
          service area needs its own real page with local detail Google and the
          AI assistants actually reward.
        </>,
      ],
    },
  },

  approach: {
    heading: "How a tree service site gets built",
    steps: [
      {
        title: "Discovery and service area",
        body:
          "I learn your services, your equipment, the towns you cover, and the jobs you actually want more of, emergency removal, takedowns, stump grinding, or storm cleanup.",
      },
      {
        title: "Built mobile-first for the panic call",
        body:
          "Tap-to-call sits in a sticky header on every page, your insurance and certifications go above the fold, and the whole thing loads fast on a phone in the field.",
      },
      {
        title: "A real page for every town you serve",
        body:
          "Each service area gets its own page with local content and proper schema, so you rank for emergency tree removal in each township instead of just your home base.",
      },
      {
        title: "Launch and stay reachable",
        body:
          "We soft-launch, test it across phones and browsers, then go live. When something needs fixing before your busy season, I'm the one who picks up.",
      },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "The trade-business track record",
        detail:
          "I have been getting service businesses found online since the MySpace days. Tree work is local, urgent, and trust-driven, exactly the kind of work this approach was built for.",
      },
      {
        label: "Most-cited site in its market",
        detail:
          "After a rebuild aimed at being readable to AI, a trade-service client became the single most-cited site for its region, ahead of the directories. The same discipline carries straight into tree service.",
      },
    ],
  },

  price: {
    heading: "What I quote up front is what you pay.",
    figure: TYPICAL_BAND_DASH,
    figureSub: "Custom build, scope-dependent",
    body:
      "Pricing is based on scope, not hours. A focused conversion site lands near the low end of the range. Add a real photo gallery of your crew and equipment, intake forms, or a page for each town you cover and the number moves up. You see the full quote before we start, and that is the number on the final invoice. When you need something later, you email me and I bill the work.",
  },

  qualification: {
    heading: "Is this the right fit?",
    fitLabel: "A good fit if",
    fit: [
      "You run a real tree operation and you are losing emergency calls to a slow or thin website.",
      "You cover multiple towns and want to rank for each one when a storm hits, not just your home base.",
      "You carry real insurance and certifications and want them working for you up top, where they close the call.",
      "You would rather hire one builder who owns the whole thing than wrestle a template.",
    ],
    notLabel: "Probably not if",
    notFit: [
      "You want the cheapest possible site and the number is the only thing that matters. I am not the cheapest, deliberately.",
      "You want a free automated scan and a logo by tomorrow. That is a different shop.",
    ],
  },

  faqs: [
    {
      q: "Will my site win the emergency storm-damage call?",
      a: "That is the whole point of the build. The site loads fast on a phone, puts tap-to-call in a sticky header on every page, and shows your insurance and certifications above the fold, so the scared homeowner with a tree on the roof taps your number first.",
    },
    {
      q: "Do I get a page for every town I serve?",
      a: "Yes, service-area pages are part of every build. Each one is real, real towns, real local content, real schema, not thin duplicates Google quietly de-indexes. The base build typically covers several towns, and we scale up from there based on your service area.",
    },
    {
      q: "Can you use my real crew and equipment photos?",
      a: "Yes, and you should. Real photos of your bucket truck, your crane, and your crew doing actual takedowns sell far better than stock. If you do not have good shots yet, I will tell you exactly what to capture so the gallery does its job.",
    },
    {
      q: "How long does a build take?",
      a: "Two to three weeks from kickoff to launch for a focused conversion site. Bigger scopes with multiple service-area pages, a full gallery, or content migration run four to six weeks. I quote a delivery date up front and stick to it.",
    },
    {
      q: "Why do you show pricing when most agencies don't?",
      a: `Because you should know roughly what you are going to spend before we talk. The range here is honest: ${TYPICAL_BAND} based on scope, quoted flat up front. Most agencies hide pricing so they can size the quote to what they think you will pay.`,
    },
  ],

  cta: {
    heading: "If your tree service website looks like it was built in 2012, let's fix that.",
    body:
      "No pitch, no pressure, no slide deck. Tell me what is broken and what jobs you actually want more of. I will tell you what I would build and what it would cost.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  meta: {
    title: "Website Design for Tree Companies | chadworks",
    description:
      `Tree service websites built to win the storm-response and emergency-removal call: fast on a phone, tap-to-call in the header, insurance and certifications up top, and a real page for every town you cover. Custom builds run ${TYPICAL_BAND}, quoted up front.`,
  },
};
