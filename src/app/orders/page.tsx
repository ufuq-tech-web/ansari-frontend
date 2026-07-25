"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { getOrders, cancelOrder, type Order } from '../../lib/orders';
import { useAuth } from '../../lib/auth-context';
import AccountLayout, { AccountLoading } from '../../components/account/AccountLayout';
import ConfirmModal from '../../components/shared/ConfirmModal';

export default function OrdersPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState("");

    const promptCancel = (e: React.MouseEvent, orderNumber: string) => {
        e.preventDefault();
        setOrderToCancel(orderNumber);
        setCancelReason("");
        setCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        if (!orderToCancel) return;
        setCancelling(orderToCancel);
        const targetOrder = orderToCancel;
        try {
            const updatedOrder = await cancelOrder(targetOrder, cancelReason);
            setOrders(prev => prev.map(o => o.orderNumber === targetOrder ? updatedOrder : o));
        } catch (err: any) {
            alert(err?.message || 'Failed to cancel the order. It might already be processed.');
        } finally {
            setCancelling(null);
            setOrderToCancel(null);
        }
    };

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            getOrders()
                .then(setOrders)
                .catch(() => setOrders([]))
                .finally(() => setLoaded(true));
        }
    }, [authLoading, isAuthenticated]);

    if (authLoading || !isAuthenticated) return <AccountLoading />;

    return (
        <AccountLayout>
            <div className="mb-10">
                <h2 className="font-poppins font-light text-2xl sm:text-3xl text-charcoal-900 tracking-tight">Order History</h2>
                <p className="text-charcoal-500 font-inter text-sm mt-1">{loaded ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} placed.` : 'Loading...'}</p>
            </div>

            {!loaded ? (
                <div className="border border-charcoal-200 p-16 flex justify-center">
                    <div className="w-8 h-8 border-2 border-charcoal-200 border-t-charcoal-900 rounded-full animate-spin"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="border border-charcoal-200 p-16 flex flex-col items-center justify-center text-center">
                    <Package className="w-8 h-8 text-charcoal-300 mb-6" strokeWidth={1} />
                    <h3 className="font-poppins font-light text-xl text-charcoal-900 mb-2">No orders yet</h3>
                    <p className="text-charcoal-500 font-inter text-sm max-w-sm mb-8">When you place an order, it will show up here so you can track its status.</p>
                    <Link href="/" className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="border-t border-charcoal-200">
                    {orders.map((order) => {
                        const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);
                        const placedDate = new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                        return (
                            <div key={order.orderNumber} className="block border-b border-charcoal-200 py-6 group relative hover:bg-charcoal-50/50 transition-colors">
                                <Link href={`/orders/${order.orderNumber}`} className="absolute inset-0 z-0"></Link>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 relative z-10 pointer-events-none">
                                    <div className="flex flex-row items-center gap-4 sm:gap-6 min-w-0">
                                        <div className="flex -space-x-2 sm:-space-x-4 flex-shrink-0">
                                            {order.items.slice(0, 3).map((item) => (
                                                <div key={item.id} className="w-14 h-14 sm:w-16 sm:h-16 bg-charcoal-50 border-2 border-white shadow-sm z-10">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-charcoal-50 border-2 border-white flex items-center justify-center text-[10px] font-poppins text-charcoal-600 shadow-sm z-0 relative -left-1">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="font-poppins font-medium text-charcoal-900 text-sm truncate uppercase tracking-widest">Order #{order.orderNumber}</p>
                                                <span className={`px-2 py-0.5 text-[9px] font-poppins font-bold uppercase tracking-widest border ${order.status === 'DELIVERED' ? 'border-brand-green text-brand-green' :
                                                        order.status === 'CANCELLED' ? 'border-red-400 text-red-500' :
                                                            'border-brand-orange text-brand-orange'
                                                    }`}>
                                                    {order.status || 'PLACED'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-charcoal-500 font-inter uppercase tracking-wider">{placedDate} · {itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-3 pointer-events-auto">
                                        <span className="font-poppins font-light text-charcoal-900 text-xl">₹{order.total.toLocaleString('en-IN')}</span>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && order.status !== 'SHIPPED' && (
                                                <button
                                                    onClick={(e) => promptCancel(e, order.orderNumber)}
                                                    disabled={cancelling === order.orderNumber}
                                                    className="text-[10px] font-poppins uppercase tracking-widest text-charcoal-400 hover:text-red-500 underline underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {cancelling === order.orderNumber ? 'Cancelling...' : 'Cancel Order'}
                                                </button>
                                            )}
                                            {order.paymentMethod && order.paymentMethod.toLowerCase() !== 'cod' && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); alert('Retry Payment feature coming soon!'); }}
                                                    className="text-[10px] font-poppins uppercase tracking-widest text-brand-orange hover:text-brand-orange-dark underline underline-offset-4 transition-colors"
                                                >
                                                    Retry Payment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                isOpen={cancelModalOpen}
                title="Cancel Order"
                danger={true}
                confirmText="Cancel Order"
                onClose={() => setCancelModalOpen(false)}
                onConfirm={confirmCancel}
                message={
                    <div>
                        <p className="mb-4 text-black">Are you sure you want to cancel this order? This action cannot be undone.</p>
                        <label className="block text-xs font-poppins font-semibold text-charcoal-900 mb-2">Reason (Optional)</label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full border border-charcoal-200 rounded-xl p-3 text-sm font-inter focus:border-brand-orange outline-none resize-none transition-colors"
                            rows={3}
                            placeholder="Tell us why..."
                        />
                    </div>
                }
            />
        </AccountLayout>
    );
}
