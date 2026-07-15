"use client";

import { ArrowRight } from 'lucide-react';
import type { CategoryConfig } from '../../lib/catalog-helpers';

interface Props {
    category: CategoryConfig;
    onCategoryChange: (key: string) => void;
}

export default function RelatedCategories({ category, onCategoryChange }: Props) {
    return (
        <section id="related-categories" className="py-12 sm:py-14 bg-brand-ivory border-t border-charcoal-200">
            <div className="container-main">
                <h2 className="section-heading text-xl sm:text-2xl mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl">
                    {category.relatedCategories.map((rel) => (
                        <a
                            key={rel.key}
                            href={`/${rel.key}`}
                            onClick={(e) => { e.preventDefault(); onCategoryChange(rel.key); }}
                            className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                            aria-label={`Shop ${rel.name}`}
                        >
                            <img
                                src={rel.image}
                                alt={rel.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                <span className="font-poppins font-bold text-white text-base">{rel.name}</span>
                                <span className="mt-1 inline-flex items-center gap-1 text-white/80 text-xs font-inter opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                    Shop <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
