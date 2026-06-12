// =====================================================================
// chadworks Static -- SERVICE TEMPLATE
// The base template EVERY Service page inherits. Takes one Service object
// and renders the canonical sequence + the GEO JSON-LD. No Service page
// hand-rolls layout; they all feed this. See src/lib/service.ts.
//
// Rendering rules honored here:
//  - page-shell grid only: site-width sections by default, .full to bleed.
//  - answer-first: the lede is the first prose an engine sees after the H1.
//  - one H1 (the hero); H2 per major block; H3 inside.
//  - all JSON-LD inline in the static HTML.
// =====================================================================

import Link from "next/link";
import {
  type Service,
  type Writable,
  isPrompt,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/service";
import { Prompt } from "@/components/Prompt";
import { GrainField } from "@/components/GrainField";
import { LeadForm } from "@/components/forms/LeadForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroArtStage } from "@/components/HeroArtStage";
import { PageMotion } from "@/components/PageMotion";
import { RippleGrid } from "@/components/ripple/RippleGrid";
import { Ribbon } from "@/components/Ribbon";
import { ProblemMore } from "@/components/ProblemMore";

function JsonLd({ data }: { data: object | null }) {
  // Inline structured data. dangerouslySetInnerHTML is the standard, safe
  // pattern for JSON-LD (the payload is our own static data, no user input).
  // Skips rendering when the builder returns null (e.g. no written FAQs yet).
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Render a Writable field: finished prose, or a visible TO-WRITE prompt block.
// Also accepts ReactNode (e.g. paragraphs with inline <strong> lead words).
function W({ value }: { value: Writable | React.ReactNode }) {
  return isPrompt(value) ? (
    <Prompt label={value.label} brief={value.brief} />
  ) : (
    <>{value}</>
  );
}

// long-arrow-alt-right (Font Awesome solid) -- inline so there's no icon dep.
function ArrowRight() {
  return (
    <svg
      className="svc-btn__arrow"
      viewBox="0 0 448 512"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
    </svg>
  );
}

// Small check mark for the assurance (risk-reversal) list.
function CheckIcon() {
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

// Process / approach column count, chosen PER PAGE so rows always fill
// completely (no half-filled last row). The author varies the step COUNT
// (3 / 5 / 6 / 9 ...) and the grid adapts its COLUMNS to match: 3-up when the
// count divides by 3, 2-up for the remaining even counts, and a single full row
// for a small prime like 5. See CWS-DESIGN-SYSTEM.md ("filled rows").
function stepColumns(n: number): number {
  if (n % 3 === 0) return 3; // 3, 6, 9 -> clean 3-up rows
  if (n % 2 === 0) return 2; // 4, 8 -> 2-up rows
  if (n <= 5) return n; // 5 (or other small primes) -> one full row
  return 3; // fallback: large/awkward count, accept a reflow
}

// Key-facts ("At a glance") band colors. The arc ramps dark blue -> lavender
// across every band EXCEPT the last, which is always white. Lavender is pinned
// as the second-to-last band (right before white); the bands above it spread
// evenly from dark blue up to lavender, so each step keeps real contrast instead
// of crowding three near-white tones at the bottom. Fresh in-between hexes are
// computed for the count.
// This runs in the server component at BUILD time (not per load): the hex is
// baked into the static HTML and only recomputes on the next build.
//
// Hard rules: the FINAL band is always white (section closes light); an OUTLIER
// tone (purple accent) is available for a single band that must stand apart, via
// service.outlierFacts. Section schemes / inverted-adjacency do NOT govern bands.
// These four MIRROR the CSS color tokens 1:1. The arc is computed in JS at build
// time, so it can't read CSS vars -- keep these in sync if the tokens change:
const BAND_DARK = "#243989"; // = --dark-bg
const BAND_LAVENDER = "#ede7f6"; // = --bg-surface
const BAND_WHITE = "#ffffff"; // = --bg-base
const BAND_OUTLIER = "#8054bc"; // = --accent (outlier band)
const RAMP_ANCHORS = [BAND_DARK, BAND_LAVENDER]; // dark blue -> lavender; white is the fixed final cap

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function toHex(n: number) {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
}
// Color at position t in [0,1] across the piecewise-linear anchor ramp.
function rampColor(t: number) {
  const span = RAMP_ANCHORS.length - 1;
  const seg = Math.min(Math.floor(t * span), span - 1);
  const f = t * span - seg;
  const a = hexToRgb(RAMP_ANCHORS[seg]);
  const b = hexToRgb(RAMP_ANCHORS[seg + 1]);
  return `#${toHex(a.r + (b.r - a.r) * f)}${toHex(a.g + (b.g - a.g) * f)}${toHex(a.b + (b.b - a.b) * f)}`;
}
// Perceptual luminance test -> whether the band needs light (inverted) text.
function isOnDark(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 150;
}
function statementTone(i: number, total: number, outliers?: number[]) {
  let bg: string;
  if (i === total - 1) bg = BAND_WHITE; // final band always white
  else if (outliers?.includes(i)) bg = BAND_OUTLIER; // outlier, when needed
  else {
    // Ramp dark blue -> lavender over bands 0..(total-2): the second-to-last
    // band lands exactly on lavender, right before the white cap.
    const denom = total - 2;
    bg = rampColor(denom <= 0 ? 0 : i / denom);
  }
  return { bg, onDark: isOnDark(bg) };
}

// Lane accent colors, in order (deep indigo, brand glow, teal, copper) --
// the septic per-niche accent trio extended with the copper outlier.
const LANE_COLORS = ["#243989", "#8054bc", "#4a6b6e", "#d4a574"];

// Every CTA button: label + the default long-arrow-alt-right icon.
function CtaButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="svc-btn">
      <span className="svc-btn__label">{label}</span>
      <ArrowRight />
    </Link>
  );
}

export default function ServiceTemplate({ service }: { service: Service }) {
  const s = service;

  // Hard rule: two fully inverted (dark) containers can never be consecutive.
  // The CTA is always a dark band, so the FAQ takes its dark treatment ONLY
  // when a light section (assurance / next-steps) sits between it and the CTA.
  // Otherwise the FAQ renders light and the only adjacent dark is the CTA.
  const faqDark = Boolean(s.assurance || s.nextSteps);

  return (
    <>
      {/* NO PARTICLES anywhere on the site (Chad, 2026-06-11). The Ambient
          drifting-dot island was removed from the template under that rule. */}
      <PageMotion />
      <JsonLd data={buildBreadcrumbJsonLd(s)} />
      <JsonLd data={buildServiceJsonLd(s)} />
      <JsonLd data={buildFaqJsonLd(s)} />

      {/* HERO -- the only H1. Eyebrow, gradient title, answer-first lede, CTA.
          Content-track section ON PURPOSE: the decorative art column anchors
          absolute right:0 against the section box, so the chips' renderable
          space is CAPPED at the content rail (the RATES edge) exactly like
          the web-development hero. Do not make this .full. */}
      <section className="section svc-hero">
        {s.heroArt && <HeroArtStage>{s.heroArt}</HeroArtStage>}
        <nav className="svc-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${s.lane}/`}>{s.laneLabel}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{s.title}</span>
        </nav>

        <p className="eyebrow">{s.eyebrow}</p>
        <h1 className="svc-hero__title">
          <span className="text-gradient">{s.titleNode ?? s.title}</span>
        </h1>
        {/* Answer-first: quotable in the first 100 words. */}
        <p className="svc-lede measure-prose">
          {isPrompt(s.answer) ? (
            <Prompt label={s.answer.label} brief={s.answer.brief} />
          ) : (
            s.answer
          )}
        </p>

        <div className="svc-hero__cta">
          <CtaButton href={s.cta.href} label={s.cta.buttonLabel} />
        </div>
      </section>

      {/* KEY FACTS -- luxury statement panels. Each fact is its own full-width
          band whose background is interpolated dark -> light across the count
          (statementTone, build-time) so the descent stays smooth and the final
          band is always white. The visible <h2> is the keyword-bearing eyebrow. */}
      <section className="section full svc-statements-intro reveal">
        <h2 className="svc-statements__heading">{s.keyFactsHeading ?? "At a glance"}</h2>
      </section>
      {s.keyFacts.map((fact, i) => {
        const tone = statementTone(i, s.keyFacts.length, s.outlierFacts);
        return (
          <section
            key={i}
            className={`section full svc-statement reveal${tone.onDark ? " svc-statement--ondark" : ""}`}
            style={{ background: tone.bg, color: tone.onDark ? "var(--dark-text)" : undefined }}
          >
            <div className="svc-statement__row">
              <span className="svc-statement__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="svc-statement__text">
                <W value={fact} />
              </p>
            </div>
          </section>
        );
      })}

      {/* PROBLEM -- full-bleed, ribbons + knockout always (the sitewide
          signature). A page that supplies `problemArt` gets its extra visual
          rendered BELOW the prose, growing the section downward exactly like
          the pop-down does (the sticky ribbon rail already handles growth). */}
      <section className="section full svc-block svc-problem reveal">
        {/* visible colored ribbons (behind) -- sticky band inside a full-height
            rail: stays half-visible at the viewport top while the opened
            pop-down glides over it, until the section is scrolled through. */}
        <div className="svc-gradient-pin">
          <Ribbon className="svc-gradient" />
        </div>

        {/* real, accessible text -- dark blue over the page */}
        <h2 className="svc-block__heading">{s.problem.heading}</h2>
        {s.problem.subheading && (
          <h3 className="svc-block__subheading">{s.problem.subheading}</h3>
        )}
        {s.problem.more ? (
          // Prose lifted off the ribbons into a frosted pop-down (CTA trigger).
          // The body leads the panel; `more.paragraphs` expand on it.
          <ProblemMore trigger={s.problem.more.trigger}>
            <p className="svc-block__body"><W value={s.problem.body} /></p>
            {s.problem.more.paragraphs.map((p, i) => (
              <p key={i} className="svc-block__body"><W value={p} /></p>
            ))}
          </ProblemMore>
        ) : (
          <p className="svc-block__body measure-prose"><W value={s.problem.body} /></p>
        )}

        {/* Knockout overlay: a white-on-black coverage pass of the same ribbons,
            multiplied by an aria-hidden white duplicate of the text, then screened
            over the section -> the copy turns white only where a ribbon is under
            it. The duplicate is presentational; the heading above is the only
            real one in the DOM. */}
        <div className="svc-knockout" aria-hidden="true">
          <Ribbon className="svc-knockout__cov" mask />
          <div className="svc-knockout__text">
            <div className="svc-block__heading">{s.problem.heading}</div>
            {s.problem.subheading && (
              <div className="svc-block__subheading">{s.problem.subheading}</div>
            )}
            <div className="svc-block__body measure-prose"><W value={s.problem.body} /></div>
          </div>
        </div>
      </section>

      {/* PROBLEM ART (optional) -- the page's interactive demo in its OWN
          clean section, clearly separated from the ribbon band above. */}
      {s.problemArt && (
        <section className="section full svc-problem-art-section reveal">
          <div className="svc-problem-art">{s.problemArt}</div>
        </section>
      )}

      {/* APPROACH -- numbered steps; each title is a liftable claim. Dark anchor. */}
      <section className="section full svc-block svc-dark reveal">
        <h2 className="svc-block__heading">{s.approach.heading}</h2>
        <ol
          className="svc-steps"
          style={
            { "--svc-cols": stepColumns(s.approach.steps.length) } as React.CSSProperties
          }
        >
          {s.approach.steps.map((step, i) => (
            <li key={i} className="svc-step panel">
              <span className="svc-step__num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="svc-step__title">{step.title}</h3>
                <p className="svc-step__body"><W value={step.body} /></p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* PATHS (optional) -- funnel out to sub-options, rendered as the
          ASYMMETRIC HOVER LANES (septic lane chrome: glass surface, oversized
          faded numeral, 3px accent left border + staggered indents; CF lanes
          hover: the accent border wipes to a full-width glow). */}
      {s.paths && (
        <section className="section svc-block reveal">
          <h2 className="svc-block__heading">{s.paths.heading}</h2>
          {s.paths.intro && (
            <p className="svc-block__body measure-prose"><W value={s.paths.intro} /></p>
          )}
          <div className="svc-lanes">
            {s.paths.items.map((p, i) => (
              <Link
                key={i}
                href={p.href}
                className="svc-lane"
                style={{ "--lane-color": LANE_COLORS[i % LANE_COLORS.length] } as React.CSSProperties}
              >
                <span className="svc-lane__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="svc-lane__content">
                  <span className="svc-lane__title">{p.label}</span>
                  <span className="svc-lane__desc"><W value={p.detail} /></span>
                  <span className="svc-lane__arrow" aria-hidden="true">Explore -&gt;</span>
                </span>
                {p.viz && (
                  <span className="svc-lane__viz" aria-hidden="true">{p.viz}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PROOF -- concrete examples / portfolio links, no vague claims. */}
      <section className="section svc-block reveal">
        <h2 className="svc-block__heading svc-fill">{s.proof.heading}</h2>
        <ul className="svc-proof">
          {s.proof.items.map((item, i) => (
            <li key={i} className="svc-proof__item panel">
              <p className="svc-proof__label">
                {item.href ? (
                  <Link href={item.href} className="svc-proof__link">
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </p>
              <p className="svc-proof__detail"><W value={item.detail} /></p>
            </li>
          ))}
        </ul>
      </section>

      {/* PORTFOLIO (optional) -- screenshot shots driven by THE sitewide
          water-ripple engine (RippleGrid: the chadlewine explore-grid hover
          effect, called here, never rebuilt per page). */}
      {s.portfolio && (
        <section className="section svc-block reveal">
          <h2 className="svc-block__heading">{s.portfolio.heading}</h2>
          {s.portfolio.intro && (
            <p className="svc-block__body measure-prose"><W value={s.portfolio.intro} /></p>
          )}
          <RippleGrid
            items={s.portfolio.items.map((p, i) => ({
              key: `${s.slug}-shot-${i}`,
              src: p.img,
              alt: p.alt,
              label: p.label,
              href: p.href,
            }))}
          />
        </section>
      )}

      {/* TESTIMONIALS (optional) -- social proof: real client voice. */}
      {s.testimonials && (
        <section className="section full svc-testimonials-band reveal">
          <h2 className="svc-block__heading">{s.testimonials.heading}</h2>
          <ul className="svc-testimonials">
            {s.testimonials.items.map((t, i) => (
              <li key={i} className="svc-testimonial panel">
                <blockquote className="svc-testimonial__quote">
                  <W value={t.quote} />
                </blockquote>
                <p className="svc-testimonial__by"><W value={t.attribution} /></p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* MADE-BY (optional) -- the septic "Hi, I'm Chad" founder block: cutout
          photo + caption card, manifesto rows, negation list, signature. */}
      {s.made && (
        <section className="section svc-block svc-made reveal">
          {s.made.eyebrow && <p className="eyebrow">{s.made.eyebrow}</p>}
          <h2 className="svc-block__heading svc-made__heading">{s.made.heading}</h2>
          <div className="svc-made__grid">
            <div className="svc-made__photo">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
              <img src={s.made.img} alt={s.made.imgAlt} loading="lazy" />
              <div className="svc-made__caption">
                <span className="svc-made__caption-main">{s.made.captionMain}</span>
                {s.made.captionSub && (
                  <span className="svc-made__caption-sub">{s.made.captionSub}</span>
                )}
              </div>
            </div>
            <div className="svc-made__copy">
              <p className="svc-made__intro"><W value={s.made.intro} /></p>
              <ul className="svc-made__manifesto">
                {s.made.manifesto.map((m, i) => (
                  <li key={i}>
                    {m.lead} <span className="svc-made__aside">{m.aside}</span>
                  </li>
                ))}
              </ul>
              <ul className="svc-made__negation">
                {s.made.negation.map((n, i) => (
                  <li key={i}>
                    <span className="svc-made__x" aria-hidden="true">&times;</span>
                    {n}
                  </li>
                ))}
              </ul>
              <p className="svc-made__close"><W value={s.made.close} /></p>
              <p className="svc-made__sig">
                {s.made.sig}
                {s.made.sigMeta && (
                  <span className="svc-made__sig-meta">{s.made.sigMeta}</span>
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* PRICE POSTURE -- value-based; never a fake fixed number. With a
          `figure`, renders the septic glass panel: gradient numeral + mono
          sub + copy + accent-bordered disclaimer. */}
      <section className="section full scheme-alternate svc-block svc-pricing reveal">
        <h2 className="svc-block__heading">{s.price.heading}</h2>
        {s.price.figure ? (
          <div className="svc-pricing__panel">
            <div className="svc-pricing__price">{s.price.figure}</div>
            {s.price.figureSub && (
              <div className="svc-pricing__price-sub">{s.price.figureSub}</div>
            )}
            <p className="svc-pricing__copy"><W value={s.price.body} /></p>
            {s.price.disclaimer && (
              <p className="svc-pricing__disclaimer">{s.price.disclaimer}</p>
            )}
            <CtaButton href={s.cta.href} label="Get an honest read" />
          </div>
        ) : (
          <p className="svc-block__body measure-prose"><W value={s.price.body} /></p>
        )}
      </section>

      {/* QUALIFICATION (optional) -- who it's for / who it isn't. Bold
          periwinkle band with CHANNEL-STATIC grain regenerating in place. */}
      {s.qualification && (
        <section className="section full svc-block svc-qual-section reveal">
          <GrainField />
          <h2 className="svc-block__heading">{s.qualification.heading}</h2>
          <div className="svc-qual">
            <div className="svc-qual__col svc-qual__col--fit panel">
              <p className="svc-qual__label">
                {s.qualification.fitLabel ?? "This is for you if"}
              </p>
              <ul className="svc-qual__list">
                {s.qualification.fit.map((f, i) => (
                  <li key={i}><W value={f} /></li>
                ))}
              </ul>
            </div>
            <div className="svc-qual__col svc-qual__col--not panel">
              <p className="svc-qual__label">
                {s.qualification.notLabel ?? "Probably not if"}
              </p>
              <ul className="svc-qual__list">
                {s.qualification.notFit.map((f, i) => (
                  <li key={i}><W value={f} /></li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* FAQ -- the septic accordion: plum->navy gradient band with lavender
          atmosphere washes, sticky intro column left, glass toggle list right.
          Dark gradient only when a light section follows before the (dark)
          CTA -- see faqDark above. Prevents two inverted bands stacking. */}
      <section
        className={`section full svc-block svc-faq-section reveal${faqDark ? " svc-faq-section--dark" : ""}`}
      >
        <div className="svc-faq__layout">
          <div className="svc-faq__intro">
            <h2 className="svc-block__heading svc-fill">Questions, answered</h2>
            {s.faqLead && (
              <p className="svc-faq__lead"><W value={s.faqLead} /></p>
            )}
          </div>
          <FaqAccordion
            items={s.faqs.map((f) => ({
              q: f.q,
              a: isPrompt(f.a) ? <Prompt label={f.a.label} brief={f.a.brief} /> : f.a,
            }))}
          />
        </div>
      </section>

      {/* ASSURANCE (optional) -- risk reversal: reasons it's safe to say yes. */}
      {s.assurance && (
        <section className="section svc-block reveal">
          <h2 className="svc-block__heading">{s.assurance.heading}</h2>
          <ul className="svc-assurance">
            {s.assurance.items.map((it, i) => (
              <li key={i} className="svc-assurance__item">
                <CheckIcon />
                <span><W value={it} /></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* NEXT STEPS (optional) -- what happens after you reach out. */}
      {s.nextSteps && (
        <section className="section svc-block reveal">
          <h2 className="svc-block__heading">{s.nextSteps.heading}</h2>
          <ol className="svc-nextsteps">
            {s.nextSteps.steps.map((st, i) => (
              <li key={i} className="svc-nextstep">
                <span className="svc-nextstep__num">{i + 1}</span>
                <div>
                  <h3 className="svc-nextstep__title">{st.title}</h3>
                  <p className="svc-nextstep__body"><W value={st.body} /></p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* CTA -- dark band, funnel target. Content in a scanning-border panel.
          With a page form: copy left, THE FORM right (Chad, 2026-06-11). */}
      <section className="section full band-dark svc-cta reveal">
        <div className="svc-cta__panel">
          {s.form ? (
            <div className="svc-cta__split">
              <div>
                <h2 className="svc-cta__heading">{s.cta.heading}</h2>
                <p className="svc-cta__body"><W value={s.cta.body} /></p>
              </div>
              <LeadForm config={s.form} />
            </div>
          ) : (
            <>
              <h2 className="svc-cta__heading">{s.cta.heading}</h2>
              <p className="svc-cta__body measure-prose"><W value={s.cta.body} /></p>
              <CtaButton href={s.cta.href} label={s.cta.buttonLabel} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
