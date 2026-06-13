// Route: /rates/ -- standalone page. Value-based pricing with the math
// showing. Real numbers only ($315/hr, $3,200 floor, $6,200 typical, $550
// every 6 months for WordPress care). Signature moment (CWS-CREATIVE-ARSENAL):
// the glass price panel + scanning border + a show-the-math ledger. Copy in
// Chad's public voice, big-ticket posture (never apologize for the number).
// JSON-LD: WebPage + FAQPage + BreadcrumbList.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { CtaButton } from "@/components/ServiceTemplate";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageMotion } from "@/components/PageMotion";
import { GrainField } from "@/components/GrainField";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/forms";

const PAGE_URL = `${SITE_URL}/rates/`;
const TITLE = "Rates: What a chadworks Website Costs | chadworks";
const DESCRIPTION =
  "Work bills at $315 an hour. The smallest engagement is $3,200, and most websites land near $6,200. WordPress care runs $550 every 6 months. The real numbers, on the table before you decide, with the math showing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

// --- The show-the-math ledger: the real numbers, every one of them the same
// hourly rate times the hours the work honestly takes. ---
const LEDGER: { label: string; num: string; note: string }[] = [
  {
    label: "The rate everything bills from",
    num: "$315 / hour",
    note: "One rate for design, code, and the visibility work behind it. No mystery line items, no agency markup stacked on top.",
  },
  {
    label: "The floor: the smallest engagement",
    num: "$3,200",
    note: "Below this the project is too small to do at the standard, so this is where it starts. A focused site, built right, owned by you.",
  },
  {
    label: "Where most websites land",
    num: "~$6,200",
    note: "A full site built for speed, with the structure and schema that gets it found. This is the typical number, not a teaser that climbs once you are committed.",
  },
  {
    label: "WordPress care, ongoing",
    num: "$550 / 6 months",
    note: "Updates, backups, and a human watching the site for WordPress clients who want it maintained instead of left to drift.",
  },
];

// --- What the number actually buys (value framing, big-ticket posture). ---
const BUYS: { title: string; body: string }[] = [
  {
    title: "The person who writes the code",
    body: "You are paying for the builder directly, not a project manager relaying your notes to someone offshore. The email and the work come from the same desk.",
  },
  {
    title: "A site that is an asset, not a cost",
    body: "Structured and fast, built to get found in search and named by AI assistants. The kind of site that earns its number back instead of sitting there looking expensive.",
  },
  {
    title: "Honesty before the money moves",
    body: "When a cheaper path does the job, you hear it first. When a build will not pay for itself, you hear that too, before anyone spends.",
  },
  {
    title: "Everything in your name",
    body: "Code, hosting, accounts, working files. It is all yours from day one, so the value you bought never gets held hostage later.",
  },
];

// --- FAQ (rates-specific; feeds FAQPage JSON-LD). ---
const FAQS: { q: string; a: string }[] = [
  {
    q: "Why $315 an hour?",
    a: "Because it reflects twenty years of doing this and a result you can point to, not a rate set to undercut the next bid. One rate covers design, code, and the visibility work, so you are never guessing which specialist costs what. You are hiring one person who does all of it well.",
  },
  {
    q: "Can you do it cheaper?",
    a: "Not while keeping the standard, and I would rather say that here than after a proposal. There are plenty of cheaper options, and some of them are fine for a logo dropped onto a template. If the lowest number is the thing that decides it, then we are probably not the right fit for each other.",
  },
  {
    q: "What makes a project hit the $3,200 floor versus the $6,200 typical?",
    a: "Scope and structure. A floor project is focused: a clean, fast site that does one job well. The typical $6,200 build adds the depth that gets a business found, more pages with real structure, the schema and content that AI assistants read, and the polish that makes it read as credible. Both are the same hourly rate times honest hours.",
  },
  {
    q: "Is the price fixed before we start?",
    a: "You get a real number before any work begins, scoped to what you actually want. It is not a teaser that climbs once you are committed. If the scope changes mid-project, we talk about it before the number does, never after.",
  },
  {
    q: "What is the $550 every 6 months for?",
    a: "WordPress maintenance for clients who want their site cared for instead of left to drift: core and plugin updates, backups, and a human watching for the things that break quietly. It is optional. Custom-coded static sites need far less upkeep, which is part of why they cost less to own over time.",
  },
  {
    q: "Do you take payments over time?",
    a: "Projects are typically split into milestones, so you are paying against work delivered rather than all at once up front. Monthly website financing is not something chadworks offers anymore. The rates here are the whole picture.",
  },
];

const FORM: LeadFormConfig = {
  source: "rates page",
  subject: "New Inquiry from the Rates Page (chadworks)",
  submitLabel: "Send it to Chad",
  successMessage:
    "Got it. I read every one of these myself, and you'll hear back from me within a day with an honest read on the number.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    { kind: "text", name: "business", label: "Business Name", span: "half" },
    {
      kind: "textarea",
      name: "details",
      label: "What are you building, and what's the budget you have in mind?",
      required: true,
      rows: 4,
      placeholder: "The project, and roughly where you'd like the number to land.",
    },
    { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
  ],
};

// --- JSON-LD (GEO checklist 2): WebPage + FAQPage + 2-level BreadcrumbList. ---
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Rates",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: { "@type": "Organization", name: "chadworks", url: SITE_URL },
  // Real, public numbers as a price specification an engine can lift.
  mainEntity: {
    "@type": "Service",
    name: "Website design and development",
    provider: { "@type": "Organization", name: "chadworks", url: SITE_URL },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "315",
        priceCurrency: "USD",
        unitText: "HUR",
      },
      url: PAGE_URL,
      availability: "https://schema.org/InStock",
    },
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Rates", item: PAGE_URL },
  ],
};

export default function RatesPage() {
  return (
    <>
      <PageMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO -- the only H1. Answer-first: the real numbers in the first
          100 words so an engine can lift them. */}
      <section className="section svc-hero rates-hero">
        <nav className="svc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Rates</span>
        </nav>

        <p className="eyebrow">What this costs</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">Rates</span>
        </h1>
        <p className="svc-lede measure-prose">
          Work bills at $315 an hour. The smallest engagement is $3,200, and
          most websites land near $6,200. Those are the real numbers, on the
          table before we start, because you should get to see the math before
          you decide anything.
        </p>

        <div className="svc-hero__cta">
          <CtaButton href="/contact/" label="Get an honest read" />
        </div>
      </section>

      {/* SHOW THE MATH -- the glass price panel + the ledger. Scanning border
          comes from .svc-pricing__panel; the ledger lays the real numbers in
          aligned mono so the math is legible at a glance. */}
      <section className="section full scheme-alternate svc-block svc-pricing reveal">
        <h2 className="svc-block__heading svc-fill">The numbers, with the math showing</h2>
        <div className="svc-pricing__panel rates-panel">
          <div className="svc-pricing__price">$315 / hour</div>
          <div className="svc-pricing__price-sub">Everything bills from one rate</div>
          <p className="svc-pricing__copy">
            Every number below is that hourly rate times the hours the work
            honestly takes. Nothing is padded or buried, and no surprise line
            item waits for you at the end of the project.
          </p>

          <dl className="rates-ledger">
            {LEDGER.map((row) => (
              <div key={row.num} className="rates-ledger__row">
                <dt className="rates-ledger__label">{row.label}</dt>
                <dd className="rates-ledger__num">{row.num}</dd>
                <dd className="rates-ledger__note">{row.note}</dd>
              </div>
            ))}
          </dl>

          <p className="svc-pricing__disclaimer">
            <strong>One promise about the number:</strong>{" "}the quote you get is
            scoped to what you actually want, and it does not climb once you are
            committed. If the scope grows, we talk about it before the price
            does.
          </p>
          <CtaButton href="/contact/" label="Get a real number" />
        </div>
      </section>

      {/* WHAT THE NUMBER BUYS -- value framing, dark anchor. Big-ticket
          posture: lead with what the spend returns, never apologize for it. */}
      <section className="section full svc-block svc-dark reveal">
        <h2 className="svc-block__heading">What the number actually buys</h2>
        <ol className="svc-steps" style={{ "--svc-cols": 2 } as React.CSSProperties}>
          {BUYS.map((step, i) => (
            <li key={step.title} className="svc-step panel">
              <span className="svc-step__num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="svc-step__title">{step.title}</h3>
                <p className="svc-step__body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* QUALIFICATION -- big-ticket posture on the grain band. The honest
          disqualifier for price-shoppers, stated plainly. */}
      <section className="section full svc-block svc-qual-section reveal">
        <GrainField />
        <h2 className="svc-block__heading">Whether the number fits</h2>
        <div className="svc-qual">
          <div className="svc-qual__col svc-qual__col--fit panel">
            <p className="svc-qual__label">This is for you if</p>
            <ul className="svc-qual__list">
              <li>You read a website as an investment that should return, and you would rather it be built right than built cheap.</li>
              <li>You want the number on the table early, with the reasoning behind it, so you can decide with the full picture.</li>
            </ul>
          </div>
          <div className="svc-qual__col svc-qual__col--not panel">
            <p className="svc-qual__label">Probably not if</p>
            <ul className="svc-qual__list">
              <li>The lowest bid is the thing that decides it. I am not the cheapest, deliberately, and I would rather tell you that now than after a proposal.</li>
              <li>You need a template with a logo dropped in. That work exists, it costs less, and it is not what this rate is for.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ -- the accordion, light (a dark CTA follows, so this stays light
          to keep two inverted bands from stacking, rule 9). */}
      <section className="section full svc-block svc-faq-section reveal">
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <h2 className="svc-block__heading svc-fill">Questions about the money</h2>
            <p className="svc-faq__lead">
              The honest answers, including the ones most sites skip. If yours
              is not here, ask it directly and you will get the same straight
              read.
            </p>
          </div>
          <FaqAccordion items={FAQS.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      {/* CTA -- dark band, copy left, the page's own form right. */}
      <section className="section full band-dark svc-cta reveal">
        <div className="svc-cta__panel">
          <div className="svc-cta__split">
            <div>
              <h2 className="svc-cta__heading">Want a number for your project?</h2>
              <p className="svc-cta__body">
                Tell me what you are building and roughly where you would like
                the number to land. You will get an honest read from the person
                who would do the work, usually within a day.
              </p>
            </div>
            <LeadForm config={FORM} />
          </div>
        </div>
      </section>
    </>
  );
}
