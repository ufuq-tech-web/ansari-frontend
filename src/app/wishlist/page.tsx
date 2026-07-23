"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import QuickViewModal from '../../components/category/QuickViewModal';
import { useWishlist } from '../../lib/wishlist-context';
import type { Product } from '../../lib/catalog-helpers';
import AccountLayout, { AccountLoading } from '../../components/account/AccountLayout';

export default function WishlistPage() {
  const { items, hydrated } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (!hydrated) return <AccountLoading />;

  return (
    <AccountLayout>
      <div className="mb-10">
        <h2 className="font-poppins font-light text-2xl sm:text-3xl text-charcoal-900 tracking-tight">Wishlist</h2>
        <p className="text-charcoal-500 font-inter text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} saved.</p>
      </div>

      {items.length === 0 ? (
        <div className="border border-charcoal-200 p-16 flex flex-col items-center justify-center text-center">
          <Heart className="w-8 h-8 text-charcoal-300 mb-6" strokeWidth={1} />
          <h3 className="font-poppins font-light text-xl text-charcoal-900 mb-2">Your wishlist is empty</h3>
          <p className="text-charcoal-500 font-inter text-sm max-w-sm mb-8">Save items you love by tapping the heart icon on any product.</p>
          <Link href="/" className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {items.map((product) => (
            <div key={product.id} onClick={() => setQuickViewProduct(product)} className="cursor-pointer">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </AccountLayout>
  );
}
