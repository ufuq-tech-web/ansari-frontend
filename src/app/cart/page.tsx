"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { customerApi } from '../../lib/customer-api';
import ConfirmModal from '../../components/shared/ConfirmModal';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

export default function CartPage() {
  const router = useRouter();
  const { items, updateQty, removeItem, subtotal, itemCount, hydrated, refreshCart } = useCart();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  
  if (!hydrated) return null;

  const hasInactiveItems = items.some(item => typeof item.isActive === 'boolean' && !item.isActive);

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-brand-ivory flex items-center justify-center">
        <div className="container-main py-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-charcoal-100 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-charcoal-400" strokeWidth={2} />
          </div>
          <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Your cart is empty</h1>
          <p className="text-black font-inter mt-1 text-sm mb-4">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/" className="btn-primary">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleProceedToCheckout = async () => {
    if (hasInactiveItems) return;
    setValidating(true);
    setValidationError('');
    try {
      const cartResp = await customerApi.get<any[]>('/cart');
      
      const hasBlocked = cartResp.some((row) => row.product.isActive === false);
      if (hasBlocked) {
        setValidationError('One or more items in your cart are no longer available. We have updated your cart.');
        refreshCart();
        return;
      }
      
      const hasInsufficientStock = cartResp.find((row) => row.qty > row.product.stockQuantity);
      if (hasInsufficientStock) {
        setValidationError(`Sorry, we only have ${hasInsufficientStock.product.stockQuantity} left of "${hasInsufficientStock.product.name}". Please reduce the quantity.`);
        refreshCart();
        return;
      }

      router.push('/checkout');
    } catch {
      setValidationError('Failed to validate your cart. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="container-main py-8 sm:py-12">
        <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl sm:text-3xl mb-6">
          Shopping Cart <span className="text-charcoal-500 font-medium text-lg">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Line items */}
          <div className="flex-1 min-w-0 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-charcoal-100 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="(min-width: 640px) 112px, 96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs text-charcoal-400 font-inter uppercase tracking-wide">{item.brand}</span>
                      <h3 className={`font-poppins font-bold text-sm sm:text-base leading-snug truncate ${item.isActive === false ? 'text-charcoal-400 line-through' : 'text-charcoal-900'}`}>{item.name}</h3>
                      {item.isActive === false && (
                        <p className="text-xs font-bold text-red-500 mt-1">Currently Unavailable</p>
                      )}
                    </div>
                    <button
                      onClick={() => setItemToRemove(item.id)}
                      className="p-1.5 text-charcoal-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center border border-charcoal-200 rounded-lg">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="p-2 text-charcoal-600 hover:text-brand-orange transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <span className="w-8 text-center text-sm font-poppins font-semibold text-charcoal-900">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-2 text-charcoal-600 hover:text-brand-orange transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.isActive !== false ? (
                        <>
                          <span className="font-manrope font-bold text-charcoal-900 text-base">₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</span>
                          {item.price > item.salePrice && (
                            <span className="text-xs text-charcoal-400 line-through font-manrope">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                          )}
                        </>
                      ) : (
                        <span className="font-manrope font-bold text-charcoal-400 text-base">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="font-poppins font-bold text-charcoal-900 text-lg mb-4">Order Summary</h2>
              <div className="space-y-2.5 text-sm font-inter">
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
                {shipping > 0 ? (
                  <div className="bg-charcoal-50 rounded-xl p-3 border border-charcoal-150 mt-2">
                    <p className="text-xs text-charcoal-600 font-medium">
                      Add <span className="font-bold text-brand-orange">₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('en-IN')}</span> more for FREE Shipping!
                    </p>
                    <div className="w-full bg-charcoal-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-brand-orange h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                    <p className="text-xs text-emerald-800 font-semibold">Your order qualifies for FREE Shipping!</p>
                  </div>
                )}
              </div>
              <div className="border-t border-charcoal-200 mt-4 pt-4 flex items-center justify-between">
                <span className="font-poppins font-semibold text-charcoal-900">Total</span>
                <span className="font-manrope font-bold text-charcoal-900 text-xl">₹{total.toLocaleString('en-IN')}</span>
              </div>

              {hasInactiveItems && (
                <p className="text-xs text-red-500 font-inter mt-3 text-center bg-red-50 p-2 rounded-lg">Please remove unavailable items to proceed.</p>
              )}

              {validationError && (
                <p className="text-xs text-red-500 font-inter mt-3 text-center bg-red-50 p-2 rounded-lg">{validationError}</p>
              )}

              <button 
                onClick={handleProceedToCheckout}
                disabled={hasInactiveItems || validating} 
                className={`btn-primary w-full justify-center mt-5 ${hasInactiveItems || validating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {validating ? 'Validating...' : 'Proceed to Checkout'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 space-y-2">
                <span className="flex items-center gap-2 text-xs text-charcoal-500 font-inter">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> Secure checkout
                </span>
                <span className="flex items-center gap-2 text-xs text-charcoal-500 font-inter">
                  <Truck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> Free shipping above ₹999
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={itemToRemove !== null}
        title="Remove Item"
        danger={true}
        confirmText="Remove"
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            removeItem(itemToRemove);
            setItemToRemove(null);
          }
        }}
        message={
          <p className="text-black">
            Are you sure you want to remove this item from your shopping cart?
          </p>
        }
      />
    </div>
  );
}
