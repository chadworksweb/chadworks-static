"use client";

import { useConsent } from "./ConsentProvider";

/* Persistent "Cookie preferences" control for the footer. Reopens the consent
   manager so a visitor can change or withdraw consent at any time. Never gated
   by launch.ts -- it must always be reachable. */
export function CookiePreferencesButton() {
  const { openManager } = useConsent();
  return (
    <button type="button" className="site-footer__prefs-btn" onClick={openManager}>
      Cookie preferences
    </button>
  );
}
