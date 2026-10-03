import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storefrontApi } from "../../lib/storefront-api";
import CategoryPageClient from "./CategoryPageClient";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";
import { buildProductQuery, filtersFromParams, searchParamsToURLSearchParams } from "../../lib/product-query";

const BASE_URL = "https://www.ansarifootwear.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryKey: string }>;
}): Promise<Metadata> {
  const { categoryKey } = await params;
  const config = await storefrontApi.getCategory(categoryKey);

  if (!config) {
    return { title: "Category Not Found — Ansary Footwear" };
  }

  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/category-${categoryKey}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  // Fallback metadata if not set
  const metaTitle =
    seoTitle ||
    (config as any).metaTitle ||
    (categoryKey === "men"
      ? "Men’s Shoes & Footwear Online | Buy Stylish Shoes for Men "
      : categoryKey === "women"
      ? "Women’s Shoes Online | Stylish & Comfortable Footwear for Women"
      : categoryKey === "kids"
      ? "Kids Shoes | Boys & Girls Shoes Online | Kids Footwear"
      : categoryKey === "accessories"
      ? "Shoe Cleaning Kit & Accessories | Shoe Care Essentials"
      : `${config.name} Online | Formal, Casual, Sneakers & Sandals | Ansary Footwear`);

  const metaDesc =
    seoDesc ||
    (config as any).metaDescription ||
    (categoryKey === "men"
      ? "Browse different types of shoes for men online at Ansari Footwear. Shop stylish formal shoes, sneakers, loafers, boots, casual shoes, sandals & more. Order Now."
      : categoryKey === "women"
      ? "Explore women’s shoes online, from stylish everyday footwear to comfortable designs for every occasion. Find versatile shoes for women in the latest styles."
      : categoryKey === "kids"
      ? "Explore kids shoes for boys and girls in comfortable, lightweight and stylish designs. Find sports, skating, LED and everyday footwear for kids online."
      : categoryKey === "accessories"
      ? "Find shoe cleaning kits and accessories for everyday footwear care. Explore leather, white shoe and sneaker cleaning essentials to keep your footwear looking fresh."
      : config.description);

  const canonicalUrl =
    categoryKey === "men"
      ? "https://www.ansarifootwear.com/mens-shoes/"
      : categoryKey === "women"
      ? "https://www.ansarifootwear.com/womens-shoes/"
      : categoryKey === "kids"
      ? "https://www.ansarifootwear.com/kids-shoes/"
      : categoryKey === "accessories"
      ? "https://www.ansarifootwear.com/accessories/"
      : `/${categoryKey}`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: "website",
      url: canonicalUrl.startsWith("http") ? canonicalUrl : `${BASE_URL}${canonicalUrl}`,
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryKey: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryKey } = await params;
  const sp = searchParamsToURLSearchParams(await searchParams);
  const filters = filtersFromParams(sp);
  const sort = sp.get("sort") || "popularity";
  const gender = sp.get("gender") || "";
  const ageGroup = sp.get("age") || "";

  const [config, productsRes] = await Promise.all([
    storefrontApi.getCategory(categoryKey),
    storefrontApi.getProducts(
      buildProductQuery({ categoryKey, subcategory: "", gender, ageGroup, filters, sort }, 1)
    ),
  ]);

  if (!config) {
    notFound();
  }

  const faqJsonLd = config?.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  let seoData: any = null;
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/category-${categoryKey}`, { next: { revalidate: 60 } });
    if (res.ok) seoData = await res.json();
  } catch (err) {}

  return (
    <>
      {config && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            {
              name: config.name,
              url:
                categoryKey === "men"
                  ? `${BASE_URL}/mens-shoes/`
                  : categoryKey === "women"
                  ? `${BASE_URL}/womens-shoes/`
                  : categoryKey === "kids"
                  ? `${BASE_URL}/kids-shoes/`
                  : categoryKey === "accessories"
                  ? `${BASE_URL}/accessories/`
                  : `${BASE_URL}/${categoryKey}`,
            },
          ]}
        />
      )}
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <CategoryPageClient
        categoryKey={categoryKey}
        initialConfig={config}
        initialProducts={productsRes.items}
        initialTotal={productsRes.total}
        pageTitle={seoData?.h1 || (categoryKey === "accessories" ? "Shoes Accessories" : undefined)}
        pageDescription={
          seoData?.description ||
          (categoryKey === "men"
            ? "Browse different types of shoes for men online at Ansari Footwear. Shop stylish formal shoes, sneakers, loafers, boots, casual shoes, sandals & more. Order Now."
            : categoryKey === "women"
            ? "Explore women’s shoes online, from stylish everyday footwear to comfortable designs for every occasion. Find versatile shoes for women in the latest styles."
            : categoryKey === "kids"
            ? "Explore kids shoes for boys and girls in comfortable, lightweight and stylish designs. Find sports, skating, LED and everyday footwear for kids online."
            : categoryKey === "accessories"
            ? "Find shoe cleaning kits and accessories for everyday footwear care. Explore leather, white shoe and sneaker cleaning essentials to keep your footwear looking fresh."
            : config.description)
        }
      />
    </>
  );
}
