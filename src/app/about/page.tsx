// Route: /about/ -- standalone page. The lifelong-builder narrative from
// CWS-SCOPE ("designing since age 11"), built from the called engines:
// statementTone band arc (era timeline), svc-proof panels, svc-steps,
// the made block, the GrainField qualification band, and the LeadForm CTA.
// Signature moment (CWS-CREATIVE-ARSENAL): TitleReveal -- art painted
// through the H1 letterforms by cursor trails. Copy in Chad's public
// voice; real facts only. JSON-LD: AboutPage + Person + BreadcrumbList.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, ORG } from "@/lib/service";
import { statementTone, CtaButton } from "@/components/ServiceTemplate";
import { TitleReveal } from "@/components/art/TitleReveal";
import { PageMotion } from "@/components/PageMotion";
import { GrainField } from "@/components/GrainField";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/forms";

const PAGE_URL = `${SITE_URL}/about/`;
const TITLE = "About Chad Lewine: Designing Since Age 11 | chadworks";
const DESCRIPTION =
  "chadworks is one person: Chad Lewine, designing since age 11 and custom-building client websites since 2008. More than 50 client engagements since 2019, and the person you email is the person who writes the code. Not the cheapest, deliberately.";

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

// --- JSON-LD (GEO checklist 2): AboutPage wrapping the Person entity, plus
// the two-level breadcrumb. Org identity stays consistent with layout.tsx. ---
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Chad Lewine",
  url: PAGE_URL,
  description: DESCRIPTION,
  mainEntity: {
    "@type": "Person",
    name: "Chad Lewine",
    url: PAGE_URL,
    image: `${SITE_URL}/people/chad-cutout.webp`,
    jobTitle: "Web designer and developer",
    description:
      "Founder of chadworks. Designing since age 11, custom-building client websites since 2008, with more than 50 client engagements since 2019.",
    knowsAbout: [
      "Web design",
      "Web development",
      "SEO",
      "AI visibility",
      "Ecommerce",
      "Email marketing",
    ],
    worksFor: { "@type": "Organization", name: ORG.name, url: ORG.url },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "About", item: PAGE_URL },
  ],
};

// The era timeline: each entry rides one statement band (the band-arc engine
// from ServiceTemplate, called here with era labels in the numeral slot).
const ERAS: { label: string; text: string }[] = [
  {
    label: "Age 11",
    text: "The designing started at age 11 and never stopped. Nobody picks a career at 11; this one kept showing up every day until it was one.",
  },
  {
    label: "8th grade",
    text: "Xanga and MySpace profile pages taught me HTML in 8th grade, one borrowed layout code at a time.",
  },
  {
    label: "ISDN",
    text: "Photoshop came next, learned over an ISDN line that turned every upload into a waiting game. Slow internet teaches you to get it right before you hit send.",
  },
  {
    label: "2008",
    text: "Client work began in 2008. Real businesses with real deadlines, and the lesson that a website only matters if it does its job.",
  },
  {
    label: "2019-2025",
    text: "The archive from 2019 through 2025 alone holds 50+ client engagements, sitting on top of the decade that came before them.",
  },
  {
    label: "Now",
    text: "AI lifted the ceiling. Visions that used to need an agency budget and a full team now get custom built at this desk, which is why the work is fun again.",
  },
];

const PROOF: { label: string; href: string; detail: string }[] = [
  {
    label: "Shopify at multi-million volume",
    href: "/shopify/",
    detail:
      "I've used Shopify for a multi-million dollar manufacturing company. When I talk platforms, that's the scale the advice comes from.",
  },
  {
    label: "A law firm inside Google's AI Overview",
    href: "/ai-viz/",
    detail:
      "A Pennsylvania criminal-defense firm I work with appears in Google's AI Overview for its practice area, with page one of classic search underneath it.",
  },
  {
    label: "Page one in a brutal market",
    href: "/seo/",
    detail:
      "A Brooklyn psychologist ranks page one for the phrase locals type when they look for a therapist in his neighborhood, and AI assistants now name him too.",
  },
  {
    label: "This site is the resume",
    href: "/custom-coded-static/",
    detail:
      "chadworks.co is a custom-coded static site: the same fast, schema-heavy build I sell, doing its own job in public.",
  },
];

const HOW: { title: string; body: string }[] = [
  {
    title: "You talk to the builder",
    body: "The person who answers the email is the person who built your site. No account managers and no ticket queue between us.",
  },
  {
    title: "Your wallet gets guarded",
    body: "If a free tool does the job, you'll hear it from me first. Mailchimp is free up to 500 contacts, and clients hear exactly that before anyone talks about spending.",
  },
  {
    title: "The no is part of the service",
    body: "When a build or a channel won't pay for itself, I say so before the money moves. An honest read costs you nothing and saves you plenty.",
  },
  {
    title: "You own every piece",
    body: "Code, hosting, accounts, working files. Everything is yours from day one, and nothing ever gets held hostage.",
  },
];

const FORM: LeadFormConfig = {
  source: "about page",
  subject: "New Inquiry from the About Page (chadworks)",
  submitLabel: "Send it to Chad",
  successMessage:
    "Got it. I read every one of these myself, and you'll hear back from me within a day.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    { kind: "text", name: "business", label: "Business Name", span: "half" },
    {
      kind: "textarea",
      name: "details",
      label: "What are you building?",
      required: true,
      rows: 4,
      placeholder: "The business, the vision, and where it's stuck.",
    },
    { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <PageMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* HERO -- the only H1. TitleReveal paints the brand color field
          through the letterforms as the cursor crosses them. */}
      <section className="section svc-hero about-hero">
        <nav className="svc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">About</span>
        </nav>

        <p className="eyebrow">The person behind chadworks</p>
        <TitleReveal artImageUrl="/about/reveal-art.svg">
          <h1 className="svc-hero__title">
            <span className="text-gradient">Chad Lewine</span>
          </h1>
        </TitleReveal>
        {/* Answer-first: quotable in the first 100 words. */}
        <p className="svc-lede measure-prose">
          chadworks is one person. I&apos;m Chad Lewine, designing since age 11
          and custom-building client websites for 20 years. There&apos;s no
          team behind a curtain and no account manager translating. The person
          you email is the person who writes the code.
        </p>

        <div className="svc-hero__cta">
          <CtaButton href="/contact/" label="Start a conversation" />
        </div>
      </section>

      {/* THE STORY -- era timeline on the statement-band arc (the engine is
          called from ServiceTemplate; era labels ride the numeral slot). */}
      <section className="section full svc-statements-intro reveal">
        <h2 className="svc-statements__heading">The story, era by era</h2>
      </section>
      {ERAS.map((era, i) => {
        const tone = statementTone(i, ERAS.length);
        return (
          <section
            key={era.label}
            className={`section full svc-statement about-era reveal${tone.onDark ? " svc-statement--ondark" : ""}`}
            style={{ background: tone.bg, color: tone.onDark ? "var(--dark-text)" : undefined }}
          >
            <div className="svc-statement__row">
              <span className="svc-statement__num" aria-hidden="true">
                {era.label}
              </span>
              <p className="svc-statement__text">{era.text}</p>
            </div>
          </section>
        );
      })}

      {/* PROOF -- concrete, linked, anonymized per the permission flags. */}
      <section className="section svc-block reveal">
        <h2 className="svc-block__heading svc-fill">What twenty years looks like</h2>
        <ul className="svc-proof" style={{ "--svc-proof-cols": 2 } as React.CSSProperties}>
          {PROOF.map((item) => (
            <li key={item.href} className="svc-proof__item panel">
              <p className="svc-proof__label">
                <Link href={item.href} className="svc-proof__link">
                  {item.label}
                </Link>
              </p>
              <p className="svc-proof__detail">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW I WORK -- the working principles, dark anchor. */}
      <section className="section full svc-block svc-dark reveal">
        <h2 className="svc-block__heading">How I work</h2>
        <ol className="svc-steps" style={{ "--svc-cols": 2 } as React.CSSProperties}>
          {HOW.map((step, i) => (
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

      {/* MADE-BY -- the made block, about edition. */}
      <section className="section svc-block svc-made reveal">
        <p className="eyebrow">The human</p>
        <h2 className="svc-block__heading svc-made__heading">It&apos;s me, your web guy.</h2>
        <div className="svc-made__grid">
          <div className="svc-made__photo">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
            <img src="/people/chad-cutout.webp" alt="Chad Lewine, the person behind chadworks" loading="lazy" />
            <div className="svc-made__caption">
              <span className="svc-made__caption-main">Yes, this is the whole company.</span>
              <span className="svc-made__caption-sub">(That&apos;s the point.)</span>
            </div>
          </div>
          <div className="svc-made__copy">
            <p className="svc-made__intro">
              Twenty years of client work, and the part I&apos;d never automate
              is this: when you email chadworks, you get me.
            </p>
            <ul className="svc-made__manifesto">
              <li>
                Designing since age 11. <span className="svc-made__aside">(Not a metaphor.)</span>
              </li>
              <li>
                HTML since 8th grade. <span className="svc-made__aside">(Thanks, MySpace.)</span>
              </li>
              <li>
                Paid client builds since 2008. <span className="svc-made__aside">(50+ engagements since 2019.)</span>
              </li>
              <li>
                Every site custom built. <span className="svc-made__aside">(Including this one.)</span>
              </li>
            </ul>
            <ul className="svc-made__negation">
              <li><span className="svc-made__x" aria-hidden="true">&times;</span>No subcontractors.</li>
              <li><span className="svc-made__x" aria-hidden="true">&times;</span>No offshore handoffs.</li>
              <li><span className="svc-made__x" aria-hidden="true">&times;</span>No invented case studies.</li>
              <li><span className="svc-made__x" aria-hidden="true">&times;</span>No pretending the process is polished when DNS won&apos;t propagate and dinner is late.</li>
            </ul>
            <p className="svc-made__close">
              The web has reinvented itself a dozen times since I started. The
              deal here never changed: you get the person, not a brand wrapper.
            </p>
            <p className="svc-made__sig">
              Chad Lewine
              <span className="svc-made__sig-meta">chadworks (designing since age 11)</span>
            </p>
          </div>
        </div>
      </section>

      {/* QUALIFICATION -- big-ticket posture on the grain band. */}
      <section className="section full svc-block svc-qual-section reveal">
        <GrainField />
        <h2 className="svc-block__heading">Who I build for</h2>
        <div className="svc-qual">
          <div className="svc-qual__col svc-qual__col--fit panel">
            <p className="svc-qual__label">This is for you if</p>
            <ul className="svc-qual__list">
              <li>You want what you want, and you&apos;d rather pay to have it built right than negotiate it down to almost.</li>
              <li>You see the site and the visibility behind it as an investment that should return, not a cost to shrink.</li>
            </ul>
          </div>
          <div className="svc-qual__col svc-qual__col--not panel">
            <p className="svc-qual__label">Probably not if</p>
            <ul className="svc-qual__list">
              <li>The lowest number decides. I&apos;m not the cheapest, deliberately, and I&apos;d rather say that here than after a proposal.</li>
              <li>You want a template with your logo dropped in. Plenty of builders do that, and I&apos;m not one of them.</li>
            </ul>
          </div>
        </div>
        <p className="about-qual-ps">
          The numbers themselves are public. They live on the{" "}
          <Link href="/rates/">rates page</Link>.
        </p>
      </section>

      {/* CTA -- dark band, copy left, the page's own form right. */}
      <section className="section full band-dark svc-cta reveal">
        <div className="svc-cta__panel">
          <div className="svc-cta__split">
            <div>
              <h2 className="svc-cta__heading">Tell me what you&apos;re building</h2>
              <p className="svc-cta__body">
                Whatever it is, you&apos;ll get an honest read from the person
                who&apos;d actually do the work, usually within a day.
              </p>
            </div>
            <LeadForm config={FORM} />
          </div>
        </div>
      </section>
    </>
  );
}
