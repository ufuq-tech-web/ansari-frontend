"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { slugify } from "../lib/catalog-helpers";
import { LIST_PARAMS, filtersFromParams } from "../lib/product-query";
import type { FilterState } from "../interface/filter";

// Owns every read/write of the category page's URL — filters, sort, gender,
// age group and subcategory all live in the URL (not React state) so the
// current view is bookmarkable and back-button-friendly. CategoryPage.tsx
// just reads what this hook returns and calls its setters.
export function useCategoryFilterUrl(categoryKey: string, presetPriceRange?: [number, number]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeGender = searchParams.get("gender") || "";
  const activeAgeGroup = searchParams.get("age") || "";
  const sort = searchParams.get("sort") || "popularity";
  const filters = useMemo(
    () => filtersFromParams(searchParams, presetPriceRange),
    [searchParams, presetPriceRange]
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value); else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setFilters = (next: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [stateKey, paramKey] of LIST_PARAMS) {
      const arr = next[stateKey] as string[];
      if (arr.length) params.set(paramKey, arr.join(",")); else params.delete(paramKey);
    }
    if (next.rating) params.set("rating", String(next.rating)); else params.delete("rating");
    if (next.discount) params.set("discount", String(next.discount)); else params.delete("discount");
    if (next.priceRange[0] > 0) params.set("priceMin", String(next.priceRange[0])); else params.delete("priceMin");
    if (next.priceRange[1] < 5000) params.set("priceMax", String(next.priceRange[1])); else params.delete("priceMax");
    if (next.search) params.set("search", next.search); else params.delete("search");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

const CUSTOM_SUBCAT_URLS: Record<string, string> = {
  "men/formal-shoes": "/mens-shoes/formal-shoes-for-men",
  "men/casual-shoes": "/mens-shoes/casual-shoes-for-men",
  "men/sneakers": "/mens-shoes/sneakers-for-men",
  "men/sports-shoes": "/mens-shoes/sports-shoes-for-men",
  "men/sandals": "/mens-shoes/mens-sandals",
  "men/slippers-flip-flops": "/mens-shoes/slippers-flip-flops-for-men",
  "men/loafers": "/mens-shoes/loafers-for-men",
  "men/boots": "/mens-shoes/mens-boots",
  "women/flats": "/womens-shoes/womens-flats",
  "women/mojari-shoes": "/womens-shoes/mojari-shoes-for-women",
  "women/sandals": "/womens-shoes/sandals-for-women",
  "women/slippers": "/womens-shoes/slippers-for-women",
  "women/kolhapuri-chappal": "/womens-shoes/kolhapuri-chappal-for-women",
  "kids/boys": "/kids-shoes/boys-shoes",
  "kids/girls": "/kids-shoes/girls-shoes",
  "kids/new-born-baby": "/kids-shoes/baby-shoes",
  "kids/toddler-2-5-years": "/kids-shoes/toddler-shoes",
  "kids/big-kids-shoes-10-14-years": "/kids-shoes/junior-shoes",
  "kids/school-shoes": "/kids-shoes/school-shoes",
  "kids/casual-shoes": "/kids-shoes/kids-casual-shoes",
  "kids/sneakers": "/kids-shoes/kids-sneakers",
  "kids/sandals": "/kids-shoes/kids-sandals",
  "kids/slippers": "/kids-shoes/kids-slippers",
  "accessories/socks": "/accessories/shoe-accessories/socks",
  "accessories/shoe-care-products": "/accessories/shoe-accessories/shoes-care-products",
  "accessories/shoes-care-products": "/accessories/shoe-accessories/shoes-care-products",
  "accessories/shoes-polish": "/accessories/shoe-accessories/shoe-polish",
  "accessories/shoe-polish": "/accessories/shoe-accessories/shoe-polish",
  "accessories/shoes-brush": "/accessories/shoe-accessories/shoe-brush",
  "accessories/shoe-brush": "/accessories/shoe-accessories/shoe-brush",
};

  // Subcategory lives in the path, not the query string — navigate to a different URL entirely.
  const goToSubcategory = (name: string) => {
    let base: string;
    const catBase = categoryKey === "men" ? "/mens-shoes" : categoryKey === "women" ? "/womens-shoes" : categoryKey === "kids" ? "/kids-shoes" : `/${categoryKey}`;
    if (name) {
      const slug = slugify(name);
      base = CUSTOM_SUBCAT_URLS[`${categoryKey}/${slug}`] || `${catBase}/${slug}`;
    } else {
      base = catBase;
    }
    const qs = searchParams.toString();
    router.push(qs ? `${base}?${qs}` : base, { scroll: false });
  };

  return {
    activeGender,
    activeAgeGroup,
    sort,
    filters,
    updateParam,
    setFilters,
    goToSubcategory,
  };
}
