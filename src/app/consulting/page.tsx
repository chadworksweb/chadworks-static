// Route: /consulting/ -- the CONSULTING lane hub (Service Lane 03).
//
// THREE SECTIONS, AND THAT IS THE WHOLE PAGE (Chad, 2026-08-19): the
// /ai-generated-website-audit/ hero, one band of nav lanes, and the global
// contact band. It is a hub, not a service page, so it does not run
// ServiceTemplate or HubTemplate: both of those walk a reader through a full
// argument (key facts -> problem -> approach -> proof -> price), and there is
// no single consulting product to argue for yet. What this page does is take
// somebody who arrived without a word for what they need and hand them a door.
//
// WHY THE AUDIT HERO. Chad picked it by name. It is the site's only two-column
// hero with the lead form in the right slot, and it is right here for the same
// reason it was right there: the reader is unsure rather than shopping, so the
// ask has to be reachable before any argument is made. The form is deliberately
// short. The one thing worth having from somebody who cannot name their problem
// is the problem in their own words.
//
// THE LANES ARE CHAD'S LIST, IN HIS ORDER: Websites, Visibility, Essays, Rates,
// About, then the inverted "not sure" card that points at the contact band.
// Note what is NOT in it: /vision-strategy-roadmap/, the one built consulting
// service, which Chad did not list and which is itself unlaunched. When VSR
// ships, it goes at the top of this array rather than replacing anything.
//
// INDEXING IS DECIDED IN launch.ts, NOT HERE. The layout defaults to noindex
// and metadata.robots below reads isLaunched(), so adding this route to
// launch.ts is the whole switch. It is NOT in launch.ts yet: the page is built
// and sealed, awaiting Chad's go. That one line also lights the SiteNav
// "Consulting" link, which has been greyed since 2026-07-16 waiting on this
// file to exist.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { ORG_ID, ref } from "@/lib/jsonld";
import { isLaunched } from "@/lib/launch";
import {
  PageComposer,
  SectionShell,
  ApertureBandCapsule,
  MainContactCapsule,
  PathsCapsule,
  ArrowRight,
} from "@/components/capsules";
import ManifestoAmbient from "@/components/ManifestoAmbient";
import { LeadForm } from "@/components/forms/LeadForm";
import { FormLandingFlash } from "@/components/forms/FormLandingFlash";
import type { LeadFormConfig } from "@/lib/forms";

const PAGE_PATH = "/consulting/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH.slice(1)}`;

const TITLE = "Consulting | chadworks";
const DESCRIPTION =
  "Web and digital consulting from chadworks. One conversation with a 20-year web designer and developer about what your business actually needs online, and in what order.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // REQUIRED alongside the launch.ts entry. layout.tsx defaults every route to
  // noindex, so launching without this line lands the page in the sitemap while
  // it still serves noindex. Never hardcode `index: true`.
  robots: { index: isLaunched(PAGE_PATH), follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// --- JSON-LD: WebPage + BreadcrumbList, the pair every hub on this site ships.
//
// No Service node and no Offer. Both would be lying: this page sells nothing on
// its own, it routes. The consulting Service schema belongs on
// /vision-strategy-roadmap/ when that launches, not on the hub above it.
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Consulting",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: ref(ORG_ID),
  author: {
    "@type": "Person",
    name: "Chad Lewine",
    url: `${SITE_URL}/about/`,
    jobTitle: "Web designer and developer",
    knowsAbout: [
      "Web strategy",
      "Digital marketing strategy",
      "Web design",
      "Search and AI visibility",
    ],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Consulting", item: PAGE_URL },
  ],
};

// ---------------------------------------------------------------------
// THE HERO FORM. Four fields, one of them optional.
//
// The audit form asks for a LINK because the link is the deliverable there:
// Chad opens the site and knows more in two minutes than a qualification form
// would tell him. There is no equivalent artifact for a consulting inquiry, so
// the textarea takes its place with the same job: say the thing in your own
// words, and the reply can be a real answer instead of a discovery call.
//
// No checkbox row here, which is what puts the phone field at full card width:
// `.cw-fix-formcard .cw-form > div:has(+ .cw-form-field--check)` is the rule
// that pins a phone into a shared row on the audit page, and with nothing to
// match it the field keeps the default `grid-column: 1 / -1`.
// ---------------------------------------------------------------------
const CONSULT_FORM: LeadFormConfig = {
  source: "consulting hub hero",
  subject: "New Consulting Inquiry (chadworks)",
  submitLabel: "Send it to Chad",
  successMessage:
    "Got it. I read every one of these myself, and you'll hear back from me within a day.",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true, autocomplete: "name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    {
      kind: "textarea",
      name: "situation",
      label: "What are you trying to figure out?",
      required: true,
      rows: 4,
      placeholder: "The situation, in whatever words you have for it right now.",
    },
    { kind: "tel", name: "phone", label: "Phone (optional)", autocomplete: "tel" },
  ],
};

// ---------------------------------------------------------------------
// THE APERTURE BAND -- section two, between the hero and the lanes.
//
// WHY THE FRAMING IS WHAT IT IS. The obvious copy for this section is "you
// don't know what you need, and that's fine". It was the first draft and it is
// wrong, because four approved surfaces already own that sentence: the "Not
// sure what you need?" card in this page's own lane grid one screen below,
// the same card on the homepage, /websites/'s "Know exactly what you need, or
// not even close? Both are fine starting points", and
// /ai-search-visibility/'s "Not sure which piece you need?". A fifth would
// have been the second time the reader met it on THIS page.
//
// So the window still runs the reader's own half-formed sentence, but the copy
// around it stops diagnosing them and says what HAPPENS to the sentence. The
// lane card is a door; this is the argument. Different jobs, no echo.
//
// LINE LENGTH IS A HARD CONSTRAINT, not a style preference. The marquee is
// `white-space: nowrap` and never wraps, so every line has to clear the cut on
// its own at every width. The /rates/ payload tops out at "AI Search
// Specialist", 20 characters, and the CSS notes --text-xl was chosen because
// --text-2xl lost the tails of the longer roles. Nothing below runs past 23.
// Adding a longer line means giving this variant its own --cw-quote-size or a
// --measure-prose aperture, not just typing it.
// ---------------------------------------------------------------------
const OPENERS = [
  "Something feels off.",
  "Nobody's finding us.",
  "I hate our site.",
  "Where do I even start?",
  "Is this worth it?",
  "We've tried everything.",
  "I'm stuck.",
  "Too many platforms.",
  "The quotes don't match.",
  "I built it myself.",
  "It just looks generic.",
];

// The payload as one readable sentence. The window is aria-hidden decorative
// duplication, so without this the content does not exist to the outline, to a
// screen reader or to the LLM crawlers. Written out rather than joined from the
// array: the quotes need to survive as quotes in a sentence.
const OPENERS_SPOKEN =
  "Something feels off. Nobody's finding us. I hate our site. Where do I even start? Is this worth it? We've tried everything. I'm stuck. Too many platforms. The quotes don't match. I built it myself. It just looks generic.";

// ---------------------------------------------------------------------
// THE NAV LANES. Chad's list, in his order. `autoSeal` locks each lane
// INDIVIDUALLY against launch.ts, so a lane whose route is not launched renders
// as "coming soon" rather than pointing at a 404, and unlocks itself the day
// that route joins LAUNCHED. All five are launched today.
//
// The Websites, Visibility and About details are lifted VERBATIM from the same
// lanes on /rates/, so the same route is never described two different ways
// depending on where a reader met it. Essays and Rates are written here because
// /rates/ does not carry them.
//
// The Websites line is Chad's, supplied 2026-08-19, and it replaced the old
// shared blurb in all three lane modules at once: here, the homepage's three-up
// (HOME_PATHS) and /rates/. If it changes again it has to change in all three,
// or the same route starts being described two ways again. NOT changed:
// /vision-strategy-roadmap/'s Websites lane, which carries its own contextual
// line ("The lighter end...") written for that page's argument rather than the
// shared description.
// ---------------------------------------------------------------------
const LANES = {
  // ASCII SOURCE, TRADEMARK OUTPUT. /rates/ and the audit page carry a literal
  // U+2122 in this same string, which breaks the ASCII-only rule in CLAUDE.md.
  // The rule cannot be met with an HTML entity here: `heading` is typed `string`
  // and passes through `{paths.heading}`, so React escapes it and `&trade;`
  // would print as itself. A TypeScript unicode escape has neither problem --
  // the source file stays pure ASCII and the compiler emits the real glyph, so
  // this renders byte-identically to the other two headings.
  heading: "Explore chadworks\u2122 Services",
  items: [
    {
      label: "Websites",
      detail:
        "Website design and development services. A website is the one place you own on the internet. Make it yours.",
      href: "/websites/",
    },
    {
      label: "Visibility",
      detail:
        "Being found and chosen: in Google, in the AI assistants people now ask instead of Google, and in the inbox.",
      href: "/visibility/",
    },
    {
      label: "Essays",
      detail:
        "My transparent, no-fluff insight and perspective on web related topics.",
      href: "/essays/",
    },
    {
      label: "Rates",
      detail:
        "Read about my flat/per-project rate, my new by-the-minute billing format & rate and the reasoning behind them.",
      href: "/rates/",
    },
    {
      label: "About",
      detail:
        "chadworks is one person: Chad Lewine. Designing, developing and marketing for clients since 2011.",
      href: "/about/",
    },
  ],
};

// The inverted lane that closes the grid. Copy is the homepage's "not sure"
// card, verbatim, for the same reason the lane details above are lifted from
// /rates/: one card, one wording, wherever a reader meets it.
const LANES_CTA = {
  title: "Not sure what you need?",
  body: (
    <>
      Cut right to it and tell me your idea, situation or problem. I&apos;ll
      tell you what I&apos;d do for you.
    </>
  ),
  label: "Contact me",
  href: "#contact",
};

export default function ConsultingPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* THE HERO. Same shape as /ai-generated-website-audit/: the argument on
          the left, the ask in a dark panel on the right.

          reveal={false} because `.reveal` starts an element at opacity 0 and
          waits on an IntersectionObserver, which is the wrong contract for the
          first thing on the page. The entrance cascade on .eyebrow /
          .svc-prose / .svc-hero__cta animates it in instead.

          `full` is structural, not decoration. SectionShell's bg layer is
          `position: absolute; inset: 0` against the SECTION, and an absolutely
          positioned child of a grid container takes its GRID AREA as the
          containing block, so without the breakout the manifesto cloud is boxed
          inside the content rail with a white gutter either side of it. The
          bleed is granted on the grid axis by .cw-consult-hero > .cw-shell__bg.

          #consult-form is on the SECTION, not the form card: a CTA jump lands
          on the top of the hero, so the reader arrives at the whole ask rather
          than at a card floating mid-viewport with its section cut off above
          it. */}
      <SectionShell
        full
        className="svc-block cw-consult-hero"
        reveal={false}
        id="consult-form"
        bg={<ManifestoAmbient />}
      >
        <div className="cw-calc-intro cw-consult-intro">
          <div className="cw-calc-intro__lead">
            <p className="eyebrow">chadworks Service Lane 03</p>
            {/* text-gradient, NOT svc-fill: svc-fill is a scroll wipe driven by
                how far the heading has travelled up the viewport, so an h1 near
                the top of the page paints part-filled and holds its tail in
                grey. Every hero h1 on the site carries the static gradient.

                The h1 names the SERVICE and the h2 asks the reader's question
                (Chad, 2026-08-19). That order is also the right one for search:
                the page is about consulting, and "Need a second opinion" is a
                hook rather than a subject. No hard break here, unlike the line
                it replaced -- that one carried a <br> to keep the question mark
                off its own line, and this one reads fine wrapped. */}
            <h1 className="svc-block__heading text-gradient">
              Website &amp; Digital Marketing Consulting
            </h1>
            {/* .svc-block__subheading carries a negative top margin, written to
                pull a subheading up toward the heading above it, so the pair
                reads as one unit rather than as two stacked headings. */}
            <h2 className="svc-block__subheading">
              Need A Second Opinion On Your Digital Presence?
            </h2>
            <div className="svc-prose svc-prose--lead">
              <p>
                Sometimes what&apos;s wrong isn&apos;t the website. It&apos;s
                that nobody has sat down with you and worked out what the
                internet is supposed to be doing for your business, or in what
                order it should happen.
              </p>
              {/* .cw-glow-list is styled as `.svc-prose ul.cw-glow-list`, so it
                  has to stay INSIDE this .svc-prose block to pick up the
                  glyphs. Four bullets, the same count the audit hero runs. */}
              <ul className="cw-glow-list">
                <li>A working screenshare conversation/meeting</li>
                <li>Over 20 years of building and marketing on the web</li>
                <li>Billed at my published rate, by the minute</li>
                <li>Whatever comes out of it is yours to keep</li>
              </ul>
            </div>
            {/* On a phone the form stacks below this column, so the CTA is a
                fragment jump past it into the NEXT SECTION. On a desktop the
                form is already beside the headline and the button is a nudge
                rather than a necessity. Arrow points down because the target is
                below.

                It jumps to the aperture band, not down to the lanes (Chad,
                2026-08-19). The lanes are a router and the reader can already
                see they exist; the band is the argument, and skipping it would
                hand somebody who pressed "Learn more" a list of links instead of
                a reason. `.cw-aband` carries scroll-margin-top so the landing
                clears the sticky nav. */}
            <div className="svc-hero__cta">
              <a href="#what-it-sounds-like" className="svc-btn">
                <span className="svc-btn__label">Learn more</span>
                <ArrowRight down />
              </a>
            </div>
          </div>

          {/* THE ASK. The jump target is the section (see above); this id is
              only the handle the landing flash lights up. */}
          <div className="panel cw-fix-formcard" id="consult-form-card">
            {/* .cw-fix-formcard is REUSED, not cloned. The name comes from the
                audit page, but nothing in that CSS block is scoped to it: every
                rule reads `.cw-fix-formcard ...` on its own, and none of the
                `main:has(.cw-fix-hero)` page-local overrides touch the card.
                The dark panel on a light hero is structural rather than
                aesthetic: the LeadForm engine (.cw-form-field) is styled for
                dark bands only, so on a light surface the whole form renders as
                grey ghost labels over invisible boxes. */}
            <h3 className="cw-fix-formcard__title">Start the conversation</h3>
            <p className="cw-fix-formcard__blurb">
              Tell me what&apos;s going on in your own words. I&apos;ll write
              back with what I&apos;d do about it.
            </p>
            <LeadForm config={CONSULT_FORM} />
          </div>
          {/* Renders nothing. It makes the card flash once the scroll has
              actually landed, rather than the moment a link is pressed. */}
          <FormLandingFlash targetId="consult-form" flashId="consult-form-card" />
        </div>
      </SectionShell>

      {/* THE APERTURE BAND. Clay, so the register changes audibly the moment it
          comes up under the hero's pale cloud. The lead ends on a colon and the
          window finishes it; see the OPENERS note above for why the framing is
          about the sentence rather than about the reader. */}
      <ApertureBandCapsule
        variant="consult"
        id="what-it-sounds-like"
        eyebrow="Most of my consulting is listening"
        heading="What consulting with chadworks actually sounds like"
        lead="Nobody opens with a clean question. What comes out first is usually some version of:"
        payload={OPENERS}
        quoted
        spoken={OPENERS_SPOKEN}
        /* THE CUTOUT IS A REAL COLUMN, not a background layer (Chad,
           2026-08-19). /rates/ keeps its photo in the variant's ::after because
           it is a rectangular landscape photograph doing atmosphere. This is a
           cutout of a person, which is not atmosphere: it is who the
           conversation is with, so it holds a column. Intrinsic size is the
           file's own 880x1415, which reserves the box before the image lands
           and keeps the band from reflowing under the reader. */
        figure={{
          src: "/about/cutouts/chad_cutout_consulting_full.webp",
          alt: "Chad Lewine holding a laptop",
          width: 880,
          height: 1415,
        }}
        closeLabel="What I do with these"
        /* Chad's copy, verbatim (2026-08-19). Both plain strings: the quoted
           "Why?" that used to need a JSX fragment (so the &ldquo; entity would
           resolve instead of printing as itself) is gone from the sentence, so
           the fragment went with it. Restore that form, not a typed glyph, if a
           curly quote ever comes back here. */
        close={[
          "Each of these sentiments is rooted in a real, fixable issue that we'll get to the bottom of and go from there. Where we go with that answer might be one of my other services below.",
        ]}
      />

      {/* THE NAV LANES, closing on the inverted "not sure" card that carries a
          reader who could not pick one down to the contact band. Same svc-lanes
          chrome the homepage and both other lane hubs run. */}
      <PathsCapsule id="lanes" paths={LANES} autoSeal cta={LANES_CTA} />

      {/* THE GLOBAL CONTACT BAND. Owns id="contact", which is what the card
          above and the site header both point at. */}
      <MainContactCapsule />
    </PageComposer>
  );
}
