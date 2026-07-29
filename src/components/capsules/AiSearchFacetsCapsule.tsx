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

import type { ReactNode } from "react";
import { SectionShell } from "@/components/capsules/SectionShell";
import { GemstoneMark } from "@/components/GemstoneMark";
import { ScrollFade } from "@/components/ScrollFade";

// `body` is a ReactNode so a facet can emphasize a word inline (the mentioned /
// cited pair below); a plain string is still the normal case.
type Facet = { title: string; body: ReactNode };
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
          "When someone asks ChatGPT for a business like yours, it answers from whatever it can read about you across the open web, and a business it cannot verify never makes the list. Getting named starts with being visible and legible: a site that states plainly what you do and who you serve, backed by enough mention elsewhere that the assistant is not taking your word for it.",
      },
      {
        title: "Getting cited on ChatGPT",
        body: (
          <>
            Being <em>mentioned</em> and being <em>cited</em> are two different
            outcomes. The citation is the link under the answer, much like
            references listed at the bottom of Wikipedia. Those links actually
            get people over to your site, as opposed to just having your name
            mentioned. These cited pages usually display the real answer in the
            first two sentences instead of four paragraphs down.
          </>
        ),
      },
      {
        title: "Showing up in Google's AI Overviews",
        body:
          "Google's AI answers sit much closer to classic ranking than ChatGPT does. If you already hold page one for a phrase, you have a real shot at the AI overview box above it. If you rank nowhere, you have no chance. This makes Google's AI Overviews the AI visibility channel that traditional SEO affects most directly, and it is usually where the first visible wins show up.",
      },
      {
        title: "All other platforms",
        body:
          "Perplexity, Claude, Copilot and the rest run on the same fundamentals, with each one having its own quirks. This is similar to how Google and Bing each surface mostly — but not exactly — the same results. Your market/audience decides which platform(s) we spend time optimizing for. No one is shopping for luggage on Claude Code, amirite?",
      },
    ],
  },
  {
    label: "On your site",
    facets: [
      {
        title: "Optimizing your website for AI search",
        body:
          "Most of this work is structural rather than cosmetic. Headings have to match the questions people type, and each page is finely tuned to answer one query or intention, which is why expanding your site is likely part of the visibility optimization process. Beneath the content itself is the schema markup. This is the invisible code that tells an assistant what your page is before it reads a word of it.",
      },
      {
        title: "Creating content for AI search",
        body:
          "The old playbook of posting every week to feed an algorithm does very little now. What gets cited and mentioned now is content that addresses a granularly specific query, something like \"that movie with the yellow boat\" or \"the best cinnamon bun in xyz town.\" This kind of content requires something that the agent can confirm, like a number, a process or a position that you defend or describe publicly. AI chat assistants reward uniqueness and depth.",
      },
    ],
  },
  {
    label: "Off your site",
    facets: [
      {
        title: "Getting mentioned where AI looks",
        body:
          "AI assistants read more than your website. Comprehensive AI visibility requires presence off your site too, similar to traditional SEO but to a greater extent. What people say about you is weighted more heavily than what you say about yourself. Getting talked about on Reddit, Wikipedia, in YouTube descriptions and industry round ups are just a few examples of off-site signals that greatly influence your chance of being mentioned or cited by an AI chat bot.",
      },
      {
        title: "Keeping your business identity consistent",
        body:
          "Engines cross-check who you are before they recommend you. Your name, address, phone number, email address and the description of what you do all have to agree across your Google Business Profile, your site's schema, and every profile pointing back at you. Micro contradictions, an old zipcode, or one rogue social media profile that isn't yours but has your name is enough to make an assistant hedge and name somebody else.",
      },
    ],
  },
  {
    label: "The technical side",
    facets: [
      {
        title: "Letting the AI crawlers in",
        body:
          "Assistants read your site with their own crawlers, and a robots.txt written a few years ago may be quietly turning them away. GPTBot, OAI-SearchBot, Google-Extended and PerplexityBot each have to be allowed on purpose. Another factor, among many others, is ensuring the text exists in the HTML, because a site that builds its content with client-side JavaScript can look blank, and AI assistant bots won't hang around for it to render.",
      },
      {
        title: "Measuring AI search visibility",
        body:
          "There is no rank tracker for this the way there is for Google, because the answer changes based on the who, what, where, when and whys that shape their prompt. What works is asking the assistants the questions your buyers ask, on a schedule, and keeping a written record of what comes back. There are platforms that I use to monitor citations, sentiment, competitors and all that jazz, but checking every phrase manually is still the only way to know for sure, just like manually checking your rank on Google.",
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
