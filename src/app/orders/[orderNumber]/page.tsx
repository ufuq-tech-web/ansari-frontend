"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import OrderSummaryCard from '../../../components/OrderSummaryCard';
import { getOrder, type Order } from '../../../lib/orders';
import { useAuth } from '../../../lib/auth-context';
import AccountLayout, { AccountLoading } from '../../../components/account/AccountLayout';

export default function OrderDetailPage() {
    const params = useParams<{ orderNumber: string }>();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null | undefined>(undefined);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            getOrder(params.orderNumber)
                .then((found) => setOrder(found ?? null))
                .catch(() => setOrder(null));
        }
    }, [params.orderNumber, authLoading, isAuthenticated]);

    if (authLoading || !isAuthenticated || order === undefined) return <AccountLoading />;

    if (order === null) {
        return (
            <AccountLayout>
                <div className="border border-charcoal-200 p-16 flex flex-col items-center justify-center text-center">
                    <h1 className="font-poppins font-light text-2xl text-charcoal-900 mb-2">Order not found</h1>
                    <p className="text-charcoal-500 font-inter text-sm max-w-sm mb-8">We couldn't find the order you were looking for.</p>
                    <Link href="/orders" className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors">
                        Back to Orders
                    </Link>
                </div>
            </AccountLayout>
        );
    }

    const placedDate = new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AccountLayout>
            <div className="max-w-3xl">
                <nav aria-label="Breadcrumb" className="mb-8">
                    <ol className="flex items-center gap-3 text-[10px] font-poppins uppercase tracking-widest text-charcoal-400">
                        <li><Link href="/orders" className="hover:text-charcoal-900 transition-colors">Orders</Link></li>
                        <li aria-hidden><span className="text-charcoal-300">/</span></li>
                        <li className="text-charcoal-900 font-medium">#{order.orderNumber}</li>
                    </ol>
                </nav>
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-charcoal-200">
                    <div>
                        <h1 className="font-poppins font-light text-3xl sm:text-4xl text-charcoal-900 tracking-tight mb-2">Order #{order.orderNumber}</h1>
                        <p className="text-sm text-charcoal-500 font-inter">Placed on {placedDate}</p>
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-poppins font-bold uppercase tracking-widest border ${
                        order.status === 'DELIVERED' ? 'border-brand-green text-brand-green' : 
                        order.status === 'CANCELLED' ? 'border-red-400 text-red-500' :
                        'border-brand-orange text-brand-orange'
                    }`}>
                        {order.status || 'PLACED'}
                    </span>
                </div>

                <OrderSummaryCard order={order} />

                <div className="mt-12 pt-8 border-t border-charcoal-200">
                    <Link href="/" className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </AccountLayout>
    );
}
