import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { storefrontApi } from "../../../lib/storefront-api";
import { productHref } from "../../../lib/catalog-helpers";
import ProductDetailClient from "../../../components/product/ProductDetailClient";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";

const BASE_URL = "https://www.ansaribootthouse.com";

function getProductDescription(product: any): string {
  return `Buy ${product.name} by ${product.brand} online at the best price of ₹${product.salePrice.toLocaleString('en-IN')}. Explore high-quality shoes at Ansari Boot House.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Extract CUID if the slug matches the 'name-id' pattern
  const idMatch = slug.match(/-([c][a-z0-9]{23,})$/i);
  const idToFetch = idMatch ? idMatch[1] : slug;
  
  const product = await storefrontApi.getProductById(idToFetch);

  if (!product) {
    return { title: "Product Not Found — Ansari Boot House" };
  }

  const title = `${product.name} by ${product.brand} — Ansari Boot House`;
  const description = getProductDescription(product);
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [product.image] },
    alternates: { canonical: productHref(product as any) },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Extract CUID if the slug matches the 'name-id' pattern
  const idMatch = slug.match(/-([c][a-z0-9]{23,})$/i);
  const idToFetch = idMatch ? idMatch[1] : slug;
  
  const product = await storefrontApi.getProductById(idToFetch);

  if (!product) {
    notFound();
  }

  // Catalog products (with category+subcategory) live at the nested URL —
  // redirect there instead of rendering a duplicate here. This also covers
  // legacy bare-id URLs and the old flat /product/{name}-{id} format.
  if (product.category && product.subcategory) {
    permanentRedirect(productHref(product as any));
  }

  const [config, reviews] = await Promise.all([
    product.category ? storefrontApi.getCategory(product.category) : Promise.resolve(null),
    storefrontApi.getReviews(),
  ]);

  const canonicalUrl = `${BASE_URL}${productHref(product as any)}`;

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
