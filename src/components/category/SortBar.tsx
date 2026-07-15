"use client";

import { ChevronDown, LayoutGrid, List } from 'lucide-react';

const SORT_OPTIONS = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'newest', label: 'Newest First' },
    { value: 'best_selling', label: 'Best Selling' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'discount', label: 'Biggest Discount' },
];

interface Props {
    totalResults: number;
    sortValue: string;
    onSortChange: (v: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (v: 'grid' | 'list') => void;
    activeSubcategory?: string;
    onClearSubcategory?: () => void;
    activeGender?: string;
    onClearGender?: () => void;
    activeAgeGroup?: string;
    onClearAgeGroup?: () => void;
    activePriceLabel?: string;
    onClearPrice?: () => void;
}

const GENDER_LABELS: Record<string, string> = { boys: 'Boys', girls: 'Girls', unisex: 'Unisex' };

export default function SortBar({
    totalResults, sortValue, onSortChange, viewMode, onViewModeChange,
    activeSubcategory, onClearSubcategory,
    activeGender, onClearGender,
    activeAgeGroup, onClearAgeGroup,
    activePriceLabel, onClearPrice,
}: Props) {
    return (
        <div className="bg-white border-b border-charcoal-200">
            <div className="py-3 flex items-center justify-between gap-4">
                {/* Left: count + active filter badges */}
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="text-sm text-charcoal-500 font-inter whitespace-nowrap">
                        <span className="font-semibold text-charcoal-900">{totalResults}</span> products
                    </span>
                    {activeSubcategory && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 text-white text-xs font-poppins font-medium">
                            {activeSubcategory}
                            <button onClick={onClearSubcategory} aria-label="Clear subcategory" className="hover:text-white/70">×</button>
                        </span>
                    )}
                    {activeGender && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 text-white text-xs font-poppins font-medium">
                            {GENDER_LABELS[activeGender] ?? activeGender}
                            <button onClick={onClearGender} aria-label="Clear gender filter" className="hover:text-white/70">×</button>
                        </span>
                    )}
                    {activeAgeGroup && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 text-white text-xs font-poppins font-medium">
                            {activeAgeGroup} Years
                            <button onClick={onClearAgeGroup} aria-label="Clear age filter" className="hover:text-white/70">×</button>
                        </span>
                    )}
                    {activePriceLabel && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 text-white text-xs font-poppins font-medium">
                            {activePriceLabel}
                            <button onClick={onClearPrice} aria-label="Clear price filter" className="hover:text-white/70">×</button>
                        </span>
                    )}
                </div>

                {/* Right: sort + view */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Sort dropdown (desktop only — mobile uses sheet) */}
                    <div className="hidden lg:flex items-center gap-2">
                        <label className="text-sm text-charcoal-500 font-inter whitespace-nowrap">Sort by:</label>
                        <div className="relative">
                            <select
                                value={sortValue}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="appearance-none bg-white border border-charcoal-200 rounded-xl pl-3 pr-8 py-2 text-sm font-inter text-charcoal-900 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none cursor-pointer"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" strokeWidth={2} />
                        </div>
                    </div>

                    {/* View mode toggle */}
                    <div className="hidden sm:flex border border-charcoal-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-charcoal-900 text-white' : 'bg-white text-charcoal-500 hover:bg-charcoal-50'}`}
                            aria-label="Grid view"
                            aria-pressed={viewMode === 'grid'}
                        >
                            <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-charcoal-900 text-white' : 'bg-white text-charcoal-500 hover:bg-charcoal-50'}`}
                            aria-label="List view"
                            aria-pressed={viewMode === 'list'}
                        >
                            <List className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
