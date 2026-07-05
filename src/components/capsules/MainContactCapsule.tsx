// MAIN CONTACT CAPSULE -- the homepage's primary contact section (global,
// shared): dark band, direct email/phone/location, and the quick + detailed
// lead forms. Extracted from the homepage so any page can close on the same
// contact block instead of a page-specific CTA form.

import type { LeadFormConfig } from "@/lib/forms";
import { ContactCapsule } from "@/components/capsules/ContactCapsule";

const EMAIL = "chad@chadworks.co";

const QUICK: LeadFormConfig = {
  source: "one-pager (quick)",
  subject: "New Quick Contact from the One Pager (chadworks)",
  submitLabel: "Send message to Chad",
  successMessage:
    "Got it. This lands straight in my inbox and I read every one myself. You'll hear back within a day.",
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
  source: "one-pager (detailed)",
  subject: "New Detailed Inquiry from the One Pager (chadworks)",
  submitLabel: "Send message to Chad",
  successMessage:
    "Got it, and thanks for the detail. I read every inquiry myself, and you'll hear back within a day with a straight answer on the number.",
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

export function MainContactCapsule() {
  return (
    <ContactCapsule
      scheme="inverted"
      heading="Tell me about your project."
      intro="Send me a message about your business, project or initiative. There are no dumb ideas and no stupid questions. Tell me your vision, big or small."
      emailLabel="Email directly"
      email={EMAIL}
      phoneLabel="Call directly"
      phone="(215) 872-1240"
      locationNote="Based in Pennsylvania, working with businesses across the country and beyond."
      quick={QUICK}
      detailed={DETAILED}
      quickLabel="Quick message"
      detailedLabel="Detailed inquiry"
    />
  );
}
