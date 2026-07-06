import type { Metadata } from "next";
import { Lexend, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/global.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { MotionTogglePocket } from "@/components/MotionTogglePocket";
import { MotionInvite } from "@/components/MotionInvite";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { GoogleAnalytics } from "@/components/consent/GoogleAnalytics";
import { buildOrgJsonLd, SITE_URL } from "@/lib/service";

// Pre-hydration consent bootstrap. Reads the saved choice (cw_cookie_consent),
// else the cached geo default (cw_geo_default), else defaults to DENY, then
// applies a GPC/DNT hard override that zeroes analytics regardless. Sets
// window.__CW_CONSENT__ before React hydrates so GA is correctly gated on first
// paint and there is no banner flash for returning visitors. See lib/consent.ts.
const CONSENT_BOOTSTRAP =
  "(function(){try{function r(n){var m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null;}" +
  "var raw=r('cw_cookie_consent'),w;" +
  "if(raw){var a=0;raw.split('|').forEach(function(p){var kv=p.split(':');if(kv[0]==='analytics')a=parseInt(kv[1],10)?1:0;});w={decided:true,analytics:a};}" +
  "else{var allow=r('cw_geo_default')==='allow';w={decided:false,analytics:allow?1:0};}" +
  "var gpc=(navigator.globalPrivacyControl===true)||(navigator.doNotTrack=='1')||(navigator.doNotTrack==='yes')||(window.doNotTrack=='1');" +
  "if(gpc){w.analytics=0;}window.__CW_CONSENT__=w;}catch(e){window.__CW_CONSENT__={decided:false,analytics:0};}})();";

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
      // The reduced-motion boot script (in <body>) may add `cw-force-motion`
      // here before hydration; suppress the expected className mismatch.
      suppressHydrationWarning
    >
      <body>
        {/* Reduced-motion override (see lib/motion.ts). Runs before paint so a
            session that opted into full motion re-adds `cw-force-motion` on
            <html> ahead of the CSS reduced-motion gates and the JS loops. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('cw-force-motion')==='1'){document.documentElement.classList.add('cw-force-motion')}}catch(e){}",
          }}
        />
        {/* Consent bootstrap: set window.__CW_CONSENT__ before hydration so GA
            is gated correctly on first paint (see CONSENT_BOOTSTRAP above). */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }} />
        {/* Site-wide Organization schema (GEO checklist 2): one consistent
            provider entity in the static HTML of every page. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrgJsonLd()) }}
        />
        <ConsentProvider>
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
          <PageTransition />
          <MotionTogglePocket />
          <MotionInvite />
          <GoogleAnalytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
