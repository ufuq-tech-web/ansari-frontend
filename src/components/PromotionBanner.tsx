"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PromotionalBanner() {
  // Countdown timer (set to end of current month)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const tick = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="sale" className="relative w-full min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden bg-charcoal-900" aria-label="Seasonal promotion">
      {/* Full-width Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/promo/monsoon-banner.png"
          alt="Seasonal footwear collection"
          loading="lazy"
          className="w-full h-full object-cover object-right sm:object-center opacity-80"
        />
        {/* Gradient Overlay to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/95 via-charcoal-900/70 to-transparent" />
        {/* Mobile-only overlay to ensure text is completely readable on small screens */}
        <div className="absolute inset-0 bg-charcoal-900/50 md:hidden" />
      </div>

      {/* Content (Left aligned) */}
      <div className="container-main relative z-10 w-full py-16">
        <div className="max-w-xl">
          <span className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-manrope font-bold mb-5 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Limited Time Offer
          </span>
          <h2 className="font-sora font-extrabold tracking-tight text-white text-3xl sm:text-4xl lg:text-5xl lg:text-[3.5rem] leading-[1.1]">
            Monsoon Collection <span className="text-accent">Sale</span>
          </h2>
          <p className="mt-4 text-white/90 text-base sm:text-lg font-inter max-w-md">
            Step into the season with waterproof styles for the whole family. Up to 40% off on selected footwear.
          </p>

          {/* Countdown timer */}
          <div className="mt-8 flex items-center gap-3">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm font-inter">Ends in:</span>
            <div className="flex items-center gap-2">
              {[
                { value: timeLeft.days, label: 'D' },
                { value: timeLeft.hours, label: 'H' },
                { value: timeLeft.minutes, label: 'M' },
                { value: timeLeft.seconds, label: 'S' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 font-manrope font-bold text-white text-sm min-w-[36px] text-center">
                    {String(t.value).padStart(2, '0')}
                  </span>
                  <span className="text-white/50 text-xs font-manrope font-bold">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope font-extrabold text-white text-5xl tracking-tight">40%</span>
              <span className="font-manrope font-bold text-white/80 text-lg">OFF</span>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <span className="text-white font-inter text-sm">Use code <span className="font-manrope font-bold text-white bg-white/15 px-2 py-0.5 rounded">MONSOON40</span></span>
          </div>

          <Link href="/sale" className="mt-8 inline-flex w-fit items-center gap-2 bg-accent text-white font-manrope font-bold px-8 py-4 rounded-full hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 active:scale-95 transition-all duration-300 group/btn">
            Shop the Sale <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
