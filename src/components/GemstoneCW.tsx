"use client";

// =====================================================================
// GemstoneCW -- the faceted-glass "CW" brand mark (LOCKED v1, 2026-06-16).
// Ported verbatim in technique from design-references/cw-gemstone-hero.html
// per CWS-GEMSTONE-CW-HERO.md: raw WebGL2 (no deps), a swept-tube "C" + four
// extruded "W" bars rendered as cut crystal that refracts a brand gradient
// (white -> #8054bc -> #e5d2f4) with dispersion, Fresnel rim and specular glints.
//
// Differences from the reference (the porting plan):
//  - Scoped to a HOST element, not the full viewport: all sizing/cursor math is
//    relative to the canvas rect, not window. position:fixed -> absolute in host.
//  - Dev controls panel + image-drop are dropped; the locked defaults are baked.
//  - The two puff hotspots are real, crawlable anchors (/websites/, /visibility/)
//    rendered in the static HTML, so SEO/no-JS readers get the links + a CW
//    fallback. The <canvas> only mounts client-side.
//  - rAF parks via IntersectionObserver when the section is off-screen; DPR cap 2;
//    prefers-reduced-motion renders a single static front-facing frame.
//
// The mat math, CW geometry, shader sources and LOCKED defaults live in
// @/lib/gemstone-core so the small GemstoneMark reuses the exact look.
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
  maskFrag,
  LOCKED,
  MAXTILT,
  FEATHER,
  MASKSCALE,
} from "@/lib/gemstone-core";

export function GemstoneCW() {
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
    if (!gl) return; // SSR fallback (the CW text + links) stays visible.

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
    // Catch it so we fall back to the static CW markup instead of throwing out
    // of the effect and crashing the whole route.
    let bgProg: WebGLProgram, gemProg: WebGLProgram, maskProg: WebGLProgram;
    try {
      bgProg = program(fsTri, bgFrag);
      gemProg = program(gemVert, gemFrag);
      maskProg = program(gemVert, maskFrag);
    } catch (err) {
      console.warn("GemstoneCW: WebGL shader build failed; using static fallback.", err);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }
    const emptyVao = gl.createVertexArray();

    let gemVao: WebGLVertexArrayObject | null = null,
      posBuf: WebGLBuffer | null = null,
      nrmBuf: WebGLBuffer | null = null,
      gemCount = 0;
    const uploadMesh = (hd: number) => {
      const m = buildCW(hd);
      gemCount = m.count;
      if (!gemVao) {
        gemVao = gl.createVertexArray();
        posBuf = gl.createBuffer();
        nrmBuf = gl.createBuffer();
      }
      gl.bindVertexArray(gemVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, m.pos, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
      gl.bufferData(gl.ARRAY_BUFFER, m.nrm, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);
    };

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
    };
    const um = {
      proj: U(maskProg, "uProj"),
      view: U(maskProg, "uView"),
      model: U(maskProg, "uModel"),
      normal: U(maskProg, "uNormal"),
    };

    let maskFbo: WebGLFramebuffer | null = null,
      maskTex: WebGLTexture | null = null,
      mw = 0,
      mh = 0;
    const resizeMask = (w: number, h: number) => {
      const nw = Math.max(1, Math.round(w * MASKSCALE)),
        nh = Math.max(1, Math.round(h * MASKSCALE));
      if (nw === mw && nh === mh) return;
      mw = nw;
      mh = nh;
      if (!maskFbo) {
        maskFbo = gl.createFramebuffer();
        maskTex = gl.createTexture();
      }
      gl.bindTexture(gl.TEXTURE_2D, maskTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, mw, mh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.bindFramebuffer(gl.FRAMEBUFFER, maskFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, maskTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    const readBuf = new Uint8Array(640 * 640 * 4);

    const state = { ...LOCKED };
    uploadMesh(state.depth);

    // cursor reactive, scoped to the host rect. engages over the letters (+feather)
    // or, once shown, over the puffs; otherwise the mark slowly spins.
    let rotY = 0,
      rotX = 0,
      mx = 0,
      my = 0,
      engaged = false;
    let cursorX = -1,
      cursorY = -1,
      cursorInside = false,
      overLetters = false;
    const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorX = e.clientX - rect.left;
      cursorY = e.clientY - rect.top;
      cursorInside =
        cursorX >= 0 && cursorX <= rect.width && cursorY >= 0 && cursorY <= rect.height;
    };
    const onLeave = () => {
      cursorInside = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("blur", onLeave);
    host.addEventListener("pointerleave", onLeave);

    let DPR = 1;
    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      // Render to the CANVAS's own box (taller than the host, which crops it),
      // so the gem keeps a constant size while the visible band stays short.
      const w = Math.round(canvas.clientWidth * DPR),
        h = Math.round(canvas.clientHeight * DPR);
      if (w < 1 || h < 1) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      resizeFbo(w, h);
      resizeMask(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let t0 = 0,
      prevTs = 0;

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

      // engagement: the mark tilts toward the cursor while it's over the letters
      // (mask hit-test, last frame); otherwise it slowly spins.
      const wasEngaged = engaged;
      engaged = cursorInside && overLetters;
      if (engaged && !wasEngaged) rotY = wrap(rotY);
      if (engaged) {
        mx = (cursorX / Math.max(1, canvas.clientWidth)) * 2 - 1;
        my = (cursorY / Math.max(1, canvas.clientHeight)) * 2 - 1;
        const k = Math.min(1, dt * 7);
        rotY += (mx * MAXTILT - rotY) * k;
        rotX += (my * MAXTILT - rotX) * k;
      } else {
        rotY += state.spin * dt * 0.9;
        rotX += (0 - rotX) * Math.min(1, dt * 4);
      }

      // brand gradient -> FBO ONLY. The gem samples this texture for its color
      // and refraction, but it is never drawn to the screen, so the colors live
      // IN the 3D letters and the section keeps a fully transparent backdrop.
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, w, h);
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(bgProg);
      gl.uniform1f(u.bgTime, time);
      gl.uniform2f(u.bgRes, w, h);
      gl.uniform3fv(u.bgA, state.bgA);
      gl.uniform3fv(u.bgB, state.bgB);
      gl.uniform3fv(u.bgC, state.bgC);
      gl.bindVertexArray(emptyVao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // the gem, composited onto a transparent canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(gemProg);
      const proj = M4.persp((35 * Math.PI) / 180, w / h, 0.1, 100),
        view = M4.trans(0, 0, -4.2),
        model = M4.mul(M4.rotY(rotY), M4.rotX(rotX)),
        modelView = M4.mul(view, model);
      gl.uniformMatrix4fv(u.gProj, false, proj);
      gl.uniformMatrix4fv(u.gView, false, view);
      gl.uniformMatrix4fv(u.gModel, false, model);
      gl.uniformMatrix3fv(u.gNormal, false, M4.normalMat(modelView));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fboTex);
      gl.uniform1i(u.gBg, 0);
      gl.uniform2f(u.gRes, w, h);
      gl.uniform1f(u.gRef, state.refract);
      gl.uniform1f(u.gDis, state.disp);
      gl.uniform3fv(u.gTint, state.tint);
      gl.uniform1f(u.gFac, state.facet);
      gl.bindVertexArray(gemVao);
      gl.drawArrays(gl.TRIANGLES, 0, gemCount);

      // mask pass for hit-testing (skip if cursor is outside the host)
      if (cursorInside) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, maskFbo);
        gl.viewport(0, 0, mw, mh);
        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(maskProg);
        gl.uniformMatrix4fv(um.proj, false, proj);
        gl.uniformMatrix4fv(um.view, false, view);
        gl.uniformMatrix4fv(um.model, false, model);
        gl.uniformMatrix3fv(um.normal, false, M4.normalMat(modelView));
        gl.bindVertexArray(gemVao);
        gl.drawArrays(gl.TRIANGLES, 0, gemCount);

        const px = Math.round(cursorX * DPR * MASKSCALE),
          py = Math.round(mh - cursorY * DPR * MASKSCALE);
        const fm = Math.max(1, Math.round(FEATHER * DPR * MASKSCALE));
        let hit = false,
          minX = -1,
          maxX = -1;
        const bx = Math.max(0, px - fm),
          by = Math.max(0, py - fm);
        const bw = Math.min(mw - bx, fm * 2),
          bh = Math.min(mh - by, fm * 2);
        if (bw > 0 && bh > 0 && bw * bh * 4 <= readBuf.length) {
          gl.readPixels(bx, by, bw, bh, gl.RGBA, gl.UNSIGNED_BYTE, readBuf);
          for (let i = 0; i < bw * bh * 4; i += 4) {
            if (readBuf[i] > 40) {
              hit = true;
              break;
            }
          }
        }
        if (!hit && py >= 0 && py < mh && mw * 4 <= readBuf.length) {
          gl.readPixels(0, py, mw, 1, gl.RGBA, gl.UNSIGNED_BYTE, readBuf);
          for (let x = 0; x < mw; x++) {
            if (readBuf[x * 4] > 40) {
              if (minX < 0) minX = x;
              maxX = x;
            }
          }
          if (maxX >= 0 && px >= minX - fm && px <= maxX + fm) hit = true;
        }
        overLetters = hit;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        overLetters = false;
      }
    };

    const tick = (now: number) => {
      renderFrame(now);
      if (running && !reduce) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      prevTs = 0;
      if (reduce) {
        // one static front-facing frame, no loop.
        requestAnimationFrame((n) => renderFrame(n));
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // park the loop when the section is off-screen OR motion is globally paused
    // (context stays warm). When paused while on-screen, render one final frame
    // so the gem is shown frozen rather than cleared.
    let visible = false;
    let motionPaused = isMotionPaused();
    const sync = () => (visible && !motionPaused ? start() : stop());
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        sync();
      },
      // No margin: spin perpetually while ANY part is on-screen, but park the
      // loop the instant the gem is fully out of the viewport.
      { root: null, rootMargin: "0px", threshold: 0 }
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
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      host.removeEventListener("pointerleave", onLeave);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return (
    <section className="section full cw-gem" aria-label="chadworks CW">
      <div className="cw-gem__host" ref={hostRef}>
        <canvas className="cw-gem__canvas" ref={canvasRef} aria-hidden="true" />
      </div>
    </section>
  );
}

export default GemstoneCW;
