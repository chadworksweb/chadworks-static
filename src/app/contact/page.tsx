// Route: /contact/ -- standalone page (4 of 4). The conversion hub: every
// other page's primary CTA points here. Email + form only (phone/booking is
// NEEDS-CHAD 3). Signature: the CF "colorburst" glow orbs on the dark band
// (ContactOrbs) behind the rslgo DualForm (quick <-> detailed). Forms post to
// /api/send via the LEIT pattern, delivered to chad@chadworks.co. Copy in
// Chad's public voice, real facts only. JSON-LD: ContactPage + BreadcrumbList.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { DualForm } from "@/components/forms/DualForm";
import { ContactOrbs } from "@/components/art/ContactOrbs";
import { PageMotion } from "@/components/PageMotion";
import type { LeadFormConfig } from "@/lib/forms";

const PAGE_URL = `${SITE_URL}/contact/`;
const EMAIL = "chad@chadworks.co";
const TITLE = "Contact chadworks | Talk to the Person Who Builds It";
const DESCRIPTION =
  "Get in touch with chadworks. Email chad@chadworks.co or send the form, and it reaches Chad Lewine directly, the person who designs the site and writes the code. Honest read within a day.";

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

// --- Quick side: the smallest honest ask, for starting a conversation. ---
const QUICK: LeadFormConfig = {
  source: "contact page (quick)",
  subject: "New Quick Contact from the Contact Page (chadworks)",
  submitLabel: "Send it to Chad",
  successMessage:
    "Got it. This lands straight in my inbox and I read every one myself. You'll hear back within a day.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    {
      kind: "textarea",
      name: "message",
      label: "What's going on?",
      required: true,
      rows: 4,
      placeholder: "The business, and where it's stuck right now.",
    },
  ],
};

// --- Detailed side: for when the shape of the build is already known. ---
const DETAILED: LeadFormConfig = {
  source: "contact page (detailed)",
  subject: "New Detailed Inquiry from the Contact Page (chadworks)",
  submitLabel: "Send the details",
  successMessage:
    "Got it, and thanks for the detail. I read every inquiry myself, and you'll hear back within a day with an honest read on the number.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    { kind: "text", name: "business", label: "Business Name", span: "half" },
    {
      kind: "select",
      name: "budget",
      label: "Budget you have in mind",
      span: "full",
      options: [
        { value: "3200-6200", label: "Around $3,200 to $6,200" },
        { value: "6200-12000", label: "Around $6,200 to $12,000" },
        { value: "12000-plus", label: "$12,000 and up" },
        { value: "unsure", label: "Not sure yet, I want a read" },
      ],
    },
    {
      kind: "textarea",
      name: "details",
      label: "What are you building?",
      required: true,
      rows: 5,
      placeholder: "What the site needs to do, and where it's stuck today.",
    },
    { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
  ],
};

// --- JSON-LD (GEO checklist 2): ContactPage + 2-level BreadcrumbList. ---
const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact",
  url: PAGE_URL,
  description: DESCRIPTION,
  about: { "@type": "Organization", name: "chadworks", url: SITE_URL },
  mainEntity: {
    "@type": "Organization",
    name: "chadworks",
    url: SITE_URL,
    email: EMAIL,
    areaServed: "US",
    founder: { "@type": "Person", name: "Chad Lewine" },
    contactPoint: {
      "@type": "ContactPoint",
      email: EMAIL,
      contactType: "sales",
      availableLanguage: "English",
    },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Contact", item: PAGE_URL },
  ],
};

export default function ContactPage() {
  return (
    <>
      <PageMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />

      {/* HERO -- the only H1. Answer-first: what happens when you reach out. */}
      <section className="section svc-hero contact-hero">
        <nav className="svc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contact</span>
        </nav>

        <p className="eyebrow">Get in touch</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">Contact</span>
        </h1>
        <p className="svc-lede measure-prose">
          Send a message and it reaches the person who would actually do the
          work, not a queue. You get an honest read on whether it fits and what
          it would take, usually within a day.
        </p>
      </section>

      {/* CONTACT BAND -- dark, with the CF glow orbs behind. Reach-direct copy
          on the left, the rslgo dual form on the right. Only one dark section,
          so no rule-9 adjacency to manage. */}
      <section className="section full band-dark cw-contact reveal">
        <ContactOrbs />
        <div className="cw-contact__inner">
          <div className="cw-contact__layout">
            <div className="cw-contact__copy">
              <h2 className="svc-cta__heading">Tell me about the project</h2>
              <p className="cw-contact__note">
                Two ways in. Email me directly, or use the form: quick if you
                just want to start a conversation, detailed if you already know
                the shape of the build. Both land in the same inbox.
              </p>
              <div>
                <p className="cw-contact__email-label">Email directly</p>
                <a className="cw-contact__email" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </div>
              <p className="cw-contact__note">
                Based in Pennsylvania, working with businesses across the country
                and beyond. The work is remote, so where you are has never
                decided whether it fits.
              </p>
            </div>

            <DualForm
              quick={QUICK}
              detailed={DETAILED}
              quickLabel="Quick message"
              detailedLabel="Detailed inquiry"
            />
          </div>
        </div>
      </section>
    </>
  );
}
