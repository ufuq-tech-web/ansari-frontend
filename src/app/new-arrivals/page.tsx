import { storefrontApi } from '../../lib/storefront-api';
import ProductListingPage from '../../components/ProductListingPage';

export const metadata = {
  title: 'New Arrivals — Ansary Footwear',
  description: 'The latest footwear styles just landed — fresh drops across Men, Women, Kids, and Accessories.',
};

export default async function NewArrivalsPage() {
  const productsRes = await storefrontApi.getProducts({ limit: 100 });
  const products = productsRes.items.filter((p) => p.isNew);

  return (
    <ProductListingPage
      title="New Arrivals"
      subtitle="Fresh drops across Men, Women, Kids & Accessories — just landed."
      products={products}
      heroImage="/images/new-arrivals-banner.png"
      defaultSort="newest"
    />
  );
}
