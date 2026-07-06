"use client";

// CHANNEL-STATIC GRAIN -- the noise re-randomizes IN PLACE every frame (the
// channel-4 TV effect), borrowing the Crystopa Forge lava concept: a tiny
// offscreen canvas repainted per frame, then tiled across the band. Nothing
// slides; the texture itself lives. Throttled to ~12fps (analog cadence),
// parked off-screen, reduced-motion renders a single still frame.

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";

const TILE = 256;
const FRAME_MS = 150; // ~6.5fps -- slow analog shimmer (Chad: slower)
// Luminance spread around neutral mid-gray. Overlay blend treats 128 as
// invisible, so a tighter spread = lower contrast (Chad: more subtle).
const SPREAD = 88;

export function GrainField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    off.width = TILE;
    off.height = TILE;
    const octx = off.getContext("2d");
    if (!octx) return;
    const img = octx.createImageData(TILE, TILE);
    const data = img.data;

    const sync = () => {
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);

    function paint() {
      // Fresh random luminance per pixel, per frame -- static, regenerated.
      // Compressed around mid-gray so the overlay blend stays soft.
      for (let i = 0; i < data.length; i += 4) {
        const v = (128 + (Math.random() - 0.5) * SPREAD) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      octx!.putImageData(img, 0, 0);
      const pattern = ctx!.createPattern(off, "repeat");
      if (pattern) {
        ctx!.fillStyle = pattern;
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      }
    }

    const reduced = prefersReducedMotion();
    if (reduced) {
      paint();
      return () => ro.disconnect();
    }

    let parked = false;
    let last = 0;
    let raf = 0;
    // Honor the global motion pause -- the static freezes on its last frame
    // when motion is off, and re-randomizes when it resumes.
    let motionPaused = isMotionPaused();
    const io = new IntersectionObserver(([entry]) => {
      parked = !entry.isIntersecting;
    });
    io.observe(canvas);
    const unsubMotion = subscribeMotion((v) => {
      motionPaused = v;
    });

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (parked || motionPaused || now - last < FRAME_MS) return;
      last = now;
      paint();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      unsubMotion();
    };
  }, []);

  return <canvas ref={canvasRef} className="svc-grain-canvas" aria-hidden="true" />;
}
