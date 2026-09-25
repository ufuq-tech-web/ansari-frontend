"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Play, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { instagramImages } from '../lib/catalog-helpers';

const stories = [
  { title: "Men's styles", description: 'Classic looks for every move.', cta: 'Shop men', href: '/men/casual-shoes' },
  { title: "Women's picks", description: 'From everyday to standout.', cta: 'Shop women', href: '/women/heels' },
  { title: "Kids' favorites", description: 'Little steps, big adventures.', cta: 'Shop kids', href: '/kids/school-shoes' },
  { title: 'Everyday comfort', description: 'Made for real life.', cta: 'Shop sneakers', href: '/men/sports-shoes' },
  { title: 'Family moments', description: 'Shoes for every story.', cta: 'Shop all', href: '/' },
  { title: 'Office ready', description: 'Sharp looks for the workday.', cta: 'Shop formals', href: '/men/formal-shoes' },
  { title: 'Finishing touches', description: 'The details that complete a look.', cta: 'Shop accessories', href: '/accessories' },
  { title: 'New season edit', description: "What's new this week.", cta: 'Shop new', href: '/new-arrivals' },
];

export default function InstagramGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateProgress = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const frac = max > 0 ? el.scrollLeft / max : 0;
    setProgress(frac);
    setActiveIndex(Math.min(stories.length - 1, Math.round(frac * (stories.length - 1))));
  };

  useEffect(() => {
    updateProgress();
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section id="instagram" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden" aria-label="Community showcase">
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-brand-orange to-leather-400 shadow-lg shadow-brand-orange/20">
            <Instagram className="w-5 h-5 text-white" strokeWidth={2.5} />
          </span>
          <p className="mt-3 text-brand-orange font-manrope font-semibold text-xs uppercase tracking-[0.2em]">The Ansari Community</p>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-charcoal-900 mt-1">See how our community wears it</h2>
          <p className="mt-2 text-charcoal-500 font-inter">
            <span className="font-poppins font-semibold text-brand-orange">@ansarifootwear</span> · Tag us to be featured
            <span className="mx-2 text-charcoal-300">·</span>
            Watch, discover, shop.
          </p>
        </div>

        <div className="hidden sm:flex items-center justify-end gap-3 mb-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="w-11 h-11 rounded-full border border-charcoal-200 bg-white flex items-center justify-center text-charcoal-900 hover:border-brand-orange hover:text-brand-orange transition-colors duration-300"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="w-11 h-11 rounded-full bg-brand-orange flex items-center justify-center text-white hover:bg-leather-400 transition-colors duration-300"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div
          ref={trackRef}
          onScroll={updateProgress}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {stories.map((story, i) => (
            <Link
              key={story.title}
              href={story.href}
              data-card
              className="group relative flex-shrink-0 w-[70vw] xs:w-[55vw] sm:w-[38vw] md:w-[28vw] lg:w-[19%] aspect-[3/4] rounded-2xl overflow-hidden snap-start bg-charcoal-100"
              aria-label={`${story.title} — ${story.cta}`}
            >
              <Image
                src={instagramImages[i % instagramImages.length]}
                alt={`${story.title} — Ansary Footwear community photo`}
                fill
                sizes="(min-width: 1024px) 19vw, (min-width: 640px) 38vw, 70vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-12 h-12 rounded-full bg-white/15 border border-white/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                  <Play className="w-4 h-4 text-white translate-x-[1px]" fill="currentColor" strokeWidth={0} />
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="text-white font-poppins font-semibold text-base sm:text-lg leading-tight">{story.title}</h3>
                <p className="text-white/75 font-inter text-xs sm:text-sm mt-1">{story.description}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 bg-white text-charcoal-900 text-xs sm:text-sm font-manrope font-semibold px-3.5 py-1.5 rounded-full group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                  {story.cta}
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <div className="flex-1 h-1 rounded-full bg-charcoal-100 overflow-hidden">
            <div
              className="h-full bg-brand-orange rounded-full transition-[width] duration-300"
              style={{ width: `${Math.max(12, progress * 100)}%` }}
            />
          </div>
          <span className="font-manrope text-xs text-charcoal-500 tabular-nums flex-shrink-0">
            {String(activeIndex + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://instagram.com/ansarifootwear"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-orange font-manrope font-semibold text-sm hover:gap-3 transition-all duration-300"
          >
            Explore all styles
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
