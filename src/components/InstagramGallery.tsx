"use client";

import { useState } from 'react';
import { Instagram, Heart, ExternalLink } from 'lucide-react';
import { instagramImages } from '../lib/catalog-helpers';

// Deterministic like counts to avoid SSR hydration mismatch (no Math.random)
const likeCounts = [127, 284, 93, 312, 176, 248, 159, 341, 127, 284, 93, 312, 176, 248, 159, 341];


export default function InstagramGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Double the images for seamless loop
  const doubledImages = [...instagramImages, ...instagramImages];

  return (
    <section id="instagram" className="py-12 sm:py-16 lg:py-20 bg-brand-ivory overflow-hidden" aria-label="Instagram gallery">
      <div className="container-main">
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-brand-orange to-leather-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-orange/20">
              <Instagram className="w-4 h-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-leather-400 font-poppins font-semibold text-sm uppercase tracking-wide">Follow Us</span>
          </div>
          <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl mt-2">See How Our Community Styles It</h2>
          <p className="mt-2 text-charcoal-900 font-inter">
            <span className="font-poppins font-semibold text-brand-orange">@ansaribootthouse</span> · Tag us to be featured
          </p>
        </div>
      </div>

      {/* Scrolling row 1 — left to right */}
      <div className="relative mb-3 sm:mb-4">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-brand-ivory to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-brand-ivory to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 sm:gap-4 animate-[scrollLeft_35s_linear_infinite] hover:[animation-play-state:paused]">
          {doubledImages.map((src, i) => (
            <a
              key={`row1-${i}`}
              href="#instagram"
              className="group relative block overflow-hidden flex-shrink-0 w-[200px] sm:w-[260px] lg:w-[300px] rounded-xl"
              aria-label={`Instagram post ${(i % instagramImages.length) + 1}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={src}
                alt={`Ansari Boot House lifestyle photo ${(i % instagramImages.length) + 1}`}
                loading="lazy"
                className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/0 to-charcoal-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Heart className="w-4 h-4" strokeWidth={2} />
                    <span className="text-xs font-poppins font-semibold">{likeCounts[i % likeCounts.length]}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Scrolling row 2 — right to left */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-brand-ivory to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-brand-ivory to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 sm:gap-4 animate-[scrollRight_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[...doubledImages].reverse().map((src, i) => (
            <a
              key={`row2-${i}`}
              href="#instagram"
              className="group relative block overflow-hidden flex-shrink-0 w-[200px] sm:w-[260px] lg:w-[300px] rounded-xl"
              aria-label={`Instagram post ${(i % instagramImages.length) + 1}`}
              onMouseEnter={() => setHoveredIndex(i + 100)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={src}
                alt={`Ansari Boot House lifestyle photo ${(i % instagramImages.length) + 1}`}
                loading="lazy"
                className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/0 to-charcoal-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Heart className="w-4 h-4" strokeWidth={2} />
                    <span className="text-xs font-poppins font-semibold">{likeCounts[i % likeCounts.length]}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container-main mt-8 text-center">
        <a
          href="https://instagram.com/ansaribootthouse"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-brand-orange to-leather-400 text-white font-poppins font-semibold px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-brand-orange/30 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Instagram className="w-5 h-5" strokeWidth={2} />
          Follow @ansaribootthouse
        </a>
      </div>
    </section>
  );
}
