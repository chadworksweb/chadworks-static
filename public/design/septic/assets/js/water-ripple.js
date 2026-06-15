/*
 * Water ripple cursor effect for portfolio cards.
 * Vanilla JS port of chadlewine.com Discoradient water sim.
 * WebGL2 wave-equation simulation with image displacement + cyan glow.
 *
 * Usage: each card root must have [data-water-ripple] and contain
 *   <img class="industry_browser_img"> + <canvas class="industry_browser_water">.
 */
(() => {
  'use strict';

  if (typeof window === 'undefined') return;

  const SIM_RES = 256;
  const DAMPING = 0.992;
  const DISPLACEMENT = 0.045;
  const DROP_RADIUS = 0.03;
  const DROP_ASPECT_Y = 1.8;
  const DROP_STRENGTH = 0.22;
  const GLOW_DAMPING = 0.07;
  const DROP_GAP_PX = 10;

  const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

  const FRAG_STEP = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
uniform sampler2D u_state;
uniform vec2 u_texel;
uniform float u_damping;
out vec4 outColor;
void main() {
  vec4 c = texture(u_state, v_uv);
  float curr = c.r;
  float prev = c.g;
  float l = texture(u_state, v_uv - vec2(u_texel.x, 0.0)).r;
  float r = texture(u_state, v_uv + vec2(u_texel.x, 0.0)).r;
  float u = texture(u_state, v_uv - vec2(0.0, u_texel.y)).r;
  float d = texture(u_state, v_uv + vec2(0.0, u_texel.y)).r;
  float next = ((l + r + u + d) * 0.5 - prev) * u_damping;
  next = clamp(next, -2.0, 2.0);
  outColor = vec4(next, curr, 0.0, 1.0);
}`;

  const FRAG_DROP = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
uniform sampler2D u_state;
uniform vec2 u_dropPos;
uniform float u_dropRadius;
uniform float u_dropAspectY;
uniform float u_dropStrength;
out vec4 outColor;
void main() {
  vec4 c = texture(u_state, v_uv);
  vec2 delta = v_uv - u_dropPos;
  delta.y *= u_dropAspectY;
  float d = length(delta);
  float energy = u_dropStrength * smoothstep(u_dropRadius, 0.0, d);
  outColor = vec4(c.r + energy, c.g, 0.0, 1.0);
}`;

  const FRAG_RENDER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
uniform sampler2D u_state;
uniform sampler2D u_source;
uniform vec4 u_crop;
uniform vec2 u_texel;
uniform float u_disp;
out vec4 outColor;
void main() {
  float l = texture(u_state, v_uv - vec2(u_texel.x, 0.0)).r;
  float r = texture(u_state, v_uv + vec2(u_texel.x, 0.0)).r;
  float u = texture(u_state, v_uv - vec2(0.0, u_texel.y)).r;
  float d = texture(u_state, v_uv + vec2(0.0, u_texel.y)).r;
  vec2 grad = clamp(vec2(l - r, u - d) * u_disp, vec2(-0.05), vec2(0.05));
  vec2 outUV = clamp(v_uv + grad, 0.0, 1.0);
  vec2 sourceUV = u_crop.xy + outUV * u_crop.zw;
  vec3 col = texture(u_source, sourceUV).rgb;
  float amp = clamp(abs((l + r + u + d) * 0.25), 0.0, 0.8);
  col += vec3(0.20, 0.55, 0.70) * amp * 0.6;
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh) || '(no log)';
      gl.deleteShader(sh);
      throw new Error('Shader compile failed: ' + log);
    }
    return sh;
  }

  function link(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'a_pos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error('Program link failed: ' + log);
    }
    return p;
  }

  function makeFloatTex(gl, w, h) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    const zeros = new Uint16Array(w * h * 2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, w, h, 0, gl.RG, gl.HALF_FLOAT, zeros);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  class WaterRipple {
    constructor(canvas, imageSrc, fitMode) {
      this.canvas = canvas;
      this.imageSrc = imageSrc;
      this.fitMode = fitMode || 'cover';
      this.gl = null;
      this.initialized = false;
      this.destroyed = false;
      this.running = false;
      this.raf = 0;
      this.drops = [];
      this.pingPongFlip = false;
      this.imgReady = false;
      this.imgAR = 1;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    }

    ensureInit() {
      if (this.initialized) return true;
      if (this.destroyed) return false;

      this.syncCanvasSize();

      const gl = this.canvas.getContext('webgl2', {
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
      });
      if (!gl) return false;
      this.gl = gl;
      gl.getExtension('EXT_color_buffer_float');
      gl.getExtension('OES_texture_float_linear');

      try {
        const vs = compile(gl, gl.VERTEX_SHADER, VERT);
        this.stepProg = link(gl, vs, compile(gl, gl.FRAGMENT_SHADER, FRAG_STEP));
        this.dropProg = link(gl, vs, compile(gl, gl.FRAGMENT_SHADER, FRAG_DROP));
        this.renderProg = link(gl, vs, compile(gl, gl.FRAGMENT_SHADER, FRAG_RENDER));
      } catch (e) {
        console.error('WaterRipple: shader init failed', e);
        return false;
      }

      this.quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      this.uStepState = gl.getUniformLocation(this.stepProg, 'u_state');
      this.uStepTexel = gl.getUniformLocation(this.stepProg, 'u_texel');
      this.uStepDamp = gl.getUniformLocation(this.stepProg, 'u_damping');
      this.uDropState = gl.getUniformLocation(this.dropProg, 'u_state');
      this.uDropPos = gl.getUniformLocation(this.dropProg, 'u_dropPos');
      this.uDropRadius = gl.getUniformLocation(this.dropProg, 'u_dropRadius');
      this.uDropAspectY = gl.getUniformLocation(this.dropProg, 'u_dropAspectY');
      this.uDropStrength = gl.getUniformLocation(this.dropProg, 'u_dropStrength');
      this.uRenderState = gl.getUniformLocation(this.renderProg, 'u_state');
      this.uRenderSource = gl.getUniformLocation(this.renderProg, 'u_source');
      this.uRenderCrop = gl.getUniformLocation(this.renderProg, 'u_crop');
      this.uRenderTexel = gl.getUniformLocation(this.renderProg, 'u_texel');
      this.uRenderDisp = gl.getUniformLocation(this.renderProg, 'u_disp');

      this.texA = makeFloatTex(gl, SIM_RES, SIM_RES);
      this.texB = makeFloatTex(gl, SIM_RES, SIM_RES);
      this.fboA = gl.createFramebuffer();
      this.fboB = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboA);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texA, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboB);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texB, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      this.sourceTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.sourceTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]),
      );

      this.loadImage();
      this.initialized = true;
      return true;
    }

    loadImage() {
      if (!this.imageSrc) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (this.destroyed || !this.gl || !this.sourceTex) return;
        try {
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.sourceTex);
          this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
          this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA8,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE, img,
          );
          this.imgAR = img.naturalWidth / img.naturalHeight;
          this.imgReady = true;
        } catch (e) {
          console.warn('WaterRipple: texImage2D failed', e);
        }
      };
      img.onerror = () => {};
      img.src = this.imageSrc;
    }

    syncCanvasSize() {
      const w = Math.max(1, Math.floor(this.canvas.clientWidth * this.dpr));
      const h = Math.max(1, Math.floor(this.canvas.clientHeight * this.dpr));
      if (this.canvas.width !== w) this.canvas.width = w;
      if (this.canvas.height !== h) this.canvas.height = h;
    }

    drop(xPct, yPct, strength) {
      this.drops.push({
        x: Math.max(0, Math.min(1, xPct / 100)),
        y: Math.max(0, Math.min(1, 1 - yPct / 100)),
        strength: strength != null ? strength : DROP_STRENGTH,
      });
    }

    start() {
      if (!this.ensureInit()) return;
      if (this.running) return;
      this.running = true;
      this.raf = requestAnimationFrame(this.tick);
    }

    reset() {
      const gl = this.gl;
      if (!gl || !this.texA || !this.texB) return;
      const zeros = new Uint16Array(SIM_RES * SIM_RES * 2);
      gl.bindTexture(gl.TEXTURE_2D, this.texA);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, SIM_RES, SIM_RES, gl.RG, gl.HALF_FLOAT, zeros);
      gl.bindTexture(gl.TEXTURE_2D, this.texB);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, SIM_RES, SIM_RES, gl.RG, gl.HALF_FLOAT, zeros);
      this.pingPongFlip = false;
      this.drops.length = 0;
    }

    stop() {
      this.running = false;
      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    }

    setupQuad() {
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    }

    tick = () => {
      if (!this.running || this.destroyed) return;
      const gl = this.gl;
      if (!gl) return;

      this.syncCanvasSize();

      let read = this.pingPongFlip ? { tex: this.texB, fbo: this.fboB } : { tex: this.texA, fbo: this.fboA };
      let write = this.pingPongFlip ? { tex: this.texA, fbo: this.fboA } : { tex: this.texB, fbo: this.fboB };

      // 1. Apply queued drops.
      if (this.drops.length > 0) {
        gl.useProgram(this.dropProg);
        this.setupQuad();
        gl.viewport(0, 0, SIM_RES, SIM_RES);
        gl.uniform1i(this.uDropState, 0);
        gl.uniform1f(this.uDropRadius, DROP_RADIUS);
        gl.uniform1f(this.uDropAspectY, DROP_ASPECT_Y);
        for (const d of this.drops) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, read.tex);
          gl.uniform2f(this.uDropPos, d.x, d.y);
          gl.uniform1f(this.uDropStrength, d.strength);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          const swap = read; read = write; write = swap;
        }
        this.drops.length = 0;
      }

      // 2. One simulation step.
      gl.useProgram(this.stepProg);
      this.setupQuad();
      gl.viewport(0, 0, SIM_RES, SIM_RES);
      gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read.tex);
      gl.uniform1i(this.uStepState, 0);
      gl.uniform2f(this.uStepTexel, 1 / SIM_RES, 1 / SIM_RES);
      gl.uniform1f(this.uStepDamp, DAMPING);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const swap = read; read = write; write = swap;
      this.pingPongFlip = read.tex === this.texB;

      // 3. Render to canvas.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      if (this.imgReady) {
        gl.useProgram(this.renderProg);
        this.setupQuad();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, read.tex);
        gl.uniform1i(this.uRenderState, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sourceTex);
        gl.uniform1i(this.uRenderSource, 1);
        // Match the static <img>: object-fit: cover (default), object-position: top center.
        // For taller-than-canvas images, keep the top and crop the bottom; for
        // wider-than-canvas images, center-crop the sides.
        // When fitMode === 'fill', sample the full texture (no crop) so the hover
        // matches an object-fit: fill static image.
        let cropX = 0, cropY = 0, cropW = 1, cropH = 1;
        if (this.fitMode !== 'fill') {
          const canvasAR = this.canvas.clientWidth / Math.max(1, this.canvas.clientHeight);
          if (this.imgAR > canvasAR) {
            cropW = canvasAR / this.imgAR;
            cropX = (1 - cropW) * 0.5;
          } else if (this.imgAR < canvasAR) {
            cropH = this.imgAR / canvasAR;
            cropY = 1 - cropH;
          }
        }
        gl.uniform4f(this.uRenderCrop, cropX, cropY, cropW, cropH);
        gl.uniform2f(this.uRenderTexel, 1 / SIM_RES, 1 / SIM_RES);
        gl.uniform1f(this.uRenderDisp, DISPLACEMENT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } else {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      this.raf = requestAnimationFrame(this.tick);
    };

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      this.stop();
      const gl = this.gl;
      if (!gl) return;
      if (this.texA) gl.deleteTexture(this.texA);
      if (this.texB) gl.deleteTexture(this.texB);
      if (this.sourceTex) gl.deleteTexture(this.sourceTex);
      if (this.fboA) gl.deleteFramebuffer(this.fboA);
      if (this.fboB) gl.deleteFramebuffer(this.fboB);
      if (this.quad) gl.deleteBuffer(this.quad);
      if (this.stepProg) gl.deleteProgram(this.stepProg);
      if (this.dropProg) gl.deleteProgram(this.dropProg);
      if (this.renderProg) gl.deleteProgram(this.renderProg);
    }
  }

  function attach(card) {
    const img = card.querySelector('.industry_browser_img');
    const canvas = card.querySelector('.industry_browser_water');
    if (!img || !canvas) return;

    const src = img.currentSrc || img.src;
    // Mirror whatever object-fit the static <img> uses so the hover stays consistent.
    // Inline style wins; fall back to computed style; default to 'cover' (CSS default for this class).
    const fitMode = (img.style && img.style.objectFit) || (window.getComputedStyle(img).objectFit) || 'cover';
    let ripple = null;

    const glowTarget = { x: 0, y: 0, set: false };
    const glowCurrent = { x: 0, y: 0, set: false };
    const lastDropAt = { x: 0, y: 0, set: false };
    let glowRaf = 0;

    function tickGlow() {
      if (!glowTarget.set) { glowRaf = 0; return; }
      const nx = glowCurrent.x + (glowTarget.x - glowCurrent.x) * GLOW_DAMPING;
      const ny = glowCurrent.y + (glowTarget.y - glowCurrent.y) * GLOW_DAMPING;
      glowCurrent.x = nx; glowCurrent.y = ny; glowCurrent.set = true;

      if (!lastDropAt.set) {
        lastDropAt.x = nx; lastDropAt.y = ny; lastDropAt.set = true;
      } else {
        const dx = nx - lastDropAt.x;
        const dy = ny - lastDropAt.y;
        if (Math.hypot(dx, dy) > DROP_GAP_PX) {
          const rect = canvas.getBoundingClientRect();
          if (rect.width > 4 && rect.height > 4) {
            const fx = ((nx - rect.left) / rect.width) * 100;
            const fy = ((ny - rect.top) / rect.height) * 100;
            if (fx >= 0 && fx <= 100 && fy >= 0 && fy <= 100 && ripple) {
              ripple.drop(fx, fy);
            }
          }
          lastDropAt.x = nx; lastDropAt.y = ny;
        }
      }

      if (Math.abs(glowTarget.x - nx) > 0.3 || Math.abs(glowTarget.y - ny) > 0.3) {
        glowRaf = requestAnimationFrame(tickGlow);
      } else {
        glowRaf = 0;
      }
    }

    function onEnter(e) {
      if (e.pointerType !== 'mouse') return;
      if (!ripple) ripple = new WaterRipple(canvas, src, fitMode);
      card.classList.add('is-rippling');
      ripple.start();
      ripple.reset();
    }

    function onMove(e) {
      if (!ripple) return;
      glowTarget.x = e.clientX; glowTarget.y = e.clientY; glowTarget.set = true;
      if (!glowCurrent.set) { glowCurrent.x = e.clientX; glowCurrent.y = e.clientY; glowCurrent.set = true; }
      if (!glowRaf) glowRaf = requestAnimationFrame(tickGlow);
    }

    function onLeave() {
      card.classList.remove('is-rippling');
      if (glowRaf) { cancelAnimationFrame(glowRaf); glowRaf = 0; }
      glowTarget.set = false;
      glowCurrent.set = false;
      lastDropAt.set = false;
      // Let the sim ease out for ~1s, then stop the rAF.
      setTimeout(() => { if (ripple && !card.matches(':hover')) ripple.stop(); }, 900);
    }

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('pointercancel', onLeave);
  }

  function init() {
    if (!('WebGL2RenderingContext' in window)) return;
    const cards = document.querySelectorAll('[data-water-ripple]');
    cards.forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
