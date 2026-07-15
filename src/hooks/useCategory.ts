"use client";

import { useEffect, useState } from "react";
import { storefrontApi } from "../lib/storefront-api";
import type { CategoryConfig } from "../lib/catalog-helpers";

// Fetches a category's full config (products, subcategories, guides, FAQs).
// If `initialConfig` was already fetched server-side and matches `categoryKey`,
// the client-side fetch is skipped entirely — this only re-fetches when
// navigating client-side to a different category without a full page reload.
export function useCategory(categoryKey: string, initialConfig: CategoryConfig | null) {
  const [config, setConfig] = useState<CategoryConfig | null>(initialConfig);
  const [loading, setLoading] = useState(!initialConfig);

  useEffect(() => {
    let active = true;
    if (initialConfig && initialConfig.key === categoryKey) {
      setConfig(initialConfig);
      setLoading(false);
      return;
    }

    setLoading(true);
    storefrontApi.getCategory(categoryKey).then((data) => {
      if (!active) return;
      setConfig(data);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [categoryKey, initialConfig]);

  return { config, loading };
}
