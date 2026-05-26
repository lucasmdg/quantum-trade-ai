import type { NextConfig } from "next";

const isActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isActions ? "/quantum-trade-ai" : "",
  assetPrefix: isActions ? "/quantum-trade-ai/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
