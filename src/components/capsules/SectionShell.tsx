// =====================================================================
// chadworks Static -- SECTION SHELL (the shared section primitive)
// Every capsule renders through this. It owns the page-shell .section grid,
// the .full breakout, the .reveal hook, and an OPTIONAL background-texture
// layer that sits BENEATH the content (the structural fix for the grain bug:
// a `bg` node renders absolutely behind, content stays above with z-index).
//
// BYTE-STABILITY CONTRACT (Phase B): when no `bg` is passed, the children are
// rendered as DIRECT children of <section> with no wrapper, so the
// `.section > *` grid re-anchor and the exported HTML stay identical to the
// pre-refactor template. Capsules pass their exact class string via
// `className` (+ optional `trailingClassName`) so class ORDER is preserved.
// =====================================================================

import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/capsule";

type SectionShellProps = {
  // structural
  full?: boolean; // break out to full-bleed band (adds `.full`)
  reveal?: boolean; // scroll-reveal hook (adds `.reveal`); default true
  // class composition -- order is: section [full] {className} [reveal] {trailingClassName}
  className?: string; // the section-specific classes, in their existing order
  trailingClassName?: string; // classes appended AFTER `reveal` (e.g. --ondark, --dark)
  id?: string;
  style?: CSSProperties;
  // background-texture layer (Phase F): rendered absolutely BENEATH content.
  // When set, the section becomes a positioned stacking context and the bg sits
  // at z-index 0 with content lifted to z-index 1. When unset, nothing changes.
  bg?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  full,
  reveal = true,
  className,
  trailingClassName,
  id,
  style,
  bg,
  children,
}: SectionShellProps) {
  const cls = cx(
    "section",
    full && "full",
    !!bg && "cw-shell--has-bg",
    className,
    reveal && "reveal",
    trailingClassName
  );

  // No background layer: render children directly (byte-stable, no wrapper).
  if (!bg) {
    return (
      <section className={cls} id={id} style={style}>
        {children}
      </section>
    );
  }

  // Background layer present: texture sits behind, content is lifted above.
  // Children remain direct children of <section> so the grid re-anchor holds;
  // `.cw-shell--has-bg > *` gets position/z-index from CSS, and the bg layer is
  // marked so it is excluded from that lift.
  return (
    <section className={cls} id={id} style={style}>
      <div className="cw-shell__bg" aria-hidden="true">
        {bg}
      </div>
      {children}
    </section>
  );
}
