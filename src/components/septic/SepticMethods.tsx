// Septic "methods" work-of-art sections, reproduced faithfully and RESKINNED
// to the global tokens (CWS directive 2026-06-15). Server components: the
// methods intro (eyebrow + heading + lead + layered-browser aside) with the
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
    href: "#septic-ch01",
    label: "Services",
    sub: "Each service gets its own optimized page",
  },
  {
    num: "02",
    href: "#septic-ch02",
    label: "Sitemap",
    sub: "I develop a formal sitemap so we don't miss anything",
  },
  {
    num: "03",
    href: "#septic-ch03",
    label: "Wireframe",
    sub: "Pages are designed around your needs, not templated",
  },
  {
    num: "04",
    href: "#septic-ch04",
    label: "Brand Kit",
    sub: "Your branding is masterfully applied to the site",
  },
  {
    num: "05",
    href: "#septic-ch05",
    label: "Sample Copy",
    sub: "Clear and inviting text is critical for conversions",
  },
  {
    num: "06",
    href: "#septic-ch06",
    label: "Visibility",
    sub: "SEO + GEO + AI visibility is a driving force, not bolted on",
  },
];

const SERVICE_CARDS: Array<{ for: string; name: string; desc: string }> = [
  {
    for: "Every 3 to 5 years",
    name: "Routine Pumping",
    desc: 'Standard tank pumping on a maintenance schedule. Page handles "septic pumping near me" and "how often to pump septic," the two highest-volume septic searches in any service area, plus a tap-to-call for the panic homeowner who left it too long.',
  },
  {
    for: "Maintenance + diagnostics",
    name: "Septic Inspection",
    desc: "Visual inspection plus tank assessment for owners doing routine maintenance or solving a slow drain. Page distinguishes this from a real-estate cert (different scope, different price), so the buyer doesn't conflate the two and you don't lose them to a competitor who's clearer.",
  },
  {
    for: "Point-of-sale closings",
    name: "Real-Estate Certification",
    desc: 'PSMA-style cert inspection required by lenders or counties at sale. Tight turnaround, formal report. Page targets the "septic certification" and "septic point of sale inspection" keywords: different buyers (realtor + homebuyer) than your routine inspection page.',
  },
  {
    for: "System failure recovery",
    name: "Drain Field Repair",
    desc: 'Hydro-jetting, baffle replacement, distribution box repair, or full field replacement. Page handles the panicked homeowner who Googled "drain field problems" or "yard sinking near septic," high-intent searches that don\'t match your pumping page\'s tone.',
  },
  {
    for: "Buried tank access",
    name: "Riser + Lid Installation",
    desc: 'Concrete or polyethylene risers brought to grade so future pumping doesn\'t require excavation. Quick add-on sale. Page ranks for "septic riser installation cost," a search that almost never matches a pumping company\'s main services page.',
  },
  {
    for: "New construction or replacement",
    name: "System Installation",
    desc: "Conventional, mound, sand filter, or aerobic, sized to your soil perc and household load. Permits, sewage enforcement officer coordination, drain field design. Page has its own buyer flow because builders and full-replacement homeowners research for weeks, not panic.",
  },
  {
    for: "High water table sites",
    name: "Mound System Service",
    desc: 'Pressure distribution mounds need different maintenance: pump-chamber checks, distribution-line cleaning, sand-bed inspection. Page ranks for "mound system maintenance" because mound owners don\'t search for "septic pumping." They know their system is different.',
  },
  {
    for: "Restaurants + food service",
    name: "Grease Trap Pumping",
    desc: '1,000 to 3,000 gallon traps on monthly or quarterly schedules. Different equipment, different scheduling, different invoicing than residential. Page targets the restaurant manager Googling "grease trap service," a buyer who\'ll never click your residential pumping page.',
  },
];

const SITEMAP_BRANCHES: Array<{ parent: string; children: string[] }> = [
  {
    parent: "Services",
    children: [
      "Routine Pumping",
      "Septic Inspection",
      "Real-Estate Cert",
      "Drain Field Repair",
      "Riser + Lid",
      "System Installation",
      "Mound System Service",
      "Grease Trap",
    ],
  },
  {
    parent: "Service Areas",
    children: [
      "Anytown, ST",
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
      "About + Operator",
      "Truck + Crew Gallery",
      "Reviews",
      "Financing",
      "Contact",
    ],
  },
];

export function SepticMethodsIntro() {
  return (
    <>
      <div className="cw-art-methods-intro">
        <div className="cw-art-methods-intro__text">
          <div className="cw-art-methods-eyebrow">
            My sites are fully loaded and original
          </div>
          <h2 className="cw-art-methods-heading">
            Here&apos;s what goes into your septic services website.
          </h2>
          <p className="cw-art-methods-lead">
            Below is an example of the elements that comprise your septic
            services website. Planning is critical to a successful and effective
            product that actually generates business for you.
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

export function SepticServicesChapter() {
  return (
    <div className="cw-art-methods-chapter" id="septic-ch01">
      <div className="cw-art-methods-chapter__intro">
        <div className="cw-art-methods-chapter__meta">
          <div className="cw-art-methods-chapter__num">01</div>
          <div className="cw-art-methods-chapter__label">Services</div>
        </div>
        <h3 className="cw-art-methods-chapter__heading">
          &quot;Septic&quot; isn&apos;t one service.
        </h3>
        <p className="cw-art-methods-chapter__lead">
          Septic service buyers search for specifics: &quot;septic certification
          near me,&quot; &quot;mound system maintenance near me,&quot; &quot;grease
          trap pumping cost.&quot; Most competitor sites lump everything onto one
          Services page and lose the long-tail entirely. Your site gets a
          dedicated page for every service you offer, with copy that matches the
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
        Don&apos;t see your service?
        <br className="cw-art-mobile-br" />{" "}
        <Link href="#septic-contact">Tell me what you actually offer</Link>.
        <br />
        The site is built to your service mix, not a template.
      </p>
    </div>
  );
}

export function SepticSitemapChapter() {
  return (
    <div className="cw-art-methods-chapter" id="septic-ch02">
      <div className="cw-art-methods-chapter__intro">
        <div className="cw-art-methods-chapter__meta">
          <div className="cw-art-methods-chapter__num">02</div>
          <div className="cw-art-methods-chapter__label">Sitemap</div>
        </div>
        <h3 className="cw-art-methods-chapter__heading">
          A page for every facet of your business.
        </h3>
        <p className="cw-art-methods-chapter__lead">
          Before we build a single page, we map every page first. Service pages,
          town pages, and the supporting About/FAQ/Privacy plumbing that anchors
          the site. If we skip this step you launch in two months, realize you
          don&apos;t have a Drain Field Repair page, and watch that long-tail
          traffic land on a competitor for the next eight months while paying me
          a la carte to add the new page.
        </p>
      </div>

      <div
        className="cw-art-sitemap"
        role="img"
        aria-label="Sample sitemap for a septic services site: Home branches into Services (8 pages), Service Areas (9 pages), and Company (5 pages)."
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
