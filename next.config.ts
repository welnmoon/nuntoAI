// Next.js + Fumadocs MDX config
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX({
  // configPath: "source.config.ts", // default matches our file at project root
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["md", "mdx", "ts", "tsx", "js", "jsx"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.simpleicons.org" }],
  },
};

export default withMDX(nextConfig);
