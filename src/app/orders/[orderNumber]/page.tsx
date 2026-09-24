"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import OrderSummaryCard from '../../../components/OrderSummaryCard';
import { getOrder, cancelOrder, type Order } from '../../../lib/orders';
import { useAuthStore } from "../../../lib/auth-store";
import AccountLayout from '../../../components/account/AccountLayout';
import ConfirmModal from '../../../components/shared/ConfirmModal';

export default function OrderDetailPage() {
    const params = useParams<{ orderNumber: string }>();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const authLoading = useAuthStore(state => state.loading);
    const [order, setOrder] = useState<Order | null | undefined>(undefined);
    const [cancelling, setCancelling] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancellingItemId, setCancellingItemId] = useState<string | null>(null);

    const promptCancelOrder = () => {
        setCancelReason("");
        setCancellingItemId(null);
        setCancelModalOpen(true);
    };

    const promptCancelItem = (itemId: string) => {
        setCancelReason("");
        setCancellingItemId(itemId);
        setCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        if (!order) return;
        setCancelling(true);
        try {
            const itemIds = cancellingItemId ? [cancellingItemId] : undefined;
            const updatedOrder = await cancelOrder(order.orderNumber, cancelReason, itemIds);
            setOrder(updatedOrder);
            setCancelModalOpen(false);
        } catch (err: any) {
            alert(err?.message || 'Failed to cancel the order. It might already be processed.');
        } finally {
            setCancelling(false);
            setCancellingItemId(null);
        }
    };

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            getOrder(params.orderNumber)
                .then((found) => setOrder(found ?? null))
                .catch(() => setOrder(null));
        }
    }, [params.orderNumber, authLoading, isAuthenticated]);

    // AccountLayout itself handles the loading state and redirect-to-login
    // for unauthenticated visitors — it must always mount for that redirect
    // to fire, so the "still fetching this order" state renders as its
    // children instead of an early return that would bypass it.
    if (order === undefined) {
        return (
            <AccountLayout>
                <div className="border border-charcoal-200 p-16 flex justify-center">
                    <div className="w-8 h-8 border-2 border-charcoal-200 border-t-charcoal-900 rounded-full animate-spin"></div>
                </div>
            </AccountLayout>
        );
    }

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
                    <ol className="flex items-center gap-3 text-[10px] font-poppins uppercase tracking-widest text-black">
                        <li><Link href="/orders" className="hover:text-brand-orange transition-colors">Orders</Link></li>
                        <li aria-hidden><span className="text-black">/</span></li>
                        <li className="text-black font-medium">#{order.orderNumber}</li>
                    </ol>
                </nav>
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-charcoal-200">
                    <div>
                        <h1 className="font-poppins font-light text-3xl sm:text-4xl text-black tracking-tight mb-2">Order #{order.orderNumber}</h1>
                        <p className="text-sm text-black font-inter">Placed on {placedDate}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-3 mt-4 sm:mt-0">
                        <span className={`px-3 py-1 text-[10px] sm:w-fit w-full text-center font-poppins font-bold uppercase tracking-widest border ${
                            order.status === 'DELIVERED' ? 'border-brand-green text-brand-green' : 
                            order.status === 'CANCELLED' ? 'border-red-400 text-red-500' :
                            'border-brand-orange text-brand-orange'
                        }`}>
                            {order.status || 'PLACED'}
                        </span>
                        
                        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && order.status !== 'SHIPPED' && (
                            <button 
                                onClick={promptCancelOrder} 
                                disabled={cancelling}
                                className="text-[10px] font-poppins uppercase tracking-widest text-black hover:text-red-500 underline underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {(cancelling && !cancellingItemId) ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        )}
                    </div>
                </div>

                <OrderSummaryCard 
                    order={order} 
                    onCancelItem={promptCancelItem}
                    isCancellingItem={cancelling ? cancellingItemId : null}
                />

                <div className="mt-12 pt-8 border-t border-charcoal-200">
                    <Link href="/" className="text-xs font-poppins uppercase tracking-widest text-black hover:text-brand-orange underline underline-offset-4 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
            
            <ConfirmModal 
                isOpen={cancelModalOpen}
                title={cancellingItemId ? "Cancel Item" : "Cancel Order"}
                danger={true}
                confirmText={cancellingItemId ? "Cancel Item" : "Cancel Order"}
                onClose={() => { setCancelModalOpen(false); setCancellingItemId(null); }}
                onConfirm={confirmCancel}
                message={
                    <div>
                        <p className="mb-4 text-black">
                            {cancellingItemId 
                                ? "Are you sure you want to cancel this specific item from your order?" 
                                : "Are you sure you want to cancel this entire order? This action cannot be undone."}
                        </p>
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
