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
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Subcategory lives in the path, not the query string — navigate to a different URL entirely.
  const goToSubcategory = (name: string) => {
    const base = name ? `/${categoryKey}/${slugify(name)}` : `/${categoryKey}`;
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
