"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Award, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    image: '/images/hero/hero-slide-1-new.png',
    badge: '25+ Years of Trusted Service',
    badgeIcon: Award,
    title: <>Quality Footwear for{' '}<br className="hidden sm:block" /><span className="text-secondary">Every Step</span> of Life</>,
    description: 'Discover affordable footwear for men, women, and kids with trusted quality, stylish designs, and over 25 years of retail experience.',
    primaryLink: { href: '/men', label: 'Shop Men' },
    secondaryLink: { href: '/women', label: 'Shop Women' },
  },
  {
    image: '/images/hero/hero-slide-2-new.png',
    badge: 'New Season Collection',
    badgeIcon: Star,
    title: <>Elegant <span className="text-secondary">Women&apos;s</span>{' '}<br className="hidden sm:block" />Footwear Collection</>,
    description: 'From stunning heels to comfortable flats — find the perfect pair for every occasion. Premium quality at prices you\'ll love.',
    primaryLink: { href: '/women', label: 'Shop Women' },
    secondaryLink: { href: '/new-arrivals', label: 'New Arrivals' },
  },
  {
    image: '/images/hero/hero-slide-3-new.png',
    badge: 'Back to School Ready',
    badgeIcon: Shield,
    title: <>Fun & Durable{' '}<br className="hidden sm:block" /><span className="text-secondary">Kids&apos; Shoes</span> They&apos;ll Love</>,
    description: 'Colorful, comfortable, and built to last — explore our vibrant collection of school shoes, sneakers, and sports shoes for kids.',
    primaryLink: { href: '/kids', label: 'Shop Kids' },
    secondaryLink: { href: '/best-sellers', label: 'Best Sellers' },
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goToSlide = useCallback((index: number, dir: 'left' | 'right' = 'right') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(dir);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length, 'right');
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length, 'left');
  }, [currentSlide, goToSlide]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <section className="relative bg-charcoal-900 overflow-hidden" aria-label="Hero">
      <div className="relative h-[560px] sm:h-[620px] lg:h-[680px] w-full">
        {/* Slide images with crossfade and Ken Burns effect */}
        {heroSlides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt={`Hero slide ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${i === currentSlide
                ? 'opacity-100 scale-100 transition-transform duration-[10000ms] ease-out'
                : 'opacity-0 scale-110 transition-transform duration-[1000ms] ease-in'
              }`}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/55 to-charcoal-900/10" />

        {/* Animated particle/sparkle accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-leather-300/30 animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-brand-orange/25 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-1/3 right-1/2 w-1 h-1 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '4s' }} />
        </div>

        {/* Content */}
        <div className="relative h-full container-main flex items-center">
          <div className="max-w-xl">
            <span
              key={`badge-${currentSlide}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-manrope font-semibold mb-5 animate-[fadeSlideUp_0.6s_ease-out_0.1s_both]"
            >
              <BadgeIcon className="w-3.5 h-3.5" strokeWidth={2} />
              {slide.badge}
            </span>

            <h1
              key={`title-${currentSlide}`}
              className="font-sora font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] leading-[1.1] tracking-tight animate-[fadeSlideUp_0.6s_ease-out_0.2s_both]"
            >
              {slide.title}
            </h1>

            <p
              key={`desc-${currentSlide}`}
              className="mt-5 text-white/80 text-base sm:text-lg leading-relaxed font-inter max-w-lg animate-[fadeSlideUp_0.6s_ease-out_0.35s_both]"
            >
              {slide.description}
            </p>

            <div
              key={`btns-${currentSlide}`}
              className="mt-7 flex flex-col sm:flex-row gap-3 animate-[fadeSlideUp_0.6s_ease-out_0.5s_both]"
            >
              <Link href={slide.primaryLink.href} className="btn-primary justify-center">
                {slide.primaryLink.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={slide.secondaryLink.href} className="btn-secondary justify-center bg-white/10 border-white/20 text-white hover:bg-white/20">
                {slide.secondaryLink.label}
              </Link>
            </div>

            {/* Trust points */}
            <div
              key={`trust-${currentSlide}`}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3 animate-[fadeSlideUp_0.6s_ease-out_0.65s_both]"
            >
              <span className="flex items-center gap-2 text-sm text-white/85 font-inter">
                <Shield className="w-4 h-4 text-brand-green" strokeWidth={2} />
                Secure Payments
              </span>
              <span className="flex items-center gap-2 text-sm text-white/85 font-inter">
                <Star className="w-4 h-4 text-brand-orange" strokeWidth={2} />
                4.6/5 Customer Rating
              </span>
              <span className="flex items-center gap-2 text-sm text-white/85 font-inter">
                <Award className="w-4 h-4 text-leather-300" strokeWidth={2} />
                100% Authentic Products
              </span>
            </div>
          </div>
        </div>

        {/* Slide navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i, i > currentSlide ? 'right' : 'left')}
              className={`relative h-2.5 rounded-full transition-all duration-500 ${i === currentSlide
                  ? 'w-10 bg-brand-orange'
                  : 'w-2.5 bg-white/40 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === currentSlide && (
                <span className="absolute inset-0 rounded-full bg-brand-orange animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Floating trust badge */}
        <div className="hidden sm:flex absolute bottom-16 right-6 lg:right-10 bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-4 items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="font-sora font-semibold text-white text-sm">Quality Guaranteed</div>
            <div className="text-xs text-white/70 font-inter">Easy 7-day returns</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
          <div
            key={`progress-${currentSlide}`}
            className="h-full bg-gradient-to-r from-brand-orange to-leather-300 animate-[progressBar_6s_linear_forwards]"
          />
        </div>
      </div>
    </section>
  );
}
