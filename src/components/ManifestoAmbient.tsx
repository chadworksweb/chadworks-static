"use client";

// =====================================================================
// ManifestoAmbient -- the shared gemstone + manifesto backdrop, the same
// domain-warped fbm field as the Lyric Transformer hero (Local Sites/
// lyric-transformer .../pages/AmbientHero.tsx): pale indigo drifting through warm
// paper, rendered in WebGL. STATIC: one frame, no animation -- a fresh random
// seed each page load picks a different slice of the field, so the cloud varies
// run to run but never moves. Falls back to a soft static CSS gradient
// (.cw-mani-field__cloud--fallback) if WebGL is unavailable. The canvas is a
// full-bleed absolute layer (.cw-mani-field__cloud) that begins in the lower
// third of the gemstone and runs through the manifesto.
// =====================================================================

import { useEffect, useRef } from "react";

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 2.2;
  float t = u_time * 0.03; // slow
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  float f = fbm(p + 1.6 * q + t * 0.5);
  vec3 paper = vec3(0.984, 0.980, 0.969);
  vec3 indigo = vec3(0.80, 0.78, 0.89);
  vec3 col = mix(paper, indigo, smoothstep(0.25, 0.85, f) * 0.55);
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Mirrors the stacked-layout query used by the calculator (MOBILE_Q in
// PackageBuilderStage, stackMq in PackageScreen, and the @media in
// package-builder.module.css). Keep the string IDENTICAL to those.
const STACKED_Q = "(pointer: coarse), (max-width: 900px)";

export default function ManifestoAmbient({
  // GIVE UP THE WEBGL CONTEXT WHERE ONE IS SCARCE (2026-08-01).
  //
  // Set by a page that also renders a WebGL feature which MATTERS more than this
  // backdrop -- currently the cost calculator, whose object is the whole point of
  // the page. Browsers cap simultaneous WebGL contexts and mobile Safari's cap is
  // the tight one; whichever canvas asks second is the one that gets nothing.
  //
  // Ordering used to decide that by accident. The calculator was the first thing
  // on that page, so its object asked first and won, and this cloud was the one
  // that quietly fell back -- which is invisible, because it has a CSS fallback.
  // Moving the intro above the tool reversed it: this asked first, and the OBJECT
  // came back empty (PackageScreen bails silently when getContext returns null).
  //
  // So on the stacked layout -- phones and tablets, the devices with the tight cap
  // -- this takes its documented gradient fallback and never asks for a context at
  // all. Desktop is unaffected and still gets the real cloud. This is deliberately
  // opt-in rather than global: every other page that uses this backdrop has no
  // second WebGL canvas to compete with, so there is nothing to yield to there.
  yieldWebgl = false,
}: { yieldWebgl?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (yieldWebgl && window.matchMedia(STACKED_Q).matches) {
      canvas.classList.add("cw-mani-field__cloud--fallback");
      return;
    }

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      canvas.classList.add("cw-mani-field__cloud--fallback");
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.classList.add("cw-mani-field__cloud--fallback");
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // Fullscreen triangle.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // A fresh random seed per load. u_time only warps the field's domain here, so
    // a random value picks a different STATIC slice of the same cloud each visit.
    const seed = Math.random() * 1000;

    // One static frame. Re-drawn on resize because the canvas buffer is reset
    // (which clears it) when its backing size changes.
    const draw = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, seed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    draw();

    return () => {
      ro.disconnect();
    };
  }, [yieldWebgl]);

  return (
    <canvas
      ref={canvasRef}
      className="cw-mani-field__cloud"
      aria-hidden="true"
    />
  );
}
