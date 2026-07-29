import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storefrontApi } from "../../../../lib/storefront-api";
import ProductDetailClient from "../../../../components/product/ProductDetailClient";
import BreadcrumbJsonLd from "../../../../components/BreadcrumbJsonLd";

const BASE_URL = "https://www.ansaribootthouse.com";

function getProductDescription(product: any): string {
  return `Buy ${product.name} by ${product.brand} online at the best price of ₹${product.salePrice.toLocaleString('en-IN')}. Explore high-quality shoes at Ansary Footwear.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryKey: string; subcategory: string; productSlug: string }>;
}): Promise<Metadata> {
  const { categoryKey, subcategory, productSlug } = await params;
  const product = await storefrontApi.getProductBySlug(categoryKey, subcategory, productSlug);

  if (!product) {
    return { title: "Product Not Found — Ansary Footwear" };
  }

  const title = `${product.name} by ${product.brand} — Ansary Footwear`;
  const description = getProductDescription(product);
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [product.image] },
    alternates: { canonical: `/${categoryKey}/${subcategory}/${productSlug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ categoryKey: string; subcategory: string; productSlug: string }>;
}) {
  const { categoryKey, subcategory, productSlug } = await params;
  const product = await storefrontApi.getProductBySlug(categoryKey, subcategory, productSlug);

  if (!product) {
    notFound();
  }

  const [config, reviews] = await Promise.all([
    storefrontApi.getCategory(categoryKey),
    storefrontApi.getReviews(),
  ]);
  const canonicalUrl = `${BASE_URL}/${categoryKey}/${subcategory}/${productSlug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: getProductDescription(product),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: product.salePrice,
      availability:
        product.stock === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
    aggregateRating:
      product.reviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
          }
        : undefined,
  };

  const breadcrumbItems = [
    { name: "Home", url: BASE_URL },
    { name: config?.name || "Category", url: `${BASE_URL}/${categoryKey}` },
    { name: product.subcategory || "Subcategory", url: `${BASE_URL}/${categoryKey}/${subcategory}` },
    { name: product.name, url: canonicalUrl },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductDetailClient product={product} categoryConfig={config ?? undefined} reviews={reviews} />
    </>
  );
}
