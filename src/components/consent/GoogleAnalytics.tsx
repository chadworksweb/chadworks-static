"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { SKIP_FLAG } from "@/lib/consent";
import { useConsent } from "./ConsentProvider";

const GA_ID = "G-MR7XCMLZZ4";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  [key: `ga-disable-${string}`]: boolean | undefined;
};

/** GA4, gated on analytics consent. The script is never injected until consent
 *  allows it; once loaded it stays, and the documented `ga-disable-<ID>` kill
 *  switch is toggled on every navigation so a later Reject stops all hits.
 *  Reacts to the consent context, so Accept/geo-resolve loads GA without a
 *  page reload. Self-exclusion via the cw_skip_analytics flag (?skip-analytics). */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const { consent } = useConsent();
  const [loadScript, setLoadScript] = useState(false);
  // The first allowed page_view comes from gtag('config') on load; skip the
  // manual send on that render so it is not counted twice.
  const initialized = useRef(false);

  useEffect(() => {
    let skip = false;
    try {
      skip = localStorage.getItem(SKIP_FLAG) === "1";
    } catch {}
    const ok = consent.analytics === 1 && !skip;

    const w = window as unknown as GtagWindow;
    w[`ga-disable-${GA_ID}`] = !ok;
    if (!ok) return;

    setLoadScript(true);

    if (!initialized.current) {
      initialized.current = true; // config() already sent the initial page_view
      return;
    }
    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, consent.analytics]);

  if (!loadScript) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            // Measurement only, no ad-tech. Without these, gtag still pings
            // stats.g.doubleclick.net and www.google.com/g/collect on every
            // pageview even with Google Signals switched off at the property.
            // The site CSP blocks both, so the only effect was a console error
            // per pageview; this stops the attempt at the source instead.
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}
