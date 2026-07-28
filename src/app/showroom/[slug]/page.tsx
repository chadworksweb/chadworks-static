// Route: /showroom/<slug>/ -- one project, told as a craft narrative
// (CWS-EXPANSION-PLAN-01 item C). The route name was decided 2026-07-27 (Chad):
// the spotlights nest INSIDE the room the reel already points at, rather than
// opening a separate /work/ or /spotlight/ tree. Fourth vote for the
// plain-language convention, after /showroom/, /are-we-a-good-fit/ and
// staging.chadworks.co.
//
// A page exists here because `src/content/projects/<slug>.md` exists -- the same
// mechanism /essays/ runs on. Not every project gets one, and nothing needs to
// be flagged when one does. The prose is Chad's; AI writes none of it, on the
// rule item N set for the essays and the copy brief extended to the positioning
// copy.
//
// Everything AROUND the prose (label, live URL, platform, year, capture) comes
// from the project entity in src/lib/projects.ts, so a page cannot disagree with
// the reel about what the piece is.
//
// JSON-LD: CreativeWork (the project) + BreadcrumbList.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import { captureSrc } from "@/lib/captures";
import { getProjectPage, getProjectPageSlugs } from "@/lib/project-pages";
import { ref, PERSON_ID, ORG_ID } from "@/lib/jsonld";
import { PageComposer, SectionShell, MainContactCapsule } from "@/components/capsules";

// Static export: prerender every project that has a file. No file, no route.
export function generateStaticParams() {
  return getProjectPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getProjectPage(slug);
  if (!page) return {};
  const url = `${SITE_URL}/showroom/${slug}/`;
  const description = page.description || page.dek;
  const metaTitle = `${page.title} | chadworks`;
  return {
    title: metaTitle,
    description,
    alternates: { canonical: url },
    // layout.tsx defaults every route to noindex. Project pages inherit the
    // /showroom/ launch rather than being listed individually, the same way an
    // essay inherits /essays/.
    robots: {
      index: isLaunched("/showroom/"),
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    authors: [{ name: "Chad Lewine", url: `${SITE_URL}/about/` }],
    openGraph: {
      title: metaTitle,
      description,
      url,
      type: "article",
      siteName: "chadworks",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}${captureSrc(page.project.slug)}`,
          alt: page.project.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [`${SITE_URL}${captureSrc(page.project.slug)}`],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getProjectPage(slug);
  if (!page) notFound();

  const { project } = page;
  const url = `${SITE_URL}/showroom/${slug}/`;

  // CreativeWork rather than Article: the subject is the thing that got built,
  // not the write-up. Author/creator are @id REFERENCES into the site graph
  // (src/lib/jsonld.ts), never inline copies.
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.label,
    headline: page.title,
    description: page.description || page.dek,
    url,
    ...(project.href ? { sameAs: [project.href] } : {}),
    creator: ref(PERSON_ID),
    author: ref(PERSON_ID),
    publisher: ref(ORG_ID),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en-US",
    ...(page.date ? { datePublished: page.date } : {}),
    ...(page.updated || page.date
      ? { dateModified: page.updated || page.date }
      : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.platform ? { keywords: project.platform } : {}),
    isAccessibleForFree: true,
    ...(page.bodyText ? { abstract: page.description || page.dek, text: page.bodyText } : {}),
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}${captureSrc(project.slug)}`,
      description: project.alt,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Showroom", item: `${SITE_URL}/showroom/` },
      { "@type": "ListItem", position: 3, name: project.label, item: url },
    ],
  };

  return (
    <PageComposer jsonLd={[breadcrumbJsonLd, projectJsonLd]}>
      <SectionShell className="essay-article">
        <article className="essay-wrap">
          <header className="essay-head">
            <p className="essay-head__eyebrow">
              <Link href="/showroom/">Showroom</Link>
              {project.year && (
                <>
                  <span aria-hidden="true"> / </span>
                  {project.year}
                </>
              )}
            </p>
            <h1 className="essay-head__title">
              <span className="text-gradient">{page.title}</span>
            </h1>
            {page.dek && <p className="essay-head__dek">{page.dek}</p>}
          </header>

          {/* The capture. Captures differ in intrinsic size (1884x1080 and
              2880x1800 both exist), so the FRAME owns a fixed ratio and the
              image covers it. That is zero CLS without hardcoding a size per
              project, which would be wrong for half of them. */}
          <figure className="cw-proj-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cw-proj-shot__img"
              src={captureSrc(project.slug)}
              alt={project.alt}
              loading="eager"
              decoding="async"
            />
          </figure>

          {/* The facts come from the entity, so the prose never has to restate
              them and cannot contradict the reel. `Live` is NOT a row here any
              more: since the showroom hands a piece with a page over to this
              page instead of straight out (see SelectedFrame), this page owns
              the live link, and owning it means giving it a button rather than
              burying it in a definition list. */}
          {/* Facts and the live-site button share one row: the button rides the
              TOP RIGHT of the fact list on desktop and drops to the bottom of
              the stack on mobile (Chad, 2026-07-28). The wrapper owns the rule
              beneath them, so the line spans the full column either way rather
              than stopping under the facts. */}
          <div className="cw-proj-meta">
            <dl className="cw-proj-facts">
              {project.platform && (
                <div className="cw-proj-facts__row">
                  <dt>Platform</dt>
                  <dd>{project.platform}</dd>
                </div>
              )}
              {project.year && (
                <div className="cw-proj-facts__row">
                  <dt>Year</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
            </dl>

            {/* A div, NOT a p: the global prose-link rule is `p a`, and a button
                inside a paragraph inherits the animated underline plus a
                padding-bottom that fights .svc-btn's own. Opting back out landed
                the label off-centre. Not matching the selector is the fix.
                A project can lose its live link (thorobird did) without losing
                its page, so the no-link case says so rather than rendering a
                dead button. */}
            {project.href ? (
              <div className="cw-proj-live">
                <a
                  className="svc-btn cw-proj-live__btn"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="svc-btn__label">Visit {project.url}</span>
                  <svg
                    className="cw-proj-live__arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            ) : (
              <p className="cw-proj-live cw-proj-live--gone">
                {project.url} is no longer linked from here.
              </p>
            )}
          </div>

          <div
            className="essay-prose"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />

          {/* NO visible date (Chad, 2026-07-28). The frontmatter `date` and
              `updated` still feed datePublished / dateModified in the JSON-LD
              above -- that is machine metadata, not something a reader is shown.
              Essays keep their visible dates; nothing else on the site carries
              one. */}
          <footer className="essay-foot essay-foot--tail">
            <span className="essay-foot__divider" aria-hidden="true">
              <span className="essay-foot__pip" />
              <span className="essay-foot__pip" />
              <span className="essay-foot__pip" />
              <span className="essay-foot__pip" />
              <span className="essay-foot__pip" />
            </span>
            <Link href="/showroom/" className="essay-foot__back">
              Back to the showroom
            </Link>
          </footer>
        </article>
      </SectionShell>

      <MainContactCapsule
        heading="Have a wild idea that needs a home?"
        intro="If any of this lands, tell me what you are trying to build. The person who writes the reply is the person who would do the work."
      />
    </PageComposer>
  );
}
