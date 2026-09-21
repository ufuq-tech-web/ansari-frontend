"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { categories, slugify } from '../lib/catalog-helpers';

// Subcategory mapping for display
const subcategoriesData: Record<string, { name: string; image: string }[]> = {
  men: [
    { name: 'Formal Shoes', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Casual Shoes', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Sports Shoes', image: 'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Leather Sandals', image: 'https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Loafers', image: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Boots', image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Flip Flops', image: 'https://images.pexels.com/photos/1750045/pexels-photo-1750045.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Slides', image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Oxfords', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Sneakers', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Slip Ons', image: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  ],
  women: [
    { name: 'Heels', image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Wedges', image: 'https://images.pexels.com/photos/1376042/pexels-photo-1376042.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Flats', image: 'https://images.pexels.com/photos/1750045/pexels-photo-1750045.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Sneakers', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Strappy Sandals', image: 'https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Ethnic Sandals', image: 'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Slippers', image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Boots', image: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Slides', image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Flip Flops', image: 'https://images.pexels.com/photos/1750045/pexels-photo-1750045.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  ],
  kids: [
    { name: 'School Shoes', image: 'https://images.pexels.com/photos/5275375/pexels-photo-5275375.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Sneakers', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Sports', image: 'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Sandals', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Slippers', image: 'https://images.pexels.com/photos/1750045/pexels-photo-1750045.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Slides', image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  ],
  accessories: [
    { name: 'Shoe Polish', image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Brushes', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Insoles', image: 'https://images.pexels.com/photos/1376042/pexels-photo-1376042.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Shoe Bags', image: 'https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Travel Bags', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
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

  return (
    <section id="categories" className="py-16 md:py-24 bg-white text-charcoal-900" aria-label="Shop by category">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        
        {/* Luxury Header & Tabs */}
        <div className="flex flex-col items-center text-center gap-8 mb-12 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sora font-extrabold tracking-tight text-primary mb-4 whitespace-nowrap">
              Explore <span className="text-secondary">Collections</span>
            </h2>
            <p className="text-black font-inter text-base md:text-lg whitespace-normal max-w-2xl mx-auto">
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
            className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide snap-x pb-8"
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
                  <h3 className="text-2xl md:text-3xl font-sora font-semibold text-white uppercase tracking-wide group-hover:text-brand-orange transition-colors duration-300 drop-shadow-lg">
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
        </div>
      </div>
    </section>
  );
}
