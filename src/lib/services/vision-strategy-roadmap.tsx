// Service page: "V/S/R: Vision, Strategy, Roadmap" (/vision-strategy-roadmap/).
// The FIRST service in Lane 03, Consulting (new lane, Chad 2026-07-16). Guided
// vision building: the thoughts come out of the founder's head and land in a
// document they own. Formerly "Crystopa Guided Vision Building", before that
// "Blueprint Sessions", before that "Vision Extraction & Ideation".
//
// This service is not a concept. It has been run and delivered twice (a 35-year
// consulting firm, 2026-02; a 28-year arts nonprofit, 2026-06). The method is
// already written; this page is its home and its repeatable shape.
//
// SOURCES (referenced, deliberately not restated -- read them before editing):
//   Dropbox/Libra Engine/Crystopa Forge/services/
//     crystopa-forge-product-service-architecture.md  ("Crystopa Guided Vision
//     Building" -- what the service IS, the finish line, no lock-in)
//   E:/chadworks Clients/ICAF/ICAF-FOUNDER-EXCAVATION.md  (THE ONE RULE, the
//     Gate, the five movements, the facilitation anti-patterns -- the method)
//   E:/chadworks Clients/ICAF/ICAF-VSR.md  (a REAL delivered VSR -- the
//     deliverable's actual section structure. `vsrDeliverable.anatomy` traces it)
//   Dropbox/Chad Lewine/SSA/SOVEREIGNTY-AUDIT-METHOD.md  (The Untangle, The
//     Click, avatar vs. locus, the marketing process points)
//   Dropbox/Libra Engine/Crystopa Forge/marketing/
//     crystopa-forge-process-showcase-blueprint-session.md  (the proven format)
//   Binder: CWS-VSR-SERVICE.md
//
// THE LINE THAT KEEPS THIS SHIPPABLE -- do not cross it, in copy or in a
// prompt() brief. THE SUBJECT IS THE BUSINESS, NEVER THE FOUNDER'S PSYCHE. We
// untangle the company's ENTITIES (business / product / platform), never the
// founder's roles, identity, or self. Never: personality, psychological
// patterns, conditioning, trauma, family, ego, healing, emotional processing.
// No clinical vocabulary, not even ironically. If a line would read as a read on
// the PERSON rather than the VENTURE, cut it. The personal-facing twin of this
// method is parked indefinitely on 63 P.S. 1202 (see
// "2026-07-16 - Sovereignty Audit Build + Licensure Stop.md", section 1); a
// session about a company's vision is a different target, and the target is what
// the statute cares about. That difference is the only reason this page exists.
//
// COPY PASS (Chad, 2026-07-16): "i want you to write content where there are
// prompts." The 18 prompt() amber blocks are now written. Everything on this
// page is draft copy for Chad to overwrite at will; it is written TO the voice
// profile rather than in place of him.
//
// Voice rules held throughout (chad-lewine-crystopa-forge-voice-profile.md +
// operations/SOP docs/crystopa-forge-sop-humanizing-voice-rules.md): no
// em-dashes, no sentence or clause triplets, no lists of exactly three, no
// "is X, is not Y" antithesis (the strongest AI tell, and CF's own docs are
// full of it), no hyperbole, no banned AI-tells, no "out loud". Written from
// the reader's experience. Dollar figures named plainly, pricing stated in one
// sentence without justification, credentials in one sentence.
//
// The three-item enumerations that DO survive are factual, not rhetorical: V/S/R
// is literally three things, and one real client's tangle was literally
// Business / Product / Platform. Falsifying a client's facts to dodge a style
// rule would be the worse sin.

import { type Service } from "@/lib/service";
import { VSR_START } from "@/lib/pricing";
import { money } from "@/lib/package-builder";
import type { RuleCapsuleProps } from "@/components/capsules/RuleCapsule";
import type { SplitChecklistCapsuleProps } from "@/components/capsules/SplitChecklistCapsule";
import type { VerbatimCapsuleProps } from "@/components/capsules/VerbatimCapsule";
import type { DeliverableCapsuleProps } from "@/components/capsules/DeliverableCapsule";

export const visionStrategyRoadmap: Service = {
  slug: "vision-strategy-roadmap",
  lane: "consulting",
  laneLabel: "Consulting",
  eyebrow: "Before anything gets built",
  title: "V/S/R: Vision, Strategy, Roadmap",
  intent:
    "chadworks runs guided vision building sessions that pull a founder's vision out of their head and organize it into a Vision, Strategy, Roadmap document they own outright and can build from, with chadworks or without it.",

  // Answer-first lede. Quotable inside the first 100 words: names the entity
  // (a working session, then a document you own) and answers the question (who
  // does this, what do I leave with) before anything else.
  //
  // THE KEYSTONE IS THE SESSION, AND THE INTANGIBLE (Chad, 2026-07-16). An
  // earlier pass hung the whole page on "the sentence you say in the room". That
  // was wrong twice over: it reduces hours of skilled extraction to a
  // quote-capture exercise, and it makes VSR_START look like the price of one
  // sentence. The click is a real moment and it stays a moment. What is being
  // sold is the session, and the material it works on is the intangible thing
  // the client is already carrying. Keep the weight there.
  answer:
    `You have had the whole thing in your head for years, and every time you try to explain it, it comes out smaller than it is. That is what carrying something intangible feels like, and it does not improve by thinking about it harder. I'm Chad. This is a working session that gives the thing a shape, and then a document that holds the shape still. You leave with your Vision, Strategy, and Roadmap, yours to keep and build from with me or without me. It starts at ${money(VSR_START)}. Every product I own went through this before a line of code was written.`,

  // FOUR bands, and the slots are Chad's (2026-07-16): 1 what the V/S/R is,
  // 2 who it is for, 3 why they need it, 4 the deliverable. A big-picture
  // summary of the service, nothing else.
  //
  // LENGTH IS A CONSTRAINT, not a suggestion. The launched pages run 20-33 words
  // per band (web-design 24-32, web-development 22-23, septic 20-33). An earlier
  // pass here ran 36-41 and read long against every other page on the site. Keep
  // each band at two short sentences or one. If a band needs a third sentence,
  // the band is trying to be a section.
  //
  // PRICE IS NOT A BAND. No launched page puts a figure here; the rate has its
  // own section. Do not add it back.
  //
  // NOTE: band 4 is THE DELIVERABLE by Chad's structure, not "the person" as on
  // the other launched pages. Chad's slots win. The credential still lands, in
  // the one-rule admission and the what-it-is footer.
  keyFactsHeading: "V/S/R at a glance",
  keyFacts: [
    "Guided vision building. A working session that pulls the thoughts out of your head and gives them a shape you can point at and build from.",
    "For founders carrying something bigger than they can explain yet. A business, a product, a pivot, or a vision that has no words on it.",
    "You are carrying something real that has no shape. Nothing gets built from it until it has one, and that includes anything you try to build yourself.",
    "Your Vision, Strategy, and Roadmap, on paper. The session held still, yours to keep and build from with me or without me.",
  ],

  problem: {
    heading: "You are carrying a pile you call the business",
    subheading: "In your head it is one object. It never is.",
    body:
      "Almost every founder arrives with a knot: the company, the thing it sells, the place it lives, and the campaign, all fused into a single lump they refer to as one word. Nothing downstream can get clear while that lump is intact, so the brand stays vague, the pricing gets argued in circles, and every choice about what to build next gets made against a feeling instead of a structure.",
    more: {
      trigger: "Why the tangle is the whole problem",
      paragraphs: [
        "You can talk about your own company for an hour and leave the room having explained nothing. Most founders read that as a personal failing, some knack for pitching they were never issued. There is nothing wrong with your thinking. The thing you are describing has no shape yet, because the pieces it is made of have never been pulled apart. One founder I worked with had a business, a product, and a rebuilt platform sitting in his head as a single object he called the launch. A 28-year-old nonprofit had its foundation, its festival, its programs, and its initiatives in the same knot. Both were run by sharp people who had been at it for decades. A knot is what happens to anything you carry around long enough.",
        "Once the pieces come apart and get named, questions that felt unanswerable start answering themselves, because most of them were only hard while two different things were being treated as one. The move is easy to describe and slow to do: work out which piece is the source, and which pieces are things the source produces. Everything reorders itself around that answer. The brand finally knows what it is talking about, and you stop relitigating the same decision every quarter in slightly different words. Nobody gets transformed. You get a shape where there was a pile, and that turns out to be most of it.",
      ],
    },
  },

  // Rendered as the ActsCapsule (the movements row), not the default approach
  // grid: these are movements, not numbered steps. They run in order, they do
  // not run on a clock, and the Gate can end the engagement before movement one.
  approach: {
    heading: "How the session actually runs",
    steps: [
      {
        kind: "The gate",
        title: "A go or a no",
        body:
          "Before the real work starts, one question decides whether this engagement can succeed: do you want the company seen correctly more than you want to protect what you have already built? If the honest answer is the second one, a smaller engagement is the right call, and I will tell you so rather than take the money and find out later.",
      },
      {
        kind: "The fire",
        title: "Origin and fire",
        body:
          "Why this exists, what you are up against, and what you believe that other capable people in your field do not. Your phrasing is the raw material here, so I write down how you say it rather than how I would say it.",
      },
      {
        kind: "The core move",
        title: "The untangle",
        body:
          "The pile comes apart. Each piece gets described as if to a stranger, named, and sorted into the one that is the source and the ones that are outcomes of it. The map that falls out of this is roughly half the finished document.",
      },
      {
        kind: "The click",
        title: "The click",
        body:
          "The moment you see how the separated pieces relate, and hear yourself say it. I do not manufacture this and I cannot hand it to you. I set the conditions and wait. When it lands I stop, get it down exactly as you put it, and read it back to check it is the true version.",
      },
      {
        kind: "The inventory",
        title: "The ground truth",
        body:
          "What exists today, what you own outright, who actually does the work, what funds it, and whose approval a change needs. These questions feel like admin and they decide whether any of the creative is even buildable.",
      },
      {
        kind: "The horizon",
        title: "The horizon and the line",
        body:
          "What winning looks like in ten years, and what you would refuse to do even for money. The refusals matter more than they sound: they are what tell me what I am allowed to build.",
      },
    ],
  },

  paths: {
    heading: "Where this can lead, if you want it to",
    intro:
      "The document ends the engagement. It does not start a relationship you have to keep paying for. If you do want the thing built after that, these are the routes it takes.",
    items: [
      {
        label: "Web Development",
        detail:
          "How a vision that made it onto paper gets built, and the routes a serious custom product can take from here.",
        href: "/web-development/",
      },
      {
        label: "Websites",
        detail:
          "The lighter end. If the ground truth says a site is what you actually need right now, that is where the work goes.",
        href: "/websites/",
      },
    ],
  },

  proof: {
    heading: "It has been run, and delivered",
    items: [
      {
        label: "A 28-year-old arts nonprofit",
        detail:
          "The founder came in asking about search visibility and reframed his own ask inside the first movement. Two sessions on consecutive days, and a finished Vision, Strategy, Roadmap in his hands inside 48 hours, built out of his own thinking rather than mine.",
      },
      {
        label: "A 35-year consulting firm",
        detail:
          "A business, a product, and a rebuilt platform, fused into one thing in the founder's head. They came apart in one sitting, he named the relationship between them himself, and the marketing strategy fell out in the same session.",
      },
      {
        label: "Every Libra Engine venture",
        detail:
          "Rising Compass, chadlewine.com, and the rest all went through this process before a line of code was written. The method is not something I read about. It is how I build my own things.",
        href: "/showroom/",
      },
    ],
  },

  price: {
    heading: "What a V/S/R costs",
    figure: money(VSR_START),
    figureSub: "starting point, scoped to your world",
    body:
      `${money(VSR_START)} to start. Where it goes from there is decided by how tangled your world is rather than by how many hours I spend in it, so one founder with one product is a smaller number than an organization with four programs fused together. What you are paying for is the work, and the document is what you keep of it. For scale: a consulting firm would charge you six figures for this and hand you a deck with their name on the cover three weeks later. You get a couple of days in a room with me, and everything that comes out of it.`,
    disclaimer: (
      <>
        {money(VSR_START)} is the starting point, not a quote. Where a specific engagement
        lands is set in writing before any work begins, and it is decided by how
        much there is to untangle.
      </>
    ),
  },

  qualification: {
    heading: "Is a V/S/R the right call for you?",
    fitLabel: "This is for you if",
    fit: [
      "You can talk for an hour about your own company and still leave the other person unclear on what it actually is.",
      "Several things in your world are being treated as one thing, and you can feel that it is costing you without being able to point at where.",
      "You want the vision to end up on paper in your own words, so the next decision has something to be made against.",
      "You would rather be asked hard questions than handed someone else's strategy to nod at.",
    ],
    notLabel: "This is not for you if",
    notFit: [
      "Your thinking is already organized and written down. Take it straight to a build; there is nothing here for you to buy.",
      "You want someone to hand you the answer and put their name on it. That is a strategy engagement, and it is a different service.",
      "You need the current work defended rather than examined. The session opens by testing exactly that, and it will not go well.",
    ],
  },

  faqs: [
    {
      q: "What is a V/S/R?",
      a: "Vision, Strategy, Roadmap. It is a document that holds the complete extraction of what is in your head, organized into a plan you can build from: the spine sentence, the map of your separated entities, the strategy that follows from them, and a roadmap sequenced against your real constraints. It comes out of a guided session, or a few of them, and it is the thing you are actually buying.",
    },
    {
      q: "How is this different from a free consultation?",
      a: "A consultation is where someone learns enough about you to sell you something. This produces a document you own and take with you, and it ends when the vision is on paper whether or not you ever hire me for the build. The work is the extraction itself, which is a skill, and it is what the price is for.",
    },
    {
      q: "Do I have to build it with you afterward?",
      a: "No, and the document is yours regardless. Take it to another agency, hand it to your own team, or build it yourself. Clients who do go on to a build get a foundation both sides have already lived with, which beats a scope signed in a hurry, but nothing about the V/S/R requires it.",
    },
    {
      q: "What if you disagree with my vision?",
      a: "Then I ask you about it rather than write my version into your document. When I have a strong idea I turn it into a question that lets you arrive at it or reject it. A vision you nodded along to is not yours, and it falls apart the first time someone pushes on it, so it is worthless to both of us.",
    },
    {
      q: "How long does it take?",
      a: "It takes as many sittings as your world needs, and the finish line is the document rather than a number of hours. For scale: a 28-year-old organization with a tangled portfolio took two sessions on consecutive days, and the finished VSR was in the founder's hands inside 48 hours of the first call.",
    },
    {
      q: "Is this therapy or coaching?",
      a: "Neither, and the boundary is firm. The subject is your company: what it does, how the pieces relate, what it owns, and where it goes. If personal material comes up in a session, I note it and steer us back to the business. I hold no clinical license and I do not offer anything of that kind.",
    },
    {
      q: "What does it cost?",
      a: `It starts at ${money(VSR_START)} and moves with the complexity of your world rather than with hours logged. What you are paying for is the document, and the number is set in writing before anything starts.`,
    },
  ],

  cta: {
    heading: "Bring me the whole tangle",
    body:
      "Tell me the thing you cannot explain. However it comes out is fine, including the parts that contradict each other, because the mess is the raw material and there is nothing to tidy up first. If a V/S/R is the wrong call for where you are, I will say so and point you at what isn't. That happens, and I would rather say it now than take your money and work it out in the room.",
    buttonLabel: "Tell me what you cannot explain",
    href: "/contact/",
  },

  form: {
    source: "vision-strategy-roadmap page",
    subject: "V/S/R inquiry",
    submitLabel: "Send message to Chad",
    successMessage:
      "Got it. I read these myself, and I will come back to you about what is tangled and whether a V/S/R is the right call.",
    fields: [
      {
        kind: "text",
        name: "name",
        label: "What name should I address you by?",
        required: true,
        autocomplete: "name",
        span: "half",
      },
      {
        kind: "email",
        name: "email",
        label: "Email",
        required: true,
        autocomplete: "email",
        span: "half",
      },
      {
        kind: "text",
        name: "org",
        label: "The company, project, or organization",
        span: "half",
      },
      {
        kind: "url",
        name: "site",
        label: "Website, if there is one",
        placeholder: "https://",
        span: "half",
      },
      { kind: "section", label: "What is in your head" },
      {
        kind: "textarea",
        name: "vision",
        label: "Describe the thing you cannot explain",
        placeholder:
          "However it comes out. Contradictions are fine, and they are usually the interesting part.",
        rows: 6,
        required: true,
      },
      {
        kind: "textarea",
        name: "tangle",
        label: "What feels like one thing that you suspect might be several?",
        rows: 3,
      },
      {
        kind: "select",
        name: "stage",
        label: "Where is it today?",
        options: [
          { value: "", label: "Choose one" },
          { value: "idea", label: "An idea, nothing built yet" },
          { value: "early", label: "Started, still finding its shape" },
          { value: "running", label: "Running, and the story has drifted" },
          { value: "pivot", label: "Established, facing a real pivot" },
        ],
        span: "half",
      },
    ],
  },

  meta: {
    title:
      "V/S/R: Vision, Strategy, Roadmap | Guided Vision Building | chadworks",
    description:
      `You have the whole thing in your head and it comes out smaller every time you explain it. I run the session that gets it onto paper in your words, and hand you a Vision, Strategy, Roadmap document you own outright. From ${money(VSR_START)}.`,
  },
};

// ---------------------------------------------------------------------
// OVERRIDE-SLOT CONTENT
// The sections this page does NOT take from the default composition. Data lives
// here beside the Service (never in the route) so the page file stays thin and
// every word on the page is editable from one file. The route wires these into
// composeService's slots. See the route for the placement map.
// ---------------------------------------------------------------------

// THE ONE RULE. The differentiator and the entire trust argument, and the first
// thing after the movements. The verbatim internal rule (from
// ICAF-FOUNDER-EXCAVATION.md) is: "Extraction-first, not impose-first. The
// vision is in his head. Your job is to be the vessel that gets it onto paper
// faithfully -- the scribe, not the author. Ask open. Shut up. Let silence do
// the work. Mirror his exact words back; do not upgrade his language into
// yours. When you have a strong idea, convert it into a QUESTION that lets him
// arrive there. Don't mistake agreement for vision."
//
// That text is written TO Chad, in second person, about a founder. It cannot go
// on the page as-is, and rewriting it for a client is pure persuasion, so it is
// prompted rather than drafted. The brief carries the rule; Chad writes the line.
export const vsrRule: RuleCapsuleProps = {
  heading: "The one rule",
  // The line, deliberately positive-only. The internal rule ("Extraction-first,
  // not impose-first... the scribe, not the author") is antithesis twice over,
  // and the SSA's own line ("I help you discover. I don't dictate.") is too. All
  // three are the banned structure, so the claim is stated straight instead.
  //
  // It also points at the SESSION rather than at a sentence: "getting it out
  // intact" is the work. An earlier version read "I ask until you say it", which
  // made the rule about capturing a quote (Chad, 2026-07-16: the sentence is not
  // the keystone).
  line: "You already have the vision. The work is getting it out intact.",
  body: [
    "Every agency sells you their strategy. I refuse to, and the reason is mechanical rather than modest. Anything I hand you, you can hand back to me, and you will, the first time a board member or a co-founder leans on it. Anything you arrived at yourself, you have to live with, and it holds under weight, because you already know why it is true. So I do not give you my conclusion about your company. I ask until you get there, and what goes in the document is what you meant, rather than my improvement of it.",
    "In practice that means I ask open questions and then shut up. I let the silence sit instead of filling it, and I give your words back to you without quietly upgrading them into mine. When I have a strong idea it reaches you as a question rather than a pitch, because a founder nodding along to my idea is not the same as a founder arriving at his own.",
    // The honest admission. This is the strongest thing on the page and it is
    // load-bearing: a click proves the client is smart, this proves the method
    // beats the practitioner. The dollar figure and the artist's name are
    // omitted ON PURPOSE (they identify the client in one search), which is the
    // one place this page breaks Chad's "always name the number" habit. See
    // CWS-VSR-SERVICE.md ("Consent and anonymization").
    "I'll be frank about what that costs me. Going into the nonprofit engagement I had written a rule that no outside artist should ever build on a child's artwork. I believed it, and I had it in the deck. In the room, the founder told me the most successful fundraiser his organization had ever run was exactly that, done with his blessing, years before I turned up. My rule would have banned his best play. I dropped it that afternoon and the document went out without it. That is the method working, and it was working against the person who wrote it.",
  ],
};

// WHAT IT IS. Checklist + art row. `art` is intentionally omitted: chadworks has
// no asset for this page yet, and the row collapses to a single centered measure
// without one. See CWS-VSR-SERVICE.md ("Open / needs Chad") before adding one.
export const vsrWhatItIs: SplitChecklistCapsuleProps = {
  heading: "What guided vision building is",
  // CF's definition is the source and it is good; its "tangible, referenceable,
  // and expandable" is a triplet and its "This is not pre-work. This is not a
  // free consultation. This is skilled extraction." is a triplet AND an
  // antithesis, so the claim survives and the structure does not.
  lead:
    "Guided vision building is the work of pulling the thoughts out of your head and organizing them into something you can point at. It works on anything you have been carrying around: a business, a product, a creative project, a pivot, a vision that does not have words yet. The job is to make abstract thinking real enough to build on, so it stops living as a feeling you re-explain badly every time somebody asks. This is skilled extraction, and it is what the price is for. Getting a vision out of a person faithfully is a craft, and it is harder than having opinions about their business.",
  items: [
    <>
      <strong>The subject is the company, always.</strong> What it does, how the
      pieces relate, what it owns, and where it goes. Personal material that
      comes up gets noted and set aside, and we go back to the business.
    </>,
    <>
      <strong>Your language survives the session.</strong> I write down how you
      say it rather than improving it into how I would say it, because the
      version in your words is the one you can still defend in six months.
    </>,
    <>
      <strong>Nothing gets solved in the room.</strong> The session extracts.
      Strategy and creative come after, in the document, which is why the
      thinking does not get rushed to make space for someone designing.
    </>,
    <>
      <strong>The boring questions get asked.</strong> What you own, who says
      yes, what the money actually does. They feel like admin and they decide
      whether the exciting part is buildable at all.
    </>,
  ],
  footer:
    "My qualification here is not a certificate. It is that this is how I build everything I own: Rising Compass, chadlewine.com, and the rest all went through this before a line of code existed, and every one of them shipped better for it. The showroom has the receipts. The harder credential is that I have run this for clients and let my own best thinking lose to theirs in the room, which is the part most people in my position cannot make themselves do.",
  cta: { href: "#deliverable", label: "See what you walk away with" },
};

// SENTENCES I DID NOT WRITE. The proof of extraction-first, and the strongest
// asset this service has.
//
// ANONYMIZED, and it stays that way until Chad has explicit consent (Chad,
// 2026-07-16). Every quote below is VERBATIM from a real session capture; the
// attributions are deliberately generic. The two stories that would identify the
// nonprofit in a single search (the Pentagon / 9-11 story and the named artist
// collaboration) are ABSENT ON PURPOSE, not forgotten -- naming the org makes
// its 990s findable, which attaches the founder's compensation and the
// organization's negative net assets to a named client of chadworks. Do not
// "strengthen" this section by adding the identifying detail back. See
// CWS-VSR-SERVICE.md ("Consent and anonymization").
export const vsrVerbatim: VerbatimCapsuleProps = {
  // Heading points at the SESSION, not at the quotes. It read "Sentences I did
  // not write", which made the section a shrine to sentence-collecting on a page
  // whose keystone is the session (Chad, 2026-07-16). The quotes are EVIDENCE
  // that the room works. They are not the product.
  heading: "What came out of the room",
  lead:
    "These are real moments from real sessions. Read them and notice what they have in common: not one sounds like an agency wrote it, because nobody did. Each one is a founder getting to something they had been carrying for years and had never once been asked about directly. That is what the hours are for. The clients are anonymous here because I have not asked them yet, which on a page about respecting whose thinking is whose felt like the only option.",
  items: [
    {
      quote:
        "We are the organization to overcome that 4th grade slump. ART is the least-cost way to enable a child to overcome that slump.",
      source: "The founder, a 28-year-old arts nonprofit",
      note:
        "This became the spine, and every section after it was built to serve it. I could not have written this sentence. It carries a piece of research he had been chewing on for 28 years and a judgment only he was in a position to make. Notice how it actually reads: specific, faintly awkward, unmistakably a person talking.",
    },
    {
      quote: "The mission is more important than the institution.",
      source: "The same founder, later in the same session",
      note:
        "This is the line that made a real rebuild possible, and it had to come from him. Out of my mouth it would have sounded like an agency arguing itself into a bigger engagement. Out of his, it became the permission everything else got built on.",
    },
    {
      quote:
        "One is creation, in the term of Big Bang creation, and the other is outcome.",
      source: "The founder, a 35-year consulting firm",
      note:
        "He had a business, a product, and a rebuilt platform fused into one object in his head. Once they were separated he saw how they related and said this, unprompted, sitting right there. Nobody hands a client a line like this. It is what a person sounds like at the exact moment something becomes clear, and his whole marketing strategy got built on it in the same sitting.",
    },
    {
      quote: "Something even bigger than the initial SEO convo.",
      source: "The founder, a 28-year-old arts nonprofit, opening minutes",
      note:
        "He booked me to talk about search visibility. Inside the first movement he threw out his own framing of his own problem and said the real thing was much bigger. I want to be careful with this one, because the flattering version is the wrong one: I did not reframe him. He already knew. Nobody had asked him.",
    },
  ],
  footer:
    "None of these arrived in an email. Each one took hours of someone being asked about their own work by a person who would not take the rehearsed answer, and none of them existed at the top of the session. That is the thing you are buying. The document is where it goes afterward, so it survives your board and you six months from now, when the old story starts sounding reasonable again.",
};

// THE DELIVERABLE. Chad, 2026-07-16: "the deliverable is the value... we have to
// show an example of the deliverable along with the process."
//
// `anatomy` traces the section structure of a REAL delivered VSR (ICAF-VSR.md).
// It is the actual shape of the document, not an idealized contents page.
//
// `sample` is a COMPOSITE and is stamped as one. It is not a real client, not a
// real company, and not an anonymized real engagement; it is invented to show
// the document's texture at a size that fits on a web page. The stamp is
// required by the type. Real client language lives in `vsrVerbatim`, which is
// verbatim and anonymized, and the two must never be merged.
export const vsrDeliverable: DeliverableCapsuleProps = {
  heading: "The deliverable",
  id: "deliverable",
    lead:
    "An intense conversation fades. Within a week you can talk yourself back out of everything you saw clearly in the room, which is why the session alone is not enough. The document is the session held still: the whole of it, in your language, while you were most awake. Every decision after that has something solid to be made against. One session, or a few. No 40-page deck three weeks later.",
  anatomy: [
    {
      letter: "V",
      label: "Vision",
      contents: [
        "The spine sentence, in your words, verbatim",
        "Why it exists: the origin, what you are up against, the belief",
        "The entity map: the source, and everything it produces",
        "What you protect, and what you would never do",
        "The ten-year horizon",
      ],
    },
    {
      letter: "S",
      label: "Strategy",
      contents: [
        "The real read on why it is stuck",
        "Who you are actually building for",
        "How the thing sustains itself",
        "The brand position, at the altitude your ground truth allows",
        "The one thing that can break it",
      ],
    },
    {
      letter: "R",
      label: "Roadmap",
      contents: [
        "Phase 0: the foundation, straight off this document",
        "Phase 1: the launch, and what it is anchored to",
        "Phase 2: the engine that compounds",
        "Sequenced against your real constraints, not a fantasy version of them",
      ],
    },
  ],
  anatomyNote:
    "That is the real structure of a document that really got delivered, not a contents page I drew up for this website. Worth noticing how much of V comes straight out of the untangle: the entity map alone is about half of it, which is why that movement is the one the whole session turns on.",
  sample: {
    stamp: "Composite sample. Invented, not a real client.",
    title: "V/S/R -- Northbourne Cider Works",
    blocks: [
      {
        heading: "V -- The spine",
        body: (
          <>
            <p className="cw-deliv__quote">
              The orchard is the company. The cider is what the orchard has to
              say. The taproom is where people come to hear it.
            </p>
            <p>
              Everything below serves that sentence. It is yours, said in the
              second session, and it is the test every decision in this document
              had to pass.
            </p>
          </>
        ),
      },
      {
        heading: "V -- The entity map",
        body: (
          <>
            <p>
              <strong>The source.</strong> The orchard. The trees, the ground,
              and 40 years of knowing them, which is the thing nobody can copy.
            </p>
            <p>
              <strong>The outcomes.</strong> The cider line, which is the
              orchard in a bottle. The taproom, which is the orchard with a
              room around it. The wholesale accounts, which are the orchard
              speaking to people who will never stand in it.
            </p>
            <p>
              You arrived calling all four of these &quot;the cidery&quot; and
              treating the wholesale accounts as the business. The wholesale
              accounts are the outcome furthest from the source, which is why
              they were the hardest to price and the easiest to lose.
            </p>
          </>
        ),
      },
      {
        heading: "R -- Phase 1",
        body: (
          <>
            <p>
              The taproom becomes the front door rather than the overflow room,
              because it is the only place the source is standing right there
              where a person can taste it. That is the year, and it is one
              build, not four.
            </p>
          </>
        ),
      },
    ],
  },
  cta: { href: "/contact/", label: "Start yours" },
};
