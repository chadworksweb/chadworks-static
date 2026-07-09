// The "who is chadworks for?" manifesto. Lives in FULL on the About page (frosted
// panel over the LT cloud); the homepage teases it with eyebrow + heading + intro
// + a "Read the manifesto" CTA. The About panel renders MANIFESTO.body as typed
// blocks: "p" paragraphs, "list" bullet groups, and "beats" tight punch-line
// stacks. Copy is authored verbatim (italics via *asterisks* through emphasize()).
export type ManifestoBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "beats"; items: string[] };

export const MANIFESTO = {
  eyebrow: "The chadworks manifesto",
  heading: "who is chadworks for?",
  intro:
    "chadworks is for motivated individuals and organizations that want to double down on authentic digital presence as a counter measure to social media burnout and AI saturation.",
  body: [
    {
      kind: "p",
      text: "chadworks builds websites and digital experiences for individuals, businesses or organizations that have big ideas or radical perspectives; initiatives that want to shake the Earth beneath our institutionalized culture and society.",
    },
    {
      kind: "list",
      items: [
        "That wild idea that nobody thinks will work, I'll build it.",
        "That online business idea that's too complicated for a freelancer but costs too much by an agency, I'll build it.",
        "That anti-social media platform that will piss off the cool kids, I'll build it.",
        "That social justice platform that needs a values-aligned web dev, I'll build it.",
      ],
    },
    {
      kind: "beats",
      items: [
        "I'm not like the others.",
        "I don't want to sell you maintenance, hosting or retainers.",
        "I don't want to amass a cache of clients and expand into an agency.",
        "And I most certainly don't want to stay in my seat.",
      ],
    },
    {
      kind: "p",
      text: "I want to build websites and platforms for the true movers and shakers of the world.",
    },
    {
      kind: "list",
      items: [
        "No Squarespace",
        "No WordPress (unless it makes sense)",
        "No WIX, no Divi, no Elementor",
        "No templates",
      ],
    },
    { kind: "beats", items: ["No problem."] },
    {
      kind: "p",
      text: "I know my matching client partners are out there. I know our world is ripe for fresh ideas that challenge, ignore and aim to shatter the status quo.",
    },
    {
      kind: "beats",
      items: [
        "If that's you, I want to work with you.",
        "chadworks is who you need to match your wild, liberated, unbridled ambition.",
      ],
    },
  ] satisfies ManifestoBlock[],
};
