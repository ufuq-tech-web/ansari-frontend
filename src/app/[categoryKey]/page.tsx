import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storefrontApi } from "../../lib/storefront-api";
import CategoryPageClient from "./CategoryPageClient";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";
import { buildProductQuery, filtersFromParams, searchParamsToURLSearchParams } from "../../lib/product-query";

const BASE_URL = "https://www.ansaribootthouse.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryKey: string }>;
}): Promise<Metadata> {
  const { categoryKey } = await params;
  const config = await storefrontApi.getCategory(categoryKey);

  if (!config) {
    return { title: "Category Not Found — Ansari Boot House" };
  }

  // Fallback metadata if not set
  const metaTitle = (config as any).metaTitle || `${config.name} Online | Formal, Casual, Sneakers & Sandals | Ansari Boot House`;
  const metaDesc = (config as any).metaDescription || config.description;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: { title: metaTitle, description: metaDesc, type: "website" },
    alternates: { canonical: `/${categoryKey}` },
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

  return (
    <>
      {config && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            { name: config.name, url: `${BASE_URL}/${categoryKey}` },
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
      />
    </>
  );
}
