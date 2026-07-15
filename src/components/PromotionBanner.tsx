"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PromotionalBanner() {
  return (
    <section id="sale" className="py-12 sm:py-16 lg:py-20 bg-brand-ivory" aria-label="Seasonal promotion">
      <div className="container-main">
        <div className="relative rounded-3xl overflow-hidden shadow-card group">
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 sm:h-80 lg:h-auto order-1 lg:order-2">
              <img
                src="https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&fit=crop"
                alt="Seasonal footwear collection lifestyle shot"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Content */}
            <div className="bg-leather-400 p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-poppins font-semibold mb-5">
                Limited Time Offer
              </span>
              <h2 className="font-poppins font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.1]">
                Monsoon Collection Sale
              </h2>
              <p className="mt-4 text-white text-base sm:text-lg font-inter max-w-md">
                Step into the season with waterproof styles for the whole family. Up to 40% off on selected footwear.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-poppins font-bold text-white text-4xl">40%</span>
                  <span className="font-poppins font-semibold text-white/80 text-lg">OFF</span>
                </div>
                <div className="h-10 w-px bg-white/30" />
                <span className="text-white font-inter text-sm">Use code <span className="font-poppins font-semibold text-white">MONSOON40</span></span>
              </div>

              <Link href="/sale" className="mt-8 inline-flex w-fit items-center gap-2 bg-white text-leather-400 font-poppins font-semibold px-6 py-3 rounded-xl hover:bg-charcoal-50 active:scale-95 transition-all">
                Shop the Sale <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
