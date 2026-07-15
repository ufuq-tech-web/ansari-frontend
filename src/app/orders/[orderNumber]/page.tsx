"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import OrderSummaryCard from '../../../components/OrderSummaryCard';
import { getOrder, type Order } from '../../../lib/orders';

export default function OrderDetailPage() {
    const params = useParams<{ orderNumber: string }>();
    const [order, setOrder] = useState<Order | null | undefined>(undefined);

    useEffect(() => {
        setOrder(getOrder(params.orderNumber) ?? null);
    }, [params.orderNumber]);

    if (order === undefined) return null;

    if (order === null) {
        return (
            <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center gap-4 py-20 text-center">
                <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Order not found</h1>
                <Link href="/orders" className="btn-primary">Back to Orders <ArrowRight className="w-4 h-4" /></Link>
            </div>
        );
    }

    const placedDate = new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-brand-ivory">
            <div className="container-main py-8 sm:py-12 max-w-2xl">
                <nav aria-label="Breadcrumb" className="mb-4">
                    <ol className="flex items-center gap-2 text-sm text-charcoal-500 font-inter">
                        <li><Link href="/orders" className="hover:text-brand-orange transition-colors">Orders</Link></li>
                        <li aria-hidden><span className="text-charcoal-300">/</span></li>
                        <li className="text-charcoal-900 font-medium">#{order.orderNumber}</li>
                    </ol>
                </nav>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl sm:text-3xl">Order #{order.orderNumber}</h1>
                        <p className="text-sm text-charcoal-500 font-inter mt-1">Placed on {placedDate}</p>
                    </div>
                    <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-xs font-poppins font-semibold">
                        Confirmed
                    </span>
                </div>

                <OrderSummaryCard order={order} />

                <div className="mt-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
