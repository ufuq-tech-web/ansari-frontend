"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '../lib/catalog-helpers';
import { customerApi } from './customer-api';
import { mapProduct } from './storefront-api';
import { useAuth } from './auth-context';

export interface CartItem extends Product {
    qty: number;
}

interface CartContextValue {
    items: CartItem[];
    addItem: (product: Product, qty?: number) => void;
    removeItem: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
    hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

// Cart lives on the backend now (requires login) — this provider is just a
// thin cache in front of /api/cart so every consumer (Header, ProductCard,
// cart/checkout pages) keeps working against the same hook shape as before.
export function CartProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    const refresh = useCallback(() => {
        if (!isAuthenticated) {
            setItems([]);
            setHydrated(true);
            return;
        }
        customerApi
            .get<any[]>('/cart')
            .then((rows) => setItems(rows.map((r) => ({ ...mapProduct(r.product), qty: r.qty }))))
            .finally(() => setHydrated(true));
    }, [isAuthenticated]);

    useEffect(() => {
        if (authLoading) return;
        refresh();
    }, [authLoading, refresh]);

    const requireLogin = () => {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    };

    const addItem = (product: Product, qty = 1) => {
        if (!isAuthenticated) return requireLogin();
        customerApi.post('/cart', { productId: product.id, qty }).then(refresh);
    };

    const removeItem = (id: string) => {
        customerApi.delete(`/cart/${id}`).then(refresh);
    };

    const updateQty = (id: string, qty: number) => {
        if (qty < 1) {
            removeItem(id);
            return;
        }
        customerApi.patch(`/cart/${id}`, { qty }).then(refresh);
    };

    const clearCart = () => {
        customerApi.delete('/cart').then(refresh);
    };

    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.salePrice * i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, subtotal, hydrated }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
