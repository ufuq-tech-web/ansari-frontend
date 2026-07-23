"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';
import OrderSummaryCard from '../../components/OrderSummaryCard';
import { getOrder, getOrders, type Order } from '../../lib/orders';
import { useAuth } from '../../lib/auth-context';

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={null}>
            <OrderConfirmationContent />
        </Suspense>
    );
}

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.replace(`/login?redirect=${encodeURIComponent('/order-confirmation' + (orderNumber ? `?order=${orderNumber}` : ''))}`);
            return;
        }

        let active = true;
        const load = orderNumber ? getOrder(orderNumber) : getOrders().then((list) => list[0]);
        load
            .then((found) => {
                if (!active) return;
                setOrder(found ?? null);
            })
            .catch(() => {
                if (!active) return;
                setOrder(null);
            })
            .finally(() => {
                if (active) setLoaded(true);
            });
        return () => {
            active = false;
        };
    }, [orderNumber, authLoading, isAuthenticated, router]);

    if (authLoading || !isAuthenticated || !loaded) return null;

    if (!order) {
        return (
            <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center gap-4 py-20 text-center">
                <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">No recent orders found</h1>
                <Link href="/" className="btn-primary">Continue Shopping <ArrowRight className="w-4 h-4" /></Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-ivory">
            <div className="container-main py-10 sm:py-16 max-w-2xl">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-9 h-9 text-brand-green" strokeWidth={2} />
                    </div>
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl sm:text-3xl">Thank you for your order!</h1>
                    <p className="mt-2 text-charcoal-500 font-inter">Your order has been placed successfully.</p>
                    <p className="mt-1 text-sm font-inter text-charcoal-400">
                        Order <span className="font-poppins font-semibold text-charcoal-900">#{order.orderNumber}</span>
                    </p>
                </div>

                <div className="mt-8">
                    <OrderSummaryCard order={order} />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link href="/" className="btn-primary flex-1 justify-center">
                        <Home className="w-4 h-4" /> Continue Shopping
                    </Link>
                    <Link href="/orders" className="btn-secondary flex-1 justify-center">
                        View My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}
