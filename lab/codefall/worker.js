// CodeFall worker -- runs the animation on its own thread.
//
// It owns an OffscreenCanvas transferred from the page. Once transferred, the
// page can no longer draw to that canvas at all, which is the guarantee we
// want: the art becomes structurally immune to whatever the main thread is
// doing, including parsing a megabyte of application JavaScript.
//
// requestAnimationFrame exists inside a worker (it is tied to the compositor,
// not the document), so the loop is the same shape as the page version.
//
// Messages in:
//   init    {canvas, cssW, cssH, dpr, font}   canvas is a transferred OffscreenCanvas
//   resize  {cssW, cssH, dpr}
//   pointer {x, y, inside}                    canvas-local CSS px
//   paused  {value}
// Messages out:
//   stats   {frames, maxGap}                  longest gap between drawn frames

importScripts("./core.js");

var fall = null;
var canvas = null;
var paused = false;
var frames = 0;
var maxGap = 0;
var lastDraw = 0;

function loop(now) {
  requestAnimationFrame(loop);
  if (!fall || paused) return;
  if (fall.tick(now)) {
    if (lastDraw) {
      var gap = now - lastDraw;
      if (gap > maxGap) maxGap = gap;
    }
    lastDraw = now;
    frames++;
    // Report occasionally. Posting every frame would be its own overhead and
    // would put work back on the main thread, which is the thing under test.
    if (frames % 30 === 0) {
      postMessage({ type: "stats", frames: frames, maxGap: Math.round(maxGap) });
    }
  }
}

self.onmessage = function (e) {
  var d = e.data;
  if (d.type === "init") {
    canvas = d.canvas;
    var ctx = canvas.getContext("2d");
    fall = new self.CodeFallCore.CodeFall(ctx, d.font);
    fall.layout(canvas, d.cssW, d.cssH, d.dpr);
    fall.paint(); // first frame immediately, before the loop's first tick
    requestAnimationFrame(loop);
  } else if (d.type === "resize" && fall) {
    fall.layout(canvas, d.cssW, d.cssH, d.dpr);
    fall.paint();
  } else if (d.type === "pointer" && fall) {
    fall.setPointer(d.x, d.y, d.inside);
  } else if (d.type === "paused") {
    paused = d.value;
  } else if (d.type === "reset") {
    frames = 0;
    maxGap = 0;
    lastDraw = 0;
  }
};
