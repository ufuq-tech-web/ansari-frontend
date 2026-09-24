"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import type { CategoryConfig } from '../../lib/catalog-helpers';

interface Props {
    category: CategoryConfig;
    activeSubcategory?: string;
}

export default function CategoryHero({ category, activeSubcategory }: Props) {
    // Intelligently parse the gender/audience prefix (e.g., "Men's Footwear" -> "Men's")
    const genderPrefix = category.name.includes(' ') ? category.name.split(' ')[0] : category.name;
    const audience = genderPrefix.replace(/'s|'/g, "").toLowerCase();

    const dynamicTitle = activeSubcategory ? `${genderPrefix} ${activeSubcategory}` : category.name;
    const dynamicDescription = activeSubcategory
        ? `Explore our latest collection of ${activeSubcategory.toLowerCase()} for ${audience}. Engineered for perfect comfort and effortless style.`
        : category.description;

    return (
        <section
            className="relative overflow-hidden bg-charcoal-800 aspect-auto min-h-[350px] lg:aspect-[21/9] lg:min-h-0 flex flex-col justify-center"
            aria-label={`${category.name} hero`}
        >
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <Image
                    src={category.heroImage}
                    alt={category.name}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-60"
                    style={{
                        objectPosition: category.key === 'women' ? 'right center' :
                            category.key === 'accessories' ? 'center 25%' :
                                'center'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-transparent" />
            </div>

            {/* Animated particle/sparkle accent for visual interest */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-secondary/40 animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-accent/40 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute bottom-1/3 right-1/2 w-1 h-1 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '4s' }} />
            </div>

            <div className="relative container-main py-10 sm:py-14 lg:py-20">
                <div className="max-w-2xl">
                    {/* Breadcrumb rendered here for LCP priority, also in the sticky bar */}
                    <nav aria-label="Breadcrumb" className="mb-5 animate-[fadeSlideUp_0.6s_ease-out_0.1s_both]">
                        <ol className="flex items-center gap-2 text-sm text-white/60 font-manrope font-semibold flex-wrap tracking-wide">
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

                    <h1 className="font-sora font-extrabold tracking-tight text-white text-4xl sm:text-5xl lg:text-6xl leading-tight animate-[fadeSlideUp_0.6s_ease-out_0.2s_both]">
                        {dynamicTitle}
                    </h1>
                    <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl animate-[fadeSlideUp_0.6s_ease-out_0.35s_both]">
                        {dynamicDescription}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-[fadeSlideUp_0.6s_ease-out_0.5s_both]">
                        <a href="#products" className="btn-primary">
                            Shop Now <ArrowRight className="w-4 h-4" />
                        </a>
                        <a href="#subcategories" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Browse Subcategories
                        </a>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 animate-[fadeSlideUp_0.6s_ease-out_0.65s_both]">
                        {[
                            { icon: ShieldCheck, text: 'Authentic Products' },
                            { icon: Truck, text: 'Nationwide Delivery' },
                            { icon: RefreshCw, text: '7-Day Easy Returns' },
                        ].map(({ icon: Icon, text }) => (
                            <span key={text} className="flex items-center gap-2 text-sm text-white/80 font-manrope font-semibold">
                                <Icon className="w-4 h-4 text-accent" strokeWidth={2} />
                                {text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Product count chip */}
                <div className="absolute bottom-6 right-6 sm:right-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 hidden sm:block animate-[fadeSlideUp_0.6s_ease-out_0.8s_both] shadow-xl">
                    <span className="font-manrope font-extrabold text-white text-3xl tracking-tight">{category.totalProducts}+</span>
                    <div className="text-white/70 text-xs font-manrope font-bold uppercase tracking-wider mt-0.5">Styles Available</div>
                </div>
            </div>
        </section>
    );
}
