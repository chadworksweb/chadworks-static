// Situation page: "Build Your Vision" (/build-your-vision/). A high-intent
// acquisition surface for people with a big, original idea who need a builder
// who can actually execute it -- something on the scale of Rising Compass or
// chadlewine.com, not a brochure site. Per CWS-INFORMATION-ARCHITECTURE.md,
// Situation pages share the Service template so rigor and GEO dimensions stay
// identical; lane funnels into Websites (web-development / custom-coded-static).
//
// SPIKE PASS. Structure and key facts are written in clean voice (no em-dashes,
// no triplets, no exact-three lists, reader-experience framing). Voice-critical
// persuasion is left as prompt() amber blocks carrying the angle, so Chad writes
// the final lines himself.
//
// CAMPAIGN NOTES (not page copy, kept here so they aren't lost):
//   This page targets a different buyer than the switch/migration pages. Not a
//   small business with a tired site -- a founder/artist/operator with a vision
//   for a real product or platform that does not exist yet. The hook is that
//   Chad does not just talk about it: Rising Compass and chadlewine.com are his
//   own ambitious builds, shipped and live. Proof that the vision gets built.
//   This is the opposite end of the qualification spectrum from "leave WordPress":
//   here we WANT the ambitious, not-for-strict-budgets buyer (see rates posture).

import { type Service, prompt } from "@/lib/service";

export const buildYourVision: Service = {
  slug: "build-your-vision",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "For people building something that doesn't exist yet",
  title: "Build Your Vision",
  intent:
    "chadworks builds ambitious, original software products and platforms for founders, artists, and operators who have a big vision and need a builder who can actually ship it, on the scale of Rising Compass or chadlewine.com.",

  // Answer-first lede. PROMPT: Chad's hooks verbatim so the voice stays his.
  answer: prompt(
    "Answer-first lede (Chad's voice)",
    "Open by naming the buyer back to themselves: you have an idea that is bigger than a website, something that does not exist yet, and most developers either glaze over or quietly scale it down to something they already know how to build. The argument: I am a builder with my own big visions, and I ship them. Rising Compass and chadlewine.com are not case studies I borrowed, they are products I built and run. So when you bring me a vision, I am not figuring out whether it is possible, I am figuring out how to make it real. Quotable in the first 100 words. First-person, warm, a little fearless. Name the entity (an ambitious custom build) and answer the question (who builds it, can it be done) up front for GEO.",
  ),

  keyFactsHeading: "Building something ambitious, at a glance",
  keyFacts: [
    "This is for visions that are bigger than a normal website. A real product, a platform, a tool that works the way nothing else does. If you can already buy it off a shelf, you do not need this page.",
    "The proof is that I build my own. Rising Compass and chadlewine.com are products I designed, built, and run, not stock projects I bought from someone else. The same person who built those builds yours.",
    "I build custom, not from a template. That means your vision drives the architecture, instead of your vision getting bent to fit a page builder or a theme that was never meant for it.",
    "AI changed what one focused builder can ship. Things that used to need a funded team and a year are now buildable, and that is exactly why an original idea is worth starting now instead of waiting.",
  ],

  problem: {
    heading: "Most developers quietly shrink your idea",
    subheading: "A big vision needs someone who is not scared of it.",
    body:
      "When you describe something that has never been built before, a lot of developers hear it as a problem to make smaller. They steer you toward the version they already know how to make, and the thing that made your idea worth doing in the first place gets sanded off along the way.",
    more: {
      trigger: "Why visions get watered down",
      paragraphs: [
        prompt(
          "The 'shrinking' problem in Chad's voice",
          "Expand on why this happens: most shops are set up to repeat what they have done before, so anything genuinely new reads as risk, scope creep, or 'we'd have to custom build that.' The original, weird, best parts of an idea are exactly the parts that get cut, because they are the parts nobody has a template for. Frame it from the buyer's experience of being slowly talked down.",
        ),
        prompt(
          "Why I'm different: I have my own big visions",
          "The turn: I am not afraid of the new part, because I chase the new part for myself. Rising Compass is an original system I built from nothing. chadlewine.com is a custom platform I built for my own work. I know what it takes to build something that did not exist, because I keep doing it. So your vision does not scare me, it interests me.",
        ),
        prompt(
          "What you actually get to keep",
          "Reassurance + ownership angle: you end up with the real thing, built custom, that you own outright. No platform lock-in, no watered-down compromise you have to explain away. The vision, shipped and live, the way it was supposed to be.",
        ),
      ],
    },
  },

  approach: {
    heading: "How an ambitious build actually happens",
    steps: [
      {
        title: "We get the real vision on the table",
        body:
          "Before anything gets built, I want the whole idea, including the parts you are worried are too much. I am listening for what makes it different, because that is usually the part worth protecting, not the part to cut.",
      },
      {
        title: "I find the shortest real path to a working version",
        body:
          "I map the vision to something buildable and figure out what the first living version looks like. Not a watered-down version, the real thing in its smallest honest form, so you see it work early instead of waiting a year to find out.",
      },
      {
        title: "I custom build it",
        body:
          "It gets built as custom software, architected around your idea rather than bent to fit a template. Rising Compass and chadlewine.com were built this way, which is why they do things no off-the-shelf product does.",
      },
      {
        title: "It ships, and it keeps growing",
        body:
          "A big vision is rarely done in one pass. I get a real version live, then we build outward from there as it proves itself, so the thing grows the way you imagined instead of stalling at a demo.",
      },
    ],
  },

  paths: {
    heading: "Where this leads",
    intro:
      "An ambitious vision lands on a custom build. If you want the full picture of how I build, start here.",
    items: [
      {
        label: "Web Development",
        detail:
          "The bigger picture of how I build, and the routes a serious custom product can take.",
        href: "/web-development/",
      },
      {
        label: "Custom Coded / Static",
        detail:
          "The custom-built foundation underneath. Fast, yours to keep, with nothing standing between your idea and how it works.",
        href: "/custom-coded-static/",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Rising Compass",
        detail:
          "An original system I built and run from nothing, the kind of product most shops would have told you was too custom to attempt.",
        href: "https://risingcompass.net",
      },
      {
        label: "chadlewine.com",
        detail:
          "A custom platform I designed and built for my own work as a musician and artist, doing things a template site cannot.",
        href: "https://chadlewine.com",
      },
      {
        label: "rslgo.com",
        detail: prompt(
          "rslgo.com proof detail (Chad's voice)",
          "Describe rslgo.com in one or two sentences in Chad's voice: what it is and what makes it an ambitious / original build worth showing on this page. (Placeholder until Chad confirms what to say about it.)",
        ),
        href: "https://rslgo.com",
      },
      {
        label: "The showroom",
        detail:
          "More live, custom builds you can click through. Same custom-built foundation underneath, whatever sits on top.",
        href: "/showroom/",
      },
    ],
  },

  price: {
    heading: "What an ambitious build costs",
    // PROMPT: pricing posture in Chad's voice; numbers live on the rates page.
    body: prompt(
      "Ambitious-build pricing posture",
      "State it plainly and unapologetically in Chad's voice: building something original is real work and it is priced like real work, see the rates page for the actual numbers ($315/hr, $3,200 baseline, $5,000-$10,000 typical per the IA). Reframe 'we are not for strict budgets' as a feature, the same posture as the rates page: the people who get the most from this are the ones who care more about the thing being right than about it being cheap. Be honest that if the budget is tight, this probably is not the page for them, and point them to the lighter Websites options.",
    ),
  },

  qualification: {
    heading: "Is this the right fit for your vision?",
    fitLabel: "This is for you if",
    fit: [
      "You have an idea for a real product or platform, not just a site that lists what you do.",
      "Part of your vision does not exist anywhere yet, and that is the part you care most about.",
      "You would rather it be right than cheap, and you are ready to invest in it being right.",
      "You want a builder who is genuinely excited by the new part, not nervous about it.",
    ],
    notLabel: "This is not the page for you if",
    notFit: [
      "You need a straightforward brochure or small-business site. The Websites lane is a better, lighter fit.",
      "The budget is tight and fixed. Ambitious custom builds are not a strict-budget service, and that is on purpose.",
    ],
  },

  faqs: [
    {
      q: "What does 'build your vision' actually mean here?",
      a: "It means building something that does not exist off the shelf yet. A real product, a platform, or a tool that works the way your idea needs it to, custom built around that idea instead of forced into a template. Rising Compass and chadlewine.com are two examples of what that looks like.",
    },
    {
      q: "Why should I trust you with something this ambitious?",
      a: "Because I build ambitious things for myself and ship them. Rising Compass and chadlewine.com are not borrowed case studies, they are products I designed, built, and run. The same person who built those is the one building yours.",
    },
    {
      q: "Is my idea too big or too weird to build?",
      a: prompt(
        "Reassurance on scope / originality (Chad's voice)",
        "Answer in Chad's voice: the new, weird, original part is usually the reason the idea is worth doing, and it is the part I want to protect, not cut. Be honest that some things take staging and a first version before the full vision, but 'too weird' is rarely the real blocker. Invite them to bring the whole idea.",
      ),
    },
    {
      q: "How has AI changed what's possible to build?",
      a: prompt(
        "AI-makes-it-buildable angle (Chad's voice)",
        "Chad's recurring thesis: things that used to need a funded team and a long timeline are now buildable by one focused builder, which is exactly why an original idea is worth starting now. Keep it grounded, no hype, reader-experience framing.",
      ),
    },
    {
      q: "What will it cost?",
      a: prompt(
        "Cost FAQ (defer to rates posture)",
        "Short, honest answer that points to the rates page for real numbers and restates the not-for-strict-budgets posture as a feature. Ambitious builds are priced like real work. If budget is the deciding factor, point them to the lighter Websites options.",
      ),
    },
  ],

  cta: {
    heading: "Bring me the whole vision",
    body: prompt(
      "CTA body (low-friction, fearless)",
      "Close in Chad's voice: invite them to send the idea, including the parts they think are too much, for a real conversation about how it gets built. No watering it down. Reassure them I am more interested in the ambitious part than scared of it, and that if it is genuinely not a fit I will tell them straight.",
    ),
    buttonLabel: "Tell me what you want to build",
    href: "/contact/",
  },

  meta: {
    title: "Build Your Vision: Custom Software for Big, Original Ideas | chadworks",
    description:
      "Have a vision for a real product or platform, something like Rising Compass or chadlewine.com? I build ambitious, original software custom, and I ship my own. Bring the whole idea, including the parts other builders would shrink.",
  },
};
