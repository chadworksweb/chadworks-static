// PLATFORM OPTIONS CAPSULE -- the four platforms chadworks builds websites on
// (Custom Coded, WordPress, Ecommerce, Shopify), as ONE canonical, self-
// contained section shared across the Websites lane. Split out of the per-page
// `paths` data (Chad, 2026-07-19) so /web-design/ and /web-development/ read the
// SAME options instead of drifting into two different copies. Rendered as the
// horizontal stacked lanes (icon-free), the /web-design/ reference treatment.
//
// Prop-less on purpose: the content is fixed and shared, like RatesCapsule /
// FitCapsule. If a page ever needs a variation, add an override prop then.
//
// The four targets are still SEALED (custom-coded-static / wordpress / ecommerce
// / shopify are absent from launch.ts), so `comingSoon` locks the lanes with the
// "coming soon" tooltip instead of linking into noindex pages. REMOVE comingSoon
// when those pages launch, or the lanes stay locked after they go live.

import type { Service } from "@/lib/service";
import { PathsCapsule } from "@/components/capsules/PathsCapsule";

const PLATFORM_OPTIONS: NonNullable<Service["paths"]> = {
  heading: "Platform Options", // default; a page can prefix it (see `prefix`)
  intro:
    "I offer four different platforms on which I can build your website. When you call for your free consultation, we'll discuss the options and likely settle on the option that is best for your situation.",
  comingSoon: true,
  items: [
    {
      label: "Custom Coded",
      detail:
        "Custom code is how websites were built before CMS platforms like WordPress and builders like Squarespace came along, and in the age of deep internet saturation, custom coded websites are rising again as the go-to for those who want to stand out in a world of templates. Custom coded sites have total control over the design and the function of the website. It's like a block of clay that you get to sculpt into anything you want.",
      href: "/custom-coded-static/",
    },
    {
      label: "WordPress",
      detail:
        "WordPress powers over 40% of the internet, and for good reason. WordPress is a CMS (content management system), which is a type of website platform that has a user-friendly interface that allows non-web designers to edit not only the content of their site, but much of the design, layout and surface level code, without knowing any code. The thing is, WordPress became ubiquitous. An entire economy has been built up around it, which creates amazing opportunity, but also has led to the templatization of the web. If it makes sense to use WordPress for your project, I'll make sure it's not a cookie cutter design.",
      href: "/wordpress/",
    },
    {
      label: "Ecommerce",
      detail:
        "Ecommerce is a website with a product and payment system built in. This can be as simple as a PDF download or as complex as a multi-line fashion label. Ecommerce websites aren't necessarily their own type of platform, but rather a set of functions and features that can be built custom, built into WordPress or built on Shopify. If you want to sell online, ecommerce is what you want.",
      href: "/ecommerce/",
    },
    {
      label: "Shopify",
      detail:
        "Shopify is the DIY / Squarespace of ecommerce. While I can build everything Shopify does as a bespoke website you own and control 100%, Shopify is an option if you need to get online on a budget. The trade-off for the speed and convenience is that you'll be using templates, and monthly costs can pile up for special features. I will happily work with Shopify, but I will always tell my clients if building custom is better for their long-term needs.",
      href: "/shopify/",
    },
  ],
};

// `prefix` puts the page's name in front of the shared heading (e.g. "Web
// Design" -> "Web Design Platform Options") while the four options themselves
// stay canonical. No prefix falls back to the bare "Platform Options".
export function PlatformOptionsCapsule({ prefix }: { prefix?: string } = {}) {
  const heading = prefix ? `${prefix} Platform Options` : PLATFORM_OPTIONS.heading;
  return <PathsCapsule paths={{ ...PLATFORM_OPTIONS, heading }} layout="rows" />;
}
