import type { FilterState } from "../interface/filter";
import { slugify } from "./catalog-helpers";

// Pure query-building logic shared between the server (page.tsx fetching the
// first page of results for SSR) and the client (useProductListing.ts
// re-fetching on filter/sort/page changes). No "use client" here on purpose —
// Server Components import this directly.

export const PAGE_SIZE = 12;

export const defaultFilters: FilterState = {
  brands: [],
  priceRange: [0, 5000],
  sizes: [],
  colors: [],
  rating: null,
  discount: null,
  availability: [],
  materials: [],
  occasions: [],
  soleMaterials: [],
  closureTypes: [],
  heelHeights: [],
  toeShapes: [],
};

export const LIST_PARAMS: Array<[keyof FilterState, string]> = [
  ["brands", "brand"],
  ["sizes", "size"],
  ["colors", "color"],
  ["materials", "material"],
  ["occasions", "occasion"],
  ["availability", "availability"],
  ["soleMaterials", "soleMaterial"],
  ["closureTypes", "closureType"],
  ["heelHeights", "heelHeight"],
  ["toeShapes", "toeShape"],
];

export function filtersFromParams(searchParams: URLSearchParams, presetPriceRange?: [number, number]): FilterState {
  const list = (key: string) => {
    const v = searchParams.get(key);
    return v ? v.split(",").filter(Boolean) : [];
  };
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const priceRange: [number, number] = (priceMin || priceMax)
    ? [Number(priceMin) || 0, Number(priceMax) || 5000]
    : presetPriceRange ?? defaultFilters.priceRange;

  return {
    brands: list("brand"),
    sizes: list("size"),
    colors: list("color"),
    materials: list("material"),
    occasions: list("occasion"),
    availability: list("availability"),
    soleMaterials: list("soleMaterial"),
    closureTypes: list("closureType"),
    heelHeights: list("heelHeight"),
    toeShapes: list("toeShape"),
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
    discount: searchParams.get("discount") ? Number(searchParams.get("discount")) : null,
    priceRange,
  };
}

// Next.js Server Components receive `searchParams` as a plain object, not a
// URLSearchParams instance — normalize it so page.tsx can reuse the same
// filtersFromParams() the client uses.
export function searchParamsToURLSearchParams(sp: { [key: string]: string | string[] | undefined }): URLSearchParams {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value == null) continue;
    usp.set(key, Array.isArray(value) ? value[0] : value);
  }
  return usp;
}

export interface ProductQueryScope {
  categoryKey: string;
  subcategory: string;
  gender: string;
  ageGroup: string;
  filters: FilterState;
  sort: string;
}

export function buildProductQuery({ categoryKey, subcategory, gender, ageGroup, filters, sort }: ProductQueryScope, page: number) {
  return {
    categoryKey,
    subcategorySlug: subcategory ? slugify(subcategory) : undefined,
    gender: gender ? gender.toUpperCase() : undefined,
    ageGroup: ageGroup ? `AGE_${ageGroup.replace("-", "_")}` : undefined,
    brand: filters.brands.length ? filters.brands.join(",") : undefined,
    size: filters.sizes.length ? filters.sizes.join(",") : undefined,
    color: filters.colors.length ? filters.colors.join(",") : undefined,
    material: filters.materials.length ? filters.materials.join(",") : undefined,
    occasion: filters.occasions.length ? filters.occasions.join(",") : undefined,
    availability: filters.availability.length ? filters.availability.join(",") : undefined,
    soleMaterial: filters.soleMaterials.length ? filters.soleMaterials.join(",") : undefined,
    closureType: filters.closureTypes.length ? filters.closureTypes.join(",") : undefined,
    heelHeight: filters.heelHeights.length ? filters.heelHeights.join(",") : undefined,
    toeShape: filters.toeShapes.length ? filters.toeShapes.join(",") : undefined,
    rating: filters.rating ?? undefined,
    discount: filters.discount ?? undefined,
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] < 5000 ? filters.priceRange[1] : undefined,
    sort,
    page,
    limit: PAGE_SIZE,
  };
}
