import { Truck, Package } from 'lucide-react';
import type { Order } from '../lib/orders';

const PAYMENT_LABELS: Record<string, string> = {
    cod: 'Cash on Delivery',
    card: 'Credit / Debit Card',
    upi: 'UPI',
};

export default function OrderSummaryCard({ order, showDelivery = true, onCancelItem, isCancellingItem }: { order: Order; showDelivery?: boolean; onCancelItem?: (itemId: string) => void; isCancellingItem?: string | null }) {
    const placedDate = new Date(order.placedAt);
    const deliveryStart = new Date(placedDate);
    deliveryStart.setDate(deliveryStart.getDate() + 5);
    const deliveryEnd = new Date(placedDate);
    deliveryEnd.setDate(deliveryEnd.getDate() + 7);
    const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    return (
        <div className="bg-white rounded-2xl shadow-card p-5 sm:p-6">
            {showDelivery && (
                <div className="flex items-center gap-3 pb-4 border-b border-charcoal-200">
                    <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-5 h-5 text-brand-orange" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="font-poppins font-semibold text-black text-sm">Estimated delivery</p>
                        <p className="text-sm text-black font-inter">{fmt(deliveryStart)} – {fmt(deliveryEnd)}</p>
                    </div>
                </div>
            )}

            <div className={`py-4 border-b border-charcoal-200 space-y-4 ${showDelivery ? '' : 'pt-0'}`}>
                {order.items.map((item) => {
                    const isCancelled = item.status === 'CANCELLED';
                    const isOrderCancellable = order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && order.status !== 'SHIPPED';
                    const activeCancelledOrders = order.items.filter(i => i.status !== 'CANCELLED').length;
                    
                    return (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-14 h-14 rounded-lg overflow-hidden bg-charcoal-100 flex-shrink-0 ${isCancelled ? 'opacity-50 grayscale' : ''}`}>
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm font-inter truncate ${isCancelled ? 'text-charcoal-400 line-through' : 'text-black'}`}>{item.name}</p>
                                    {isCancelled && <span className="px-1.5 py-0.5 text-[8px] font-poppins font-bold uppercase tracking-widest border border-red-200 text-red-500 rounded bg-red-50">Cancelled</span>}
                                </div>
                                <p className={`text-xs font-inter ${isCancelled ? 'text-charcoal-400 opacity-70' : 'text-black'}`}>{item.brand} · Qty {item.qty}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pl-17 sm:pl-0 mt-1 sm:mt-0">
                            {isOrderCancellable && !isCancelled && onCancelItem && activeCancelledOrders > 1 && (
                                <button 
                                    onClick={() => onCancelItem(item.id)}
                                    disabled={!!isCancellingItem}
                                    className="text-[10px] font-poppins uppercase tracking-wider text-black hover:text-red-500 underline underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCancellingItem === item.id ? 'Cancelling...' : 'Cancel Item'}
                                </button>
                            )}
                            <span className={`text-sm font-manrope font-semibold ${isCancelled ? 'text-charcoal-400 line-through' : 'text-black'}`}>₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                )})}
            </div>

            <div className="py-4 border-b border-charcoal-200 space-y-2 text-sm font-inter">
                <div className="flex items-center justify-between text-black">
                    <span>Subtotal</span>
                    <span className="text-black font-manrope font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-black">
                    <span>Shipping</span>
                    <span className="text-black font-manrope font-medium">{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                </div>
                {order.discount > 0 && (
                    <div className="flex items-center justify-between text-brand-green">
                        <span>Coupon Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                        <span className="font-manrope font-medium">−₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                )}
                <div className="flex items-center justify-between pt-2">
                    <span className="font-poppins font-semibold text-black">Total</span>
                    <span className="font-manrope font-bold text-black text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div className="pt-4 grid sm:grid-cols-2 gap-4 text-sm font-inter">
                <div>
                    <p className="font-poppins font-semibold text-black text-xs uppercase tracking-wide mb-1">Shipping to</p>
                    {order.address ? (
                        <>
                            <p className="text-black">{order.address.name}</p>
                            <p className="text-black">{order.address.line1}</p>
                            <p className="text-black">{order.address.city}, {order.address.state} {order.address.pincode}</p>
                            <p className="text-black">{order.address.phone}</p>
                        </>
                    ) : (
                        <p className="text-black italic">Address unavailable</p>
                    )}
                </div>
                <div>
                    <p className="font-poppins font-semibold text-black text-xs uppercase tracking-wide mb-1">Payment method</p>
                    <p className="text-black flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-black" strokeWidth={2} /> {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                    </p>
                </div>
            </div>
        </div>
    );
}
