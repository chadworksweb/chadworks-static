// Data for the portfolio showroom (Track A). Mirrors the entries the current
// /portfolio route ships, so the showroom and the classic page describe the same
// work. Captures live at /public/portfolio/<slug>-*.jpg. Order is the reel order
// (top to bottom): Rising Compass leads, AAC Event Catering sits at the bottom.

export type ShowroomItem = {
  key: string;
  slug: string; // resolves /portfolio/<slug>-desktop.jpg
  label: string;
  url: string; // chrome-bar display host
  href: string; // live site
  alt: string;
  blurb: string;
  platform?: string; // meta row: "Platform: <value>"
  year?: string; // meta row: "Year: <value>"
  // "what's great" bursts -- shown only in the selected state, for now.
  bursts: string[];
};

export const SHOWROOM_ITEMS: ShowroomItem[] = [
  {
    key: "risingcompass",
    slug: "risingcompass",
    label: "Rising Compass",
    url: "risingcompass.net",
    href: "https://risingcompass.net",
    alt: "Rising Compass website, designed and developed by chadworks",
    blurb: "One of my own builds: a data-driven product with a custom interface.",
    platform: "100% Custom Coded",
    year: "2026",
    bursts: ["Custom interface, real data.", "Shipped the way client work ships."],
  },
  {
    key: "chadlewine",
    slug: "chadlewine",
    label: "Chad Lewine",
    url: "chadlewine.com",
    href: "https://chadlewine.com",
    alt: "chadlewine.com website, designed and developed by chadworks",
    blurb: "My musician-first site, where I push the interaction further.",
    platform: "100% Custom Coded",
    year: "2026",
    bursts: ["Proof of where the work can go.", "Interaction past a client brief."],
  },
  {
    key: "abracadabragems",
    slug: "abracadabragems",
    label: "Abracadabra Gems",
    url: "abracadabragems.com",
    href: "https://abracadabragems.com",
    alt: "Abracadabra Gems website, designed and developed by chadworks",
    blurb: "Gemstones want color and light, so the layout puts the product first.",
    platform: "WordPress x Avada",
    year: "2024",
    bursts: ["Product first, page second.", "Each piece carries the screen."],
  },
  {
    key: "rozariolaw",
    slug: "rozariolaw",
    label: "Rozario Law",
    url: "rozariolaw.com",
    href: "https://rozariolaw.com",
    alt: "Rozario Law website, designed and developed by chadworks",
    blurb: "A law practice has seconds to earn trust.",
    platform: "WordPress x Avada",
    year: "2025",
    bursts: ["Opens steady and serious.", "Tells a visitor what to do next."],
  },
  {
    key: "thorobird",
    slug: "thorobird",
    label: "Thorobird",
    url: "thorobird.com",
    href: "https://thorobird.com",
    alt: "Thorobird website, designed and developed by chadworks",
    blurb: "A brand site with a distinct point of view, custom built.",
    platform: "WordPress",
    year: "2016",
    bursts: ["Carries the personality the business has.", "Custom built, no template."],
  },
  {
    key: "adsautomation",
    slug: "adsautomation",
    label: "ADS Automation",
    url: "adsautomation.com",
    href: "https://adsautomation.com",
    alt: "ADS Automation website, designed and developed by chadworks",
    blurb:
      "Industrial automation is technical work, so the site reads clear and credible.",
    platform: "WP-to-Static",
    year: "2026",
    bursts: ["Credible without the jargon.", "Technical work, made legible."],
  },
  {
    key: "edenscapes",
    slug: "edenscapes",
    label: "EdenScapes",
    url: "eden-scapes.com",
    href: "https://eden-scapes.com/japanese-garden-design-installation/",
    alt: "EdenScapes Japanese garden design website, designed and developed by chadworks",
    blurb: "Japanese garden design deserves a quiet, deliberate site.",
    platform: "WordPress x Divi",
    year: "2026",
    bursts: ["Gives the craft room to breathe.", "Lets the work sell itself."],
  },
  {
    key: "massagepros",
    slug: "massagepros",
    label: "Massage Professionals",
    url: "massageprofessionalsllc.com",
    href: "https://massageprofessionalsllc.com",
    alt: "Massage Professionals website, designed and developed by chadworks",
    blurb: "A calm, trustworthy front door for a local practice.",
    platform: "WP-to-Static",
    year: "2025",
    bursts: ["Booking one tap away on a phone.", "Calm, trustworthy, fast."],
  },
  {
    key: "aac",
    slug: "aac",
    label: "AAC Event Catering",
    url: "aaceventcatering.com",
    href: "https://aaceventcatering.com",
    alt: "AAC Event Catering website, designed and developed by chadworks",
    blurb:
      "A catering brand that needed to look as polished as the events it runs.",
    platform: "WP-to-Static",
    year: "2022",
    bursts: ["Booking-ready front door.", "Built to win the local search."],
  },
];
