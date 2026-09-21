"use client";

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { storefrontApi } from '../lib/storefront-api';
import type { Product } from '../lib/catalog-helpers';

export default function NewArrivals() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    storefrontApi.getProducts({ limit: 100 }).then((res) => {
      setProductsList(res.items.filter((p) => p.isNew));
    });
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.min(track.clientWidth * 0.8, 320);
    track.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id="new-arrivals" className="py-12 sm:py-16 lg:py-20 bg-brand-ivory" aria-label="New arrivals">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div>
            <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide block mb-2">Just In</span>
            <h2 className="section-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-primary">New <span className="text-secondary">Arrivals</span></h2>
          </div>

          {/* Carousel controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width carousel track */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div
          ref={trackRef}
          className="carousel-track flex gap-3 sm:gap-5 overflow-x-auto scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {productsList.map((p) => (
            <div key={p.id} className="carousel-item flex-shrink-0 w-[180px] sm:w-[260px] lg:w-[300px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
