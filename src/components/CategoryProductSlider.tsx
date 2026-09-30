"use client";

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ProductWithCategory } from '../lib/catalog-helpers';

interface Props {
  title: string;
  // Default heading is a centered eyebrow + h2 built from eyebrow/highlight.
  // Pass `heading` instead (e.g. a promo-strip banner) to replace it entirely
  // — `title` is still used for the scroll-button aria-labels either way.
  eyebrow?: string;
  highlight?: string;
  heading?: ReactNode;
  products: ProductWithCategory[];
  shopAllHref: string;
  isFallback?: boolean;
  fallbackNote?: string;
  emptyMessage?: string;
}

export default function CategoryProductSlider({
  title,
  eyebrow,
  highlight = '',
  heading,
  products,
  shopAllHref,
  isFallback,
  fallbackNote = "Nothing here yet — here's what's popular in this category.",
  emptyMessage = 'No products in this category just yet — check back soon.',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Few enough cards to fit one row without scrolling — center them instead
  // of using the horizontal-scroll layout, which leaves a lot of empty space.
  const isScrollable = products.length > 4;

  const scroll = (dir: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.min(track.clientWidth * 0.8, 320);
    track.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const highlightIndex = highlight ? title.indexOf(highlight) : -1;
  const before = highlightIndex >= 0 ? title.slice(0, highlightIndex) : title;
  const after = highlightIndex >= 0 ? title.slice(highlightIndex + highlight.length) : '';

  return (
    <div>
      {heading ?? (
        <div className="flex flex-col items-center text-center gap-2 mb-6 sm:mb-8">
          <span className="text-accent font-manrope font-semibold text-xs uppercase tracking-wide">{eyebrow}</span>
          <h2 className="section-heading text-lg sm:text-xl md:text-2xl tracking-tight text-primary">
            {before}
            {highlightIndex >= 0 && <span className="text-secondary">{highlight}</span>}
            {after}
          </h2>
        </div>
      )}
      {isFallback && products.length > 0 && (
        <p className="text-charcoal-400 font-inter text-xs sm:text-sm text-center mt-3 mb-6 sm:mb-8">{fallbackNote}</p>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-charcoal-200 bg-white p-8 text-center">
          <p className="text-charcoal-500 font-inter text-sm">{emptyMessage}</p>
          <Link href={shopAllHref} className="mt-2 inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
            Shop this category
          </Link>
        </div>
      ) : isScrollable ? (
        <>
          <div className="hidden sm:flex items-center justify-end gap-2 mb-4">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label={`Previous — ${title}`}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label={`Next — ${title}`}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          <div
            ref={trackRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {products.map((p) => (
              <div key={p.id} className="flex-shrink-0 w-[180px] sm:w-[240px] lg:w-[270px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </>
      ) : (
        // Few products — a left-aligned scroll row leaves a wall of empty
        // space on wider screens, so center a wrapped row of larger cards
        // instead of forcing the horizontal-scroll layout.
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
          {products.map((p) => (
            <div key={p.id} className="w-[200px] sm:w-[260px] lg:w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
