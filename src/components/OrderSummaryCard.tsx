import { Truck, Package } from 'lucide-react';
import type { Order } from '../lib/orders';

const PAYMENT_LABELS: Record<Order['paymentMethod'], string> = {
    cod: 'Cash on Delivery',
    card: 'Credit / Debit Card',
    upi: 'UPI',
};

export default function OrderSummaryCard({ order, showDelivery = true }: { order: Order; showDelivery?: boolean }) {
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
                        <p className="font-poppins font-semibold text-charcoal-900 text-sm">Estimated delivery</p>
                        <p className="text-sm text-charcoal-500 font-inter">{fmt(deliveryStart)} – {fmt(deliveryEnd)}</p>
                    </div>
                </div>
            )}

            <div className={`py-4 border-b border-charcoal-200 space-y-3 ${showDelivery ? '' : 'pt-0'}`}>
                {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-charcoal-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-inter text-charcoal-900 truncate">{item.name}</p>
                            <p className="text-xs text-charcoal-400 font-inter">{item.brand} · Qty {item.qty}</p>
                        </div>
                        <span className="text-sm font-manrope font-semibold text-charcoal-900 flex-shrink-0">₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                ))}
            </div>

            <div className="py-4 border-b border-charcoal-200 space-y-2 text-sm font-inter">
                <div className="flex items-center justify-between text-charcoal-600">
                    <span>Subtotal</span>
                    <span className="text-charcoal-900 font-manrope font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-charcoal-600">
                    <span>Shipping</span>
                    <span className="text-charcoal-900 font-manrope font-medium">{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span className="font-poppins font-semibold text-charcoal-900">Total</span>
                    <span className="font-manrope font-bold text-charcoal-900 text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div className="pt-4 grid sm:grid-cols-2 gap-4 text-sm font-inter">
                <div>
                    <p className="font-poppins font-semibold text-charcoal-900 text-xs uppercase tracking-wide mb-1">Shipping to</p>
                    <p className="text-charcoal-600">{order.address.fullName}</p>
                    <p className="text-charcoal-600">{order.address.line1}</p>
                    <p className="text-charcoal-600">{order.address.city}, {order.address.state} {order.address.pincode}</p>
                    <p className="text-charcoal-600">{order.address.phone}</p>
                </div>
                <div>
                    <p className="font-poppins font-semibold text-charcoal-900 text-xs uppercase tracking-wide mb-1">Payment method</p>
                    <p className="text-charcoal-600 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-charcoal-400" strokeWidth={2} /> {PAYMENT_LABELS[order.paymentMethod]}
                    </p>
                </div>
            </div>
        </div>
    );
}
