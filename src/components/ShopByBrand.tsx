"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storefrontApi } from '../lib/storefront-api';

export default function ShopByBrand() {
  const [brandsList, setBrandsList] = useState<any[]>([]);

  useEffect(() => {
    storefrontApi.getBrands().then(setBrandsList);
  }, []);

  if (!brandsList.length) return null;

  // Quadruple the list to ensure the marquee spans the screen and loops seamlessly
  const repeatedBrands = [...brandsList, ...brandsList, ...brandsList, ...brandsList];

  return (
    <section id="brands" className="py-16 sm:py-24 bg-white border-y border-gray-100 overflow-hidden" aria-label="Shop by brand">
      <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
        <div>
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide block mb-2">Premium Partners</span>
          <h2 className="section-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-primary">Discover <span className="text-secondary">Brands</span></h2>
        </div>
      </div>
      
      {/* Infinite scrolling marquee */}
      <div className="relative flex overflow-x-hidden group py-4">
        <div className="flex w-max items-center animate-[scrollLeft_30s_linear_infinite] group-hover:[animation-play-state:paused]">
          {repeatedBrands.map((b, i) => (
            <Link 
              key={`${b.id}-${i}`} 
              href={`/brands/${b.slug}`}
              className="flex items-center mx-6 sm:mx-10 transition-transform duration-300 hover:scale-105"
            >
              <span 
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-sora font-extrabold uppercase leading-none transition-all duration-300"
                style={{ WebkitTextStroke: '2px #1F2937', color: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1F2937';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'transparent';
                }}
              >
                {b.name}
              </span>
              {/* Brand Separator Star */}
              <span className="mx-6 sm:mx-10 text-brand-orange text-2xl sm:text-4xl animate-pulse">
                ✦
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
