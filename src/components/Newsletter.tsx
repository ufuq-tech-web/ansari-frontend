"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Mail, CheckCircle2, Gift, Percent, Truck } from 'lucide-react';

const perks = [
  { icon: Percent, text: '10% off first order' },
  { icon: Gift, text: 'Exclusive deals' },
  { icon: Truck, text: 'Free shipping alerts' },
];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="newsletter" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Newsletter signup">
      <div className="container-main">
        <div className="relative rounded-3xl bg-charcoal-900 overflow-hidden p-8 sm:p-12 lg:p-16 text-center">
          {/* Sports background photo */}
          <Image
            src="/images/br.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1440px) 1440px, 100vw"
            className="object-cover"
          />
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900/95 via-charcoal-900/85 to-charcoal-900/95" />

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-leather-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03]" />
          <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-brand-orange/30 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-20 right-20 w-1.5 h-1.5 rounded-full bg-leather-300/30 animate-ping" style={{ animationDuration: '4s' }} />

          <div className="relative max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-leather-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-orange/20">
              <Mail className="w-8 h-8 text-white" strokeWidth={1.8} />
            </div>
            <h2 className="font-poppins font-bold text-white text-2xl sm:text-3xl lg:text-4xl">
              Get 10% Off Your First Order
            </h2>
            <p className="mt-3 text-white font-inter">
              Subscribe for exclusive offers, new arrivals, and footwear care tips — delivered to your inbox.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap justify-center gap-4 mt-5">
              {perks.map((perk) => (
                <div key={perk.text} className="flex items-center gap-1.5 text-white text-xs font-inter">
                  <perk.icon className="w-3.5 h-3.5 text-brand-orange" strokeWidth={2} />
                  {perk.text}
                </div>
              ))}
            </div>

            {submitted ? (
              <div className="mt-8 inline-flex items-center gap-2 bg-brand-green/15 text-brand-green px-6 py-3.5 rounded-full font-poppins font-semibold">
                <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                Thanks for subscribing! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white placeholder:text-white/40 font-inter outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                  aria-label="Email address"
                />
                <button type="submit" className="bg-gradient-to-r from-brand-orange to-leather-400 text-white font-poppins font-semibold px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-brand-orange/30 active:scale-95 transition-all duration-300 whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}

            <p className="mt-5 text-xs text-white font-inter">No spam, unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
