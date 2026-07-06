// Per-letter spans so a link can run the staggered traveling colorwave on hover
// (the chad-site logo's stepped-delay shimmer, applied to motion). Shared by
// the main nav and the homepage lane sub-titles. The accessible name is
// unaffected -- screen readers still read the joined text.
export function WaveText({ text }: { text: string }) {
  return (
    <span className="nav-wave">
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="nav-wave__letter"
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
