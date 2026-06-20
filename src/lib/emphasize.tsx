import type { ReactNode } from "react";

// Render a plain string with markdown-style *emphasis* as <em>, preserving all
// spacing exactly as written.
//
// WHY THIS EXISTS: SWC/Turbopack strips the edge space of a MULTILINE JSX text
// node sitting next to an inline element, so authoring italic copy as JSX
// (`foo <em>bar</em> baz` wrapped across lines) silently renders "barbaz". It
// diverges from Babel here, and hand-patching each spot with {" "} is fragile.
// A JS string has no such whitespace rules, so copy authored as a string and
// run through this helper can never lose a space. Use it for any data-driven
// body copy that needs italics.
export function emphasize(text: string): ReactNode {
  if (!text.includes("*")) return text;
  // Split on *...* spans; capture group means the delimited text is kept, at
  // odd indices, while the surrounding plain text (with its spaces) is even.
  return text.split(/\*([^*]+)\*/g).map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : part
  );
}
