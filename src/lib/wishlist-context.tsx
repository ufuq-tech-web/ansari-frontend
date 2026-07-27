"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '../lib/catalog-helpers';
import { customerApi } from './customer-api';
import { mapProduct } from './storefront-api';
import { useAuthStore } from "./auth-store";

interface WishlistContextValue {
    items: Product[];
    toggle: (product: Product) => void;
    remove: (id: string) => void;
    isWishlisted: (id: string) => boolean;
    hydrated: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// Wishlist lives on the backend now (requires login), mirroring cart-context.
export function WishlistProvider({ children }: { children: ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const authLoading = useAuthStore(state => state.loading);
    const router = useRouter();
    const [items, setItems] = useState<Product[]>([]);
    const [hydrated, setHydrated] = useState(false);

    const refresh = useCallback(() => {
        if (!isAuthenticated) {
            setItems([]);
            setHydrated(true);
            return;
        }
        customerApi
            .get<any[]>('/wishlist')
            .then((rows) => setItems(rows.map((r) => mapProduct(r.product))))
            .finally(() => setHydrated(true));
    }, [isAuthenticated]);

    useEffect(() => {
        if (authLoading) return;
        refresh();
    }, [authLoading, refresh]);

    const toggle = (product: Product) => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        const already = items.some((i) => i.id === product.id);
        const request = already
            ? customerApi.delete(`/wishlist/${product.id}`)
            : customerApi.post('/wishlist', { productId: product.id });
        request.then(refresh);
    };

    const remove = (id: string) => {
        customerApi.delete(`/wishlist/${id}`).then(refresh);
    };

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
