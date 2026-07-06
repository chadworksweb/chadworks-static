// STUB module pages for the Leave Social Media platform. Each is a real,
// routable Service rendered through the normal template, but the persuasion
// copy is left as prompt() amber "TO WRITE" blocks (same convention as the rest
// of the site). Titles, intents, and metadata are real so the pages have a
// spine and SEO. Fill these in when a module gets scoped.
//
// SPIKE: created alongside /switch/leave-social-media/. Source modules from the
// Crystopa Forge "The Greenfield" flagship spec (SFVV, World Pass, the
// Proliferator, the Content Engine, expLOREr).

import { type Service, prompt } from "@/lib/service";

type StubInput = {
  slug: string;
  title: string;
  eyebrow: string;
  intent: string;
  metaTitle: string;
  metaDescription: string;
};

function moduleStub(s: StubInput): Service {
  return {
    slug: s.slug,
    lane: "websites",
    laneLabel: "Websites",
    breadcrumbParent: {
      label: "Leave Social Media",
      href: "/switch/leave-social-media/",
    },
    eyebrow: s.eyebrow,
    title: s.title,
    intent: s.intent,
    answer: prompt(
      "Answer-first lede",
      `Open with what ${s.title} is and why it matters to a small business leaving social media, in Chad's voice, inside the first 100 words.`
    ),
    keyFacts: [
      prompt(
        "Key facts",
        `A few extractable facts about ${s.title} as a module of the Leave Social Media platform.`
      ),
    ],
    problem: {
      heading: `Why ${s.title} matters`,
      body: prompt(
        "Problem",
        `The specific problem this module solves for a small business that wants to own its audience.`
      ),
    },
    approach: {
      heading: "How it works",
      steps: [
        {
          title: "To write",
          body: prompt(
            "Approach",
            `How ${s.title} gets built and deployed on the client's own domain.`
          ),
        },
      ],
    },
    price: {
      heading: "What it costs",
      body: prompt(
        "Price posture",
        `The add-on pricing posture for ${s.title}. Value-based, no fake fixed number.`
      ),
    },
    faqs: [
      {
        q: `What is ${s.title}?`,
        a: prompt("FAQ answer", `A plain-language answer describing ${s.title}.`),
      },
    ],
    cta: {
      heading: `Add ${s.title} to your platform`,
      body: prompt(
        "CTA",
        `Invite the reader to add this module. Point back to the main Leave Social Media page and to contact.`
      ),
      buttonLabel: "Talk it through",
      href: "/contact/",
    },
    meta: { title: s.metaTitle, description: s.metaDescription },
  };
}

export const lsmSfvv = moduleStub({
  slug: "switch/leave-social-media/sfvv",
  title: "Your Own Feed",
  eyebrow: "Leave Social Media: the entry module",
  intent:
    "The full-screen swipeable feed on the client's own domain, the front door of the owned platform.",
  metaTitle: "Your Own Feed: The Social-Style Feed on Your Domain | chadworks",
  metaDescription:
    "A full-screen, swipeable feed on your own domain, the format your customers already scroll. The entry module of the Leave Social Media platform.",
});

export const lsmWorldPass = moduleStub({
  slug: "switch/leave-social-media/world-pass",
  title: "The Engagement Economy",
  eyebrow: "Leave Social Media: an add-on module",
  intent:
    "The passes, rewards, achievements, and referrals layer that keeps visitors coming back to the owned platform.",
  metaTitle: "The Engagement Economy: Rewards and Referrals You Own | chadworks",
  metaDescription:
    "Passes, rewards, achievements, referrals, and gifts on your own domain. The engagement add-on of the Leave Social Media platform.",
});

export const lsmProliferator = moduleStub({
  slug: "switch/leave-social-media/proliferator",
  title: "The Automated Poster",
  eyebrow: "Leave Social Media: an add-on module",
  intent:
    "The automated social distribution engine that turns owned content into teasers pointing back to the client's site.",
  metaTitle:
    "The Automated Poster: Social Teasers That Point Home | chadworks",
  metaDescription:
    "An automated poster that turns your content into social teasers driving people back to your site. The distribution add-on of the Leave Social Media platform.",
});

export const lsmContentEngine = moduleStub({
  slug: "switch/leave-social-media/content-engine",
  title: "Your Industry Content World",
  eyebrow: "Leave Social Media: an add-on module",
  intent:
    "The custom, vertical-specific content layer built for the client's particular business.",
  metaTitle: "Your Industry Content World: Custom-Built, No Template | chadworks",
  metaDescription:
    "The content layer built for your specific business, your products, and your customers. The custom-world add-on of the Leave Social Media platform.",
});

export const lsmExplorer = moduleStub({
  slug: "switch/leave-social-media/explorer",
  title: "Your Story as an Archive",
  eyebrow: "Leave Social Media: an add-on module",
  intent:
    "The brand-heritage interface that turns the client's history into an explorable archive.",
  metaTitle: "Your Story as an Archive: An Explorable Heritage World | chadworks",
  metaDescription:
    "Your history and behind-the-scenes turned into an explorable archive instead of a flat About page. The heritage add-on of the Leave Social Media platform.",
});
