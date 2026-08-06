// HERO CAPSULE -- the only H1. Eyebrow, gradient title, answer-first lede, CTA.
// Content-track section ON PURPOSE: the decorative art column anchors absolute
// right:0 against the section box, so the chips' renderable space is CAPPED at
// the content rail (the RATES edge) exactly like the web-development hero. Not
// .full, not a reveal section. (CWS-DESIGN-SYSTEM rule 14.)
//
// Variants (off-global, per placement):
//  - service (default): lane-based 3-level breadcrumb + the Service `answer`.
//  - standalone: pass `crumbs` (2-level) + `lede` for the hand-authored pages
//    (about/rates/faqs/contact); `cta` is optional; `titleReveal` wraps the H1
//    in the TitleReveal art (the /about/ signature); `className` adds a
//    page-scoped hook (about-hero, rates-hero, ...).

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { type Prompted, isPrompt } from "@/lib/service";
import { cx } from "@/lib/capsule";
import { Prompt } from "@/components/Prompt";
import { TitleReveal } from "@/components/art/TitleReveal";
import { HeroArtStage } from "@/components/HeroArtStage";
import { SectionShell } from "@/components/capsules/SectionShell";
import { CtaButton } from "@/components/capsules/shared";

export type Crumb = { label: string; href?: string };

export type HeroCapsuleProps = {
  // service-hero breadcrumb source (used when `crumbs` is not given)
  lane?: string;
  laneLabel?: string;
  title: string;
  titleNode?: ReactNode;
  eyebrow: string;
  eyebrowNode?: ReactNode;
  answer?: ReactNode | Prompted;
  heroArt?: ReactNode;
  cta?: { href: string; buttonLabel: string; arrow?: "right" | "down" };
  // Optional SECOND cta, rendered as the ghost/outline button beside the first.
  // For heroes that need both an on-page jump and a link off the page.
  ctaSecondary?: { href: string; buttonLabel: string; arrow?: "right" | "down" };
  // standalone overrides
  crumbs?: Crumb[];
  lede?: ReactNode;
  titleReveal?: string; // art image url -> wrap H1 in <TitleReveal>
  className?: string;
};

export function HeroCapsule({
  lane,
  laneLabel,
  title,
  titleNode,
  eyebrow,
  eyebrowNode,
  answer,
  heroArt,
  cta,
  ctaSecondary,
  crumbs,
  lede,
  titleReveal,
  className,
}: HeroCapsuleProps) {
  const h1 = (
    <h1 className="svc-hero__title">
      <span className="text-gradient">{titleNode ?? title}</span>
    </h1>
  );

  return (
    <SectionShell reveal={false} className={cx("svc-hero", className)}>
      {heroArt && <HeroArtStage>{heroArt}</HeroArtStage>}
      <nav className="svc-crumbs" aria-label="Breadcrumb">
        {crumbs ? (
          crumbs.map((c, i) => (
            <Fragment key={i}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {c.href ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
            </Fragment>
          ))
        ) : (
          <>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${lane}/`}>{laneLabel}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </>
        )}
      </nav>

      <p className="eyebrow">{eyebrowNode ?? eyebrow}</p>
      {titleReveal ? (
        <TitleReveal artImageUrl={titleReveal}>{h1}</TitleReveal>
      ) : (
        h1
      )}
      {/* Answer-first: quotable in the first 100 words. */}
      <p className="svc-lede measure-prose">
        {lede ??
          (isPrompt(answer) ? (
            <Prompt label={answer.label} brief={answer.brief} />
          ) : (
            answer
          ))}
      </p>

      {cta && (
        <div className="svc-hero__cta">
          <CtaButton href={cta.href} label={cta.buttonLabel} arrow={cta.arrow} />
          {ctaSecondary && (
            <CtaButton
              href={ctaSecondary.href}
              label={ctaSecondary.buttonLabel}
              arrow={ctaSecondary.arrow}
              variant="ghost"
            />
          )}
        </div>
      )}
    </SectionShell>
  );
}
