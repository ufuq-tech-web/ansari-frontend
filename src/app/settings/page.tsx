"use client";

import { useAuthStore } from "../../lib/auth-store";
import AccountLayout, { AccountLoading } from '../../components/account/AccountLayout';

export default function SettingsPage() {
    const user = useAuthStore(state => state.user);
    const authLoading = useAuthStore(state => state.loading);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if (authLoading || !isAuthenticated || !user) return <AccountLoading />;

    return (
        <AccountLayout>
            <div className="mb-10">
                <h2 className="font-poppins font-light text-2xl sm:text-3xl text-charcoal-900 tracking-tight">Account Details</h2>
                <p className="text-charcoal-500 font-inter text-sm mt-1">Manage your personal information and security settings.</p>
            </div>

            <div className="border border-charcoal-200 p-8 sm:p-12">
                <form className="max-w-xl space-y-8" onSubmit={(e) => { e.preventDefault(); alert('Profile update coming soon!'); }}>
                    <div>
                        <label className="block text-[10px] font-poppins uppercase tracking-widest text-charcoal-400 mb-2">Full Name</label>
                        <input type="text" defaultValue={user.name} className="w-full border-b border-charcoal-200 py-2 font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange transition-colors" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-poppins uppercase tracking-widest text-charcoal-400 mb-2">Email Address</label>
                        <input type="email" defaultValue={user.email} className="w-full border-b border-charcoal-200 py-2 font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange transition-colors" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-poppins uppercase tracking-widest text-charcoal-400 mb-2">Phone Number</label>
                        <input type="tel" defaultValue={user.phone || ''} placeholder="Add your phone number" className="w-full border-b border-charcoal-200 py-2 font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange transition-colors" />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="text-xs font-poppins uppercase tracking-widest text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </AccountLayout>
    );
}
