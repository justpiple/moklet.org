/** @type {import('next').NextConfig} */

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedForwardedHosts: ["go.moklet.org"],
      allowedOrigins: ["go.moklet.org"],
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
