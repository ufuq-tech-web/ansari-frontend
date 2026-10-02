import type { Metadata } from "next";
import { storefrontApi } from "../../../lib/storefront-api";
import BrandPageClient from "./BrandPageClient";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";

const BASE_URL = "https://www.ansarifootwear.com";

const BRAND_SEO_OVERRIDES: Record<
  string,
  { pageName: string; title: string; description: string; canonicalPath: string }
> = {
  sparx: {
    pageName: "Sparx",
    title: "Sparx Shoes | Buy Sparx Footwear Online",
    description: "Buy Sparx shoes and footwear in popular styles for everyday wear. Explore Sparx footwear for men, women and kids and find the right pair for every occasion.",
    canonicalPath: "/brands/sparx/",
  },
  nike: {
    pageName: "Nike",
    title: "Nike Shoes | Buy Nike Footwear Online",
    description: "Shop Nike shoes and footwear in popular styles for sports, training and everyday wear. Find Nike footwear for men, women and kids in versatile designs.",
    canonicalPath: "/brands/nike/",
  },
  adda: {
    pageName: "ADDA",
    title: "ADDA Shoes | Buy ADDA Footwear Online",
    description: "Buy ADDA shoes and footwear in versatile styles for everyday wear. Discover comfortable options for men, women and kids across casual and lifestyle collections.",
    canonicalPath: "/brands/adda/",
  },
  "red-tape": {
    pageName: "Red Tape",
    title: "Red Tape Shoes | Buy Red Tape Footwear Online",
    description: "Browse Red Tape shoes and footwear in stylish designs for everyday, casual and formal wear. Find versatile Red Tape footwear for men and women.",
    canonicalPath: "/brands/red-tape/",
  },
  jqr: {
    pageName: "JQR",
    title: "JQR Shoes | Buy JQR Footwear Online",
    description: "Find JQR shoes and footwear in versatile styles for everyday wear. Find JQR footwear designed for casual, active and lifestyle needs across available collections.",
    canonicalPath: "/brands/jqr/",
  },
  abros: {
    pageName: "Abros",
    title: "Abros Shoes | Buy Abros Footwear Online",
    description: "Order  Abros shoes and footwear in versatile styles for sports, casual and everyday wear. Find Abros footwear for men, women and kids across available collections.",
    canonicalPath: "/brands/abros/",
  },
  lakhani: {
    pageName: "Lakhani",
    title: "Lakhani Shoes | Buy Lakhani Footwear Online",
    description: "Discover Lakhani shoes and footwear in practical styles for everyday wear. Find Lakhani footwear across casual, formal and active designs for different occasions.",
    canonicalPath: "/brands/lakhani/",
  },
  bata: {
    pageName: "Bata",
    title: "Bata Shoes | Buy Bata Footwear Online",
    description: "Purchase Bata shoes and footwear in versatile styles for everyday, formal and casual wear. Find Bata footwear for men, women and kids across available collections.",
    canonicalPath: "/brands/bata/",
  },
  liberty: {
    pageName: "Liberty",
    title: "Liberty Shoes | Buy Liberty Footwear Online",
    description: "Buy Liberty shoes and footwear in versatile styles for everyday, formal and casual wear. Find Liberty footwear for men, women and kids across available collections.",
    canonicalPath: "/brands/liberty/",
  },
  action: {
    pageName: "Action",
    title: "Action Shoes | Buy Action Footwear Online",
    description: "Experience Action shoes and footwear in versatile styles for everyday, casual and active wear. Find Action footwear for men, women and kids across available collections.",
    canonicalPath: "/brands/action/",
  },
};

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

  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/brand-${brandSlug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const override = BRAND_SEO_OVERRIDES[brandSlug];
  const productsRes = await storefrontApi.getProducts({ brandSlug, limit: 1 });
  const count = productsRes.total;
  const defaultTitle = override?.title || `${brand.name} Footwear — Ansary Footwear`;
  const defaultDesc =
    override?.description ||
    `Shop ${count} ${brand.name} footwear styles at Ansary Footwear — trusted quality, affordable pricing, nationwide delivery.`;

  const title = seoTitle || defaultTitle;
  const description = seoDesc || defaultDesc;
  const canonicalUrl = override?.canonicalPath
    ? `${BASE_URL}${override.canonicalPath}`
    : `${BASE_URL}/brands/${brandSlug}/`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
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

  const override = BRAND_SEO_OVERRIDES[brandSlug];

  return (
    <>
      {brand && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            { name: "Brands", url: `${BASE_URL}/brands/` },
            {
              name: override?.pageName || brand.name,
              url: override?.canonicalPath
                ? `${BASE_URL}${override.canonicalPath}`
                : `${BASE_URL}/brands/${brandSlug}/`,
            },
          ]}
        />
      )}
      <BrandPageClient
        brandName={brand?.name || null}
        pageTitle={override?.pageName || brand?.name || null}
        pageDescription={override?.description}
        products={products}
      />
    </>
  );
}
