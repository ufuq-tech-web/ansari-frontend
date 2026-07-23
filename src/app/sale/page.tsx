import { storefrontApi } from '../../lib/storefront-api';
import ProductListingPage from '../../components/ProductListingPage';

export const metadata = {
  title: 'Sale — Ansari Boot House',
  description: 'Big discounts across Men, Women, Kids, and Accessories footwear — shop the sale while it lasts.',
};

export default async function SalePage() {
  const productsRes = await storefrontApi.getProducts({ limit: 100 });
  const products = productsRes.items.filter((p) => p.salePrice < p.price);

  return (
    <ProductListingPage
      title="Sale"
      subtitle="Up to 40% off across the whole family — grab your favorites before they're gone."
      products={products}
      heroImage="/images/sale-banner.png"
      defaultSort="discount"
    />
  );
}
