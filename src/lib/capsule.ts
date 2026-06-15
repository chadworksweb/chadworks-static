// =====================================================================
// chadworks Static -- CAPSULE PRIMITIVES (the global-capsule contract)
// A Capsule is a self-contained, global section component. Every capsule
// accepts this common base prop set PLUS its own content props, and renders
// through <SectionShell> so it never re-implements the page-shell grid,
// width, scheme, or reveal. See CWS-GLOBAL-CAPSULES-PLAN.md.
// =====================================================================

import type { ReactNode } from "react";

// The three named background treatments (mirrors CWS-DESIGN-SYSTEM "SECTION
// COLOR SCHEMES"). `inverted` is a dark band; rule 9 forbids two darks in a row.
export type Scheme = "default" | "alternate" | "inverted";

// The common placement-override layer every capsule accepts (off-global, per
// instance). Defaults live in the capsule; overrides are additive, never
// required.
export type CapsuleBase = {
  scheme?: Scheme; // background treatment (default = the capsule's own default)
  variant?: string; // capsule-specific layout/style variant (enumerated per capsule)
  heading?: ReactNode; // override the default/derived heading
  id?: string; // anchor id for in-page links
  className?: string; // one-off style hook for THIS placement only
  hidden?: boolean; // drop this placement without removing the call
  reveal?: boolean; // intersection-reveal on/off (default on)
  width?: "rail" | "full"; // content-rail vs full-bleed band
};

// Whether a scheme renders as a dark (inverted) band. PageComposer's rule-9
// adjacency pass (Phase C) uses this to forbid two consecutive darks.
export function isDarkScheme(s?: Scheme): boolean {
  return s === "inverted";
}

// Join a list of class fragments, dropping falsy entries. Capsules build their
// exact class string (preserving the existing svc-* / cw-* ordering) and hand
// it to SectionShell, so the rendered markup stays byte-stable across the
// template -> capsule refactor.
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------
// PROCESS / APPROACH column count -- chosen per placement so rows always fill
// completely (no half-filled last row). Author varies the step COUNT
// (3 / 5 / 6 / 9 ...) and the grid adapts COLUMNS: 3-up when divisible by 3,
// 2-up for remaining evens, a single full row for a small prime like 5. See
// CWS-DESIGN-SYSTEM ("filled rows", rule 8).
// ---------------------------------------------------------------------
export function stepColumns(n: number): number {
  if (n % 3 === 0) return 3; // 3, 6, 9 -> clean 3-up rows
  if (n % 2 === 0) return 2; // 4, 8 -> 2-up rows
  if (n <= 5) return n; // 5 (or other small primes) -> one full row
  return 3; // fallback: large/awkward count, accept a reflow
}

// Lane accent colors, in order (deep indigo, brand glow, teal, copper) --
// the septic per-niche accent trio extended with the copper outlier.
export const LANE_COLORS = ["#243989", "#8054bc", "#4a6b6e", "#d4a574"];

// ---------------------------------------------------------------------
// KEY-FACTS ("At a glance") BAND ARC -- the build-time dark-blue -> lavender
// ramp. The arc spans every band EXCEPT the last (always white); lavender is
// pinned second-to-last so adjacent bands keep real contrast. Pure functions,
// run in a server component at BUILD time (the hex is baked into the static
// HTML and only recomputes on the next build). These four MIRROR the CSS color
// tokens 1:1 -- keep in sync if the tokens change.
// ---------------------------------------------------------------------
const BAND_DARK = "#243989"; // = --dark-bg
const BAND_LAVENDER = "#ede7f6"; // = --bg-surface
const BAND_WHITE = "#ffffff"; // = --bg-base
const BAND_OUTLIER = "#8054bc"; // = --accent (outlier band)
const RAMP_ANCHORS = [BAND_DARK, BAND_LAVENDER]; // dark blue -> lavender; white is the fixed final cap

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function toHex(n: number) {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
}
// Color at position t in [0,1] across the piecewise-linear anchor ramp.
function rampColor(t: number) {
  const span = RAMP_ANCHORS.length - 1;
  const seg = Math.min(Math.floor(t * span), span - 1);
  const f = t * span - seg;
  const a = hexToRgb(RAMP_ANCHORS[seg]);
  const b = hexToRgb(RAMP_ANCHORS[seg + 1]);
  return `#${toHex(a.r + (b.r - a.r) * f)}${toHex(a.g + (b.g - a.g) * f)}${toHex(a.b + (b.b - a.b) * f)}`;
}
// Perceptual luminance test -> whether the band needs light (inverted) text.
function isOnDark(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 150;
}
// The band-arc engine -- CALLED by the KeyFacts/EraTimeline capsules and the
// /about/ era timeline, never rebuilt (CWS-COMPONENT-REGISTRY rule).
export function statementTone(i: number, total: number, outliers?: number[]) {
  let bg: string;
  if (i === total - 1) bg = BAND_WHITE; // final band always white
  else if (outliers?.includes(i)) bg = BAND_OUTLIER; // outlier, when needed
  else {
    // Ramp dark blue -> lavender over bands 0..(total-2): the second-to-last
    // band lands exactly on lavender, right before the white cap.
    const denom = total - 2;
    bg = rampColor(denom <= 0 ? 0 : i / denom);
  }
  return { bg, onDark: isOnDark(bg) };
}
