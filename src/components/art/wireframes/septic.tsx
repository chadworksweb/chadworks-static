// Septic wireframe content for the WireframeCamera. The eight mock sections of
// a sample "Routine Pumping" service page, expressed on the .cw-wf-* primitives.
// The in-camera mock uses a septic-brand palette (green/teal) because it depicts
// a sample CLIENT site, not a chadworks surface; the surrounding page chrome and
// the camera shell use the global tokens. Content is illustrative (Anytown,
// SepticPros), matching the source.

import type { WfSection } from "@/components/art/WireframeCamera";

const GREEN = "#0c5d4a";
const TEAL = "#4a6b6e";
const SLATE = "#333333";

export const septicWireframe: WfSection[] = [
  {
    id: 0,
    label: "Sticky Header",
    accent: GREEN,
    sticky: true,
    explain: {
      label: "Sticky Header",
      strong: "The phone number is always within reach.",
      body: "The homeowner with a backed-up tank at 11pm taps the number, they do not read your About page. A sticky header keeps tap-to-call one thumb-press away on every scroll, every page.",
    },
    content: (
      <>
        <span className="cw-wf-sticky-logo">
          Septic<span>Pros</span>
        </span>
        <span className="cw-wf-sticky-phone">(555) 012-1240</span>
      </>
    ),
  },
  {
    id: 1,
    label: "Hero",
    accent: GREEN,
    explain: {
      label: "Hero",
      strong: "Cert, license, and 24/7 emergency above the fold.",
      body: "Two seconds to convince the panicked homeowner you are real. The trust trio, PSMA cert plus state license plus a 24/7 line, clears the credibility bar before any other content gets read.",
    },
    content: (
      <div className="cw-wf-hero" style={{ ["--block-accent" as string]: GREEN }}>
        <div className="cw-wf-hero__bg" aria-hidden="true" />
        <div className="cw-wf-hero__overlay">
          <span className="cw-wf-eyebrow">Septic Service &middot; Greater Metro</span>
          <p className="cw-wf-h">Tank pumped. Drain field saved. Same week.</p>
          <p className="cw-wf-sub">PSMA-certified pumping and repair. 24/7 emergency response.</p>
          <div className="cw-wf-hero__actions">
            <span className="cw-wf-pill-cta">(555) 012-1240</span>
            <span className="cw-wf-pill-cta cw-wf-pill-cta--ghost">Free estimate</span>
          </div>
          <div className="cw-wf-hero__trust">
            <span className="cw-wf-badge">PSMA Cert</span>
            <span className="cw-wf-badge">State License</span>
            <span className="cw-wf-badge">24/7</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: "Service Explainer",
    accent: TEAL,
    explain: {
      label: "Service Explainer",
      strong: "Plain-language description of what the work actually is.",
      body: "How often the tank should be pumped, what household size tightens the schedule, what a standard pump includes and what it does not. Calibrated for the homeowner who has never owned a septic system before.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: TEAL }}>
        <span className="cw-wf-eyebrow">Routine Pumping &middot; Plain English</span>
        <p className="cw-wf-h">What does getting your septic pumped actually mean?</p>
        <p className="cw-wf-sub">
          A pump truck removes the sludge at the bottom of the tank plus the floating
          scum on top, so the system stays in balance. Skip it too long and the solids
          overflow into the drain field, a repair that runs $8K to $25K.
        </p>
        <div className="cw-wf-chart">
          <div className="cw-wf-chart__bar"><span className="cw-wf-chart__k">1-2 people</span><span className="cw-wf-chart__v">5-7 yrs</span></div>
          <div className="cw-wf-chart__bar"><span className="cw-wf-chart__k">3-4 people</span><span className="cw-wf-chart__v">3-5 yrs</span></div>
          <div className="cw-wf-chart__bar"><span className="cw-wf-chart__k">5+ people</span><span className="cw-wf-chart__v">2-3 yrs</span></div>
        </div>
        <div className="cw-wf-cols">
          <div className="cw-wf-col">
            <span className="cw-wf-col__label">Included</span>
            <span className="cw-wf-item cw-wf-item--yes">Tank pump up to 1,500 gal</span>
            <span className="cw-wf-item cw-wf-item--yes">Baffle inspection</span>
            <span className="cw-wf-item cw-wf-item--yes">Sludge depth measurement</span>
          </div>
          <div className="cw-wf-col">
            <span className="cw-wf-col__label">Not included</span>
            <span className="cw-wf-item cw-wf-item--no">Drain field repair</span>
            <span className="cw-wf-item cw-wf-item--no">Riser or lid install</span>
            <span className="cw-wf-item cw-wf-item--no">Deep excavation</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: "3-Step Process",
    accent: GREEN,
    explain: {
      label: "3-Step Process",
      strong: "What happens between the call and the receipt.",
      body: "Schedule by phone or online, the truck arrives in the window, then a pump plus a visual baffle and riser check plus an emailed receipt with the next-pump date. Three cards that pre-answer the unspoken question every buyer has: what happens after I book?",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: GREEN }}>
        <span className="cw-wf-eyebrow">What happens next</span>
        <p className="cw-wf-h">From your call to the next-pump reminder.</p>
        <div className="cw-wf-process-grid">
          <div className="cw-wf-process-step"><span className="cw-wf-process-num">01</span><span className="cw-wf-process-label">Schedule</span><span className="cw-wf-process-body">Call or book online. Same-week routine, same-day emergency.</span></div>
          <div className="cw-wf-process-step"><span className="cw-wf-process-num">02</span><span className="cw-wf-process-label">Pump and inspect</span><span className="cw-wf-process-body">Truck arrives in your window. Full pump-out plus baffle and riser check.</span></div>
          <div className="cw-wf-process-step"><span className="cw-wf-process-num">03</span><span className="cw-wf-process-label">Receipt and reminder</span><span className="cw-wf-process-body">Emailed receipt with sludge depth, notes, and your next-pump date.</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    label: "Truck + Crew",
    accent: TEAL,
    explain: {
      label: "Truck + Crew Gallery",
      strong: "Real photos of your truck and crew.",
      body: "Septic is local, hands-on, and personal: a homeowner is letting a stranger in a vacuum truck onto their property. Real photos of your fleet and crew beat stock images of generic tankers by an enormous margin. Stock photos get filtered out in three seconds.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: TEAL }}>
        <span className="cw-wf-eyebrow">Real Photos &middot; No Stock</span>
        <p className="cw-wf-h">The truck pulling into your driveway. The crew getting out.</p>
        <div className="cw-wf-gallery-hero" aria-hidden="true">
          <span className="cw-wf-gallery-cap">2022 Peterbilt 348 &middot; 3,600 gal</span>
        </div>
        <div className="cw-wf-gallery-grid" aria-hidden="true">
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--a"><span className="cw-wf-gallery-cap">Marcus, lead</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--b"><span className="cw-wf-gallery-cap">Riser install</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--c"><span className="cw-wf-gallery-cap">Pump line</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--d"><span className="cw-wf-gallery-cap">At the yard</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    label: "FAQ",
    accent: GREEN,
    explain: {
      label: "FAQ Accordion",
      strong: "Pre-answered questions that come up on every call.",
      body: "How often to pump, what is included, what costs extra, residential versus commercial pricing, mound system add-ons, real-estate cert lead times, payment options. Tire-kickers self-filter and real buyers arrive ready.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: GREEN }}>
        <span className="cw-wf-eyebrow">FAQ &middot; Tank, Truck and Pricing</span>
        <p className="cw-wf-h">Pre-answered, so real buyers arrive ready.</p>
        <div className="cw-wf-faq-list">
          <div className="cw-wf-faq-row">
            <div className="cw-wf-faq-q"><span>How much does a routine pumping cost?</span><span className="cw-wf-faq-toggle">-</span></div>
            <p className="cw-wf-faq-a">For a standard 1,000-1,500 gal tank with a riser at grade, $340-$420 depending on access. Buried lids and commercial tanks are quoted on site. No hidden trip fees.</p>
          </div>
          <div className="cw-wf-faq-row"><div className="cw-wf-faq-q"><span>How do I know if my tank needs pumping?</span><span className="cw-wf-faq-toggle">+</span></div></div>
          <div className="cw-wf-faq-row"><div className="cw-wf-faq-q"><span>Do you pump in winter?</span><span className="cw-wf-faq-toggle">+</span></div></div>
          <div className="cw-wf-faq-row"><div className="cw-wf-faq-q"><span>Are you licensed and insured?</span><span className="cw-wf-faq-toggle">+</span></div></div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    label: "Service Areas + CTA",
    accent: TEAL,
    explain: {
      label: "Service Areas + CTA",
      strong: "Local town links and a final way to convert.",
      body: "Town chips link to per-area pages, the local SEO play that catches septic pumping Anytown and septic service near Everytown searches. The final CTA catches the visitor who scrolled the whole page.",
    },
    content: (
      <div className="cw-wf-areas" style={{ ["--block-accent" as string]: TEAL }}>
        <div>
          <span className="cw-wf-eyebrow">Service Areas</span>
          <p className="cw-wf-h">Septic service across the metro.</p>
          <p className="cw-wf-sub">Each town has its own page with permit notes and county rules.</p>
          <div className="cw-wf-chips">
            <span className="cw-wf-chip">Anytown</span>
            <span className="cw-wf-chip">Everytown</span>
            <span className="cw-wf-chip">South Anytown</span>
            <span className="cw-wf-chip">East Anytown</span>
            <span className="cw-wf-chip">Anytown Heights</span>
            <span className="cw-wf-chip cw-wf-chip--more">+12 more</span>
          </div>
        </div>
        <div className="cw-wf-cta-card">
          <span className="cw-wf-eyebrow">Ready to book?</span>
          <span className="cw-wf-h">Call now or get a same-week slot.</span>
          <span className="cw-wf-cta-phone">(555) 012-1240</span>
          <span className="cw-wf-cta-btn">Get a free estimate</span>
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
      body: "State contractor license, PSMA cert, hours, address, and schema for LocalBusiness plus Service plus AreaServed. Every footer is part of your SEO surface area, duplicated across every page so AI search has consistent entity data.",
    },
    content: (
      <div className="cw-wf-foot">
        <div className="cw-wf-foot-grid">
          <div>
            <span className="cw-wf-foot-logo">Septic<span>Pros</span></span>
            <span className="cw-wf-foot-link">123 Sample St</span>
            <span className="cw-wf-foot-link">Anytown, ST 00000</span>
            <span className="cw-wf-foot-link">(555) 012-1240</span>
          </div>
          <div>
            <span className="cw-wf-foot-label">Services</span>
            <span className="cw-wf-foot-link">Routine Pumping</span>
            <span className="cw-wf-foot-link">Inspection</span>
            <span className="cw-wf-foot-link">Real-Estate Cert</span>
          </div>
          <div>
            <span className="cw-wf-foot-label">Areas</span>
            <span className="cw-wf-foot-link">Anytown</span>
            <span className="cw-wf-foot-link">Everytown</span>
            <span className="cw-wf-foot-link">+17 more</span>
          </div>
          <div>
            <span className="cw-wf-foot-label">Schema</span>
            <span className="cw-wf-foot-link">LocalBusiness</span>
            <span className="cw-wf-foot-link">AreaServed</span>
            <span className="cw-wf-foot-link">Service</span>
          </div>
        </div>
        <div className="cw-wf-foot-meta">
          <span>(c) 2026 SepticPros, LLC</span>
          <span>&middot;</span>
          <span>Privacy</span>
          <span>&middot;</span>
          <span>Terms</span>
        </div>
      </div>
    ),
  },
];
