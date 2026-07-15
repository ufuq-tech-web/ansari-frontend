"use client";

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import type { CategoryConfig } from '../../lib/catalog-helpers';

interface Props {
    category: CategoryConfig;
    activeSubcategory?: string;
}

export default function CategoryHero({ category, activeSubcategory }: Props) {
    return (
        <section
            className="relative overflow-hidden bg-charcoal-800"
            aria-label={`${category.name} hero`}
        >
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <img
                    src={category.heroImage}
                    alt={category.name}
                    loading="eager"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
            </div>

            <div className="relative container-main py-10 sm:py-14 lg:py-20">
                <div className="max-w-2xl">
                    {/* Breadcrumb rendered here for LCP priority, also in the sticky bar */}
                    <nav aria-label="Breadcrumb" className="mb-5">
                        <ol className="flex items-center gap-2 text-sm text-white/60 font-inter flex-wrap">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li aria-hidden><span className="text-white/30">/</span></li>
                            {activeSubcategory ? (
                                <>
                                    <li><Link href={`/${category.key}`} className="hover:text-white transition-colors">{category.name}</Link></li>
                                    <li aria-hidden><span className="text-white/30">/</span></li>
                                    <li className="text-white font-medium">{activeSubcategory}</li>
                                </>
                            ) : (
                                <li className="text-white font-medium">{category.name}</li>
                            )}
                        </ol>
                    </nav>

                    <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
                        {category.name}
                    </h1>
                    <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
                        {category.description}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a href="#products" className="btn-primary">
                            Shop Now <ArrowRight className="w-4 h-4" />
                        </a>
                        <a href="#subcategories" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Browse Subcategories
                        </a>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                        {[
                            { icon: ShieldCheck, text: 'Authentic Products' },
                            { icon: Truck, text: 'Free Shipping ₹999+' },
                            { icon: RefreshCw, text: '7-Day Easy Returns' },
                        ].map(({ icon: Icon, text }) => (
                            <span key={text} className="flex items-center gap-2 text-sm text-white/80 font-inter">
                                <Icon className="w-4 h-4 text-brand-orange" strokeWidth={2} />
                                {text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Product count chip */}
                <div className="absolute bottom-6 right-6 sm:right-10 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 hidden sm:block">
                    <span className="font-poppins font-bold text-white text-2xl">{category.totalProducts}+</span>
                    <div className="text-white/70 text-xs font-inter">Styles Available</div>
                </div>
            </div>
        </section>
    );
}
