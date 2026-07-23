"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AccountLayout({ children }: Props) {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, isAuthenticated, router, pathname]);

  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || !isAuthenticated || !user) return <AccountLoading />;

  const sidebarLinks = [
    { name: 'Dashboard', href: '/my-account' },
    { name: 'Orders', href: '/orders' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Addresses', href: '/addresses' },
    { name: 'Account Details', href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 border-t border-charcoal-100">
      <div className="container-main pt-10 lg:pt-16 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Ultra-Minimal Sidebar */}
          <div className="lg:w-48 flex-shrink-0">
            <h1 className="font-poppins font-extrabold text-2xl text-brand-orange tracking-tight mb-8">MY ACCOUNT</h1>
            <nav className="flex flex-col gap-6">
              {sidebarLinks.map((link) => {
                const isActive = link.href !== '#' && pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`font-poppins text-xs uppercase tracking-widest transition-colors relative w-fit ${
                      isActive 
                      ? 'text-brand-orange font-bold' 
                      : 'text-charcoal-500 hover:text-brand-orange'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-brand-orange"></span>
                    )}
                  </Link>
                );
              })}
              
              <button
                onClick={handleSignOut}
                className="text-left font-poppins text-xs uppercase tracking-widest text-charcoal-400 hover:text-red-600 transition-colors mt-8 w-fit"
              >
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
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
