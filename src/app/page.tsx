/* Home -- the hero is the showpiece (HomeHero: terminal-style typing reveal of
   the wordmark + the tagline lift-in). The sections below remain skeleton and
   demonstrate the page-shell grid; real content/brand TBD. */

import HomeHero from "@/components/HomeHero";

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* SECTION COLOR SCHEMES -- the three named section treatments, one example
          of each. See CWS-DESIGN-SYSTEM.md > SECTION COLOR SCHEMES. */}

      {/* Default -- white */}
      <section className="section full scheme-default">
        <p className="eyebrow">Default</p>
        <h2 style={{ fontSize: "var(--text-2xl)" }}>White section, same rail.</h2>
        <p className="measure-prose" style={{ color: "var(--text-secondary)", marginTop: "var(--space-sm)" }}>
          The default scheme. The background touches the viewport edges, the
          content keeps the exact site-width gap as every other section.
        </p>
      </section>

      {/* Alternate -- lavender */}
      <section className="section full scheme-alternate">
        <p className="eyebrow">Alternate</p>
        <h2 style={{ fontSize: "var(--text-2xl)" }}>Lavender section.</h2>
        <p className="measure-prose" style={{ color: "var(--text-secondary)", marginTop: "var(--space-sm)" }}>
          The alternate scheme: lavender background with a hairline border. Used to
          set a section apart from the default white around it.
        </p>
      </section>

      {/* Inverted -- dark blue */}
      <section className="section full scheme-inverted">
        <p className="eyebrow">Inverted</p>
        <h2 style={{ fontSize: "var(--text-2xl)" }}>Dark blue section.</h2>
        <p className="measure-prose" style={{ color: "var(--dark-muted)", marginTop: "var(--space-sm)" }}>
          The inverted scheme: dark indigo background, text inverts. Use it for
          contrast, CTAs, or contact. Never two inverted sections back to back.
        </p>
      </section>
    </>
  );
}
