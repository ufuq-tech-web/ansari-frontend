"use client";

import Link from 'next/link';
import { ArrowRight, Tag, Zap } from 'lucide-react';
import ProductCard from '../ProductCard';
import type { Product } from '../../lib/catalog-helpers';

interface Props {
    products: Product[];
    viewMode: 'grid' | 'list';
    onQuickView: (product: Product) => void;
    categoryName: string;
}

function InlinePromoBanner({ index }: { index: number }) {
    const banners = [
        {
            bg: 'bg-primary',
            tag: 'Limited Offer',
            heading: 'Monsoon Sale — Up to 40% Off',
            sub: 'Waterproof styles for the whole family',
            cta: 'Shop Sale',
            href: '/sale',
            icon: Tag,
        },
        {
            bg: 'bg-secondary',
            tag: 'New Collection',
            heading: 'Festival Ready Footwear',
            sub: 'Wedding, party, and ethnic styles now available',
            cta: 'Explore Now',
            href: '/new-arrivals',
            icon: Zap,
        },
    ];
    const b = banners[index % banners.length];
    return (
        <div className={`col-span-full rounded-2xl ${b.bg} p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden`}>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                    <span className="text-white/80 text-xs font-manrope font-bold uppercase tracking-wider">{b.tag}</span>
                    <h3 className="font-sora font-bold text-white text-lg sm:text-2xl mt-1 tracking-tight">{b.heading}</h3>
                    <p className="text-white/70 text-sm font-inter mt-1">{b.sub}</p>
                </div>
            </div>
            <Link href={b.href} className="flex-shrink-0 relative z-10 inline-flex items-center gap-2 bg-accent text-white font-manrope font-bold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                {b.cta} <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryProductGrid({ products, viewMode, onQuickView, categoryName }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 16;

    useEffect(() => {
        setCurrentPage(1);
    }, [products]);

    if (products.length === 0) {
        return (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-charcoal-100 flex items-center justify-center mb-4">
                    <Tag className="w-8 h-8 text-charcoal-400" strokeWidth={2} />
                </div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-lg">No products found</h3>
                <p className="text-charcoal-500 font-inter mt-1 text-sm">Try adjusting your filters or browse all {categoryName}</p>
            </div>
        );
    }

    const totalPages = Math.ceil(products.length / pageSize);
    const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const gridClass = viewMode === 'grid'
        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'
        : 'grid grid-cols-1 gap-4';

    // Insert inline promo banners after every 8 products
    const items: React.ReactNode[] = [];
    paginatedProducts.forEach((p, i) => {
        if (viewMode === 'grid') {
            items.push(<ProductCard key={p.id} product={p} />);
            if ((i + 1) % 8 === 0 && i + 1 < paginatedProducts.length) {
                items.push(<InlinePromoBanner key={`promo-${i}`} index={Math.floor((i + 1) / 8) - 1} />);
            }
        } else {
            items.push(<ListCard key={p.id} product={p} onQuickView={onQuickView} />);
        }
    });

    return (
        <div>
            <div className={gridClass}>{items}</div>
            
            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button 
                        onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full border border-charcoal-200 flex items-center justify-center text-charcoal-600 hover:border-brand-orange hover:text-brand-orange disabled:opacity-50 disabled:hover:border-charcoal-200 disabled:hover:text-charcoal-600 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const page = i + 1;
                            const isCurrent = page === currentPage;
                            return (
                                <button
                                    key={page}
                                    onClick={() => {
                                        setCurrentPage(page);
                                        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 rounded-full font-poppins font-semibold text-sm transition-colors ${
                                        isCurrent 
                                            ? 'bg-brand-orange text-white' 
                                            : 'text-charcoal-600 hover:bg-charcoal-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button 
                        onClick={() => {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full border border-charcoal-200 flex items-center justify-center text-charcoal-600 hover:border-brand-orange hover:text-brand-orange disabled:opacity-50 disabled:hover:border-charcoal-200 disabled:hover:text-charcoal-600 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function ListCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
    const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
    return (
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 flex gap-4 p-4">
            <div className="relative w-32 sm:w-40 aspect-square rounded-xl overflow-hidden bg-charcoal-100 flex-shrink-0 group">
                <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] text-secondary font-manrope font-bold uppercase tracking-wider">{product.brand}</span>
                <h3 className="mt-1 font-sora font-bold text-primary text-base sm:text-lg">{product.name}</h3>
                <div className="mt-1 flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className={`text-sm ${i <= Math.round(product.rating) ? 'text-brand-orange' : 'text-charcoal-200'}`}>★</span>
                        ))}
                    </div>
                    <span className="text-xs text-charcoal-400 font-inter">({product.reviews})</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="font-manrope font-bold text-charcoal-900 text-lg">₹{product.salePrice.toLocaleString('en-IN')}</span>
                    {product.price > product.salePrice && (
                        <span className="text-sm text-primary/60 line-through font-manrope font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    )}
                    {discount > 0 && <span className="text-sm text-brand-green font-manrope font-bold">{discount}% off</span>}
                </div>
                <div className="mt-auto pt-3 flex items-center gap-2">
                    <button className="btn-primary py-2 text-sm">Add to Cart</button>
                    <button onClick={() => onQuickView(product)} className="btn-secondary py-2 text-sm">Quick View</button>
                </div>
            </div>
        </div>
    );
}
