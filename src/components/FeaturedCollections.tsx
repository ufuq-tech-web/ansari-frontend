"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { collections } from '../lib/catalog-helpers';

export default function FeaturedCollections() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.min(track.clientWidth * 0.8, 400);
    track.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id="collections" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Featured collections">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
          <div>
            <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide block mb-2">Curated for You</span>
            <h2 className="section-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-primary">Featured <span className="text-secondary">Collections</span></h2>
            <p className="mt-4 text-black font-inter text-base md:text-lg">Handpicked styles for every occasion — from office to wedding day</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 mt-4">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label="Previous collections"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label="Next collections"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally scrollable on mobile, grid on desktop */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div
          ref={trackRef}
          className="flex lg:grid lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {collections.map((col, i) => (
            <Link
              key={col.name}
              href={col.href}
              className="group relative overflow-hidden transition-all duration-500 aspect-[3/4] sm:aspect-[4/5] rounded-2xl flex-shrink-0 w-[55vw] sm:w-[40vw] lg:w-auto snap-start"
            >
              <img
                src={col.image}
                alt={col.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/25 to-transparent group-hover:from-charcoal-900/90 transition-all duration-500" />

              {/* Number tag */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-xs font-manrope font-bold">0{i + 1}</span>
              </div>

              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="font-sora font-semibold text-white text-base sm:text-lg group-hover:translate-y-0 translate-y-1 transition-transform duration-300">{col.name}</h3>
                <p className="text-white/75 text-xs font-inter mt-0.5">{col.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-white text-xs font-manrope font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              {/* Shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
