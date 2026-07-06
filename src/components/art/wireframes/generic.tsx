// Generic wireframe content for the WireframeCamera -- an industry-neutral
// sample page for the /web-design/ teardown. Five trimmed sections on the
// shared .cw-wf-* primitives (the same ones the septic/foundation mocks use),
// styled to the GLOBAL brand tokens instead of an industry palette. The copy is
// placeholder-generic on purpose: it describes what each section DOES for any
// business, so the explainer column carries the teaching, not the mock.

import type { WfSection } from "@/components/art/WireframeCamera";

const INDIGO = "#243989"; // --dark-bg
const PURPLE = "#8054bc"; // --accent
const SLATE = "#333333";

export const genericWireframe: WfSection[] = [
  {
    id: 0,
    label: "Sticky Header",
    accent: INDIGO,
    sticky: true,
    explain: {
      label: "Sticky Header",
      strong: "The next step is always one tap away.",
      body: "A visitor who decides halfway down the page should never scroll back up to find you. A sticky header keeps your name and the action you want within reach on every screen, on every page.",
    },
    content: (
      <>
        <span className="cw-wf-sticky-logo">
          Your<span>Brand</span>
        </span>
        <span className="cw-wf-sticky-phone">Get a quote</span>
      </>
    ),
  },
  {
    id: 1,
    label: "Hero",
    accent: INDIGO,
    explain: {
      label: "Hero",
      strong: "Two seconds to say you are the one.",
      body: "Before anyone reads a word below, the top of the page has already made its case. A clear promise and one obvious action clear a bar most sites never reach.",
    },
    content: (
      <div className="cw-wf-hero" style={{ ["--block-accent" as string]: INDIGO }}>
        <div className="cw-wf-hero__bg" aria-hidden="true" />
        <div className="cw-wf-hero__overlay">
          <span className="cw-wf-eyebrow">What you do &middot; Who it is for</span>
          <p className="cw-wf-h">The one line that tells a stranger they are in the right place.</p>
          <p className="cw-wf-sub">A short, plain promise, then the single action you want them to take.</p>
          <div className="cw-wf-hero__actions">
            <span className="cw-wf-pill-cta">Primary action</span>
            <span className="cw-wf-pill-cta cw-wf-pill-cta--ghost">See the work</span>
          </div>
          <div className="cw-wf-hero__trust">
            <span className="cw-wf-badge">Trust signal</span>
            <span className="cw-wf-badge">Credential</span>
            <span className="cw-wf-badge">Proof point</span>
            <span className="cw-wf-badge">Guarantee</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: "What You Offer",
    accent: PURPLE,
    explain: {
      label: "Plain-Language Offer",
      strong: "Clarity is what earns the click.",
      body: "Most visitors leave because they cannot tell what they would be buying. A plain description of the work, with an honest line on what it does not cover, does more for trust than any adjective.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: PURPLE }}>
        <span className="cw-wf-eyebrow">What you offer &middot; Plain English</span>
        <p className="cw-wf-h">What the visitor actually gets, said simply.</p>
        <p className="cw-wf-sub">
          No jargon and no filler: what the work is, what it costs to start, and
          what happens after they reach out.
        </p>
        <div className="cw-wf-cols">
          <div className="cw-wf-col">
            <span className="cw-wf-col__label">Included</span>
            <span className="cw-wf-item cw-wf-item--yes">The core deliverable</span>
            <span className="cw-wf-item cw-wf-item--yes">The second thing they expect</span>
            <span className="cw-wf-item cw-wf-item--yes">The detail that reassures</span>
          </div>
          <div className="cw-wf-col">
            <span className="cw-wf-col__label">Not included</span>
            <span className="cw-wf-item cw-wf-item--no">The upsell, named honestly</span>
            <span className="cw-wf-item cw-wf-item--no">The out-of-scope ask</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: "Proof",
    accent: INDIGO,
    explain: {
      label: "Proof",
      strong: "Strangers trust other people before they trust you.",
      body: "A visitor discounts what you say about yourself and believes what others say about you. Real photos and real words, placed right where the doubt sets in, carry them over it.",
    },
    content: (
      <div className="cw-wf-explainer" style={{ ["--block-accent" as string]: INDIGO }}>
        <span className="cw-wf-eyebrow">Proof &middot; Real, not stock</span>
        <p className="cw-wf-h">The work, the faces, and the words of people you have helped.</p>
        <div className="cw-wf-gallery-hero" aria-hidden="true">
          <span className="cw-wf-gallery-cap">Your best result, up front</span>
        </div>
        <div className="cw-wf-gallery-grid" aria-hidden="true">
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--a"><span className="cw-wf-gallery-cap">A real photo</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--b"><span className="cw-wf-gallery-cap">A testimonial</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--c"><span className="cw-wf-gallery-cap">Before and after</span></div>
          <div className="cw-wf-gallery-cell cw-wf-gallery-cell--d"><span className="cw-wf-gallery-cap">A logo they know</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    label: "The Close",
    accent: PURPLE,
    explain: {
      label: "Closing CTA",
      strong: "The reader who made it this far is the one to catch.",
      body: "Someone who scrolled the whole page is your warmest visitor. The end owes them a single, obvious way to act, so the interest they built does not quietly evaporate.",
    },
    content: (
      <div className="cw-wf-areas" style={{ ["--block-accent" as string]: PURPLE }}>
        <div>
          <span className="cw-wf-eyebrow">The close</span>
          <p className="cw-wf-h">One last, easy way to act.</p>
          <p className="cw-wf-sub">
            For the visitor who read the whole page and is ready, with no hunting
            for how to reach you.
          </p>
          <div className="cw-wf-chips">
            <span className="cw-wf-chip">Call</span>
            <span className="cw-wf-chip">Email</span>
            <span className="cw-wf-chip">Book online</span>
            <span className="cw-wf-chip">Message</span>
          </div>
        </div>
        <div className="cw-wf-cta-card">
          <span className="cw-wf-eyebrow">Ready?</span>
          <span className="cw-wf-h">Start here.</span>
          <span className="cw-wf-cta-phone">Your contact</span>
          <span className="cw-wf-cta-btn">Primary action</span>
          <span className="cw-wf-cta-hours">Hours &middot; Location &middot; Response time</span>
        </div>
      </div>
    ),
  },
];

// A footer accent kept exported in case a longer variant needs it later.
export const GENERIC_WIREFRAME_FOOTER_ACCENT = SLATE;
