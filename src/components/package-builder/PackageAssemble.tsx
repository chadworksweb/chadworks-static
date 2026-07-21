"use client";

// =====================================================================
// PackageAssemble -- the deconstruct/reassemble object for the calculator's
// "purpose" section. It renders the SAME physical parts the scope object is
// built from (the beveled cover slab + stacked page-leaves + the mathDev plug),
// using the real meshes and shaders from @/lib/package-screen-core. Nothing here
// is a fake illustration: every part is the genuine geometry.
//
// State machine: each part has a HOME pose (its place in the finished package)
// and an ORBIT (a slow drift around the object's centre of gravity, plus a lazy
// self-spin). A single `built` flag (0..1, eased) blends the two. Scattered, the
// parts orbit. On click, `built` drives to 1: the parts spin up fast and collect
// into the finished piece, then hold and float. Click again to fly apart.
//
// Decals (CW gem / wordmark) and the wireframe shells are deliberately left off
// this first pass so the physical assembly reads clearly; they can be layered in
// once the motion is dialled.
// =====================================================================

import { useEffect, useRef, useState } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";
import {
  Mat,
  buildScreen,
  buildFace,
  buildBox,
  buildQuad,
  screenVert,
  screenFrag,
  plugFrag,
  texFrag,
  lineVert,
  lineFrag,
  ICO_LINES,
  SCREEN,
} from "@/lib/package-screen-core";

// The finished package's proportions, taken from the live object.
const HH = 1.0;
const HW = HH * SCREEN.aspect;
const COVER_HD = 0.12;
const COVER_BEVEL = 0.035;
const LEAF_HD = 0.02;
const LEAF_BEVEL = 0.014;
const LEAF_PITCH = 0.052;
const LEAF_COUNT = 3; // package spec: 3 pages
const CAM_Z = -10; // fills the frame; orbit is capped below so parts never clip

// Slab look: the object's own violet (#8054bc), washed as a three-stop gradient.
const WASH_A: [number, number, number] = [0.36, 0.22, 0.56];
const WASH_B: [number, number, number] = [0.5, 0.33, 0.74];
const WASH_C: [number, number, number] = [0.72, 0.6, 0.88];
const SLAB_TINT: [number, number, number] = [1, 1, 1];
// Branding L2: a DARK inset nameplate the logo sits on (not a light box).
const PLAQUE_A: [number, number, number] = [0.26, 0.21, 0.36];
const PLAQUE_C: [number, number, number] = [0.36, 0.3, 0.48];
// Copy L2: light text-lines. Ecom L2: product tiles.
const COPY_COL: [number, number, number] = [0.85, 0.82, 0.94];
const ECOM_COL: [number, number, number] = [0.68, 0.58, 0.86];

type Kind = "cover" | "leaf" | "plug" | "wire" | "plaque" | "logo" | "copy" | "ecom";
type Part = {
  kind: Kind;
  pos: [number, number, number]; // home translation (local, pre-orient)
  scale: [number, number, number]; // home scale
  shade: number; // tint multiplier (leaves recede)
  // scatter descriptor (deterministic per index): a base position spread across
  // the whole frame + an independent xyz drift, so each part translates through
  // space on its own path and the pieces read as unrelated.
  nx: number; ny: number; nz: number; // normalized base position, -1..1
  ext: number; // half-extent, to keep the part inside the frame (no clipping)
  amp: [number, number, number]; // drift amplitude per axis
  frq: [number, number, number]; // drift frequency per axis
  phs: [number, number, number]; // drift phase per axis
  spinAxis: [number, number, number];
  spinBase: number;
};

function norm(v: [number, number, number]): [number, number, number] {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

// Build the finished package's part list. Cover, then the page stack behind it,
// then the plug body and its pins at the left edge -- the real seating.
function buildParts(): Part[] {
  const parts: Omit<Part, "nx" | "ny" | "nz" | "ext" | "amp" | "frq" | "phs" | "spinAxis" | "spinBase">[] = [];
  parts.push({ kind: "cover", pos: [0, 0, 0], scale: [1, 1, 1], shade: 1 });
  // Branding L2: a dark inset plaque with the CW logo on it (a nameplate, not a
  // white box), up in the header of the screen.
  parts.push({ kind: "plaque", pos: [0, 0.3, COVER_HD + 0.006], scale: [0.82, 1.0, 1], shade: 1 });
  parts.push({ kind: "logo", pos: [0, 0.3, COVER_HD + 0.02], scale: [0.4, 0.25, 1], shade: 1 });
  // Copy L2: text-lines ruled across the face below the brand.
  for (let c = 0; c < 4; c++) {
    parts.push({ kind: "copy", pos: [-0.04, 0.02 - c * 0.14, COVER_HD + 0.012], scale: [0.52 - c * 0.04, 0.018, 0.006], shade: 1 });
  }
  // Ecom L2: a little product grid down in the corner of the screen.
  for (let r = 0; r < 2; r++) {
    for (let cc = 0; cc < 3; cc++) {
      parts.push({ kind: "ecom", pos: [-0.56 + cc * 0.26, -0.52 - r * 0.22, COVER_HD + 0.012], scale: [0.095, 0.08, 0.008], shade: 1 });
    }
  }
  for (let i = 0; i < LEAF_COUNT; i++) {
    const z = -(COVER_HD + LEAF_HD + 0.012 + i * LEAF_PITCH);
    const shade = (1 - Math.min(0.42, i * 0.05)) * (i % 2 ? 0.9 : 1);
    parts.push({ kind: "leaf", pos: [0, 0, z], scale: [1, 1, 1], shade });
  }
  // Plug: body just outside the left edge, a cable stub behind it, and five pins
  // bridging into the slab.
  parts.push({ kind: "plug", pos: [-HW - 0.06, 0, 0], scale: [0.075, 0.11, 0.065], shade: 1 });
  parts.push({ kind: "plug", pos: [-HW - 0.17, 0, 0], scale: [0.055, 0.035, 0.035], shade: 1 });
  for (let p = 0; p < 5; p++) {
    const y = (p - 2) * 0.03;
    parts.push({ kind: "plug", pos: [-HW + 0.02, y, 0], scale: [0.08, 0.01, 0.01], shade: 1 });
  }

  // Wireframe shells: atmospheric line-gems (ICO_LINES) that orbit and keep
  // spinning even once the package is built, the way the live object carries its
  // showroom-grade shapes.
  const wirePlaces: [number, number, number][] = [
    [1.05, 0.8, 0.5], [-1.3, -0.6, 0.45], [1.2, -0.9, -0.5], [-0.95, 1.0, -0.35],
  ];
  const wireScale = [0.5, 0.42, 0.38, 0.46];
  wirePlaces.forEach((p, k) => {
    parts.push({ kind: "wire", pos: p, scale: [wireScale[k], wireScale[k], wireScale[k]], shade: 1 });
  });

  const hash = (k: number, s: number) => {
    const x = Math.sin((k + 1) * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x); // 0..1
  };
  const extOf = (k: Kind): number =>
    k === "cover" || k === "leaf"
      ? 1.9
      : k === "wire"
        ? 0.55
        : k === "plug" || k === "copy" || k === "ecom"
          ? 0.18
          : 0.5;
  // The big screens spread EVENLY across x so the wide frame fills and they never
  // bunch in one corner; everything else is hashed across the whole box.
  const bigIdx: number[] = [];
  parts.forEach((p, i) => {
    if (p.kind === "cover" || p.kind === "leaf") bigIdx.push(i);
  });
  return parts.map((base, i) => {
    const bi = bigIdx.indexOf(i);
    const nx =
      bi >= 0
        ? bigIdx.length > 1
          ? -0.9 + 1.8 * (bi / (bigIdx.length - 1))
          : 0
        : (hash(i, 1) * 2 - 1) * 0.95;
    const ny = (hash(i, 2) * 2 - 1) * 0.95;
    const nz = hash(i, 3) * 2 - 1;
    const spinAxis = norm([Math.sin(i * 1.7) + 0.2, Math.cos(i * 2.3), Math.sin(i * 0.9) + 0.3]);
    return {
      ...base,
      nx,
      ny,
      nz,
      ext: extOf(base.kind),
      amp: [0.25 + hash(i, 4) * 0.3, 0.18 + hash(i, 5) * 0.22, 0.3 + hash(i, 6) * 0.45] as [number, number, number],
      frq: [0.11 + hash(i, 7) * 0.13, 0.09 + hash(i, 8) * 0.12, 0.08 + hash(i, 9) * 0.1] as [number, number, number],
      phs: [hash(i, 10) * TWO_PI, hash(i, 11) * TWO_PI, hash(i, 12) * TWO_PI] as [number, number, number],
      spinAxis,
      spinBase: 0.104 + ((i * 5) % 4) * 0.036, // ~20% less spin
    };
  });
}

// A rotation matrix about an arbitrary unit axis (angle in radians).
function rotAxisMat(a: [number, number, number], ang: number): Float32Array {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const t = 1 - c;
  const [x, y, z] = a;
  // prettier-ignore
  return new Float32Array([
    t * x * x + c,      t * x * y + s * z,  t * x * z - s * y,  0,
    t * x * y - s * z,  t * y * y + c,      t * y * z + s * x,  0,
    t * x * z + s * y,  t * y * z - s * x,  t * z * z + c,      0,
    0, 0, 0, 1,
  ]);
}

const TWO_PI = Math.PI * 2;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function PackageAssemble({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The target the loop reads (a ref so the click handler never re-runs setup).
  const targetRef = useRef(0); // 0 = scattered, 1 = built
  const [built, setBuilt] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
      // Matches the live object: solid parts write ~opaque straight alpha, the
      // wireframe writes premultiplied -- both composite right against the page.
      preserveDrawingBuffer: true, // so the tile can be screenshotted
    });
    if (!gl) return;

    const link = (vs: string, fs: string): WebGLProgram | null => {
      const c = (type: number, src: string) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      };
      const p = gl.createProgram()!;
      gl.attachShader(p, c(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, c(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
      return p;
    };

    const screenProg = link(screenVert, screenFrag);
    const plugProg = link(screenVert, plugFrag);
    const lineProg = link(lineVert, lineFrag);
    const texProg = link(screenVert, texFrag);
    if (!screenProg || !plugProg || !lineProg || !texProg) return;

    // --- meshes + VAOs ------------------------------------------------
    const mkVao = (mesh: { pos: Float32Array; nrm: Float32Array; uv: Float32Array }) => {
      const vao = gl.createVertexArray()!;
      gl.bindVertexArray(vao);
      const attr = (loc: number, data: Float32Array, size: number) => {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };
      attr(0, mesh.pos, 3);
      attr(1, mesh.nrm, 3);
      attr(2, mesh.uv, 2);
      gl.bindVertexArray(null);
      return vao;
    };

    const coverMesh = buildScreen(HW, HH, COVER_HD, COVER_BEVEL, SCREEN.radius);
    const leafMesh = buildScreen(HW, HH, LEAF_HD, LEAF_BEVEL, SCREEN.radius);
    const boxMesh = buildBox();
    const plaqueMesh = buildFace(0.62, 0.34, 0.1); // the branding plate
    const quadMesh = buildQuad(); // the logo decal
    const coverVao = mkVao(coverMesh);
    const leafVao = mkVao(leafMesh);
    const boxVao = mkVao(boxMesh);
    const plaqueVao = mkVao(plaqueMesh);
    const quadVao = mkVao(quadMesh);

    // The CW logo, loaded as a premultiplied texture (the same mark the live
    // object lays on its plaque). A 1x1 transparent stand-in until it decodes.
    const gemTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, gemTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let gemReady = false;
    const gemImg = new Image();
    gemImg.onload = () => {
      // The mark already has a transparent background; upload it premultiplied.
      gl.bindTexture(gl.TEXTURE_2D, gemTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gemImg);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gemReady = true;
    };
    gemImg.src = "/cw-gemstone-mark.png";

    // Wireframe VAO: ICO_LINES is position-only (lineVert reads location 0).
    const icoVao = gl.createVertexArray()!;
    gl.bindVertexArray(icoVao);
    const icoBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, icoBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ICO_LINES, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    const icoCount = ICO_LINES.length / 3;

    const meshFor = (k: Kind) =>
      k === "cover" ? { vao: coverVao, count: coverMesh.count }
      : k === "leaf" ? { vao: leafVao, count: leafMesh.count }
      : k === "plaque" ? { vao: plaqueVao, count: plaqueMesh.count }
      : k === "logo" ? { vao: quadVao, count: quadMesh.count }
      : { vao: boxVao, count: boxMesh.count };

    // --- uniform locations -------------------------------------------
    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const us = {
      proj: U(screenProg, "uProj"), view: U(screenProg, "uView"),
      model: U(screenProg, "uModel"), normal: U(screenProg, "uNormal"),
      washA: U(screenProg, "uWashA"), washB: U(screenProg, "uWashB"), washC: U(screenProg, "uWashC"),
      tint: U(screenProg, "uTint"), time: U(screenProg, "uTime"),
      sheen: U(screenProg, "uSheen"), spectrum: U(screenProg, "uSpectrum"),
      grain: U(screenProg, "uGrain"), pulse: U(screenProg, "uPulse"),
      glow: U(screenProg, "uStrataGlow"), sections: U(screenProg, "uSections"),
      zap: U(screenProg, "uZap"), wipe: U(screenProg, "uWipe"),
      alpha: U(screenProg, "uAlpha"), rimGlow: U(screenProg, "uRimGlow"), rimAll: U(screenProg, "uRimAll"),
    };
    const up = {
      proj: U(plugProg, "uProj"), view: U(plugProg, "uView"),
      model: U(plugProg, "uModel"), normal: U(plugProg, "uNormal"),
      time: U(plugProg, "uTime"), charge: U(plugProg, "uCharge"), zap: U(plugProg, "uZap"),
    };
    const ul = {
      proj: U(lineProg, "uProj"), view: U(lineProg, "uView"), model: U(lineProg, "uModel"),
      col: U(lineProg, "uCol"), alpha: U(lineProg, "uAlpha"),
      yFade: U(lineProg, "uYFade"), yHalf: U(lineProg, "uYHalf"),
    };
    const ut = {
      proj: U(texProg, "uProj"), view: U(texProg, "uView"),
      model: U(texProg, "uModel"), normal: U(texProg, "uNormal"),
      tex: U(texProg, "uTex"), alpha: U(texProg, "uAlpha"), tint: U(texProg, "uTint"),
      uvScale: U(texProg, "uUvScale"), falloff: U(texProg, "uFalloff"),
      time: U(texProg, "uTime"), breath: U(texProg, "uBreath"), ripple: U(texProg, "uRipple"),
      holeOn: U(texProg, "uHoleOn"),
    };

    const parts = buildParts();

    // --- sizing -------------------------------------------------------
    const DPR = () => Math.min(window.devicePixelRatio || 1, 2);
    let proj = Mat.persp((SCREEN.fov * Math.PI) / 180, 1, 0.1, 100);
    const resize = () => {
      // Fill the canvas's real rendered box (it stretches to the column), not a
      // forced square -- otherwise a wide column makes a giant square with dead space.
      const cw = canvas.clientWidth || host.clientWidth;
      const ch = canvas.clientHeight || cw;
      const w = Math.max(1, Math.round(cw * DPR()));
      const h = Math.max(1, Math.round(ch * DPR()));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      proj = Mat.persp((SCREEN.fov * Math.PI) / 180, canvas.width / canvas.height, 0.1, 100);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // --- loop ---------------------------------------------------------
    const view = Mat.trans(0, 0, CAM_Z);
    const reduced = prefersReducedMotion();
    if (reduced) targetRef.current = 1; // no orbit for reduced motion: show it built

    let built01 = reduced ? 1 : 0; // eased build progress
    const spin = new Float32Array(parts.length); // accumulated self-spin per part
    let t0 = 0;
    let lastMs = 0;
    let raf = 0;

    const frame = (ms: number) => {
      raf = requestAnimationFrame(frame);
      if (!t0) t0 = ms;
      const time = (ms - t0) / 1000;
      // Real delta time (clamped) so speed is frame-rate independent -- not tied to
      // a hardcoded 60fps, which crawled when throttled and raced on 120Hz.
      const dt = lastMs ? Math.min(0.05, (ms - lastMs) / 1000) : 1 / 60;
      lastMs = ms;
      const paused = isMotionPaused();

      // ease build progress toward the target (slow: the collect is unhurried)
      // March to the target and SNAP when within a step, so it settles exactly at
      // 0 or 1 and holds -- no endpoint dither (which read as a second sequence).
      const tgt = targetRef.current;
      const step = dt * 0.27; // ~20% slower collect -> the flourish spins ~20% less
      if (Math.abs(tgt - built01) <= step) built01 = tgt;
      else built01 += tgt > built01 ? step : -step;
      const e = easeInOut(built01);

      // gentle whole-object float (like the live object at rest)
      const fl = paused ? 0 : 1;
      const swayY = Math.sin(time * 0.25) * 0.05 * fl;
      const swayX = Math.sin(time * 0.185 + 1.3) * 0.04 * fl;
      const driftX = Math.sin(time * 0.155) * 0.05 * fl;
      const driftY = Math.sin(time * 0.215 + 0.7) * 0.04 * fl;
      const orient = Mat.mul(
        Mat.mul(Mat.trans(driftX, driftY, 0), Mat.rotY(SCREEN.restRotY + swayY)),
        Mat.rotX(SCREEN.restTiltX + swayX)
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // The frame's visible half-extents at the object plane, so parts can spread
      // to fill the whole box and never spill past the edges.
      const visH = Math.tan(((SCREEN.fov * Math.PI) / 180) / 2) * Math.abs(CAM_Z);
      const visW = visH * (canvas.width / canvas.height);

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        // Scattered target: a base position spread across the WHOLE frame plus an
        // independent xyz drift, so each part translates through space on its own
        // path and the pieces read as unrelated -- not an orbiting cluster. The
        // range subtracts the part's extent + drift, so nothing ever clips.
        const rangeX = Math.max(0, visW * 0.92 - part.ext - part.amp[0]);
        const rangeY = Math.max(0, visH * 0.92 - part.ext - part.amp[1]);
        const tt = paused ? 0 : time;
        const scx = part.nx * rangeX + Math.sin(tt * part.frq[0] + part.phs[0]) * part.amp[0];
        const scy = part.ny * rangeY + Math.sin(tt * part.frq[1] + part.phs[1]) * part.amp[1];
        const scz = part.nz * 1.7 + Math.sin(tt * part.frq[2] + part.phs[2]) * part.amp[2];
        // blended position: scattered -> home
        const px = scx + (part.pos[0] - scx) * e;
        const py = scy + (part.pos[1] - scy) * e;
        const pz = scz + (part.pos[2] - scz) * e;

        // Wireframe shells: their own continuous spin (they never lock), drawn
        // premultiplied. Position still blends orbit -> home like everything else.
        if (part.kind === "wire") {
          const rotM = Mat.mul(
            Mat.rotY(time * part.spinBase * 0.5),
            Mat.rotX(time * part.spinBase * 0.33 + 0.6)
          );
          const wlocal = Mat.mul(
            Mat.trans(px, py, pz),
            Mat.mul(rotM, Mat.scale(part.scale[0], part.scale[1], part.scale[2]))
          );
          const wmodel = Mat.mul(orient, wlocal);
          gl.useProgram(lineProg);
          gl.uniformMatrix4fv(ul.proj, false, proj);
          gl.uniformMatrix4fv(ul.view, false, view);
          gl.uniformMatrix4fv(ul.model, false, wmodel);
          gl.uniform3f(ul.col, 0.62, 0.5, 0.9);
          gl.uniform1f(ul.alpha, 0.5);
          gl.uniform1f(ul.yFade, 0);
          gl.uniform1f(ul.yHalf, 1);
          gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied line output
          gl.bindVertexArray(icoVao);
          gl.drawArrays(gl.LINES, 0, icoCount);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // back to straight
          continue;
        }

        // self-spin. It ONLY accrues while scattered, so a click never rewinds the
        // whole accumulated path; on the collect the held angle settles home by the
        // shortest route and locks flat. No bell flourish -- that read as a reversal.
        if (!paused && e < 0.02) spin[i] += dt * part.spinBase;
        const spun = ((spin[i] % TWO_PI) + TWO_PI) % TWO_PI;
        const ang = spun > Math.PI ? spun - TWO_PI : spun; // shortest path to 0
        // A light dramatic flourish: about two turns on the way IN and OUT, always
        // ending flat at home (2*TWO_PI is a whole number of turns = identity).
        // Monotonic in e, so it never overshoots and springs back.
        const spinDir = i % 2 ? 1 : -1;
        const effSpin = ang * (1 - e) + spinDir * 2 * TWO_PI * e;

        const local = Mat.mul(
          Mat.trans(px, py, pz),
          Mat.mul(rotAxisMat(part.spinAxis, effSpin), Mat.scale(part.scale[0], part.scale[1], part.scale[2]))
        );
        const model = Mat.mul(orient, local);
        const mv = Mat.mul(view, model);
        const nrm = Mat.normalMat(mv);

        // Logo decal (branding L2): the CW mark, premultiplied over the plaque.
        if (part.kind === "logo") {
          if (!gemReady) continue;
          gl.useProgram(texProg);
          gl.uniformMatrix4fv(ut.proj, false, proj);
          gl.uniformMatrix4fv(ut.view, false, view);
          gl.uniformMatrix4fv(ut.model, false, model);
          gl.uniformMatrix3fv(ut.normal, false, nrm);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, gemTex);
          gl.uniform1i(ut.tex, 0);
          gl.uniform1f(ut.alpha, 1);
          gl.uniform3f(ut.tint, 1, 1, 1);
          gl.uniform2f(ut.uvScale, 1, 1);
          gl.uniform1f(ut.falloff, 0);
          gl.uniform1f(ut.time, time);
          gl.uniform1f(ut.breath, 1);
          gl.uniform1f(ut.ripple, 0);
          gl.uniform1f(ut.holeOn, 0);
          gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          gl.bindVertexArray(quadVao);
          gl.drawArrays(gl.TRIANGLES, 0, quadMesh.count);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          continue;
        }

        if (part.kind === "plug") {
          gl.useProgram(plugProg);
          gl.uniformMatrix4fv(up.proj, false, proj);
          gl.uniformMatrix4fv(up.view, false, view);
          gl.uniformMatrix4fv(up.model, false, model);
          gl.uniformMatrix3fv(up.normal, false, nrm);
          gl.uniform1f(up.time, time);
          gl.uniform1f(up.charge, 0.85); // mathDev level 4: electric
          gl.uniform1f(up.zap, 0);
        } else {
          gl.useProgram(screenProg);
          gl.uniformMatrix4fv(us.proj, false, proj);
          gl.uniformMatrix4fv(us.view, false, view);
          gl.uniformMatrix4fv(us.model, false, model);
          gl.uniformMatrix3fv(us.normal, false, nrm);
          if (part.kind === "cover") {
            gl.uniform3fv(us.washA, WASH_A);
            gl.uniform3fv(us.washB, WASH_B);
            gl.uniform3fv(us.washC, WASH_C);
            gl.uniform1f(us.sheen, 0.5);
            gl.uniform1f(us.grain, 0.5);
            gl.uniform1f(us.rimGlow, 0.6);
            gl.uniform1f(us.rimAll, 1);
          } else if (part.kind === "plaque") {
            // branding L2: a dark inset nameplate (the CW logo sits on it).
            gl.uniform3fv(us.washA, PLAQUE_A);
            gl.uniform3fv(us.washB, PLAQUE_C);
            gl.uniform3fv(us.washC, PLAQUE_C);
            gl.uniform1f(us.sheen, 0.6);
            gl.uniform1f(us.grain, 0);
            gl.uniform1f(us.rimGlow, 0);
            gl.uniform1f(us.rimAll, 0);
          } else if (part.kind === "copy") {
            // copy L2: light text-lines ruled on the screen.
            gl.uniform3fv(us.washA, COPY_COL);
            gl.uniform3fv(us.washB, COPY_COL);
            gl.uniform3fv(us.washC, COPY_COL);
            gl.uniform1f(us.sheen, 0.2);
            gl.uniform1f(us.grain, 0);
            gl.uniform1f(us.rimGlow, 0);
            gl.uniform1f(us.rimAll, 0);
          } else if (part.kind === "ecom") {
            // ecom L2: product tiles.
            gl.uniform3fv(us.washA, ECOM_COL);
            gl.uniform3fv(us.washB, ECOM_COL);
            gl.uniform3fv(us.washC, ECOM_COL);
            gl.uniform1f(us.sheen, 0.45);
            gl.uniform1f(us.grain, 0);
            gl.uniform1f(us.rimGlow, 0);
            gl.uniform1f(us.rimAll, 0);
          } else {
            // leaves: a flat purple paper, no display wash or rim.
            const paper: [number, number, number] = [
              WASH_C[0] * 0.42 + WASH_A[0] * 0.58,
              WASH_C[1] * 0.42 + WASH_A[1] * 0.58,
              WASH_C[2] * 0.42 + WASH_A[2] * 0.58,
            ];
            gl.uniform3fv(us.washA, paper);
            gl.uniform3fv(us.washB, paper);
            gl.uniform3fv(us.washC, paper);
            gl.uniform1f(us.sheen, 0.12);
            gl.uniform1f(us.grain, 0);
            gl.uniform1f(us.rimGlow, 0);
            gl.uniform1f(us.rimAll, 0);
          }
          gl.uniform3f(us.tint, SLAB_TINT[0] * part.shade, SLAB_TINT[1] * part.shade, SLAB_TINT[2] * part.shade);
          gl.uniform1f(us.time, time);
          gl.uniform1f(us.spectrum, 0);
          gl.uniform1f(us.pulse, 0);
          gl.uniform1f(us.glow, 0);
          gl.uniform1f(us.sections, 0);
          gl.uniform1f(us.zap, 0);
          gl.uniform1f(us.wipe, 0);
          gl.uniform1f(us.alpha, 1);
        }
        const m = meshFor(part.kind);
        gl.bindVertexArray(m.vao);
        gl.drawArrays(gl.TRIANGLES, 0, m.count);
      }
      gl.bindVertexArray(null);
    };
    raf = requestAnimationFrame(frame);

    const unsub = subscribeMotion(() => {}); // keep the loop honest with the toggle

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      unsub();
    };
  }, []);

  return (
    <button
      type="button"
      ref={(el) => {
        // the button is the host + click target
        hostRef.current = el as unknown as HTMLDivElement;
      }}
      className={`cw-assemble${built ? " is-built" : ""}${className ? ` ${className}` : ""}`}
      aria-pressed={built}
      onClick={() => {
        const next = !built;
        setBuilt(next);
        targetRef.current = next ? 1 : 0;
      }}
    >
      <canvas ref={canvasRef} className="cw-assemble__canvas" aria-hidden="true" />
      <span className="cw-assemble__hint">
        <span className="cw-assemble__label">
          {built
            ? "Website scope after chadworks calculator"
            : "Website scope before chadworks calculator"}
        </span>
        <span className="cw-assemble__click">
          {built ? "click to take it apart" : "click to build"}
        </span>
      </span>
    </button>
  );
}

export default PackageAssemble;
