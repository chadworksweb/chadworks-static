// CONTACT CAPSULE -- the dark contact band: the CF "colorburst" glow orbs
// behind, reach-direct copy on the left, the rslgo DualForm (quick <-> detailed)
// on the right. The only dark section on /contact/, so no rule-9 adjacency.

import type { ReactNode } from "react";
import type { LeadFormConfig } from "@/lib/forms";
import type { Scheme } from "@/lib/capsule";
import { DualForm } from "@/components/forms/DualForm";
import { ContactOrbs } from "@/components/art/ContactOrbs";
import { SectionShell } from "@/components/capsules/SectionShell";

export type ContactCapsuleProps = {
  id?: string; // anchor target (e.g. "contact" for the header Contact button)
  heading: ReactNode;
  // h2 everywhere the capsule CLOSES a page (the page owns its own h1). "h1"
  // only on /contact/, where this capsule IS the page and there is no other
  // heading above it -- without the override that page ships no h1 at all.
  headingLevel?: "h1" | "h2";
  intro: ReactNode; // the "two ways in" note
  emailLabel: string;
  email: string;
  phoneLabel?: string;
  phone?: string;
  locationNote: ReactNode;
  // The availability posture (CWS-EXPANSION-PLAN-01 item K). Optional so a page
  // composing this capsule for a narrower purpose can close without it.
  availabilityNote?: ReactNode;
  quick: LeadFormConfig;
  detailed: LeadFormConfig;
  quickLabel: string;
  detailedLabel: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function ContactCapsule({
  id,
  heading,
  headingLevel = "h2",
  intro,
  emailLabel,
  email,
  phoneLabel,
  phone,
  locationNote,
  availabilityNote,
  quick,
  detailed,
  quickLabel,
  detailedLabel,
}: ContactCapsuleProps) {
  const Heading = headingLevel;
  return (
    <SectionShell id={id} full className="band-dark cw-contact">
      <ContactOrbs />
      <div className="cw-contact__inner">
        <div className="cw-contact__layout">
          <div className="cw-contact__copy">
            <Heading className="svc-cta__heading">{heading}</Heading>
            <p className="cw-contact__note">{intro}</p>
            <div>
              <p className="cw-contact__email-label">{emailLabel}</p>
              <a className="cw-contact__email" href={`mailto:${email}`}>
                {email}
              </a>
            </div>
            {phone && (
              <div>
                <p className="cw-contact__email-label">{phoneLabel}</p>
                <a
                  className="cw-contact__email"
                  href={`tel:+1${phone.replace(/\D/g, "")}`}
                >
                  {phone}
                </a>
              </div>
            )}
            <p className="cw-contact__note">{locationNote}</p>
            {availabilityNote && (
              <p className="cw-contact__note cw-contact__note--availability">
                {availabilityNote}
              </p>
            )}
          </div>

          <DualForm
            quick={quick}
            detailed={detailed}
            quickLabel={quickLabel}
            detailedLabel={detailedLabel}
          />
        </div>
      </div>
    </SectionShell>
  );
}
