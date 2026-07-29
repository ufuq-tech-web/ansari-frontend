import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { priceTiers } from "../../../../lib/catalog-helpers";
import { storefrontApi } from "../../../../lib/storefront-api";
import PriceRangeClient from "./PriceRangeClient";
import BreadcrumbJsonLd from "../../../../components/BreadcrumbJsonLd";
import { buildProductQuery, filtersFromParams, searchParamsToURLSearchParams } from "../../../../lib/product-query";

const BASE_URL = "https://www.ansaribootthouse.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryKey: string; tier: string }>;
}): Promise<Metadata> {
  const { categoryKey, tier } = await params;
  const config = await storefrontApi.getCategory(categoryKey);
  const tierInfo = priceTiers[tier];

  if (!config || !tierInfo) {
    return { title: "Page Not Found — Ansary Footwear" };
  }

  const title = `${config.name} ${tierInfo.label} — Ansary Footwear`;
  const description = `Shop ${config.name} priced ${tierInfo.label.toLowerCase()} at Ansary Footwear. ${config.description}`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `/${categoryKey}/price/${tier}` },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryKey: string; tier: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryKey, tier } = await params;
  const config = await storefrontApi.getCategory(categoryKey);
  const tierInfo = priceTiers[tier];

  if (!config || !tierInfo) {
    notFound();
  }

  const sp = searchParamsToURLSearchParams(await searchParams);
  const filters = filtersFromParams(sp, [tierInfo.min, tierInfo.max]);
  const sort = sp.get("sort") || "popularity";
  const gender = sp.get("gender") || "";
  const ageGroup = sp.get("age") || "";
  const productsRes = await storefrontApi.getProducts(
    buildProductQuery({ categoryKey, subcategory: "", gender, ageGroup, filters, sort }, 1)
  );

  return (
    <>
      {config && tierInfo && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            { name: config.name, url: `${BASE_URL}/${categoryKey}` },
            { name: tierInfo.label, url: `${BASE_URL}/${categoryKey}/price/${tier}` },
          ]}
        />
      )}
      <PriceRangeClient
        categoryKey={categoryKey}
        tier={tier}
        initialConfig={config}
        initialProducts={productsRes.items}
        initialTotal={productsRes.total}
      />
    </>
  );
}
