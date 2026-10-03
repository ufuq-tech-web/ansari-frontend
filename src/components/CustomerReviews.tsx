"use client";

import { useRef } from 'react';
import { Star, BadgeCheck, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { Review } from '../lib/catalog-helpers';

export interface CustomerReviewsProps {
  reviews?: Review[];
  customReviews?: Review[];
  hook?: string;
  heading?: string;
  headingHighlight?: string;
  ratingSummary?: string;
}

export default function CustomerReviews({
  reviews = [],
  customReviews,
  hook,
  heading,
  headingHighlight,
  ratingSummary,
}: CustomerReviewsProps) {
  const activeReviews = customReviews && customReviews.length > 0 ? customReviews : reviews;
  const trackRef = useRef<HTMLDivElement>(null);

  if (!activeReviews.length) return null;

  const scroll = (dir: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.querySelector('[data-review-card]')?.getBoundingClientRect().width ?? 360;
    const gap = 20;
    track.scrollBy({ left: dir === 'left' ? -(cardWidth + gap) : (cardWidth + gap), behavior: 'smooth' });
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Customer reviews">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
          <div>
            <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide block mb-2">
              {hook || 'Loved by Families'}
            </span>
            <h2 className="section-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-primary whitespace-nowrap">
              {heading ? (
                <>
                  {heading}{' '}
                  {headingHighlight ? (
                    <span className="text-secondary">{headingHighlight}</span>
                  ) : null}
                </>
              ) : (
                <>
                  What Our <span className="text-secondary">Customers Say</span>
                </>
              )}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-brand-orange fill-brand-orange" strokeWidth={2} />
                ))}
              </div>
              <span className="text-sm text-primary/70 font-inter">
                {ratingSummary || '4.6 out of 5 · 12,000+ reviews'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 mt-4">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {activeReviews.map((r) => (
            <div
              key={r.id}
              data-review-card
              className="flex-shrink-0 w-[300px] sm:w-[380px] bg-brand-ivory rounded-2xl p-6 border border-charcoal-200 snap-start"
            >
              <Quote className="w-8 h-8 text-brand-orange/20" strokeWidth={2} />
              <div className="mt-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i <= r.rating ? 'text-brand-orange fill-brand-orange' : 'text-charcoal-200'}`}
                    strokeWidth={2}
                  />
                ))}
              </div>
              <p className="mt-3 text-charcoal-900 font-inter leading-relaxed">"{r.text}"</p>

              <div className="mt-5 pt-4 border-t border-charcoal-200 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-sora font-semibold flex-shrink-0">
                  {r.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sora font-semibold text-primary text-sm truncate">{r.name}</span>
                    {r.verified && (
                      <span className="flex items-center gap-0.5 text-brand-green text-[10px] font-manrope font-bold flex-shrink-0">
                        <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-charcoal-900 font-inter">{r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
