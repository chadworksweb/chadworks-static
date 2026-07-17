"use client";

// =====================================================================
// PackageScreen -- the scope object for /website-design-cost-calculator/.
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
    const screenBuf = mkVao();
    const leafBuf = mkVao();
    // A leaf is a thin beveled slab: its bevel rim is what catches light and
    // reads as the ridge separating one page from the next. HD is much smaller
    // than the cover's depth, so the leaves stay visibly thinner than the cover.
    const LEAF_HD = 0.006, LEAF_BEVEL = 0.006;
    const LEAF_GROOVE = 0.013, LEAF_PITCH = 2 * LEAF_HD + LEAF_GROOVE;

    // The corner radius must shrink with the (now short) height, or a low-section
    // slab rounds off into a pill. Cap it to a fraction of the half-height.
    const radiusFor = (hh: number) => Math.min(SCREEN.radius, hh * 0.55);

    // Cover and leaves share ONE footprint: same half-width, same half-height.
    // Sections drive the half-height, so BOTH meshes are rebuilt together
    // whenever the height (or the cover's depth/bevel) drifts past a threshold.
    let builtDepth = -1, builtBevel = -1, builtHeight = -1;
    let screenCount = 0, leafCount = 0;
    const rebuild = (depth: number, bevel: number, hh: number) => {
      const r = radiusFor(hh);
      const cover = buildScreen(HW, hh, depth, bevel, r);
      upload(screenBuf, cover);
      screenCount = cover.count;
      const leaf = buildScreen(HW, hh, LEAF_HD, LEAF_BEVEL, r);
      upload(leafBuf, leaf);
      leafCount = leaf.count;
      builtDepth = depth;
      builtBevel = bevel;
      builtHeight = hh;
    };
    rebuild(target.current.depth, target.current.bevel, target.current.heightHalf);

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
      sections: U(screenProg, "uSections"),
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
      cur.heightHalf = ease(cur.heightHalf, t.heightHalf, k);
      ease3(cur.tint, t.tint, k);
      ease3(cur.washA, t.washA, k);
      ease3(cur.washB, t.washB, k);
      ease3(cur.washC, t.washC, k);
      curStrata = ease(curStrata, t.strata, k);

      if (
        Math.abs(cur.depth - builtDepth) > 0.006 ||
        Math.abs(cur.bevel - builtBevel) > 0.004 ||
        Math.abs(cur.heightHalf - builtHeight) > 0.006
      ) {
        rebuild(cur.depth, cur.bevel, cur.heightHalf);
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
      // FLOAT ONLY, no spin. The object is suspended, so it has to DRIFT, not
      // just tilt: translation is what sells weightlessness, and a lone bob on
      // one axis reads as a loop. Four sines on deliberately unrelated periods
      // (0.42 / 0.29 / 0.37 / 0.51) never line back up inside a visit, so the
      // motion stays alive instead of ticking.
      const m = 1 + cur.spin * 1.4; // `motion` scales the float, never stops it
      const driftY = Math.sin(time * 0.42) * 0.09 * m;
      const driftX = Math.sin(time * 0.29 + 2.1) * 0.05 * m;
      const swayY = Math.sin(time * 0.37 + 1.1) * 0.07 * m;
      const swayX = Math.sin(time * 0.51 + 0.4) * 0.05 * m;

      // Drift is applied OUTSIDE the orientation so the object travels through
      // space rather than orbiting its own centre. The strata inherit `posed`,
      // so the whole stack floats as one body.
      const orient = Mat.mul(
        Mat.rotY(SCREEN.restRotY + swayY),
        Mat.rotX(SCREEN.restTiltX + swayX)
      );
      const posed = Mat.mul(Mat.trans(driftX, driftY, 0), orient);

      // --- the cover face --------------------------------------------
      // The front slab is the book's cover. Pages no longer thicken it; they
      // append leaves behind it (below), so this stays a constant cover and
      // mathDev alone gives it its modest depth.
      gl.useProgram(screenProg);
      gl.uniformMatrix4fv(us.proj, false, proj);
      gl.uniformMatrix4fv(us.view, false, view);
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
      gl.uniform1f(us.glow, 0);
      // Sections show up as horizontal dividers ruled across the cover face.
      // Snap to the target count (not the eased height) so lines are always
      // whole, and the slab grows one section-unit taller for each of them.
      gl.uniform1f(us.sections, Math.round(t.sections));
      gl.bindVertexArray(screenBuf.vao);
      gl.drawArrays(gl.TRIANGLES, 0, screenCount);

      // --- leaves: thin ridged pages appended BEHIND the cover -------
      // Each page past the first is its own thin beveled slab, stacked further
      // back with a groove between them. The bevel rim on every leaf catches
      // light as a ridge, so the stack reads as independent pages and not one
      // solid mass. Same program as the cover, flat paper tint so the wash
      // gradient does not turn each leaf into a little display. Depth test is
      // on and depthMask stays true, so the cover and the nearer leaves occlude
      // the ones behind, leaving only the ridged edges peeking at this angle.
      const count = Math.round(curStrata);
      if (count > 0) {
        // A purple leaf tone: the lilac wash pulled toward the brand purple
        // (washA), so every leaf carries colour and none read as bare white.
        // One flat stop -> an even sheet; the per-leaf shade below varies it.
        const paper = [
          cur.washC[0] * 0.42 + cur.washA[0] * 0.58,
          cur.washC[1] * 0.42 + cur.washA[1] * 0.58,
          cur.washC[2] * 0.42 + cur.washA[2] * 0.58,
        ];
        gl.uniform3fv(us.washA, paper);
        gl.uniform3fv(us.washB, paper);
        gl.uniform3fv(us.washC, paper);
        gl.uniform1f(us.sheen, 0.12);
        gl.uniform1f(us.spectrum, 0);
        gl.uniform1f(us.grain, 0);
        gl.uniform1f(us.sections, 0); // no dividers on the leaf edges
        gl.bindVertexArray(leafBuf.vao);
        const back = cur.depth + LEAF_HD; // first leaf sits just behind the cover
        for (let i = 0; i < count; i++) {
          const z = -(back + LEAF_GROOVE + i * LEAF_PITCH);
          const lm = Mat.mul(
            Mat.mul(orient, Mat.trans(0, 0, z)),
            Mat.scale(cur.scale, cur.scale, 1)
          );
          const lmv = Mat.mul(view, lm);
          gl.uniformMatrix4fv(us.model, false, lm);
          gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(lmv));
          // Deeper leaves darken (receding depth), and alternate leaves darken
          // a touch more so consecutive sheets separate and read as individual
          // pages rather than one smooth block.
          const shade = (1 - Math.min(0.42, i * 0.02)) * (i % 2 ? 0.9 : 1);
          gl.uniform3f(us.tint, cur.tint[0] * shade, cur.tint[1] * shade, cur.tint[2] * shade);
          gl.drawArrays(gl.TRIANGLES, 0, leafCount);
        }
      }
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
