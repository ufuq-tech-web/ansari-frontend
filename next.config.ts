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
  async redirects() {
    return [
      {
        source: "/men/formal-shoes",
        destination: "/mens-shoes/formal-shoes-for-men",
        permanent: true,
      },
      {
        source: "/men/casual-shoes",
        destination: "/mens-shoes/casual-shoes-for-men",
        permanent: true,
      },
      {
        source: "/men/sneakers",
        destination: "/mens-shoes/sneakers-for-men",
        permanent: true,
      },
      {
        source: "/men/sports-shoes",
        destination: "/mens-shoes/sports-shoes-for-men",
        permanent: true,
      },
      {
        source: "/men/sandals",
        destination: "/mens-shoes/mens-sandals",
        permanent: true,
      },
      {
        source: "/mens-shoes/sandals",
        destination: "/mens-shoes/mens-sandals",
        permanent: true,
      },
      {
        source: "/men/slippers-flip-flops",
        destination: "/mens-shoes/slippers-flip-flops-for-men",
        permanent: true,
      },
      {
        source: "/mens-shoes/slippers-flip-flops",
        destination: "/mens-shoes/slippers-flip-flops-for-men",
        permanent: true,
      },
      {
        source: "/men/loafers",
        destination: "/mens-shoes/loafers-for-men",
        permanent: true,
      },
      {
        source: "/mens-shoes/loafers",
        destination: "/mens-shoes/loafers-for-men",
        permanent: true,
      },
      {
        source: "/men/boots",
        destination: "/mens-shoes/mens-boots",
        permanent: true,
      },
      {
        source: "/mens-shoes/boots",
        destination: "/mens-shoes/mens-boots",
        permanent: true,
      },
      {
        source: "/men",
        destination: "/mens-shoes",
        permanent: true,
      },
      {
        source: "/women/flats",
        destination: "/womens-shoes/womens-flats",
        permanent: true,
      },
      {
        source: "/womens-shoes/flats",
        destination: "/womens-shoes/womens-flats",
        permanent: true,
      },
      {
        source: "/women",
        destination: "/womens-shoes",
        permanent: true,
      },
      {
        source: "/women/mojari-shoes",
        destination: "/womens-shoes/mojari-shoes-for-women",
        permanent: true,
      },
      {
        source: "/womens-shoes/mojari-shoes",
        destination: "/womens-shoes/mojari-shoes-for-women",
        permanent: true,
      },
      {
        source: "/women/sandals",
        destination: "/womens-shoes/sandals-for-women",
        permanent: true,
      },
      {
        source: "/womens-shoes/sandals",
        destination: "/womens-shoes/sandals-for-women",
        permanent: true,
      },
      {
        source: "/women/slippers",
        destination: "/womens-shoes/slippers-for-women",
        permanent: true,
      },
      {
        source: "/womens-shoes/slippers",
        destination: "/womens-shoes/slippers-for-women",
        permanent: true,
      },
      {
        source: "/women/kolhapuri-chappal",
        destination: "/womens-shoes/kolhapuri-chappal-for-women",
        permanent: true,
      },
      {
        source: "/womens-shoes/kolhapuri-chappal",
        destination: "/womens-shoes/kolhapuri-chappal-for-women",
        permanent: true,
      },
      {
        source: "/kids/boys",
        destination: "/kids-shoes/boys-shoes",
        permanent: true,
      },
      {
        source: "/kids-shoes/boys",
        destination: "/kids-shoes/boys-shoes",
        permanent: true,
      },
      {
        source: "/kids",
        destination: "/kids-shoes",
        permanent: true,
      },
      {
        source: "/kids/girls",
        destination: "/kids-shoes/girls-shoes",
        permanent: true,
      },
      {
        source: "/kids-shoes/girls",
        destination: "/kids-shoes/girls-shoes",
        permanent: true,
      },
      {
        source: "/kids/new-born-baby",
        destination: "/kids-shoes/baby-shoes",
        permanent: true,
      },
      {
        source: "/kids-shoes/new-born-baby",
        destination: "/kids-shoes/baby-shoes",
        permanent: true,
      },
      {
        source: "/kids/toddler-2-5-years",
        destination: "/kids-shoes/toddler-shoes",
        permanent: true,
      },
      {
        source: "/kids-shoes/toddler-2-5-years",
        destination: "/kids-shoes/toddler-shoes",
        permanent: true,
      },
      {
        source: "/kids/big-kids-shoes-10-14-years",
        destination: "/kids-shoes/junior-shoes",
        permanent: true,
      },
      {
        source: "/kids-shoes/big-kids-shoes-10-14-years",
        destination: "/kids-shoes/junior-shoes",
        permanent: true,
      },
      {
        source: "/kids/school-shoes",
        destination: "/kids-shoes/school-shoes",
        permanent: true,
      },
      {
        source: "/kids/casual-shoes",
        destination: "/kids-shoes/kids-casual-shoes",
        permanent: true,
      },
      {
        source: "/kids-shoes/casual-shoes",
        destination: "/kids-shoes/kids-casual-shoes",
        permanent: true,
      },
      {
        source: "/kids/sneakers",
        destination: "/kids-shoes/kids-sneakers",
        permanent: true,
      },
      {
        source: "/kids-shoes/sneakers",
        destination: "/kids-shoes/kids-sneakers",
        permanent: true,
      },
      {
        source: "/kids/sandals",
        destination: "/kids-shoes/kids-sandals",
        permanent: true,
      },
      {
        source: "/kids-shoes/sandals",
        destination: "/kids-shoes/kids-sandals",
        permanent: true,
      },
      {
        source: "/kids/slippers",
        destination: "/kids-shoes/kids-slippers",
        permanent: true,
      },
      {
        source: "/kids-shoes/slippers",
        destination: "/kids-shoes/kids-slippers",
        permanent: true,
      },
      {
        source: "/accessories/socks",
        destination: "/accessories/shoe-accessories/socks",
        permanent: true,
      },
      {
        source: "/accessories/shoe-care-products",
        destination: "/accessories/shoe-accessories/shoes-care-products",
        permanent: true,
      },
      {
        source: "/accessories/shoes-care-products",
        destination: "/accessories/shoe-accessories/shoes-care-products",
        permanent: true,
      },
      {
        source: "/accessories/shoes-polish",
        destination: "/accessories/shoe-accessories/shoe-polish",
        permanent: true,
      },
      {
        source: "/accessories/shoe-polish",
        destination: "/accessories/shoe-accessories/shoe-polish",
        permanent: true,
      },
      {
        source: "/accessories/shoes-brush",
        destination: "/accessories/shoe-accessories/shoe-brush",
        permanent: true,
      },
      {
        source: "/accessories/shoe-brush",
        destination: "/accessories/shoe-accessories/shoe-brush",
        permanent: true,
      },
      {
        source: "/trending",
        destination: "/shoes-collection/trending-shoes",
        permanent: true,
      },
      {
        source: "/best-sellers",
        destination: "/shoes-collection/best-selling-shoes",
        permanent: true,
      },
      {
        source: "/journal",
        destination: "/footwears-journal",
        permanent: true,
      },
      {
        source: "/journal/:path*",
        destination: "/footwears-journal/:path*",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/shoes-shop-in-india",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/shoes-shop-contact-numbers",
        permanent: true,
      },
      {
        source: "/shipping-policy",
        destination: "/shipping-information",
        permanent: true,
      },
      {
        source: "/return-exchange",
        destination: "/returns-exchanges",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/faqs",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms-conditions",
        permanent: true,
      },
      {
        source: "/track-order",
        destination: "/order-tracking",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_ORIGIN}/uploads/:path*`, // Proxy to backend
      },
      {
        source: "/returns-exchanges",
        destination: "/return-exchange",
      },
      {
        source: "/faqs",
        destination: "/faq",
      },
      {
        source: "/terms-conditions",
        destination: "/terms-and-conditions",
      },
      {
        source: "/order-tracking",
        destination: "/track-order",
      },
      {
        source: "/shoes-shop-in-india",
        destination: "/about-us",
      },
      {
        source: "/shoes-shop-contact-numbers",
        destination: "/contact-us",
      },
      {
        source: "/shipping-information",
        destination: "/shipping-policy",
      },
      {
        source: "/shoes-collection/trending-shoes",
        destination: "/trending",
      },
      {
        source: "/shoes-collection/best-selling-shoes",
        destination: "/best-sellers",
      },
      {
        source: "/footwears-journal",
        destination: "/journal",
      },
      {
        source: "/footwears-journal/:path*",
        destination: "/journal/:path*",
      },
      {
        source: "/mens-shoes/formal-shoes-for-men",
        destination: "/men/formal-shoes",
      },
      {
        source: "/mens-shoes/casual-shoes-for-men",
        destination: "/men/casual-shoes",
      },
      {
        source: "/mens-shoes/sneakers-for-men",
        destination: "/men/sneakers",
      },
      {
        source: "/mens-shoes/sports-shoes-for-men",
        destination: "/men/sports-shoes",
      },
      {
        source: "/mens-shoes/mens-sandals",
        destination: "/men/sandals",
      },
      {
        source: "/mens-shoes/slippers-flip-flops-for-men",
        destination: "/men/slippers-flip-flops",
      },
      {
        source: "/mens-shoes/loafers-for-men",
        destination: "/men/loafers",
      },
      {
        source: "/mens-shoes/mens-boots",
        destination: "/men/boots",
      },
      {
        source: "/mens-shoes",
        destination: "/men",
      },
      {
        source: "/mens-shoes/:path*",
        destination: "/men/:path*",
      },
      {
        source: "/womens-shoes/womens-flats",
        destination: "/women/flats",
      },
      {
        source: "/womens-shoes/mojari-shoes-for-women",
        destination: "/women/mojari-shoes",
      },
      {
        source: "/womens-shoes/sandals-for-women",
        destination: "/women/sandals",
      },
      {
        source: "/womens-shoes/slippers-for-women",
        destination: "/women/slippers",
      },
      {
        source: "/womens-shoes/kolhapuri-chappal-for-women",
        destination: "/women/kolhapuri-chappal",
      },
      {
        source: "/womens-shoes",
        destination: "/women",
      },
      {
        source: "/womens-shoes/:path*",
        destination: "/women/:path*",
      },
      {
        source: "/kids-shoes/boys-shoes",
        destination: "/kids/boys",
      },
      {
        source: "/kids-shoes/girls-shoes",
        destination: "/kids/girls",
      },
      {
        source: "/kids-shoes/baby-shoes",
        destination: "/kids/new-born-baby",
      },
      {
        source: "/kids-shoes/toddler-shoes",
        destination: "/kids/toddler-2-5-years",
      },
      {
        source: "/kids-shoes/junior-shoes",
        destination: "/kids/big-kids-shoes-10-14-years",
      },
      {
        source: "/kids-shoes/school-shoes",
        destination: "/kids/school-shoes",
      },
      {
        source: "/kids-shoes/kids-casual-shoes",
        destination: "/kids/casual-shoes",
      },
      {
        source: "/kids-shoes/kids-sneakers",
        destination: "/kids/sneakers",
      },
      {
        source: "/kids-shoes/kids-sandals",
        destination: "/kids/sandals",
      },
      {
        source: "/kids-shoes/kids-slippers",
        destination: "/kids/slippers",
      },
      {
        source: "/kids-shoes",
        destination: "/kids",
      },
      {
        source: "/kids-shoes/:path*",
        destination: "/kids/:path*",
      },
      {
        source: "/accessories/shoe-accessories/socks",
        destination: "/accessories/socks",
      },
      {
        source: "/accessories/shoe-accessories/shoes-care-products",
        destination: "/accessories/shoe-care-products",
      },
      {
        source: "/accessories/shoe-accessories/shoe-polish",
        destination: "/accessories/shoes-polish",
      },
      {
        source: "/accessories/shoe-accessories/shoe-brush",
        destination: "/accessories/shoes-brush",
      },
    ];
  },
};

export default nextConfig;
