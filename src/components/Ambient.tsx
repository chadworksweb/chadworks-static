// Ambient drifting particles (ported from the niche pages). Fixed, masked to the
// top of the viewport, behind all content -- atmospheric depth, CSS-only motion.
// Positions are hardcoded (no Math.random) to avoid hydration mismatch.

const DOTS: { left: string; top: string; delay: string; dur: string }[] = [
  { left: "8%", top: "14%", delay: "0s", dur: "17s" },
  { left: "22%", top: "30%", delay: "3s", dur: "21s" },
  { left: "35%", top: "10%", delay: "6s", dur: "19s" },
  { left: "48%", top: "26%", delay: "1.5s", dur: "23s" },
  { left: "61%", top: "16%", delay: "8s", dur: "18s" },
  { left: "73%", top: "32%", delay: "4s", dur: "22s" },
  { left: "85%", top: "12%", delay: "10s", dur: "20s" },
  { left: "92%", top: "28%", delay: "2s", dur: "24s" },
  { left: "15%", top: "44%", delay: "7s", dur: "20s" },
  { left: "44%", top: "40%", delay: "11s", dur: "25s" },
  { left: "67%", top: "46%", delay: "5s", dur: "19s" },
  { left: "80%", top: "42%", delay: "9s", dur: "23s" },
];

export function Ambient() {
  return (
    <div className="cw-ambient" aria-hidden="true">
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="cw-ambient__dot"
          style={{
            left: d.left,
            top: d.top,
            animationDelay: d.delay,
            animationDuration: d.dur,
          }}
        />
      ))}
    </div>
  );
}
