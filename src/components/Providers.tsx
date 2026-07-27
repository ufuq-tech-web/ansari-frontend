"use client";

import { AuthInit } from '../lib/auth-store';
import { CartProvider } from '../lib/cart-context';
import { WishlistProvider } from '../lib/wishlist-context';
import QueryProvider from './providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <QueryProvider>
                <>
                    <AuthInit />
                    <CartProvider>
                        <WishlistProvider>
                            <Toaster position="bottom-center" />
                            {children}
                        </WishlistProvider>
                    </CartProvider>
                </>
            </QueryProvider>
        </GoogleOAuthProvider>
    );
}
