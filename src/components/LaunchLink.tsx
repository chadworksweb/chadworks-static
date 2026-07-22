import Link from "next/link";
import type { ReactNode } from "react";
import { isLaunched } from "@/lib/launch";

// Renders a real link when the target route is launched (see launch.ts). When
// the target is sealed, renders the text as a non-clickable "coming soon"
// affordance with a tooltip on hover/focus -- so a sealed page is signalled, not
// silently linked out to. Pure CSS tooltip, so this stays a server component.
// Use for inline links; for standalone CTA buttons, prefer hiding the button
// entirely with `{isLaunched(href) && <Link ... />}`.
export function LaunchLink({
  href,
  children,
  className,
  soonLabel = "Coming soon",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  soonLabel?: string;
}) {
  if (isLaunched(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  // The tip hangs off a ZERO-WIDTH inline-block anchor at the START of the
  // link, not off the link span itself. A relatively-positioned INLINE element
  // that wraps across lines gives its absolute children a containing block
  // spanning the first and last line fragments, which is the full paragraph
  // width -- so the bubble landed at the paragraph's left edge instead of over
  // the words. The anchor never wraps, so the bubble sits on the link.
  return (
    <span
      className={`cw-soon${className ? ` ${className}` : ""}`}
      tabIndex={0}
      role="link"
      aria-disabled="true"
    >
      <span className="cw-soon__anchor">
        <span className="cw-soon__tip" role="tooltip">
          {soonLabel}
        </span>
      </span>
      {children}
    </span>
  );
}
