import Link from "next/link";
import { GemstoneMark } from "@/components/GemstoneMark";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import { isLaunched } from "@/lib/launch";

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
type FooterGroup = {
  heading: string;
  href?: string;
  links: { href: string; label: string }[];
};

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
        { href: "/ai-viz/", label: "AI Visibility" },
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
        { href: "/my-service-areas/", label: "Service Areas" },
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
            <span className="site-footer__tag">Websites &amp; Visibility</span>
            <a className="site-footer__contact" href="mailto:chad@chadworks.co">
              chad@chadworks.co
            </a>
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
        <div className="site-footer__legal">
          <span>&copy; {new Date().getFullYear()} chadworks&trade;</span>
          <span className="site-footer__legal-links">
            {isLaunched("/terms-of-service/") ? (
              <Link href="/terms-of-service/">Terms of Service</Link>
            ) : (
              <span className="site-footer__item--sealed">Terms of Service</span>
            )}
            {isLaunched("/privacy-policy/") ? (
              <Link href="/privacy-policy/">Privacy Policy</Link>
            ) : (
              <span className="site-footer__item--sealed">Privacy Policy</span>
            )}
            <CookiePreferencesButton />
          </span>
        </div>
      </div>
    </footer>
  );
}
