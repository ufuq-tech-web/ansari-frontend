"use client";

import { Instagram } from 'lucide-react';
import { instagramImages } from '../lib/catalog-helpers';

const featuredImages = instagramImages.slice(0, 6);

export default function InstagramGallery() {
  return (
    <section id="instagram" className="py-12 sm:py-16 lg:py-20 bg-brand-ivory" aria-label="Instagram gallery">
      <div className="container-main">
        <div className="text-center mb-8 lg:mb-10">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-brand-orange to-leather-400 shadow-lg shadow-brand-orange/20">
            <Instagram className="w-5 h-5 text-white" strokeWidth={2.5} />
          </span>
          <p className="mt-3 text-leather-400 font-manrope font-semibold text-xs uppercase tracking-[0.2em]">Follow The House</p>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-brand-orange mt-1">@ansarifootwear</h2>
          <p className="mt-2 text-charcoal-900 font-inter">
            Tag <span className="font-poppins font-semibold text-brand-orange">#AnsariFootwear</span> to be featured — join 48k+ shoe lovers.
          </p>
        </div>

        {/* Static photo row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {featuredImages.map((src, i) => (
            <a
              key={i}
              href="#instagram"
              className="group relative block overflow-hidden rounded-xl aspect-square"
              aria-label={`Instagram post ${i + 1}`}
            >
              <img
                src={src}
                alt={`Ansary Footwear lifestyle photo ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://instagram.com/ansarifootwear"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-transparent border border-leather-400 text-leather-400 font-manrope font-semibold text-sm uppercase tracking-wide px-8 py-3 hover:bg-leather-400 hover:text-white transition-colors duration-300"
          >
            <Instagram className="w-4 h-4" strokeWidth={2} />
            Follow On Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
