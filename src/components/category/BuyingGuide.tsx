"use client";

import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import type { CategoryConfig } from '../../lib/catalog-helpers';

interface Props {
    category: CategoryConfig;
}

export default function BuyingGuide({ category }: Props) {
    return (
        <section id="buying-guide" className="py-12 sm:py-16 bg-brand-ivory">
            <div className="container-main">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                    <div>
                        <span className="text-leather-400 font-poppins font-semibold text-sm uppercase tracking-wide">Expert Advice</span>
                        <h2 className="section-heading text-2xl sm:text-3xl mt-1">Buying Guides</h2>
                        <p className="mt-1.5 text-charcoal-500 font-inter text-sm">Make the right choice with expert tips</p>
                    </div>
                    <Link href="/guides" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
                        All Guides <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {category.buyingGuides.map((guide) => (
                        <Link
                            key={guide.slug}
                            href={`/guides/${guide.slug}`}
                            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-charcoal-200 hover:border-brand-orange/30 transition-all duration-300 group flex flex-col items-center gap-3 text-center"
                        >
                            <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0 mx-auto">
                                <BookOpen className="w-5 h-5 text-brand-orange" strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm leading-snug group-hover:text-brand-orange transition-colors">
                                    {guide.title}
                                </h3>
                                <p className="mt-1.5 text-xs text-charcoal-500 font-inter leading-relaxed">{guide.description}</p>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-charcoal-400 font-inter">
                                    <Clock className="w-3.5 h-3.5" strokeWidth={2} /> {guide.readTime}
                                </span>
                                <ArrowRight className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
