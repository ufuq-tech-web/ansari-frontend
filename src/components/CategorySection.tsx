"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '../lib/catalog-helpers';

export default function CategorySection() {
  return (
    <section id="categories" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Shop by category">
      <div className="container-main">
        <div className="mb-8 lg:mb-10">
          <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl">Shop by Category</h2>
          <p className="mt-2 text-charcoal-900 font-inter">Find the perfect pair for everyone in the family</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[4/5]"
            >
              <img
                src={cat.image}
                alt={`${cat.name} footwear collection`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />

              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                <h3 className="font-poppins font-semibold text-white text-lg sm:text-xl lg:text-2xl">{cat.name}</h3>
                <p className="text-white/80 text-xs sm:text-sm font-inter mt-0.5">{cat.count}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-white text-sm font-poppins font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
