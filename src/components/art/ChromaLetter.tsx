"use client";

// ChromaLetter -- a single hero letter filled with living color: orbiting
// color drops blended per-pixel (gaussian falloff, squared weights so the
// nearest drop wins) on a tiny canvas, upscaled into the letterform via
// background-clip: text. Lineage: the Chroma Soup scheme from the Libra
// Engine Motion Toolkit (prospector mascot) and the Crystopa Forge lava "g".
// Brand variant: the hues stay inside the chadworks indigo->purple range
// (plus one warm copper drop, the band-outlier tradition) and OSCILLATE a few
// degrees instead of rotating the full wheel, so the letter feels alive
// without ever leaving the palette.
//
// Performance: 40x52 canvas, ~30fps, parks off-screen via IntersectionObserver,
// reduced-motion renders ONE static frame. The static-HTML / pre-JS fallback is
// a CSS gradient (.chroma-letter's background), so GEO and no-JS readers always
// see a painted letter.

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const W = 40;
const H = 52;
const FRAME_MS = 33; // ~30fps

// Drops: hue (deg), orbit center (cx, cy in 0-1), orbit radii, speed, radius.
// The letter sits near the PALE end of the H1 ramp (between light blurple and
// lavender), so the palette lives in that register: light blurples, purples,
// lavenders (l 0.55-0.78), with one slightly deeper purple for body and one
// soft copper drop as the warm outlier. Dark/saturated drops broke the ramp
// (Chad, 2026-06-11: "what's up with the gradient").
const DROPS = [
  { hue: 235, cx: 0.3, cy: 0.25, ox: 0.22, oy: 0.18, sp: 0.31, r: 0.42, s: 0.5, l: 0.66 },
  { hue: 265, cx: 0.7, cy: 0.3, ox: 0.2, oy: 0.24, sp: 0.23, r: 0.4, s: 0.52, l: 0.6 },
  { hue: 252, cx: 0.5, cy: 0.62, ox: 0.26, oy: 0.2, sp: 0.27, r: 0.44, s: 0.45, l: 0.55 },
  { hue: 242, cx: 0.25, cy: 0.78, ox: 0.18, oy: 0.16, sp: 0.35, r: 0.38, s: 0.48, l: 0.72 },
  { hue: 278, cx: 0.78, cy: 0.74, ox: 0.18, oy: 0.2, sp: 0.21, r: 0.4, s: 0.5, l: 0.78 },
  { hue: 30, cx: 0.55, cy: 0.45, ox: 0.3, oy: 0.26, sp: 0.16, r: 0.28, s: 0.42, l: 0.72 },
];

function hslToRgb(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

// Tiny value noise to break up mathematical smoothness (toolkit step 5).
function noise2(x: number, y: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export function ChromaLetter({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const img = ctx.createImageData(W, H);

    const reduced = prefersReducedMotion();
    let raf = 0;
    let last = 0;
    let parked = false;

    function paint(t: number) {
      // Global hue sway: +-9deg sine, so the palette breathes but never leaves brand.
      const sway = Math.sin(t * 0.18) * 9;
      const d = img.data;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = x / W;
          const ny = y / H;
          let wr = 0, wg = 0, wb = 0, wsum = 0;
          for (const dr of DROPS) {
            const px = dr.cx + Math.cos(t * dr.sp + dr.hue) * dr.ox;
            const py = dr.cy + Math.sin(t * dr.sp * 1.3 + dr.hue) * dr.oy;
            const dx = nx - px;
            const dy = (ny - py) * (H / W); // keep falloff circular on the tall canvas
            const dist2 = dx * dx + dy * dy;
            const raw = Math.exp(-dist2 / (2 * dr.r * dr.r));
            const w = raw * raw; // squared: nearest drop dominates, no grey soup
            const [r, g, b] = hslToRgb(dr.hue + sway, dr.s, dr.l);
            wr += r * w;
            wg += g * w;
            wb += b * w;
            wsum += w;
          }
          const inv = wsum > 0 ? 1 / wsum : 0;
          const grain = (noise2(x + t, y - t) - 0.5) * 14;
          const i = (y * W + x) * 4;
          d[i] = wr * inv + grain;
          d[i + 1] = wg * inv + grain;
          d[i + 2] = wb * inv + grain;
          d[i + 3] = 255;
        }
      }
      ctx!.putImageData(img, 0, 0);
      el!.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (parked || now - last < FRAME_MS) return;
      last = now;
      paint(now / 1000);
    }

    if (reduced) {
      paint(2.4); // one pleasing static frame
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      parked = !entry.isIntersecting;
    });
    io.observe(el);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <span ref={ref} className="chroma-letter">
      {children}
    </span>
  );
}
