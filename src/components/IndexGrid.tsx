// IndexGrid -- the shared layout for the two design-lane index pages
// (/my-industry-specialties/ and /my-service-areas/). A hero (eyebrow + H1 +
// lede) followed by a compact responsive card grid, reusing the existing
// cross-industry grid classes (cw-art-others__*) that the niche pages already
// use. Industry and location are NEVER mixed: each index renders its own set.
// Server component.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";

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
      <SectionShell reveal={false} className="svc-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="svc-lede measure-prose">{lede}</p>
      </SectionShell>

      <SectionShell className="cw-art-others">
        <div className="cw-art-others__grid">
          {items.map((it) => (
            <Link key={it.href} className="cw-art-others__card" href={it.href}>
              <div className="cw-art-others__name">{it.name}</div>
              <div className="cw-art-others__desc">{it.desc}</div>
            </Link>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
