"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { categories, slugify } from '../lib/catalog-helpers';

// Subcategory mapping for display
const subcategoriesData: Record<string, { name: string; image: string }[]> = {
  men: [
    { name: 'Formal Shoes', image: '/images/men-collection/men-formal-shoes.png' },
    { name: 'Casual Shoes', image: '/images/men-collection/men-casual-shoes.png' },
    { name: 'Sneakers', image: '/images/men-collection/men-sneakers.png' },
    { name: 'Sports Shoes', image: '/images/men-collection/men-sports-shoes.png' },
    { name: 'Sandals', image: '/images/men-collection/men-sandals.png' },
    { name: 'Slippers & Flip Flops', image: '/images/men-collection/men-slippers-flip-flops.png' },
    { name: 'Loafers', image: '/images/men-collection/men-loafers.png' },
    { name: 'Boots', image: '/images/men-collection/men-boots.png' },
  ],
  women: [
    { name: 'Flats', image: '/images/women-collection/women-flats.png' },
    { name: 'Sandals', image: '/images/women-collection/women-sandals.png' },
    { name: 'Slippers', image: '/images/women-collection/women-slippers.png' },
    { name: 'Kolhapuri Chappal', image: '/images/women-collection/women-kolhapuri-chappal.png' },
    { name: 'Mojari Shoes', image: '/images/women-collection/women-mojari-shoes.png' },
  ],
  kids: [
    { name: 'School Shoes', image: '/images/kids-collection/kids-school-shoes.png' },
    { name: 'Casual Shoes', image: '/images/kids-collection/kids-casual-shoes.png' },
    { name: 'Sneakers', image: '/images/kids-collection/kids-sneakers.png' },
    { name: 'Sandals', image: '/images/kids-collection/kids-sandals.png' },
    { name: 'Slippers', image: '/images/kids-collection/kids-slippers.png' },
    { name: 'Boys', image: '/images/kids-collection/kids-boys.png' },
    { name: 'Girls', image: '/images/kids-collection/kids-girls.png' },
    { name: 'New born baby', image: '/images/kids-collection/kids-new-born.png' },
    { name: 'Toddler (2–5 Years)', image: '/images/kids-collection/kids-toddler.png' },
    { name: 'Big Kids Shoes (10–14 Years)', image: '/images/kids-collection/kids-big-kids.png' },
  ],
  accessories: [
    { name: 'Socks', image: '/images/accessories-collection/accessories-socks.png' },
    { name: 'Shoe Care Products', image: '/images/accessories-collection/accessories-shoe-care-products.png' },
    { name: 'Shoes Polish', image: '/images/accessories-collection/accessories-shoes-polish.png' },
    { name: 'Shoes Brush', image: '/images/accessories-collection/accessories-shoes-brush.png' },
  ],
};

export default function CategorySection() {
  const [activeTab, setActiveTab] = useState('men');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const currentSubcategories = subcategoriesData[activeTab] || [];
  // Few enough cards to fit one row without scrolling (Women/Kids' 5,
  // Accessories' 4) — center them instead of left-aligning with empty
  // space on the right. Only Men's 8 still needs the scrollable row.
  const isScrollable = currentSubcategories.length > 5;

  return (
    <section id="categories" className="py-16 md:py-24 bg-white text-charcoal-900" aria-label="Shop by category">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        
        {/* Luxury Header & Tabs */}
        <div className="flex flex-col items-center text-center gap-8 mb-12 max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sora font-semibold tracking-tight text-primary mb-4 whitespace-nowrap">
              Explore <span className="text-secondary">Collections</span>
            </h2>
            <p className="text-black font-inter text-sm md:text-base whitespace-normal max-w-2xl mx-auto">
              Discover our meticulously curated selection of premium footwear and accessories, designed for every occasion.
            </p>
          </div>
          
          {/* Sleek Minimalist Tabs */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 border-b border-gray-200 pb-4 w-full">
            {categories.map((cat) => {
              const isActive = activeTab === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveTab(cat.name.toLowerCase())}
                  className={`relative font-manrope font-bold text-lg md:text-xl uppercase tracking-wider transition-colors duration-300 ${
                    isActive 
                      ? 'text-charcoal-900' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {cat.name}
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute -bottom-[17px] left-0 right-0 h-[3px] bg-brand-orange shadow-[0_0_10px_rgba(255,107,0,0.3)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Immersive Subcategory Slider */}
        <div className="relative w-full group/slider">
          <div 
            ref={scrollContainerRef}
            className={`flex gap-4 md:gap-6 lg:gap-8 pb-8 ${isScrollable ? 'overflow-x-auto scrollbar-hide snap-x' : 'flex-wrap justify-center'}`}
          >
            {currentSubcategories.map((sub) => (
              <Link
                key={sub.name}
                href={`/${activeTab}/${slugify(sub.name)}`}
                className="group relative flex flex-col justify-end shrink-0 snap-start w-[240px] md:w-[280px] lg:w-[320px] aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Image with Parallax-like scale effect */}
                <Image
                  src={sub.image}
                  alt={sub.name}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 240px"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Intense Dark Gradient for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Content Block */}
                <div className="relative z-10 p-6 md:p-8 w-full">
                  <h3 className="text-base md:text-lg font-sora font-semibold text-white uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-brand-orange transition-colors duration-300 drop-shadow-lg">
                    {sub.name}
                  </h3>
                  
                  {/* Sliding 'Shop Now' Button */}
                  <div className="flex items-center gap-2 mt-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                    <span className="text-sm md:text-base font-manrope font-semibold text-white">Explore</span>
                    <ArrowRight className="w-5 h-5 text-brand-orange" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Premium Glassmorphism Navigation Arrows */}
          {isScrollable && (
            <>
              <button
                onClick={scrollLeft}
                className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full items-center justify-center shadow-lg hover:shadow-xl hover:bg-gray-50 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 text-charcoal-900 hover:text-brand-orange"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollRight}
                className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full items-center justify-center shadow-lg hover:shadow-xl hover:bg-gray-50 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-10 text-charcoal-900 hover:text-brand-orange"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
