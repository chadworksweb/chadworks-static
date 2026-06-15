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
import {
  PageComposer,
  HeroCapsule,
  EraTimelineCapsule,
  ProofCapsule,
  ApproachCapsule,
  MadeByCapsule,
  QualificationCapsule,
  CtaCapsule,
} from "@/components/capsules";
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
      "I've used Shopify for a multi-million dollar manufacturing company, so my platform advice comes from that kind of scale.",
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
    body: "The person who answers the email is the person who built your site. No account manager or ticket queue stands between you and the work.",
  },
  {
    title: "Your wallet gets guarded",
    body: "If a free tool does the job, you'll hear it from me first. Mailchimp is free up to 500 contacts, and clients hear exactly that before anyone talks about spending.",
  },
  {
    title: "The no is part of the service",
    body: "When a build or a channel won't pay for itself, I say so before the money moves. A straight answer costs you nothing and saves you plenty.",
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
      placeholder: "What you're building, and where it's stuck today.",
    },
    { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
  ],
};

export default function AboutPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, personJsonLd]}>
      {/* HERO -- TitleReveal paints the brand color field through the
          letterforms as the cursor crosses them. */}
      <HeroCapsule
        className="about-hero"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="The person behind chadworks"
        title="Chad Lewine"
        titleReveal="/about/reveal-art.svg"
        lede="chadworks is one person. I'm Chad Lewine, designing since age 11 and custom-building websites for 20 years. There's no team behind a curtain and no account manager translating. The person you email is the person who writes the code."
        cta={{ href: "/contact/", buttonLabel: "Start a conversation" }}
      />

      {/* THE STORY -- era timeline on the build-time band arc. */}
      <EraTimelineCapsule heading="The story, era by era" eras={ERAS} />

      {/* PROOF -- concrete, linked, anonymized per the permission flags. */}
      <ProofCapsule proof={{ heading: "What twenty years looks like", items: PROOF }} />

      {/* HOW I WORK -- the working principles, dark anchor. */}
      <ApproachCapsule
        scheme="inverted"
        approach={{ heading: "How I work", steps: HOW }}
      />

      {/* MADE-BY -- the made block, about edition. */}
      <MadeByCapsule
        made={{
          eyebrow: "The human",
          heading: "It's me, your web guy.",
          img: "/people/chad-cutout.webp",
          imgAlt: "Chad Lewine, the person behind chadworks",
          captionMain: "Yes, this is the whole company.",
          captionSub: "(That's the point.)",
          intro:
            "Twenty years of building websites, and the part I'd never automate is this: when you email chadworks, you get me.",
          manifesto: [
            { lead: "Designing since age 11.", aside: "(Not a metaphor.)" },
            { lead: "HTML since 8th grade.", aside: "(Thanks, MySpace.)" },
            { lead: "Paid client builds since 2008.", aside: "(50+ engagements since 2019.)" },
            { lead: "Every site custom built.", aside: "(Including this one.)" },
          ],
          negation: [
            "No subcontractors.",
            "No offshore handoffs.",
            "No invented case studies.",
            "No pretending the process is polished when DNS won't propagate and dinner is late.",
          ],
          close:
            "The web has reinvented itself a dozen times since I started. The deal here never changed: you get the person, not a brand wrapper.",
          sig: "Chad Lewine",
          sigMeta: "chadworks (designing since age 11)",
        }}
      />

      {/* QUALIFICATION -- big-ticket posture on the grain band. */}
      <QualificationCapsule
        qualification={{
          heading: "Who I build for",
          fit: [
            "You want what you want, and you'd rather pay to have it built right than negotiate it down to almost.",
            "You see the site and the visibility behind it as an investment that should return, not a cost to shrink.",
          ],
          notFit: [
            "The lowest number decides. I'm not the cheapest, deliberately, and I'd rather say that here than after a proposal.",
            "You want a template with your logo dropped in. Plenty of builders do that, and I'm not one of them.",
          ],
        }}
        footer={
          <p className="about-qual-ps">
            The numbers themselves are public. The{" "}
            <Link href="/rates/">rates page</Link> lays them out in full, with the
            math showing.
          </p>
        }
      />

      {/* CTA -- dark band, copy left, the page's own form right. */}
      <CtaCapsule
        scheme="inverted"
        form={FORM}
        cta={{
          heading: "Tell me what you're building",
          body:
            "Whatever it is, you'll get a straight answer from the person who'd actually do the work, usually within a day.",
          buttonLabel: "",
          href: "/contact/",
        }}
      />
    </PageComposer>
  );
}
