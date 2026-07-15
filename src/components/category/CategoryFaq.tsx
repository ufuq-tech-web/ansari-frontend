"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import type { CategoryConfig } from '../../lib/catalog-helpers';

interface Props {
    category: CategoryConfig;
}

export default function CategoryFAQ({ category }: Props) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section id="faq" className="py-12 sm:py-16 bg-white">
            <div className="container-main">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <span className="text-leather-400 font-poppins font-semibold text-sm uppercase tracking-wide">Need Help?</span>
                        <h2 className="section-heading text-2xl sm:text-3xl mt-1">Frequently Asked Questions</h2>
                        <p className="mt-2 text-charcoal-500 font-inter">Everything you need to know about shopping {category.name}</p>
                    </div>

                    <div className="divide-y divide-charcoal-200">
                        {category.faqs.map((faq, i) => (
                            <div key={i}>
                                <button
                                    className="w-full flex items-start gap-4 py-5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-1 rounded-lg"
                                    onClick={() => setOpen(open === i ? null : i)}
                                    aria-expanded={open === i}
                                >
                                    <HelpCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
                                    <span className={`flex-1 font-poppins font-semibold text-sm sm:text-base transition-colors ${open === i ? 'text-brand-orange' : 'text-charcoal-900 group-hover:text-charcoal-700'
                                        }`}>
                                        {faq.question}
                                    </span>
                                    <span className="flex-shrink-0 text-charcoal-400">
                                        {open === i
                                            ? <ChevronUp className="w-5 h-5" strokeWidth={2} />
                                            : <ChevronDown className="w-5 h-5" strokeWidth={2} />}
                                    </span>
                                </button>

                                {open === i && (
                                    <div className="pl-9 pb-5 pr-4">
                                        <p className="text-charcoal-600 font-inter text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 rounded-2xl bg-brand-ivory border border-charcoal-200 p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="flex-1">
                            <h3 className="font-poppins font-semibold text-charcoal-900">Still have questions?</h3>
                            <p className="text-sm text-charcoal-500 font-inter mt-0.5">Our team is available Mon–Sat, 9 AM to 7 PM</p>
                        </div>
                        <Link href="/contact-us" className="btn-secondary flex-shrink-0">Contact Support</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
