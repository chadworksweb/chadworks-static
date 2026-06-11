"use client";

import { useEffect, useRef, useCallback } from "react";
import { getCoverCropRect } from "@/lib/coverCrop";

interface WaterRippleProps {
  src: string;
  alt: string;
  className?: string;
  focalX?: number; // 0-1, defaults to 0.5
  focalY?: number; // 0-1, defaults to 0.5
  zoom?: number; // >= 1, defaults to 1
}

// Wave engine is identical to the chadlewine original (damping 0.98, resolution
// 2, stepsPerFrame 3, cosine-falloff drops, *6*dpr displacement). The render
// pipeline is optimized: the cover-cropped source pixels are cached once (not
// re-read every frame), and the rAF loop runs only while the card is active --
// so a grid of these costs the same as chadlewine's one-at-a-time hero.
export function WaterRipple({ src, alt, className, focalX = 0.5, focalY = 0.5, zoom = 1 }: WaterRippleProps) {
  const focalRef = useRef({ x: focalX, y: focalY, z: zoom });
  focalRef.current = { x: focalX, y: focalY, z: zoom };
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);
  const stopTimerRef = useRef<number>(0);

  // Water simulation buffers
  const buf1Ref = useRef<Float32Array | null>(null);
  const buf2Ref = useRef<Float32Array | null>(null);
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  // Cached source pixels (cover-cropped to the canvas) + reused output buffer.
  const srcDataRef = useRef<Uint8ClampedArray | null>(null);
  const outImageRef = useRef<ImageData | null>(null);

  const damping = 0.98;
  const resolution = 2;
  const stepsPerFrame = 3;

  function initBuffers(w: number, h: number) {
    const sw = Math.floor(w / resolution);
    const sh = Math.floor(h / resolution);
    widthRef.current = sw;
    heightRef.current = sh;
    buf1Ref.current = new Float32Array(sw * sh);
    buf2Ref.current = new Float32Array(sw * sh);
  }

  function dropAt(x: number, y: number, radius: number, strength: number) {
    const buf = buf1Ref.current;
    const w = widthRef.current;
    const h = heightRef.current;
    if (!buf) return;

    const sx = Math.floor(x / resolution);
    const sy = Math.floor(y / resolution);
    const sr = Math.floor(radius / resolution);

    for (let dy = -sr; dy <= sr; dy++) {
      for (let dx = -sr; dx <= sr; dx++) {
        const px = sx + dx;
        const py = sy + dy;
        if (px < 0 || px >= w || py < 0 || py >= h) continue;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > sr) continue;
        const factor = Math.cos((dist / sr) * Math.PI * 0.5);
        buf[py * w + px] += strength * factor;
      }
    }
  }

  function stepSimulation() {
    const b1 = buf1Ref.current;
    const b2 = buf2Ref.current;
    const w = widthRef.current;
    const h = heightRef.current;
    if (!b1 || !b2) return;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        b2[i] = (
          b1[i - 1] + b1[i + 1] +
          b1[i - w] + b1[i + w]
        ) / 2 - b2[i];
        b2[i] *= damping;
      }
    }

    // Swap
    buf1Ref.current = b2;
    buf2Ref.current = b1;
  }

  // Cache the cover-cropped source pixels for the current canvas size, and paint
  // the base image once so the card shows at rest (loop is off until hovered).
  const computeSource = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;
    const off = document.createElement("canvas");
    off.width = cw;
    off.height = ch;
    const octx = off.getContext("2d");
    if (!octx) return;
    const crop = getCoverCropRect(
      img.naturalWidth,
      img.naturalHeight,
      cw / ch,
      focalRef.current.x,
      focalRef.current.y,
      focalRef.current.z,
    );
    octx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, cw, ch);
    const base = octx.getImageData(0, 0, cw, ch);
    srcDataRef.current = base.data;
    outImageRef.current = new ImageData(new Uint8ClampedArray(base.data), cw, ch);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.putImageData(base, 0, 0);
  }, []);

  const draw = useCallback(function tick() {
    if (!runningRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const cw = canvas.width;   // device pixels (DPR-scaled)
    const ch = canvas.height;
    const w = widthRef.current;  // sim grid dims (CSS-scale derived)
    const h = heightRef.current;
    const buf = buf1Ref.current;
    const srcData = srcDataRef.current;
    const out = outImageRef.current;

    if (!buf || !srcData || !out || w === 0) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const stride = resolution * dpr;

    for (let s = 0; s < stepsPerFrame; s++) {
      stepSimulation();
    }

    const pixels = out.data;
    // Base = the cached source; interior pixels are then displaced.
    pixels.set(srcData);

    for (let py = 0; py < ch; py++) {
      for (let px = 0; px < cw; px++) {
        const sx = Math.floor(px / stride);
        const sy = Math.floor(py / stride);

        if (sx <= 0 || sx >= w - 1 || sy <= 0 || sy >= h - 1) continue;

        const i = sy * w + sx;
        // Displacement is in CSS px (sim is at CSS scale); scale to device px.
        const dx = (buf[i - 1] - buf[i + 1]) * 6 * dpr;
        const dy = (buf[i - w] - buf[i + w]) * 6 * dpr;

        let sampX = Math.round(px + dx);
        let sampY = Math.round(py + dy);
        sampX = Math.max(0, Math.min(cw - 1, sampX));
        sampY = Math.max(0, Math.min(ch - 1, sampY));

        const dst = (py * cw + px) * 4;
        const src2 = (sampY * cw + sampX) * 4;
        pixels[dst] = srcData[src2];
        pixels[dst + 1] = srcData[src2 + 1];
        pixels[dst + 2] = srcData[src2 + 2];
      }
    }

    ctx.putImageData(out, 0, 0);

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const ensureRunning = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = 0;
    }
    if (runningRef.current) return;
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const scheduleStop = useCallback(() => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    // Let the waves damp out, then stop the loop and repaint the clean base.
    stopTimerRef.current = window.setTimeout(() => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      computeSource();
    }, 1300);
  }, [computeSource]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    imgRef.current = img;

    const resize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const cssW = container.offsetWidth;
      const cssH = container.offsetHeight;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      initBuffers(cssW, cssH);
      computeSource();
    };

    img.onload = resize;
    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      runningRef.current = false;
    };
  }, [src, computeSource]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    dropAt(e.clientX - rect.left, e.clientY - rect.top, 16, 55);
    ensureRunning();
  }, [ensureRunning]);

  // Hover trail: drip a lighter ripple as the cursor moves, throttled by distance.
  const lastMoveRef = useRef<{ x: number; y: number } | null>(null);
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const last = lastMoveRef.current;
    if (last && Math.hypot(x - last.x, y - last.y) < 16) return;
    lastMoveRef.current = { x, y };
    dropAt(x, y, 11, 16);
    ensureRunning();
  }, [ensureRunning]);
  const handlePointerLeave = useCallback(() => {
    lastMoveRef.current = null;
    scheduleStop();
  }, [scheduleStop]);

  return (
    <div
      ref={containerRef}
      className={className}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- invisible sizer for canvas overlay; Image optimization N/A */}
      <img src={src} alt={alt} style={{ width: "100%", display: "block", visibility: "hidden" }} />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
