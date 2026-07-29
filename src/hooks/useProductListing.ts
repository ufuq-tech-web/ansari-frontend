"use client";

import { useEffect, useRef, useState } from "react";
import { storefrontApi } from "../lib/storefront-api";
import type { ProductWithCategory } from "../lib/catalog-helpers";
import type { FilterState } from "../interface/filter";
import { buildProductQuery, type ProductQueryScope } from "../lib/product-query";

interface Params extends ProductQueryScope {
  filters: FilterState;
  // Page 1 already fetched server-side (in the route's page.tsx) for the URL
  // the page was first loaded with — lets first paint show real products
  // instead of a spinner. Ignored (and the client fetches page 1 itself) once
  // filters/sort/scope change to anything other than what produced these.
  initialProducts?: ProductWithCategory[];
  initialTotal?: number;
}

// Fetches an already-filtered, sorted and paginated product page from the
// backend — the category listing page holds no filtering/sorting logic of
// its own, it just renders whatever this hook returns.
export function useProductListing(params: Params) {
  const { categoryKey, subcategory, gender, ageGroup, filters, sort, initialProducts, initialTotal } = params;
  const key = JSON.stringify({ categoryKey, subcategory, gender, ageGroup, filters, sort });

  const hasInitial = initialProducts != null;
  const initialKeyRef = useRef(key);
  const didMountRef = useRef(false);

  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts ?? []);
  const [total, setTotal] = useState(initialTotal ?? 0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(!hasInitial);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Only skip the very first render when the server already provided data —
    // never skip subsequent navigations back to the same filter state.
    if (!didMountRef.current && hasInitial && key === initialKeyRef.current) {
      didMountRef.current = true;
      return;
    }
    didMountRef.current = true;

    let active = true;
    setLoading(true);
    setPage(1);
    storefrontApi.getProducts(buildProductQuery(params, 1)).then(({ items, total }) => {
      if (!active) return;
      setProducts(items);
      setTotal(total);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    storefrontApi.getProducts(buildProductQuery(params, nextPage)).then(({ items, total }) => {
      setProducts((prev) => [...prev, ...items]);
      setTotal(total);
      setPage(nextPage);
      setLoadingMore(false);
    });
  };

  return {
    products,
    total,
    loading,
    loadingMore,
    hasMore: products.length < total,
    loadMore,
  };
}
