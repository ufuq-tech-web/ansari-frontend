"use client";

import { useRouter } from "next/navigation";
import CategoryPage from "../../../../components/category/CategoryPage";
import { useCategory } from "../../../../hooks/useCategory";
import { priceTiers } from "../../../../lib/catalog-helpers";
import type { CategoryConfig, ProductWithCategory } from "../../../../lib/catalog-helpers";

interface Props {
  categoryKey: string;
  tier: string;
  initialConfig: CategoryConfig | null;
  initialProducts: ProductWithCategory[];
  initialTotal: number;
}

export default function PriceRangeClient({ categoryKey, tier, initialConfig, initialProducts, initialTotal }: Props) {
  const router = useRouter();
  const { config, loading } = useCategory(categoryKey, initialConfig);
  const tierInfo = priceTiers[tier];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config || !tierInfo) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center gap-4">
        <h1 className="font-poppins font-extrabold text-charcoal-900 text-3xl">Page not found</h1>
        <button onClick={() => router.push("/")} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <CategoryPage
      key={`${categoryKey}-${tier}`}
      category={config}
      activeSubcategory=""
      onCategoryChange={(key) => router.push(`/${key}`)}
      presetPriceRange={[tierInfo.min, tierInfo.max]}
      presetPriceLabel={tierInfo.label}
      onClearPresetPrice={() => router.push(`/${categoryKey}`)}
      initialProducts={initialProducts}
      initialTotal={initialTotal}
    />
  );
}
