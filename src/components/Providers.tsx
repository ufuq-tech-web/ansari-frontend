"use client";

import { AuthProvider } from '../lib/auth-context';
import { CartProvider } from '../lib/cart-context';
import { WishlistProvider } from '../lib/wishlist-context';
import QueryProvider from './providers/QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>{children}</WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </QueryProvider>
    );
}
