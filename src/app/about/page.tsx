// Route: /about/ -- standalone page. The lifelong-builder narrative from
// CWS-SCOPE ("designing since age 11"), built from the called engines:
// statementTone band arc (era timeline), svc-proof panels, svc-steps,
// the made block, the GrainField qualification band, and the LeadForm CTA.
// Signature moment (CWS-CREATIVE-ARSENAL): TitleReveal -- art painted
// through the H1 letterforms by cursor trails. Copy in Chad's public
// voice; real facts only. JSON-LD: AboutPage + Person + BreadcrumbList.

import type { Metadata } from "next";
import { SITE_URL, ORG } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import {
  PageComposer,
  HeroCapsule,
  EraTimelineCapsule,
  ProofCapsule,
  AboutChadCapsule,
  TenetsCapsule,
  FitCapsule,
  MainContactCapsule,
} from "@/components/capsules";
import ManifestoSection from "@/components/ManifestoSection";
import { AboutHeroArt } from "@/components/art/AboutHeroArt";

const PAGE_PATH = "/about/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const TITLE = "About Chad: Designing Since Age 11 | chadworks";
const DESCRIPTION =
  "chadworks is one person: Chad, designing since age 11 and custom-building client websites since 2008. More than 50 client engagements since 2019, and the person you email is the person who writes the code. Not the cheapest, deliberately.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: isLaunched(PAGE_PATH), follow: true },
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
  name: "About Chad",
  url: PAGE_URL,
  description: DESCRIPTION,
  mainEntity: {
    "@type": "Person",
    name: "Chad",
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
const ERAS: { label: string; title?: string; text: string }[] = [
  {
    label: "1999",
    title: "Dialup era",
    text: "First personal computer. Playing computer games, using email and learning how the internet worked.",
  },
  {
    label: "2000",
    title: "ISDN era",
    text: "Building hobby sites with Dreamweaver and NetObjects. Learning the development side of the internet.",
  },
  {
    label: "2003",
    title: "DSL era",
    text: "First paying client at 12 years old under my first company name, *ChaddyD Creations*. Learning Photoshop and HTML/CSS via Xanga and MySpace.",
  },
  {
    label: "2008",
    title: "Broadband era",
    text: "Freelance work begins as my main source of income. I enroll in Art Institute of Pittsburgh, majoring in Web Design.",
  },
  {
    label: "2011",
    text: "Moved to Brooklyn for an agency job as an SEO. Lasted three months, then back to freelance. Learned a lot, but I'm not an employee.",
  },
  {
    label: "2012",
    text: "Rebranded as *CDL500*. Doubled down on WordPress. Dozens of keywords ranked on page 1 of Google. Gave a presentation at 2019 WordCamp NYC.",
  },
  {
    label: "2021",
    text: "Moved back to hometown in Greater Philadelphia, rebranded as *chadworks*.",
  },
  {
    label: "2026",
    text: "Refreshed *chadworks* brand as a vision-based creative firm, not a commodified web designer. Portfolio of over 250 personally serviced clients.",
  },
];

const PROOF: { label: string; href?: string; detail?: string }[] = [
  {
    label:
      "Built multi-million dollar manufacturing brand's first D2C and B2B e-commerce stores on Shopify.",
    href: "https://idesignhome.com/",
  },
  {
    label:
      "Dominated relevant keywords for 12-location early childhood enrichment franchise in NYC.",
    href: "https://ftkny.com/",
  },
  {
    label: "Ranked Brooklyn recording studio on page 1 of google",
    href: "https://douglassrecording.com/",
  },
  {
    label:
      "Gave a 'sold out' presentation at the official 2019 WordPress WordCamp conference in NYC.",
    href: "https://nyc.wordcamp.org/2019/session/seo-getting-all-green-in-yoast/",
  },
];

export default function AboutPage() {
  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, personJsonLd]}>
      {/* HERO -- the rising-chip stream runs miniature cutouts of Chad, the one
          spot on the site where the humor lands. */}
      <HeroCapsule
        className="about-hero"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="The Chad behind chadworks"
        title="About chadworks"
        heroArt={<AboutHeroArt />}
        lede="Hi, I'm Chad D.L., the Chad behind chadworks. Yep, just me. I've been building websites for over 20 years—since I was 11 years old, in fact. Web design is not just an occupation for me, it's a method by which information is communicated between parties, whether that's person to person, business to person, or business to business. I specialize in getting the information to and from the right places in a meaningful and visually stunning yet effective manner."
        cta={{ href: "/contact/", buttonLabel: "Start a conversation" }}
      />

      {/* THE MANIFESTO -- "who is chadworks for?", moved here from the homepage:
          the frosted panel over the Lyric-Transformer cloud, full bleed. */}
      <ManifestoSection />

      {/* THE STORY -- era timeline on the build-time band arc. */}
      <EraTimelineCapsule heading="chadworks historical timeline" eras={ERAS} />

      {/* PROOF -- concrete, linked, anonymized per the permission flags. */}
      <ProofCapsule proof={{ heading: "Notable Achievements", items: PROOF }} variant="achievements" />

      {/* THE TENETS -- moved here from /web-design/ (Chad, 2026-07-17): they
          describe how chadworks operates, not how a website gets designed.
          Placed immediately before the fit block on purpose: what I promise
          you, then who I promise it to. */}
      <TenetsCapsule />

      {/* ARE WE A GOOD FIT? -- the canonical fit block, shared with the
          homepage and service pages. Teases /are-we-a-good-fit/. */}
      <FitCapsule />

      {/* THE HUMAN -- the canonical "the Chad behind chadworks" block, shared
          with the homepage and service pages. */}
      <AboutChadCapsule />

      {/* CONTACT -- the canonical contact block, shared with the homepage. */}
      <MainContactCapsule />
    </PageComposer>
  );
}
