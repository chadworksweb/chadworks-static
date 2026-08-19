// =====================================================================
// chadworks Static -- LANE HUB TEMPLATE
// The thin top page of a lane (/websites/, /visibility/): hero with the
// sitewide rising-chip stream, an answer-first lede, an optional thesis
// block, the asymmetric hover LANES out to every service in the lane, and
// the dark CTA with the hub's own form. CollectionPage + BreadcrumbList
// JSON-LD inline in the static HTML.
// =====================================================================

import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import { HeroArtStage } from "@/components/HeroArtStage";
import { PageMotion } from "@/components/PageMotion";
import type { LeadFormConfig } from "@/lib/forms";
import { MainContactCapsule, PathsCapsule } from "@/components/capsules";
import { SITE_URL, ORG } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { ORG_ID, ref } from "@/lib/jsonld";

export interface HubLane {
  label: string;
  detail: string;
  href: string;
  viz?: ReactNode;
}

export interface HubConfig {
  slug: string;
  eyebrow: string;
  title: string;
  answer: ReactNode;
  heroArt?: ReactNode;
  lanesHeading?: string;
  // ReactNode so a hub's lane intro can carry an inline link. Rendered as a
  // single <p> above the lane grid.
  lanesIntro?: ReactNode;
  lanes: HubLane[];
  // A thesis body is paragraphs, with an optional mid-section h3 written as
  // { heading: "..." } wherever a break is wanted.
  thesis?: {
    heading: string;
    subheading?: string;
    paragraphs: ThesisBlock[];
  };
  cta: { heading: string; body: string };
  form: LeadFormConfig;
  // Rendered after the thesis and before the contact capsule -- a hub can
  // close with its own hand-off (e.g. /websites/ runs CalcCtaCapsule here).
  preContact?: ReactNode;
}

export type ThesisBlock = ReactNode | { heading: string };

function isThesisHeading(b: ThesisBlock): b is { heading: string } {
  return (
    typeof b === "object" && b !== null && !isValidElement(b) && "heading" in b
  );
}

const LANE_COLORS = ["#243989", "#8054bc", "#4a6b6e", "#d4a574"];

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function HubTemplate({ hub }: { hub: HubConfig }) {
  const url = `${SITE_URL}/${hub.slug}/`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: hub.title, item: url },
    ],
  };
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    url,
    provider: ref(ORG_ID),
    hasPart: hub.lanes.map((l) => ({
      "@type": "WebPage",
      name: l.label,
      url: `${SITE_URL}${l.href}`,
    })),
  };

  return (
    <>
      <PageMotion />
      <JsonLd data={breadcrumb} />
      <JsonLd data={collection} />

      {/* HERO -- same chrome as the service hero (line-for-line classes). */}
      <section className="section full svc-hero">
        {hub.heroArt && <HeroArtStage>{hub.heroArt}</HeroArtStage>}
        <nav className="svc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{hub.title}</span>
        </nav>
        <p className="eyebrow">{hub.eyebrow}</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">{hub.title}</span>
        </h1>
        <p className="svc-lede measure-prose">{hub.answer}</p>
      </section>

      {/* LANES -- every service in the lane as an asymmetric hover lane.
          Sits directly under the hero on both hubs; the thesis follows it.

          CAPSULIZED 2026-08-19 (Chad). This was ~70 lines of hand-rolled
          svc-lanes markup, the third copy of the same chrome on the site.
          Absorbing it surfaced three things this copy did that the others did
          not, all of which are now props rather than divergences:

            - the cta card is SPLICED AT INDEX 2, so contact is the third box
              rather than the last of seven or eight. That is `ctaAt`.
            - `locked = !isLaunched(l.href)` per lane, which is exactly what
              `autoSeal` does. Same behaviour, one implementation.
            - lane `viz` is deliberately NOT rendered here, though both hubs
              still carry viz entries in their config. The capsule renders viz
              when it is present, so the lanes are passed through with it
              stripped. Delete the strip to turn the illustrations back on.

          cw-lanes--tuck is the 15% top rhythm, kept so both hubs render exactly
          as they did before that stopped being a blanket rule (see the
          .cw-lanes--tuck note in global.css). Under a hero the tuck has an
          argument the other placements do not: the hero already pads 80px below
          itself. Drop it to take the full rhythm. */}
      <PathsCapsule
        topPad="tuck"
        autoSeal
        ctaAt={2}
        paths={{
          heading: hub.lanesHeading,
          intro: hub.lanesIntro,
          items: hub.lanes.map(({ viz: _viz, ...lane }) => lane),
        }}
        cta={{
          title: "Not sure what you need?",
          body: (
            <>
              Cut right to it and tell me your idea, situation or problem.
              I&apos;ll tell you what I&apos;d do for you.
            </>
          ),
          label: "Contact me",
          href: "#contact",
        }}
      />

      {/* THESIS (optional) -- the lane's argument, after the routes. */}
      {hub.thesis && (
        <section className="section full svc-block svc-dark reveal">
          <h2 className="svc-block__heading">{hub.thesis.heading}</h2>
          {hub.thesis.subheading && (
            <h3 className="svc-block__subheading svc-block__subheading--rule">
              {hub.thesis.subheading}
            </h3>
          )}
          {hub.thesis.paragraphs.map((p, i) =>
            isThesisHeading(p) ? (
              <h3
                key={i}
                className="svc-block__subheading svc-block__subheading--break svc-block__subheading--rule"
              >
                {p.heading}
              </h3>
            ) : (
              <p key={i} className="svc-block__body measure-prose">{p}</p>
            )
          )}
        </section>
      )}

      {hub.preContact}

      {/* CTA -- the global contact capsule (same as the homepage close). */}
      <MainContactCapsule />
    </>
  );
}
