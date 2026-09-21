"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../lib/seo-faqs';

interface PageFaqProps {
  faqs: FaqItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function PageFaq({ faqs, eyebrow = 'Got Questions?', title = 'Frequently Asked Questions', subtitle }: PageFaqProps) {
  const [open, setOpen] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Frequently asked questions">
      <div className="container-main max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">{eyebrow}</span>
          <h2 className="section-heading text-2xl sm:text-3xl mt-1">{title}</h2>
          {subtitle && <p className="text-charcoal-500 font-inter text-sm sm:text-base mt-2">{subtitle}</p>}
        </div>

        <div className="divide-y divide-charcoal-200 bg-brand-ivory rounded-2xl border border-charcoal-200 px-5">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start gap-4 py-4 text-left group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 font-poppins font-medium text-charcoal-900 text-sm sm:text-base group-hover:text-brand-orange transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-charcoal-400 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-orange' : ''}`}
                    strokeWidth={2}
                  />
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-charcoal-500 font-inter leading-relaxed pb-4 pr-8">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
