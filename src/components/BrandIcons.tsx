// BRAND ICONS -- official marks for the off-site profiles linked in the footer.
//
// All are single-path, monochrome, and use fill="currentColor" so they inherit
// the footer's link colour and its hover state. Inline rather than files: five
// small paths cost less than five requests, and the footer renders on all 23
// routes.
//
// PROVENANCE, so nobody has to re-derive it:
//   GitHub, Crunchbase, Reddit -- simple-icons (CC0), viewBox 0 0 24 24.
//   LinkedIn                   -- Bootstrap Icons (MIT), viewBox 0 0 16 16.
//                                 NOT simple-icons: LinkedIn was removed from
//                                 that set after a trademark request.
//   Contra                     -- RECONSTRUCTED. Contra publishes no SVG mark
//                                 and is in no icon set; their only asset is a
//                                 180x180 PNG favicon. This is that mark built
//                                 as geometry: four quadrants around a cross
//                                 gap, each with its outer corner carved out by
//                                 a concave arc, leaving points at the four edge
//                                 midpoints. Swap it if their brand team ever
//                                 ships a real SVG.
//
// Mixed viewBoxes are fine and deliberate: each icon keeps its source geometry
// and CSS sizes the <svg> box, so nothing is rescaled by hand.

type IconProps = { className?: string };

const BASE = {
  fill: "currentColor",
  "aria-hidden": true as const,
  focusable: "false" as const,
  xmlns: "http://www.w3.org/2000/svg",
};

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className} viewBox="0 0 16 16">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className} viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function CrunchbaseIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className} viewBox="0 0 24 24">
      <path d="M21.6 0H2.4A2.41 2.41 0 0 0 0 2.4v19.2A2.41 2.41 0 0 0 2.4 24h19.2a2.41 2.41 0 0 0 2.4-2.4V2.4A2.41 2.41 0 0 0 21.6 0zM7.045 14.465A2.11 2.11 0 0 0 9.84 13.42h1.66a3.69 3.69 0 1 1 0-1.75H9.84a2.11 2.11 0 1 0-2.795 2.795zm11.345.845a3.55 3.55 0 0 1-1.06.63 3.68 3.68 0 0 1-3.39-.38v.38h-1.51V5.37h1.5v4.11a3.74 3.74 0 0 1 1.8-.63H16a3.67 3.67 0 0 1 2.39 6.46zm-.223-2.766a2.104 2.104 0 1 1-4.207 0 2.104 2.104 0 0 1 4.207 0z" />
    </svg>
  );
}

export function RedditIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className} viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z" />
    </svg>
  );
}

// Four quadrants around a 1-unit cross gap. Each arc is centred on that
// quadrant's OUTER corner with radius 11.5, so it carves the corner away and
// leaves a point at the middle of each edge.
export function ContraIcon({ className }: IconProps) {
  return (
    <svg {...BASE} className={className} viewBox="0 0 24 24">
      <path d="M11.5 0H0v11.5A11.5 11.5 0 0 1 11.5 0Z" />
      <path d="M24 11.5V0H12.5A11.5 11.5 0 0 1 24 11.5Z" />
      <path d="M12.5 24H24V12.5A11.5 11.5 0 0 1 12.5 24Z" />
      <path d="M0 12.5V24h11.5A11.5 11.5 0 0 1 0 12.5Z" />
    </svg>
  );
}
