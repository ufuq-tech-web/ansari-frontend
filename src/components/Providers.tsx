"use client";

import { AuthProvider } from '../lib/auth-context';
import { CartProvider } from '../lib/cart-context';
import { WishlistProvider } from '../lib/wishlist-context';
import QueryProvider from './providers/QueryProvider';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Toaster position="bottom-center" />
                        {children}
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </QueryProvider>
    );
}
