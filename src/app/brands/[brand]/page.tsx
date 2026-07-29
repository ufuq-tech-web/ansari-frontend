import type { Metadata } from "next";
import { storefrontApi } from "../../../lib/storefront-api";
import BrandPageClient from "./BrandPageClient";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";

const BASE_URL = "https://www.ansaribootthouse.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brands = await storefrontApi.getBrands();
  const brand = brands.find((b) => b.slug === brandSlug);

  if (!brand) {
    return { title: "Brand Not Found — Ansary Footwear" };
  }

  const productsRes = await storefrontApi.getProducts({ brandSlug, limit: 1 });
  const count = productsRes.total;
  const title = `${brand.name} Footwear — Ansary Footwear`;
  const description = `Shop ${count} ${brand.name} footwear styles at Ansary Footwear — trusted quality, affordable pricing, free shipping.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `/brands/${brandSlug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;
  const brands = await storefrontApi.getBrands();
  const brand = brands.find((b) => b.slug === brandSlug);

  let products: any[] = [];
  if (brand) {
    const productsRes = await storefrontApi.getProducts({ brandSlug, limit: 100 });
    products = productsRes.items;
  }

  return (
    <>
      {brand && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            { name: "Brands", url: `${BASE_URL}/brands` },
            { name: brand.name, url: `${BASE_URL}/brands/${brandSlug}` },
          ]}
        />
      )}
      <BrandPageClient brandName={brand?.name || null} products={products} />
    </>
  );
}
