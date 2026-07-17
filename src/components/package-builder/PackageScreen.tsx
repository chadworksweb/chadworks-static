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
  buildBox,
  screenVert,
  screenFrag,
  plugFrag,
  SCREEN,
} from "@/lib/package-screen-core";
import type { Channels } from "@/lib/package-builder";

// Plug palette: a dark connector body, copper pins, and the electric cyan the
// pins pulse toward at level 5.
const WHITE: [number, number, number] = [1, 1, 1];
const PLUG_DARK: [number, number, number] = [0.1, 0.11, 0.17];
const COPPER: [number, number, number] = [0.83, 0.65, 0.45];
const ELECTRIC: [number, number, number] = [1.0, 0.95, 0.6];

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
    let screenProg: WebGLProgram, plugProg: WebGLProgram;
    try {
      screenProg = link(screenVert, screenFrag);
      plugProg = link(screenVert, plugFrag);
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

    // The mathDev plug is assembled from unit boxes: a connector body, its pins
    // and a cable, each drawn with its own transform. One mesh, drawn many times.
    const boxBuf = mkVao();
    const boxMesh = buildBox();
    upload(boxBuf, boxMesh);

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
      sections: U(screenProg, "uSections"), zap: U(screenProg, "uZap"),
      wipe: U(screenProg, "uWipe"),
    };
    // The plug body's energy program.
    const up = {
      proj: U(plugProg, "uProj"), view: U(plugProg, "uView"),
      model: U(plugProg, "uModel"), normal: U(plugProg, "uNormal"),
      time: U(plugProg, "uTime"), charge: U(plugProg, "uCharge"),
      zap: U(plugProg, "uZap"),
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
    const smooth = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const ease3 = (a: [number, number, number], b: [number, number, number], k: number) => {
      a[0] = ease(a[0], b[0], k);
      a[1] = ease(a[1], b[1], k);
      a[2] = ease(a[2], b[2], k);
    };

    // Plug electric one-shot: fire the charge->zap once when level 5 is chosen,
    // and again on each click of the plug. Not a loop. These live across frames
    // and are read by both the draw loop and the click handler below.
    let triggerT = -999; // draw-clock time of the last trigger
    let firedElectric = false; // did we fire the initial one-shot at level 5?
    let clickPulse = false; // set by the click handler, consumed next frame
    let lastElectric = false; // is the plug currently at level 5? (for the handler)
    const plugScreen = { x: -1, y: -1 }; // plug body centre in canvas px

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
      cur.plug = ease(cur.plug, t.plug, k);
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

      // Electric ONE-SHOT for the level-5 plug: charge builds, then a longer
      // zap wipes clean across the slab, then it rests. Fires once when level 5
      // is selected and again on every plug click -- never on a loop.
      const electricOn = Math.round(target.current.plug) >= 4;
      lastElectric = electricOn;
      if (electricOn && !firedElectric) { triggerT = time; firedElectric = true; }
      if (!electricOn) firedElectric = false;
      if (clickPulse) { triggerT = time; clickPulse = false; }

      let plugCharge = 0, plugZap = 0, plugWipe = 0;
      if (electricOn) {
        const BUILD = 1.3, ZAP = 1.5; // zap runs long enough to cross the slab
        const dt = time - triggerT;
        if (dt >= 0 && dt < BUILD) {
          plugCharge = smooth(0, BUILD, dt); // energy winds up in the plug
        } else if (dt >= BUILD && dt < BUILD + ZAP) {
          const z = (dt - BUILD) / ZAP; // 0..1 across the discharge
          plugCharge = 1 - smooth(0, 1, z); // the plug drains as it fires
          plugWipe = smooth(0, 1, z) * 1.05; // wavefront crosses fully (past 1)
          plugZap = Math.min(1, z / 0.08) * (1 - smooth(0.82, 1, z)); // rise, hold, fall
        }
      }

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
      gl.uniform1f(us.zap, plugZap); // the plug's discharge hits the cover here
      gl.uniform1f(us.wipe, plugWipe); // ...as a wavefront sweeping across it
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
        gl.uniform1f(us.zap, 0);
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

      // --- the mathDev plug: a 3D connector seated in the cover's left edge ---
      // Nothing at level 1 (mathDev "None"); the plug appears from level 2 up.
      // Body sits just outside the edge; the pins bridge the gap and run INTO
      // the slab, where the cover occludes them, so it reads as plugged in.
      // Everything shares the cover's orient, so the plug floats with the slab.
      // At level 5 the body runs electric (its own energy shader) and the pins
      // flash white/yellow when the charge discharges into the slab.
      if (Math.round(t.plug) >= 1) {
        const LEFT = -HW; // the cover's left edge in local space
        const g = cur.plug; // eased 1..4 -> smooth body growth
        const pinN = 1 + Math.round(t.plug); // pin COUNT snaps (2..5)
        const electric = Math.round(t.plug) >= 4;
        const S = Mat.mul(orient, Mat.scale(cur.scale, cur.scale, 1));

        const bodyHx = 0.07;
        const bodyHy = 0.05 + g * 0.018;
        const bodyHz = 0.045 + g * 0.02;
        const bodyPx = LEFT - 0.1 - g * 0.01;
        const bodyModel = Mat.mul(
          S,
          Mat.mul(Mat.trans(bodyPx, 0, 0), Mat.scale(bodyHx, bodyHy, bodyHz))
        );
        const bodyMv = Mat.mul(view, bodyModel);

        // Project the body centre to canvas px so the click handler can hit-test
        // the plug. model[12..14] is the box centre in world space.
        const vz = bodyModel[14] + SCREEN.camZ;
        if (vz < -0.001) {
          const ndcx = (proj[0] * bodyModel[12]) / -vz;
          const ndcy = (proj[5] * bodyModel[13]) / -vz;
          plugScreen.x = (ndcx * 0.5 + 0.5) * canvas.clientWidth;
          plugScreen.y = (1 - (ndcy * 0.5 + 0.5)) * canvas.clientHeight;
        }

        // Body: the energy program at level 5, a flat dark casing otherwise.
        if (electric) {
          gl.useProgram(plugProg);
          gl.uniformMatrix4fv(up.proj, false, proj);
          gl.uniformMatrix4fv(up.view, false, view);
          gl.uniformMatrix4fv(up.model, false, bodyModel);
          gl.uniformMatrix3fv(up.normal, false, Mat.normalMat(bodyMv));
          gl.uniform1f(up.time, time);
          gl.uniform1f(up.charge, plugCharge);
          gl.uniform1f(up.zap, plugZap);
          gl.bindVertexArray(boxBuf.vao);
          gl.drawArrays(gl.TRIANGLES, 0, boxMesh.count);
        }

        // Pins (and the casing at lower levels) use the flat screen program.
        gl.useProgram(screenProg);
        gl.uniformMatrix4fv(us.proj, false, proj);
        gl.uniformMatrix4fv(us.view, false, view);
        gl.uniform1f(us.time, time);
        gl.uniform1f(us.spectrum, 0);
        gl.uniform1f(us.grain, 0);
        gl.uniform1f(us.pulse, 0);
        gl.uniform1f(us.glow, 0);
        gl.uniform1f(us.sections, 0);
        gl.uniform1f(us.zap, 0);
        gl.bindVertexArray(boxBuf.vao);

        const box = (
          px: number, py: number, pz: number,
          hx: number, hy: number, hz: number,
          col: [number, number, number], sheen: number,
          tintv: [number, number, number] = WHITE
        ) => {
          const m = Mat.mul(S, Mat.mul(Mat.trans(px, py, pz), Mat.scale(hx, hy, hz)));
          const mv = Mat.mul(view, m);
          gl.uniformMatrix4fv(us.model, false, m);
          gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(mv));
          gl.uniform3fv(us.washA, col);
          gl.uniform3fv(us.washB, col);
          gl.uniform3fv(us.washC, col);
          gl.uniform3fv(us.tint, tintv);
          gl.uniform1f(us.sheen, sheen);
          gl.drawArrays(gl.TRIANGLES, 0, boxMesh.count);
        };

        if (!electric) box(bodyPx, 0, 0, bodyHx, bodyHy, bodyHz, PLUG_DARK, 0.16);

        // Pins: copper normally; at level 5 they carry the discharge, blooming
        // white/yellow on the zap and shimmering with the charge between zaps.
        let pinCol = COPPER;
        let pinTint = WHITE;
        let pinSheen = 0.6;
        if (electric) {
          const e = Math.min(1, plugCharge * 0.5 + plugZap);
          pinCol = [
            COPPER[0] + (ELECTRIC[0] - COPPER[0]) * e,
            COPPER[1] + (ELECTRIC[1] - COPPER[1]) * e,
            COPPER[2] + (ELECTRIC[2] - COPPER[2]) * e,
          ];
          const b = 1 + (plugCharge * 0.4 + plugZap * 2.2);
          pinTint = [b, b, b * 0.92]; // a touch warm (yellow) in the bloom
          pinSheen = 0.9;
        }

        const pinHx = 0.1;
        const pinPx = bodyPx + bodyHx + pinHx - 0.02;
        const gap = 0.032;
        for (let i = 0; i < pinN; i++) {
          const py = (i - (pinN - 1) / 2) * gap;
          box(pinPx, py, 0, pinHx, 0.012, 0.012, pinCol, pinSheen, pinTint);
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

    // Click the level-5 plug to fire another charge->zap. The draw loop keeps
    // plugScreen current; here we only hit-test and flag it for the next frame.
    const near = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - rect.left - plugScreen.x;
      const dy = e.clientY - rect.top - plugScreen.y;
      return Math.hypot(dx, dy) < 78;
    };
    const onClick = (e: MouseEvent) => { if (lastElectric && near(e)) clickPulse = true; };
    const onMove = (e: MouseEvent) => {
      canvas.style.cursor = lastElectric && near(e) ? "pointer" : "";
    };
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("pointermove", onMove);

    return () => {
      stop();
      unsub();
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("cw-repaint", repaint);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("pointermove", onMove);
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
