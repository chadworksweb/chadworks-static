"use client";

// THE DUAL FORM -- the rslgo contact section's quick <-> detailed toggle,
// ported from front-page.php + main.js: two pill buttons over a sliding
// indicator, two forms, only the active one visible (fade-in), messages
// cleared on switch. Each side is a full LeadForm (the engine handles its
// own validation/submission/messages). Used by the /contact/ page.

import { useState, type ReactNode } from "react";
import { LeadForm } from "./LeadForm";
import type { LeadFormConfig } from "@/lib/forms";

interface Props {
  quickLabel?: string;
  detailedLabel?: string;
  quick: LeadFormConfig;
  detailed: LeadFormConfig;
  // Extra payload merged into whichever side submits (read live at submit) --
  // e.g. the calculator's current scope. Passed through to both LeadForms.
  getExtraData?: () => Record<string, string>;
  // Node rendered just before each side's submit button.
  beforeSubmit?: ReactNode;
}

export function DualForm({ quickLabel = "Quick Contact", detailedLabel = "Detailed Inquiry", quick, detailed, getExtraData, beforeSubmit }: Props) {
  const [active, setActive] = useState<"quick" | "detailed">("quick");

  return (
    <div className="cw-dualform">
      <div className="cw-dualform__toggle">
        <button
          className={`cw-dualform__toggle-btn${active === "quick" ? " is-active" : ""}`}
          data-form="quick"
          type="button"
          onClick={() => setActive("quick")}
        >
          {quickLabel}
        </button>
        <button
          className={`cw-dualform__toggle-btn${active === "detailed" ? " is-active" : ""}`}
          data-form="detailed"
          type="button"
          onClick={() => setActive("detailed")}
        >
          {detailedLabel}
        </button>
        <span
          className={`cw-dualform__toggle-indicator${active === "detailed" ? " is-right" : ""}`}
        />
      </div>

      <div className={`cw-dualform__form${active === "quick" ? " is-active" : ""}`}>
        <LeadForm config={quick} getExtraData={getExtraData} beforeSubmit={beforeSubmit} />
      </div>
      <div className={`cw-dualform__form${active === "detailed" ? " is-active" : ""}`}>
        <LeadForm config={detailed} getExtraData={getExtraData} beforeSubmit={beforeSubmit} />
      </div>
    </div>
  );
}
