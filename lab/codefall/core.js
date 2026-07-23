// CodeFall core -- the animation, with no DOM and no framework.
//
// This is the lab copy of the algorithm currently living inside
// src/components/art/CodeFall.tsx. It is written to run ANYWHERE a
// CanvasRenderingContext2D exists, which includes a Web Worker holding an
// OffscreenCanvas. That portability is the entire point of the experiment: if
// the animation cannot be expressed without touching window or document, it
// cannot be moved off the main thread.
//
// Nothing here reads the DOM. The pointer position arrives as plain numbers, so
// the caller can feed it from a mousemove listener (main thread) or from a
// postMessage (worker). Same code either way.
//
// Kept deliberately faithful to the shipping component: same glyph set, same
// brand stops, same column ranges, same 30fps throttle, same dt cap, same orb
// spring constants. A lab that quietly simplifies the thing it is testing
// proves nothing.

(function (root) {
  var GLYPHS =
    "01<>/{}[]()=+-*;:&|!?$#@.abcdefghijklmnopqrstuvwxyz0123456789{}</>";

  var HEAD = [102, 41, 188]; // #6629bc vivid violet
  var TRAIL_NEAR = [36, 57, 137]; // #243989 deep indigo
  var TRAIL_FAR = [174, 185, 234]; // #aeb9ea periwinkle

  var ORB_R = 59; // cursor sphere radius, CSS px
  var SPRING = 26;
  var FRICTION = 7;
  var FRAME_MS = 1000 / 30;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }
  function pick() {
    return GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function CodeFall(ctx, fontFamily) {
    this.ctx = ctx;
    this.font = fontFamily || "monospace";
    this.columns = [];
    this.cssW = 0;
    this.cssH = 0;
    this.colW = 0;
    this.rowH = 0;
    this.rows = 0;
    this.fontPx = 0;
    this.last = 0;
    // Orb state. Lives here rather than in the caller so a worker and a page
    // driver stay interchangeable.
    this.mTargetX = -9999;
    this.mTargetY = -9999;
    this.orbX = -9999;
    this.orbY = -9999;
    this.orbVX = 0;
    this.orbVY = 0;
    this.orbStr = 0;
    this.orbTargetStr = 0;
  }

  CodeFall.prototype.newColumn = function (seedAbove) {
    var len = Math.round(rand(10, 26));
    var chars = [];
    for (var q = 0; q < len + this.rows + 2; q++) chars.push(pick());
    return {
      head: seedAbove ? rand(-this.rows * 1.1, this.rows * 0.7) : rand(-len, -1),
      speed: rand(5.5, 13),
      len: len,
      dim: rand(0.4, 1),
      chars: chars,
      lastRow: -9999,
    };
  };

  // Size the backing store and rebuild the column set. `canvas` is either an
  // HTMLCanvasElement or an OffscreenCanvas; both expose width/height.
  CodeFall.prototype.layout = function (canvas, cssW, cssH, dpr) {
    var ctx = this.ctx;
    this.cssW = cssW;
    this.cssH = cssH;
    this.fontPx = Math.max(13, Math.min(17, Math.round(cssW / 30)));
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    // Assigning width/height resets ALL context state, so transform and font
    // have to be re-applied after it, never before.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = this.fontPx + "px " + this.font;
    ctx.textBaseline = "top";
    this.colW = Math.max(8, Math.ceil(ctx.measureText("0").width) + 1);
    this.rowH = Math.round(this.fontPx * 1.18);
    this.rows = Math.ceil(cssH / this.rowH) + 2;
    var cols = Math.ceil(cssW / this.colW);
    this.columns = [];
    for (var i = 0; i < cols; i++) this.columns.push(this.newColumn(true));
  };

  CodeFall.prototype.blit = function (ch, px, py, scale) {
    var ctx = this.ctx;
    if (scale === 1) {
      ctx.fillText(ch, px, py);
      return;
    }
    var cx = px + this.colW * 0.45;
    var cy = py + this.fontPx * 0.5;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.fillText(ch, px - cx, py - cy);
    ctx.restore();
  };

  CodeFall.prototype.drawColumn = function (col, x) {
    var ctx = this.ctx;
    var headRow = Math.floor(col.head);
    for (var k = 0; k < col.len; k++) {
      var row = headRow - k;
      if (row < 0 || row > this.rows) continue;
      var ch = col.chars[row] || pick();
      var gx = x;
      var gy = row * this.rowH;
      var scale = 1;

      // Orb: glyphs wrap radially around an invisible sphere at the pointer,
      // and the ones over its near face protrude forward (modelled as scale).
      if (this.orbStr > 0.001) {
        var cx = gx + this.colW * 0.45;
        var cy = gy + this.fontPx * 0.5;
        var dx = cx - this.orbX;
        var dy = cy - this.orbY;
        var r = Math.sqrt(dx * dx + dy * dy);
        if (r < ORB_R) {
          var nr = r / ORB_R;
          var rp = ORB_R * Math.sin(nr * (Math.PI / 2));
          if (r > 0.0001) {
            var f = (rp - r) * this.orbStr;
            gx += (dx / r) * f;
            gy += (dy / r) * f;
          }
          var nrp = Math.min(1, rp / ORB_R);
          var z = Math.sqrt(Math.max(0, 1 - nrp * nrp));
          scale = 1 + Math.pow(z, 1.2) * 0.65 * this.orbStr;
        }
      }

      var t = k / col.len;
      if (k === 0) {
        ctx.shadowColor = "rgba(102, 41, 188, 0.55)";
        ctx.shadowBlur = 7;
        ctx.fillStyle =
          "rgba(" + HEAD[0] + ", " + HEAD[1] + ", " + HEAD[2] + ", " + 0.95 * col.dim + ")";
        this.blit(ch, gx, gy, scale);
        ctx.shadowBlur = 0;
      } else {
        var ct = Math.min(1, t * 1.3);
        var rr = lerp(TRAIL_NEAR[0], TRAIL_FAR[0], ct);
        var gg = lerp(TRAIL_NEAR[1], TRAIL_FAR[1], ct);
        var bb = lerp(TRAIL_NEAR[2], TRAIL_FAR[2], ct);
        var a = Math.pow(1 - t, 1.5) * 0.82 * col.dim;
        ctx.fillStyle = "rgba(" + (rr | 0) + ", " + (gg | 0) + ", " + (bb | 0) + ", " + a + ")";
        this.blit(ch, gx, gy, scale);
      }
    }
  };

  CodeFall.prototype.paint = function () {
    this.ctx.clearRect(0, 0, this.cssW, this.cssH);
    for (var i = 0; i < this.columns.length; i++) {
      this.drawColumn(this.columns[i], i * this.colW);
    }
  };

  // Advance and draw. Returns false when the frame was skipped by the throttle,
  // so a caller can count real draws.
  CodeFall.prototype.tick = function (now) {
    if (this.last && now - this.last < FRAME_MS) return false;
    var dt = this.last ? Math.min((now - this.last) / 1000, 0.066) : 0;
    this.last = now;

    if (this.orbStr < 0.01) {
      this.orbX = this.mTargetX;
      this.orbY = this.mTargetY;
      this.orbVX = 0;
      this.orbVY = 0;
    }
    this.orbVX += (this.mTargetX - this.orbX) * SPRING * dt;
    this.orbVY += (this.mTargetY - this.orbY) * SPRING * dt;
    var fric = Math.exp(-FRICTION * dt);
    this.orbVX *= fric;
    this.orbVY *= fric;
    this.orbX += this.orbVX * dt;
    this.orbY += this.orbVY * dt;
    this.orbStr += (this.orbTargetStr - this.orbStr) * Math.min(1, dt * 3.5);

    for (var i = 0; i < this.columns.length; i++) {
      var col = this.columns[i];
      col.head += col.speed * dt;
      var hr = Math.floor(col.head);
      if (hr !== col.lastRow) {
        col.lastRow = hr;
        if (hr >= 0 && hr < col.chars.length) col.chars[hr] = pick();
        if (Math.random() < 0.5) {
          col.chars[(Math.random() * col.chars.length) | 0] = pick();
        }
      }
      if (hr - col.len > this.rows) this.columns[i] = this.newColumn(false);
    }
    this.paint();
    return true;
  };

  CodeFall.prototype.setPointer = function (x, y, inside) {
    this.mTargetX = x;
    this.mTargetY = y;
    this.orbTargetStr = inside ? 1 : 0;
  };

  root.CodeFallCore = { CodeFall: CodeFall, GLYPHS: GLYPHS, FRAME_MS: FRAME_MS };
})(typeof self !== "undefined" ? self : this);
