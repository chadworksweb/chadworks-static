import Link from "next/link";
import type { ReactNode } from "react";
import { isLaunched } from "@/lib/launch";

// Renders a real link when the target route is launched (see launch.ts), and
// plain text otherwise -- so a sealed page is never linked out to from prose.
// Use for inline links; for standalone CTA buttons, prefer hiding the button
// entirely with `{isLaunched(href) && <Link ... />}`.
export function LaunchLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  if (isLaunched(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <span className={className}>{children}</span>;
}
