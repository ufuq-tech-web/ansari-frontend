"use client";

import Link from 'next/link';
import { ArrowRight, Shield, Award, Star } from 'lucide-react';

const heroImages = [
  {
    // Prev remote image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=500&h=660&fit=crop'
    src: '/images/hero/hero-1.png',
    alt: 'Men wearing formal leather shoes',
    aspect: 'aspect-[4/5]',
  },
  {
    // Prev remote image: 'https://images.pexels.com/photos/1620075/pexels-photo-1620075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'
    src: '/images/hero/hero-2.png',
    alt: 'Kids wearing comfortable school shoes',
    aspect: 'aspect-square',
  },
  {
    // Prev remote image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'
    src: '/images/hero/hero-3.png',
    alt: 'Women wearing stylish heels',
    aspect: 'aspect-square',
  },
  {
    // Prev remote image: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=500&h=660&fit=crop'
    src: '/images/hero/hero-4.png',
    alt: 'Premium leather boots collection',
    aspect: 'aspect-[4/5]',
  },
];

export default function HeroSection() {
  const [col1, col2] = [heroImages.slice(0, 2), heroImages.slice(2, 4)];

  return (
    <section className="relative bg-brand-ivory overflow-hidden" aria-label="Hero">
      <div className="container-main py-8 sm:py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Text column — split so the image can slot between the two halves on mobile, while staying one block on desktop */}
          <div className="contents lg:block">
            {/* Hook + heading + description */}
            <div className="order-1 max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-xs font-poppins font-semibold mb-5">
                <Award className="w-3.5 h-3.5" strokeWidth={2} />
                25+ Years of Trusted Service
              </span>

              <h1 className="font-poppins font-extrabold text-charcoal-900 text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] leading-[1.1] tracking-tight">
                Quality Footwear for{' '}
                <br className="hidden sm:block" />
                <span className="text-leather-400">Every Step</span> of Life
              </h1>

              <p className="mt-5 text-charcoal-900 text-base sm:text-lg leading-relaxed font-inter max-w-lg">
                Discover affordable footwear for men, women, and kids with trusted quality, stylish designs, and over 25 years of retail experience.
              </p>
            </div>

            {/* CTA buttons + trust points */}
            <div className="order-3 max-w-xl">
              <div className="mt-0 lg:mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/men" className="btn-primary justify-center">
                  Shop Men <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/women" className="btn-secondary justify-center">
                  Shop Women
                </Link>
              </div>

              {/* Trust points */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                <span className="flex items-center gap-2 text-sm text-charcoal-900 font-inter">
                  <Shield className="w-4 h-4 text-brand-green" strokeWidth={2} />
                  Secure Payments
                </span>
                <span className="flex items-center gap-2 text-sm text-charcoal-900 font-inter">
                  <Star className="w-4 h-4 text-brand-orange" strokeWidth={2} />
                  4.6/5 Customer Rating
                </span>
                <span className="flex items-center gap-2 text-sm text-charcoal-900 font-inter">
                  <Award className="w-4 h-4 text-leather-400" strokeWidth={2} />
                  100% Authentic Products
                </span>
              </div>
            </div>
          </div>

          {/* Image collage */}
          <div className="order-2 relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Column 1 */}
              <div className="space-y-3 sm:space-y-4">
                {col1.map((img) => (
                  <div key={img.src} className={`rounded-2xl overflow-hidden ${img.aspect} shadow-card group bg-charcoal-100`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
              {/* Column 2 — offset downward for visual rhythm */}
              <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
                {col2.map((img) => (
                  <div key={img.src} className={`rounded-2xl overflow-hidden ${img.aspect} shadow-card group bg-charcoal-100`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating trust badge */}
            <div className="hidden sm:flex absolute -bottom-3 -left-3 lg:bottom-6 lg:-left-6 bg-white rounded-2xl shadow-card-hover p-4 items-center gap-3 border border-charcoal-200">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-brand-green" strokeWidth={2} />
              </div>
              <div>
                <div className="font-poppins font-semibold text-charcoal-900 text-sm">Quality Guaranteed</div>
                <div className="text-xs text-charcoal-500 font-inter">Easy 7-day returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
