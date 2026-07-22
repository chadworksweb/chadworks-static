// Route: /essays/<slug>/ -- one essay. The reading surface ported from
// chadlewine's EntryDetail, rebuilt on chadworks tokens and fed by a static
// markdown file (see src/lib/essays.ts), no DB. The body is Chad's prose,
// authored in Google Docs and pasted as markdown; AI writes none of it
// (CWS-EXPANSION-PLAN-01 item N). JSON-LD: Article + BreadcrumbList.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { getAllEssays, getEssay, getEssaySlugs } from "@/lib/essays";
import { ref, PERSON_ID, ORG_ID, BLOG_ID, blogNode } from "@/lib/jsonld";
import { PageComposer, SectionShell, MainContactCapsule } from "@/components/capsules";
import { AgencyThreadEmbed } from "@/components/essays/AgencyThreadEmbed";

// EMBEDS -- an essay body can drop a component into the prose by putting the
// token on its own line. Markdown wraps a bare line in <p>, so that is what we
// split the rendered HTML on.
const VOICEBOX_TOKEN = "<p>{{voicebox}}</p>";

// Static export: prerender every essay at build time.
export function generateStaticParams() {
  return getEssaySlugs().map((slug) => ({ slug }));
}

// Readable date without pulling a formatting lib. Parsed as UTC noon so the
// calendar day never shifts across timezones.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay) return {};
  const url = `${SITE_URL}/essays/${slug}/`;
  const description = essay.description || essay.dek;
  return {
    title: `${essay.title} | chadworks`,
    description,
    alternates: { canonical: url },
    // layout.tsx defaults every route to noindex; the collection launch lights
    // the essays. Both this and the launch.ts entry are required.
    robots: {
      index: isLaunched("/essays/"),
      follow: true,
      // Let search + AI surfaces quote the essay at length and show the art.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    authors: [{ name: "Chad Lewine", url: `${SITE_URL}/about/` }],
    ...(essay.topics?.length ? { keywords: essay.topics } : {}),
    openGraph: {
      title: essay.title,
      description,
      url,
      type: "article",
      siteName: "chadworks",
      locale: "en_US",
      publishedTime: essay.date || undefined,
      modifiedTime: essay.updated || essay.date || undefined,
      authors: ["Chad Lewine"],
      section: essay.section || "Essays",
      ...(essay.topics?.length ? { tags: essay.topics } : {}),
      images: [
        {
          url: essay.image || "/og-default.png",
          width: 1200,
          height: 630,
          alt: essay.imageAlt || essay.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: essay.title,
      description,
      images: [essay.image || "/og-default.png"],
    },
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay) notFound();

  const url = `${SITE_URL}/essays/${slug}/`;
  // Prose either side of the {{voicebox}} token; the token itself becomes the
  // full-width thread band between them. The token is OPT-IN per essay (only
  // the agency-ripoff piece carries it), so the default shape is one shell with
  // no band -- see hasBand below.
  const segments = essay.bodyHtml.split(VOICEBOX_TOKEN);
  const hasBand = segments.length > 1;

  // Sibling essays for the Keep reading block: newest first, this one removed.
  // Two, so the block stays a pointer rather than a second archive page.
  const related = getAllEssays()
    .filter((other) => other.slug !== slug)
    .slice(0, 2);

  // BlogPosting (the specific Article subtype for a dated essay in a
  // collection). Author/publisher are @id REFERENCES into the site graph
  // declared in src/lib/jsonld.ts -- never inline copies. `speakable` marks the
  // title + dek as the read-aloud/extractable summary for assistants.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: essay.title,
    name: essay.title,
    description: essay.description || essay.dek,
    url,
    datePublished: essay.date || undefined,
    dateModified: essay.updated || essay.date || undefined,
    author: ref(PERSON_ID),
    publisher: ref(ORG_ID),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: ref(BLOG_ID),
    inLanguage: "en-US",
    articleSection: essay.section || "Essays",
    ...(essay.topics?.length
      ? {
          keywords: essay.topics.join(", "),
          about: essay.topics.map((t) => ({ "@type": "Thing", name: t })),
        }
      : {}),
    ...(essay.wordCount ? { wordCount: essay.wordCount } : {}),
    // GEO: give the answer engines the prose itself, not only a pointer to it.
    // `abstract` is the quotable summary, `articleBody` the full text, so an
    // assistant that reads the JSON-LD and never renders the page still has
    // something accurate to quote. These essays are ~400 words, so the
    // duplication costs nothing meaningful in page weight.
    abstract: essay.description || essay.dek,
    ...(essay.bodyText ? { articleBody: essay.bodyText } : {}),
    // No paywall, no signup. Stated rather than implied, because crawlers
    // treat the absence of this as unknown rather than as free.
    isAccessibleForFree: true,
    ...(essay.image
      ? {
          image: {
            "@type": "ImageObject",
            url: `${SITE_URL}${essay.image}`,
            width: 1200,
            height: 630,
            ...(essay.imageAlt ? { description: essay.imageAlt } : {}),
          },
        }
      : {}),
    // The read-aloud / extractable summary. The takeaways block joins the title
    // and dek here when an essay has one: those are the sentences written to be
    // lifted whole, so they are exactly what belongs in speakable.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        ".essay-head__title",
        ".essay-head__dek",
        ...(essay.takeaways?.length ? [".essay-takeaways__list"] : []),
      ],
    },
  };

  // The collection node the essay belongs to, so isPartOf resolves.
  const blogJsonLd = { "@context": "https://schema.org", ...blogNode() };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Essays", item: `${SITE_URL}/essays/` },
      { "@type": "ListItem", position: 3, name: essay.title, item: url },
    ],
  };

  // The bio + footer that close every essay. Rendered inside whichever shell is
  // LAST: the tail shell when a band split the page, otherwise the only shell.
  // Opening a second shell just to hold these would stack two lots of section
  // padding with nothing between them.
  const essayClose = (
    <>
      {/* AUTHOR BIO -- the visible half of the Person entity in the JSON-LD.
          E-E-A-T has to be readable on the page, not only in the schema, so the
          byline up top and this box down here are the pair that back the author
          claim. Copy is the site's own About line, not a second version of it. */}
      <aside className="essay-bio">
        {/* The facet is on the FRAME so the photo inside can be zoomed
            without scaling the hexagon with it. */}
        <span className="essay-bio__facet">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="essay-bio__portrait"
            src="/people/chad-essay-bio.jpg"
            alt="Chad Lewine, founder of chadworks"
            loading="lazy"
            decoding="async"
            width={480}
            height={480}
          />
        </span>
        <div className="essay-bio__body">
          <p className="essay-bio__kicker">Written by</p>
          <p className="essay-bio__name">
            <Link href="/about/" rel="author">
              Chad Lewine
            </Link>
          </p>
          <p className="essay-bio__text">
            chadworks is one person: Chad, designing since age 11 and
            custom-building client websites since 2008. More than 50 client
            engagements since 2019, and the person you email is the person who
            writes the code. Not the cheapest, deliberately.
          </p>
        </div>
      </aside>

      {/* GEO: an essay that links nowhere is a dead end for a crawler and an
          orphan in the entity graph. These are real links with real titles, so
          the next piece is reachable in one hop from any essay. */}
      {related.length > 0 && (
        <nav className="essay-more" aria-labelledby="related-posts">
          <h2 className="essay-more__kicker" id="related-posts">
            Related posts
          </h2>
          <ul className="essay-more__list">
            {related.map((other) => (
              <li key={other.slug} className="essay-more__item">
                <Link href={`/essays/${other.slug}/`}>{other.title}</Link>
                {other.dek && <p className="essay-more__dek">{other.dek}</p>}
              </li>
            ))}
          </ul>
        </nav>
      )}

      <footer className="essay-foot essay-foot--tail">
        {/* Freshness signal leads the row, per the AEO rule -- mirrors the
            dateModified in the BlogPosting node above. */}
        {(essay.updated || essay.date) && (
          <p className="essay-foot__updated">
            Last updated:{" "}
            <time dateTime={essay.updated || essay.date}>
              {formatDate(essay.updated || essay.date)}
            </time>
          </p>
        )}
        <span className="essay-foot__divider" aria-hidden="true">
          <span className="essay-foot__pip" />
          <span className="essay-foot__pip" />
          <span className="essay-foot__pip" />
          <span className="essay-foot__pip" />
          <span className="essay-foot__pip" />
        </span>
        <Link href="/essays/" className="essay-foot__back">
          View all essays
        </Link>
      </footer>
    </>
  );

  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, articleJsonLd, blogJsonLd]}>
      <SectionShell className="essay-article">
        <article className="essay-wrap">
          <header className="essay-head">
            <p className="essay-head__eyebrow">
              <Link href="/essays/">Essays</Link>
              {essay.date && (
                <>
                  <span aria-hidden="true"> / </span>
                  <time dateTime={essay.date}>{formatDate(essay.date)}</time>
                </>
              )}
            </p>
            <h1 className="essay-head__title">
              <span className="text-gradient">{essay.title}</span>
            </h1>
            {essay.dek && <p className="essay-head__dek">{essay.dek}</p>}
            {/* Visible byline: the E-E-A-T signal has to be ON the page, not
                only in the JSON-LD (the schema claims an author, so the page
                must show one). rel="author" ties it to the Person node. */}
            <p className="essay-head__byline">
              By{" "}
              <Link href="/about/" rel="author">
                Chad Lewine
              </Link>
            </p>
          </header>

          {/* GEO: the claims as standalone sentences, above the prose. An
              answer engine that quotes one of these does not need the paragraph
              around it for the sentence to still be true and attributable. */}
          {essay.takeaways?.length ? (
            <aside className="essay-takeaways" aria-labelledby="key-takeaways">
              <h2 className="essay-takeaways__kicker" id="key-takeaways">
                Key takeaways
              </h2>
              <ul className="essay-takeaways__list">
                {essay.takeaways.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </aside>
          ) : null}

          {segments[0] && (
            <div
              className="essay-prose"
              dangerouslySetInnerHTML={{ __html: segments[0] }}
            />
          )}

          {/* No band: this is the only shell, so it closes the essay too. */}
          {!hasBand && essayClose}
        </article>
      </SectionShell>

      {/* BAND ESSAYS ONLY. The embedded thread breaks OUT of the reading
          column: its own shade band, full-bleed background, content
          re-anchored to site width by the page-shell grid. Any prose after the
          token resumes at reading measure in the tail shell below. */}
      {hasBand && (
        <>
          <section className="section full essay-thread-band">
            <AgencyThreadEmbed />
          </section>

          <SectionShell className="essay-article essay-article--tail">
            <article className="essay-wrap">
              {segments.slice(1).map((chunk, i) =>
                chunk.trim() ? (
                  <div
                    key={`md-${i + 1}`}
                    className="essay-prose"
                    dangerouslySetInnerHTML={{ __html: chunk }}
                  />
                ) : null,
              )}

              {essayClose}
            </article>
          </SectionShell>
        </>
      )}

      <MainContactCapsule
        heading="Have a wild idea that needs a home?"
        intro="If any of this lands, tell me what you are trying to build. The person who writes the reply is the person who would do the work."
      />
    </PageComposer>
  );
}
