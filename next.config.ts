import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root (a parent package-lock.json otherwise confuses Turbopack).
  turbopack: { root: path.join(__dirname) },
  // Dev over the LAN (phone testing): without this, Next 16's dev-origin
  // protection rejects the HMR websocket from non-localhost origins and the
  // dev client silently never hydrates (whole page's client JS stays dead).
  allowedDevOrigins: ["192.168.1.153"],
  // 100% static: no server, no API routes, no DB. Outputs to ./out
  output: "export",
  // Static export cannot use the Next image optimizer; serve images as-is.
  images: { unoptimized: true },
  // Emit /about/index.html so static hosts serve clean trailing-slash URLs.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
