"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Truck, ShieldCheck, Banknote, CreditCard, Smartphone, Tag, X, Lock } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useAuthStore } from "../../lib/auth-store";
import { customerApi, ApiError } from '../../lib/customer-api';
import { storefrontApi } from '../../lib/storefront-api';

interface Address {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
}

const emptyAddress: Address = { fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' };

function FormField({ label, ...props }: any) {
    const { className, ...rest } = props;
    return (
        <div className={className}>
            <label className="block text-xs font-poppins font-semibold text-charcoal-700 uppercase tracking-wide mb-1.5">{label}</label>
            <input
                {...rest}
                className="w-full px-4 py-3 rounded-xl bg-charcoal-50 border border-transparent focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
            />
        </div>
    );
}

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const VISIBLE_COUPONS = 2;

function CouponSection({ couponInput, setCouponInput, couponError, applyingCoupon, activeCoupons, onApply }: {
    couponInput: string;
    setCouponInput: (v: string) => void;
    couponError: string;
    applyingCoupon: boolean;
    activeCoupons: any[];
    onApply: (code?: string) => void;
}) {
    const [showAll, setShowAll] = useState(false);
    const visibleCoupons = showAll ? activeCoupons : activeCoupons.slice(0, VISIBLE_COUPONS);
    const hasMore = activeCoupons.length > VISIBLE_COUPONS;

    return (
        <div>
            <div className="flex gap-2 relative">
                <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 px-4 py-3 rounded-xl bg-charcoal-50 border border-transparent focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 outline-none font-inter text-sm text-charcoal-900 placeholder:text-charcoal-400 transition-all uppercase"
                />
                <button
                    onClick={() => onApply()}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-charcoal-900 text-white font-poppins font-semibold text-xs uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50"
                >
                    {applyingCoupon ? '...' : 'Apply'}
                </button>
            </div>
            {couponError && <p className="text-xs text-red-600 font-inter mt-2 ml-1">{couponError}</p>}

            {activeCoupons.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs font-poppins font-semibold text-charcoal-500 uppercase tracking-wider mb-3">Available Coupons</p>
                    <div className="space-y-2">
                        {visibleCoupons.map((c) => (
                            <button key={c.id} onClick={(e) => { e.preventDefault(); onApply(c.code); }} className="w-full flex items-center justify-between p-3 rounded-xl border border-charcoal-200 hover:border-brand-orange bg-charcoal-50/50 hover:bg-brand-orange/5 transition-all text-left group">
                                <div>
                                    <p className="font-poppins font-bold text-charcoal-900 text-sm flex items-center gap-2 group-hover:text-brand-orange transition-colors"><Tag className="w-3.5 h-3.5 text-brand-orange" /> {c.code}</p>
                                    <p className="text-xs text-charcoal-600 mt-1 font-inter">{c.type === 'PERCENT' ? `${c.value}% OFF` : `₹${c.value} OFF`} {c.minOrder > 0 ? `on orders over ₹${c.minOrder}` : ''}</p>
                                </div>
                                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider bg-brand-orange/10 px-2.5 py-1.5 rounded-lg whitespace-nowrap">Tap to Apply</span>
                            </button>
                        ))}
                    </div>
                    {hasMore && (
                        <button
                            onClick={() => setShowAll((v) => !v)}
                            className="mt-2 w-full text-center text-xs font-poppins font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors py-1.5"
                        >
                            {showAll ? 'Show less' : `Show all ${activeCoupons.length} coupons`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CheckoutPage() {
    const { items, subtotal, clearCart, hydrated } = useCart();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const authLoading = useAuthStore(state => state.loading);
    const router = useRouter();
    const [address, setAddress] = useState<Address>(emptyAddress);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState('');
    const redirecting = useRef(false);

    const [shippingSettings, setShippingSettings] = useState({ flatRate: 79, freeShippingThreshold: 999 });
    const [couponInput, setCouponInput] = useState('');
    const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [activeCoupons, setActiveCoupons] = useState<any[]>([]);
    const [couponError, setCouponError] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    useEffect(() => {
        storefrontApi.getShippingSettings().then(setShippingSettings);
        customerApi.get<any[]>('/users/me/addresses').then(addrs => {
            const uniqueAddrs = addrs.filter((addr, index, self) =>
                index === self.findIndex((t) => (
                    t.name === addr.name && t.phone === addr.phone && t.line1 === addr.line1 && t.pincode === addr.pincode
                ))
            );
            setSavedAddresses(uniqueAddrs);
            if (uniqueAddrs.length > 0) setSelectedAddressId(uniqueAddrs[0].id);
        }).catch(() => { });
        customerApi.get<any[]>('/coupons/active').then(setActiveCoupons).catch(() => { });
    }, []);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            redirecting.current = true;
            router.replace(`/login?redirect=${encodeURIComponent('/checkout')}`);
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (hydrated && items.length === 0 && !redirecting.current) {
            router.replace('/cart');
        }
    }, [hydrated, items.length, router]);

    if (authLoading || !isAuthenticated || !hydrated || (items.length === 0 && !redirecting.current)) {
        return (
            <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center pb-20">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-inter text-charcoal-500 text-sm animate-pulse">Preparing Checkout...</p>
            </div>
        );
    }

    const isNewAddressValid = Object.values(address).every((v) => v.trim().length > 0);
    const isValid = selectedAddressId !== 'new' || isNewAddressValid;

    const shipping = subtotal === 0 || subtotal >= shippingSettings.freeShippingThreshold ? 0 : shippingSettings.flatRate;
    const discount = coupon?.discount ?? 0;
    const total = Math.max(subtotal + shipping - discount, 0);

    const handleApplyCoupon = async (codeOverwrite?: string) => {
        const codeToApply = (typeof codeOverwrite === 'string' ? codeOverwrite : couponInput).trim();
        if (!codeToApply) return;
        setApplyingCoupon(true);
        setCouponError('');
        try {
            const res = await customerApi.post<{ code: string; discount: number }>('/coupons/validate', {
                code: codeToApply,
                subtotal,
            });
            setCoupon({ code: res.code, discount: res.discount });
            if (typeof codeOverwrite === 'string') setCouponInput(codeOverwrite);
        } catch (err) {
            setCoupon(null);
            const errMsg = err instanceof ApiError ? err.message : 'Could not apply this coupon.';
            setCouponError(errMsg);
            toast.error(errMsg);
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCoupon(null);
        setCouponInput('');
        setCouponError('');
    };

    const handlePlaceOrder = async () => {
        if (!isValid) return;
        setPlacingOrder(true);
        setOrderError('');
        try {
            let addressIdSelected = selectedAddressId;
            if (addressIdSelected === 'new') {
                const newAddress = await customerApi.post<{ id: string }>('/users/me/addresses', {
                    name: address.fullName,
                    phone: address.phone,
                    line1: address.line1,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    isDefault: true,
                });
                addressIdSelected = newAddress.id;
                setSelectedAddressId(newAddress.id);
                setSavedAddresses(prev => [...prev, {
                    id: newAddress.id, name: address.fullName, phone: address.phone,
                    line1: address.line1, city: address.city, state: address.state, pincode: address.pincode
                }]);
            }

            if (paymentMethod === 'card') {
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    throw new Error('Razorpay SDK failed to load. Check your connection.');
                }

                const initResponse = await customerApi.post<{ orderNumber: string, status: string, razorpayOrderId?: string, amount?: number, currency?: string }>('/orders/checkout-init', {
                    addressId: addressIdSelected,
                    paymentMethod,
                    couponCode: coupon?.code,
                });
                
                // Delay syncing the frontend context state so the page DOM doesn't collapse during the router transition
                setTimeout(() => clearCart(), 1500);

                if (initResponse.status === 'PLACED') {
                    redirecting.current = true;
                    router.push(`/order-confirmation?order=${initResponse.orderNumber}`);
                    return;
                }

                const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

                const options = {
                    key: keyId,
                    amount: initResponse.amount,
                    currency: initResponse.currency,
                    name: 'Ufuq Boot House',
                    description: 'Order Checkout',
                    order_id: initResponse.razorpayOrderId,
                    handler: async function (response: any) {
                        try {
                            await customerApi.post('/orders/checkout-verify', {
                                orderNumber: initResponse.orderNumber,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            });
                            redirecting.current = true;
                            router.push(`/order-confirmation?order=${initResponse.orderNumber}`);
                        } catch (err) {
                            setOrderError(err instanceof ApiError ? err.message : 'Payment verification failed on server.');
                            setPlacingOrder(false);
                            // We shouldn't fail it outright if verification failed, maybe it's a network issue?
                            // But usually, it means we can send them to payment failed.
                            router.push(`/payment-failed?order=${initResponse.orderNumber}`);
                        }
                    },
                    prefill: {
                        name: address.fullName || 'User',
                        contact: address.phone || '9999999999'
                    },
                    theme: {
                        color: '#EA580C' // brand-orange
                    },
                    modal: {
                        ondismiss: async () => {
                            setPlacingOrder(false);
                            try {
                                await customerApi.post('/orders/checkout-fail', { orderNumber: initResponse.orderNumber });
                                router.push(`/payment-failed?order=${initResponse.orderNumber}`);
                            } catch (e) {
                                setOrderError('An error occurred while cleaning up your session.');
                            }
                        }
                    }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.on('payment.failed', function (response: any) {
                    setOrderError(response.error.description || 'Payment Failed. You can retry inside the modal, or close it.');
                });
                paymentObject.open();

            } else {
                const initResponse = await customerApi.post<{ orderNumber: string }>('/orders/checkout-init', {
                    addressId: addressIdSelected,
                    paymentMethod,
                    couponCode: coupon?.code,
                });
                
                // Delay syncing the frontend context state so the page DOM doesn't collapse during the router transition
                setTimeout(() => clearCart(), 1500);

                redirecting.current = true;
                router.push(`/order-confirmation?order=${initResponse.orderNumber}`);
            }
        } catch (err) {
            const errMsg = err instanceof ApiError ? err.message : (err as Error).message || 'Could not place your order.';
            if (errMsg.toLowerCase().includes('wallet')) {
                toast.error(errMsg, {
                    position: 'top-center',
                    style: {
                        background: '#EF4444',
                        color: '#fff',
                        fontWeight: '600',
                        padding: '16px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#EF4444',
                    },
                });
            } else {
                setOrderError(errMsg);
                toast.error(errMsg);
            }
            setPlacingOrder(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-ivory pb-20">
            {/* Minimal Header for Checkout */}
            <header className="bg-white border-b border-charcoal-200 py-4">
                <div className="container-main flex items-center justify-between">
                    <Link href="/" className="font-poppins font-extrabold text-2xl tracking-tight text-primary">
                        UFUQ <span className="text-brand-orange">.</span>
                    </Link>
                    <div className="flex items-center gap-2 text-charcoal-500 font-inter text-sm">
                        <Lock className="w-4 h-4" strokeWidth={2} />
                        Secure Checkout
                    </div>
                </div>
            </header>

            <div className="container-main py-8 sm:py-12">
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex items-center gap-2 text-sm text-charcoal-500 font-inter">
                        <li><Link href="/cart" className="hover:text-brand-orange transition-colors">Cart</Link></li>
                        <li aria-hidden><span className="text-charcoal-300">/</span></li>
                        <li className="text-charcoal-900 font-medium">Checkout</li>
                    </ol>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="flex-1 min-w-0 space-y-8">
                        {/* Shipping address */}
                        <section className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
                            <h2 className="font-poppins font-bold text-charcoal-900 text-xl sm:text-2xl mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-charcoal-900 text-white text-sm">1</span>
                                Shipping Address
                            </h2>
                            {savedAddresses.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    {savedAddresses.map(addr => (
                                        <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/20' : 'border-charcoal-100 hover:border-charcoal-300 bg-charcoal-50/50'}`}>
                                            <div className="mt-1 flex-shrink-0">
                                                <input type="radio" name="addressSelect" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="w-4 h-4 text-brand-orange focus:ring-brand-orange" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-poppins font-semibold text-charcoal-900 text-sm">{addr.name} <span className="text-charcoal-500 font-normal">({addr.phone})</span></p>
                                                <p className="text-sm text-charcoal-600 font-inter mt-1">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                            </div>
                                        </label>
                                    ))}
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/20' : 'border-charcoal-100 hover:border-charcoal-300 bg-charcoal-50/50'}`}>
                                        <input type="radio" name="addressSelect" checked={selectedAddressId === 'new'} onChange={() => setSelectedAddressId('new')} className="w-4 h-4 text-brand-orange focus:ring-brand-orange" />
                                        <span className="font-poppins font-semibold text-charcoal-900 text-sm">Add a New Address</span>
                                    </label>
                                </div>
                            )}

                            {selectedAddressId === 'new' && (
                                <div className="grid sm:grid-cols-2 gap-x-5 gap-y-6">
                                    <FormField
                                        label="Full Name"
                                        value={address.fullName}
                                        onChange={(e: any) => setAddress({ ...address, fullName: e.target.value })}
                                        placeholder="Enter your full name"
                                        className="sm:col-span-2"
                                    />
                                    <FormField
                                        label="Phone Number"
                                        type="tel"
                                        value={address.phone}
                                        onChange={(e: any) => setAddress({ ...address, phone: e.target.value })}
                                        placeholder="+91"
                                    />
                                    <FormField
                                        label="Pincode"
                                        value={address.pincode}
                                        onChange={(e: any) => setAddress({ ...address, pincode: e.target.value })}
                                        placeholder="e.g. 400001"
                                    />
                                    <FormField
                                        label="Address"
                                        value={address.line1}
                                        onChange={(e: any) => setAddress({ ...address, line1: e.target.value })}
                                        placeholder="House No, Street, Area"
                                        className="sm:col-span-2"
                                    />
                                    <FormField
                                        label="City"
                                        value={address.city}
                                        onChange={(e: any) => setAddress({ ...address, city: e.target.value })}
                                        placeholder="City"
                                    />
                                    <FormField
                                        label="State"
                                        value={address.state}
                                        onChange={(e: any) => setAddress({ ...address, state: e.target.value })}
                                        placeholder="State"
                                    />
                                </div>
                            )}
                        </section>

                        {/* Payment method */}
                        <section className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
                            <h2 className="font-poppins font-bold text-charcoal-900 text-xl sm:text-2xl mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-charcoal-900 text-white text-sm">2</span>
                                Payment Method
                            </h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    { value: 'cod' as const, label: 'Cash on Delivery', icon: Banknote },
                                    { value: 'card' as const, label: 'Credit / Debit', icon: CreditCard },
                                    { value: 'wallet' as const, label: 'Wallet', icon: Smartphone },
                                ].map((m) => (
                                    <label
                                        key={m.value}
                                        className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === m.value
                                            ? 'border-brand-orange bg-brand-orange/5 shadow-sm ring-1 ring-brand-orange/20'
                                            : 'border-charcoal-100 hover:border-charcoal-300 bg-charcoal-50/50 hover:bg-charcoal-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === m.value}
                                            onChange={() => setPaymentMethod(m.value)}
                                            className="sr-only"
                                        />
                                        <m.icon className={`w-8 h-8 ${paymentMethod === m.value ? 'text-brand-orange' : 'text-charcoal-400'}`} strokeWidth={1.5} />
                                        <span className={`font-poppins font-semibold text-sm text-center ${paymentMethod === m.value ? 'text-charcoal-900' : 'text-charcoal-600'}`}>{m.label}</span>

                                        {/* Selection indicator */}
                                        <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.value ? 'border-brand-orange' : 'border-charcoal-300'}`}>
                                            {paymentMethod === m.value && <div className="w-2 h-2 rounded-full bg-brand-orange" />}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Order summary */}
                    <div className="lg:w-[380px] flex-shrink-0">
                        <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8 lg:sticky lg:top-8">
                            <h2 className="font-poppins font-bold text-charcoal-900 text-xl mb-6">Order Summary</h2>
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-charcoal-100 flex-shrink-0 border border-charcoal-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="text-sm font-sora font-semibold text-charcoal-900 truncate">{item.name}</p>
                                            <p className="text-xs text-charcoal-500 font-inter mt-0.5">Qty: <span className="font-semibold text-charcoal-900">{item.qty}</span></p>
                                            <span className="text-sm font-manrope font-bold text-brand-orange mt-1">₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            {(coupon || activeCoupons.length > 0) && (
                            <div className="border-t border-charcoal-100 mt-6 pt-6">
                                {coupon ? (
                                    <div className="flex items-center justify-between bg-brand-green/10 border border-brand-green/20 rounded-xl px-4 py-3">
                                        <span className="flex items-center gap-2 text-sm font-poppins font-semibold text-brand-green">
                                            <Tag className="w-4 h-4" /> {coupon.code} Applied
                                        </span>
                                        <button onClick={handleRemoveCoupon} aria-label="Remove coupon" className="p-1 rounded-full hover:bg-brand-green/10">
                                            <X className="w-4 h-4 text-brand-green" />
                                        </button>
                                    </div>
                                ) : (
                                    <CouponSection
                                        couponInput={couponInput}
                                        setCouponInput={setCouponInput}
                                        couponError={couponError}
                                        applyingCoupon={applyingCoupon}
                                        activeCoupons={activeCoupons}
                                        onApply={handleApplyCoupon}
                                    />
                                )}
                            </div>
                            )}

                            <div className="border-t border-charcoal-100 mt-6 pt-6 space-y-3 text-sm font-inter">
                                <div className="flex items-center justify-between text-charcoal-600">
                                    <span>Subtotal</span>
                                    <span className="text-charcoal-900 font-manrope font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-brand-green">
                                        <span>Discount</span>
                                        <span className="font-manrope font-semibold">−₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-charcoal-600">
                                    <span>Shipping</span>
                                    <span className={`font-manrope ${shipping === 0 ? 'text-brand-green font-semibold' : 'text-charcoal-900 font-semibold'}`}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-charcoal-900 mt-6 pt-6 flex items-end justify-between">
                                <span className="font-poppins font-bold text-charcoal-900 text-lg">Total</span>
                                <span className="font-manrope font-extrabold text-brand-orange text-3xl">₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            {orderError && <p className="text-xs text-red-600 font-inter mt-4 text-center p-3 bg-red-50 rounded-xl">{orderError}</p>}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!isValid || placingOrder}
                                className={`w-full flex items-center justify-center gap-2 py-4 mt-6 rounded-2xl font-poppins font-bold text-base transition-all shadow-lg ${isValid
                                        ? 'bg-brand-orange text-white hover:bg-brand-orange-dark hover:shadow-brand-orange/30 hover:-translate-y-0.5'
                                        : 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed'
                                    }`}
                            >
                                <Lock className="w-4 h-4" strokeWidth={2.5} />
                                {placingOrder ? 'Processing...' : 'Place Order Securely'}
                            </button>

                            {!isValid && (
                                <p className="text-xs text-charcoal-500 font-inter mt-3 text-center">Please fill in your shipping details.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
