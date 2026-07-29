"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronLeft, Wallet } from 'lucide-react';
import { useAuthStore } from "../../lib/auth-store";

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AccountLayout({ children }: Props) {
  const user = useAuthStore(state => state.user);
    const authLoading = useAuthStore(state => state.loading);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const logout = useAuthStore(state => state.logout);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, isAuthenticated, router, pathname]);

  if (authLoading || !isAuthenticated || !user) return <AccountLoading />;

  const sidebarLinks = [
    { name: 'Account Overview', href: '/my-account', icon: User },
    { name: 'My Orders', href: '/orders', icon: Package },
    { name: 'My Wallet', href: '/my-account/wallet', icon: Wallet },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Addresses', href: '/addresses', icon: MapPin },
    { name: 'Account Settings', href: '/settings', icon: Settings },
  ];

  const isMobileRoot = pathname === '/my-account' || pathname === '/account';

  return (
    <div className={`lg:min-h-screen pb-8 lg:pb-24 border-t border-charcoal-100 ${isMobileRoot ? 'bg-charcoal-50/30 lg:bg-white' : 'bg-white'}`}>
      <div className={`lg:container-main lg:pt-16 max-w-[1400px] ${isMobileRoot ? 'pt-6' : 'container-main pt-6'}`}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-24">
          
          {/* Mobile Root Nav OR Desktop Sidebar */}
          <div className={`lg:w-48 flex-shrink-0 ${!isMobileRoot ? 'hidden lg:block' : 'block'}`}>
            <h1 className="hidden lg:block font-poppins font-extrabold text-2xl text-brand-orange tracking-tight mb-8">MY ACCOUNT</h1>
            
            <div className="lg:hidden mb-6 px-6">
               <h2 className="font-poppins font-bold text-2xl text-charcoal-900">Hello, {user.name}</h2>
            </div>

            <nav className="flex flex-col bg-white lg:bg-transparent shadow-sm lg:shadow-none">
              {sidebarLinks.map((link) => {
                const isActive = link.href !== '#' && pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center gap-4 px-6 py-5 lg:px-0 lg:py-3 border-b border-charcoal-50 lg:border-none transition-colors w-full lg:w-fit ${
                      isActive 
                      ? 'text-brand-orange font-bold font-poppins lg:text-xs uppercase lg:tracking-widest' 
                      : 'text-black font-poppins font-semibold lg:text-xs uppercase lg:tracking-widest hover:text-brand-orange'
                    }`}
                  >
                    <link.icon className="w-6 h-6 lg:hidden" strokeWidth={1.5} />
                    <span className="relative">
                      {link.name}
                      {isActive && (
                        <span className="hidden lg:block absolute -bottom-1 left-0 w-full h-[2px] bg-brand-orange"></span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 min-w-0 ${isMobileRoot ? 'hidden lg:block' : 'block'}`}>
            <div className="lg:hidden mb-6">
              <Link href="/my-account" className="flex items-center gap-1 font-poppins font-bold text-charcoal-900 text-sm hover:text-brand-orange transition-colors">
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} /> My Account
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountLoading() {
  return (
    <div className="min-h-screen bg-white border-t border-charcoal-100 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-charcoal-200 border-t-charcoal-900 rounded-full animate-spin"></div>
    </div>
  );
}
