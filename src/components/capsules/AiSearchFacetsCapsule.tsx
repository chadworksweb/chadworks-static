// AI SEARCH FACETS -- the /ai-search-visibility/ interstitial that sits between
// the hero and the key facts. Page-signature section: each item is a question a
// buyer actually types into ChatGPT, promoted to an h3 so the engine can lift
// the pair. Not fed by a Service field; the page opts in via
// `overrides.afterHero` (see lib/compose). Rendered in the homepage lane-sub
// shape (.cw-lane-subs): a stack set in from a left accent rule, not cards.
//
// The right half carries the page's signature visual, sticky at y 0 and sitting
// BEHIND the copy so the frosted paragraph panels ride over it: the GoingToBat
// halftone dot field, a glass plate that warps it (SVG displacement via
// backdrop-filter, blur-only where that isn't supported), and the homepage CW
// gem. The gem is held still -- no spin -- but takes `scrollShimmer`, so what it
// refracts sweeps with the page while the shape stays put.

import { SectionShell } from "@/components/capsules/SectionShell";
import { GemstoneMark } from "@/components/GemstoneMark";
import { ScrollFade } from "@/components/ScrollFade";

type Facet = { title: string; body: string };
type Group = { label: string; facets: Facet[] };

// Exported so the hero CTA can anchor to it without the id being written out
// twice and drifting apart.
export const SECTION_ID = "what-goes-into-ai-search-visibility";

const HEADING = "What goes into AI search visibility";

const GROUPS: Group[] = [
  {
    label: "Platform specific",
    facets: [
      {
        title: "Showing up on ChatGPT",
        body:
          "When someone asks ChatGPT for a business like yours, it answers from whatever it can read about you across the open web, and a business it cannot verify quietly never makes the list. Getting named starts with being legible: a site that states plainly what you do and who you serve, backed by enough mention elsewhere that the assistant is not taking your word for it.",
      },
      {
        title: "Getting cited on ChatGPT",
        body:
          "Being mentioned and being cited are two different outcomes. The citation is the link under the answer, the one a reader actually clicks, and it lands on pages that answer a question completely enough to be quoted without editing. That usually means the real answer sits in the first two sentences of the page instead of four paragraphs down.",
      },
      {
        title: "Showing up in Google's AI Overviews",
        body:
          "Google's AI answers sit much closer to classic ranking than ChatGPT does. If you already hold page one for a phrase, you have a real shot at the box above it, and if you rank nowhere the overview is not going to invent you. That makes Overviews the place where ordinary SEO pays off most directly, and usually where the first visible wins show up.",
      },
      {
        title: "All other platforms",
        body:
          "Perplexity, Claude, Copilot and the rest run on the same fundamentals, and each one has quirks of its own, the way Bing and Google have always answered the same query a little differently. What decides the work is which of them your buyers actually open. If your market lives in Claude and Claude Code because the field is technical, or in NotebookLM because the work is research, I tune the campaign in that direction instead of spreading it evenly across platforms nobody in your industry has ever signed into.",
      },
    ],
  },
  {
    label: "On your site",
    facets: [
      {
        title: "Optimizing my website for AI search",
        body:
          "Most of this work is structural rather than cosmetic. Headings have to match the questions people type, and each page needs one job instead of two, because a page blending intents reads as noise to an engine. Underneath that sits the schema markup that tells an assistant what your page is before it reads a word of it.",
      },
      {
        title: "Creating content for AI search",
        body:
          "The old playbook of posting every week to feed an algorithm does very little now. What gets pulled into answers is writing that settles one specific question a buyer asks out loud and puts something checkable in reach: a real number, a named process, a position you are willing to defend in public. Assistants reward the parts nobody else could have written and skip the parts that read like a competitor's site with the name swapped out.",
      },
    ],
  },
  {
    label: "Off your site",
    facets: [
      {
        title: "Getting mentioned where AI looks",
        body:
          "Assistants do not only read your website. They read Reddit threads, Wikipedia, YouTube descriptions, industry roundups and whichever directories your trade actually lives in, and they weigh what other people say about you more heavily than what you say about yourself. A flawless site with no footprint anywhere else reads as unverifiable, which is why a real share of this work happens off your own property.",
      },
      {
        title: "Keeping your business identity consistent",
        body:
          "Engines cross-check who you are before they recommend you. Your name, your address, your phone number and the description of what you do all have to agree across your Google Business Profile, your site's schema, and every profile pointing back at you. Contradictions no human would ever notice, an old suite number or a former business name, are enough to make an assistant hedge and name somebody else.",
      },
    ],
  },
  {
    label: "The technical side",
    facets: [
      {
        title: "Letting the AI crawlers in",
        body:
          "Assistants read your site with their own crawlers, and a robots.txt written a few years ago may be quietly turning them away. GPTBot, OAI-SearchBot, Google-Extended and PerplexityBot each have to be allowed on purpose. The other half of this is whether your words exist in the HTML at all, because a site that paints its content in with JavaScript can look blank to a reader that does not wait around.",
      },
      {
        title: "Measuring AI search visibility",
        body:
          "There is no rank tracker for this the way there is for Google, and anyone selling you one is guessing. What works is asking the assistants the questions your buyers ask, on a schedule, and keeping a written record of what comes back. Alongside that, watch your analytics for the visits arriving from chatgpt.com and its neighbors. It is slower and messier than a ranking report, and it is the honest way to know whether any of this moved.",
      },
    ],
  },
];

export function AiSearchFacetsCapsule() {
  return (
    <SectionShell id={SECTION_ID} className="svc-block cw-facets-section">
      <h2 className="svc-block__heading">{HEADING}</h2>
      <div className="cw-facets">
        <div className="cw-facets__stack">
          {GROUPS.map((g) => (
            <div key={g.label} className="cw-facets__group">
              {/* The group label is a mono kicker, NOT a heading, on purpose:
                  promoting it to an h3 would push every question down to an h4
                  and bury the pairs an engine is actually here to lift. */}
              <p className="eyebrow cw-facets__grouplabel">{g.label}</p>
              <div className="cw-lane-subs">
                {g.facets.map((f) => (
                  <div key={f.title} className="cw-lane-sub">
                    <h3 className="cw-lane-sub__title">{f.title}</h3>
                    <p className="cw-lane-sub__body">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="cw-facets__viz" data-scroll-fade-track aria-hidden="true">
          <div className="cw-facets__sticky">
            <ScrollFade className="cw-facets__plate">
              <span className="cw-facets__grain" />
              <span className="cw-facets__glass" />
              <GemstoneMark
                still
                scrollShimmer
                tiltY={-0.34}
                tiltX={0.16}
                className="cw-facets__gem"
              />
            </ScrollFade>
          </div>
        </div>
      </div>

      {/* The warp used by .cw-facets__glass. Browsers without url() support in
          backdrop-filter fall back to the plain blur declared before it. */}
      <svg className="cw-facets__defs" aria-hidden="true" focusable="false">
        <filter
          id="cw-facets-refract"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.013"
            numOctaves={2}
            seed={7}
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale={22}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </SectionShell>
  );
}
