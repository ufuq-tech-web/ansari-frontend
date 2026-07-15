import type { MetadataRoute } from "next";

const BASE_URL = "https://www.ansaribootthouse.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/order-confirmation", "/orders", "/wishlist", "/my-account", "/admin"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
