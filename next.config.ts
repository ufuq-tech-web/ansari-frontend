import type { NextConfig } from "next";

// Same env var and fallback used everywhere else in the app for the backend
// API; stripped of the /api suffix since uploads are served from the API
// server's root, not under /api.
const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/api\/?$/, "");
const backendUrl = new URL(BACKEND_ORIGIN);

const nextConfig: NextConfig = {
  // Temporary: lets the cloudflared frontend tunnel reach the dev server —
  // Next blocks cross-origin dev requests by default. Remove when done
  // previewing.
  allowedDevOrigins: ["boom-hybrid-editors-trades.trycloudflare.com"],
  images: {
    // In local dev the backend origin is localhost/127.0.0.1, and Next's
    // image optimizer refuses to fetch anything that resolves to a private
    // IP regardless of remotePatterns (an SSRF guard) — so product images
    // would 400 in dev even though the host is allowlisted below. Skipping
    // optimization in dev sidesteps that; production still optimizes fully
    // since NEXT_PUBLIC_API_URL there points at a real public hostname.
    unoptimized: process.env.NODE_ENV === "development",
    // Explicit allowlist instead of a "**" wildcard — an open hostname match
    // turns the image optimizer into a proxy anyone can point at arbitrary
    // URLs. Backend host is derived from NEXT_PUBLIC_API_URL so it tracks
    // whatever origin serves product/upload images per environment; the
    // rest are stock-photo hosts used for seed/demo content.
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port || undefined,
      },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
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
