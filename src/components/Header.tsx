"use client";

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, ArrowRight,
} from 'lucide-react';
import { slugify, priceTiers, type BuyingGuideWithCategory } from '../lib/catalog-helpers';
import { useCart } from '../lib/cart-context';
import { useWishlistStore } from '../lib/wishlist-store';
import { useGuides } from '../hooks/useGuides';
import { useHeaderScroll } from '../hooks/useHeaderScroll';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useHeaderMenus } from '../hooks/useHeaderMenus';
import { useAuthStore } from "../lib/auth-store";

interface MegaLink { label: string; to: string; }
interface MegaColumn { title: string; links: MegaLink[]; }

const subcatLink = (category: string, subcategory: string, extra?: Record<string, string>) => {
  const base = `/${category}/${slugify(subcategory)}`;
  if (!extra || Object.keys(extra).length === 0) return base;
  return `${base}?${new URLSearchParams(extra).toString()}`;
};
const sortLink = (category: string, sort: string) => `/${category}?sort=${sort}`;
const ageLink = (age: string) => `/kids?age=${encodeURIComponent(age)}`;

const popularColumn = (category: string): MegaColumn => ({
  title: 'Popular',
  links: [
    { label: 'New Arrivals', to: sortLink(category, 'newest') },
    { label: 'Best Sellers', to: sortLink(category, 'best_selling') },
    { label: 'Sale', to: sortLink(category, 'discount') },
  ],
});

const priceColumn = (category: string): MegaColumn => ({
  title: 'Price',
  links: Object.entries(priceTiers).map(([tier, info]) => ({ label: info.label, to: `/${category}/price/${tier}` })),
});

const buyingGuidesColumn = (category: string, guides: BuyingGuideWithCategory[]): MegaColumn => ({
  title: 'Buying Guides',
  links: guides.filter((g) => g.categoryKey === category).map((g) => ({ label: g.title, to: `/guides/${g.slug}` })),
});

const buildNavLinks = (guides: BuyingGuideWithCategory[]): { label: string; href: string; mega: { columns: MegaColumn[] } }[] => [
  {
    label: 'Men',
    href: '/men',
    mega: {
      columns: [
        {
          title: 'Footwear',
          links: ['Formal Shoes', 'Casual Shoes', 'Sports Shoes', 'Boots', 'Loafers'].map((l) => ({ label: l, to: subcatLink('men', l) })),
        },
        {
          title: 'Sandals',
          links: ['Flip Flops', 'Slides', 'Leather Sandals'].map((l) => ({ label: l, to: subcatLink('men', l) })),
        },
        popularColumn('men'),
        priceColumn('men'),
        buyingGuidesColumn('men', guides),
      ],
    },
  },
  {
    label: 'Women',
    href: '/women',
    mega: {
      columns: [
        {
          title: 'Footwear',
          links: ['Heels', 'Flats', 'Sneakers', 'Wedges', 'Boots'].map((l) => ({ label: l, to: subcatLink('women', l) })),
        },
        {
          title: 'Sandals',
          links: ['Strappy Sandals', 'Slippers', 'Ethnic Sandals'].map((l) => ({ label: l, to: subcatLink('women', l) })),
        },
        popularColumn('women'),
        priceColumn('women'),
        buyingGuidesColumn('women', guides),
      ],
    },
  },
  {
    label: 'Kids',
    href: '/kids',
    mega: {
      columns: [
        {
          title: 'Boys',
          links: ['School Shoes', 'Sneakers', 'Sandals'].map((l) => ({ label: l, to: subcatLink('kids', l, { gender: 'boys' }) })),
        },
        {
          title: 'Girls',
          links: ['School Shoes', 'Ballerinas', 'Sandals'].map((l) => ({ label: l, to: subcatLink('kids', l, { gender: 'girls' }) })),
        },
        {
          title: 'Age',
          links: [
            { label: '2-5 Years', to: ageLink('2-5') },
            { label: '6-9 Years', to: ageLink('6-9') },
            { label: '10-14 Years', to: ageLink('10-14') },
          ],
        },
        priceColumn('kids'),
        buyingGuidesColumn('kids', guides),
      ],
    },
  },
  {
    label: 'Accessories',
    href: '/accessories',
    mega: {
      columns: [
        {
          title: 'Care',
          links: ['Shoe Polish', 'Brushes', 'Waterproof Spray'].map((l) => ({ label: l, to: subcatLink('accessories', l) })),
        },
        {
          title: 'Comfort',
          links: ['Insoles', 'Shoe Horns', 'Laces'].map((l) => ({ label: l, to: subcatLink('accessories', l) })),
        },
        {
          title: 'Bags',
          links: ['Shoe Bags', 'Travel Bags'].map((l) => ({ label: l, to: subcatLink('accessories', l) })),
        },
        priceColumn('accessories'),
        buyingGuidesColumn('accessories', guides),
      ],
    },
  },
];

const moreLinks = [
  { label: 'Brands', href: '/brands' },
  { label: 'Collections', href: '/collections' },
  { label: 'Journal', href: '/journal' },
  { label: 'About Us', href: '/about-us' },
];

const simpleLinks = [
  { label: 'Sale', href: '/sale', highlight: true },
];

export default function Header() {
  const {
    openMenu, openMegaMenu, closeMegaMenu, handleMegaMenuBlur,
    mobileOpen, openMobileMenu, closeMobileMenu,
    searchOpen, toggleSearch,
  } = useHeaderMenus();
  const { itemCount } = useCart();
  const { ids: wishlistItems } = useWishlistStore();
  const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const logout = useAuthStore(state => state.logout);

  const guides = useGuides();
  const scrolled = useHeaderScroll();
  useBodyScrollLock(mobileOpen);

  const navLinks = useMemo(() => buildNavLinks(guides), [guides]);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-sticky' : 'shadow-sm'}`}>
      <div className="container-main">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={openMobileMenu}
              className="lg:hidden p-2 -ml-2 text-charcoal-800 hover:text-brand-orange transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>

            <Link href="/" className="flex items-center gap-2 group" aria-label="Ansary Footwear home">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-charcoal-800 flex items-center justify-center group-hover:bg-charcoal-700 transition-colors">
                <span className="font-poppins font-bold text-white text-lg">A</span>
              </div>
              <div className="leading-tight">
                <div className="font-poppins font-bold text-charcoal-900 text-base lg:text-lg">Ansari</div>
                <div className="font-poppins font-medium text-leather-400 text-[10px] lg:text-xs tracking-wider uppercase -mt-0.5">Footwear</div>
              </div>
            </Link>
          </div>

          {/* Center: nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="mega-menu-trigger relative"
                onMouseEnter={() => openMegaMenu(link.label)}
                onMouseLeave={closeMegaMenu}
                onBlur={handleMegaMenuBlur}
              >
                <Link
                  href={link.href}
                  onFocus={() => openMegaMenu(link.label)}
                  onClick={closeMegaMenu}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-manrope font-medium text-charcoal-700 hover:text-brand-orange transition-colors rounded-lg"
                >
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>

                {/* Mega Menu Panel */}
                <div className={`mega-menu absolute left-0 top-full pt-3 w-[880px] ${openMenu === link.label ? 'is-open' : ''}`}>
                  <div className="bg-white rounded-2xl shadow-card-hover border border-charcoal-200 p-6">
                    <div className="grid grid-cols-5 gap-6">
                      {link.mega.columns.map((col) => (
                        <div key={col.title}>
                          <h4 className="font-manrope font-semibold text-charcoal-900 text-sm mb-3">{col.title}</h4>
                          <ul className="space-y-2">
                            {col.links.map((l) => (
                              <li key={l.label}>
                                <Link href={l.to} className="text-sm text-charcoal-500 hover:text-brand-orange transition-colors font-inter" onClick={closeMegaMenu}>
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-charcoal-200">
                      <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm font-manrope font-semibold text-brand-orange hover:gap-2.5 transition-all" onClick={closeMegaMenu}>
                        View all {link.label} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              className="mega-menu-trigger relative"
              onMouseEnter={() => openMegaMenu('More')}
              onMouseLeave={closeMegaMenu}
              onBlur={handleMegaMenuBlur}
            >
              <button
                type="button"
                onFocus={() => openMegaMenu('More')}
                className="flex items-center gap-1 px-3 py-2 text-sm font-manrope font-medium text-charcoal-700 hover:text-brand-orange transition-colors rounded-lg"
              >
                More
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
              </button>

              <div className={`mega-menu absolute left-0 top-full pt-3 w-48 ${openMenu === 'More' ? 'is-open' : ''}`}>
                <div className="bg-white rounded-2xl shadow-card-hover border border-charcoal-200 p-2">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={closeMegaMenu}
                      className="block px-3 py-2.5 text-sm text-charcoal-700 hover:text-brand-orange hover:bg-charcoal-50 rounded-lg transition-colors font-inter"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {simpleLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-2 text-sm font-manrope font-medium transition-colors rounded-lg ${link.highlight
                  ? 'text-brand-orange font-semibold hover:bg-brand-orange/5'
                  : 'text-charcoal-700 hover:text-brand-orange'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleSearch}
              className="p-2 text-charcoal-700 hover:text-brand-orange hover:bg-charcoal-50 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
            </button>

            <Link href="/wishlist" className="relative hidden sm:flex p-2 text-charcoal-700 hover:text-brand-orange hover:bg-charcoal-50 rounded-lg transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[10px] font-poppins font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <div className="relative hidden sm:flex group">
              <Link href="/my-account" className="p-2 text-charcoal-700 hover:text-brand-orange hover:bg-charcoal-50 rounded-lg transition-colors" aria-label="Account">
                <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
              </Link>
              
              <div className="absolute right-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[220px]">
                <div className="bg-white rounded-xl shadow-card-hover border border-charcoal-200 overflow-hidden">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3.5 border-b border-charcoal-100 bg-charcoal-50">
                        <div className="font-poppins font-semibold text-sm text-black truncate">{user?.name}</div>
                        <div className="text-xs text-black font-inter truncate mt-0.5">{user?.email}</div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <Link href="/my-account" className="block px-3 py-2.5 text-sm text-black font-inter hover:bg-charcoal-50 hover:text-brand-orange rounded-lg transition-colors">Dashboard</Link>
                        <Link href="/orders" className="block px-3 py-2.5 text-sm text-black font-inter hover:bg-charcoal-50 hover:text-brand-orange rounded-lg transition-colors">My Orders</Link>
                        <Link href="/my-account/wallet" className="block px-3 py-2.5 text-sm text-black font-inter hover:bg-charcoal-50 hover:text-brand-orange rounded-lg transition-colors">My Wallet</Link>
                        <div className="h-px bg-charcoal-100 my-1"></div>
                        <button onClick={logout} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-rose-600 font-inter hover:bg-rose-50 rounded-lg transition-colors">Sign Out</button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 space-y-3">
                      <Link href="/login" className="block w-full text-center bg-charcoal-900 text-white font-poppins font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-charcoal-800 transition-colors">Sign In</Link>
                      <p className="text-center text-xs text-charcoal-500 font-inter">
                        New customer? <Link href="/signup" className="font-semibold text-charcoal-900 hover:text-brand-orange underline underline-offset-2">Create Account</Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link href="/cart" className="relative p-2 text-charcoal-700 hover:text-brand-orange hover:bg-charcoal-50 rounded-lg transition-colors" aria-label="Shopping cart">
              <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[10px] font-poppins font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar dropdown */}
      {searchOpen && (
        <div className="border-t border-charcoal-200 bg-white">
          <div className="container-main py-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" strokeWidth={2} />
              <input
                type="search"
                autoFocus
                placeholder="Search for shoes, brands, categories…"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-charcoal-200 bg-charcoal-50 focus:bg-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3 max-w-2xl mx-auto">
              <span className="text-xs text-charcoal-400 font-inter py-1.5">Trending:</span>
              {['Leather Boots', 'School Shoes', 'Sneakers', 'Sandals', 'Heels'].map((t) => (
                <button key={t} className="text-xs px-3 py-1.5 rounded-full bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-inter transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-charcoal-900/50 z-40"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div className="lg:hidden fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-charcoal-200">
              <span className="font-poppins font-bold text-charcoal-900">Menu</span>
              <button onClick={closeMobileMenu} className="p-2 -mr-2 text-charcoal-600 hover:text-charcoal-900" aria-label="Close menu">
                <X className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>

            <nav className="p-4" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} onClick={closeMobileMenu} className="block px-4 py-3 rounded-xl font-manrope font-medium text-charcoal-800 hover:bg-charcoal-50 hover:text-brand-orange transition-colors">
                      {link.label}
                    </Link>
                    <div className="pl-8 pb-3 space-y-3">
                      {link.mega.columns.map((col) => (
                        <div key={col.title}>
                          <div className="px-4 text-[11px] font-manrope font-semibold text-charcoal-600 uppercase tracking-wide mb-1">{col.title}</div>
                          <ul className="space-y-0.5">
                            {col.links.map((l) => (
                              <li key={l.label}>
                                <Link href={l.to} onClick={closeMobileMenu} className="block px-4 py-1.5 text-sm text-charcoal-800 hover:text-brand-orange font-inter transition-colors">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
                {moreLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} onClick={closeMobileMenu} className="block px-4 py-3 rounded-xl font-manrope font-medium text-charcoal-800 hover:bg-charcoal-50 hover:text-brand-orange transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {simpleLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-xl font-manrope font-medium transition-colors ${link.highlight ? 'text-brand-orange font-semibold bg-brand-orange/5' : 'text-charcoal-800 hover:bg-charcoal-50'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-charcoal-200 space-y-3">
                <Link href="/my-account" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-charcoal-50 font-manrope font-medium text-charcoal-800 hover:bg-charcoal-100 transition-colors">
                  <User className="w-5 h-5" strokeWidth={2} /> My Account
                </Link>
                <Link href="/wishlist" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-charcoal-50 font-manrope font-medium text-charcoal-800 hover:bg-charcoal-100 transition-colors">
                  <Heart className="w-5 h-5" strokeWidth={2} /> Wishlist
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
