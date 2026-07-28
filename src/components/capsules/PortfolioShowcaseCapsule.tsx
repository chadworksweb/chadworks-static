// PORTFOLIO SHOWCASE CAPSULE -- the full portfolio showroom (global, placed in
// multiple instances: the homepage and any service page that wants the real
// showcase instead of the lighter PortfolioCapsule).
//
// Renders the CANONICAL chadworks portfolio (the flagship + the archive of
// client builds) so every page that renders it stays identical line for line --
// the selection is fixed by the `inShowcase` field in `src/lib/projects.ts` and
// no caller can vary it. Three parts: a gemstone titlebar, the FeaturedShowcase
// flagship, then the ArchiveGrid with the "view full portfolio" CTA.
//
// It no longer OWNS the work. Since 2026-07-27 the projects live in
// `src/lib/projects.ts` and everything below is a projection of them.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { GemstoneMark } from "@/components/GemstoneMark";
import { isLaunched } from "@/lib/launch";
import { FeaturedShowcase, type FeaturedItem } from "@/components/portfolio/FeaturedShowcase";
import { ArchiveGrid, type ArchiveItem } from "@/components/portfolio/ArchiveGrid";
import { ARCHIVE_PROJECTS, FEATURED_PROJECT, SHOWCASE_PROJECTS } from "@/lib/projects";
import { getProjectPageSlugs } from "@/lib/project-pages";

// Which projects have a page of their own at /showroom/<slug>/. A filesystem
// question (a project has a page because src/content/projects/<slug>.md exists),
// so it can only be asked from the server -- which this capsule and all four of
// its host pages are. Nothing in this chain is a client component; if that ever
// changes, this import is what will break the build, and the fix is to resolve
// the list in each page and pass it down the way /showroom/ does for the reel.
const PAGE_SLUGS = new Set(getProjectPageSlugs());
const pageHrefFor = (slug: string): string | undefined =>
  PAGE_SLUGS.has(slug) ? `/showroom/${slug}/` : undefined;

// The flagship, taken from the entity rather than re-typed here.
const FEATURED: FeaturedItem = {
  slug: FEATURED_PROJECT.slug,
  alt: FEATURED_PROJECT.alt,
  url: FEATURED_PROJECT.url,
  label: FEATURED_PROJECT.label,
  href: FEATURED_PROJECT.href ?? `https://${FEATURED_PROJECT.url}`,
};

// What the CURATED grid holds back is now a field on each project
// (`inShowcase`), not a list of key strings living over here. Same behaviour,
// applied unconditionally on every surface with no prop to override it (Chad,
// 2026-07-16): the capsule renders ONE selection everywhere it appears. The
// list-of-keys form was replaced 2026-07-27 because a typo in it was silent --
// the item simply kept showing and nothing failed. A boolean on the project it
// describes cannot miss its target.
const SHOWCASE_KEYS = new Set(SHOWCASE_PROJECTS.map((p) => p.key));

// The FULL archive, derived from the project entity in ARCHIVE order (which is
// deliberately NOT the reel order -- see the two-orders note in lib/projects.ts).
// Exported so any other surface renders the exact same list; consumers get the
// curated selection via the capsule itself. Until 2026-07-27 this was a second
// hand-typed copy of the work that a deploy gate had to police against
// SHOWROOM_ITEMS. It is a projection now, so the two cannot disagree.
export const ARCHIVE: ArchiveItem[] = ARCHIVE_PROJECTS.map((p) => ({
  key: p.key,
  slug: p.slug,
  alt: p.alt,
  url: p.url,
  label: p.label,
  ...(p.href ? { href: p.href } : {}),
  blurb: p.gridBlurb ?? p.reelBlurb,
  // Only for a piece that has a page. The card swaps its live-site arrow for an
  // "Explore <piece>" cue when this is set (see ArchiveGrid). Nothing in the
  // curated grid has a page today -- the only one that does is the flagship,
  // which renders as FeaturedShowcase and never as a card -- so this is dormant
  // until the next project file lands. It is wired now rather than later
  // because the alternative is a surface that quietly disagrees with /showroom/
  // about which pieces have pages, and that is the exact defect lib/projects.ts
  // was built to end.
  ...(pageHrefFor(p.slug) ? { storyHref: pageHrefFor(p.slug) } : {}),
}));

// The default flagship lede -- used everywhere unless a host page overrides it.
const FEATURED_LEDE =
  "The Rising Compass is a ground-up, custom web app that tracks and measures the messages contained in the lyrics of the world's most popular songs. I built and manage this 100%, top to bottom.";

// `archiveHeading` names the archive-grid block, so each host page can title
// it in its own context (the homepage frames it broadly, a service page frames
// it to that service). The rest of the showroom is identical everywhere.
//
// OPTIONAL per-page copy overrides (leave both unset for the canonical
// showroom): `featuredLede` swaps the flagship lede, and `blurbs` is a map
// keyed by archive-item `key` (e.g. "rslgo") that replaces just those blurbs.
// Any project not present in the map keeps its default blurb. Used by the
// web-development page to speak to the development aspect of each build.
// `maxItems` caps how many archive tiles render (the homepage shows a curated
// few, the /portfolio page and service pages show the full set). `showroomCta`
// swaps the "view full portfolio" button for a "view the showroom" button that
// links to /showroom/ -- used on the homepage, where the trimmed grid points a
// visitor to the full interactive showroom instead of the classic archive page.
// `revealEarly` fires this block's scroll-reveal BEFORE it reaches the fold
// rather than just after it (see PageMotion). Homepage-only by request (Chad,
// 2026-07-16), which is why it is a prop here and not a change to the shared
// `.reveal` class: the service pages keep the standard timing.
export function PortfolioShowcaseCapsule({
  archiveHeading = "chadworks Project Showcase",
  featuredLede,
  blurbs,
  maxItems,
  showroomCta = false,
  revealEarly = false,
}: {
  archiveHeading?: string;
  featuredLede?: string;
  blurbs?: Record<string, string>;
  maxItems?: number;
  showroomCta?: boolean;
  revealEarly?: boolean;
} = {}) {
  // Appended AFTER `reveal` by SectionShell, so the section carries both classes
  // and takes its look from `.reveal` while `.reveal-early` only picks which
  // observer watches it.
  const early = revealEarly ? "reveal-early" : undefined;
  const withBlurbs = blurbs
    ? ARCHIVE.map((item) =>
        blurbs[item.key] ? { ...item, blurb: blurbs[item.key] } : item
      )
    : ARCHIVE;
  const filtered = withBlurbs.filter((item) => SHOWCASE_KEYS.has(item.key));
  const archive =
    typeof maxItems === "number" ? filtered.slice(0, maxItems) : filtered;
  return (
    <>
      {/* PORTFOLIO -- a centered titlebar: the section name flanked by two
          mini, counter-rotating CW gemstones (the same cut crystal as the hero
          mark, at badge scale). Then the flagship piece and the archive grid. */}
      <SectionShell className="cw-port-titlebar" trailingClassName={early}>
        <div className="cw-port-titlebar__row">
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
          <h2 className="cw-port-titlebar__title">chadworks&trade; Portfolio</h2>
          <GemstoneMark spinDir={1} className="cw-port-titlebar__gem" />
        </div>
      </SectionShell>

      {/* The flagship piece, then the archive grid. */}
      <SectionShell className="cw-port-feat-shell" trailingClassName={early}>
        <FeaturedShowcase
          primary={FEATURED}
          eyebrow="Featured build"
          heading={FEATURED_PROJECT.label}
          headingAs="h3"
          ctaUnderLede
          lede={featuredLede ?? FEATURED_LEDE}
          pageHref={pageHrefFor(FEATURED_PROJECT.slug)}
        />
      </SectionShell>
      <SectionShell className="cw-port-archive-shell" trailingClassName={early}>
        <h2 className="cw-port-archive__heading">{archiveHeading}</h2>
        <ArchiveGrid items={archive} />
        {/* Both arms of the ternary that used to live here rendered identical
            markup and differed only in their condition, so it is one condition
            now: an explicit `showroomCta` forces the button, otherwise it shows
            once /showroom/ is launched. */}
        {(showroomCta || isLaunched("/showroom/")) && (
          <div className="cw-port-archive__cta-row">
            <Link href="/showroom/" className="svc-btn cw-port-archive__cta-btn">
              <span className="svc-btn__label">View the showroom</span>
              <svg className="svc-btn__arrow" viewBox="0 0 448 512" aria-hidden="true" focusable="false">
                <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
              </svg>
            </Link>
          </div>
        )}
      </SectionShell>
    </>
  );
}
