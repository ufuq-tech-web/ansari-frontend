"use client";

import Image from 'next/image';
import type { CategoryConfig } from '../../lib/catalog-helpers';

interface Props {
  category: CategoryConfig;
  activeSubcategory?: string;
  onSubcategoryClick?: (name: string) => void;
}

export default function SubcategoryGrid({ category, activeSubcategory, onSubcategoryClick }: Props) {
  return (
    <section id="subcategories" className="py-10 sm:py-12 bg-white border-b border-charcoal-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-8 max-w-2xl mx-auto">
          <div>
            <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide block mb-2">Curated Categories</span>
            <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-primary">Shop by <span className="text-secondary">Style</span></h2>
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 sm:gap-6 lg:gap-8 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-auto lg:px-0 lg:w-max lg:max-w-full">
          {category.subcategories.map((sub) => {
            const isActive = sub.name === activeSubcategory;
            return (
              <button
                key={sub.name}
                onClick={() => onSubcategoryClick?.(sub.name)}
                aria-pressed={isActive}
                className="group flex-shrink-0 snap-start flex flex-col items-center gap-3 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 rounded-xl w-[120px] sm:w-[140px] lg:w-[160px]"
              >
                <div className={`relative w-full aspect-square rounded-xl overflow-hidden bg-charcoal-100 shadow-card group-hover:shadow-card-hover transition-all duration-300 ${isActive ? 'ring-2 ring-brand-orange ring-offset-2' : ''}`}>
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 140px, 120px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <div className={`font-manrope font-bold text-xs sm:text-sm transition-colors ${isActive ? 'text-accent' : 'text-primary group-hover:text-accent'}`}>{sub.name}</div>
                  <div className="text-[10px] sm:text-xs text-primary/60 font-inter mt-0.5">{sub._count?.products || 0} items</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
