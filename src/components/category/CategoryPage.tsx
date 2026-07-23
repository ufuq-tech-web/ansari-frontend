"use client";

import { useState } from 'react';
import CategoryHero from './CategoryHero';
import SubcategoryGrid from './SubcategoryGrid';
import FilterSidebar from './FilterSidebar';
import MobileFilterSheet from './MobileFilterSheet';
import SortBar from './SortBar';
import CategoryProductGrid from './CategoryProductGrid';
import BuyingGuide from './BuyingGuide';
import CategoryFAQ from './CategoryFaq';
import RelatedCategories from './RelatedCategories';
import QuickViewModal from './QuickViewModal';
import CustomerReviews from '../CustomerReviews';
import Newsletter from '../Newsletter';
import RecentlyViewed from '../RecentlyViewed';
import { type CategoryConfig, type Product, type ProductWithCategory } from '../../lib/catalog-helpers';
import { useProductListing } from '../../hooks/useProductListing';
import { useCategoryFilterUrl } from '../../hooks/useCategoryFilterUrl';

interface Props {
    category: CategoryConfig;
    activeSubcategory: string;
    onCategoryChange: (key: string) => void;
    presetPriceRange?: [number, number];
    presetPriceLabel?: string;
    onClearPresetPrice?: () => void;
    // First page of results for the URL this page was requested with,
    // fetched server-side in page.tsx — lets first paint show real products
    // instead of a loading spinner.
    initialProducts?: ProductWithCategory[];
    initialTotal?: number;
}

export default function CategoryPage({ category, activeSubcategory, onCategoryChange, presetPriceRange, presetPriceLabel, onClearPresetPrice, initialProducts, initialTotal }: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const {
        activeGender,
        activeAgeGroup,
        sort,
        filters,
        updateParam,
        setFilters,
        goToSubcategory,
    } = useCategoryFilterUrl(category.key, presetPriceRange);

    const { products: visibleProducts, total, loading, loadingMore, hasMore, loadMore } = useProductListing({
        categoryKey: category.key,
        subcategory: activeSubcategory,
        gender: activeGender,
        ageGroup: activeAgeGroup,
        filters,
        sort,
        initialProducts,
        initialTotal,
    });

    return (
        <div className="min-h-screen bg-brand-ivory">
            <CategoryHero category={category} activeSubcategory={activeSubcategory} />

            <SubcategoryGrid
                category={category}
                activeSubcategory={activeSubcategory}
                onSubcategoryClick={(name) => goToSubcategory(activeSubcategory === name ? '' : name)}
            />

            {/* Mobile filter/sort bar */}
            <MobileFilterSheet
                filters={filters}
                onChange={setFilters}
                totalResults={total}
                sortValue={sort}
                onSortChange={(v) => updateParam('sort', v)}
            />

            {/* Main content: sidebar + grid */}
            <div id="products" className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto py-8">
                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-16 lg:top-20">
                            <FilterSidebar
                                filters={filters}
                                onChange={setFilters}
                                totalResults={total}
                            />
                        </div>
                    </aside>

                    {/* Product area */}
                    <div className="flex-1 min-w-0">
                        <SortBar
                            totalResults={total}
                            sortValue={sort}
                            onSortChange={(v) => updateParam('sort', v)}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            activeSubcategory={activeSubcategory}
                            onClearSubcategory={() => goToSubcategory('')}
                            activeGender={activeGender}
                            onClearGender={() => updateParam('gender', '')}
                            activeAgeGroup={activeAgeGroup}
                            onClearAgeGroup={() => updateParam('age', '')}
                            activePriceLabel={presetPriceLabel}
                            onClearPrice={onClearPresetPrice}
                        />

                        <div className="mt-6 min-h-[200px]" aria-busy={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <CategoryProductGrid
                                    products={visibleProducts}
                                    viewMode={viewMode}
                                    onQuickView={setQuickViewProduct}
                                    categoryName={category.name}
                                />
                            )}
                        </div>

                        {hasMore && (
                            <div className="mt-8 flex flex-col items-center gap-2">
                                <p className="text-xs text-charcoal-400 font-inter">
                                    Showing {visibleProducts.length} of {total} products
                                </p>
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="btn-secondary disabled:opacity-60"
                                >
                                    {loadingMore ? 'Loading…' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BuyingGuide category={category} />
            <CategoryFAQ category={category} />
            <RelatedCategories category={category} onCategoryChange={onCategoryChange} />
            <CustomerReviews />
            <RecentlyViewed />
            <Newsletter />

            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </div>
    );
}
