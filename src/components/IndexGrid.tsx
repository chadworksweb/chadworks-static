// IndexGrid -- the shared layout for the two design-lane index pages
// (/industries-served/ and /my-service-areas/). A hero (eyebrow + H1 +
// lede) followed by a compact responsive card grid, reusing the existing
// cross-industry grid classes (cw-industries__*) that the niche pages already
// use. Industry and location are NEVER mixed: each index renders its own set.
// Server component.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { isLaunched } from "@/lib/launch";

export type IndexItem = { name: string; desc: string; href: string };

export function IndexGrid({
  eyebrow,
  title,
  lede,
  items,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  items: IndexItem[];
}) {
  return (
    <>
      <SectionShell reveal={false} className="svc-hero svc-hero--index">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="svc-lede measure-prose">{lede}</p>
      </SectionShell>

      <SectionShell className="cw-industries">
        <div className="cw-industries__grid">
          {items.map((it) => {
            const inner = (
              <>
                <div className="cw-industries__name">{it.name}</div>
                <div className="cw-industries__desc">{it.desc}</div>
              </>
            );
            // Sealed (not-yet-launched) industries render as dim, non-clickable
            // cards -- shows the full roster without linking into a noindex page.
            return isLaunched(it.href) ? (
              <Link key={it.href} className="cw-industries__card" href={it.href}>
                {inner}
              </Link>
            ) : (
              <div
                key={it.href}
                className="cw-industries__card cw-industries__card--disabled"
                aria-disabled="true"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </SectionShell>
    </>
  );
}
