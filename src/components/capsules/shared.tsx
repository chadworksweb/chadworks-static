// =====================================================================
// chadworks Static -- SHARED CAPSULE PRIMITIVES
// Small render helpers every capsule reuses: the Writable renderer (W), the
// CTA button (THE sitewide CTA -- design-system BUTTONS standard), and the two
// inline SVG icons. Lifted verbatim from the old ServiceTemplate so the
// rendered markup stays byte-stable across the refactor.
// =====================================================================

import Link from "next/link";
import { type Writable, isPrompt } from "@/lib/service";
import { Prompt } from "@/components/Prompt";

// Render a Writable field: finished prose, or a visible TO-WRITE prompt block.
// Also accepts ReactNode (e.g. paragraphs with inline <strong> lead words).
export function W({ value }: { value: Writable | React.ReactNode }) {
  return isPrompt(value) ? (
    <Prompt label={value.label} brief={value.brief} />
  ) : (
    <>{value}</>
  );
}

// long-arrow-alt-right (Font Awesome solid) -- inline so there's no icon dep.
// `down` rotates the same glyph a quarter turn rather than shipping a second
// path, so a jump-to-the-next-section CTA reads as "keep going" without the
// button picking up a different icon weight.
export function ArrowRight({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={"svc-btn__arrow" + (down ? " svc-btn__arrow--down" : "")}
      viewBox="0 0 448 512"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
    </svg>
  );
}

// Small check mark for the assurance (risk-reversal) list.
export function CheckIcon() {
  return (
    <svg
      className="svc-assurance__check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Every CTA button: label + the default long-arrow-alt-right icon.
// THE sitewide CTA (design-system BUTTONS standard) -- standalone pages call it
// too instead of re-rendering their own button markup.
export function CtaButton({
  href,
  label,
  arrow = "right",
  variant = "solid",
}: {
  href: string;
  label: string;
  arrow?: "right" | "down";
  // "ghost" is the secondary/outline treatment; same pill and hover wipe.
  variant?: "solid" | "ghost";
}) {
  const cls = variant === "ghost" ? "svc-btn svc-btn--ghost" : "svc-btn";
  const inner = (
    <>
      <span className="svc-btn__label">{label}</span>
      <ArrowRight down={arrow === "down"} />
    </>
  );

  // A pure hash href is an IN-PAGE JUMP, not a route change. Routing it through
  // next/link makes it a client-side navigation, which updates the URL and does
  // not reliably scroll in the App Router: the button appears dead. A plain <a>
  // gets native browser hash handling instead, which also honours the target's
  // scroll-margin-top and the document's scroll-behavior.
  //
  // This is already the site's convention wherever a hash button was written by
  // hand (e.g. `<a href="#symptoms" className="svc-btn">` on the AI-gen audit
  // page). This makes CtaButton agree with it rather than being the exception.
  if (href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
