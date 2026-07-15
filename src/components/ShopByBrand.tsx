"use client";

import { useEffect, useState } from 'react';
import { storefrontApi } from '../lib/storefront-api';

export default function ShopByBrand() {
  const [brandsList, setBrandsList] = useState<any[]>([]);

  useEffect(() => {
    storefrontApi.getBrands().then(setBrandsList);
  }, []);

  return (
    <section id="brands" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Shop by brand">
      <div className="container-main">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl">Shop by Brand</h2>
          <p className="mt-2 text-charcoal-900 font-inter">Trusted brands for every need and budget</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {brandsList.map((b) => (
            <a
              key={b.id}
              href={`/brands/${b.slug}`}
              className="group aspect-[5/3] rounded-xl border border-charcoal-200 bg-white flex items-center justify-center hover:border-charcoal-300 hover:shadow-card transition-all duration-300"
              aria-label={`Shop ${b.name} brand`}
            >
              <span className="font-poppins font-bold text-lg sm:text-xl text-charcoal-900 group-hover:text-brand-orange transition-colors duration-300">
                {b.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
