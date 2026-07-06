/* Cookie-consent logic for chadworks (GA4-only, static site).
 *
 * chadworks runs one optional tracker: Google Analytics 4. Everything here
 * gates it behind consent per the LEIT Tracking and Consent Standard. There is
 * no backend and no Cloudflare, so the geo-aware default is resolved by a
 * client fetch to the LEIT geo endpoint (see fetchGeoDefault); the choice is
 * stored only in a first-party cookie.
 *
 * Runtime source of truth is the `cw_cookie_consent` cookie
 * (essential:1|analytics:X), readable by the pre-hydration inline script in the
 * root layout, which sets window.__CW_CONSENT__ BEFORE React hydrates so
 * analyticsAllowed() is correct on first paint. Geo: EU/EEA/UK/CH and
 * California default to opt-in (analytics off until accepted); everywhere else
 * defaults to opt-out. California is opt-in because CIPA treats a pre-consent
 * third-party tracker as a per-visit wiretap/pen-register liability.
 */

export const CONSENT_COOKIE = "cw_cookie_consent";
export const GEO_DEFAULT_COOKIE = "cw_geo_default";
export const SKIP_FLAG = "cw_skip_analytics";
export const CONSENT_MAX_AGE_DAYS = 365;

// The LEIT-owned geo lookup (same droplet + MaxMind City DB the flagships use).
export const GEO_ENDPOINT = "https://leit.libraengine.com/api/geo";

export type Consent = {
  essential: 1; // always on
  analytics: 0 | 1;
};

export const DEFAULT_DENY: Consent = { essential: 1, analytics: 0 };
export const DEFAULT_ALLOW: Consent = { essential: 1, analytics: 1 };

// EU + EEA + UK (+ Switzerland) ISO-3166-1 alpha-2. These regions get opt-in.
export const OPT_IN_COUNTRIES = new Set<string>([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE", // EU27
  "IS","LI","NO", // EEA
  "GB","CH",      // UK + Switzerland
]);

// US states that get opt-in (default-deny), keyed by ISO-3166-2 subdivision
// code. Only consulted when country === "US" so it never collides with
// Canada's "CA" country code. California is here because CIPA's private right
// of action makes a pre-consent tracker a per-visit liability.
export const OPT_IN_US_REGIONS = new Set<string>([
  "CA", // California -- CIPA / CPRA
]);

/** True when the visitor's geo requires opt-in (analytics off until accepted). */
export function isOptInGeo(
  country?: string | null,
  region?: string | null,
): boolean {
  if (country && OPT_IN_COUNTRIES.has(country)) return true;
  if (country === "US" && region && OPT_IN_US_REGIONS.has(region)) return true;
  return false;
}

export function parseConsent(str?: string | null): Consent {
  const c: Consent = { essential: 1, analytics: 0 };
  if (str) {
    str.split("|").forEach((part) => {
      const [k, v] = part.split(":");
      if (k === "analytics") c.analytics = parseInt(v, 10) ? 1 : 0;
    });
  }
  c.essential = 1;
  return c;
}

export function serializeConsent(c: Consent): string {
  return `essential:1|analytics:${c.analytics}`;
}

export type ConsentWindow = {
  decided: boolean;
  analytics: number;
};

declare global {
  interface Window {
    __CW_CONSENT__?: ConsentWindow;
  }
}

/** True only when analytics may run: not a self/test browser AND analytics
 *  consent granted. Read by the GA surface. SSR-safe (false on the server). */
export function analyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(SKIP_FLAG) === "1") return false; // self/test
  } catch {}
  const c = window.__CW_CONSENT__;
  return !!(c && c.analytics);
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export function readConsentCookieClient(): string | null {
  return readCookie(CONSENT_COOKIE);
}

export function readGeoDefaultClient(): string | null {
  return readCookie(GEO_DEFAULT_COOKIE);
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + CONSENT_MAX_AGE_DAYS * 86400000);
  document.cookie =
    `${name}=${encodeURIComponent(value)}` +
    `;expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

/** Persist the choice to the cookie + window bridge (client only). */
export function applyConsentClient(c: Consent): void {
  writeCookie(CONSENT_COOKIE, serializeConsent(c));
  if (typeof window !== "undefined") {
    window.__CW_CONSENT__ = { decided: true, analytics: c.analytics };
  }
}

export function writeGeoDefault(def: "allow" | "deny"): void {
  writeCookie(GEO_DEFAULT_COOKIE, def);
}

/** Resolve the pre-consent default from the LEIT geo endpoint.
 *  "allow" = opt-out region (analytics may load, still declinable).
 *  "deny"  = opt-in region (analytics stay off until accepted).
 *  null    = geo unknown or the lookup failed -> caller keeps the safe deny
 *            and does NOT cache, so it retries next visit (fail closed). */
export async function fetchGeoDefault(): Promise<"allow" | "deny" | null> {
  try {
    const r = await fetch(GEO_ENDPOINT, { headers: { Accept: "application/json" } });
    if (!r.ok) return null;
    const d = (await r.json()) as { country?: string | null; region?: string | null };
    if (!d || !d.country) return null; // unknown -> fail closed to opt-in
    return isOptInGeo(d.country, d.region) ? "deny" : "allow";
  } catch {
    return null;
  }
}
