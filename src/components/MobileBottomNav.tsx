"use client";

import Link from 'next/link';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { useWishlistStore } from '../lib/wishlist-store';

export default function MobileBottomNav() {
  const { itemCount } = useCart();
  const { ids: wishlistItems } = useWishlistStore();

  const items = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', badge: wishlistItems.length },
    { icon: ShoppingBag, label: 'Cart', href: '/cart', badge: itemCount },
    { icon: User, label: 'Account', href: '/my-account' },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-charcoal-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="relative flex flex-col items-center justify-center py-2.5 text-charcoal-500 hover:text-brand-orange active:text-brand-orange transition-colors"
            aria-label={item.label}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" strokeWidth={2} />
              {!!item.badge && (
                <span className="absolute -top-1.5 -right-2 bg-brand-orange text-white text-[9px] font-poppins font-semibold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-manrope font-medium mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
