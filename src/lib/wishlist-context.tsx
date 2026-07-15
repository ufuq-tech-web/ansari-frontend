"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../lib/catalog-helpers';

interface WishlistContextValue {
    items: Product[];
    toggle: (product: Product) => void;
    remove: (id: string) => void;
    isWishlisted: (id: string) => boolean;
    hydrated: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = 'ansari_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch {
            // ignore corrupt storage
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items, hydrated]);

    const toggle = (product: Product) => {
        setItems((prev) =>
            prev.some((i) => i.id === product.id)
                ? prev.filter((i) => i.id !== product.id)
                : [...prev, product]
        );
    };

    const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
    const isWishlisted = (id: string) => items.some((i) => i.id === id);

    return (
        <WishlistContext.Provider value={{ items, toggle, remove, isWishlisted, hydrated }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
