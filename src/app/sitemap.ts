import type { MetadataRoute } from "next";
import { slugify, productHref } from "../lib/catalog-helpers";
import { storefrontApi } from "../lib/storefront-api";

const PRICE_TIERS = ["under-999", "1000-1499", "1500-plus"];
const CATEGORY_KEYS = ["men", "women", "kids", "accessories"];

const BASE_URL = "https://www.ansarifootwear.com";

const CUSTOM_SUBCATEGORY_URLS: Record<string, string> = {
  "men/formal-shoes": "/mens-shoes/formal-shoes-for-men/",
  "men/casual-shoes": "/mens-shoes/casual-shoes-for-men/",
  "men/sneakers": "/mens-shoes/sneakers-for-men/",
  "men/sports-shoes": "/mens-shoes/sports-shoes-for-men/",
  "men/sandals": "/mens-shoes/mens-sandals/",
  "men/slippers-flip-flops": "/mens-shoes/slippers-flip-flops-for-men/",
  "men/loafers": "/mens-shoes/loafers-for-men/",
  "men/boots": "/mens-shoes/mens-boots/",
  "women/flats": "/womens-shoes/womens-flats/",
  "women/mojari-shoes": "/womens-shoes/mojari-shoes-for-women/",
  "women/sandals": "/womens-shoes/sandals-for-women/",
  "women/slippers": "/womens-shoes/slippers-for-women/",
  "women/kolhapuri-chappal": "/womens-shoes/kolhapuri-chappal-for-women/",
  "kids/boys": "/kids-shoes/boys-shoes/",
  "kids/girls": "/kids-shoes/girls-shoes/",
  "kids/new-born-baby": "/kids-shoes/baby-shoes/",
  "kids/toddler-2-5-years": "/kids-shoes/toddler-shoes/",
  "kids/big-kids-shoes-10-14-years": "/kids-shoes/junior-shoes/",
  "kids/school-shoes": "/kids-shoes/school-shoes/",
  "kids/casual-shoes": "/kids-shoes/kids-casual-shoes/",
  "kids/sneakers": "/kids-shoes/kids-sneakers/",
  "kids/sandals": "/kids-shoes/kids-sandals/",
  "kids/slippers": "/kids-shoes/kids-slippers/",
  "accessories/socks": "/accessories/shoe-accessories/socks/",
  "accessories/shoe-care-products": "/accessories/shoe-accessories/shoes-care-products/",
  "accessories/shoes-care-products": "/accessories/shoe-accessories/shoes-care-products/",
  "accessories/shoes-polish": "/accessories/shoe-accessories/shoe-polish/",
  "accessories/shoe-polish": "/accessories/shoe-accessories/shoe-polish/",
  "accessories/shoes-brush": "/accessories/shoe-accessories/shoe-brush/",
  "accessories/shoe-brush": "/accessories/shoe-accessories/shoe-brush/",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/brands/`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/collections`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/new-arrivals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/sale`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/shoes-collection/best-selling-shoes/`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/shoes-collection/trending-shoes/`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/guides`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/footwears-journal/`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/shoes-shop-in-india/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/shoes-shop-contact-numbers/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/order-tracking/`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/returns-exchanges/`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/shipping-information/`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/faqs/`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [guides, brands, productsRes, categoryConfigs, blogPosts] = await Promise.all([
    storefrontApi.getGuides(),
    storefrontApi.getBrands(),
    storefrontApi.getProducts({ limit: 100 }),
    Promise.all(CATEGORY_KEYS.map((key) => storefrontApi.getCategory(key))),
    storefrontApi.getBlogPosts(),
  ]);

  const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/footwears-journal/${p.slug}/`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoryConfigs
    .filter((config): config is NonNullable<typeof config> => config != null)
    .flatMap((config) => {
      const categoryUrl =
        config.key === "men"
          ? `${BASE_URL}/mens-shoes/`
          : config.key === "women"
          ? `${BASE_URL}/womens-shoes/`
          : config.key === "kids"
          ? `${BASE_URL}/kids-shoes/`
          : config.key === "accessories"
          ? `${BASE_URL}/accessories/`
          : `${BASE_URL}/${config.key}`;
      return [
        { url: categoryUrl, changeFrequency: "weekly" as const, priority: 0.9 },
        ...config.subcategories.map((sub) => {
          const subSlug = slugify(sub.name);
          const customUrl = CUSTOM_SUBCATEGORY_URLS[`${config.key}/${subSlug}`];
          const subUrl = customUrl ? `${BASE_URL}${customUrl}` : `${BASE_URL}/${config.key}/${subSlug}`;
          return {
            url: subUrl,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          };
        }),
        ...PRICE_TIERS.map((tier) => ({
          url: `${BASE_URL}/${config.key}/price/${tier}`,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        })),
      ];
    });

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${BASE_URL}/brands/${b.slug}/`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = productsRes.items.map((p) => ({
    url: `${BASE_URL}${productHref(p)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...guideRoutes, ...blogRoutes, ...productRoutes];
}
