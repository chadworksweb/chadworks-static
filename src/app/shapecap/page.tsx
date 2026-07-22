// SHAPE-CAPTURE HARNESS (kept in the repo, never shipped).
//
// This route regenerates the worked-example object PNGs/WebPs for
// /website-design-cost-calculator/ (public/shapes/*.webp). It renders every
// example scope's object on a transparent background so a headless browser can
// crop + save it. See tools/shapecap/ for the capture script and how to run it.
//
// It is DEV-ONLY: in a production build (the static export that deploys to
// chadworks.co) this calls notFound(), so /shapecap never ships. It stays in
// git + local because we redo these shapes periodically.

import { notFound } from "next/navigation";
import ShapeCaptureClient from "./ShapeCaptureClient";

export default function ShapeCapturePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ShapeCaptureClient />;
}
