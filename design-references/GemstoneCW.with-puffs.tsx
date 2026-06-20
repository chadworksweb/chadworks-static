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
// =====================================================================

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion } from "@/lib/motion";

/* ---------- mat4 / mat3 ---------- */
const M4 = {
  ident() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  },
  mul(a: Float32Array, b: Float32Array) {
    const o = new Float32Array(16);
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        o[c * 4 + r] =
          a[r] * b[c * 4] +
          a[4 + r] * b[c * 4 + 1] +
          a[8 + r] * b[c * 4 + 2] +
          a[12 + r] * b[c * 4 + 3];
      }
    return o;
  },
  persp(fovy: number, aspect: number, near: number, far: number) {
    const f = 1 / Math.tan(fovy / 2),
      nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0,
      2 * far * near * nf, 0,
    ]);
  },
  trans(x: number, y: number, z: number) {
    const m = M4.ident();
    m[12] = x;
    m[13] = y;
    m[14] = z;
    return m;
  },
  rotY(a: number) {
    const c = Math.cos(a),
      s = Math.sin(a),
      m = M4.ident();
    m[0] = c;
    m[2] = -s;
    m[8] = s;
    m[10] = c;
    return m;
  },
  rotX(a: number) {
    const c = Math.cos(a),
      s = Math.sin(a),
      m = M4.ident();
    m[5] = c;
    m[6] = s;
    m[9] = -s;
    m[10] = c;
    return m;
  },
  invert(a: Float32Array) {
    const m = a,
      o = new Float32Array(16);
    const b00 = m[0] * m[5] - m[1] * m[4],
      b01 = m[0] * m[6] - m[2] * m[4],
      b02 = m[0] * m[7] - m[3] * m[4],
      b03 = m[1] * m[6] - m[2] * m[5],
      b04 = m[1] * m[7] - m[3] * m[5],
      b05 = m[2] * m[7] - m[3] * m[6];
    const b06 = m[8] * m[13] - m[9] * m[12],
      b07 = m[8] * m[14] - m[10] * m[12],
      b08 = m[8] * m[15] - m[11] * m[12],
      b09 = m[9] * m[14] - m[10] * m[13],
      b10 = m[9] * m[15] - m[11] * m[13],
      b11 = m[10] * m[15] - m[11] * m[14];
    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return M4.ident();
    det = 1 / det;
    o[0] = (m[5] * b11 - m[6] * b10 + m[7] * b09) * det;
    o[1] = (m[2] * b10 - m[1] * b11 - m[3] * b09) * det;
    o[2] = (m[13] * b05 - m[14] * b04 + m[15] * b03) * det;
    o[3] = (m[10] * b04 - m[9] * b05 - m[11] * b03) * det;
    o[4] = (m[6] * b08 - m[4] * b11 - m[7] * b07) * det;
    o[5] = (m[0] * b11 - m[2] * b08 + m[3] * b07) * det;
    o[6] = (m[14] * b02 - m[12] * b05 - m[15] * b01) * det;
    o[7] = (m[8] * b05 - m[10] * b02 + m[11] * b01) * det;
    o[8] = (m[4] * b10 - m[5] * b08 + m[7] * b06) * det;
    o[9] = (m[1] * b08 - m[0] * b10 - m[3] * b06) * det;
    o[10] = (m[12] * b04 - m[13] * b02 + m[15] * b00) * det;
    o[11] = (m[9] * b02 - m[8] * b04 - m[11] * b00) * det;
    o[12] = (m[5] * b07 - m[4] * b09 - m[6] * b06) * det;
    o[13] = (m[0] * b09 - m[1] * b07 + m[2] * b06) * det;
    o[14] = (m[13] * b01 - m[12] * b03 - m[14] * b00) * det;
    o[15] = (m[8] * b03 - m[9] * b01 + m[10] * b00) * det;
    return o;
  },
  normalMat(m4: Float32Array) {
    const i = M4.invert(m4);
    return new Float32Array([
      i[0], i[4], i[8], i[1], i[5], i[9], i[2], i[6], i[10],
    ]);
  },
};

/* ---------- CW geometry (procedural, extruded faceted glass) ---------- */
function buildCW(hd: number) {
  const pos: number[] = [],
    nrm: number[] = [];
  type V3 = [number, number, number];
  function tri(a: V3, b: V3, c: V3, n: V3) {
    pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    for (let k = 0; k < 3; k++) nrm.push(n[0], n[1], n[2]);
  }
  function quad(a: V3, b: V3, c: V3, d: V3, n: V3) {
    tri(a, b, c, n);
    tri(a, c, d, n);
  }

  // --- C : swept rectangular tube along an arc, opening to the right ---
  const cx = 0.5,
    R = 0.5,
    r = 0.31,
    N = 26;
  const a0 = (38 * Math.PI) / 180,
    a1 = (322 * Math.PI) / 180; // gap centered on the +x axis
  const ring = (a: number) => {
    const cs = Math.cos(a),
      sn = Math.sin(a);
    return {
      Of: [cx + R * cs, R * sn, hd] as V3,
      If: [cx + r * cs, r * sn, hd] as V3,
      Ib: [cx + r * cs, r * sn, -hd] as V3,
      Ob: [cx + R * cs, R * sn, -hd] as V3,
      cs,
      sn,
    };
  };
  let prev = ring(a0);
  for (let i = 1; i <= N; i++) {
    const a = a0 + (a1 - a0) * (i / N),
      cur = ring(a);
    const am = a0 + (a1 - a0) * ((i - 0.5) / N),
      cm = Math.cos(am),
      sm = Math.sin(am);
    quad(prev.Of, prev.If, cur.If, cur.Of, [0, 0, 1]); // front face
    quad(prev.Ob, cur.Ob, cur.Ib, prev.Ib, [0, 0, -1]); // back face
    quad(prev.Of, cur.Of, cur.Ob, prev.Ob, [cm, sm, 0]); // outer wall
    quad(prev.If, prev.Ib, cur.Ib, cur.If, [-cm, -sm, 0]); // inner wall
    prev = cur;
  }
  // C end caps
  const s0 = ring(a0),
    s1 = ring(a1);
  quad(s0.Of, s0.Ob, s0.Ib, s0.If, [Math.sin(a0), -Math.cos(a0), 0]);
  quad(s1.Of, s1.If, s1.Ib, s1.Ob, [-Math.sin(a1), Math.cos(a1), 0]);

  // --- W : four extruded strokes ---
  const xs = 1.06,
    Wd = 0.95,
    ty = 0.5,
    w = 0.205,
    hw = w / 2;
  const X = (k: number) => xs + Wd * k;
  const A: [number, number] = [X(0), ty],
    B: [number, number] = [X(0.3), -ty],
    Cc: [number, number] = [X(0.5), ty],
    D: [number, number] = [X(0.7), -ty],
    E: [number, number] = [X(1.0), ty];
  function bar(P0: [number, number], P1: [number, number]) {
    const dx = P1[0] - P0[0],
      dy = P1[1] - P0[1],
      L = Math.hypot(dx, dy);
    const dir = [dx / L, dy / L],
      per = [-dir[1], dir[0]];
    const v = (p: [number, number], sgn: number, z: number): V3 => [
      p[0] + per[0] * hw * sgn,
      p[1] + per[1] * hw * sgn,
      z,
    ];
    const P0pf = v(P0, 1, hd),
      P1pf = v(P1, 1, hd),
      P1mf = v(P1, -1, hd),
      P0mf = v(P0, -1, hd);
    const P0pb = v(P0, 1, -hd),
      P1pb = v(P1, 1, -hd),
      P1mb = v(P1, -1, -hd),
      P0mb = v(P0, -1, -hd);
    quad(P0pf, P1pf, P1mf, P0mf, [0, 0, 1]); // front
    quad(P0pb, P0mb, P1mb, P1pb, [0, 0, -1]); // back
    quad(P0pf, P0pb, P1pb, P1pf, [per[0], per[1], 0]); // +side
    quad(P0mf, P1mf, P1mb, P0mb, [-per[0], -per[1], 0]); // -side
    quad(P0pf, P0mf, P0mb, P0pb, [-dir[0], -dir[1], 0]); // end P0
    quad(P1pf, P1pb, P1mb, P1mf, [dir[0], dir[1], 0]); // end P1
  }
  bar(A, B);
  bar(B, Cc);
  bar(Cc, D);
  bar(D, E);

  // --- center + scale the whole mark to fit the view ---
  const P = pos;
  let minx = 1e9,
    maxx = -1e9,
    miny = 1e9,
    maxy = -1e9;
  for (let i = 0; i < P.length; i += 3) {
    minx = Math.min(minx, P[i]);
    maxx = Math.max(maxx, P[i]);
    miny = Math.min(miny, P[i + 1]);
    maxy = Math.max(maxy, P[i + 1]);
  }
  const cxg = (minx + maxx) / 2,
    cyg = (miny + maxy) / 2,
    span = Math.max(maxx - minx, (maxy - miny) * 1.0);
  const target = 2.5,
    sc = target / span;
  for (let i = 0; i < P.length; i += 3) {
    P[i] = (P[i] - cxg) * sc;
    P[i + 1] = (P[i + 1] - cyg) * sc;
    P[i + 2] = P[i + 2] * sc;
  }
  return {
    pos: new Float32Array(pos),
    nrm: new Float32Array(nrm),
    count: pos.length / 3,
  };
}

/* ---------- shaders ---------- */
const fsTri = `#version 300 es
out vec2 vUv; void main(){ vec2 p=vec2((gl_VertexID<<1)&2, gl_VertexID&2); vUv=p; gl_Position=vec4(p*2.0-1.0,0.0,1.0); }`;

const bgFrag = `#version 300 es
precision highp float; in vec2 vUv; out vec4 frag;
uniform float uTime; uniform vec2 uRes; uniform vec3 uA,uB,uC;
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
void main(){ vec2 uv=vUv;
  vec2 q=uv*1.6; float t=uTime*0.06;
  float n1=noise(q+vec2(t,-t*0.7)), n2=noise(q*1.7-vec2(t*0.5,t));
  float g=clamp(uv.x*0.6+uv.y*0.4+(n1-0.5)*0.9,0.0,1.0); float h=clamp((n2-0.2)*1.4,0.0,1.0);
  vec3 col=mix(uA,uB,smoothstep(0.0,1.0,g)); col=mix(col,uC,h*0.65);
  float bands=0.5+0.5*sin((uv.x*14.0+uv.y*9.0)+sin(uTime*0.3+n1*6.0)*1.5);
  col=mix(col,col*0.45+vec3(0.9,0.95,1.0)*0.25,bands*0.35);
  col+=(noise(q*4.5+vec2(-t,t*1.3))-0.5)*0.22;
  col+=0.05*pow(1.0-distance(uv,vec2(0.5)),2.0); frag=vec4(clamp(col,0.0,1.0),1.0); }`;

const gemVert = `#version 300 es
precision highp float; layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNrm;
uniform mat4 uProj,uView,uModel; uniform mat3 uNormal; out vec3 vN; out vec3 vViewPos; out vec3 vPos;
void main(){ vPos=aPos; vec4 wp=uModel*vec4(aPos,1.0); vec4 vp=uView*wp; vViewPos=vp.xyz; vN=normalize(uNormal*aNrm); gl_Position=uProj*vp; }`;

const gemFrag = `#version 300 es
precision highp float; in vec3 vN; in vec3 vViewPos; in vec3 vPos; out vec4 frag;
uniform sampler2D uBg; uniform vec2 uRes; uniform float uRefract; uniform float uDisp; uniform vec3 uTint; uniform float uFacet;
vec3 envSky(vec3 d){ float y=clamp(d.y*0.5+0.5,0.0,1.0); vec3 top=vec3(1.0),mid=vec3(0.55,0.6,0.75),bot=vec3(0.12,0.12,0.18);
  vec3 c=mix(bot,mid,smoothstep(0.0,0.5,y)); return mix(c,top,smoothstep(0.5,1.0,y)); }
vec2 hash2(vec2 p){ p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
vec2 voroCell(vec2 x){ vec2 n=floor(x),f=fract(x); float md=8.0; vec2 mid=n;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(float(i),float(j)); vec2 o=hash2(n+g); vec2 r=g+o-f; float d=dot(r,r); if(d<md){ md=d; mid=n+g; } }
  return mid; }
void main(){ vec3 N=normalize(vN); vec3 V=normalize(-vViewPos); float aspect=uRes.x/uRes.y;
  float frontish=smoothstep(0.55,0.9,abs(N.z));
  float fscale=mix(6.5,15.0,frontish);
  vec2 cell=voroCell(vPos.xy*fscale);
  vec2 h=hash2(cell+0.5);
  vec3 facetN=normalize(vec3(h*2.0-1.0, 0.55+hash2(cell+9.1).x*0.5));
  N=normalize(mix(N, facetN, uFacet));
  vec2 uv=gl_FragCoord.xy/uRes; vec2 off=N.xy*uRefract; off.x/=aspect;
  float d=uRefract*uDisp; vec2 dd=N.xy*d; dd.x/=aspect;
  float r=texture(uBg,uv+off+dd).r, g=texture(uBg,uv+off).g, b=texture(uBg,uv+off-dd).b;
  vec3 refr=vec3(r,g,b)*uTint;
  vec3 Rr=reflect(-V,N); vec3 refl=envSky(Rr); float fres=pow(1.0-clamp(dot(N,V),0.0,1.0),3.0);
  vec3 col=mix(refr,refl,0.10+0.5*fres); col*=0.82+0.18*abs(N.z);
  float s1=pow(max(dot(Rr,normalize(vec3(0.4,0.7,0.6))),0.0),60.0);
  float s2=pow(max(dot(Rr,normalize(vec3(-0.5,0.3,0.8))),0.0),90.0);
  col+=vec3(s1*0.9+s2*0.7); col+=fres*0.25; frag=vec4(col,1.0); }`;

const maskFrag = `#version 300 es
precision highp float; out vec4 frag; void main(){ frag=vec4(1.0); }`;

// Locked defaults (CWS-GEMSTONE-CW-HERO.md). Brand gradient white -> #8054bc -> #e5d2f4.
const LOCKED = {
  refract: 0.32,
  disp: 0.9,
  depth: 0.13,
  spin: 0.35,
  facet: 0.16,
  tint: [1, 1, 1] as [number, number, number],
  bgA: [1, 1, 1] as [number, number, number],
  bgB: [0.502, 0.329, 0.737] as [number, number, number], // #8054bc
  bgC: [0.898, 0.824, 0.957] as [number, number, number], // #e5d2f4
};
const MAXTILT = 0.55,
  FEATHER = 30,
  MASKSCALE = 0.5;

export function GemstoneCW() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftRef = useRef<HTMLAnchorElement>(null);
  const rightRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const hsL = leftRef.current;
    const hsR = rightRef.current;
    if (!host || !canvas || !hsL || !hsR) return;

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

    const bgProg = program(fsTri, bgFrag),
      gemProg = program(gemVert, gemFrag),
      maskProg = program(gemVert, maskFrag);
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
      const w = Math.round(host.clientWidth * DPR),
        h = Math.round(host.clientHeight * DPR);
      if (w < 1 || h < 1) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      resizeFbo(w, h);
      resizeMask(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // place each puff on the mark's outer edge (C left, W right) -- half on, half off.
    let hsState = false;
    const placeHotspots = () => {
      const aspect = host.clientWidth / Math.max(1, host.clientHeight);
      const f = 1 / Math.tan((35 * Math.PI) / 180 / 2);
      const sx = (xw: number) => (((f / aspect) * xw) / 4.2) * 0.5 + 0.5;
      hsL.style.left = (sx(-1.25) * 100).toFixed(2) + "%";
      hsR.style.left = (sx(1.25) * 100).toFixed(2) + "%";
    };
    placeHotspots();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let t0 = 0,
      prevTs = 0;
    let lastW = 0;

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
      if (w !== lastW) {
        lastW = w;
        placeHotspots();
      }

      // engagement: over letters (mask, last frame) OR over a shown puff.
      let overPuff = false;
      if (cursorInside && hsState) {
        const el = document.elementFromPoint(
          cursorX + canvas.getBoundingClientRect().left,
          cursorY + canvas.getBoundingClientRect().top
        );
        overPuff = !!(el && el.closest && el.closest(".cw-gem__hotspot"));
      }
      const wasEngaged = engaged;
      engaged = (cursorInside && overLetters) || overPuff;
      if (engaged && !wasEngaged) rotY = wrap(rotY);
      if (engaged) {
        mx = (cursorX / Math.max(1, host.clientWidth)) * 2 - 1;
        my = (cursorY / Math.max(1, host.clientHeight)) * 2 - 1;
        const k = Math.min(1, dt * 7);
        rotY += (mx * MAXTILT - rotY) * k;
        rotX += (my * MAXTILT - rotX) * k;
      } else {
        rotY += state.spin * dt * 0.9;
        rotX += (0 - rotX) * Math.min(1, dt * 4);
      }
      if (engaged !== hsState) {
        hsState = engaged;
        hsL.classList.toggle("is-shown", engaged);
        hsR.classList.toggle("is-shown", engaged);
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

        {/* The two puffs are real, crawlable links to the lane hubs. */}
        <a
          className="cw-gem__hotspot cw-gem__hotspot--left"
          href="/websites/"
          ref={leftRef}
          data-opt="websites"
        >
          <span className="cw-gem__puff" aria-hidden="true" />
          <span className="cw-gem__puff cw-gem__puff--alt" aria-hidden="true" />
          <span className="cw-gem__lbl">websites</span>
        </a>
        <a
          className="cw-gem__hotspot cw-gem__hotspot--right"
          href="/visibility/"
          ref={rightRef}
          data-opt="visibility"
        >
          <span className="cw-gem__puff" aria-hidden="true" />
          <span className="cw-gem__puff cw-gem__puff--alt" aria-hidden="true" />
          <span className="cw-gem__lbl">visibility</span>
        </a>
      </div>
    </section>
  );
}

export default GemstoneCW;
