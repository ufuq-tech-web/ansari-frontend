"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, ShieldCheck, Banknote, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { saveOrder } from '../../lib/orders';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

interface Address {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
}

const emptyAddress: Address = { fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' };

export default function CheckoutPage() {
    const { items, subtotal, clearCart, hydrated } = useCart();
    const router = useRouter();
    const [address, setAddress] = useState<Address>(emptyAddress);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi'>('cod');
    const [placingOrder, setPlacingOrder] = useState(false);
    const redirecting = useRef(false);

    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    useEffect(() => {
        if (hydrated && items.length === 0 && !redirecting.current) {
            router.replace('/cart');
        }
    }, [hydrated, items.length, router]);

    if (!hydrated || items.length === 0) return null;

    const isValid = Object.values(address).every((v) => v.trim().length > 0);

    const handlePlaceOrder = () => {
        if (!isValid) return;
        redirecting.current = true;
        setPlacingOrder(true);

        const orderNumber = `ord-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
        const order = {
            orderNumber,
            placedAt: new Date().toISOString(),
            items: items.map((i) => ({ id: i.id, name: i.name, brand: i.brand, image: i.image, qty: i.qty, salePrice: i.salePrice })),
            subtotal,
            shipping,
            total,
            address,
            paymentMethod,
        };
        saveOrder(order);
        clearCart();
        router.push(`/order-confirmation?order=${orderNumber}`);
    };

    return (
        <div className="min-h-screen bg-brand-ivory">
            <div className="container-main py-8 sm:py-12">
                <nav aria-label="Breadcrumb" className="mb-4">
                    <ol className="flex items-center gap-2 text-sm text-charcoal-500 font-inter">
                        <li><Link href="/cart" className="hover:text-brand-orange transition-colors">Cart</Link></li>
                        <li aria-hidden><span className="text-charcoal-300">/</span></li>
                        <li className="text-charcoal-900 font-medium">Checkout</li>
                    </ol>
                </nav>
                <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl sm:text-3xl mb-6">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Shipping address */}
                        <div className="bg-white rounded-2xl shadow-card p-5 sm:p-6">
                            <h2 className="font-poppins font-bold text-charcoal-900 text-lg mb-4">Shipping Address</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <input
                                    value={address.fullName}
                                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                    placeholder="Full name"
                                    className="sm:col-span-2 px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                                />
                                <input
                                    value={address.phone}
                                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                    placeholder="Phone number"
                                    type="tel"
                                    className="px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                                />
                                <input
                                    value={address.pincode}
                                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                    placeholder="Pincode"
                                    className="px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                                />
                                <input
                                    value={address.line1}
                                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                                    placeholder="Address (house no, street, area)"
                                    className="sm:col-span-2 px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                                />
                                <input
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    placeholder="City"
                                    className="px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                                />
                                <input
                                    value={address.state}
                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                    placeholder="State"
                                    className="px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Payment method */}
                        <div className="bg-white rounded-2xl shadow-card p-5 sm:p-6">
                            <h2 className="font-poppins font-bold text-charcoal-900 text-lg mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                {[
                                    { value: 'cod' as const, label: 'Cash on Delivery', icon: Banknote },
                                    { value: 'card' as const, label: 'Credit / Debit Card', icon: CreditCard },
                                    { value: 'upi' as const, label: 'UPI', icon: Smartphone },
                                ].map((m) => (
                                    <label
                                        key={m.value}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === m.value ? 'border-brand-orange bg-brand-orange/5' : 'border-charcoal-200 hover:border-charcoal-400'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === m.value}
                                            onChange={() => setPaymentMethod(m.value)}
                                            className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                                        />
                                        <m.icon className="w-5 h-5 text-charcoal-600" strokeWidth={2} />
                                        <span className="font-inter text-sm text-charcoal-900">{m.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-card p-5 sm:p-6 lg:sticky lg:top-24">
                            <h2 className="font-poppins font-bold text-charcoal-900 text-lg mb-4">Order Summary</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-charcoal-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-inter text-charcoal-900 truncate">{item.name}</p>
                                            <p className="text-xs text-charcoal-400 font-inter">Qty {item.qty}</p>
                                        </div>
                                        <span className="text-sm font-manrope font-semibold text-charcoal-900 flex-shrink-0">₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-charcoal-200 mt-4 pt-4 space-y-2.5 text-sm font-inter">
                                <div className="flex items-center justify-between text-charcoal-600">
                                    <span>Subtotal</span>
                                    <span className="text-charcoal-900 font-manrope font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center justify-between text-charcoal-600">
                                    <span>Shipping</span>
                                    <span className={`font-manrope ${shipping === 0 ? 'text-brand-green font-medium' : 'text-charcoal-900 font-medium'}`}>
                                        {shipping === 0 ? 'Free' : `₹${shipping}`}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t border-charcoal-200 mt-4 pt-4 flex items-center justify-between">
                                <span className="font-poppins font-semibold text-charcoal-900">Total</span>
                                <span className="font-manrope font-bold text-charcoal-900 text-xl">₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!isValid || placingOrder}
                                className="btn-primary w-full justify-center mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {placingOrder ? 'Placing Order…' : 'Place Order'}
                            </button>
                            {!isValid && (
                                <p className="text-xs text-brand-orange font-inter mt-2 text-center">Fill in your shipping address to continue</p>
                            )}

                            <div className="mt-4 space-y-2">
                                <span className="flex items-center gap-2 text-xs text-charcoal-500 font-inter">
                                    <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> Secure checkout
                                </span>
                                <span className="flex items-center gap-2 text-xs text-charcoal-500 font-inter">
                                    <Truck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> Delivery in 5-7 business days
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
