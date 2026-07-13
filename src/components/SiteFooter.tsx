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
const COLUMNS: { heading: string; href?: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Websites",
    href: "/websites/",
    links: [
      { href: "/web-design/", label: "Web Design" },
      { href: "/web-development/", label: "Web Development" },
      { href: "/web-design-packages/", label: "Web Design Packages" },
      { href: "/web-hosting/", label: "Web Hosting" },
      { href: "/wordpress/", label: "WordPress" },
      { href: "/custom-coded-static/", label: "Custom Coded / Static" },
      { href: "/ecommerce/", label: "Ecommerce" },
      { href: "/shopify/", label: "Shopify" },
    ],
  },
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
  {
    heading: "Situations",
    links: [
      { href: "/switch/leave-wordpress/", label: "Leave WordPress" },
      { href: "/switch/squarespace-to-static/", label: "Squarespace to Static" },
      { href: "/switch/wix-to-static/", label: "Wix to Static" },
      { href: "/switch/godaddy-to-static/", label: "GoDaddy to Static" },
      { href: "/switch/gmail-to-workspace/", label: "Gmail to Workspace" },
      { href: "/industries-served/", label: "Industries Served" },
      { href: "/my-service-areas/", label: "Service Areas" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about/", label: "About" },
      { href: "/rates/", label: "Rates" },
      { href: "/portfolio/", label: "Portfolio" },
      { href: "/faqs/", label: "FAQs" },
      { href: "/contact/", label: "Contact" },
    ],
  },
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
              {COLUMNS.map((col) => (
                <div key={col.heading} className="site-footer__col">
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
