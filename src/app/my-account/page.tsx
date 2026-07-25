"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { getOrders } from '../../lib/orders';
import AccountLayout, { AccountLoading } from '../../components/account/AccountLayout';

export default function AccountPage() {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            getOrders().then((list) => setOrderCount(list.length)).catch(() => setOrderCount(0));
        }
    }, [authLoading, isAuthenticated]);

    if (authLoading || !isAuthenticated || !user) return <AccountLoading />;

    const initial = user.name.trim().charAt(0).toUpperCase() || 'A';

    return (
        <AccountLayout>
            <div className="space-y-12 sm:space-y-16">
                
                {/* Greeting & Avatar */}
                <div className="flex items-center gap-6 pb-8 border-b border-charcoal-100">
                    <div className="relative w-20 h-20 bg-charcoal-50 flex items-center justify-center font-poppins font-light text-3xl text-charcoal-900 border border-charcoal-200 overflow-hidden shrink-0">
                        <span>{initial}</span>
                    </div>
                    <div>
                        <h2 className="font-poppins font-light text-2xl sm:text-3xl text-charcoal-900 tracking-tight">Hello, {user.name}</h2>
                        <p className="text-charcoal-500 font-inter text-sm mt-1">{user.email}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Orders Summary block */}
                    <div className="border border-charcoal-200 p-8 flex flex-col justify-between">
                       <div>
                           <h3 className="font-poppins font-bold text-xs uppercase tracking-widest mb-6 text-charcoal-900">Recent Orders</h3>
                           <div className="font-poppins font-light text-5xl text-charcoal-900 mb-8">{orderCount}</div>
                       </div>
                       <Link href="/orders" className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors w-fit">
                           View All Orders
                       </Link>
                    </div>

                    {/* Profile Details block */}
                    <div className="border border-charcoal-200 p-8">
                       <div className="flex justify-between items-start mb-8">
                           <h3 className="font-poppins font-bold text-xs uppercase tracking-widest text-charcoal-900">Account Details</h3>
                           <button className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors">Edit</button>
                       </div>
                       <div className="space-y-6 text-sm font-inter text-charcoal-900">
                           <div className="grid grid-cols-2 gap-4 border-b border-charcoal-100 pb-4">
                               <div className="text-[10px] font-poppins uppercase tracking-widest text-charcoal-400">Name</div>
                               <div>{user.name}</div>
                           </div>
                           <div className="grid grid-cols-2 gap-4 border-b border-charcoal-100 pb-4">
                               <div className="text-[10px] font-poppins uppercase tracking-widest text-charcoal-400">Email</div>
                               <div>{user.email}</div>
                           </div>
                           <div className="grid grid-cols-2 gap-4 border-b border-charcoal-100 pb-4">
                               <div className="text-[10px] font-poppins uppercase tracking-widest text-charcoal-400">Phone</div>
                               <div>{user.phone || '—'}</div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               <div className="text-[10px] font-poppins uppercase tracking-widest text-charcoal-400">Password</div>
                               <div>••••••••</div>
                           </div>
                       </div>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
}
