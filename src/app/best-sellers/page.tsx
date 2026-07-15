import { storefrontApi } from "../../lib/storefront-api";
import ProductListingPage from "../../components/ProductListingPage";

export const metadata = {
  title: "Best Sellers — Ansari Boot House",
  description: "Our most-loved footwear styles across Men, Women, Kids, and Accessories — top-rated by thousands of customers.",
};

export default async function BestSellersPage() {
  const productsRes = await storefrontApi.getProducts({ limit: 100 });
  const products = productsRes.items.filter((p) => p.badge === "Bestseller");

  return (
    <ProductListingPage
      title="Best Sellers"
      subtitle="Top-rated styles loved by thousands of customers across the whole family."
      products={products}
      heroImage={products[0]?.image}
      defaultSort="best_selling"
    />
  );
}
