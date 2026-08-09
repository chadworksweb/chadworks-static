// Route: /ai-generated-website-audit/ -- the Website Transformation Audit.
//
// THE SLUG IS A SERP CALL (Chad, 2026-08-08). The product is named the
// "Website Transformation Audit", but nobody types that into a search box: it
// is a chadworks coinage with no volume behind it. What people type is some
// form of "my AI generated website is bad / broken / looks wrong", so the URL
// takes the searchable phrase and the product name lives in the H1's subhead,
// the body and the price card. Both strings appear in the title tag, which is
// where the coinage earns its recognition without costing the page its query.
//
// THE PAGE SHAPE. Calculator-shaped, not service-template-shaped (Chad). The
// five service pages run through ServiceTemplate, which opens on a hero, walks
// key facts -> problem -> approach -> proof -> price and closes on a form at
// the very bottom. That order is wrong for this page: someone arriving here is
// already unhappy and already looking at the thing that is wrong, so the ask
// ("show me the site") has to be reachable before any argument is made. The
// form is therefore in the HERO, in the right column, the same slot the
// calculator page gives its table of contents. Everything below it is the
// argument for the reader who wants one first.
//
// WHY THE FORM ASKS FOR SO LITTLE. Name, email, phone (optional) and the URL.
// Nothing about budget, nothing about scope, no dropdown of situations. The
// deliverable of this form is the LINK: Chad can open the site himself and know
// more in two minutes than a qualification form would ever tell him. Every
// field beyond the link is a field that loses a lead. The longer, qualifying
// form still exists at the bottom of the page (MainContactCapsule) for anyone
// who wants to explain themselves.
//
// THE COPY IS CHAD'S, VERBATIM. The six symptom headings and the "Ford to
// Ferrari" line are his words as supplied, corrected only for capitalization
// and apostrophes. Do not reword them to fit the voice rules: those rules
// govern copy written here, not copy he hands over.
//
// THE ARGUMENT UNDER THE PAGE is the 2026-08-05 essay "AI-Generated Websites
// are Making UI and UX Expertise A Real Premium, Real Fast". The page states
// the conclusion and links to the essay rather than restating it, so the two
// cannot drift into saying different things about the same market.
//
// INDEXING IS DECIDED IN launch.ts, NOT HERE. The layout defaults to noindex
// and metadata.robots below reads isLaunched(), so adding this route to
// launch.ts is the whole switch. It is NOT in launch.ts yet: the page is built
// and sealed, awaiting Chad's go.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { ORG_ID, ref } from "@/lib/jsonld";
import { isLaunched } from "@/lib/launch";
import {
  PageComposer,
  SectionShell,
  AboutChadCapsule,
  FaqCapsule,
  MainContactCapsule,
  PathsCapsule,
  PriceCapsule,
  ProcessCapsule,
  QualificationCapsule,
  ArrowRight,
} from "@/components/capsules";
import ManifestoAmbient from "@/components/ManifestoAmbient";
// BEFORE/AFTER SLIDER -- PARKED (Chad, 2026-08-08). Built and working, held out
// of the page until there is a real comparison to put in it. Three pieces are
// commented out together and must be restored together: this import, the
// PLACEHOLDER_PAGES array below, and the <SectionShell id="before-after"> block
// in the render. Nothing else was changed to park it.
// import { DesignReveal, type RevealPage } from "@/components/art/DesignReveal";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/forms";
import {
  TRANSFORMATION_BAND,
  TRANSFORMATION_BAND_DASH,
  TRANSFORMATION_LOW,
  TRANSFORMATION_HIGH,
} from "@/lib/pricing";
import { money } from "@/lib/package-builder";

const PAGE_PATH = "/ai-generated-website-audit/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH.slice(1)}`;
const ESSAY_URL = "/essays/ai-gen-sites-making-ui-ux-a-premium/";

// The literal cleanup -> audit swap would have made this "AI Generated Website
// Audit | Website Transformation Audit", which says Audit twice in one title
// tag and wastes the half of it a SERP actually shows. The product name is
// carried by the body, the coverage heading and the price heading instead.
const TITLE = "AI Generated Website Audit | chadworks";
const DESCRIPTION =
  "Unhappy with your AI generated website? The chadworks Website Transformation Audit fixes what the model got wrong: the interface, the flows, and the features that should never have shipped.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // REQUIRED alongside the launch.ts entry. layout.tsx defaults every route to
  // noindex, so launching without this line lands the page in the sitemap while
  // it still serves noindex. Never hardcode `index: true`.
  robots: { index: isLaunched(PAGE_PATH), follow: true },
  openGraph: {
    title: "AI Generated Website Audit | chadworks",
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Generated Website Audit | chadworks",
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// --- JSON-LD: WebPage + BreadcrumbList, following the calculator and /rates/.
//
// No FAQPage, for the reason documented on the calculator: the only controlled
// test of schema's effect on AI citation measured negative-to-noise, and Google
// deprecated FAQ rich results for non-government, non-health sites in 2023. The
// question TEXT is what gets retrieved.
//
// The Offer carries the real band. Both ends read from the pricing hub, never a
// typed numeral, or price-audit fails the build.
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AI Generated Website Audit",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: ref(ORG_ID),
  author: {
    "@type": "Person",
    name: "Chad Lewine",
    url: `${SITE_URL}/about/`,
    jobTitle: "Web designer and developer",
    knowsAbout: [
      "User experience design",
      "User interface design",
      "AI generated websites",
      "Web development",
    ],
  },
  mainEntity: {
    "@type": "Service",
    name: "Website Transformation Audit",
    serviceType: "AI generated website audit",
    provider: ref(ORG_ID),
    areaServed: { "@type": "Country", name: "United States" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: String(TRANSFORMATION_LOW),
        maxPrice: String(TRANSFORMATION_HIGH),
        priceCurrency: "USD",
      },
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
    },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Websites", item: `${SITE_URL}/websites/` },
    { "@type": "ListItem", position: 3, name: "AI Generated Website Audit", item: PAGE_URL },
  ],
};

// ---------------------------------------------------------------------
// THE HERO FORM. Four fields, one of them optional, and the URL is the point.
//
// `url` kind renders a real type="url" input, which is what puts the keyboard
// on a phone into address mode. It is required; the phone is not. The LEIT
// endpoint takes whatever fields arrive, so the shape is free.
// ---------------------------------------------------------------------
const AUDIT_FORM: LeadFormConfig = {
  source: "ai-generated-website-audit hero",
  subject: "New Website Transformation Audit Inquiry (chadworks)",
  submitLabel: "Submit audit inquiry",
  successMessage:
    "Got it. I'll open your site myself and write back within a day with what I see.",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true, autocomplete: "name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    {
      kind: "url",
      name: "site_url",
      label: "Link to your site or app",
      required: true,
      autocomplete: "url",
      placeholder: "https://",
    },
    // ORDER IS LOAD-BEARING: phone then checkbox, adjacent, which is what lets
    // the CSS seat them on one row -- phone 3/4 LEFT, the rush box 1/4 RIGHT.
    // Reordering these two breaks the pairing. The submit button spans full
    // width on its own row below them. The checkbox is not required: it is a
    // request, not a condition of inquiring.
    {
      kind: "tel",
      name: "phone",
      label: "Phone (optional)",
      autocomplete: "tel",
    },
    { kind: "checkbox", name: "rush_24hr", label: "Request Rush" },
  ],
};

// ---------------------------------------------------------------------
// BEFORE/AFTER SLIDER -- PLACEHOLDER PAIRS.
//
// Dummy content, standing in until the real AI-generated-site comparison exists
// (Chad, 2026-08-08: "just fill it with dummy for now"). The images are the only
// before/after assets on disk; everything a reader can actually READ is generic,
// so the placeholder cannot be mistaken for a claim about a real client.
// ---------------------------------------------------------------------
// PARKED with the slider (see the import note at the top of the file).
// const PLACEHOLDER_PAGES: RevealPage[] = [
//   {
//     label: "Homepage",
//     url: "example.com",
//     before: "/design-reveal/rt-law_before.webp",
//     after: "/design-reveal/rt-law_after.webp",
//     beforeAlt: "Placeholder: a homepage before the transformation audit",
//     afterAlt: "Placeholder: the same homepage after the transformation audit",
//   },
//   {
//     label: "Interior page",
//     url: "example.com/about",
//     before: "/design-reveal/rt-law-person-before.webp",
//     after: "/design-reveal/rt-law-person-after.webp",
//     beforeAlt: "Placeholder: an interior page before the transformation audit",
//     afterAlt: "Placeholder: the same interior page after the transformation audit",
//   },
// ];

// ---------------------------------------------------------------------
// THE SYMPTOMS. Chad's six questions, verbatim, each with the answer to
// "yes, so what is actually wrong". Six cards, so the reader finds their own
// sentence in the grid rather than reading a paragraph about someone else.
// ---------------------------------------------------------------------
const SYMPTOMS: { q: string; body: string }[] = [
  {
    q: "Does your AI generated website suck?",
    // Chad's copy, verbatim (2026-08-08). Apostrophes are plain ASCII here on
    // purpose: this is a STRING rendered through {s.body}, not literal JSX text,
    // so React escapes it and the &apos; form would print as itself.
    body: "It works, it deployed and it loads, but it still feels wrong. What's missing is usually dozens of micro judgement calls that nobody made during the process of design and development. Models don't know what you want unless you tell them. If you don't tell them, they'll just make it up 'til you say it's done.",
  },
  {
    q: "Are you unhappy with your Claude generated website?",
    body: "Claude Code, Cursor, Lovable, v0, Replit, take your pick. They all produce the same shape of result: structurally correct, generically styled, and confidently wrong about what your visitor is there to do.",
  },
  {
    q: "Is your AI generated SaaS only kinda-sorta working?",
    body: "Usually it is not broken in the way you are looking for. The build runs, the tests pass, and users still fall out of the flow at the same step every time. Finding that step is a different skill than writing the step.",
  },
  {
    q: "Does your website do things you don't want it to?",
    body: "The account wall thirty seconds in. The modal on arrival. The feature you never asked for that the model added because it looked professional. Somebody has to decide what comes back out, and that decision is worth more than the code that put it in.",
  },
  {
    q: "Does your AI generated website look bad?",
    body: "Or worse, it looks like every other one. Visitors can now recognize a generated site on sight, and what they do with that recognition costs you something it did not cost a year ago.",
  },
  {
    q: "Do you want to improve your AI generated website?",
    body: "Then you are already past the hard part. You built the thing. What is left is the layer that was never in the prompt: how it reads, how it moves, and what it asks of the person using it.",
  },
];

// What the audit actually covers. Deliberately not three items and not a
// feature list: each row names something a model does not decide for you.
const COVERAGE: { label: string; detail: string }[] = [
  {
    label: "The first five seconds",
    detail:
      "What your visitor understands, and what they can do about it, before they have scrolled anything. Generated sites are reliably weakest here because a model optimizes the page it was asked for, not the arrival.",
  },
  {
    label: "The flows that matter",
    detail:
      "Signup, checkout, booking, contact, whatever your one important path is. Walked step by step, with every place it asks too much or explains too little written down.",
  },
  {
    label: "Features that should not be there",
    detail:
      "The lockouts, gates, popups and settings the model added on its own initiative. Removal is a deliverable here, not an afterthought.",
  },
  {
    label: "The interface itself",
    detail:
      "Type, spacing, hierarchy, color, motion. The layer that decides whether the same content reads as considered or as generated.",
  },
  {
    label: "The generated-site tells",
    detail:
      "The specific patterns that mark a site as machine-made to a 2026 visitor, named individually, with what to replace each one with.",
  },
  {
    label: "What it costs you today",
    detail:
      "Ranked. Not a list of everything wrong, a list of what to fix first and what you can safely leave alone.",
  },
];

const PROCESS_STEPS = [
  {
    title: "You send me the link",
    body: "The form above. Your site or app, and your name. No passwords, no repo access, no call to book first.",
  },
  {
    title: "I use it like your visitor does",
    body: "On a phone and on a desktop, cold, without you explaining it to me. Where I get confused is where they get confused, and confusion is the finding.",
  },
  {
    title: "I audit the interface and the flows",
    body: "Every screen and every path, documented as I go, with what is wrong and what it should be instead.",
  },
  {
    title: "You get the transformation document",
    body: "The findings ranked by what changes the most, written so you can hand it to whoever is doing the work, including your AI assistant.",
  },
  {
    title: "You decide who executes it",
    body: "Run it yourself, feed it to your coding agent, or have me build it. The document stands on its own either way.",
  },
];

export default function AiGeneratedWebsiteAuditPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, webPageJsonLd]}>
      {/* THE HERO, and the ask. Calculator-shaped: the argument on the left,
          a panel on the right, except the panel here is the form rather than a
          table of contents.

          reveal={false} for the reason HeroCapsule and the calculator hero
          both carry it: `.reveal` starts an element at opacity 0 and waits on
          an IntersectionObserver, which is the wrong contract for the first
          thing on the page. The entrance cascade on .eyebrow / .svc-prose /
          .svc-hero__cta animates it in instead. */}
      {/* `full` matters here and is not decoration. SectionShell's bg layer is
          `position: absolute; inset: 0` against the SECTION, so without the
          breakout the manifesto cloud is boxed inside the content rail with a
          white gutter either side of it, which is exactly how this shipped the
          first time (Chad, 2026-08-08: "full bleed where appropriate"). With
          `full` the section spans all three grid tracks, the cloud bleeds to
          both viewport edges, and .cw-calc-intro re-anchors itself back to the
          site-width rail because a `.full` child is itself a shell. */}
      <SectionShell
        full
        className="svc-block cw-fix-hero"
        reveal={false}
        bg={<ManifestoAmbient />}
      >
        <div className="cw-calc-intro cw-fix-intro">
          <div className="cw-calc-intro__lead">
            <p className="eyebrow">AI Generated Website Audit</p>
            {/* text-gradient, NOT svc-fill: svc-fill is a scroll wipe driven by
                how far the heading has travelled up the viewport, so an h1 near
                the top of the page paints part-filled and holds its tail in
                grey. Every hero h1 on the site carries the static gradient. */}
            {/* Hard break after "Your" (Chad, 2026-08-08). An explicit <br>
                rather than leaving it to text-wrap: balance, because balance
                optimises for even line lengths and puts "AI" on line one at
                this width. Balance still applies within each side of the
                break. */}
            <h1 className="svc-block__heading text-gradient">
              Unhappy With Your
              <br />
              AI Generated Website?
            </h1>
            <div className="svc-prose svc-prose--lead">
              {/* Chad's copy, verbatim (2026-08-08). Replaced the written-here
                  opening paragraph. Do not restructure it. */}
              <p>
                Have you launched a new website with the help of Claude or other
                AI coding assistants? Have you taken it as far as you can and
                still feel like it&apos;s missing something or not working
                properly? I can help with that.
              </p>
              {/* Chad's four bullets, verbatim (2026-08-08), on the site's
                  square/glow list. These REPLACED the two paragraphs that used
                  to sit here: the first bullet is the Ford to Ferrari line and
                  the second is the price, so keeping both forms would have said
                  each thing twice. The "send me the link" ask went with them,
                  because the form card beside this is titled exactly that.

                  .cw-glow-list is styled as `.svc-prose ul.cw-glow-list`, so it
                  has to stay INSIDE this .svc-prose block to pick up the glyphs.

                  The price is money(TRANSFORMATION_LOW), never typed: a literal
                  dollar figure here fails price-audit at deploy, and that check
                  reads comments too, so this note cannot spell one either. */}
              <ul className="cw-glow-list">
                <li>Take your AI generated website from Ford to Ferrari</li>
                <li>
                  AI website audits starting at {money(TRANSFORMATION_LOW)}
                </li>
                <li>+20 years of web design experience</li>
                <li>Delivered in 3 business days</li>
              </ul>
            </div>
            {/* On a phone the form stacks below this column, so the CTA is a
                fragment jump to it. On a desktop the form is already beside the
                headline and the button is a nudge rather than a necessity. */}
            {/* Hands off DOWN the page rather than across to the form (Chad,
                2026-08-08). #symptoms is the next section, and the form is
                already sitting beside this button on a desktop, so the useful
                job for the CTA is carrying a reader who is not ready to hand
                over a link into the argument for one. Same pattern as the
                audit service page's heroCta. Arrow points down because the
                target is below. */}
            <div className="svc-hero__cta">
              <a href="#symptoms" className="svc-btn">
                <span className="svc-btn__label">Explore the audit</span>
                <ArrowRight down />
              </a>
            </div>
          </div>

          {/* THE ASK. id lives on the panel, which is what the CTA above and
              the price card below both jump to. */}
          <div className="panel cw-fix-formcard" id="audit-form">
            {/* Chad's label (2026-08-08). An h3, not the <p> this was, so the
                form card announces itself as a real heading in the document
                outline and to a screen reader. .cw-fix-formcard__title carries
                the mono/uppercase treatment, so it renders identically. The CSS
                sets its own size and weight, which is what keeps an h3 here from
                competing with the h1 beside it. */}
            <h3 className="cw-fix-formcard__title">
              Apply for an AI-Gen Website Audit
            </h3>
            {/* Chad's copy, verbatim (2026-08-08). */}
            <p className="cw-fix-formcard__blurb">
              Send me the basics so I can take a look. I&apos;ll reply with a
              brief summary and a quote.
            </p>
            <LeadForm config={AUDIT_FORM} />
          </div>
        </div>
      </SectionShell>

      {/* THE BEFORE/AFTER SLIDER, second on the page (Chad, 2026-08-08). Same
          DesignReveal component /web-design/ and /website-redesign/ run, with
          its header copy overridden for this page.

          PLACEHOLDER CONTENT. The shots are the Rozario Touma pair, the only
          before/after assets on disk, reused so the mechanism can be seen
          working. The tab label, address and alt text are deliberately generic
          rather than naming that client: on THIS page a real firm's name beside
          "before" would read as a claim that their site was AI-generated and
          needed cleaning up, which is not true and is not ours to imply. Swap
          the whole PLACEHOLDER_PAGES array when the real pair exists; nothing
          else here needs to change. */}
      {/* PARKED with the slider (see the import note at the top of the file).
          Restore this block, the import and PLACEHOLDER_PAGES together.

          <SectionShell className="svc-block" id="before-after">
            <DesignReveal
              pages={PLACEHOLDER_PAGES}
              eyebrow="Drag to compare"
              heading="What the transformation actually looks like"
              lead="Placeholder shots for now. Grab the divider and drag."
            />
          </SectionShell>
      */}

      {/* THE SYMPTOMS. The reader's own sentence, in a grid, so they land on
          the one that is theirs instead of reading past a paragraph. */}
      <SectionShell className="svc-block" id="symptoms">
        {/* No eyebrow (Chad, 2026-08-08). Heading is his copy, verbatim. */}
        <h2 className="svc-block__heading svc-fill">
          Does your AI generated website suck? Get the audit.
        </h2>
        {/* Chad's copy, verbatim (2026-08-08). */}
        <div className="svc-prose svc-prose--lead">
          <p>
            If you find yourself relating to these situations, you might be
            suffering from a case of{" "}
            <strong>Generalized Generative Gloom</strong>. If so, you&apos;re
            not alone. I can help you go from gloom to bloom.
          </p>
        </div>
        <div className="cw-fix-symptoms">
          {SYMPTOMS.map((s) => (
            <div key={s.q} className="panel cw-fix-symptom">
              <h3 className="cw-fix-symptom__q">{s.q}</h3>
              <p className="cw-fix-symptom__a">{s.body}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* No pixel divider here. It was placed on this hinge and pulled the same
          day (Chad, 2026-08-08). The symptoms grid already hands off to the dark
          band's hard top edge, so the divider was a third transition between two
          that were doing the job. */}

      {/* WHY IT HAPPENS. The essay's conclusion, stated once, linked rather
          than restated so the two surfaces cannot drift. Dark band for weight,
          borrowing the FAQ section's shape the way the calculator page does. */}
      <SectionShell
        full
        className="svc-block svc-faq-section"
        trailingClassName="svc-faq-section--dark"
        id="why"
      >
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <p className="eyebrow">Why this keeps happening</p>
            <h2 className="svc-block__heading svc-fill">
              The model wrote the code. Nobody made the calls.
            </h2>
            <p className="svc-faq__lead">
              Design and development used to arrive bundled with human judgment,
              because the person writing the code was making those decisions
              while they wrote it. AI took the production half and left the
              judgment half sitting there unbought.
            </p>
          </div>
          {/* Plain .svc-prose: the dark band already recolors it
              (.svc-faq-section--dark .svc-prose), so no on-dark modifier is
              needed or exists. */}
          <div className="svc-prose cw-fix-why">
            <p>
              A generated site can be structurally correct and still fail. The
              account wall that fires thirty seconds in, the feature added
              because it reads as professional, the layout that resembles every
              other site launched that week: none of those are bugs. Every one
              of them is a decision, and the model made it on your behalf
              without telling you it had a choice.
            </p>
            <p>
              That is the whole job now. Not writing the site, deciding what the
              site should be. I wrote this out at length in{" "}
              <Link href={ESSAY_URL}>
                AI-Generated Websites are Making UI and UX Expertise A Real
                Premium, Real Fast
              </Link>
              , which is the argument this service came out of.
            </p>
            <p>
              With AI, anyone can build a Red Lobster. Most businesses did not
              want a chain restaurant.
            </p>
          </div>
        </div>
      </SectionShell>

      {/* WHAT THE AUDIT COVERS. Static HTML, six rows, liftable in one piece by
          an engine that will never scroll this page. */}
      <SectionShell className="svc-block" id="coverage">
        <p className="eyebrow">What gets audited</p>
        <h2 className="svc-block__heading svc-fill">
          What the Website Transformation Audit covers
        </h2>
        <div className="svc-prose svc-prose--lead">
          <p>
            Every one of these is something a model does not decide for you, and
            will not raise its hand about.
          </p>
        </div>
        <dl className="cw-fix-coverage">
          {COVERAGE.map((c) => (
            <div key={c.label} className="cw-fix-coverage__row">
              <dt className="cw-fix-coverage__label">{c.label}</dt>
              <dd className="cw-fix-coverage__detail">{c.detail}</dd>
            </div>
          ))}
        </dl>
      </SectionShell>

      {/* HOW IT RUNS. The global bold timeline, the same treatment
          /ai-visibility-audit/ and /web-design/ give their process. */}
      <ProcessCapsule
        pageName="audit"
        className="cw-process--nested"
        heading="How the transformation audit runs"
        steps={PROCESS_STEPS}
        scheme="inverted"
      />

      {/* THE PRICE. The "rates" variant, the same module /ai-visibility-audit/
          runs, with the band in place of a flat figure. Every numeral is a hub
          interpolation; a typed dollar amount here fails price-audit at
          deploy. */}
      <PriceCapsule
        price={{
          heading: "What does a Website Transformation Audit cost?",
          figure: TRANSFORMATION_BAND_DASH,
          body: `A Website Transformation Audit runs ${TRANSFORMATION_BAND}, quoted flat in writing before anything starts. Where yours lands depends on how many screens and flows there are to walk, not on how long it takes me.`,
          disclaimer: (
            <>
              <strong>Straight up:</strong>{" "}A large multi-screen SaaS, or an
              app behind a login with real user roles in it, is quoted on its
              own. I&apos;ll tell you that before you pay anything.
            </>
          ),
        }}
        ctaHref="#audit-form"
        ctaLabel="Send me your link"
        variant="rates"
        cardLabel="One time"
        // --band is the hook the widened card column keys off (see global.css).
        // The shared split grid sizes its card for a single figure, which a
        // range wraps into three lines inside.
        panelClassName="cw-price-card--center cw-price-card--band"
      />

      {/* WHO IT IS FOR -- the GLOBAL good-fit capsule (Chad, 2026-08-08), the
          periwinkle band with the regenerating channel-static grain, not the
          hand-rolled two-column split this shipped with.

          QualificationCapsule, not FitCapsule. They are the same capsule:
          FitCapsule is just QualificationCapsule preloaded with the canonical
          site-wide fit copy ("you want what you want", "strict low budget"),
          which is the right list for a page selling a BUILD and the wrong one
          here, where the qualifying question is whether you already generated
          something. The five service pages all do exactly this, feeding their
          own copy through the same capsule. The design is global; the copy is
          the page's. */}
      <QualificationCapsule
        qualification={{
          heading: "Are we a good fit?",
          fitLabel: "The audit is for you if:",
          notLabel: "Probably not if:",
          fit: [
            "You built it with Claude Code, Cursor, Lovable, v0, Replit or anything like them, and it shipped.",
            "It functions. Your problem is not a stack trace, it is the feeling you get looking at it.",
            "People land on it and leave, and your analytics will not tell you which decision lost them.",
            "You want to keep building it yourself and just need to know what to build.",
            "Someone told you it looks AI generated, and they were not wrong.",
            "You are about to spend real money promoting something that is not ready for the traffic.",
          ],
          notFit: [
            <>
              You do not have a site yet. Start with the{" "}
              <Link href="/website-design-cost-calculator/">
                website cost calculator
              </Link>
              , which scopes and prices a full custom build in about a minute.
            </>,
            "You want me to rebuild it from scratch rather than tell you what is wrong. That is a web design project, and a different conversation.",
            "You are looking for a free automated scan. Those exist, and they measure the things that are easy to measure.",
          ],
        }}
      />

      {/* THE QUESTIONS -- the GLOBAL FAQ capsule (Chad, 2026-08-08): the
          plum-to-navy band with the sticky intro column and the glass
          accordion, in place of the plain two-column Q&A run this shipped with.

          schemeAuto lets PageComposer's rule-9 pass demote this band to light if
          whatever ends up next to it is also inverted, so two darks can never
          stack no matter how the page order changes later.

          Still no FAQPage JSON-LD, for the reason the schema comment at the top
          of this file documents. The accordion ships every answer in the static
          HTML regardless of open state, so an engine reads all of it. */}
      <FaqCapsule
        pageName="Website Transformation Audit"
        heading="Questions about the transformation audit"
        faqLead="What people ask before they send me a link."
        scheme="inverted"
        schemeAuto
        faqs={[
          {
            q: "Do you rebuild my site, or just tell me what is wrong?",
            a: "The audit is the document. Building from it is separate work, and you are never required to buy it from me. Plenty of people take the document straight back to their own AI assistant and execute it themselves, which is a completely legitimate way to use it.",
          },
          {
            q: "Will you make fun of my vibe-coded site?",
            a: "No. I build with Claude Code every day and I have shipped things I later found embarrassing. The audit is written to be useful, not to be clever at your expense.",
          },
          {
            q: "Does this work on a SaaS app, not just a marketing site?",
            a: "Yes, and it is often where the audit pays for itself fastest, because a broken flow in an app costs you a customer rather than a pageview. Anything behind a login needs a demo account or a walkthrough from you, and a large one gets quoted separately.",
          },
          {
            q: "Do you need my code or my repo?",
            a: "Not for the audit. I work from the live site the way your visitors do, which is the whole point. If you hire me to execute the fixes afterward, that is when access comes up.",
          },
          {
            q: "How long does it take?",
            // 3 business days, matching the hero bullet. This said 7 calendar
            // days until Chad set the hero promise at 3 (2026-08-08); a page
            // that quotes two different turnarounds is a page that gets one of
            // them quoted back at it. One number, stated the same way in both
            // places.
            a: "Your document lands within 3 business days of the quote being accepted. Smaller sites are often faster than that.",
          },
          {
            q: "What if you look at it and it is actually fine?",
            a: "Then I tell you that before you pay me, and you go spend the money on something that will move your business instead. That has happened and I would rather it keep happening.",
          },
        ]}
      />

      {/* THE HUMAN. The shared founder block every other signed-off page closes
          on, placed here because this service is bought from a person rather
          than a process: the whole pitch is that a human eye looks at your
          thing. The caption speaks to that instead of the homepage's
          "yes, this is the whole company". */}
      <AboutChadCapsule
        captionMain="This is the eye you're buying."
        captionSub="(One person, looking at your site.)"
      />

      <PathsCapsule
        paths={{
          heading: "Explore chadworks™",
          items: [
            {
              label: "Web Design",
              detail:
                "If the audit turns into a rebuild, this is what that looks like.",
              href: "/web-design/",
            },
            {
              label: "Web Development",
              detail:
                "The build side: custom code, static architecture, and apps that hold up.",
              href: "/web-development/",
            },
            {
              label: "Website Cost Calculator",
              detail:
                "Starting over instead? Scope and price a full custom build yourself.",
              href: "/website-design-cost-calculator/",
            },
            {
              label: "Essays",
              detail:
                "The longer argument behind this page, and the rest of what I think about this market.",
              href: "/essays/",
            },
          ],
        }}
      />

      <MainContactCapsule heading="Rather explain it than link it?" />
    </PageComposer>
  );
}
