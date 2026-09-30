"use client";

import { useRouter } from "next/navigation";
import ProductListingPage from "../../../components/ProductListingPage";
import type { Product } from "../../../lib/catalog-helpers";

interface Props {
  brandName: string | null;
  products: Product[];
}

export default function BrandPageClient({ brandName, products }: Props) {
  const router = useRouter();

  if (!brandName) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center gap-4">
        <h1 className="font-poppins font-extrabold text-charcoal-900 text-3xl">Brand not found</h1>
        <button onClick={() => router.push("/brands")} className="btn-primary">Back to Brands</button>
      </div>
    );
  }

  return (
    <ProductListingPage
      title={brandName}
      subtitle={`${products.length} products from ${brandName}`}
      products={products}
      heroImage="/images/hero-banner/hero-brand-detail.png"
    />
  );
}
