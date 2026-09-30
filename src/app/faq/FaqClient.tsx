"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from "lucide-react";
import { storefrontApi } from "../../lib/storefront-api";
import type { CategoryConfig } from "../../lib/catalog-helpers";

const generalFaqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Delivery (COD), all major credit and debit cards, UPI, and net banking. You can choose your preferred method at checkout.",
  },
  {
    question: "How long does delivery take?",
    answer: "Most orders arrive within 4-6 business days for metro cities and 6-9 business days for other locations. See our Shipping Policy for full details.",
  },
  {
    question: "Can I return or exchange an item?",
    answer: "Yes — unworn shoes in original packaging can be returned or exchanged within 7 days of delivery. Visit our Returns & Exchanges page to start one.",
  },
  {
    question: "How do I track my order?",
    answer: "Use the Track Order page with your order number, or check My Orders if you're on the same device you used to place the order.",
  },
  {
    question: "Do you have physical stores?",
    answer: "Yes, our flagship store is at 123 Fashion Street, Mumbai, Maharashtra 400001. Visit us Monday to Saturday, 10 AM to 8:30 PM.",
  },
];

interface FaqSectionProps {
  id: string;
  title: string;
  subtitle: string;
  faqs: { question: string; answer: string }[];
}

function FaqSection({ id, title, subtitle, faqs }: FaqSectionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div id={id}>
      <h2 className="font-poppins font-bold text-charcoal-900 text-xl sm:text-2xl">{title}</h2>
      <p className="text-sm text-charcoal-500 font-inter mt-1 mb-5">{subtitle}</p>
      <div className="divide-y divide-charcoal-200 bg-white rounded-2xl border border-charcoal-200 px-5">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              className="w-full flex items-start gap-4 py-4 text-left group focus:outline-none"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <HelpCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span className={`flex-1 font-poppins font-semibold text-sm sm:text-base transition-colors ${open === i ? "text-brand-orange" : "text-charcoal-900 group-hover:text-charcoal-700"}`}>
                {faq.question}
              </span>
              <span className="flex-shrink-0 text-charcoal-400">
                {open === i ? <ChevronUp className="w-5 h-5" strokeWidth={2} /> : <ChevronDown className="w-5 h-5" strokeWidth={2} />}
              </span>
            </button>
            {open === i && (
              <div className="pl-9 pb-4 pr-4">
                <p className="text-charcoal-600 font-inter text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FaqClient() {
  const [categories, setCategories] = useState<CategoryConfig[]>([]);

  useEffect(() => {
    Promise.all([
      storefrontApi.getCategory("men"),
      storefrontApi.getCategory("women"),
      storefrontApi.getCategory("kids"),
      storefrontApi.getCategory("accessories"),
    ]).then((results) => {
      setCategories(results.filter((c): c is CategoryConfig => c !== null));
    });
  }, []);

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="FAQ hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">FAQs</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">Frequently Asked Questions</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Answers about shipping, returns, sizing, and more.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12 max-w-3xl space-y-12">
        <FaqSection id="general" title="General Questions" subtitle="Shipping, payment, and order basics" faqs={generalFaqs} />

        {categories.map((config) => (
          <FaqSection
            key={config.key}
            id={config.key}
            title={config.name}
            subtitle={`Common questions about shopping ${config.name.toLowerCase()}`}
            faqs={config.faqs}
          />
        ))}

        <div className="rounded-2xl bg-charcoal-900 p-8 text-center">
          <h2 className="font-poppins font-bold text-white text-xl mb-2">Still have questions?</h2>
          <p className="text-white/70 font-inter text-sm mb-5">Our team is available Monday to Saturday, 10 AM to 8:30 PM.</p>
          <Link href="/contact-us" className="btn-primary inline-flex">Contact Support <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}
