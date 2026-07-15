"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { collections } from '../lib/catalog-helpers';

export default function FeaturedCollections() {
  return (
    <section id="collections" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Featured collections">
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-10">
          <span className="text-leather-400 font-poppins font-semibold text-sm uppercase tracking-wide">Curated for You</span>
          <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl mt-1">Featured Collections</h2>
          <p className="mt-3 text-charcoal-900 font-inter">Handpicked styles for every occasion — from office to wedding day</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
          {collections.map((col) => (
            <Link
              key={col.name}
              href={col.href}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[4/5]"
            >
              <img
                src={col.image}
                alt={col.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/25 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="font-poppins font-semibold text-white text-base sm:text-lg">{col.name}</h3>
                <p className="text-white/75 text-xs font-inter mt-0.5">{col.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-white text-xs font-poppins font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
