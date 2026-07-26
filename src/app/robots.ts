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
// DELIBERATELY STILL ALLOWED, and worth revisiting: GPTBot (OpenAI) and
// ClaudeBot (Anthropic). Both are the TRAINING crawlers for their vendors, so
// by the rule above they belong on the blocked list. They are allowed anyway
// because each vendor's retrieval is handled by separate agents that are also
// allowed (OAI-SearchBot + ChatGPT-User; Claude-SearchBot + Claude-User), which
// means blocking the two training bots would NOT cost citation in ChatGPT or
// Claude search. What it would cost is presence in the next training run, which
// is a live question for a business selling AI visibility. Chad's call, held
// open on purpose rather than decided here.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/service";

export const dynamic = "force-static";

// Corpus collectors: harvest for model training, return no traffic and no
// citation. Barred here and by clause 2.3 of the Terms.
const TRAINING_ONLY_AGENTS = [
  "CCBot",
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
