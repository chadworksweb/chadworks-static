import type { Metadata } from "next";
import { Lexend, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/global.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { buildOrgJsonLd, SITE_URL } from "@/lib/service";

// chadworks brand faces. Self-hosted at build time by next/font -- works with
// output: 'export'. Exposed as CSS variables consumed in global.css.
// Display = Lexend (logo + headings); body = Instrument Sans; labels = JetBrains Mono.
const display = Lexend({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Staged relaunch: every route is noindex by default so only pages that
  // explicitly override robots.index = true are exposed to search. The
  // homepage sets that override; inner pages opt back in one at a time.
  robots: { index: false, follow: true },
  title: "chadworks™",
  description: "Websites and visibility, built with luxury-grade craft.",
  openGraph: {
    type: "website",
    siteName: "chadworks",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        {/* Site-wide Organization schema (GEO checklist 2): one consistent
            provider entity in the static HTML of every page. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrgJsonLd()) }}
        />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
        <PageTransition />
      </body>
    </html>
  );
}
