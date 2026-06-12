// =====================================================================
// chadworks Static -- LANE HUB TEMPLATE
// The thin top page of a lane (/websites/, /visibility/): hero with the
// sitewide rising-chip stream, an answer-first lede, an optional thesis
// block, the asymmetric hover LANES out to every service in the lane, and
// the dark CTA with the hub's own form. CollectionPage + BreadcrumbList
// JSON-LD inline in the static HTML.
// =====================================================================

import Link from "next/link";
import type { ReactNode } from "react";
import { HeroArtStage } from "@/components/HeroArtStage";
import { PageMotion } from "@/components/PageMotion";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/forms";
import { SITE_URL, ORG } from "@/lib/service";

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
  lanesHeading: string;
  lanesIntro?: string;
  lanes: HubLane[];
  thesis?: { heading: string; subheading?: string; paragraphs: ReactNode[] };
  cta: { heading: string; body: string };
  form: LeadFormConfig;
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
    provider: { "@type": "Organization", name: ORG.name, url: ORG.url },
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

      {/* THESIS (optional) -- the lane's argument, before the routes. */}
      {hub.thesis && (
        <section className="section full svc-block svc-dark reveal">
          <h2 className="svc-block__heading">{hub.thesis.heading}</h2>
          {hub.thesis.subheading && (
            <h3 className="svc-block__subheading">{hub.thesis.subheading}</h3>
          )}
          {hub.thesis.paragraphs.map((p, i) => (
            <p key={i} className="svc-block__body measure-prose">{p}</p>
          ))}
        </section>
      )}

      {/* LANES -- every service in the lane as an asymmetric hover lane. */}
      <section className="section svc-block reveal">
        <h2 className="svc-block__heading">{hub.lanesHeading}</h2>
        {hub.lanesIntro && (
          <p className="svc-block__body measure-prose">{hub.lanesIntro}</p>
        )}
        <div className="svc-lanes">
          {hub.lanes.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="svc-lane"
              style={{ "--lane-color": LANE_COLORS[i % LANE_COLORS.length] } as React.CSSProperties}
            >
              <span className="svc-lane__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="svc-lane__content">
                <span className="svc-lane__title">{l.label}</span>
                <span className="svc-lane__desc">{l.detail}</span>
                <span className="svc-lane__arrow" aria-hidden="true">Explore -&gt;</span>
              </span>
              {l.viz && <span className="svc-lane__viz" aria-hidden="true">{l.viz}</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA -- dark band, copy left, the hub's form right. */}
      <section className="section full band-dark svc-cta reveal">
        <div className="svc-cta__panel">
          <div className="svc-cta__split">
            <div>
              <h2 className="svc-cta__heading">{hub.cta.heading}</h2>
              <p className="svc-cta__body">{hub.cta.body}</p>
            </div>
            <LeadForm config={hub.form} />
          </div>
        </div>
      </section>
    </>
  );
}
