// Foundation repair "methods" work-of-art sections, reproduced faithfully and
// RESKINNED to the global tokens (CWS directive 2026-06-15). Server components:
// the methods intro (eyebrow + heading + lead + layered-browser aside) with the
// six-chapter table of contents, then chapter 01 (Services grid) and chapter
// 02 (Sitemap tree). Copy is reproduced from the source verbatim. The Syne
// face is swapped to the global display font (Lexend); the palette is already
// on indigo (#243989) / purple (#8054bc). Chapters are plain blocks with ids
// so the caller can drop them inside a single methods SectionShell.

import Link from "next/link";

type TocEntry = {
  num: string;
  href: string;
  label: string;
  sub: string;
};

const TOC: TocEntry[] = [
  {
    num: "01",
    href: "#foundation-ch01",
    label: "Services",
    sub: "Each service gets its own optimized page",
  },
  {
    num: "02",
    href: "#foundation-ch02",
    label: "Sitemap",
    sub: "I develop a formal sitemap so we don't miss anything",
  },
  {
    num: "03",
    href: "#foundation-ch03",
    label: "Wireframe",
    sub: "Pages are designed around your needs, not templated",
  },
  {
    num: "04",
    href: "#foundation-ch04",
    label: "Brand Kit",
    sub: "Your branding is masterfully applied to the site",
  },
  {
    num: "05",
    href: "#foundation-ch05",
    label: "Sample Copy",
    sub: "Clear and inviting text is critical for conversions",
  },
  {
    num: "06",
    href: "#foundation-ch06",
    label: "Visibility",
    sub: "SEO + GEO + AI visibility is a driving force, not bolted on",
  },
];

const SERVICE_CARDS: Array<{ for: string; name: string; desc: string }> = [
  {
    for: "Settling foundations",
    name: "Foundation Piering",
    desc: "Helical or push piers driven below the active soil layer to bedrock or load-bearing strata. Page is built on the method's keyword (helical pier near me, push pier installation near me) so it ranks for the system you actually install.",
  },
  {
    for: "Wall cracks",
    name: "Crack Injection",
    desc: "Epoxy or polyurethane injected from inside the basement. Bonds the wall (epoxy) or fills + flexes with seasonal soil movement (polyurethane). Page calls out which crack type pairs with which resin so customers self-qualify before they call.",
  },
  {
    for: "Chronic water entry",
    name: "Exterior Waterproofing",
    desc: 'Excavate to footer, scrub the wall, apply rubberized asphalt or polymer membrane, install dimple board, backfill. Permanent fix when interior systems can\'t keep up. Page handles the "why exterior costs more" question that loses you 30% of leads.',
  },
  {
    for: "Slab-edge seepage",
    name: "Interior French Drain",
    desc: 'Trench cut at the perimeter inside the basement, perforated pipe in gravel, water routed to a sump pit. Faster and cheaper than exterior. Page ranks for "French drain near me", a distinct keyword from "exterior waterproofing."',
  },
  {
    for: "When the power goes out",
    name: "Sump Pit + Backup Pump",
    desc: 'Submersible primary pump in a sealed pit, plus a battery backup that fires when the grid drops. Installed alongside French drain or as a standalone. Gets its own page because customers Google "sump pump installer" without caring about your other services.',
  },
  {
    for: "Damp crawls + humidity",
    name: "Crawl Space Encapsulation",
    desc: "Vapor-barrier liner sealed to walls, dehumidifier sized to volume, vents closed and conditioned. Stops mold, kills the musty-house smell, cuts heating bills 10 to 15%. Page ranks for both encapsulation and vapor barrier search terms.",
  },
  {
    for: "Sunken slabs and driveways",
    name: "Slab and Concrete Leveling",
    desc: 'Polyjacking foam or grout pumped under the slab through small ports to lift it back to grade. No tearout, ready to use the same day. Page targets a different buyer (driveway-owning homeowners Googling "concrete leveling near me") than your foundation buyers.',
  },
  {
    for: "Bowing basement walls",
    name: "Wall Stabilization",
    desc: 'Carbon fiber straps or steel I-beam piles installed against the wall to stop further inward movement. Often paired with exterior backfill correction in serious cases. Page handles the "is my wall about to fall in" search intent that sends panicked homeowners straight to Google.',
  },
];

const SITEMAP_BRANCHES: Array<{ parent: string; children: string[] }> = [
  {
    parent: "Services",
    children: [
      "Foundation Piering",
      "Crack Injection",
      "Exterior Waterproofing",
      "Interior French Drain",
      "Sump Pit + Pump",
      "Crawl Space Encap.",
      "Slab + Concrete Leveling",
      "Wall Stabilization",
    ],
  },
  {
    parent: "Service Areas",
    children: [
      "Anytown",
      "Everytown",
      "Anytown Heights",
      "Anytown Mills",
      "Everytown Crossing",
      "East Anytown",
      "Greater Everytown",
      "Everytown Center",
      "Anytown Valley",
    ],
  },
  {
    parent: "Company",
    children: [
      "About + Engineer",
      "Before & After Gallery",
      "Reviews",
      "Financing",
      "Contact",
    ],
  },
];

export function FoundationMethodsIntro() {
  return (
    <>
      <div className="cw-art-methods-intro">
        <div className="cw-art-methods-intro__text">
          <div className="cw-art-methods-eyebrow">
            My sites are fully loaded and original
          </div>
          <h2 className="cw-art-methods-heading">
            Here&apos;s what goes into your foundation repair website.
          </h2>
          <p className="cw-art-methods-lead">
            Below is an example of the process and content that goes into your
            foundation repair website. Planning is critical to a successful and
            effective product that actually generates business for you.
          </p>
        </div>

        <div className="cw-art-methods-intro__aside" aria-hidden="true">
          <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" role="img">
            {/* Layered browser windows, back to front, increasing opacity */}
            {/* Back window */}
            <g transform="translate(50, 18)" opacity="0.42">
              <rect width="170" height="120" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
              <rect width="170" height="18" rx="8" fill="rgba(255,255,255,0.10)" />
              <rect y="9" width="170" height="9" fill="rgba(255,255,255,0.10)" />
              <circle cx="10" cy="9" r="2.6" fill="rgba(255,255,255,0.5)" />
              <circle cx="20" cy="9" r="2.6" fill="rgba(255,255,255,0.5)" />
              <circle cx="30" cy="9" r="2.6" fill="rgba(255,255,255,0.5)" />
            </g>
            {/* Middle window */}
            <g transform="translate(30, 50)" opacity="0.72">
              <rect width="170" height="120" rx="8" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4" />
              <rect width="170" height="18" rx="8" fill="rgba(255,255,255,0.14)" />
              <rect y="9" width="170" height="9" fill="rgba(255,255,255,0.14)" />
              <circle cx="10" cy="9" r="2.6" fill="rgba(255,255,255,0.7)" />
              <circle cx="20" cy="9" r="2.6" fill="rgba(255,255,255,0.7)" />
              <circle cx="30" cy="9" r="2.6" fill="rgba(255,255,255,0.7)" />
              <rect x="14" y="36" width="92" height="6" rx="2" fill="rgba(255,255,255,0.30)" />
              <rect x="14" y="48" width="60" height="4" rx="2" fill="rgba(255,255,255,0.20)" />
            </g>
            {/* Front window */}
            <g transform="translate(10, 82)">
              <rect width="170" height="120" rx="8" fill="rgba(255,255,255,0.92)" stroke="rgba(255,255,255,1)" strokeWidth="1.4" />
              <rect width="170" height="18" rx="8" fill="rgba(36,57,137,0.10)" />
              <rect y="9" width="170" height="9" fill="rgba(36,57,137,0.10)" />
              <circle cx="10" cy="9" r="2.6" fill="#ff5f57" />
              <circle cx="20" cy="9" r="2.6" fill="#febc2e" />
              <circle cx="30" cy="9" r="2.6" fill="#28c840" />
              <rect x="14" y="34" width="115" height="8" rx="2" fill="rgba(36,57,137,0.55)" />
              <rect x="14" y="48" width="78" height="5" rx="2" fill="rgba(36,57,137,0.35)" />
              <rect x="14" y="58" width="98" height="4" rx="2" fill="rgba(36,57,137,0.25)" />
              <rect x="14" y="68" width="64" height="4" rx="2" fill="rgba(36,57,137,0.25)" />
              <rect x="14" y="88" width="46" height="14" rx="3" fill="#8054bc" />
            </g>
          </svg>
        </div>

        <nav className="cw-art-methods-toc" aria-label="Chapter list">
          {TOC.map((t) => (
            <Link key={t.num} className="cw-art-methods-toc__item" href={t.href}>
              <div className="cw-art-methods-toc__num">{t.num}</div>
              <div className="cw-art-methods-toc__label">{t.label}</div>
              <div className="cw-art-methods-toc__sub">{t.sub}</div>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export function FoundationServicesChapter() {
  return (
    <div className="cw-art-methods-chapter" id="foundation-ch01">
      <div className="cw-art-methods-chapter__intro">
        <div className="cw-art-methods-chapter__meta">
          <div className="cw-art-methods-chapter__num">01</div>
          <div className="cw-art-methods-chapter__label">Services</div>
        </div>
        <h3 className="cw-art-methods-chapter__heading">
          Foundation isn&apos;t one service. It&apos;s eight pages on your site.
        </h3>
        <p className="cw-art-methods-chapter__lead">
          Foundation buyers Google specifics &mdash; &quot;helical pier vs push
          pier,&quot; &quot;exterior membrane near me,&quot; &quot;polyjacking
          driveway.&quot; Most competitor sites lump everything onto one Services
          page and lose the long-tail entirely. Your site gets a dedicated
          ranking page for every method you offer, with copy that matches the
          search intent.
        </p>
      </div>

      <div className="cw-art-methods-grid">
        {SERVICE_CARDS.map((c) => (
          <div key={c.name} className="cw-art-method-card">
            <p className="cw-art-method-card__for">{c.for}</p>
            <h4 className="cw-art-method-card__name">{c.name}</h4>
            <p className="cw-art-method-card__desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <p className="cw-art-methods-note">
        Don&apos;t see your method?
        <br className="cw-art-mobile-br" />{" "}
        <Link href="#foundation-contact">Tell me what you actually offer</Link>.
        <br />
        The site is built to your service mix, not a template.
      </p>
    </div>
  );
}

export function FoundationSitemapChapter() {
  return (
    <div className="cw-art-methods-chapter" id="foundation-ch02">
      <div className="cw-art-methods-chapter__intro">
        <div className="cw-art-methods-chapter__meta">
          <div className="cw-art-methods-chapter__num">02</div>
          <div className="cw-art-methods-chapter__label">Sitemap</div>
        </div>
        <h3 className="cw-art-methods-chapter__heading">Every page, mapped.</h3>
        <p className="cw-art-methods-chapter__lead">
          The full structure of your site &mdash; eight service pages, nine
          local service-area pages, plus the supporting pages every conversion
          site needs. All indexed for search, all linked back to the home page
          through schema and breadcrumbs.
        </p>
      </div>

      {/* data-nosnippet: a sample sitemap for a fictional company, with
          placeholder town names under Service Areas. */}
      <div
        className="cw-art-sitemap"
        role="img"
        aria-label="Sample sitemap for a foundation repair site: Home branches into Services (8 pages), Service Areas (9 pages), and Company (5 pages)."
        data-nosnippet
      >
        <div className="cw-art-sitemap__root">
          <div className="cw-art-sitemap__node cw-art-sitemap__node--home">
            Home
          </div>
        </div>
        <div className="cw-art-sitemap__branches">
          {SITEMAP_BRANCHES.map((b) => (
            <div key={b.parent} className="cw-art-sitemap__branch">
              <div className="cw-art-sitemap__node cw-art-sitemap__node--parent">
                {b.parent}
              </div>
              <div className="cw-art-sitemap__children">
                {b.children.map((child) => (
                  <div key={child} className="cw-art-sitemap__node">
                    {child}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
