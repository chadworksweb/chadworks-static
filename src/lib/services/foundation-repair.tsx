// Service: Website Design for Foundation Repair Contractors
// (/website-design-for-foundation-repair/) -- the foundation-repair niche page brought INTO
// the capsule system, styled to the global tokens (CWS directive 2026-06-15:
// works of art become capsules, CSS matches the global site). The distinctive
// art carries over as capsule sections: the interactive Scorecard (problem
// signature), the bold ProcessCapsule timeline (approach), and the
// WireframeCamera teardown (the scroll zoom-and-pan over a sample foundation
// piering page). Copy preserves the source's angles -- the basement-flood call,
// engineer signoff + transferable warranty, per-town local SEO, helical vs push
// piers, AI-answer readability. Real facts; pricing is the site's value-based
// posture (from $315/hr, quoted flat).

import type { Service } from "@/lib/service";
import { Scorecard } from "@/components/Scorecard";

export const foundationRepair: Service = {
  slug: "website-design-for-foundation-repair",
  lane: "design",
  laneLabel: "Design",
  breadcrumbParent: { label: "Industry Web Design", href: "/my-industry-specialties/" },
  eyebrow: "Built for the basement-flood call",
  title: "Website Design for Foundation Repair Contractors",
  intent:
    "chadworks builds foundation repair websites that win the basement-flood call and rank for every town you cover: fast on a phone, engineer signoff and transferable warranty up top, a dedicated ranking page for every method, and readable by Google and the AI assistants buyers now ask.",

  answer: (
    <>
      A foundation repair website has one job when a homeowner finds water in the
      basement: get them to tap your number before they tap a
      competitor&apos;s. Most foundation sites lose that job on load speed, a
      buried phone number, and no proof you&apos;re licensed and engineer-backed.
      I build the opposite, and I&apos;ve been building for trade businesses
      since the MySpace days. I&apos;m Chad. Every page is fast on a phone, leads
      with your license, PE engineer signoff, and transferable warranty, and is
      written so Google and the assistants name you for your town and your
      method.
    </>
  ),

  keyFactsHeading: "Foundation repair web design, at a glance",
  keyFacts: [
    "The basement-flood caller decides in seconds. The site has to load fast on a phone, put tap-to-call in the header, and show the trust trio (state license, PE engineer signoff, transferable warranty) before anything else.",
    "Foundation isn't one service. Helical piering, crack injection, exterior waterproofing, French drains, crawl space encapsulation, slab leveling, wall stabilization -- each gets its own ranking page that matches the long-tail search intent.",
    "Every town you serve gets its own page. That is the local SEO play that catches foundation repair searches for each township, not just your home base.",
    "Built server-rendered and schema-rich so Google and the AI assistants can read you. When a homeowner asks ChatGPT who to call for a settling foundation, you want to be the name that comes back.",
  ],

  problemArt: (
    <Scorecard
      label="Six-point foundation site check"
      title="Is your foundation repair site winning the call?"
      items={[
        { strong: "It loads in two to three seconds on a phone", small: "Mobile is the site, not an afterthought. The basement-flood search happens on a phone." },
        { strong: "State license + PE engineer signoff are above the fold", small: "The two trust signals that close the homeowner, visible before any scrolling." },
        { strong: "A transferable warranty is named on the home page", small: "Your specific warranty term, not the generic word \"warranty.\"" },
        { strong: "Every method has its own page", small: "Piering, waterproofing, crawl space, sump pit, slab leveling -- not lumped together." },
        { strong: "Before-and-after gallery on the home page", small: "Real cracked-wall-to-repaired-wall shots, not stock images of generic basements." },
        { strong: "It is server-rendered and carries schema", small: "So Google and the AI assistants can actually read you." },
      ]}
      verdicts={[
        { max: 0, tier: "0", text: "Tap each row that is true for your site. Most foundation sites can honestly check two." },
        { max: 2, tier: "low", text: "Your site is invisible to the panic search. Most of those leads are slipping past you." },
        { max: 4, tier: "mid", text: "You are in the game. Closing the gaps would lock in more of the high-intent calls." },
        { max: 5, tier: "high", text: "Strong. You are catching most of the panic leads in your area." },
        { max: 6, tier: "max", text: "You are already winning the basement-flood calls. This site is a closer." },
      ]}
      ctaHref="/contact/"
      ctaDefault="Let's fix that"
      ctaMax="Build me one anyway"
    />
  ),
  problem: {
    heading: "Why most foundation repair websites fail their owners",
    subheading: "The six checks above take a minute. Here is what they are testing.",
    body:
      "A foundation repair site is not a brochure. It is a closer for a homeowner in a small panic, and most of them lose the job before the phone rings.",
    more: {
      trigger: "The four reasons the call goes to someone else",
      paragraphs: [
        <>
          <strong>It is slow on a phone.</strong>{" "}The night a homeowner finds
          water in the basement, the search happens on a phone, in a hurry. A
          site that takes five seconds to load on mobile has already lost to the
          one that loaded in two. Speed is not a nicety here, it is the whole
          game.
        </>,
        <>
          <strong>The phone number is buried.</strong>{" "}If tap-to-call is not
          in the header on every page, every scroll, the homeowner has to hunt
          for it, and they will not. The number is the most important element on
          a foundation site and it belongs one thumb-press away.
        </>,
        <>
          <strong>There is no proof you are real.</strong>{" "}Someone is about to
          let a stranger make a structural call on their house. State license, a
          PE engineer signoff, and a transferable warranty, visible above the
          fold, clear that bar. Bury them on an About page and the doubt wins.
        </>,
        <>
          <strong>Every method is lumped onto one page.</strong>{" "}Foundation
          buyers Google specifics, helical pier vs push pier, exterior membrane
          near me, polyjacking a driveway. One Services page that lists
          everything ranks for none of it. Each method needs its own real page,
          with copy that matches the search intent.
        </>,
      ],
    },
  },

  // The nine-step build timeline, rendered as the ProcessCapsule (page.tsx).
  approach: {
    heading: "From first call to live site, in nine steps.",
    steps: [
      { title: "Discovery", body: "I interview you to extract the necessary information about your business like company history, mission and vision, important products or services, milestones, etc." },
      { title: "Website Architecture (Sitemap)", body: "An SEO and user-friendly sitemap to visually organize all of your pages in an easy to read and digest visual." },
      { title: "Homepage Design", body: "The overall design of the site will be delivered with the first revision of the homepage." },
      { title: "Sub Page Build Out", body: "The rest of the website's pages will be built out with the design from the homepage and the content provided." },
      { title: "Search Optimization (SEO)", body: "The website pages and content will be optimized for search out of the box." },
      { title: "Mobile Optimization and Testing", body: "All content and pages must be complete before mobile testing and optimization is performed." },
      { title: "Soft Launch", body: "We launch the site on your main domain. We ask friends and family to visit the site and test it out to try and find any last bugs we did not catch or issues with specific operating systems, browsers or devices." },
      { title: "Official Launch", body: "We announce the launch of your website, and toast to a job well done for everyone involved. Congrats on your new web property, go get 'em. I'll be here for anything else you may need." },
      { title: "Post-Launch Safety Net", body: "For a limited period after official launch, I'll fix any issues or glaring mistakes that come up at no charge." },
    ],
  },

  proof: {
    heading: "What this looks like when it works",
    items: [
      {
        label: "Most-cited site in its market",
        detail:
          "After a rebuild aimed at being readable to AI, a trade-service client became the single most-cited site for its region, ahead of the directories. The same build discipline carries straight into foundation repair.",
      },
      {
        label: "The trade-business track record",
        detail:
          "I have been getting service businesses found online since the MySpace days. Foundation repair is local, urgent, and trust-driven, exactly the kind of work this approach was built for.",
      },
      {
        label: "A teardown, not a promise",
        detail:
          "Scroll the sample foundation piering page below. Every section is there for a reason, and I will walk you through why before I build yours.",
      },
    ],
  },

  portfolio: {
    heading: "Sites I've built for trade and service businesses.",
    intro:
      "Trade service, event hospitality, specialty landscape, and a solo wellness practice. Click anywhere on a shot to send a ripple through it.",
    items: [
      { label: "Russ Tree Service", img: "/portfolio/russtree.webp", alt: "Russ Tree Service homepage", href: "https://russtreeservice.com" },
      { label: "AAC Event Catering", img: "/portfolio/aac.webp", alt: "AAC Event Catering homepage", href: "https://aaceventcatering.com" },
      { label: "EdenScapes", img: "/portfolio/edenscapes.webp", alt: "EdenScapes Japanese garden design page", href: "https://eden-scapes.com/japanese-garden-design-installation/" },
      { label: "Massage Professionals", img: "/portfolio/massagepros.webp", alt: "Massage Professionals LLC homepage", href: "https://massageprofessionalsllc.com" },
      { label: "ADS Automation", img: "/portfolio/adsautomation.webp", alt: "ADS Automation homepage", href: "https://adsautomation.com" },
      { label: "Thorobird", img: "/portfolio/thorobird.webp", alt: "Thorobird homepage", href: "https://thorobird.com" },
    ],
  },

  testimonials: {
    heading: "30+ reviews on Google. Read a few below.",
    items: [
      { quote: "He exceeded my expectations.", attribution: "Giselle" },
      { quote: "Easy to work with, responsive, and provides a fast turn-around.", attribution: "Jon Detrixhe" },
      { quote: "Very good at keeping costs down.", attribution: "Stacey Vey" },
      { quote: "He is an SEO magician!", attribution: "Ananda Forest" },
      { quote: "Chad is an amazing web designer and content creator.", attribution: "Rovin Rozario" },
      { quote: "Friendly, responsive and a good listener.", attribution: "Tim Noonan" },
    ],
  },

  made: {
    eyebrow: "Made in the USA",
    heading: "Hi, I'm Chad.",
    intro:
      "I've been building websites for trade and service businesses since the MySpace days.",
    manifesto: [
      { lead: "I design it.", aside: "(No template.)" },
      { lead: "I code it.", aside: "(No page builder.)" },
      { lead: "I maintain it.", aside: "(No ghosting.)" },
    ],
    negation: [
      "No subcontractors.",
      "No offshore.",
      "No AI slop.",
      "No warehouse agency you'll never hear from after the invoice clears.",
    ],
    close:
      "When you call, I pick up. When something breaks at 11pm before your busy season, I'm the one fixing it.",
    img: "/people/chad-cutout.webp",
    imgAlt: "Chad, founder of chadworks",
    captionMain: "Don't worry, I'm a professional.",
    captionSub: "(Web designer.)",
    sig: "Chad",
    sigMeta: "chadworks - Philadelphia, PA",
  },

  price: {
    heading: "What I quote up front is what you pay.",
    figure: "$5,200 - $8,200",
    figureSub: "Custom build, scope-dependent",
    body:
      "Pricing tracks scope, not hours. A focused conversion site lands near the low end of the range. Add intake forms, a real photo gallery, or service-area pages and the number moves up. You see the full quote before we start, and that's the number on the final invoice, no retainer running in the background. When you need something later, you email me and I bill the work.",
    disclaimer: (
      <>
        <strong>Heads up:</strong>{" "}the range above reflects the typical build.
        Larger scopes, complex requirements, or markets with heavy competition can
        easily push past the high end. Nothing on this page is a formal quote, real
        numbers come after a free consult where we scope your actual project
        together.
      </>
    ),
  },

  faqLead:
    "Questions that come up when foundation repair owners compare what I build to what they see on the best-performing competitor sites.",
  faqs: [
    {
      q: "Top foundation repair sites lead with their state license, PE engineer signoff, and transferable warranty. Will mine?",
      a: "Yes. Trust badges row above the fold, state contractor license, ICRI cert if you carry it, PE engineer signoff line, BBB, named insurance carrier, and your transferable warranty. Whatever credentials you actually carry, none of them faked. Transferable warranty gets its own callout because that's the line item that closes the homeowner against US Waterproofing or Basement Systems.",
    },
    {
      q: "Sites like Olshan and JES Foundation Repair have a page for every town they serve. Do I get that?",
      a: "Yes, service-area pages are part of every build. Each one is real, real towns, real local content, real schema, not thin AI-spun duplicates Google will quietly de-index. Pricing tier determines how many; the base build typically covers 5 to 9, and we scale up from there.",
    },
    {
      q: "Should foundation repair, basement waterproofing, and crawl space encapsulation each get their own page?",
      a: "Yes, each service gets its own page. Foundation repair, waterproofing, and crawl space encapsulation customers all search differently and have different pain. Separate pages let you rank for the actual term, and let each page convert with copy that matches the intent. Most competitor sites lump them together and lose the long-tail traffic. We'll also break out concrete leveling and sump pump installation if you offer them.",
    },
    {
      q: "Do you separate residential and commercial flows?",
      a: "Yes. Residential optimizes for the panicked homeowner with water in the basement after a storm, fast load, tap-to-call CTA up top, license and transferable warranty visible. Commercial gets a structural intake form, named PE on staff, fleet bio, named insurance carriers, and a quote workflow that doesn't pretend a property manager is the same lead as a homeowner. Tell me your mix and I'll build for the heavier side.",
    },
    {
      q: "Top foundation sites lead with before-and-after photos. How prominent will mine be?",
      a: "Front and center. Foundation repair is sold by visible proof, cracked wall to repaired wall, wet basement to dry basement after the next storm. Every build ships with a before-after gallery on the home page and indexed to each service page by job type: piering, crack injection, exterior membrane, interior French drain, sump pit. Real photos of your crew and your jobs, not stock images of generic basements.",
    },
    {
      q: "Schema, AreaServed, LocalBusiness, what does any of that mean, and do I need it?",
      a: "It's the structured data Google, and now ChatGPT, Perplexity, and Gemini, read to know who you are, where you work, and what you do. Without it you're a name in a paragraph. With it you're an entity Google and AI search can cite. All wired up correctly in the build, no extra cost.",
    },
    {
      q: "How long does a build take?",
      a: "2 to 3 weeks from kickoff to launch for a focused conversion site. Bigger scopes, multiple service-area pages, content migration, intake forms with custom routing, run 4 to 6 weeks. I quote a delivery date up front and stick to it.",
    },
    {
      q: "Can you migrate me off Wix, Squarespace, GoDaddy, or whatever I'm on now?",
      a: "Yes. Full migration is included in the build price. Wix and Squarespace make export painful on purpose, that's part of the racket. I handle the rebuild, you keep your domain and your hosting account in your name.",
    },
    {
      q: "Why do you show pricing when most foundation-repair-focused agencies don't?",
      a: "Because you should know roughly what you're going to spend before we talk. Most agencies hide pricing so they can size the quote to what they think you'll pay. The range here is honest: $5,200 to $8,200 based on scope, quoted up front.",
    },
  ],

  cta: {
    heading: "If your foundation repair website looks like it was built in 2012, let's fix that.",
    body:
      "No pitch, no pressure, no slide deck. Tell me what's broken and what jobs you actually want more of. I'll tell you what I'd build and what it would cost.",
    buttonLabel: "Send",
    href: "/contact/",
  },

  form: {
    source: "Foundation repair niche page",
    subject: "New chadworks Inquiry - Foundation Repair",
    submitLabel: "Send",
    successMessage: "Thanks, got it. I'll reply within one business day.",
    fields: [
      { kind: "text", name: "name", label: "Your name", required: true, autocomplete: "name" },
      { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
      { kind: "text", name: "phone", label: "Phone", required: true, autocomplete: "tel", span: "half" },
      {
        kind: "textarea",
        name: "message",
        label: "Your message",
        required: true,
        rows: 4,
        placeholder: "A line or two about your current site, your service area, the jobs you wish you had more of...",
      },
    ],
  },

  meta: {
    title: "Website Design for Foundation Repair Contractors | chadworks",
    description:
      "Foundation repair websites built to win the basement-flood call: fast on a phone, tap-to-call in the header, engineer signoff and transferable warranty up top, a dedicated ranking page for every method, and a page for every town you cover. Server-rendered and schema-rich so Google and the AI assistants name you. Custom builds run $5,200 to $8,200, quoted up front.",
  },
};
