"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../lib/catalog-helpers';

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
const STORAGE_KEY = 'ansari_cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
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

    const addItem = (product: Product, qty = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
            }
            return [...prev, { ...product, qty }];
        });
    };

    const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

    const updateQty = (id: string, qty: number) => {
        if (qty < 1) {
            removeItem(id);
            return;
        }
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    };

    const clearCart = () => setItems([]);

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
