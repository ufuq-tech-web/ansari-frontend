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
            bg: 'bg-leather-400',
            tag: 'Limited Offer',
            heading: 'Monsoon Sale — Up to 40% Off',
            sub: 'Waterproof styles for the whole family',
            cta: 'Shop Sale',
            href: '/sale',
            icon: Tag,
        },
        {
            bg: 'bg-charcoal-800',
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
        <div className={`col-span-full rounded-2xl ${b.bg} p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                    <span className="text-white/70 text-xs font-poppins font-semibold uppercase tracking-wide">{b.tag}</span>
                    <h3 className="font-poppins font-semibold text-white text-lg sm:text-xl mt-0.5">{b.heading}</h3>
                    <p className="text-white/75 text-sm font-inter">{b.sub}</p>
                </div>
            </div>
            <Link href={b.href} className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-charcoal-900 font-poppins font-semibold px-5 py-2.5 rounded-xl hover:bg-charcoal-50 transition-colors">
                {b.cta} <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

export default function CategoryProductGrid({ products, viewMode, onQuickView, categoryName }: Props) {
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

    const gridClass = viewMode === 'grid'
        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'
        : 'grid grid-cols-1 gap-4';

    // Insert inline promo banners after every 8 products
    const items: React.ReactNode[] = [];
    products.forEach((p, i) => {
        if (viewMode === 'grid') {
            items.push(<ProductCard key={p.id} product={p} />);
            if ((i + 1) % 8 === 0 && i + 1 < products.length) {
                items.push(<InlinePromoBanner key={`promo-${i}`} index={Math.floor((i + 1) / 8) - 1} />);
            }
        } else {
            items.push(<ListCard key={p.id} product={p} onQuickView={onQuickView} />);
        }
    });

    return <div className={gridClass}>{items}</div>;
}

function ListCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
    const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
    return (
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 flex gap-4 p-4">
            <div className="relative w-32 sm:w-40 aspect-square rounded-xl overflow-hidden bg-charcoal-100 flex-shrink-0 group">
                <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] text-charcoal-400 font-inter uppercase tracking-wide">{product.brand}</span>
                <h3 className="mt-1 font-poppins font-bold text-charcoal-900 text-base sm:text-lg">{product.name}</h3>
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
                        <span className="text-sm text-charcoal-400 line-through font-manrope">₹{product.price.toLocaleString('en-IN')}</span>
                    )}
                    {discount > 0 && <span className="text-sm text-brand-green font-poppins font-semibold">{discount}% off</span>}
                </div>
                <div className="mt-auto pt-3 flex items-center gap-2">
                    <button className="btn-primary py-2 text-sm">Add to Cart</button>
                    <button onClick={() => onQuickView(product)} className="btn-secondary py-2 text-sm">Quick View</button>
                </div>
            </div>
        </div>
    );
}
