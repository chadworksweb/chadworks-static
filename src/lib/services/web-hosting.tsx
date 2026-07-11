// Service: Web Hosting (Websites lane) -- SPIKE / SCAFFOLD (2026-07-11).
// Spun off from the web-development page's "Stability/Uptime" beat once the
// hosting angle earned its own page. The lede is Chad's real copy; every other
// section is a prompt() TO-WRITE placeholder until the copy pass. Page is
// deliberately NOT in launch.ts, so it renders sealed (noindex) until launched.
//
// .tsx (not .ts) so the lede can carry inline markup. Copy in Chad's PUBLIC
// voice (the chad voice profile), run against the humanizing voice rules.

import type { Service } from "@/lib/service";
import { prompt } from "@/lib/service";

export const webHosting: Service = {
  slug: "web-hosting",
  lane: "websites",
  laneLabel: "Websites",
  eyebrow: "The ground your site stands on",
  title: "Web Hosting",
  intent:
    "chadworks hosts client sites on privately managed, high-performance servers built for uptime, speed, and security.",

  // Answer-first lede -- Chad's copy, verbatim.
  answer: (
    <>
      &quot;Uptime&quot; is critical, and the host you&apos;re on matters. Cheap
      or outdated hosting can lead to more downtime, which leads to lost leads or
      customers. I only build on privately managed, cutting edge servers so your
      site is as stable as a Fortune 500 conglomerate.
    </>
  ),

  keyFactsHeading: "Web hosting, at a glance",
  keyFacts: [
    prompt("Key fact 1", "Uptime / stability angle -- privately managed servers."),
    prompt("Key fact 2", "Speed angle -- how the host affects load time and search."),
    prompt("Key fact 3", "Security angle -- what private, cutting-edge hosting protects against."),
    prompt("Key fact 4", "Ownership angle -- hosting stays in the client's name."),
  ],

  problem: {
    heading: "Why your host matters more than you think",
    subheading: "Invisible until the day it isn't.",
    body: prompt(
      "Problem lead",
      "One-line summary of what bad hosting quietly costs a business (downtime -> lost leads/customers)."
    ),
  },

  approach: {
    heading: "How I host it",
    steps: [
      {
        title: "Privately managed servers",
        body: prompt("Step 1 body", "What 'privately managed' means and why it beats cheap shared hosting."),
      },
      {
        title: "Built for speed and uptime",
        body: prompt("Step 2 body", "How the server setup keeps the site fast and always up."),
      },
      {
        title: "You own the hosting",
        body: prompt("Step 3 body", "Hosting ends up in the client's name -- no lock-in."),
      },
    ],
  },

  price: {
    heading: "What it costs, plainly",
    body: prompt("Price posture", "Value-based hosting posture, honest about not being the cheapest."),
  },

  faqs: [
    {
      q: "What kind of servers do you host on?",
      a: prompt("FAQ 1 answer", "Describe the privately managed, cutting-edge server setup."),
    },
    {
      q: "Do I own my hosting?",
      a: prompt("FAQ 2 answer", "Yes -- hosting stays in the client's name, no lock-in."),
    },
    {
      q: "Is this more expensive than cheap shared hosting?",
      a: prompt("FAQ 3 answer", "Honest posture on cost vs. the downtime cost of cheap hosting."),
    },
  ],

  cta: {
    heading: "Want hosting you never have to think about?",
    body: prompt("CTA body", "Invite the reader to reach out about hosting."),
    buttonLabel: "Tell me about your project",
    href: "/contact/",
  },

  meta: {
    title: "Web Hosting -- Privately Managed, Built for Uptime | chadworks",
    description:
      "The host you're on decides whether your site stays up, loads fast, and stays secure. chadworks hosts on privately managed, cutting-edge servers built for uptime.",
  },
};
