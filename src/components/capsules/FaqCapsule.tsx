// FAQ CAPSULE -- the septic accordion: plum->navy gradient band with lavender
// atmosphere washes, sticky intro column left, glass toggle list right. Goes
// dark (svc-faq-section--dark) only when a light section follows before the
// (dark) CTA, so two inverted bands never stack -- the placer passes `dark`.
//
// Phase B note: heading is the template's hardcoded "Questions, answered".
// Phase F derives "<Page> FAQs" by default (overridable) and inverts the
// svc-fill wipe when the band is dark.

import Link from "next/link";
import type { ReactNode } from "react";
import type { Writable } from "@/lib/service";
import { isPrompt } from "@/lib/service";
import { isLaunched } from "@/lib/launch";
import type { Scheme } from "@/lib/capsule";
import { isDarkScheme } from "@/lib/capsule";
import { Prompt } from "@/components/Prompt";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

// A themed group for the standalone /faqs/ layout (variant="groups"). Answers
// are ReactNode (inline links allowed); the page builds the FAQPage schema from
// its own plain-text twins.
export type FaqGroup = {
  theme: string;
  lead: ReactNode;
  items: { q: string; a: ReactNode }[];
};

export type FaqCapsuleProps = {
  // answers may be plain strings (Writable) or JSX (inline links allowed)
  faqs?: { q: string; a: Writable | ReactNode }[];
  faqLead?: Writable;
  // The FAQ prefers the dark band but yields to rule 9: PageComposer demotes
  // `scheme` to "default" when the next present section is also inverted.
  // `schemeAuto` flags it as the demotable section.
  scheme?: Scheme;
  schemeAuto?: boolean;
  // The page name drives the default heading "<Page> FAQs" (e.g. "Web Design
  // FAQs"), cascading to every service page. An explicit `heading` overrides it.
  pageName?: string;
  heading?: React.ReactNode;
  // variant="groups": the /faqs/ four-band layout (kicker + theme + accordion),
  // each band alternating dark/light by index so two darks never stack (rule 9).
  variant?: "single" | "groups";
  groups?: FaqGroup[];
  // Homepage-only: split the intro/accordion columns evenly (1fr 1fr) instead of
  // the default 2fr 3fr. Scoped via .svc-faq-section--even so other pages are
  // untouched.
  evenSplit?: boolean;
  // Opt-in: the braille dot field (the facets section's halftone) pooled behind
  // the heading + lede. Off everywhere by default.
  halftone?: boolean;
  // Opt-in CTA under the lede, pointing at the full FAQ room. Off by default so
  // /faqs/ itself and the service pages are untouched; launch-gated, so a sealed
  // target renders nothing rather than a dead button.
  moreHref?: string;
  moreLabel?: string;
};

export function FaqCapsule({
  faqs = [],
  faqLead,
  scheme,
  pageName,
  heading,
  variant = "single",
  groups = [],
  evenSplit = false,
  halftone = false,
  moreHref,
  moreLabel = "Read all FAQs",
}: FaqCapsuleProps) {
  if (variant === "groups") {
    return (
      <>
        {groups.map((group, gi) => {
          const groupDark = gi % 2 === 0;
          return (
            <SectionShell
              key={gi}
              full
              className="svc-block svc-faq-section"
              trailingClassName={groupDark ? "svc-faq-section--dark" : undefined}
            >
              <div className="svc-faq__layout">
                <div className="svc-faq__intro">
                  <p className="cw-faq-group__kicker">
                    {String(gi + 1).padStart(2, "0")}
                  </p>
                  <h2 className="svc-block__heading svc-fill">{group.theme}</h2>
                  <p className="svc-faq__lead">{group.lead}</p>
                </div>
                <FaqAccordion
                  items={group.items.map((f) => ({ q: f.q, a: f.a }))}
                />
              </div>
            </SectionShell>
          );
        })}
      </>
    );
  }

  const dark = isDarkScheme(scheme);
  const resolvedHeading =
    heading ?? (pageName ? `${pageName} FAQs` : "Questions, answered");
  return (
    <SectionShell
      full
      className={`svc-block svc-faq-section${evenSplit ? " svc-faq-section--even" : ""}`}
      trailingClassName={dark ? "svc-faq-section--dark" : undefined}
    >
      <div className="svc-faq__layout">
        <div
          className={`svc-faq__intro${halftone ? " svc-faq__intro--halftone" : ""}`}
        >
          {halftone && <span className="cw-faq-halftone" aria-hidden="true" />}
          <h2 className="svc-block__heading svc-fill">{resolvedHeading}</h2>
          {faqLead && (
            <p className="svc-faq__lead">
              <W value={faqLead} />
            </p>
          )}
          {/* The DEFAULT filled treatment, not the ghost: a CTA on an inverted
              band uses the filled pill everywhere on this site (see the note
              beside .svc-btn--ghost in global.css). Same label/arrow structure
              as the rates and showroom buttons. */}
          {moreHref && isLaunched(moreHref) && (
            <p className="svc-faq__cta">
              <Link href={moreHref} className="svc-btn">
                <span className="svc-btn__label">{moreLabel}</span>
                <svg
                  className="svc-btn__arrow"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
                </svg>
              </Link>
            </p>
          )}
        </div>
        <FaqAccordion
          items={faqs.map((f) => ({
            q: f.q,
            a: isPrompt(f.a) ? <Prompt label={f.a.label} brief={f.a.brief} /> : f.a,
          }))}
        />
      </div>
    </SectionShell>
  );
}
