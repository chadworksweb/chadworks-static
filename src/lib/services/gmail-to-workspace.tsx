// Situation page: "Gmail to Google Workspace" (/switch/gmail-to-workspace/).
// A high-intent acquisition surface (CWS-INFORMATION-ARCHITECTURE.md). Unlike
// the project-build pages, this is a PRODUCTIZED setup service with a real,
// fixed price, so the price section is written rather than a posture prompt.
// Funnels into the Visibility lane (branded email is a credibility play).
//
// WIREFRAME PASS, built from Chad's concept (2026-06-09). Written copy follows
// the voice profile + humanizing rules (no em-dashes, no triplets, no exact-three
// lists, reader-experience framing). Voice-critical persuasion stays in prompt()
// amber blocks carrying Chad's verbatim angles.
//
// PROCESS NOTE (kept here so it isn't lost): setup needs access to the client's
// domain DNS, and depending on their security setup, a few REAL-TIME 2FA codes
// traded during the session. Surfaced honestly in the approach and an FAQ.

import { type Service, prompt } from "@/lib/service";

export const gmailToWorkspace: Service = {
  slug: "switch/gmail-to-workspace",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "Switch: a real, branded business email",
  title: "Gmail to Google Workspace",
  intent:
    "chadworks moves businesses off a free @gmail.com address onto Google Workspace, so their email reads you@yourdomain.com inside the exact same Gmail interface.",

  // Answer-first lede. PROMPT: Chad's hooks verbatim so the voice stays his.
  answer: prompt(
    "Answer-first lede (Chad's voice)",
    "Open with Chad's hook: \"Using a Gmail for your business? Bad look.\" Then the reveal: did you know you can use your own domain name, you@yourdomain.com, inside the Gmail interface you already know? It is the exact same product, just your real, branded email address, and it is less than $10 a month. Quotable in the first 100 words. First-person, warm. Name the entities (Gmail, Google Workspace) and answer the question (what you get, what it costs) up front for GEO.",
  ),

  keyFactsHeading: "Gmail to Workspace, at a glance",
  keyFacts: [
    "Google Workspace is the exact same Gmail you already use, the same inbox and the same app, except your address becomes you@yourdomain.com instead of you@gmail.com.",
    "A branded address reads as more established to a customer than a free @gmail.com, and Google Workspace runs under $10 a month per user, paid to Google.",
    "chadworks sets the whole thing up for a one-time $300 fee, which includes a 30-minute training session and your email signature.",
    "Bringing your team over? Additional accounts are $25 each when they are set up at the same time.",
    "It is the same Gmail interface either way, so there is nothing new to learn. The only thing that changes is the name on your email.",
  ],

  problem: {
    heading: "A free Gmail address is quietly costing you credibility",
    subheading: "Same inbox, wrong name on it.",
    body:
      "When your business email comes from yourname@gmail.com, every message you send tells customers you never set up a real, branded address, and a few of them quietly wonder what else got skipped. The fix is not some new email app to learn. It is the same Gmail you already use, with your own domain on it.",
    more: {
      trigger: "Why the address matters",
      paragraphs: [
        prompt(
          "The 'bad look' argument",
          "Chad's angle, near-verbatim: using a Gmail for your business is a bad look. A free @gmail.com, or worse an old AOL or Yahoo or Comcast address, signals amateur before the customer reads a word. A you@yourdomain.com address signals a real, established business, for less than $10 a month.",
        ),
        prompt(
          "Same product, no learning curve",
          "Reassure: this is not switching to some unfamiliar email system. Google Workspace IS Gmail, the identical interface, app, and features, just branded to your domain. Nothing to relearn. The only thing that changes is the name on your email.",
        ),
        prompt(
          "Cheap and done-for-you",
          "Close the loop: a branded address is surprisingly cheap, under $10 a month to Google, and the only real hurdle, the setup, is the part I handle for you. You end up looking more professional without lifting a finger or learning a thing.",
        ),
      ],
    },
  },

  approach: {
    heading: "How the switch works",
    steps: [
      {
        title: "We start with your domain",
        body:
          "I need access to your domain settings to point your email at Google. If you are not sure where your domain lives or how to get in, that is normal, and I will help you track it down.",
      },
      {
        title: "I set up Google Workspace on your domain",
        body:
          "I create your you@yourdomain.com mailbox in Google Workspace, the identical Gmail interface, now branded to your business. If your team is coming too, I set up their addresses at the same time.",
      },
      {
        title: "We verify it securely",
        body:
          "Depending on your security setup, we may trade a few real-time two-factor codes during the session, so plan for a little back-and-forth while we get everything connected and confirmed.",
      },
      {
        title: "Training and signature",
        body:
          "We finish with a 30-minute training session so you are comfortable, and I set up your professional email signature before we are done.",
      },
    ],
  },

  proof: {
    heading: "Proof, not promises",
    items: [
      {
        label: "Done-for-you, start to finish",
        detail:
          "You never touch a DNS record or a settings menu. I handle the technical setup and hand you a working, branded inbox.",
      },
      {
        label: "It is just Gmail",
        detail:
          "The strongest proof is that there is nothing exotic to trust. It is Google's own Gmail and Workspace, the same tools millions of businesses already run, with your name on it.",
      },
    ],
  },

  price: {
    heading: "What it costs, plainly",
    body:
      "Setting up Google Workspace through chadworks is a one-time $300 fee. That covers creating your branded address, getting you switched over, a 30-minute training session, and your email signature. Need more than one mailbox? Additional accounts are $25 each when we set them up at the same time. Google Workspace itself is a separate subscription you pay straight to Google, and it runs under $10 a month per user.",
  },

  qualification: {
    heading: "Is this for you?",
    fitLabel: "Switch if",
    fit: [
      "You still run your business off a free @gmail.com, or an old Yahoo or AOL address.",
      "Your email does not match your website, and you know it looks a little unfinished.",
      "Looking more established matters to you, but learning a brand-new email system does not appeal.",
      "You already own your domain, or you are ready to.",
    ],
    notLabel: "Probably not if",
    notFit: [
      "You already run Google Workspace or Microsoft 365 on your own domain.",
      "You have no domain and no interest in having one.",
    ],
  },

  faqs: [
    {
      q: "Is this the same as regular Gmail?",
      a: "Yes. It is the identical Gmail interface and app you already know. The only difference is your address becomes you@yourdomain.com instead of you@gmail.com, so there is nothing new to learn.",
    },
    {
      q: "What does it cost?",
      a: "A one-time $300 fee to chadworks for the full setup, which includes a 30-minute training session and your email signature. Additional mailboxes are $25 each when set up at the same time. Google Workspace itself is under $10 a month per user, paid directly to Google.",
    },
    {
      q: "Will I lose my old emails and contacts?",
      a: prompt(
        "Migration / data-safety answer",
        "Answer honestly in Chad's voice: clarify what carries over. Existing mail and contacts can generally be migrated into Workspace, but confirm the exact path for the client's current setup (Gmail import vs another provider) before promising. Keep it reassuring without overstating.",
      ),
    },
    {
      q: "Do you need access to my accounts?",
      a: "Yes. I need access to your domain settings to connect your email to Google, and depending on your security setup, we may need to trade a few two-factor codes in real time during the session. I walk you through exactly what is needed, so you are never handing over anything blind.",
    },
    {
      q: "Can you use my existing domain, or do I need a new one?",
      a: prompt(
        "Domain ownership answer",
        "Cover both cases in Chad's voice: if you already own a domain, we use it. If you do not have one yet, note whether chadworks registers it for you or points you to it, and any cost. Confirm Chad's preferred handling before finalizing.",
      ),
    },
  ],

  cta: {
    heading: "Put your real name on your email",
    body: prompt(
      "CTA body (low-friction)",
      "Close in Chad's voice: invite them to reach out to get switched onto a branded you@yourdomain.com address. Reinforce that it is the same Gmail, a flat $300 to set up, and that I handle the technical part. Keep it warm and low-pressure.",
    ),
    buttonLabel: "Get a branded email",
    href: "/contact/",
  },

  meta: {
    title: "Gmail to Google Workspace: Get a Branded you@yourdomain.com Email | chadworks",
    description:
      "Using a free @gmail.com for your business? Get the exact same Gmail with your own domain: you@yourdomain.com, under $10 a month. chadworks sets up Google Workspace for a one-time $300, including training and your signature.",
  },
};
