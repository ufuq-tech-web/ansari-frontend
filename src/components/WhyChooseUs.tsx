"use client";

import { useEffect, useRef, useState } from 'react';
import { Award, IndianRupee, BadgeCheck, Truck, Users, ShoppingBag, MapPin, Star } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: '25+ Years Experience',
    description: 'Trusted footwear retailer serving families since 1998 with consistent quality.',
    gradient: 'from-amber-400 to-brand-orange',
  },
  {
    icon: IndianRupee,
    title: 'Affordable Pricing',
    description: 'Quality footwear at honest prices for every budget — no premium markups.',
    gradient: 'from-emerald-400 to-brand-green',
  },
  {
    icon: BadgeCheck,
    title: 'Premium Quality',
    description: 'Handpicked materials and craftsmanship that lasts season after season.',
    gradient: 'from-leather-300 to-leather-400',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick dispatch and pan-India shipping with tracking at every step.',
    gradient: 'from-sky-400 to-blue-500',
  },
];

const stats = [
  { icon: Users, value: '1,00,000+', label: 'Happy Customers' },
  { icon: ShoppingBag, value: '50,000+', label: 'Orders Delivered' },
  { icon: MapPin, value: '500+', label: 'Cities Served' },
  { icon: Star, value: '4.6/5', label: 'Avg. Rating' },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="py-12 sm:py-16 lg:py-20 bg-charcoal-800 text-white relative overflow-hidden"
      aria-label="Why choose Ansari Boot House"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-orange/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-leather-400/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.02]" />
      </div>

      <div className="container-main relative">
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <span className="text-brand-orange font-poppins font-semibold text-sm uppercase tracking-wide">Our Promise</span>
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl mt-1">Why Choose Ansari Boot House</h2>
          <p className="mt-3 text-white/70 font-inter">A heritage of trust built on quality, value, and customer care</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 lg:mb-16">
          {features.map((f, index) => (
            <div
              key={f.title}
              className={`group bg-white/[0.06] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.1] transition-all duration-500 text-center ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 mx-auto shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <f.icon className="w-7 h-7 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="font-poppins font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-white font-inter leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 4) * 100}ms`, transition: 'all 0.6s ease-out' }}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-orange/15 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-brand-orange" strokeWidth={2} />
                </div>
                <div className="font-poppins font-bold text-2xl sm:text-3xl text-white">{stat.value}</div>
                <div className="text-sm text-white/50 font-inter mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
