"use client";

import { useEffect, useState } from "react";
import { storefrontApi } from "../lib/storefront-api";
import type { BuyingGuideWithCategory } from "../lib/catalog-helpers";

// Fetches every buying guide once on mount. Used wherever a component needs
// the full guide list client-side (currently just the Header's mega menu).
export function useGuides() {
  const [guides, setGuides] = useState<BuyingGuideWithCategory[]>([]);

  useEffect(() => {
    storefrontApi.getGuides().then(setGuides);
  }, []);

  return guides;
}
