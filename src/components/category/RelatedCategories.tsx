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
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
                <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
                    <div>
                        <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide block mb-2">Keep Exploring</span>
                        <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-primary">You Might Also <span className="text-secondary">Like</span></h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
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
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <span className="font-sora font-bold tracking-tight text-white text-xl sm:text-2xl">{rel.name}</span>
                                <span className="mt-2 inline-flex items-center gap-1.5 text-accent font-manrope font-bold text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
