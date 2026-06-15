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
