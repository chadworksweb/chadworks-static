// ENTITY GRAPH -- the canonical @id nodes for chadworks.
//
// The GEO standard (Crystopa Forge SEARCH-VISIBILITY-TOOLKIT, rule: "use @id
// references to unify entities across pages -- not flat duplicate objects") is
// mandatory, not stylistic: the Petersen build logged an "Identity Crisis"
// -15 AI-citation penalty from fragmented ids. So every node on the site is
// DECLARED ONCE here, emitted once in the root layout as an @graph, and
// referenced everywhere else as { "@id": ... }.
//
// Adding a node: declare it here, emit it in buildSiteGraph(), reference it by
// its exported id. Never inline a second copy of an entity that already has an
// id -- that is the failure this file exists to prevent.
import { SITE_URL, ORG } from "@/lib/service";

export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/about/#chad`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/essays/#blog`;

/** Reference an entity instead of restating it. */
export const ref = (id: string) => ({ "@id": id });

// The author/founder. `knowsAbout` is the E-E-A-T surface: it must stay true to
// what the site actually demonstrates, per the toolkit's "schema must match
// visible content" rule.
export function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Chad Lewine",
    url: `${SITE_URL}/about/`,
    jobTitle: "Web Designer and Developer",
    worksFor: ref(ORG_ID),
    knowsAbout: [
      "Web Design",
      "Web Development",
      "Search Engine Optimization",
      "Generative Engine Optimization",
      "AI Visibility",
      "WordPress",
      "Ecommerce",
      "Static Site Architecture",
    ],
    ...(ORG.sameAs.length ? { sameAs: ORG.sameAs } : {}),
  };
}

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: { "@type": "ImageObject", url: ORG.logo },
    image: ORG.logo,
    founder: ref(PERSON_ID),
    employee: ref(PERSON_ID),
    ...(ORG.sameAs.length ? { sameAs: ORG.sameAs } : {}),
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: ORG.name,
    url: SITE_URL,
    publisher: ref(ORG_ID),
    inLanguage: "en-US",
  };
}

// The essays collection, so an essay's isPartOf resolves to a real node rather
// than a bare URL string.
export function blogNode() {
  return {
    "@type": "Blog",
    "@id": BLOG_ID,
    name: "Essays",
    url: `${SITE_URL}/essays/`,
    publisher: ref(ORG_ID),
    author: ref(PERSON_ID),
    inLanguage: "en-US",
  };
}

/** The site identity graph, emitted once in the root layout. */
export function buildSiteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), personNode(), websiteNode()],
  };
}
