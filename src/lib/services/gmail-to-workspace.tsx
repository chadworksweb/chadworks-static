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

import { type Service } from "@/lib/service";
import { WORKSPACE_EXTRA_MAILBOX, WORKSPACE_MONTHLY_CEILING, WORKSPACE_SETUP } from "@/lib/pricing";
import { money } from "@/lib/package-builder";

export const gmailToWorkspace: Service = {
  slug: "switch/gmail-to-workspace",
  lane: "visibility",
  laneLabel: "Visibility",
  eyebrow: "Switch: a real, branded business email",
  title: "Gmail to Google Workspace",
  intent:
    "chadworks moves businesses off a free @gmail.com address onto Google Workspace, so their email reads you@yourdomain.com inside the exact same Gmail interface.",

  // Answer-first lede: names Gmail + Google Workspace and answers
  // what-you-get / what-it-costs in the first 100 words (GEO), Chad's voice.
  answer:
    `Using a free Gmail for your business? It's a bad look, and a fixable one. Here's what most people don't realize: you can put your own domain on your email, you@yourdomain.com, inside the exact same Gmail you already use every day. That is all Google Workspace is. Same inbox, same app, same everything, with your real business name on the address instead of @gmail.com. It runs under ten dollars a month, paid to Google, and I set the whole thing up for you for a flat ${money(WORKSPACE_SETUP)}. Nothing new to learn, just a more credible name on every email you send.`,

  keyFactsHeading: "Gmail to Workspace, at a glance",
  keyFacts: [
    "Google Workspace is the exact same Gmail you already use, the same inbox and the same app, except your address becomes you@yourdomain.com instead of you@gmail.com. Nothing new to learn.",
    `A branded address reads as far more established to a customer than a free @gmail.com, and Google Workspace runs under ${money(WORKSPACE_MONTHLY_CEILING)} a month per user, paid straight to Google.`,
    `chadworks sets the whole thing up for a one-time ${money(WORKSPACE_SETUP)} fee, including a 30-minute training session and your email signature. Extra mailboxes are ${money(WORKSPACE_EXTRA_MAILBOX)} each when set up at the same time.`,
  ],

  problem: {
    heading: "A free Gmail address is quietly costing you credibility",
    subheading: "Same inbox, wrong name on it.",
    body:
      "When your business email comes from yourname@gmail.com, every message you send tells customers you never set up a real, branded address, and a few of them quietly wonder what else got skipped. The fix is not some new email app to learn. It is the same Gmail you already use, with your own domain on it.",
    more: {
      trigger: "Why the address matters",
      paragraphs: [
        "Using a free Gmail for your business is a bad look, plain and simple, and an old AOL or Yahoo address is worse. Before a customer reads a single word you've written, the name on your email has already told them whether you bothered to set up the basics. A you@yourdomain.com address quietly says the opposite: a real, established business that has its act together, for less than ten dollars a month.",
        "And this isn't a switch to some unfamiliar email system you'll have to relearn. Google Workspace is Gmail. The same inbox and the same app on your phone, with every shortcut and label you already lean on. The single thing that changes is the address people see when you email them, so everything else stays exactly where you already keep it today.",
        "The best part is how little it asks of you. The address itself is cheap, under ten dollars a month to Google, and the one genuinely fiddly part, the setup, is the part I handle start to finish. You end up looking more professional to every customer without lifting a finger or learning a thing.",
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
      `Setting up Google Workspace through chadworks is a one-time ${money(WORKSPACE_SETUP)} fee. That covers creating your branded address, getting you switched over, a 30-minute training session, and your email signature. Need more than one mailbox? Additional accounts are ${money(WORKSPACE_EXTRA_MAILBOX)} each when we set them up at the same time. Google Workspace itself is a separate subscription you pay straight to Google, and it runs under ${money(WORKSPACE_MONTHLY_CEILING)} a month per user.`,
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
      a: `A one-time ${money(WORKSPACE_SETUP)} fee to chadworks for the full setup, which includes a 30-minute training session and your email signature. Additional mailboxes are ${money(WORKSPACE_EXTRA_MAILBOX)} each when set up at the same time. Google Workspace itself is under ${money(WORKSPACE_MONTHLY_CEILING)} a month per user, paid directly to Google.`,
    },
    {
      q: "Will I lose my old emails and contacts?",
      a: "In most cases, no, your existing mail and contacts come with you. Google has tools to import from a regular Gmail account, and other providers usually have a path too. The exact route depends on where your email lives today, so I confirm what will carry over for your specific setup before we start, rather than promising blind. You will not be left starting from an empty inbox.",
    },
    {
      q: "Do you need access to my accounts?",
      a: "Yes. I need access to your domain settings to connect your email to Google, and depending on your security setup, we may need to trade a few two-factor codes in real time during the session. I walk you through exactly what is needed, so you are never handing over anything blind.",
    },
    {
      q: "Can you use my existing domain, or do I need a new one?",
      a: "Either works. If you already own a domain, that is the one we put on your email. If you don't have one yet, it is an easy and inexpensive thing to sort out, usually only ten to twenty dollars a year through a registrar, and I'll help you choose the right one and get it pointed where it needs to go. You won't be left to figure out the technical side alone.",
    },
  ],

  cta: {
    heading: "Put your real name on your email",
    body:
      `Ready to put your real name on your email? Reach out and I'll get you switched over to a branded you@yourdomain.com address. It is the same Gmail you already use, a flat ${money(WORKSPACE_SETUP)} for me to set up, and I handle the entire technical side so you don't have to. No pressure on the way in, just a more credible inbox waiting for you on the other end.`,
    buttonLabel: "Get a branded email",
    href: "/contact/",
  },

  meta: {
    title: "Gmail to Google Workspace: Get a Branded you@yourdomain.com Email | chadworks",
    description:
      `Using a free @gmail.com for your business? Get the exact same Gmail with your own domain: you@yourdomain.com, under ${money(WORKSPACE_MONTHLY_CEILING)} a month. chadworks sets up Google Workspace for a one-time ${money(WORKSPACE_SETUP)}, including training and your signature.`,
  },
};
