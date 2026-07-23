"use client";

import { useAuth } from '../../lib/auth-context';
import AccountLayout, { AccountLoading } from '../../components/account/AccountLayout';

export default function AddressesPage() {
    const { user, loading: authLoading, isAuthenticated } = useAuth();

    if (authLoading || !isAuthenticated || !user) return <AccountLoading />;

    return (
        <AccountLayout>
            <div className="mb-10">
                <h2 className="font-poppins font-light text-2xl sm:text-3xl text-charcoal-900 tracking-tight">Saved Addresses</h2>
                <p className="text-charcoal-500 font-inter text-sm mt-1">Manage your shipping and billing addresses here.</p>
            </div>

            <div className="border border-charcoal-200 p-8 sm:p-16 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-charcoal-300 mb-6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <h3 className="font-poppins font-light text-xl text-charcoal-900 mb-2">No addresses saved</h3>
                <p className="text-charcoal-500 font-inter text-sm max-w-sm mb-8">You haven't saved any addresses yet. Add one now to make checkout faster.</p>
                <button 
                    onClick={() => alert('Add Address feature coming soon!')}
                    className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors"
                >
                    Add New Address
                </button>
            </div>
        </AccountLayout>
    );
}
