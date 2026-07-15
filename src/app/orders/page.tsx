"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, ChevronRight } from 'lucide-react';
import { getOrders, type Order } from '../../lib/orders';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setOrders(getOrders());
        setLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-brand-ivory">
            <section className="relative overflow-hidden bg-charcoal-800" aria-label="Orders hero">
                <div className="relative container-main py-10 sm:py-14">
                    <nav aria-label="Breadcrumb" className="mb-5">
                        <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li aria-hidden><span className="text-white/30">/</span></li>
                            <li><Link href="/my-account" className="hover:text-white transition-colors">Account</Link></li>
                            <li aria-hidden><span className="text-white/30">/</span></li>
                            <li className="text-white font-medium">Orders</li>
                        </ol>
                    </nav>
                    <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl leading-tight">My Orders</h1>
                    <p className="mt-3 text-white/75 text-base font-inter">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
                </div>
            </section>

            <div className="container-main py-10 sm:py-12">
                {!loaded ? null : orders.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-charcoal-100 flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-charcoal-400" strokeWidth={2} />
                        </div>
                        <h3 className="font-poppins font-semibold text-charcoal-900 text-lg">No orders yet</h3>
                        <p className="text-charcoal-500 font-inter mt-1 text-sm mb-4">When you place an order, it will show up here.</p>
                        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
                            Start Shopping <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-3xl">
                        {orders.map((order) => {
                            const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);
                            const placedDate = new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            return (
                                <Link
                                    key={order.orderNumber}
                                    href={`/orders/${order.orderNumber}`}
                                    className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-4 sm:p-5"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex -space-x-3 flex-shrink-0">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="w-12 h-12 rounded-lg overflow-hidden bg-charcoal-100 border-2 border-white">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-12 h-12 rounded-lg bg-charcoal-100 border-2 border-white flex items-center justify-center text-xs font-poppins font-semibold text-charcoal-600">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-poppins font-semibold text-charcoal-900 text-sm truncate">Order #{order.orderNumber}</p>
                                                <p className="text-xs text-charcoal-400 font-inter">{placedDate} · {itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="font-manrope font-bold text-charcoal-900 text-base">₹{order.total.toLocaleString('en-IN')}</span>
                                            <ChevronRight className="w-5 h-5 text-charcoal-400" strokeWidth={2} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
