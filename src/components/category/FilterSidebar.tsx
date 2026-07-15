"use client";

import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MATERIALS, OCCASIONS } from '../../lib/catalog-helpers';
import { storefrontApi } from '../../lib/storefront-api';
import { defaultFilters } from '../../lib/product-query';
import type { FilterState } from '../../interface/filter';

interface FilterGroupProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

function FilterGroup({ title, defaultOpen = true, children }: FilterGroupProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-charcoal-200 py-4">
            <button
                className="w-full flex items-center justify-between text-left group"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <span className="font-poppins font-semibold text-sm text-charcoal-900 group-hover:text-brand-orange transition-colors">{title}</span>
                {open ? <ChevronUp className="w-4 h-4 text-charcoal-400" strokeWidth={2} /> : <ChevronDown className="w-4 h-4 text-charcoal-400" strokeWidth={2} />}
            </button>
            {open && <div className="mt-3">{children}</div>}
        </div>
    );
}

const SIZES = ['5', '6', '7', '8', '9', '10', '11', '12'];
const SWATCH_COLORS = [
    { label: 'Black', value: '#1F2937' },
    { label: 'Brown', value: '#92400E' },
    { label: 'White', value: '#FFFFFF' },
    { label: 'Orange', value: '#EA580C' },
    { label: 'Grey', value: '#6B7280' },
    { label: 'Tan', value: '#D4B5A0' },
];

const SOLE_MATERIALS = ['Rubber Sole', 'PU Sole', 'EVA Sole', 'Leather Sole'];
const CLOSURE_TYPES = ['Lace-Up', 'Slip-On'];
const HEEL_HEIGHTS = ['Flat', 'Low Heel', 'Mid Heel'];
const TOE_SHAPES = ['Round Toe', 'Square Toe', 'Pointed Toe'];

interface Props {
    filters: FilterState;
    onChange: (f: FilterState) => void;
    totalResults: number;
}

function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function activeCount(f: FilterState): number {
    return (
        f.brands.length +
        f.sizes.length +
        f.colors.length +
        (f.rating ? 1 : 0) +
        (f.discount ? 1 : 0) +
        f.availability.length +
        f.materials.length +
        f.occasions.length +
        f.soleMaterials.length +
        f.closureTypes.length +
        f.heelHeights.length +
        f.toeShapes.length +
        (f.priceRange[0] > 0 || f.priceRange[1] < 5000 ? 1 : 0)
    );
}

export default function FilterSidebar({ filters, onChange, totalResults }: Props) {
    const count = activeCount(filters);
    const [brands, setBrands] = useState<string[]>([]);

    useEffect(() => {
        storefrontApi.getBrands().then((list) => setBrands(list.map((b) => b.name)));
    }, []);

    return (
        <aside className="w-full" aria-label="Product filters">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-poppins font-bold text-charcoal-900 text-base">Filters</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-charcoal-400 font-inter">{totalResults} products</span>
                    {count > 0 && (
                        <button
                            onClick={() => onChange({ ...defaultFilters })}
                            className="text-xs text-brand-orange font-poppins font-semibold hover:underline flex items-center gap-1"
                        >
                            Clear all ({count})
                        </button>
                    )}
                </div>
            </div>

            {/* Active filter chips */}
            {count > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-charcoal-200">
                    {filters.brands.map((b) => (
                        <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {b}
                            <button onClick={() => onChange({ ...filters, brands: filters.brands.filter((x) => x !== b) })} aria-label={`Remove ${b}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.sizes.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            Size {s}
                            <button onClick={() => onChange({ ...filters, sizes: filters.sizes.filter((x) => x !== s) })} aria-label={`Remove size ${s}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.rating && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {filters.rating}+ Stars
                            <button onClick={() => onChange({ ...filters, rating: null })} aria-label="Remove rating filter">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.materials.map((m) => (
                        <span key={m} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {m}
                            <button onClick={() => onChange({ ...filters, materials: filters.materials.filter((x) => x !== m) })} aria-label={`Remove ${m}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.occasions.map((o) => (
                        <span key={o} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {o}
                            <button onClick={() => onChange({ ...filters, occasions: filters.occasions.filter((x) => x !== o) })} aria-label={`Remove ${o}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.soleMaterials.map((sm) => (
                        <span key={sm} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {sm}
                            <button onClick={() => onChange({ ...filters, soleMaterials: filters.soleMaterials.filter((x) => x !== sm) })} aria-label={`Remove sole material ${sm}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.closureTypes.map((ct) => (
                        <span key={ct} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {ct}
                            <button onClick={() => onChange({ ...filters, closureTypes: filters.closureTypes.filter((x) => x !== ct) })} aria-label={`Remove closure type ${ct}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.heelHeights.map((hh) => (
                        <span key={hh} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {hh}
                            <button onClick={() => onChange({ ...filters, heelHeights: filters.heelHeights.filter((x) => x !== hh) })} aria-label={`Remove heel height ${hh}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.toeShapes.map((ts) => (
                        <span key={ts} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-100 text-xs font-inter text-charcoal-700">
                            {ts}
                            <button onClick={() => onChange({ ...filters, toeShapes: filters.toeShapes.filter((x) => x !== ts) })} aria-label={`Remove toe shape ${ts}`}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Brand */}
            <FilterGroup title="Brand">
                <div className="space-y-2">
                    {brands.map((b) => (
                        <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(b)}
                                onChange={() => onChange({ ...filters, brands: toggle(filters.brands, b) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{b}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Price */}
            <FilterGroup title="Price Range">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-manrope text-charcoal-600">
                        <span>₹{filters.priceRange[0].toLocaleString('en-IN')}</span>
                        <span>₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={5000}
                        step={100}
                        value={filters.priceRange[1]}
                        onChange={(e) => onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                        className="w-full accent-brand-orange"
                    />
                    <div className="grid grid-cols-3 gap-1.5">
                        {[[0, 1000, 'Under ₹1K'], [1000, 2000, '₹1K–₹2K'], [2000, 5000, '₹2K+']].map(([min, max, label]) => (
                            <button
                                key={String(label)}
                                onClick={() => onChange({ ...filters, priceRange: [Number(min), Number(max)] })}
                                className={`text-xs py-1.5 rounded-lg border font-inter transition-colors ${filters.priceRange[0] === min && filters.priceRange[1] === max
                                        ? 'bg-brand-orange text-white border-brand-orange'
                                        : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-400'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </FilterGroup>

            {/* Size */}
            <FilterGroup title="Size">
                <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                        <button
                            key={s}
                            onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, s) })}
                            className={`w-10 h-10 rounded-lg border text-sm font-inter font-medium transition-all ${filters.sizes.includes(s)
                                    ? 'bg-charcoal-900 text-white border-charcoal-900'
                                    : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            {/* Color */}
            <FilterGroup title="Color">
                <div className="flex flex-wrap gap-3">
                    {SWATCH_COLORS.map((c) => (
                        <button
                            key={c.value}
                            title={c.label}
                            onClick={() => onChange({ ...filters, colors: toggle(filters.colors, c.value) })}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${filters.colors.includes(c.value)
                                    ? 'border-brand-orange scale-110 ring-2 ring-brand-orange/30'
                                    : 'border-white ring-1 ring-charcoal-200'
                                }`}
                            style={{ backgroundColor: c.value }}
                            aria-label={c.label}
                            aria-pressed={filters.colors.includes(c.value)}
                        />
                    ))}
                </div>
            </FilterGroup>

            {/* Material */}
            <FilterGroup title="Material">
                <div className="space-y-2">
                    {MATERIALS.map((m) => (
                        <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.materials.includes(m)}
                                onChange={() => onChange({ ...filters, materials: toggle(filters.materials, m) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{m}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Occasion */}
            <FilterGroup title="Occasion">
                <div className="space-y-2">
                    {OCCASIONS.map((o) => (
                        <label key={o} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.occasions.includes(o)}
                                onChange={() => onChange({ ...filters, occasions: toggle(filters.occasions, o) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{o}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Sole Material */}
            <FilterGroup title="Sole Material" defaultOpen={false}>
                <div className="space-y-2">
                    {SOLE_MATERIALS.map((sm) => (
                        <label key={sm} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.soleMaterials.includes(sm)}
                                onChange={() => onChange({ ...filters, soleMaterials: toggle(filters.soleMaterials, sm) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{sm}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Closure Type */}
            <FilterGroup title="Closure Type" defaultOpen={false}>
                <div className="space-y-2">
                    {CLOSURE_TYPES.map((ct) => (
                        <label key={ct} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.closureTypes.includes(ct)}
                                onChange={() => onChange({ ...filters, closureTypes: toggle(filters.closureTypes, ct) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{ct}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Heel Height */}
            <FilterGroup title="Heel Height" defaultOpen={false}>
                <div className="space-y-2">
                    {HEEL_HEIGHTS.map((hh) => (
                        <label key={hh} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.heelHeights.includes(hh)}
                                onChange={() => onChange({ ...filters, heelHeights: toggle(filters.heelHeights, hh) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{hh}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Toe Shape */}
            <FilterGroup title="Toe Shape" defaultOpen={false}>
                <div className="space-y-2">
                    {TOE_SHAPES.map((ts) => (
                        <label key={ts} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.toeShapes.includes(ts)}
                                onChange={() => onChange({ ...filters, toeShapes: toggle(filters.toeShapes, ts) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{ts}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Customer Rating */}
            <FilterGroup title="Customer Rating">
                <div className="space-y-2">
                    {[4, 3, 2].map((r) => (
                        <button
                            key={r}
                            onClick={() => onChange({ ...filters, rating: filters.rating === r ? null : r })}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${filters.rating === r
                                    ? 'border-brand-orange bg-brand-orange/5 text-charcoal-900'
                                    : 'border-transparent hover:bg-charcoal-50 text-charcoal-700'
                                }`}
                        >
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i} className={`text-sm ${i <= r ? 'text-brand-orange' : 'text-charcoal-200'}`}>★</span>
                                ))}
                            </div>
                            <span className="font-inter">{r}+ Stars</span>
                        </button>
                    ))}
                </div>
            </FilterGroup>

            {/* Discount */}
            <FilterGroup title="Discount">
                <div className="space-y-2">
                    {[10, 20, 30, 40].map((d) => (
                        <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="radio"
                                name="discount"
                                checked={filters.discount === d}
                                onChange={() => onChange({ ...filters, discount: filters.discount === d ? null : d })}
                                className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{d}% or more</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {/* Availability */}
            <FilterGroup title="Availability" defaultOpen={false}>
                <div className="space-y-2">
                    {['In Stock', 'Out of Stock'].map((a) => (
                        <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.availability.includes(a)}
                                onChange={() => onChange({ ...filters, availability: toggle(filters.availability, a) })}
                                className="w-4 h-4 rounded border-charcoal-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <span className="text-sm font-inter text-charcoal-700 group-hover:text-charcoal-900">{a}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>
        </aside>
    );
}

