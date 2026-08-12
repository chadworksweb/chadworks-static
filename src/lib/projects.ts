// PROJECTS -- the single source of truth for chadworks' body of work.
//
// A Project is the entity. Every portfolio piece is one, whether or not it ever
// gets a page of its own. The surfaces are DERIVED from this list; none of them
// carries its own copy of the work.
//
// WHY THIS EXISTS. The work used to live in three hand-maintained lists that
// nothing connected: ARCHIVE/FEATURED/HELD_BACK in PortfolioShowcaseCapsule,
// SHOWROOM_ITEMS in showroom/showroom-data.ts, and a `portfolio:` block on
// individual Service objects. Adding a project to one and not the others is
// silent -- tsc, next build and every other gate pass -- and that failure landed
// three separate times (rslgo dropped off the reel, a dead `portfolio` block in
// web-development.tsx, the staging vhost nearly missing from deploy.sh). The
// expansion plan calls it "the recurring defect on this codebase".
// `scripts/portfolio-audit.mjs` was built to CATCH the drift. This removes the
// place drift can happen: one list, derived surfaces.
//
// The per-service `portfolio:` blocks are NOT folded in here. Those are curated
// per service page and are a different thing; the audit still guards them.
//
// TWO ORDERS, BOTH DELIBERATE (Chad, 2026-07-27). The reel and the archive grid
// are curated differently and neither is an accident -- the Weather Map runs
// third in the grid and twentieth on the reel; AAC is eighth in the grid and
// deliberately last on the reel. So:
//   - ARRAY ORDER is the reel order (/showroom/, top to bottom).
//   - `archiveRank` is the grid order, ascending.
// Ranks are sparse (multiples of ten) so a project can be slotted between two
// others without renumbering the list. They are numbers ON the project rather
// than a second array of keys, deliberately: a list of keys pointing at other
// keys is the exact shape that made a HELD_BACK typo silent.
//
// Captures resolve through lib/captures.ts as /portfolio/<slug>-<device>.webp.

export type Project = {
  // KEY == SLUG, always (Chad, 2026-07-28). The two drifted apart twice --
  // key "risingcompass" against slug "rising-compass", key "russ-tree-service"
  // against slug "russtree" -- and a key that only ALMOST matches its slug is
  // the worst of both: every surface indexes on the key, every file resolves
  // from the slug, and typing one where you meant the other fails silently.
  // When they disagree the SLUG wins, because it is the half with consequences:
  // it builds the public URL and it names the capture files on disk. The key is
  // internal and free to move. portfolio-audit.mjs enforces this, so a new
  // project cannot reintroduce the split.
  key: string;
  slug: string; // resolves the capture: /portfolio/<slug>-<device>.webp
  label: string;
  url: string; // chrome-bar display host
  href?: string; // live site; omit for a piece with no public link
  alt: string;
  platform?: string; // meta row: "Platform: <value>"
  year?: string; // meta row: "Year: <value>"

  // THE REEL (/showroom/). Short, and written to be read while the piece is
  // moving past. Also what the mobile archive grid on that page shows.
  reelBlurb: string;
  bursts: string[]; // "what's great" -- selected state only, for now

  // THE SHOWCASE GRID (homepage + service pages, via PortfolioShowcaseCapsule).
  // Longer and more specific than the reel blurb. Genuinely different copy, not
  // a duplicate: the reader is standing still here.
  gridBlurb?: string; // omitted only by the flagship, which renders no card
  archiveRank?: number; // grid order; omitted by the flagship
  inShowcase?: boolean; // renders in the CURATED grid (was: absent from HELD_BACK)

  // The flagship. Renders as the full-width FeaturedShowcase instead of a card,
  // so it is excluded from the grid rather than ranked within it.
  featured?: boolean;

  // ON THE RECORD, ON NO SURFACE. A hidden project exists as an entity -- it owns
  // its slug, and therefore its captures -- but renders nowhere: not the reel,
  // not the archive grid, not the curated showcase. It is how a piece stays
  // accounted for without being shown (Chad, 2026-07-28).
  //
  // This is a FLAG, not a fourth list, for the reason in the header: a list of
  // keys pointing at other keys is the shape that made a HELD_BACK typo silent.
  //
  // Because it renders no card, a hidden project carries no `gridBlurb` and no
  // `archiveRank`, and portfolio-audit.mjs skips both checks for it. It still
  // needs a unique key, a slug, and a capture on disk -- owning the capture is
  // most of the point.
  hidden?: boolean;
};

// Reel order. Rising Compass leads, AAC sits at the bottom.
export const PROJECTS: Project[] = [
  {
    key: "rising-compass",
    // Renamed from "risingcompass" 2026-07-28 (Chad). The slug is what the
    // public URL is built from (/showroom/rising-compass/), so it takes the
    // hyphen, and the key follows it -- see the KEY == SLUG rule above.
    // Renaming the slug also renamed the captures it resolves
    // (/portfolio/rising-compass-<device>.webp, /portfolio/wall/rising-compass.jpg)
    // and the content file behind the page. The old URL 301s (see
    // deploy/chadworks.conf).
    slug: "rising-compass",
    label: "Rising Compass",
    url: "risingcompass.net",
    href: "https://risingcompass.net",
    alt: "Rising Compass website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb: "One of my own builds: a data-driven product with a custom interface.",
    bursts: ["Custom interface, real data.", "Shipped the way client work ships."],
    featured: true,
  },
  {
    key: "scinet",
    slug: "scinet",
    label: "SciNet Industries",
    url: "scinet-industries.vercel.app",
    href: "https://scinet-industries.vercel.app",
    alt: "SciNet Industries website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb: "A science-forward biotech concept, built to read clearly to any visitor.",
    bursts: ["Hard science, made legible.", "Concept brand, investor-ready."],
    gridBlurb:
      "A brand and product site for SciNet Industries, a microbiome-therapeutics concept.",
    archiveRank: 10,
    inShowcase: true,
  },
  {
    key: "sweatshop",
    slug: "sweatshop",
    label: "Sweatshop",
    url: "sweatshop-studio.vercel.app",
    href: "https://sweatshop-studio.vercel.app",
    alt: "Sweatshop website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb: "An infrared fitness studio concept, with the energy of the room on the page.",
    bursts: ["Motion that matches the workout.", "Concept site, launch-ready."],
    gridBlurb:
      "A concept launch site for Sweatshop, an infrared fitness studio, with motion and heat worked into the design so the page carries the feel of the room.",
    archiveRank: 50,
    inShowcase: true,
  },
  {
    key: "chadlewine",
    slug: "chadlewine",
    label: "Chad Lewine",
    url: "chadlewine.com",
    href: "https://chadlewine.com",
    alt: "chadlewine.com website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb: "My musician-first site, where I push the interaction further.",
    bursts: ["Proof of where the work can go.", "Interaction past a client brief."],
    gridBlurb:
      "Likely the world's most immersive and custom-developed artist website. Custom: ecommerce shop, content development, AI integration, API integration, email campaign manager, 3D graphics, effects, branding, CMS and much more.",
    archiveRank: 60,
    // Pulled from the curated showcase grid (Chad, 2026-08-12); stays on the
    // reel. gridBlurb + archiveRank kept so re-listing is one flag flip.
    inShowcase: false,
  },
  {
    key: "radiantarc",
    slug: "radiantarc",
    label: "Radiant Arc",
    url: "chadlewine.com/radiant-arc",
    href: "https://chadlewine.com/radiant-arc",
    alt: "Radiant Arc interactive timeline, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb:
      "A whole creative life on one interactive timeline, drawn live from the database.",
    bursts: ["Ten layers you switch on and off.", "Every view you land on has a link."],
    gridBlurb:
      "An interactive data visualization that puts a whole creative life on one screen: songs, albums, life eras, places, relationships, and the Rising Compass charge of every release, all read live from the database. Ten layers switch on and off while the span zooms and pans. Any view you land on carries its own link, so one year is something you can hand to someone.",
    archiveRank: 70,
    inShowcase: true,
  },
  {
    key: "audioplayer",
    slug: "audioplayer",
    label: "Streaming Audio Player",
    url: "demos.chadworks.co/sap",
    href: "https://demos.chadworks.co/sap",
    alt: "Streaming Audio Player interface example, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb:
      "An interface example: a rack-unit audio player with a live spectrum visualizer and a ten band EQ.",
    bursts: ["Spectrum bars run on real Web Audio.", "Ten band EQ, wired to the output."],
    gridBlurb:
      "A WINAMP imitation: LCD readout, a spectrum visualizer running on real Web Audio, a ten band equalizer, and a collapsible discography browser.",
    archiveRank: 40,
    inShowcase: true,
  },
  {
    key: "rslgo",
    slug: "rslgo",
    label: "RSLgo",
    url: "rslgo.com",
    href: "https://rslgo.com",
    alt: "RSLgo website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb:
      "A consulting practice with a real storefront, custom coded down to the landing pages.",
    bursts: ["Consulting work that actually sells.", "Every landing page built to fit."],
    gridBlurb:
      "A custom coded consulting practice website with ecommerce, custom-designed digital products and highly tailored landing/marketing pages.",
    archiveRank: 30,
    inShowcase: true,
  },
  {
    key: "abracadabragems",
    slug: "abracadabragems",
    label: "Abracadabra Gems",
    url: "abracadabragems.com",
    href: "https://abracadabragems.com",
    alt: "Abracadabra Gems website, designed and developed by chadworks",
    platform: "WordPress x Avada",
    year: "2024",
    reelBlurb: "Gemstones want color and light, so the layout puts the product first.",
    bursts: ["Product first, page second.", "Each piece carries the screen."],
    gridBlurb: "WordPress website for a permanent jewelry artisan out of California.",
    archiveRank: 150,
  },
  {
    key: "rozariolaw",
    slug: "rozariolaw",
    label: "Rozario Law",
    url: "rozariolaw.com",
    href: "https://rozariolaw.com",
    alt: "Rozario Law website, designed and developed by chadworks",
    platform: "WordPress x Avada",
    year: "2025",
    reelBlurb: "A law practice has seconds to earn trust.",
    bursts: ["Opens steady and serious.", "Tells a visitor what to do next."],
    gridBlurb:
      "WordPress website for NYC law firm with a custom homepage and custom blog system.",
    archiveRank: 90,
  },
  {
    key: "videofeed",
    slug: "videofeed",
    label: "Short Form Vertical Video",
    url: "demos.chadworks.co/sfvv",
    href: "https://demos.chadworks.co/sfvv",
    alt: "Short form vertical video feed interface example, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb:
      "An interface example: a vertical feed that snaps clip to clip, where only the clip you land on plays.",
    bursts: ["Only the clip you land on plays.", "Sponsored cards fold into the run."],
    gridBlurb:
      "A vertical feed that snaps clip to clip inside a phone frame, where only the clip you land on plays and sponsored cards fold into the run.",
    archiveRank: 100,
  },
  {
    key: "thorobird",
    slug: "thorobird",
    label: "Thorobird",
    url: "thorobird.com",
    // No live-site link: the client has not kept the site in good shape, so the
    // piece stays in the portfolio but does not point at it (2026-07-23).
    alt: "Thorobird website, designed and developed by chadworks",
    platform: "WordPress",
    year: "2016",
    reelBlurb: "A brand site with a distinct point of view, custom built.",
    bursts: ["Carries the personality the business has.", "Custom built, no template."],
    gridBlurb:
      "WordPress website for NYC real estate brokerage firm with custom designed homepage.",
    archiveRank: 110,
  },
  {
    key: "adsautomation",
    slug: "adsautomation",
    label: "ADS Automation",
    url: "adsautomation.com",
    href: "https://adsautomation.com",
    alt: "ADS Automation website, designed and developed by chadworks",
    platform: "WP-to-Static",
    year: "2026",
    reelBlurb:
      "Industrial automation is technical work, so the site reads clear and credible.",
    bursts: ["Credible without the jargon.", "Technical work, made legible."],
    gridBlurb:
      "Industrial automation is technical work, so the site reads clear and credible without drowning a visitor in jargon.",
    archiveRank: 140,
  },
  {
    key: "edenscapes",
    slug: "edenscapes",
    label: "EdenScapes",
    url: "eden-scapes.com",
    href: "https://eden-scapes.com/japanese-garden-design-installation/",
    alt: "EdenScapes Japanese garden design website, designed and developed by chadworks",
    platform: "WordPress x Divi",
    year: "2026",
    reelBlurb: "Japanese garden design deserves a quiet, deliberate site.",
    bursts: ["Gives the craft room to breathe.", "Lets the work sell itself."],
    gridBlurb:
      "Japanese garden design deserves a quiet, deliberate site. I gave the craft room to breathe and the work room to sell itself.",
    archiveRank: 120,
  },
  {
    key: "massagepros",
    slug: "massagepros",
    label: "Massage Professionals",
    url: "massageprofessionalsllc.com",
    href: "https://massageprofessionalsllc.com",
    alt: "Massage Professionals website, designed and developed by chadworks",
    platform: "WP-to-Static",
    year: "2025",
    reelBlurb: "A calm, trustworthy front door for a local practice.",
    bursts: ["Booking one tap away on a phone.", "Calm, trustworthy, fast."],
    gridBlurb:
      "A calm, trustworthy front door for a local practice, with the booking path one tap away on a phone.",
    archiveRank: 130,
  },
  {
    key: "aes",
    slug: "aes",
    label: "Artist Empowerment Suite",
    url: "artistempowermentsuite.com",
    href: "https://artistempowermentsuite.com",
    alt: "Artist Empowerment Suite website, designed and developed by chadworks",
    platform: "WP-to-Static",
    year: "2026",
    reelBlurb: "A musician-first toolkit, built so the artist owns the whole thing.",
    bursts: ["Own it all, not rent it back.", "Custom store, custom throughout."],
    gridBlurb:
      "A platform site for Artist Empowerment Suite, a toolkit that lets recording artists run their music and their fan base from one place instead of renting it back from the big-tech platforms. Custom hero, custom store, custom throughout.",
    archiveRank: 160,
    inShowcase: true,
  },
  {
    key: "videoplayer",
    slug: "videoplayer",
    label: "Traditional Video Player",
    url: "demos.chadworks.co/tvp",
    href: "https://demos.chadworks.co/tvp",
    alt: "Traditional Video Player interface example, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb:
      "An interface example: a CRT video player with a searchable library and nested category playlists.",
    bursts: ["A CRT monitor you can actually play.", "Search the library, browse the playlists."],
    gridBlurb:
      "A CRT video player: monitor bezel, VHS counter, a searchable library, and playlists built from nested categories.",
    archiveRank: 170,
  },
  {
    key: "jeremyhayes",
    slug: "jeremyhayes",
    label: "Jeremy John Hayes",
    url: "jeremy-john-hayes.vercel.app",
    href: "https://jeremy-john-hayes.vercel.app",
    alt: "Jeremy John Hayes website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb: "A horror author's book launch, built to set the mood and sell the book.",
    bursts: ["Atmosphere first, then the sale.", "Custom built around one title."],
    gridBlurb:
      "A book-launch site for horror author Jeremy John Hayes and his collection The Possessing Hour, custom built to pull a reader into the mood of the book and carry them to the buy button.",
    archiveRank: 180,
  },
  {
    key: "detrixhe",
    slug: "detrixhe",
    label: "Dr. Jonathan Detrixhe",
    url: "jonathandetrixhe.com",
    href: "https://jonathandetrixhe.com",
    alt: "Dr. Jonathan Detrixhe website, designed and developed by chadworks",
    platform: "WP-to-Static",
    year: "2023",
    reelBlurb: "A Brooklyn psychologist's practice, warm to read and easy to find.",
    bursts: ["Warm for patients, legible for search.", "Structured to get cited."],
    gridBlurb:
      "A practice site for Dr. Jonathan Detrixhe, a clinical psychologist in Greenpoint, Brooklyn, structured so a nervous new patient and an AI search engine both find the answer they came for.",
    archiveRank: 190,
    inShowcase: true,
  },
  {
    key: "salpattica",
    slug: "salpattica",
    label: "Salpattica",
    url: "salpattica.com",
    href: "https://www.salpattica.com",
    alt: "Salpattica website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb:
      "A stationery and fine-art studio's shop, with its handmade character intact.",
    bursts: ["Handmade feel, real storefront.", "Product first, cart a tap away."],
    gridBlurb:
      "An online shop for Salpattica Creative Design Co., a stationery and fine-art studio, with the handmade character of the work carried through the storefront and the product kept front and center.",
    archiveRank: 200,
  },
  {
    key: "tomweather",
    slug: "tomweather",
    label: "Weather Map Generator",
    url: "map.tomtheweatherwizard.com",
    href: "https://map.tomtheweatherwizard.com",
    alt: "Weather Map Generator app, designed and developed by chadworks",
    platform: "Custom Web + Desktop App",
    year: "2026",
    reelBlurb:
      "A broadcast-style tool that turns a raw forecast into a clean, shareable weather map.",
    bursts: ["Sketch the snow, drop the cities.", "Export a finished graphic, ready to post."],
    gridBlurb:
      "Custom developed web and desktop app. A broadcast-style tool that turns a raw forecast into a clean, shareable weather map. You sketch the snow zones and drop the cities right on the map, then export a finished graphic ready to post.",
    archiveRank: 20,
    inShowcase: true,
  },
  {
    key: "ttww",
    slug: "ttww",
    label: "Tom the Weather Wizard",
    url: "tomtheweatherwizard.com",
    href: "https://tomtheweatherwizard.com",
    alt: "Tom the Weather Wizard website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb: "A meteorologist's brand and merch site, all personality and typographic wit.",
    bursts: ["A running joke, turned into a page.", "Custom built, shirt a tap away."],
    gridBlurb:
      "A personality-forward brand and merch site for broadcast meteorologist Tom the Weather Wizard, custom built to turn a running joke about Midwest spring into a page people share and a shirt they buy.",
    archiveRank: 210,
  },
  {
    key: "therapistexample",
    slug: "therapistexample",
    label: "Mara Calloway, LPC",
    url: "mara-calloway-lpc.vercel.app",
    href: "https://mara-calloway-lpc.vercel.app",
    alt: "Mara Calloway, LPC therapy website, designed and developed by chadworks",
    platform: "100% Custom Coded",
    year: "2026",
    reelBlurb: "An example build for a therapy practice, calm and easy to trust.",
    bursts: ["A steady front door for a practice.", "Booking path kept obvious."],
    gridBlurb:
      "An example build for a private therapy practice. Calm, credible, and organized so a first-time visitor knows within seconds they are in the right place, with the booking path never more than a tap away.",
    archiveRank: 220,
  },
  {
    key: "aac",
    slug: "aac",
    label: "AAC Event Catering",
    url: "aaceventcatering.com",
    href: "https://aaceventcatering.com",
    alt: "AAC Event Catering website, designed and developed by chadworks",
    platform: "WP-to-Static",
    year: "2022",
    reelBlurb:
      "A catering brand that needed to look as polished as the events it runs.",
    bursts: ["Booking-ready front door.", "Built to win the local search."],
    gridBlurb:
      "Custom WordPress-to-static catering company website with pixel-perfection and custom form spam blocking.",
    archiveRank: 80,
  },

  // HIDDEN. Exists as an entity so the russtree captures belong to something,
  // and renders on no surface: not the reel, not the archive grid, not the
  // curated showcase (Chad, 2026-07-28). No `gridBlurb`, no `archiveRank`, no
  // `inShowcase` -- a hidden project renders no card, so any of those would be
  // dead data that reads as live, and portfolio-audit.mjs rejects them here.
  // Key and slug are both "russtree". The key used to be "russ-tree-service";
  // it was aligned down to the slug on 2026-07-28, not the other way round,
  // because the slug is what resolves the capture
  // (/portfolio/russtree-desktop.webp) and it already matches the run-together
  // form every other slug on this list uses.
  {
    key: "russtree",
    slug: "russtree",
    label: "Russ Tree Service",
    url: "russtreeservice.com",
    alt: "Russ Tree Service website, designed and developed by chadworks",
    reelBlurb: "",
    bursts: [],
    hidden: true,
  },
];

// ---------------------------------------------------------------------------
// DERIVED VIEWS. Every portfolio surface reads one of these. None of them holds
// its own copy of the work, so a project cannot go missing from one of them.
// ---------------------------------------------------------------------------

/** Everything the site actually SHOWS, in reel order. Hidden projects exist in
 *  PROJECTS (they own their slug and captures) but render on no surface, so
 *  every view below is built from this rather than from PROJECTS directly.
 *  Declared FIRST: the views below read it at module scope. */
export const VISIBLE_PROJECTS: Project[] = PROJECTS.filter((p) => !p.hidden);

/** The flagship: rendered full-width by FeaturedShowcase, never as a grid card. */
export const FEATURED_PROJECT: Project =
  VISIBLE_PROJECTS.find((p) => p.featured) ?? VISIBLE_PROJECTS[0];

/** Everything that renders as a grid card, in ARCHIVE order (not reel order). */
export const ARCHIVE_PROJECTS: Project[] = VISIBLE_PROJECTS.filter((p) => !p.featured).sort(
  (a, b) => (a.archiveRank ?? 0) - (b.archiveRank ?? 0)
);

/** The curated selection: what the showcase capsule actually renders. */
export const SHOWCASE_PROJECTS: Project[] = ARCHIVE_PROJECTS.filter((p) => p.inShowcase);
