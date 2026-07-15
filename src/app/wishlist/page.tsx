"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import QuickViewModal from '../../components/category/QuickViewModal';
import { useWishlist } from '../../lib/wishlist-context';
import type { Product } from '../../lib/catalog-helpers';

export default function WishlistPage() {
  const { items, hydrated } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Wishlist hero">
        <div className="relative container-main py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Wishlist</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl leading-tight">My Wishlist</h1>
          <p className="mt-3 text-white/75 text-base font-inter">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
        {items.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-charcoal-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-charcoal-400" strokeWidth={2} />
            </div>
            <h3 className="font-poppins font-semibold text-charcoal-900 text-lg">Your wishlist is empty</h3>
            <p className="text-charcoal-500 font-inter mt-1 text-sm mb-4">Save items you love by tapping the heart icon on any product.</p>
            <Link href="/" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {items.map((product) => (
              <div key={product.id} onClick={() => setQuickViewProduct(product)} className="cursor-pointer">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
