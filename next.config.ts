import type { NextConfig } from "next";

// Same env var and fallback used everywhere else in the app for the backend
// API; stripped of the /api suffix since uploads are served from the API
// server's root, not under /api.
const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/api\/?$/, "");

const nextConfig: NextConfig = {
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
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_ORIGIN}/uploads/:path*`, // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
