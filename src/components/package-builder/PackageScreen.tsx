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
  buildQuad,
  screenVert,
  screenFrag,
  plugFrag,
  texFrag,
  SCREEN,
} from "@/lib/package-screen-core";
import type { Channels } from "@/lib/package-builder";

// Plug palette: a dark connector body, copper pins, and the electric cyan the
// pins pulse toward at level 5.
const WHITE: [number, number, number] = [1, 1, 1];
const PLUG_DARK: [number, number, number] = [0.1, 0.11, 0.17];
const COPPER: [number, number, number] = [0.83, 0.65, 0.45];
const ELECTRIC: [number, number, number] = [1.0, 0.95, 0.6];

// Brand plaque: a satin metal plate (branding level 2) that brightens toward a
// lit silver as the brand resolves (levels 3-4). Rivets are copper, like the
// plug pins, so the object reads as one material family.
const PLAQUE_DIM: [number, number, number] = [0.3, 0.27, 0.42];
const PLAQUE_LIT: [number, number, number] = [0.66, 0.58, 0.78];

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
    let screenProg: WebGLProgram, plugProg: WebGLProgram, texProg: WebGLProgram;
    try {
      screenProg = link(screenVert, screenFrag);
      plugProg = link(screenVert, plugFrag);
      texProg = link(screenVert, texFrag);
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

    // Brand plaque parts. The plaque is a thin beveled panel laminated over the
    // cover's whole front face, so it tracks the slab's height and is (re)built
    // in rebuild() below alongside the cover. The rivet is one unit puck reused
    // for all four corner fixings; its bevel rolls a highlight as it floats.
    const overlayBuf = mkVao();
    let overlayCount = 0;
    const OV_INSET = 0.07; // the purple frame left around the panel
    const OV_HD = 0.012, OV_BEVEL = 0.01; // thin, lightly beveled
    // A small air gap lifts the whole panel off the cover face so its back cap
    // and bevel never sit coplanar with the front cap -- coplanar surfaces
    // z-fight and flicker as the object floats.
    const PLAQUE_GAP = 0.012;
    const rivetBuf = mkVao();
    const rivetMesh = buildScreen(1, 1, 0.5, 0.34, 1); // a beveled disc
    upload(rivetBuf, rivetMesh);

    // A flat quad for the brand marks laid on the plaque face (gem/wordmark/
    // cloud), each a texture sampled by texProg.
    const quadBuf = mkVao();
    const quadMesh = buildQuad();
    upload(quadBuf, quadMesh);

    // The CW gem mark, loaded as a texture from its static PNG. A 1x1 stand-in
    // is bound until the image decodes, so the first frames never sample null.
    const gemTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, gemTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    let gemReady = false;
    const gemImg = new Image();
    gemImg.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, gemTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gemImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gemReady = true;
    };
    gemImg.src = "/cw-gemstone-mark.png";

    // Two marks are drawn on 2D canvases and uploaded as textures: the wordmark
    // (level 3) and the manifesto cloud (level 4).
    const uploadCanvas = (tex: WebGLTexture | null, cvs: HTMLCanvasElement) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    const stubTex = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      return tex;
    };

    // Manifesto cloud: soft lilac/white puffs on transparent, a calm atmosphere
    // laid across the panel at the top tier.
    const cloudTex = stubTex();
    {
      const cvs = document.createElement("canvas");
      const W = 256, H = 256;
      cvs.width = W; cvs.height = H;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        // Soft, low-alpha puffs spread across the whole field so it reads as an
        // even atmosphere, not a bright blob in one corner.
        const puffs: [number, number, number, number][] = [
          [128, 128, 155, 0.15],
          [78, 92, 92, 0.11], [182, 104, 96, 0.11],
          [104, 178, 88, 0.09], [190, 182, 80, 0.09],
        ];
        for (const [x, y, r, a] of puffs) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(255,255,255,${a})`);
          g.addColorStop(0.55, `rgba(229,210,244,${a * 0.6})`);
          g.addColorStop(1, "rgba(229,210,244,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
        uploadCanvas(cloudTex, cvs);
      }
    }

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
      // The brand plaque panel: inset from the rim so a purple frame of the
      // cover shows around it, with concentric rounded corners.
      const ov = buildScreen(
        Math.max(0.05, HW - OV_INSET),
        Math.max(0.03, hh - OV_INSET),
        OV_HD, OV_BEVEL,
        Math.max(0.03, r - OV_INSET)
      );
      upload(overlayBuf, ov);
      overlayCount = ov.count;
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
      wipe: U(screenProg, "uWipe"), alpha: U(screenProg, "uAlpha"),
    };
    // The plug body's energy program.
    const up = {
      proj: U(plugProg, "uProj"), view: U(plugProg, "uView"),
      model: U(plugProg, "uModel"), normal: U(plugProg, "uNormal"),
      time: U(plugProg, "uTime"), charge: U(plugProg, "uCharge"),
      zap: U(plugProg, "uZap"),
    };
    // The textured-mark program (brand gem/wordmark/cloud on the plaque).
    const ut = {
      proj: U(texProg, "uProj"), view: U(texProg, "uView"),
      model: U(texProg, "uModel"), normal: U(texProg, "uNormal"),
      tex: U(texProg, "uTex"), alpha: U(texProg, "uAlpha"), tint: U(texProg, "uTint"),
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
      cur.plaque = ease(cur.plaque, t.plaque, k);
      cur.brandContent = ease(cur.brandContent, t.brandContent, k);
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
      gl.uniform1f(us.alpha, 1); // solid; resets the glaze alpha each frame
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

      // --- the brand plaque: a riveted panel laminated over the front face ---
      // A translucent beveled brand panel laid over the whole face, pinned by a
      // copper rivet in each corner. The object is always shown branded: the
      // plaque channel is held constant (level 2), so `appear`/`polish` settle
      // fully on and this reads the same regardless of the branding parameter,
      // which now prices the work rather than driving this visual. Shares the
      // cover's orient + scale so it floats with the slab.
      const appear = smooth(0.35, 1.0, cur.plaque);
      if (appear > 0.01 && overlayCount > 0) {
        const polish = Math.max(0, Math.min(1, (cur.plaque - 1) / 2)); // 0 @L2 -> 1 @L4
        const S = Mat.mul(orient, Mat.scale(cur.scale, cur.scale, 1));
        const hh = cur.heightHalf;
        const faceZ = cur.depth; // the cover's front cap

        gl.useProgram(screenProg);
        gl.uniformMatrix4fv(us.proj, false, proj);
        gl.uniformMatrix4fv(us.view, false, view);
        gl.uniform1f(us.time, time);
        gl.uniform1f(us.spectrum, 0);
        gl.uniform1f(us.grain, 0);
        gl.uniform1f(us.pulse, 0);
        gl.uniform1f(us.glow, 0);
        gl.uniform1f(us.zap, 0);
        // No own indents: the panel is a translucent glaze, so the cover's real
        // section grooves (and its wash) show THROUGH it.
        gl.uniform1f(us.sections, 0);
        // A calm frosted sheet: enough presence for the gem to read against,
        // and NO specular (the hard diagonal glare read as cheap plastic).
        gl.uniform1f(us.alpha, 0.55);

        // The panel: one flat brand-tinted colour so the bevel rim, not a wash,
        // shapes it; it brightens toward a lit silver as the brand resolves.
        const plate: [number, number, number] = [
          PLAQUE_DIM[0] + (PLAQUE_LIT[0] - PLAQUE_DIM[0]) * polish,
          PLAQUE_DIM[1] + (PLAQUE_LIT[1] - PLAQUE_DIM[1]) * polish,
          PLAQUE_DIM[2] + (PLAQUE_LIT[2] - PLAQUE_DIM[2]) * polish,
        ];
        const plateB = 1 + polish * 0.4;
        const ovModel = Mat.mul(
          S,
          Mat.mul(Mat.trans(0, 0, faceZ + (OV_HD + PLAQUE_GAP) * appear), Mat.scale(appear, appear, appear))
        );
        gl.uniformMatrix4fv(us.model, false, ovModel);
        gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(Mat.mul(view, ovModel)));
        gl.uniform3fv(us.washA, plate);
        gl.uniform3fv(us.washB, plate);
        gl.uniform3fv(us.washC, plate);
        gl.uniform3f(us.tint, plateB, plateB, plateB);
        gl.uniform1f(us.sheen, 0); // no specular streak on the panel
        gl.bindVertexArray(overlayBuf.vao);
        gl.drawArrays(gl.TRIANGLES, 0, overlayCount);

        // A copper rivet in each corner of the panel, proud of it and brighter
        // with polish, so the fixings catch the light as the object floats.
        const rivetB = 1 + polish * 0.9;
        gl.uniform1f(us.alpha, 1); // the studs are solid, not glazed
        gl.uniform3fv(us.washA, COPPER);
        gl.uniform3fv(us.washB, COPPER);
        gl.uniform3fv(us.washC, COPPER);
        gl.uniform3f(us.tint, rivetB, rivetB, rivetB * 0.96);
        gl.uniform1f(us.sheen, 0.6 + polish * 0.35);
        gl.bindVertexArray(rivetBuf.vao);
        const cx = Math.max(0.06, HW - OV_INSET - 0.055);
        const cy = Math.max(0.04, hh - OV_INSET - 0.055);
        const rivetZ = faceZ + (PLAQUE_GAP + 2 * OV_HD + 0.006) * appear;
        const rr = 0.014 * appear;
        for (const sx of [-1, 1])
          for (const sy of [-1, 1]) {
            const rm = Mat.mul(
              S,
              Mat.mul(
                Mat.trans(sx * cx * appear, sy * cy * appear, rivetZ),
                Mat.scale(rr, rr, rr * 0.8)
              )
            );
            gl.uniformMatrix4fv(us.model, false, rm);
            gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(Mat.mul(view, rm)));
            gl.drawArrays(gl.TRIANGLES, 0, rivetMesh.count);
          }

        // --- brand marks stuck ONTO the plaque face, driven by brandContent --
        // The CW gem (level 2) and the manifesto cloud (level 4). Each is a flat
        // decal in the plaque's own plane -- it shares the slab's orient, so it
        // tilts and floats WITH the face like a sticker, not a separate object.
        // No animation of their own. Topmost layer, so they write no depth
        // (transparent edges must not occlude one another).
        if (cur.brandContent > 0.02) {
          gl.depthMask(false);
          gl.useProgram(texProg);
          gl.uniformMatrix4fv(ut.proj, false, proj);
          gl.uniformMatrix4fv(ut.view, false, view);
          gl.activeTexture(gl.TEXTURE0);
          gl.uniform1i(ut.tex, 0);
          gl.uniform3f(ut.tint, 1, 1, 1);
          gl.bindVertexArray(quadBuf.vao);

          const markZ = faceZ + PLAQUE_GAP + 2 * OV_HD + 0.005; // just above the panel
          const pxHalf = HW - OV_INSET, pyHalf = hh - OV_INSET;
          // A flat quad seated on the plaque face at local (lx,ly), sharing the
          // slab's orient + scale so it moves as part of the face.
          const decal = (
            tex: WebGLTexture | null, lx: number, ly: number,
            halfW: number, halfH: number, alpha: number
          ) => {
            const m = Mat.mul(S, Mat.mul(Mat.trans(lx, ly, markZ), Mat.scale(halfW, halfH, 1)));
            gl.uniformMatrix4fv(ut.model, false, m);
            gl.uniformMatrix3fv(ut.normal, false, Mat.normalMat(Mat.mul(view, m)));
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1f(ut.alpha, alpha);
            gl.drawArrays(gl.TRIANGLES, 0, quadMesh.count);
          };

          // The manifesto cloud fills the panel, behind the gem.
          const cloudA = smooth(2.4, 3.0, cur.brandContent) * appear;
          if (cloudA > 0.01) decal(cloudTex, 0, 0, pxHalf * 0.9, pyHalf * 0.9, cloudA * 0.9);

          // The CW gem, seated in the top-left corner of the panel.
          const gs = 0.13; // gem half-size
          const gemA = smooth(0.4, 1.0, cur.brandContent) * appear;
          if (gemA > 0.01 && gemReady) {
            decal(gemTex, -pxHalf + gs + 0.04, pyHalf - gs - 0.04, gs, gs, gemA);
          }
          gl.depthMask(true);
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
