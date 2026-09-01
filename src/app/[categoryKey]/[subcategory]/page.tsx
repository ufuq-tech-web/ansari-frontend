import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storefrontApi, slugify } from "../../../lib/storefront-api";
import SubcategoryPageClient from "./SubcategoryPageClient";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";
import { buildProductQuery, filtersFromParams, searchParamsToURLSearchParams } from "../../../lib/product-query";

const BASE_URL = "https://www.ansarifootwear.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryKey: string; subcategory: string }>;
}): Promise<Metadata> {
  const { categoryKey, subcategory } = await params;
  const config = await storefrontApi.getCategory(categoryKey);
  const match = config?.subcategories.find((s) => slugify(s.name) === subcategory);

  if (!config || !match) {
    return { title: "Page Not Found — Ansary Footwear" };
  }

  const title = `${match.name} for ${config.name.replace("'s Footwear", "")} — Ansary Footwear`;
  const description = `Shop ${match.name} in our ${config.name} range — ${match.count} styles. ${config.description}`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `/${categoryKey}/${subcategory}` },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryKey: string; subcategory: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryKey, subcategory } = await params;
  const config = await storefrontApi.getCategory(categoryKey);
  const match = config?.subcategories.find((s) => slugify(s.name) === subcategory);

  if (!config || !match) {
    notFound();
  }

  const sp = searchParamsToURLSearchParams(await searchParams);
  const filters = filtersFromParams(sp);
  const sort = sp.get("sort") || "popularity";
  const gender = sp.get("gender") || "";
  const ageGroup = sp.get("age") || "";
  const productsRes = await storefrontApi.getProducts(
    buildProductQuery({ categoryKey, subcategory: match.name, gender, ageGroup, filters, sort }, 1)
  );

  return (
    <>
      {config && match && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            { name: config.name, url: `${BASE_URL}/${categoryKey}` },
            { name: match.name, url: `${BASE_URL}/${categoryKey}/${subcategory}` },
          ]}
        />
      )}
      <SubcategoryPageClient
        categoryKey={categoryKey}
        subcategorySlug={subcategory}
        initialConfig={config}
        initialProducts={productsRes.items}
        initialTotal={productsRes.total}
      />
    </>
  );
}
