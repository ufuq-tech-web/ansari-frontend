"use client";

import { Instagram, Heart } from 'lucide-react';
import { instagramImages } from '../lib/catalog-helpers';

export default function InstagramGallery() {
  return (
    <section id="instagram" className="py-12 sm:py-16 lg:py-20 bg-brand-ivory" aria-label="Instagram gallery">
      <div className="container-main">
        <div className="text-center mb-8 lg:mb-10">
          <span className="text-leather-400 font-poppins font-semibold text-sm uppercase tracking-wide">Follow Us</span>
          <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl mt-1">@ansaribootthouse</h2>
          <p className="mt-2 text-charcoal-900 font-inter">Tag us to be featured · Show us how you style your shoes</p>
        </div>

        {/* Masonry-style grid via CSS columns */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
          {instagramImages.map((src, i) => (
            <a
              key={i}
              href="#instagram"
              className="group relative block rounded-2xl overflow-hidden shadow-card break-inside-avoid"
              aria-label={`Instagram post ${i + 1}`}
            >
              <img
                src={src}
                alt={`Ansari Boot House lifestyle photo ${i + 1}`}
                loading="lazy"
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white">
                  <Instagram className="w-5 h-5" strokeWidth={2} />
                  <Heart className="w-4 h-4" strokeWidth={2} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
