"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type Consent,
  DEFAULT_DENY,
  SKIP_FLAG,
  applyConsentClient,
  fetchGeoDefault,
  readConsentCookieClient,
  readGeoDefaultClient,
  writeGeoDefault,
} from "@/lib/consent";
import { ConsentBanner } from "./ConsentBanner";

type ConsentCtx = {
  consent: Consent;
  decided: boolean;
  /** Open the manager (from the footer "Cookie preferences" button). */
  openManager: () => void;
  /** Persist a new choice (cookie + window bridge). */
  update: (c: Consent) => void;
};

const Ctx = createContext<ConsentCtx | null>(null);

export function useConsent(): ConsentCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useConsent must be used within ConsentProvider");
  return c;
}

function fromWindow(): { decided: boolean; consent: Consent } {
  if (typeof window !== "undefined" && window.__CW_CONSENT__) {
    const w = window.__CW_CONSENT__;
    return {
      decided: !!w.decided,
      consent: { essential: 1, analytics: w.analytics ? 1 : 0 },
    };
  }
  return { decided: false, consent: DEFAULT_DENY };
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // Stable SSR/first-paint values; real state resolves post-mount from the
  // window bridge (set by the inline bootstrap before hydration). Avoids a
  // hydration mismatch and any banner flash for returning visitors.
  const [mounted, setMounted] = useState(false);
  const [decided, setDecided] = useState(false);
  const [consent, setConsent] = useState<Consent>(DEFAULT_DENY);
  const [managerOpen, setManagerOpen] = useState(false);

  const update = useCallback((next: Consent) => {
    applyConsentClient(next); // cookie + window bridge
    setDecided(true);
    setConsent(next);
    setManagerOpen(false);
  }, []);

  const openManager = useCallback(() => setManagerOpen(true), []);

  useEffect(() => {
    const cur = fromWindow();
    setDecided(cur.decided);
    setConsent(cur.consent);
    setMounted(true);

    // Self/test exclusion toggle: ?skip-analytics=1 sets it, =0 clears it.
    try {
      const p = new URLSearchParams(window.location.search).get("skip-analytics");
      if (p === "1") localStorage.setItem(SKIP_FLAG, "1");
      else if (p === "0") localStorage.removeItem(SKIP_FLAG);
    } catch {}

    // Geo-aware default, resolved client-side (static site, no edge). Only on a
    // truly fresh visit: no saved choice and no cached geo default yet.
    if (
      !cur.decided &&
      !readConsentCookieClient() &&
      !readGeoDefaultClient()
    ) {
      fetchGeoDefault().then((def) => {
        if (!def) return; // unknown/failed -> keep the safe deny, retry next visit
        writeGeoDefault(def);
        if (def === "allow" && typeof window !== "undefined") {
          // Opt-out region, pre-consent: analytics may load (banner still shows
          // so the visitor can decline). Update the bridge + context so GA loads.
          window.__CW_CONSENT__ = { decided: false, analytics: 1 };
          setConsent({ essential: 1, analytics: 1 });
        }
      });
    }
  }, []);

  return (
    <Ctx.Provider value={{ consent, decided, openManager, update }}>
      {children}
      {mounted && (!decided || managerOpen) && (
        <ConsentBanner
          initial={consent}
          forceManage={managerOpen}
          onSave={update}
          onClose={managerOpen ? () => setManagerOpen(false) : undefined}
        />
      )}
    </Ctx.Provider>
  );
}
