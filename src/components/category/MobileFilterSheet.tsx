"use client";

import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import { defaultFilters } from '../../lib/product-query';
import type { FilterState } from '../../interface/filter';

interface Props {
    filters: FilterState;
    onChange: (f: FilterState) => void;
    totalResults: number;
    sortValue: string;
    onSortChange: (v: string) => void;
}

const SORT_OPTIONS = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'newest', label: 'Newest First' },
    { value: 'best_selling', label: 'Best Selling' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'discount', label: 'Biggest Discount' },
];

function activeCount(f: FilterState): number {
    return (
        f.brands.length + f.sizes.length + f.colors.length +
        (f.rating ? 1 : 0) + (f.discount ? 1 : 0) + f.availability.length +
        (f.priceRange[0] > 0 || f.priceRange[1] < 5000 ? 1 : 0) +
        (f.search ? 1 : 0)
    );
}

export default function MobileFilterSheet({ filters, onChange, totalResults, sortValue, onSortChange }: Props) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const count = activeCount(filters);
    const currentSort = SORT_OPTIONS.find((o) => o.value === sortValue);

    return (
        <>
            {/* Filter/sort bar */}
            <div className="lg:hidden bg-white border-b border-charcoal-200 shadow-sm sticky top-16 z-30">
                <div className="container-main py-2.5 flex items-center gap-2">
                    <button
                        onClick={() => setFilterOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-charcoal-200 text-sm font-poppins font-semibold text-charcoal-700 hover:border-charcoal-400 transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                        Filters
                        {count > 0 && (
                            <span className="bg-brand-orange text-white text-[10px] font-poppins font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {count}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setSortOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-charcoal-200 text-sm font-poppins font-semibold text-charcoal-700 hover:border-charcoal-400 transition-colors"
                    >
                        Sort: {currentSort?.label ?? 'Popularity'}
                        <ChevronDown className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Filter bottom sheet */}
            {filterOpen && (
                <>
                    <div className="fixed inset-0 bg-charcoal-900/50 z-40" onClick={() => setFilterOpen(false)} />
                    <div className="fixed bottom-0 inset-x-0 bg-white z-50 rounded-t-3xl max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-200">
                            <h3 className="font-poppins font-semibold text-charcoal-900">Filters</h3>
                            <button onClick={() => setFilterOpen(false)} className="p-2 -mr-2 text-charcoal-600 hover:text-charcoal-900">
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 py-2">
                            <FilterSidebar filters={filters} onChange={onChange} totalResults={totalResults} />
                        </div>
                        <div className="px-5 py-4 border-t border-charcoal-200 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => onChange({ ...defaultFilters })}
                                className="btn-secondary justify-center"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setFilterOpen(false)}
                                className="btn-primary justify-center"
                            >
                                View {totalResults} Results
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Sort bottom sheet */}
            {sortOpen && (
                <>
                    <div className="fixed inset-0 bg-charcoal-900/50 z-40" onClick={() => setSortOpen(false)} />
                    <div className="fixed bottom-0 inset-x-0 bg-white z-50 rounded-t-3xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-200">
                            <h3 className="font-poppins font-semibold text-charcoal-900">Sort by</h3>
                            <button onClick={() => setSortOpen(false)} className="p-2 -mr-2 text-charcoal-600">
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </div>
                        <div className="px-5 py-3 pb-8 space-y-1">
                            {SORT_OPTIONS.map((o) => (
                                <button
                                    key={o.value}
                                    onClick={() => { onSortChange(o.value); setSortOpen(false); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-inter text-sm transition-colors ${sortValue === o.value
                                            ? 'bg-brand-orange/10 text-brand-orange font-semibold'
                                            : 'text-charcoal-700 hover:bg-charcoal-50'
                                        }`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
