"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FilterSidebar from './category/FilterSidebar';
import { defaultFilters } from '../lib/product-query';
import type { FilterState } from '../interface/filter';
import MobileFilterSheet from './category/MobileFilterSheet';
import SortBar from './category/SortBar';
import CategoryProductGrid from './category/CategoryProductGrid';
import QuickViewModal from './category/QuickViewModal';
import type { Product } from '../lib/catalog-helpers';

interface Props {
    title: string;
    subtitle: string;
    products: Product[];
    heroImage?: string;
    defaultSort?: string;
}

function applyFilters(products: Product[], filters: FilterState, sort: string): Product[] {
    let result = [...products];

    if (filters.brands.length) result = result.filter((p) => filters.brands.includes(p.brand));
    if (filters.rating) result = result.filter((p) => p.rating >= filters.rating!);
    if (filters.discount) result = result.filter((p) => {
        const d = Math.round(((p.price - p.salePrice) / p.price) * 100);
        return d >= filters.discount!;
    });
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
        result = result.filter((p) => p.salePrice >= filters.priceRange[0] && p.salePrice <= filters.priceRange[1]);
    }
    if (filters.availability.length) {
        result = result.filter((p) => {
            if (filters.availability.includes('In Stock') && p.stock !== 'out_of_stock') return true;
            if (filters.availability.includes('Out of Stock') && p.stock === 'out_of_stock') return true;
            return false;
        });
    }

    switch (sort) {
        case 'price_asc': result.sort((a, b) => a.salePrice - b.salePrice); break;
        case 'price_desc': result.sort((a, b) => b.salePrice - a.salePrice); break;
        case 'rating': result.sort((a, b) => b.rating - a.rating); break;
        case 'discount': result.sort((a, b) => {
            const da = (a.price - a.salePrice) / a.price;
            const db = (b.price - b.salePrice) / b.price;
            return db - da;
        }); break;
        case 'newest': result.sort((a) => a.isNew ? -1 : 1); break;
        case 'best_selling': result.sort((a, b) => b.reviews - a.reviews); break;
        default: result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
}

export default function ProductListingPage({ title, subtitle, products, heroImage, defaultSort = 'popularity' }: Props) {
    const [filters, setFilters] = useState<FilterState>({ ...defaultFilters });
    const [sort, setSort] = useState(defaultSort);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const filteredProducts = useMemo(
        () => applyFilters(products, filters, sort),
        [products, filters, sort]
    );

    return (
        <div className="min-h-screen bg-brand-ivory">
            {/* Hero */}
            <section className="relative overflow-hidden bg-charcoal-800" aria-label={`${title} hero`}>
                {heroImage && (
                    <div className="absolute inset-0">
                        <img src={heroImage} alt={title} loading="eager" className="w-full h-full object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
                    </div>
                )}
                <div className="relative container-main py-10 sm:py-14 lg:py-16">
                    <nav aria-label="Breadcrumb" className="mb-5">
                        <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li aria-hidden><span className="text-white/30">/</span></li>
                            <li className="text-white font-medium">{title}</li>
                        </ol>
                    </nav>
                    <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">{title}</h1>
                    <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">{subtitle}</p>
                </div>
            </section>

            {/* Mobile filter/sort bar */}
            <MobileFilterSheet
                filters={filters}
                onChange={setFilters}
                totalResults={filteredProducts.length}
                sortValue={sort}
                onSortChange={setSort}
            />

            <div id="products" className="container-main py-8">
                <div className="flex gap-8">
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-16 lg:top-20">
                            <FilterSidebar filters={filters} onChange={setFilters} totalResults={filteredProducts.length} />
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <SortBar
                            totalResults={filteredProducts.length}
                            sortValue={sort}
                            onSortChange={setSort}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />

                        <div className="mt-6">
                            {filteredProducts.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <h3 className="font-poppins font-semibold text-charcoal-900 text-lg">No products found</h3>
                                    <p className="text-charcoal-500 font-inter mt-1 text-sm mb-4">Try adjusting your filters</p>
                                    <Link href="/" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
                                        Continue Shopping <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <CategoryProductGrid
                                    products={filteredProducts}
                                    viewMode={viewMode}
                                    onQuickView={setQuickViewProduct}
                                    categoryName={title}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        </div>
    );
}
