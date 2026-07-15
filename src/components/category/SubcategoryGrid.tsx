"use client";

import type { CategoryConfig } from '../../lib/catalog-helpers';

interface Props {
  category: CategoryConfig;
  activeSubcategory?: string;
  onSubcategoryClick?: (name: string) => void;
}

export default function SubcategoryGrid({ category, activeSubcategory, onSubcategoryClick }: Props) {
  return (
    <section id="subcategories" className="py-10 sm:py-12 bg-white border-b border-charcoal-200">
      <div className="container-main">
        <div className="flex items-end justify-between mb-6">
          <h2 className="section-heading text-xl sm:text-2xl">Shop by Style</h2>
          <span className="text-sm text-charcoal-500 font-inter hidden sm:block">{category.subcategories.length} subcategories</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {category.subcategories.map((sub) => {
            const isActive = sub.name === activeSubcategory;
            return (
              <button
                key={sub.name}
                onClick={() => onSubcategoryClick?.(sub.name)}
                aria-pressed={isActive}
                className="group flex flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 rounded-xl"
              >
                <div className={`w-full aspect-square rounded-xl overflow-hidden bg-charcoal-100 shadow-card group-hover:shadow-card-hover transition-all duration-300 ${isActive ? 'ring-2 ring-brand-orange ring-offset-2' : ''}`}>
                  <img
                    src={sub.image}
                    alt={sub.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <div className={`font-poppins font-medium text-xs sm:text-sm transition-colors ${isActive ? 'text-brand-orange' : 'text-charcoal-900 group-hover:text-brand-orange'}`}>{sub.name}</div>
                  <div className="text-[10px] sm:text-xs text-charcoal-400 font-inter">{sub.count} items</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
