// next.config.mjs
import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX({ /* configPath по умолчанию: source.config.ts */ });

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

export default withMDX(config);
