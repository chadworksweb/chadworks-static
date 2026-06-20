"use client";

// =====================================================================
// GemstoneMark -- a SMALL, decorative twin of the hero GemstoneCW. Same cut
// crystal, same brand-gradient refraction (white -> #8054bc -> #e5d2f4), but
// stripped to the essentials: it just spins on Y at a fixed tilt. No cursor
// engagement, no mask/hit-test, no puffs. Built for flanking a heading.
//
// Shares the exact geometry + shaders + LOCKED defaults with the hero via
// @/lib/gemstone-core, so the two read as the same gem at two sizes. The loop
// parks via IntersectionObserver when off-screen and obeys the global motion
// toggle; prefers-reduced-motion renders a single static frame.
// =====================================================================

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion } from "@/lib/motion";
import {
  M4,
  buildCW,
  fsTri,
  bgFrag,
  gemVert,
  gemFrag,
  LOCKED,
} from "@/lib/gemstone-core";

// No tilt: the mark stays upright and spins purely on Y, so each gem opens
// from a flat, front-facing CW. CAM_Z is pulled in closer than the hero's
// -4.2 so the wide CW fills the small badge box.
const CAM_Z = -3.1;

export function GemstoneMark({
  spinDir = 1,
  speed = 0.55,
  still = false,
  tiltY = 0,
  tiltX = 0,
  cursorShimmer = false,
  specDamp = 0,
  className,
}: {
  spinDir?: 1 | -1;
  speed?: number;
  // "still": the shape holds a fixed tilt (tiltY/tiltX) instead of spinning.
  still?: boolean;
  tiltY?: number;
  tiltX?: number;
  // "cursorShimmer": the cursor pans the refraction + speculars (the surface
  // shimmer) without moving the shape. The gradient still drifts so it's alive.
  cursorShimmer?: boolean;
  // 0..1 -- scales the specular highlights DOWN, so the shimmer stays dynamic
  // without the peaks blowing out to white.
  specDamp?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) return; // SSR/no-WebGL: purely decorative, the title stands alone.

    const compile = (t: number, s: string) => {
      const sh = gl.createShader(t)!;
      gl.shaderSource(sh, s);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(sh) || "shader");
      return sh;
    };
    const program = (v: string, f: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, v));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, f));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(p) || "program");
      return p;
    };

    // A lost/unusable context (e.g. the browser hit its live WebGL-context cap
    // during SPA navigation) makes shader compiles fail with an empty info log.
    // Catch it so the mark just stays absent instead of throwing out of the
    // effect and crashing the whole route.
    let bgProg: WebGLProgram, gemProg: WebGLProgram;
    try {
      bgProg = program(fsTri, bgFrag);
      gemProg = program(gemVert, gemFrag);
    } catch (err) {
      console.warn("GemstoneMark: WebGL shader build failed; mark omitted.", err);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }
    const emptyVao = gl.createVertexArray();

    const m = buildCW(LOCKED.depth);
    const gemCount = m.count;
    const gemVao = gl.createVertexArray();
    gl.bindVertexArray(gemVao);
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, m.pos, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    const nrmBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
    gl.bufferData(gl.ARRAY_BUFFER, m.nrm, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    let fbo: WebGLFramebuffer | null = null,
      fboTex: WebGLTexture | null = null,
      fboW = 0,
      fboH = 0;
    const resizeFbo = (w: number, h: number) => {
      if (w === fboW && h === fboH) return;
      fboW = w;
      fboH = h;
      if (!fbo) {
        fbo = gl.createFramebuffer();
        fboTex = gl.createTexture();
      }
      gl.bindTexture(gl.TEXTURE_2D, fboTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const u = {
      bgTime: U(bgProg, "uTime"),
      bgRes: U(bgProg, "uRes"),
      bgA: U(bgProg, "uA"),
      bgB: U(bgProg, "uB"),
      bgC: U(bgProg, "uC"),
      gProj: U(gemProg, "uProj"),
      gView: U(gemProg, "uView"),
      gModel: U(gemProg, "uModel"),
      gNormal: U(gemProg, "uNormal"),
      gBg: U(gemProg, "uBg"),
      gRes: U(gemProg, "uRes"),
      gRef: U(gemProg, "uRefract"),
      gDis: U(gemProg, "uDisp"),
      gTint: U(gemProg, "uTint"),
      gFac: U(gemProg, "uFacet"),
      gCursor: U(gemProg, "uCursor"),
      gDamp: U(gemProg, "uSpecDamp"),
    };

    let DPR = 1;
    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * DPR),
        h = Math.round(canvas.clientHeight * DPR);
      if (w < 1 || h < 1) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      resizeFbo(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let t0 = 0,
      prevTs = 0;
    let rotY = 0; // both gems open from the same front-facing CW, then diverge

    // cursor shimmer: target from the pointer (relative to the host, in -1..1,
    // clamped so a far cursor doesn't overshoot), smoothed toward each frame.
    let tgtX = 0,
      tgtY = 0,
      curX = 0,
      curY = 0;
    const clamp1 = (v: number) => Math.max(-1.6, Math.min(1.6, v));
    const PROX = 60; // only react within ~60px of the gem; outside, ease to neutral
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const near =
        e.clientX >= rect.left - PROX &&
        e.clientX <= rect.right + PROX &&
        e.clientY >= rect.top - PROX &&
        e.clientY <= rect.bottom + PROX;
      if (!near) {
        tgtX = 0;
        tgtY = 0;
        return;
      }
      tgtX = clamp1(((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1);
      tgtY = clamp1(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
    };
    if (cursorShimmer) window.addEventListener("pointermove", onMove, { passive: true });

    const renderFrame = (now: number) => {
      if (!t0) {
        t0 = now;
        prevTs = now;
      }
      const time = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - prevTs) / 1000);
      prevTs = now;
      resize();
      const w = canvas.width,
        h = canvas.height;
      if (!still) rotY += spinDir * speed * dt;
      // ease the shimmer toward the cursor target
      const k = Math.min(1, dt * 6);
      curX += (tgtX - curX) * k;
      curY += (tgtY - curY) * k;

      // brand gradient -> FBO only (the gem refracts it; nothing else is drawn,
      // so the canvas stays transparent and the colors live in the letters).
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, w, h);
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(bgProg);
      gl.uniform1f(u.bgTime, time);
      gl.uniform2f(u.bgRes, w, h);
      gl.uniform3fv(u.bgA, LOCKED.bgA);
      gl.uniform3fv(u.bgB, LOCKED.bgB);
      gl.uniform3fv(u.bgC, LOCKED.bgC);
      gl.bindVertexArray(emptyVao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // the gem, composited onto a transparent canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(gemProg);
      const ry = still ? tiltY : rotY;
      const proj = M4.persp((35 * Math.PI) / 180, w / h, 0.1, 100),
        view = M4.trans(0, 0, CAM_Z),
        model = M4.mul(M4.rotY(ry), M4.rotX(still ? tiltX : 0)),
        modelView = M4.mul(view, model);
      gl.uniformMatrix4fv(u.gProj, false, proj);
      gl.uniformMatrix4fv(u.gView, false, view);
      gl.uniformMatrix4fv(u.gModel, false, model);
      gl.uniformMatrix3fv(u.gNormal, false, M4.normalMat(modelView));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fboTex);
      gl.uniform1i(u.gBg, 0);
      gl.uniform2f(u.gRes, w, h);
      gl.uniform1f(u.gRef, LOCKED.refract);
      gl.uniform1f(u.gDis, LOCKED.disp);
      gl.uniform3fv(u.gTint, LOCKED.tint);
      gl.uniform1f(u.gFac, LOCKED.facet);
      gl.uniform2f(u.gCursor, cursorShimmer ? curX : 0, cursorShimmer ? -curY : 0);
      gl.uniform1f(u.gDamp, specDamp);
      gl.bindVertexArray(gemVao);
      gl.drawArrays(gl.TRIANGLES, 0, gemCount);
    };

    // Cap the mark to ~30fps. It is a small decorative spinner, so half the
    // frames are imperceptible but halve its GPU/CPU cost. The loop still ticks
    // every rAF; it just skips the draw between 30fps slots. Spin speed is
    // unaffected -- rotY advances by real elapsed dt, not per-frame.
    const FRAME_MS = 1000 / 30;
    let lastDraw = 0;
    const tick = (now: number) => {
      if (now - lastDraw >= FRAME_MS) {
        lastDraw = now;
        renderFrame(now);
      }
      if (running && !reduce) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      prevTs = 0;
      if (reduce) {
        requestAnimationFrame((n) => renderFrame(n)); // one static frame
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    let visible = false;
    let motionPaused = isMotionPaused();
    const sync = () => (visible && !motionPaused ? start() : stop());
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        sync();
      },
      { root: null, rootMargin: "100% 0px 100% 0px", threshold: 0 }
    );
    io.observe(host);
    const unsubMotion = subscribeMotion((v) => {
      motionPaused = v;
      sync();
    });

    return () => {
      stop();
      unsubMotion();
      io.disconnect();
      ro.disconnect();
      if (cursorShimmer) window.removeEventListener("pointermove", onMove);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, [spinDir, speed, still, tiltY, tiltX, cursorShimmer, specDamp]);

  return (
    <div className={"cw-gem-mark" + (className ? " " + className : "")} ref={hostRef} aria-hidden="true">
      <canvas className="cw-gem-mark__canvas" ref={canvasRef} />
    </div>
  );
}

export default GemstoneMark;
