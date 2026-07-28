// MAIN CONTACT CAPSULE -- the homepage's primary contact section (global,
// shared): dark band, direct email/phone/location, and the quick + detailed
// lead forms. Extracted from the homepage so any page can close on the same
// contact block instead of a page-specific CTA form.

import type { LeadFormConfig } from "@/lib/forms";
import { ContactCapsule } from "@/components/capsules/ContactCapsule";

const EMAIL = "chad@chadworks.co";

const QUICK: LeadFormConfig = {
  source: "contact capsule (quick)",
  subject: "New Quick Contact from the Contact Capsule (chadworks)",
  submitLabel: "Send message to Chad",
  successMessage: "Thank you, your message has been sent.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    {
      kind: "textarea",
      name: "message",
      label: "What's going on?",
      required: true,
      rows: 4,
      placeholder: "The business, and where it's stuck right now.",
    },
  ],
};

const DETAILED: LeadFormConfig = {
  source: "contact capsule (detailed)",
  subject: "New Detailed Inquiry from the Contact Capsule (chadworks)",
  submitLabel: "Send message to Chad",
  successMessage: "Thank you, your message has been sent.",
  fields: [
    { kind: "text", name: "first_name", label: "First Name", required: true, autocomplete: "given-name", span: "half" },
    { kind: "text", name: "last_name", label: "Last Name", required: true, autocomplete: "family-name", span: "half" },
    { kind: "email", name: "email", label: "Email", required: true, autocomplete: "email", span: "half" },
    { kind: "text", name: "business", label: "Business Name", span: "half" },
    { kind: "url", name: "current_url", label: "Existing domain or URL", autocomplete: "url", placeholder: "yourdomain.com" },
    {
      kind: "textarea",
      name: "background",
      label: "Provide some background info on you or the org",
      required: true,
      rows: 4,
      placeholder: "Who you are, and what the business or organization does.",
    },
    {
      kind: "textarea",
      name: "details",
      label: "Describe the idea or scope of the project",
      required: true,
      rows: 5,
      placeholder: "What the site needs to do, and where it's stuck today.",
    },
    { kind: "text", name: "referral_source", label: "How did you find chadworks?", placeholder: "e.g. Google, ChatGPT, a referral" },
  ],
};

// Heading/intro default to the homepage copy; any page can override them (e.g.
// the FAQ page closes with "Still have a question?") while reusing the same
// forms, contact details, and layout.
export function MainContactCapsule({
  heading = "Tell me about your project.",
  intro = "Send me a message about your business, project or initiative. There are no dumb ideas and no stupid questions. Tell me your vision, big or small.",
  headingLevel = "h2",
}: {
  heading?: string;
  intro?: string;
  // Only /contact/ passes "h1" -- there this capsule is the whole page. See
  // ContactCapsule for why.
  headingLevel?: "h1" | "h2";
} = {}) {
  return (
    <ContactCapsule
      id="contact"
      scheme="inverted"
      heading={heading}
      headingLevel={headingLevel}
      intro={intro}
      emailLabel="Email directly"
      email={EMAIL}
      phoneLabel="Call directly"
      phone="(215) 872-1240"
      locationNote="Based in Greater Philadelphia, PA."
      quick={QUICK}
      detailed={DETAILED}
      quickLabel="Quick message"
      detailedLabel="Detailed inquiry"
    />
  );
}
