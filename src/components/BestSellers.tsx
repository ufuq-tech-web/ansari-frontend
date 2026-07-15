"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { storefrontApi } from '../lib/storefront-api';
import type { Product } from '../lib/catalog-helpers';

export default function BestSellers() {
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    storefrontApi.getProducts({ limit: 100 }).then((res) => {
      setProductsList(res.items.filter((p) => p.badge === "Bestseller").slice(0, 8));
    });
  }, []);

  return (
    <section id="bestsellers" className="py-12 sm:py-16 lg:py-20 bg-brand-ivory" aria-label="Best sellers">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <span className="text-brand-orange font-poppins font-semibold text-sm uppercase tracking-wide">Customer Favorites</span>
            <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl mt-1">Best Sellers</h2>
            <p className="mt-2 text-charcoal-900 font-inter">Top-rated styles loved by thousands of customers</p>
          </div>
          <Link href="/best-sellers" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive grid: 2 mobile, 4 tablet, 8 desktop (2 rows of 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
          {productsList.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
