// SPLIT CHECKLIST CAPSULE -- a two-column row: a checklist on one side, an
// optional image on the other, with the side switchable per placement.
//
// TRACED from the chadlewine Sovereignty Audit page's bk-what__row (which runs
// twice, mirrored: checklist-left/art-right for "What is a Sovereignty Audit?",
// then art-left/checklist-right for "What you leave with"). Rebuilt on CWS
// tokens. The alternation is the point -- two identical rows in a row read as a
// template, so `artSide` flips the second one.
//
// `art` is OPTIONAL and the row collapses to a single centered measure without
// it, so a page can ship the structure before the asset exists.

import type { ReactNode } from "react";
import type { Writable } from "@/lib/service";
import type { Scheme } from "@/lib/capsule";
import { cx } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W, CtaButton } from "@/components/capsules/shared";
import { GlyphTitleBar } from "@/components/capsules/GlyphTitleBar";

export type SplitChecklistArt = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SplitChecklistCapsuleProps = {
  heading: ReactNode;
  // Optional prose above the row.
  lead?: Writable | ReactNode;
  // The checklist. Each item leads with a bolded claim in the authored markup.
  items: (Writable | ReactNode)[];
  art?: SplitChecklistArt;
  artSide?: "left" | "right"; // default right
  // Optional prose below the row.
  footer?: Writable | ReactNode;
  cta?: { href: string; label: string };
  id?: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
  className?: string;
};

export function SplitChecklistCapsule({
  heading,
  lead,
  items,
  art,
  artSide = "right",
  footer,
  cta,
  id,
  className,
}: SplitChecklistCapsuleProps) {
  const artFirst = artSide === "left";
  const list = (
    <ul className="cw-split__list">
      {items.map((it, i) => (
        <li key={i}>
          <W value={it} />
        </li>
      ))}
    </ul>
  );
  const figure = art ? (
    <div className="cw-split__art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art.src} alt={art.alt} width={art.width} height={art.height} />
    </div>
  ) : null;

  return (
    <SectionShell className={cx("svc-block cw-split", className)} id={id}>
      <GlyphTitleBar>{heading}</GlyphTitleBar>
      {lead && (
        <p className="svc-block__body measure-prose cw-split__lead">
          <W value={lead} />
        </p>
      )}
      <div className={cx("cw-split__row", !art && "cw-split__row--solo")}>
        {artFirst && figure}
        <div className="cw-split__half">{list}</div>
        {!artFirst && figure}
      </div>
      {footer && (
        <p className="svc-block__body measure-prose cw-split__footer">
          <W value={footer} />
        </p>
      )}
      {cta && (
        <div className="cw-split__cta">
          <CtaButton href={cta.href} label={cta.label} />
        </div>
      )}
    </SectionShell>
  );
}
