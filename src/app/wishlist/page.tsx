"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Heart, Search, Loader2 } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import QuickViewModal from '../../components/category/QuickViewModal';
import type { Product } from '../../lib/catalog-helpers';
import AccountLayout, { AccountLoading } from '../../components/account/AccountLayout';
import { customerApi } from '../../lib/customer-api';
import { mapProduct } from '../../lib/storefront-api';
import { useWishlistStore } from '../../lib/wishlist-store';

export default function WishlistPage() {
  const { ids, hydrated, remove } = useWishlistStore();
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const fetchItems = useCallback(async (p: number, q: string, append: boolean = false) => {
    try {
      const qp = new URLSearchParams({ page: String(p), limit: '12' });
      if (q) qp.set('search', q);
      const res = await customerApi.get<any>(`/wishlist?${qp}`);
      const mapped = (res.items || []).map((row: any) => mapProduct(row.product));
      setItems((prev) => append ? [...prev, ...mapped] : mapped);
      setTotal(res.total || 0);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setLoading(true);
    fetchItems(1, search).finally(() => setLoading(false));
  }, [hydrated, search, fetchItems]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const next = page + 1;
    await fetchItems(next, search, true);
    setPage(next);
    setLoadingMore(false);
  };

  const handleRemove = (productId: string) => {
    // Optimistic UI update in the paginated view
    setItems((prev) => prev.filter(p => p.id !== productId));
    setTotal((prev) => Math.max(0, prev - 1));
    // Core context remove (hits backend)
    remove(productId);
  };

  if (!hydrated || loading) return <AccountLoading />;

  return (
    <AccountLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-light text-2xl sm:text-3xl text-charcoal-900 tracking-tight">Wishlist</h2>
          <p className="text-black font-inter text-sm mt-1">
            {search ? `Found ${total} items for "${search}"` : `${ids.length} total items saved.`}
          </p>
        </div>
        {(ids.length > 0 || search) && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search wishlist..."
              className="w-full pl-9 pr-4 py-2 bg-charcoal-50 border border-charcoal-200 rounded-xl text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange transition-colors focus:bg-white"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      {!search && ids.length === 0 ? (
        <div className="border border-charcoal-200 p-16 flex flex-col items-center justify-center text-center rounded-2xl">
          <Heart className="w-8 h-8 text-charcoal-300 mb-6" strokeWidth={1} />
          <h3 className="font-poppins font-light text-xl text-black mb-2">Your wishlist is empty</h3>
          <p className="text-black font-inter text-sm max-w-sm mb-8">Save items you love by tapping the heart icon on any product.</p>
          <Link href="/" className="text-xs font-poppins uppercase tracking-widest text-black hover:text-brand-orange underline underline-offset-4 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-charcoal-500 font-inter">No items found matching your search.</p>
          <button onClick={() => setSearch('')} className="mt-4 text-brand-orange font-poppins font-semibold text-sm hover:underline">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {items.map((product) => (
              <div key={product.id} className="flex flex-col gap-3">
                <ProductCard product={product} onWishlist={handleRemove} />
                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="w-full py-2.5 bg-brand-orange text-white font-poppins font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-[#e65c00] transition-all active:scale-[0.98] shadow-sm"
                >
                  Move to Cart
                </button>
              </div>
            ))}
          </div>

          {items.length < total && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn-secondary gap-2"
              >
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}

      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        onAddedToCart={(p) => handleRemove(p.id)}
      />
    </AccountLayout>
  );
}
