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
import type { LeadFormConfig } from "@/lib/forms";
import { MainContactCapsule } from "@/components/capsules";
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
          Sits directly under the hero on both hubs; the thesis follows it. */}
      <section className="section svc-block reveal">
        {hub.lanesHeading && (
          <h2 className="svc-block__heading">{hub.lanesHeading}</h2>
        )}
        {hub.lanesIntro && (
          <p className="svc-block__body measure-prose">{hub.lanesIntro}</p>
        )}
        <div className="svc-lanes">
          {(() => {
            const cards = hub.lanes.map((l, i) => {
              const style = {
                "--lane-color": LANE_COLORS[i % LANE_COLORS.length],
              } as React.CSSProperties;
              // A lane is locked when its TARGET IS NOT LAUNCHED, read from launch.ts.
              //
              // This was `i >= 2` -- "lanes 01 + 02 stay live, 03-08 are locked" -- which
              // was true of /websites/ when it was written and drifted the moment another
              // hub had a different number of live lanes. On /visibility/ it linked lane
              // 02 to /ai-visibility-audit/, which is sealed, while locking 06 and 07
              // whose pages have been launched and live for weeks (Chad, 2026-07-29:
              // "disable link / tooltip 02 03 04 and 05").
              //
              // Deriving it means a lane lights up the moment its page launches, can
              // never link to a sealed route, and no hub has to know its own position in
              // someone else's ordering. /websites/ is unaffected: its first two lanes
              // are the launched ones either way.
              const locked = !isLaunched(l.href);
              const inner = (
                <>
                  <span className="svc-lane__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="svc-lane__content">
                    <span className="svc-lane__title">{l.label}</span>
                    <span className="svc-lane__desc">{l.detail}</span>
                    {locked ? (
                      <span
                        className="svc-lane__arrow svc-lane__arrow--soon"
                        tabIndex={0}
                        aria-disabled="true"
                      >
                        Explore -&gt;
                        <span className="svc-lane__tip" role="tooltip">coming soon</span>
                      </span>
                    ) : (
                      <span className="svc-lane__arrow" aria-hidden="true">Explore -&gt;</span>
                    )}
                  </span>
                  {/* lane viz kept in each hub's config but no longer rendered */}
                </>
              );
              return locked ? (
                <div key={l.href} className="svc-lane svc-lane--soon" style={style}>
                  {inner}
                </div>
              ) : (
                <Link key={l.href} href={l.href} className="svc-lane" style={style}>
                  {inner}
                </Link>
              );
            });
            // Box 3: an inverted contact CTA that jumps to the contact form below.
            cards.splice(2, 0, (
              <a key="contact-cta" href="#contact" className="svc-lane svc-lane--cta">
                <span className="svc-lane__content">
                  <span className="svc-lane__title">Not sure which fits?</span>
                  <span className="svc-lane__desc">
                    Cut right to it and tell me your idea. I&apos;ll tell you what
                    I&apos;d do for you.
                  </span>
                  <span className="svc-lane__arrow" aria-hidden="true">Contact me -&gt;</span>
                </span>
              </a>
            ));
            return cards;
          })()}
        </div>
      </section>

      {/* THESIS (optional) -- the lane's argument, after the routes. */}
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

      {/* CTA -- the global contact capsule (same as the homepage close). */}
      <MainContactCapsule />
    </>
  );
}
