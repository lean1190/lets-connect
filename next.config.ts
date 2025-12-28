import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [],
    qualities: [25, 50, 75, 100]
  }
};

export default nextConfig;
