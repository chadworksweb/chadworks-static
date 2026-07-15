"use client";

// =====================================================================
// PackageScreen -- the scope object for /build-your-website-package/.
//
// A floating flat-but-3D screen that morphs in real time as scope layers are
// checked on and off. Every channel from lib/package-builder is eased toward
// its target each frame, so a slider drag reads as the object growing rather
// than as a value jumping.
//
// STANDALONE: geometry + shaders come from @/lib/package-screen-core, which
// shares nothing with the CW gem. Only @/lib/motion is shared, because the
// global motion toggle is site-wide policy, not gem code.
//
// The WebGL context is built ONCE. Scope arrives through a ref the loop reads,
// never through effect deps: re-running setup on every scope change would tear
// down and rebuild the context on each drag frame.
// =====================================================================

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";
import {
  Mat,
  buildScreen,
  buildStratum,
  screenVert,
  screenFrag,
  stratumFrag,
  SCREEN,
} from "@/lib/package-screen-core";
import type { Channels } from "@/lib/package-builder";

export function PackageScreen({
  channels,
  className,
}: {
  channels: Channels;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The live target. Written every render, read by the loop. Never a dep.
  const target = useRef<Channels>(channels);
  target.current = channels;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
    if (!gl) return; // no WebGL: the ledger beside it still tells the whole story

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(sh) || "shader");
      return sh;
    };
    const link = (v: string, f: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, v));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, f));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(p) || "program");
      return p;
    };

    // A lost context (browser WebGL cap hit during SPA nav) fails compiles with
    // an empty log. Bail quietly rather than throwing out of the effect.
    let screenProg: WebGLProgram, stratumProg: WebGLProgram;
    try {
      screenProg = link(screenVert, screenFrag);
      stratumProg = link(screenVert, stratumFrag);
    } catch (err) {
      console.warn("PackageScreen: WebGL shader build failed; object omitted.", err);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    // --- buffers ------------------------------------------------------
    const mkVao = () => {
      const vao = gl.createVertexArray();
      const pos = gl.createBuffer();
      const nrm = gl.createBuffer();
      const uv = gl.createBuffer();
      gl.bindVertexArray(vao);
      for (const [i, buf, size] of [
        [0, pos, 3],
        [1, nrm, 3],
        [2, uv, 2],
      ] as const) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(i);
        gl.vertexAttribPointer(i, size, gl.FLOAT, false, 0, 0);
      }
      gl.bindVertexArray(null);
      return { vao, pos, nrm, uv };
    };
    const upload = (
      b: { pos: WebGLBuffer | null; nrm: WebGLBuffer | null; uv: WebGLBuffer | null },
      m: { pos: Float32Array; nrm: Float32Array; uv: Float32Array }
    ) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, b.pos);
      gl.bufferData(gl.ARRAY_BUFFER, m.pos, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, b.nrm);
      gl.bufferData(gl.ARRAY_BUFFER, m.nrm, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, b.uv);
      gl.bufferData(gl.ARRAY_BUFFER, m.uv, gl.DYNAMIC_DRAW);
    };

    const HW = SCREEN.aspect * 0.5;
    const HH = 0.5;
    const screenBuf = mkVao();
    const stratumBuf = mkVao();
    const stratumMesh = buildStratum(SCREEN.radius);
    upload(stratumBuf, stratumMesh);

    // Geometry is rebuilt only when depth/bevel drift past a threshold, so an
    // ease costs a handful of rebuilds instead of one per frame.
    let builtDepth = -1, builtBevel = -1, screenCount = 0;
    const rebuild = (depth: number, bevel: number) => {
      const m = buildScreen(HW, HH, depth, bevel, SCREEN.radius);
      upload(screenBuf, m);
      screenCount = m.count;
      builtDepth = depth;
      builtBevel = bevel;
    };
    rebuild(target.current.depth, target.current.bevel);

    // --- uniforms -----------------------------------------------------
    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const us = {
      proj: U(screenProg, "uProj"), view: U(screenProg, "uView"),
      model: U(screenProg, "uModel"), normal: U(screenProg, "uNormal"),
      washA: U(screenProg, "uWashA"), washB: U(screenProg, "uWashB"),
      washC: U(screenProg, "uWashC"), tint: U(screenProg, "uTint"),
      time: U(screenProg, "uTime"), sheen: U(screenProg, "uSheen"),
      spectrum: U(screenProg, "uSpectrum"), grain: U(screenProg, "uGrain"),
      pulse: U(screenProg, "uPulse"), glow: U(screenProg, "uStrataGlow"),
    };
    const ul = {
      proj: U(stratumProg, "uProj"), view: U(stratumProg, "uView"),
      model: U(stratumProg, "uModel"), normal: U(stratumProg, "uNormal"),
      tint: U(stratumProg, "uLayerTint"), time: U(stratumProg, "uTime"),
      alpha: U(stratumProg, "uAlpha"), phase: U(stratumProg, "uPhase"),
      pulse: U(stratumProg, "uPulse"), grain: U(stratumProg, "uGrain"),
    };

    // --- sizing -------------------------------------------------------
    let DPR = 1;
    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * DPR);
      const h = Math.round(canvas.clientHeight * DPR);
      if (w < 1 || h < 1) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // --- eased state --------------------------------------------------
    // cur starts AT the first target so the object opens already correct and
    // only eases on real changes.
    const cur: Channels = JSON.parse(JSON.stringify(target.current));
    const ease = (a: number, b: number, k: number) => a + (b - a) * k;
    const ease3 = (a: [number, number, number], b: [number, number, number], k: number) => {
      a[0] = ease(a[0], b[0], k);
      a[1] = ease(a[1], b[1], k);
      a[2] = ease(a[2], b[2], k);
    };

    const reduce = prefersReducedMotion();
    let raf = 0, running = false, t0 = 0, prevTs = 0;
    let curStrata = target.current.strata; // eased so layers fade in, not pop

    // NO cursor interaction. The object is staged and floats; the scope is the
    // only thing that moves it.

    const draw = (now: number) => {
      if (!t0) { t0 = now; prevTs = now; }
      const time = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - prevTs) / 1000);
      prevTs = now;
      resize();

      const t = target.current;
      const k = Math.min(1, dt * 5.5); // the morph rate
      cur.scale = ease(cur.scale, t.scale, k);
      cur.spread = ease(cur.spread, t.spread, k);
      cur.bevel = ease(cur.bevel, t.bevel, k);
      cur.depth = ease(cur.depth, t.depth, k);
      cur.grain = ease(cur.grain, t.grain, k);
      cur.sheen = ease(cur.sheen, t.sheen, k);
      cur.spin = ease(cur.spin, t.spin, k);
      cur.pulse = ease(cur.pulse, t.pulse, k);
      cur.spectrum = ease(cur.spectrum, t.spectrum, k);
      ease3(cur.tint, t.tint, k);
      ease3(cur.washA, t.washA, k);
      ease3(cur.washB, t.washB, k);
      ease3(cur.washC, t.washC, k);
      curStrata = ease(curStrata, t.strata, k);

      if (Math.abs(cur.depth - builtDepth) > 0.006 || Math.abs(cur.bevel - builtBevel) > 0.004) {
        rebuild(cur.depth, cur.bevel);
      }

      const w = canvas.width, h = canvas.height;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const proj = Mat.persp((SCREEN.fov * Math.PI) / 180, w / Math.max(1, h), 0.1, 100);
      const view = Mat.trans(0, 0, SCREEN.camZ);
      // FLOAT ONLY, no spin: the object holds its staged angle and breathes.
      // `motion` (cur.spin) now drives how much it floats rather than how fast
      // it turns, so the channel still reads on the object.
      const amp = 0.018 + cur.spin * 0.055;
      const bobY = Math.sin(time * 0.6) * amp;
      const bobRot = Math.sin(time * 0.43 + 1.1) * amp * 0.5;
      const orient = Mat.mul(
        Mat.rotY(SCREEN.restRotY + bobRot),
        Mat.rotX(SCREEN.restTiltX + bobY)
      );

      gl.uniformMatrix4fv(us.proj, false, proj);
      gl.uniformMatrix4fv(us.view, false, view);

      // --- strata: stacked BEHIND the face, drawn far -> near ---------
      // Scope accumulates behind the screen, so adding sections reads as the
      // object gaining real depth. depthMask off: they blend, never occlude.
      const count = Math.round(curStrata);
      if (count > 0) {
        gl.useProgram(stratumProg);
        gl.uniformMatrix4fv(ul.proj, false, proj);
        gl.uniformMatrix4fv(ul.view, false, view);
        gl.uniform1f(ul.time, time);
        gl.uniform1f(ul.pulse, cur.pulse);
        gl.uniform1f(ul.grain, cur.grain);
        gl.depthMask(false);
        gl.bindVertexArray(stratumBuf.vao);
        for (let i = count - 1; i >= 0; i--) {
          const depthIdx = i + 1;
          const z = -(cur.depth + depthIdx * cur.spread);
          const shrink = 1 - depthIdx * 0.035;
          const s = cur.scale * shrink;
          const model = Mat.mul(
            Mat.mul(orient, Mat.trans(0, 0, z)),
            Mat.scale(s * SCREEN.aspect * 0.5, s * 0.5, 1)
          );
          const mv = Mat.mul(view, model);
          gl.uniformMatrix4fv(ul.model, false, model);
          gl.uniformMatrix3fv(ul.normal, false, Mat.normalMat(mv));
          // Each stratum leans a little further toward the wash's far color,
          // so the stack reads as a gradient of scope rather than a repeat.
          const f = depthIdx / Math.max(1, SCREEN.maxStrata);
          gl.uniform3f(
            ul.tint,
            cur.washB[0] + (cur.washC[0] - cur.washB[0]) * f,
            cur.washB[1] + (cur.washC[1] - cur.washB[1]) * f,
            cur.washB[2] + (cur.washC[2] - cur.washB[2]) * f
          );
          // The newest layer fades in with the eased fractional remainder.
          const partial = i === count - 1 ? curStrata - (count - 1) : 1;
          gl.uniform1f(ul.alpha, 0.3 * (1 - f * 0.55) * Math.max(0, Math.min(1, partial)));
          gl.uniform1f(ul.phase, depthIdx * 1.7);
          gl.drawArrays(gl.TRIANGLES, 0, stratumMesh.count);
        }
        gl.depthMask(true);
      }

      // --- the screen face -------------------------------------------
      gl.useProgram(screenProg);
      const model = Mat.mul(orient, Mat.scale(cur.scale, cur.scale, 1));
      const mv = Mat.mul(view, model);
      gl.uniformMatrix4fv(us.model, false, model);
      gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(mv));
      gl.uniform3fv(us.washA, cur.washA);
      gl.uniform3fv(us.washB, cur.washB);
      gl.uniform3fv(us.washC, cur.washC);
      gl.uniform3fv(us.tint, cur.tint);
      gl.uniform1f(us.time, time);
      gl.uniform1f(us.sheen, cur.sheen);
      gl.uniform1f(us.spectrum, cur.spectrum);
      gl.uniform1f(us.grain, cur.grain);
      gl.uniform1f(us.pulse, cur.pulse);
      gl.uniform1f(us.glow, Math.min(1, curStrata / SCREEN.maxStrata));
      gl.bindVertexArray(screenBuf.vao);
      gl.drawArrays(gl.TRIANGLES, 0, screenCount);
    };

    const tick = (now: number) => {
      draw(now);
      if (running && !reduce) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      prevTs = 0;
      if (reduce) requestAnimationFrame((n) => draw(n)); // one static frame
      else raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Park when off-screen or when the global motion toggle is off. Reduced
    // motion still redraws once per scope change, so the object stays truthful
    // to the ledger without ever animating.
    let visible = false;
    let paused = isMotionPaused();
    const sync = () => (visible && !paused ? start() : stop());
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 }
    );
    io.observe(host);
    const unsub = subscribeMotion((v) => { paused = v; sync(); });

    // Reduced motion / paused: no loop is running, so a scope change would
    // never reach the GPU. Redraw a single frame on each change instead.
    const repaint = () => { if (!running) requestAnimationFrame((n) => draw(n)); };
    host.addEventListener("cw-repaint", repaint);

    return () => {
      stop();
      unsub();
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("cw-repaint", repaint);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  // Nudge a repaint for the parked/reduced-motion case on every scope change.
  useEffect(() => {
    hostRef.current?.dispatchEvent(new CustomEvent("cw-repaint"));
  }, [channels]);

  return (
    <div
      className={"cw-pkgscreen" + (className ? " " + className : "")}
      ref={hostRef}
      aria-hidden="true"
    >
      <canvas className="cw-pkgscreen__canvas" ref={canvasRef} />
    </div>
  );
}

export default PackageScreen;
