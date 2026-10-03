"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ProductWithCategory } from '../lib/catalog-helpers';

export interface BestSellersProps {
  products: ProductWithCategory[];
  hook?: string;
  heading?: string;
  headingHighlight?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function BestSellers({
  products,
  hook,
  heading,
  headingHighlight,
  description,
  viewAllHref,
  viewAllLabel,
}: BestSellersProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="bestsellers" className="pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20 bg-brand-ivory relative overflow-hidden" aria-label="Best sellers">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-leather-400/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto relative">
        <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
          <div>
            <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide block mb-2">
              {hook || 'Customer Favorites'}
            </span>
            <h2 className="section-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-primary">
              {heading ? (
                <>
                  {heading}{' '}
                  {headingHighlight ? (
                    <span className="text-secondary">{headingHighlight}</span>
                  ) : null}
                </>
              ) : (
                <>
                  Best <span className="text-secondary">Sellers</span>
                </>
              )}
            </h2>
            <p className="mt-4 text-black font-inter text-base md:text-lg">
              {description || 'Top-rated styles loved by thousands of customers'}
            </p>
          </div>
          <Link
            href={viewAllHref || '/shoes-collection/best-selling-shoes'}
            className="inline-flex items-center gap-1.5 text-brand-orange font-manrope font-semibold text-sm hover:gap-2.5 transition-all mt-2"
          >
            {viewAllLabel || 'View All'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive grid: 2 mobile, 4 tablet, 8 desktop (2 rows of 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p, index) => (
            <div
              key={p.id}
              className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
