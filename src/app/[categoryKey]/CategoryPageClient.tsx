"use client";

import { useRouter } from "next/navigation";
import CategoryPage from "../../components/category/CategoryPage";
import { useCategory } from "../../hooks/useCategory";
import type { CategoryConfig, ProductWithCategory } from "../../lib/catalog-helpers";

interface Props {
  categoryKey: string;
  initialConfig: CategoryConfig | null;
  initialProducts: ProductWithCategory[];
  initialTotal: number;
  pageTitle?: string;
  pageDescription?: string;
}

export default function CategoryPageClient({ categoryKey, initialConfig, initialProducts, initialTotal, pageTitle, pageDescription }: Props) {
  const router = useRouter();
  const { config, loading } = useCategory(categoryKey, initialConfig);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center gap-4">
        <h1 className="font-poppins font-extrabold text-charcoal-900 text-3xl">Category not found</h1>
        <button onClick={() => router.push("/")} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <CategoryPage
      key={categoryKey}
      category={config}
      activeSubcategory=""
      pageTitle={pageTitle}
      pageDescription={pageDescription || config.description}
      onCategoryChange={(key) =>
        router.push(
          key === "men"
            ? "/mens-shoes"
            : key === "women"
            ? "/womens-shoes"
            : key === "kids"
            ? "/kids-shoes"
            : `/${key}`
        )
      }
      initialProducts={initialProducts}
      initialTotal={initialTotal}
    />
  );
}
