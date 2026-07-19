// Build the essays placeholder: the CW gemstone mark over a static fbm cloud
// field, as a single self-contained SVG (the mark is embedded base64 so the
// file works when loaded through <img>, where external refs are blocked).
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
const mark = fs.readFileSync(path.join(root, "public", "cw-gemstone-mark.png")).toString("base64");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="chadworks CW gemstone on lavender and white clouds">
  <title>chadworks CW gemstone on lavender and white clouds</title>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="#f4f1fb"/>
      <stop offset="0.55" stop-color="#e8e3f8"/>
      <stop offset="1" stop-color="#d8d3f2"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.46" r="0.62">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="fbm" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.011" numOctaves="5" seed="17" result="noise"/>
      <feColorMatrix in="noise" type="matrix" result="soft"
        values="0 0 0 0 0.55
                0 0 0 0 0.47
                0 0 0 0 0.86
                0 0 0 0.62 0"/>
      <feGaussianBlur in="soft" stdDeviation="12"/>
    </filter>
    <filter id="fbm2" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0075 0.0038" numOctaves="4" seed="41" result="noise"/>
      <feColorMatrix in="noise" type="matrix" result="soft"
        values="0 0 0 0 0.42
                0 0 0 0 0.55
                0 0 0 0 0.92
                0 0 0 0.4 0"/>
      <feGaussianBlur in="soft" stdDeviation="22"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#sky)"/>
  <rect width="1200" height="630" filter="url(#fbm2)"/>
  <rect width="1200" height="630" filter="url(#fbm)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <image href="data:image/png;base64,${mark}" x="330" y="180" width="540" height="324" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;

const out = path.join(root, "public", "essays", "placeholder.svg");
fs.writeFileSync(out, svg, "utf8");
console.log(`wrote ${out} (${(svg.length / 1024).toFixed(0)} KB)`);
