"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight, Package } from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderNumber = searchParams.get('order');
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const authLoading = useAuthStore(state => state.loading);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.replace(`/login?redirect=${encodeURIComponent('/payment-failed' + (orderNumber ? `?order=${orderNumber}` : ''))}`);
        }
    }, [authLoading, isAuthenticated, router, orderNumber]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center pb-20">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-brand-ivory px-4 py-12">
            <div className="bg-white p-8 sm:p-12 border border-charcoal-200 max-w-lg w-full text-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                <div className="absolute -right-16 -top-16 text-red-50 opacity-50 pointer-events-none">
                    <XCircle className="w-64 h-64" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-50 flex items-center justify-center rounded-full mb-6">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>

                    <h1 className="font-poppins font-light text-3xl text-charcoal-900 tracking-tight mb-4">
                        Payment <span className="font-extrabold text-red-500">Failed</span>
                    </h1>

                    <p className="text-charcoal-500 font-inter text-sm mb-2">
                        We couldn't process your payment for Order <span className="font-poppins font-semibold text-charcoal-900 uppercase">#{orderNumber || 'Unknown'}</span>.
                    </p>
                    
                    <p className="text-charcoal-500 font-inter text-sm mb-10 leading-relaxed">
                        Don't worry, your order has been saved to your account. You can retry the payment from your order history.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <button
                            onClick={() => router.push('/orders')}
                            className="w-full sm:w-auto h-12 px-8 flex items-center justify-center gap-2 bg-charcoal-900 text-white font-poppins font-medium text-sm tracking-widest hover:bg-black transition-colors"
                        >
                            <Package className="w-4 h-4" />
                            VIEW MY ORDERS
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-charcoal-100 w-full">
                        <p className="text-xs font-inter text-charcoal-400">
                            Having trouble? <Link href="/contact" className="text-charcoal-900 hover:text-brand-orange underline underline-offset-4 transition-colors">Contact Support</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Suspense } from 'react';

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={null}>
            <PaymentFailedContent />
        </Suspense>
    );
}
