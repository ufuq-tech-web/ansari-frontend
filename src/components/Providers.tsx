"use client";

import { CartProvider } from '../lib/cart-context';
import { WishlistProvider } from '../lib/wishlist-context';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
    );
}
