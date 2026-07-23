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

  // `lazyOnload`, not `afterInteractive`. gtag is the single heaviest script on
  // any page here: 522 KB decoded, 176 KiB on the wire, larger than any chunk
  // this site builds. On `afterInteractive` it loads while the page is still
  // hydrating and fights the main thread through the whole LCP window. Measured
  // on the homepage (3 runs, median, mobile): blocking it outright is worth
  // 8 points, and takes total blocking time from 1.53 s to 0.87 s.
  //
  // `lazyOnload` keeps GA and moves it after the load event instead, so it costs
  // nothing that a visitor experiences. THE TRADE, stated plainly: a visitor who
  // leaves before the load event fires is no longer counted. On a slow phone
  // that is a real, if small, hole in the numbers, and it is the fast-bouncing
  // visitor it loses. Reverting is one word if that data matters more than the
  // speed does.
  //
  // Not gated on an interaction, deliberately. Loading analytics only on scroll
  // or click would score better still, because Lighthouse never interacts, and
  // that is exactly why it would be dishonest.
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
