// Route: /essays/ -- the essays index (CWS-EXPANSION-PLAN-01 item N). The body
// of published thinking that IS the evidence: authority is published, not
// case-studied. The manifesto stays standalone (/about/#manifesto) and this
// links to it as the charter piece. List is server-rendered from the static
// markdown files (src/lib/essays.ts), newest first, no DB. JSON-LD: Blog +
// ItemList + BreadcrumbList.
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { getAllEssays } from "@/lib/essays";
import { ref, PERSON_ID, blogNode } from "@/lib/jsonld";
import { PageComposer, HeroCapsule, SectionShell, MainContactCapsule } from "@/components/capsules";

const ROUTE = "/essays/";
const PAGE_URL = `${SITE_URL}${ROUTE}`;
const TITLE = "Essays: A Working Theory of the Web | chadworks";
const DESCRIPTION =
  "Short essays on what the web is and where it might be going, by Chad Lewine of chadworks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // layout.tsx defaults to noindex; launch.ts must also list ROUTE. Both or neither.
  robots: { index: isLaunched(ROUTE), follow: true },
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

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function EssaysIndexPage() {
  const essays = getAllEssays();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Essays", item: PAGE_URL },
    ],
  };

  // The SAME @id the individual essays point at with isPartOf, so the
  // collection is one entity across the site rather than two look-alikes.
  const blogJsonLd = {
    "@context": "https://schema.org",
    ...blogNode(),
    name: "chadworks Essays",
    description: DESCRIPTION,
    blogPost: essays.map((e) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/essays/${e.slug}/#article`,
      headline: e.title,
      url: `${SITE_URL}/essays/${e.slug}/`,
      datePublished: e.date || undefined,
      author: ref(PERSON_ID),
    })),
  };

  const itemListJsonLd = essays.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: essays.map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/essays/${e.slug}/`,
          name: e.title,
        })),
      }
    : null;

  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, blogJsonLd, itemListJsonLd]}>
      <HeroCapsule
        className="essays-hero"
        crumbs={[{ label: "Home", href: "/" }, { label: "Essays" }]}
        eyebrow="A working theory of the web"
        title="Essays"
        lede={
          <>
            The thinking behind chadworks. This ain&apos;t trendy&mdash;this is
            reality, transparency and hard hitting opinions where the internet,
            business and society converge. If you want the root of all of it,
            start with the{" "}
            <Link href="/about/#manifesto">chadworks manifesto</Link>.
          </>
        }
      />

      {/* Archive: two equal columns (1/2 - 1/2) of vertical cards. Each card =
          a featured image on top (1200x630 ratio) + minimal meta (date only),
          title, dek. chadworks branding. */}
      <SectionShell className="essays-archive">
        {essays.length === 0 ? (
          <p className="essays-archive__empty">The first essays are on their way.</p>
        ) : (
          <div className="essays-grid">
            {essays.map((e) => (
              <Link key={e.slug} href={`/essays/${e.slug}/`} className="essay-card">
                <div className="essay-card__art-wrap">
                  {e.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.image}
                      alt={e.imageAlt || e.title}
                      className="essay-card__art"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="essay-card__body">
                  {e.date && (
                    <time className="essay-card__date" dateTime={e.date}>
                      {formatDate(e.date)}
                    </time>
                  )}
                  <h2 className="essay-card__title">{e.title}</h2>
                  {e.dek && <p className="essay-card__dek">{e.dek}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionShell>

      <MainContactCapsule
        heading="Building something the web has not seen?"
        intro="If the thinking here fits how you see your own project, tell me about it. You will hear back from the person who would actually build it."
      />
    </PageComposer>
  );
}
