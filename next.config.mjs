/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  webpack: (config, { dev }) => {
    if (dev) {
      // Use in-memory webpack caching in dev to avoid Windows pack file cache corruption.
      config.cache = { type: "memory" };
    }

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
