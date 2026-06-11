import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root (a parent package-lock.json otherwise confuses Turbopack).
  turbopack: { root: path.join(__dirname) },
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
