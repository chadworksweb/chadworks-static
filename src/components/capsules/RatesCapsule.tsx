// RATES CAPSULE -- the homepage's public pricing band (global, shared). Hourly
// + flat-rate cards, a disclaimer, and the "view rate details" CTA to /rates/.
// Extracted from the homepage so any page renders the same rates block instead
// of a page-specific price section.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { isLaunched } from "@/lib/launch";
import { BASE, money } from "@/lib/package-builder";
import { MINUTELY } from "@/lib/pricing";

// `standalone` = the /rates/ page use: the heading renders as the page's H1 in
// the standard hero-title styling (the removed rates hero), and the redundant
// "view rate details" self-link is dropped.
export function RatesCapsule({ standalone = false }: { standalone?: boolean } = {}) {
  return (
    <SectionShell full className="cw-pricing">
      <div className="cw-pricing__head">
        {standalone && (
          <nav className="svc-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Rates</span>
          </nav>
        )}
        <p className="eyebrow">What it costs</p>
        {standalone ? (
          <h1 className="svc-hero__title cw-pricing__heading--hero">
            <span className="text-gradient">Transparent rates.</span>
          </h1>
        ) : (
          <h2 className="cw-pricing__heading">Transparent rates.</h2>
        )}
      </div>
      <div className="cw-pricing__grid">
        <div className="cw-price-card panel">
          <p className="cw-price-card__label">Per minute</p>
          <p className="cw-price-card__figure">{money(MINUTELY)}<span className="cw-price-card__unit"> / min</span></p>
          <p className="cw-price-card__note">
            I have always worked and delivered at a blistering pace, and with the
            onset of AI tools, charging by the hour is no longer an appropriate
            metric.
          </p>
        </div>
        <div className="cw-price-card panel">
          <p className="cw-price-card__label">Flat-rate builds</p>
          <p className="cw-price-card__figure">From {money(BASE)}</p>
          <p className="cw-price-card__note">
            Most sites land between $5,000 and $10,000. For more information
            about flat rate projects, <Link href="/websites/">click here</Link>.
          </p>
        </div>
      </div>
      <p className="cw-pricing__disclaimer">
        Flat rates shown are general estimates
        for information only, not a formal quote or binding offer. Your actual
        price is set in a written proposal before any work begins.
      </p>
      {!standalone && isLaunched("/rates/") && (
        <div className="cw-pricing__cta">
          <Link href="/rates/" className="svc-btn cw-pricing__cta-btn">
            <span className="svc-btn__label">View rate details</span>
            <svg className="svc-btn__arrow" viewBox="0 0 448 512" aria-hidden="true" focusable="false">
              <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
            </svg>
          </Link>
        </div>
      )}
    </SectionShell>
  );
}
