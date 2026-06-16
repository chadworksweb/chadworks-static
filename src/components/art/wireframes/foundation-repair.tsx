// Foundation-repair wireframe content for the WireframeCamera. The eight mock
// sections of a sample "Foundation Piering" service page, expressed on the
// .cw-wf-* primitives (the same primitives the septic mock uses, so no new CSS).
// The in-camera mock uses a foundation CLIENT-brand palette (structural
// slate-blue / dark slate, from the FoundationWorks demo brand kit) because it
// depicts a sample client site, not a chadworks surface; the surrounding page
// chrome and the camera shell use the global tokens. Content is illustrative
// (Anytown, FoundationWorks), and every explain block is copied verbatim from
// the foundation source page.

import type { WfSection } from "@/components/art/WireframeCamera";

const BLUE = "#2c5f8a";
const STEEL = "#5a7a9e";
const SLATE = "#2c3e50";

export const foundationWireframe: WfSection[] = [
  {
    id: 0,
    label: "Sticky Header",
    accent: SLATE,
    sticky: true,
    explain: {
      label: "Sticky Header",
      strong: "Phone number is always within reach.",
      body: "The homeowner who finds water in the basement at 11pm taps the number, they do not read your About page. Sticky header keeps tap-to-call one thumb-press away on every scroll, every page.",
    },
    content: (
      <>
        <span className="cw-wf-sticky-logo">
          Foundation<span>Works</span>
        </span>
        <span className="cw-wf-sticky-phone">(555) 012-1240</span>
      </>
    ),
  },
  {
    id: 1,
    label: "Hero",
    accent: BLUE,
    explain: {
      label: "Hero",
      strong: "License, engineer signoff, and warranty visible above the fold.",
      body: "Two seconds to convince the foundation buyer you are real. Trust trio, state license plus PE engineer signoff plus lifetime transferable warranty, clears the credibility bar before any other content gets read.",
    },
    content: (
      <div className="cw-wf-hero" style={{ ["--block-accent" as string]: BLUE }}>
        <div className="cw-wf-hero__bg" aria-hidden="true" />
        <div className="cw-wf-hero__overlay">
          <span className="cw-wf-eyebrow">Foundation Piering &middot; Greater Metro</span>
          <p className="cw-wf-h">Settling foundation? We lift it back and lock it.</p>
          <p className="cw-wf-sub">Helical piering with PE engineer signoff. Lifetime transferable warranty.</p>
          <div className="cw-wf-hero__actions">
            <span className="cw-wf-pill-cta">(555) 012-1240</span>
            <span className="cw-wf-pill-cta cw-wf-pill-cta--ghost">Free inspection</span>
          </div>
          <div className="cw-wf-hero__trust">
            <span className="cw-wf-badge">State License</span>
            <span className="cw-wf-badge">PE Signoff</span>
            <span className="cw-wf-badge">Lifetime Warranty</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: "Method Explainer",
    accent: STEEL,
    explain: {
      label: "Method Explainer",
      strong: "Plain-language description of what helical piering actually is.",
      body: "When push piers won't bite, why fill soils need helical, how the load transfers to bedrock or load-bearing strata. Calibrated for the homeowner doing 30 minutes of research, not the structural engineer.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: STEEL }}>
        <span className="cw-wf-eyebrow">Helical Piering &middot; Plain English</span>
        <p className="cw-wf-h">What is helical piering, actually?</p>
        <p className="cw-wf-sub">
          Steel helices are driven 8 to 15 feet below grade until they hit
          load-bearing strata, then your foundation is lifted back toward
          original grade and locked there. When push piers won&apos;t bite on
          fill soils, helical is the system that holds.
        </p>
        <div className="cw-wf-chart">
          <div className="cw-wf-chart__bar"><span className="cw-wf-chart__k">Fill soil</span><span className="cw-wf-chart__v">Helical</span></div>
          <div className="cw-wf-chart__bar"><span className="cw-wf-chart__k">Dense clay</span><span className="cw-wf-chart__v">Push or helical</span></div>
          <div className="cw-wf-chart__bar"><span className="cw-wf-chart__k">Shallow rock</span><span className="cw-wf-chart__v">Push pier</span></div>
        </div>
        <div className="cw-wf-cols">
          <div className="cw-wf-col">
            <span className="cw-wf-col__label">Included</span>
            <span className="cw-wf-item cw-wf-item--yes">PE-engineered pier layout</span>
            <span className="cw-wf-item cw-wf-item--yes">Foundation lift to grade</span>
            <span className="cw-wf-item cw-wf-item--yes">PE signoff before we leave</span>
          </div>
          <div className="cw-wf-col">
            <span className="cw-wf-col__label">Not included</span>
            <span className="cw-wf-item cw-wf-item--no">Interior finish repair</span>
            <span className="cw-wf-item cw-wf-item--no">Landscaping restoration</span>
            <span className="cw-wf-item cw-wf-item--no">Exterior waterproofing</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: "3-Step Process",
    accent: BLUE,
    explain: {
      label: "3-Step Process",
      strong: "What happens between the call and the work.",
      body: "Site inspection + soil perc test, PE-engineered pier layout, install and signoff. Three cards that pre-answer the unspoken second question every foundation buyer has: \"what happens after I call?\"",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: BLUE }}>
        <span className="cw-wf-eyebrow">What happens next</span>
        <p className="cw-wf-h">From your call to the lifted foundation.</p>
        <div className="cw-wf-process-grid">
          <div className="cw-wf-process-step"><span className="cw-wf-process-num">01</span><span className="cw-wf-process-label">Inspect</span><span className="cw-wf-process-body">Free site inspection plus a soil perc test, same week.</span></div>
          <div className="cw-wf-process-step"><span className="cw-wf-process-num">02</span><span className="cw-wf-process-label">Engineer the layout</span><span className="cw-wf-process-body">PE-engineered pier layout, sized to your foundation load and soil profile.</span></div>
          <div className="cw-wf-process-step"><span className="cw-wf-process-num">03</span><span className="cw-wf-process-label">Install and sign off</span><span className="cw-wf-process-body">Pier install, foundation lift, and a PE signoff before we leave the property.</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    label: "Before / After Gallery",
    accent: STEEL,
    explain: {
      label: "Before / After Gallery",
      strong: "Real photos of cracked-to-repaired walls.",
      body: "Foundation repair sells on visible proof. Real before-after photos of YOUR helical pier jobs beat stock photos by an enormous margin, generic basement images get filtered out by the buyer in three seconds.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: STEEL }}>
        <span className="cw-wf-eyebrow">Real Photos &middot; No Stock</span>
        <p className="cw-wf-h">Cracked wall to repaired wall. Wet basement to dry.</p>
        <div className="cw-wf-gallery-hero" aria-hidden="true">
          <span className="cw-wf-gallery-cap">Bowing wall lifted back to grade</span>
        </div>
        <div className="cw-wf-gallery-grid" aria-hidden="true">
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--a"><span className="cw-wf-gallery-cap">Before: stair-step crack</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--b"><span className="cw-wf-gallery-cap">Helical pier set</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--c"><span className="cw-wf-gallery-cap">Carbon fiber strap</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--d"><span className="cw-wf-gallery-cap">After: sealed and dry</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    label: "FAQ Accordion",
    accent: BLUE,
    explain: {
      label: "FAQ Accordion",
      strong: "Pre-answered questions that come up on every helical pier call.",
      body: "Lifetime warranty terms, when PE signoff is required, expansive-clay vs. fill-soil decisions, financing options, how the install affects landscaping. Tire-kickers self-filter, real buyers arrive ready.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: BLUE }}>
        <span className="cw-wf-eyebrow">FAQ &middot; Warranty, Method and Cost</span>
        <p className="cw-wf-h">Pre-answered, so real buyers arrive ready.</p>
        <div className="cw-wf-faq-list">
          <div className="cw-wf-faq-row">
            <div className="cw-wf-faq-q"><span>Does the lifetime warranty transfer to the next owner?</span><span className="cw-wf-faq-toggle">-</span></div>
            <p className="cw-wf-faq-a">Yes. The warranty on the pier system transfers to the next owner of the home, which is the line item that closes the sale when a buyer is comparing you to a national franchise.</p>
          </div>
          <div className="cw-wf-faq-row"><div className="cw-wf-faq-q"><span>Helical pier vs. push pier, which do I need?</span><span className="cw-wf-faq-toggle">+</span></div></div>
          <div className="cw-wf-faq-row"><div className="cw-wf-faq-q"><span>Will the install tear up my landscaping?</span><span className="cw-wf-faq-toggle">+</span></div></div>
          <div className="cw-wf-faq-row"><div className="cw-wf-faq-q"><span>Do you offer financing?</span><span className="cw-wf-faq-toggle">+</span></div></div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    label: "Service Areas + CTA",
    accent: STEEL,
    explain: {
      label: "Service Areas + CTA",
      strong: "Local town links and a final way to convert.",
      body: "Town chips link to per-area pages, the local SEO play that catches \"helical pier installer Anytown\" and \"foundation repair near Everytown\" searches. Final CTA catches the visitor who scrolled the whole page.",
    },
    content: (
      <div className="cw-wf-areas" style={{ ["--block-accent" as string]: STEEL }}>
        <div>
          <span className="cw-wf-eyebrow">Service Areas</span>
          <p className="cw-wf-h">Foundation repair across the metro.</p>
          <p className="cw-wf-sub">Each town has its own page with local soil notes and permit rules.</p>
          <div className="cw-wf-chips">
            <span className="cw-wf-chip">Anytown</span>
            <span className="cw-wf-chip">Everytown</span>
            <span className="cw-wf-chip">Anytown Heights</span>
            <span className="cw-wf-chip">East Anytown</span>
            <span className="cw-wf-chip">Anytown Mills</span>
            <span className="cw-wf-chip cw-wf-chip--more">+4 more</span>
          </div>
        </div>
        <div className="cw-wf-cta-card">
          <span className="cw-wf-eyebrow">Ready to fix it?</span>
          <span className="cw-wf-h">Call now or book a free inspection.</span>
          <span className="cw-wf-cta-phone">(555) 012-1240</span>
          <span className="cw-wf-cta-btn">Get a free inspection</span>
          <span className="cw-wf-cta-hours">Mon-Sat 7am-7pm &middot; 24/7 emergency</span>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    label: "Footer",
    accent: SLATE,
    explain: {
      label: "Footer",
      strong: "License, hours, address, structured data.",
      body: "State contractor license, PE engineer name on staff, hours, address, schema for LocalBusiness plus Service plus AreaServed. Every footer is part of your SEO surface area, not decoration, duplicated across every page so AI search has consistent entity data.",
    },
    content: (
      <div className="cw-wf-foot">
        <div className="cw-wf-foot-grid">
          <div>
            <span className="cw-wf-foot-logo">Foundation<span>Works</span></span>
            <span className="cw-wf-foot-link">123 Sample St</span>
            <span className="cw-wf-foot-link">Anytown, ST 00000</span>
            <span className="cw-wf-foot-link">(555) 012-1240</span>
          </div>
          <div>
            <span className="cw-wf-foot-label">Services</span>
            <span className="cw-wf-foot-link">Foundation Piering</span>
            <span className="cw-wf-foot-link">Crack Injection</span>
            <span className="cw-wf-foot-link">Waterproofing</span>
          </div>
          <div>
            <span className="cw-wf-foot-label">Areas</span>
            <span className="cw-wf-foot-link">Anytown</span>
            <span className="cw-wf-foot-link">Everytown</span>
            <span className="cw-wf-foot-link">+7 more</span>
          </div>
          <div>
            <span className="cw-wf-foot-label">Schema</span>
            <span className="cw-wf-foot-link">LocalBusiness</span>
            <span className="cw-wf-foot-link">AreaServed</span>
            <span className="cw-wf-foot-link">Service</span>
          </div>
        </div>
        <div className="cw-wf-foot-meta">
          <span>(c) 2026 FoundationWorks, LLC</span>
          <span>&middot;</span>
          <span>Privacy</span>
          <span>&middot;</span>
          <span>Terms</span>
        </div>
      </div>
    ),
  },
];
