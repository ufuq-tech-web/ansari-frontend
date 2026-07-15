"use client";

import { Award, IndianRupee, BadgeCheck, Truck } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: '25+ Years Experience',
    description: 'Trusted footwear retailer serving families since 1998 with consistent quality.',
  },
  {
    icon: IndianRupee,
    title: 'Affordable Pricing',
    description: 'Quality footwear at honest prices for every budget — no premium markups.',
  },
  {
    icon: BadgeCheck,
    title: 'Premium Quality',
    description: 'Handpicked materials and craftsmanship that lasts season after season.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick dispatch and pan-India shipping with tracking at every step.',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-12 sm:py-16 lg:py-20 bg-charcoal-800 text-white" aria-label="Why choose Ansari Boot House">
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
          <span className="text-brand-orange font-poppins font-semibold text-sm uppercase tracking-wide">Our Promise</span>
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl mt-1">Why Choose Ansari Boot House</h2>
          <p className="mt-3 text-white font-inter">A heritage of trust built on quality, value, and customer care</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-charcoal-700/50 rounded-2xl p-6 border border-charcoal-600/50 hover:border-brand-orange/40 hover:bg-charcoal-700 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-orange/15 flex items-center justify-center mb-4 mx-auto">
                <f.icon className="w-6 h-6 text-brand-orange" strokeWidth={2} />
              </div>
              <h3 className="font-poppins font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-white font-inter leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
