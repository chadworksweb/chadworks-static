// robots.txt -- generated at build into the static export (GEO checklist 4).
//
// The split is deliberate, and it mirrors clause 2.3 of /terms-of-service/:
// RETRIEVAL is the product, TRAINING is not licensed.
//
//   Allowed  -- search crawlers and the assistant crawlers that fetch a page to
//               answer a live question and cite it. Getting quoted in those
//               answers is what /show-up-on-chatgpt/ and /visibility/ sell, so
//               blocking them would work against the business.
//   Blocked  -- the corpus collectors that exist to build training sets and
//               cite nothing back. CCBot feeds Common Crawl.
//
// GOOGLE-EXTENDED: MOVED TO ALLOWED, 2026-07-26. It sat on the blocked list on
// the reading that it is training-only and separate from Googlebot, which is
// half right: disallowing it does cost zero Search ranking. What the old note
// missed is that Google's own crawler documentation lists Grounding in Gemini
// Apps and Grounding with Google Search on Vertex AI among the things it gates.
// Grounding is RETRIEVAL -- it is how a Gemini answer reaches a live page and
// names the source. Disallowing it opted this site out of the Gemini contest
// entirely, on a site that sells being named in AI answers, while the Scorecard
// on /show-up-on-chatgpt/ tells clients an unblocked Google-Extended is a pass.
// The token is now dual-purpose, so training and grounding cannot be split at
// robots.txt. The split moves to the Terms instead: clause 2.3 prohibits
// training use outright AND states that robots.txt compliance is not
// authorization under it. So allowing the fetch here grants retrieval, not a
// training license. If Google ever separates the two tokens, revisit.
//
// Keep this file and terms-of-service clause 2.3 in agreement. A permissive
// robots.txt is the first thing pointed at when a scraping prohibition in the
// Terms is challenged.
//
// GPTBot AND CLAUDEBOT: NOW BLOCKED, 2026-07-30 (Chad). They sat on the allowed
// list with this note recording the decision as held open. It is now made.
//
// Both are the TRAINING crawlers for their vendors, so by the rule above they
// always belonged on the blocked list, and leaving them out made the stated
// policy fictional: the file blocked CCBot and the smaller collectors while
// waving through the two largest. Clause 2.3 of the Terms prohibits training
// use, and a robots.txt that permits the biggest training crawlers is the first
// thing an opponent points at when that clause is challenged.
//
// The cost is presence in the next training run, and it was priced before
// deciding rather than assumed. It is small: this site is ~23 pages against
// corpora of trillions of tokens, so chadworks.co was never going to be what
// teaches a model who chadworks is. Models learn a small entity from OTHER
// domains discussing it (an editorial feature, a byline, a podcast transcript),
// and none of those are governed by this file. So the parametric-knowledge play
// belongs to Part 2 of CHADWORKS-PLACEMENT-MAP.md, not to robots.txt.
//
// Citation is UNAFFECTED, which is the whole reason this is safe. Each vendor's
// retrieval runs on separate agents that remain allowed (OAI-SearchBot +
// ChatGPT-User; Claude-SearchBot + Claude-User), and retrieval is what
// /show-up-on-chatgpt/ actually sells.
//
// PAIRED COPY FIX, do not undo one without the other: the Scorecard and lane
// copy on /show-up-on-chatgpt/ used to list GPTBot and ClaudeBot alongside
// OAI-SearchBot and PerplexityBot as "AI crawlers" that must be unblocked. That
// conflated training with retrieval, and it would have made this site fail its
// own published test. Those pages now name the retrieval crawlers only and say
// out loud that the training bots are a separate decision. If this list ever
// changes again, check `grep -rn "GPTBot" src/` before shipping.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/service";

export const dynamic = "force-static";

// Corpus collectors: harvest for model training, return no traffic and no
// citation. Barred here and by clause 2.3 of the Terms.
const TRAINING_ONLY_AGENTS = [
  "CCBot",
  "GPTBot",
  "ClaudeBot",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Bytespider",
  "Omgilibot",
  "anthropic-ai",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: TRAINING_ONLY_AGENTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
