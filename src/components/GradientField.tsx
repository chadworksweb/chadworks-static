"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Stripe-style animated mesh gradient. A full-screen WebGL fragment shader runs
// domain-warped fractal noise (Ashima simplex FBM, warped twice) across a brand
// palette, producing a vivid, amorphous, continuously flowing color field --
// not blobs, not particles. Self-hosted, no deps. Reduced-motion freezes it on
// one frame. Renders into an absolutely-positioned canvas behind the section.
//
// Colors are passed in 0-1 RGB. Defaults are the brand light palette.
type RGB = [number, number, number];
interface GradientFieldProps {
  colors?: [RGB, RGB, RGB, RGB];
  speed?: number; // time multiplier
  className?: string;
}

// [base, layer1, layer2, layer3]. Base fills, then each layer's color is
// revealed by its own slow noise mask and blended over -> Stripe-style flow.
const DEFAULT_COLORS: [RGB, RGB, RGB, RGB] = [
  [0.929, 0.906, 0.965], // #ede7f6 lavender (base)
  [0.557, 0.608, 0.859], // #8e9bdb periwinkle / indigo
  [0.753, 0.518, 0.910], // #c084e8 vivid purple
  [0.945, 0.647, 0.812], // #f1a5cf vivid pink
];

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uResolution;
uniform float uTime;
uniform vec3  uC1;   // base
uniform vec3  uC2;   // layer 1
uniform vec3  uC3;   // layer 2
uniform vec3  uC4;   // layer 3

// --- Ashima 3D simplex noise (public domain) ---
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // incline the plane (~ -22deg) so the color sweeps run on a diagonal
  float a = -0.38;
  mat2 R = mat2(cos(a), -sin(a), sin(a), cos(a));
  p = R * p;

  float t = uTime * 0.05;

  // Base, then 3 color layers each revealed by its own slow, low-frequency,
  // ANISOTROPIC noise (x-freq << y-freq) -> long elongated elliptical sweeps,
  // not round blobs. 3D noise (time = z) makes the whole field flow + morph.
  vec3 col = uC1;

  float n1 = snoise(vec3(p.x * 0.9  + t * 0.20, p.y * 2.3, t * 0.35));
  col = mix(col, uC2, smoothstep(-0.25, 0.65, n1));

  float n2 = snoise(vec3(p.x * 0.65 - t * 0.16 + 11.0, p.y * 1.8, t * 0.28 + 4.0));
  col = mix(col, uC3, smoothstep(-0.15, 0.75, n2) * 0.92);

  float n3 = snoise(vec3(p.x * 1.25 + t * 0.22 + 23.0, p.y * 2.7, t * 0.42 + 9.0));
  col = mix(col, uC4, smoothstep(0.05, 0.85, n3) * 0.88);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export function GradientField({
  colors = DEFAULT_COLORS,
  speed = 1,
  className,
}: GradientFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // full-screen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uTime = gl.getUniformLocation(prog, "uTime");
    gl.uniform3fv(gl.getUniformLocation(prog, "uC1"), colors[0]);
    gl.uniform3fv(gl.getUniformLocation(prog, "uC2"), colors[1]);
    gl.uniform3fv(gl.getUniformLocation(prog, "uC3"), colors[2]);
    gl.uniform3fv(gl.getUniformLocation(prog, "uC4"), colors[3]);

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = canvas.clientWidth * dpr();
      const h = canvas.clientHeight * dpr();
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const reduce = prefersReducedMotion();
    let raf = 0;
    let start = 0;
    const draw = (now: number) => {
      if (!start) start = now;
      gl.uniform1f(uTime, ((now - start) / 1000) * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [colors, speed]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
