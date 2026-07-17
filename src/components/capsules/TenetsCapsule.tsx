// TENETS CAPSULE -- "chadworks tenets of transparency" (global, shared).
//
// Moved off /web-design/ and onto /about/ on 2026-07-17 (Chad's call). The
// tenets are about how chadworks operates, not about how a website gets
// designed, so they belong with the person rather than with one service. They
// now sit immediately before "Are We A Good Fit?": what I promise you, then who
// I promise it to.
//
// Owns its copy the way FitCapsule owns the fit copy, because /about/ is not a
// Service page and cannot reach a `service.assurance` slot. This is the
// canonical home of the tenet text; nothing else should retype it.
//
// The "tenets" variant is the constitutional treatment: a narrow centered
// column of hairline-ruled articles, each a roman numeral beside a bold
// statement, ported from the Libra Engine Compass tenets page.

import { AssuranceCapsule } from "@/components/capsules/AssuranceCapsule";

export function TenetsCapsule() {
  return (
    <AssuranceCapsule
      variant="tenets"
      assurance={{
        heading: "chadworks tenets of transparency",
        items: [
          "Everything I create for you is legally yours, upon final payment.",
          "Every project includes at least one week of post-launch coverage.",
          "No nonsense or fluff. Direct questions and direct answers, in the name of protecting your business goals.",
          "No lock-in, no long-term contracts or chadworks' proprietary technology or platforms that hold your project hostage should you want to leave.",
        ],
      }}
    />
  );
}
