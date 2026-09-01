import type { MetadataRoute } from "next";
import { slugify, productHref } from "../lib/catalog-helpers";
import { storefrontApi } from "../lib/storefront-api";

const PRICE_TIERS = ["under-999", "1000-1499", "1500-plus"];
const CATEGORY_KEYS = ["men", "women", "kids", "accessories"];

const BASE_URL = "https://www.ansarifootwear.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/brands`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/collections`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/new-arrivals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/sale`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/best-sellers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/guides`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/track-order`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/return-exchange`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/shipping-policy`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [guides, brands, productsRes, categoryConfigs] = await Promise.all([
    storefrontApi.getGuides(),
    storefrontApi.getBrands(),
    storefrontApi.getProducts({ limit: 100 }),
    Promise.all(CATEGORY_KEYS.map((key) => storefrontApi.getCategory(key))),
  ]);

  const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoryConfigs
    .filter((config): config is NonNullable<typeof config> => config != null)
    .flatMap((config) => [
      { url: `${BASE_URL}/${config.key}`, changeFrequency: "weekly" as const, priority: 0.9 },
      ...config.subcategories.map((sub) => ({
        url: `${BASE_URL}/${config.key}/${slugify(sub.name)}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...PRICE_TIERS.map((tier) => ({
        url: `${BASE_URL}/${config.key}/price/${tier}`,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
    ]);

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${BASE_URL}/brands/${b.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = productsRes.items.map((p) => ({
    url: `${BASE_URL}${productHref(p)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...guideRoutes, ...productRoutes];
}
