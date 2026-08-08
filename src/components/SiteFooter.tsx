import Link from "next/link";
import { GemstoneMark } from "@/components/GemstoneMark";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import { isLaunched } from "@/lib/launch";
import { ORG, PERSON } from "@/lib/service";
import {
  LinkedInIcon,
  GitHubIcon,
  CrunchbaseIcon,
  ContraIcon,
  RedditIcon,
} from "@/components/BrandIcons";

// ORG.telephone is stored schema-shaped (+1-215-872-1240). Both the visible
// number and the dial target are derived from it, so the footer and the schema
// cannot drift apart.
const PHONE_DIGITS = ORG.telephone.replace(/\D/g, "").slice(-10);
const PHONE_DISPLAY = `(${PHONE_DIGITS.slice(0, 3)}) ${PHONE_DIGITS.slice(
  3,
  6
)}-${PHONE_DIGITS.slice(6)}`;
const PHONE_HREF = `tel:${ORG.telephone.replace(/[^\d+]/g, "")}`;

// Footer sitemap: every column heading links to its hub where one exists.
// This is load-bearing for GEO (internal links; every rankable page reachable
// in <= 3 clicks from any page), not decoration.
// A link is lit + clickable when its route is launched (see launch.ts); the
// rest are dimmed behind the "working on it" overlay. No per-link flag here --
// launch.ts is the single source of truth.
// Column ORDER is footer-only and does not mirror the header (Chad,
// 2026-07-16): Company leads here, where the header leads with the lanes. A
// footer reader is usually looking for the org (about / contact / rates), not
// browsing the catalogue, so the lanes follow rather than open.
// A column holds one or more GROUPS, stacked. Company and Tools share the first
// column (Chad, 2026-07-17): Tools is short and does not earn a column of its
// own, and it reads as a footnote to the org rather than a service lane.
type FooterLink = { href: string; label: string };

type FooterGroup = {
  heading: string;
  href?: string;
  links: FooterLink[];
};

// --- OFF-SITE PROFILES ------------------------------------------------
// The studio's profiles elsewhere, DERIVED from ORG.sameAs and PERSON.sameAs
// rather than hardcoded. That is deliberate: sameAs is an identity claim, and
// the style toolkit's rule is that schema must match visible content. Before
// this block the entity graph asserted profiles no visitor could see anywhere
// on the site, which is the weakest form of that claim. Add a URL to the sameAs
// ledger in service.ts and it appears here; there is no second list to update.
//
// rel="me" is the IndieWeb equivalent of sameAs -- the same "this profile is
// also me" assertion, made in HTML instead of JSON-LD. Both are emitted now.
//
// Matches are deliberately specific, not bare hostnames: ORG and PERSON each
// carry a LinkedIn, a GitHub and a Contra, and the footer wants the STUDIO's
// every time (the company page, the org account, the studio profile), never
// Chad's personal ones. Chad's individual Contra profile stays on PERSON.sameAs
// as its own identity claim; it just is not what the studio footer points at.
const PROFILE_LABELS = [
  { match: "linkedin.com/company", label: "LinkedIn", Icon: LinkedInIcon },
  { match: "github.com/chadworksweb", label: "GitHub", Icon: GitHubIcon },
  { match: "crunchbase.com/organization", label: "Crunchbase", Icon: CrunchbaseIcon },
  { match: "contra.com/studio", label: "Contra", Icon: ContraIcon },
  { match: "reddit.com/user/", label: "Reddit", Icon: RedditIcon },
] as const;

const ALL_PROFILES = [...ORG.sameAs, ...PERSON.sameAs];

// Order follows PROFILE_LABELS, not the sameAs arrays, so presentation order is
// controlled here and does not shift when a URL is appended to the ledger.
const PROFILE_LINKS = PROFILE_LABELS.flatMap(({ match, label, Icon }) => {
  const href = ALL_PROFILES.find((u) => u.includes(match));
  return href ? [{ href, label, Icon }] : [];
});

const COLUMNS: FooterGroup[][] = [
  [
    {
      heading: "Company",
      links: [
        { href: "/about/", label: "About" },
        { href: "/rates/", label: "Rates" },
        { href: "/showroom/", label: "Showroom" },
        { href: "/essays/", label: "Essays" },
        { href: "/are-we-a-good-fit/", label: "Are We A Good Fit?" },
        { href: "/faqs/", label: "FAQs" },
        { href: "/contact/", label: "Contact" },
      ],
    },
    {
      heading: "Tools",
      links: [
        {
          href: "/website-design-cost-calculator/",
          label: "Website Cost Calculator",
        },
      ],
    },
  ],
  [
    {
      heading: "Websites",
      href: "/websites/",
      links: [
        { href: "/web-design/", label: "Web Design" },
        { href: "/web-development/", label: "Web Development" },
        { href: "/website-redesign/", label: "Website Redesign" },
        {
          href: "/ai-generated-website-audit/",
          label: "AI Generated Website Audit",
        },
        { href: "/web-design-packages/", label: "Web Design Packages" },
        { href: "/web-hosting/", label: "Web Hosting" },
        { href: "/wordpress/", label: "WordPress" },
        { href: "/custom-coded-static/", label: "Custom Coded / Static" },
        { href: "/ecommerce/", label: "Ecommerce" },
        { href: "/shopify/", label: "Shopify" },
      ],
    },
  ],
  [
    {
      heading: "Visibility",
      href: "/visibility/",
      links: [
        { href: "/ai-search-visibility/", label: "AI Search Visibility" },
        { href: "/ai-visibility-audit/", label: "AI Visibility Audit" },
        { href: "/seo/", label: "SEO" },
        { href: "/digital-marketing/", label: "Digital Marketing" },
        { href: "/email-marketing/", label: "Email Marketing" },
        { href: "/show-up-on-chatgpt/", label: "Show Up on ChatGPT" },
        { href: "/advertising-on-chatgpt/", label: "Advertising on ChatGPT" },
      ],
    },
  ],
  [
    {
      heading: "Situations",
      links: [
        { href: "/switch/leave-wordpress/", label: "Leave WordPress" },
        { href: "/switch/leave-social-media/", label: "Leave Social Media" },
        { href: "/switch/squarespace-to-static/", label: "Squarespace to Static" },
        { href: "/switch/wix-to-static/", label: "Wix to Static" },
        { href: "/switch/godaddy-to-static/", label: "GoDaddy to Static" },
        { href: "/switch/gmail-to-workspace/", label: "Gmail to Workspace" },
        { href: "/switch/stop-paying-indeed/", label: "Stop Paying Indeed" },
        { href: "/industries-served/", label: "Industries Served" },
      ],
    },
  ],
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav className="site-footer__cols" aria-label="Footer">
          {/* Corporate branding / info / contact -- the live CW gemstone. It
              holds a fixed near-front tilt; the cursor only moves the shimmer. */}
          <div className="site-footer__brandcol">
            <GemstoneMark
              still
              tiltY={0.3}
              tiltX={0.1}
              cursorShimmer
              specDamp={0.5}
              className="site-footer__gem"
            />
            <span className="site-footer__brand">chadworks&trade;</span>
            <span className="site-footer__tag">so you don&apos;t have to</span>
            <a className="site-footer__contact" href="mailto:chad@chadworks.co">
              chad@chadworks.co
            </a>
            {/* Display and href both derive from ORG.telephone so the visible
                number and the schema can never drift apart. */}
            <a className="site-footer__contact" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
            {/* Off-site profiles as brand marks, under the phone (Chad,
                2026-07-31). These sit in the BRAND column rather than the link
                grid on purpose: they identify the studio, they are not part of
                the sitemap, and a row of icons reads as identity where a text
                list read as another nav column.
                rel="me" is the IndieWeb equivalent of schema.org sameAs, so the
                identity claim is made in HTML as well as JSON-LD. */}
            <ul className="site-footer__profiles">
              {PROFILE_LINKS.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="me noopener"
                    aria-label={label}
                    title={label}
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Launch control: launched links are live; unlaunched ones render as
              greyed, non-clickable text (a heading whose hub is unlaunched is a
              plain label). Driven entirely by launch.ts. */}
          <div className="site-footer__links">
            <div className="site-footer__linkgrid">
              {COLUMNS.map((groups) => (
                <div key={groups[0].heading} className="site-footer__col">
                  {groups.map((col) => (
                    <div key={col.heading} className="site-footer__group">
                      <p className="site-footer__heading">
                        {col.href && isLaunched(col.href) ? (
                          <Link href={col.href}>{col.heading}</Link>
                        ) : (
                          col.heading
                        )}
                      </p>
                      <ul className="site-footer__list">
                        {col.links.map((l) =>
                          isLaunched(l.href) ? (
                            <li key={l.href}>
                              <Link href={l.href}>{l.label}</Link>
                            </li>
                          ) : (
                            <li
                              key={l.href}
                              className="site-footer__item--sealed"
                              aria-hidden="true"
                            >
                              {l.label}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </nav>
        {/* Three centred lines, in this order: where the studio is, the policy
            links, then the copyright. */}
        <div className="site-footer__legal">
          {/* Where the studio IS, not a market it targets: chadworks runs no
              LocalBusiness node and no metro areaServed (see ORG). */}
          <span className="site-footer__based">
            Based in Greater Philadelphia, PA, USA
          </span>
          <span className="site-footer__legal-links">
            {isLaunched("/terms-of-service/") ? (
              <Link href="/terms-of-service/">Terms of Service</Link>
            ) : (
              <span className="site-footer__item--sealed">Terms of Service</span>
            )}
            {/* Separators are their own elements, not a ::before on the links:
                inside an <a> the pipe joins the hit area and picks up the hover
                colour. Same shape as the hero breadcrumb. */}
            <span className="site-footer__sep" aria-hidden="true">
              |
            </span>
            {isLaunched("/privacy-policy/") ? (
              <Link href="/privacy-policy/">Privacy Policy</Link>
            ) : (
              <span className="site-footer__item--sealed">Privacy Policy</span>
            )}
            <span className="site-footer__sep" aria-hidden="true">
              |
            </span>
            <CookiePreferencesButton />
          </span>
          <span>&copy; {new Date().getFullYear()} Chad Lewine</span>
        </div>
      </div>
    </footer>
  );
}
