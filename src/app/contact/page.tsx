// Route: /contact/ -- standalone page (4 of 4). The conversion hub: every
// other page's primary CTA points here. Email + form only (phone/booking is
// NEEDS-CHAD 3). Signature: the CF "colorburst" glow orbs on the dark band
// (ContactOrbs) behind the rslgo DualForm (quick <-> detailed). Forms post to
// /api/send via the LEIT pattern, delivered to chad@chadworks.co. Copy in
// Chad's public voice, real facts only. JSON-LD: ContactPage + BreadcrumbList.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/service";
import { PageComposer, HeroCapsule, ContactCapsule } from "@/components/capsules";
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
    "Got it, and thanks for the detail. I read every inquiry myself, and you'll hear back within a day with a straight answer on the number.",
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
    <PageComposer jsonLd={[breadcrumbJsonLd, contactPageJsonLd]}>
      <HeroCapsule
        className="contact-hero"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Get in touch"
        title="Contact"
        lede="Send a message and it reaches the person who would actually do the work, not a queue. You get a straight answer on whether it fits and what it would take, usually within a day."
      />
      <ContactCapsule
        scheme="inverted"
        heading="Tell me about the project"
        intro="Two ways in. Email me directly, or use the form: quick if you just want to start a conversation, detailed if you already know the shape of the build. Both land in the same inbox."
        emailLabel="Email directly"
        email={EMAIL}
        locationNote="Based in Pennsylvania, working with businesses across the country and beyond. The work is remote, so where you are has never decided whether it fits."
        quick={QUICK}
        detailed={DETAILED}
        quickLabel="Quick message"
        detailedLabel="Detailed inquiry"
      />
    </PageComposer>
  );
}
