// HERO CAPSULE -- the only H1. Eyebrow, gradient title, answer-first lede, CTA.
// Content-track section ON PURPOSE: the decorative art column anchors absolute
// right:0 against the section box, so the chips' renderable space is CAPPED at
// the content rail (the RATES edge) exactly like the web-development hero. Not
// .full, not a reveal section. (CWS-DESIGN-SYSTEM rule 14.)

import Link from "next/link";
import type { ReactNode } from "react";
import { type Prompted, isPrompt } from "@/lib/service";
import { Prompt } from "@/components/Prompt";
import { HeroArtStage } from "@/components/HeroArtStage";
import { SectionShell } from "@/components/capsules/SectionShell";
import { CtaButton } from "@/components/capsules/shared";

export type HeroCapsuleProps = {
  lane: string;
  laneLabel: string;
  title: string;
  titleNode?: ReactNode;
  eyebrow: string;
  answer: ReactNode | Prompted;
  heroArt?: ReactNode;
  cta: { href: string; buttonLabel: string };
};

export function HeroCapsule({
  lane,
  laneLabel,
  title,
  titleNode,
  eyebrow,
  answer,
  heroArt,
  cta,
}: HeroCapsuleProps) {
  return (
    <SectionShell reveal={false} className="svc-hero">
      {heroArt && <HeroArtStage>{heroArt}</HeroArtStage>}
      <nav className="svc-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${lane}/`}>{laneLabel}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{title}</span>
      </nav>

      <p className="eyebrow">{eyebrow}</p>
      <h1 className="svc-hero__title">
        <span className="text-gradient">{titleNode ?? title}</span>
      </h1>
      {/* Answer-first: quotable in the first 100 words. */}
      <p className="svc-lede measure-prose">
        {isPrompt(answer) ? (
          <Prompt label={answer.label} brief={answer.brief} />
        ) : (
          answer
        )}
      </p>

      <div className="svc-hero__cta">
        <CtaButton href={cta.href} label={cta.buttonLabel} />
      </div>
    </SectionShell>
  );
}
