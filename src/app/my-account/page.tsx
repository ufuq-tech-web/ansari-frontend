"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Camera, Trash2, Heart, ShoppingBag, Package, LogOut, ArrowRight } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useWishlist } from '../../lib/wishlist-context';
import { getOrders } from '../../lib/orders';

interface Profile {
    name: string;
    email: string;
    phone: string;
}

const emptyProfile: Profile = { name: '', email: '', phone: '' };
const PROFILE_KEY = 'ansari_profile';
const PHOTO_KEY = 'ansari_profile_photo';

export default function AccountPage() {
    const { itemCount } = useCart();
    const { items: wishlistItems } = useWishlist();
    const [profile, setProfile] = useState<Profile>(emptyProfile);
    const [photo, setPhoto] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [orderCount, setOrderCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const rawProfile = localStorage.getItem(PROFILE_KEY);
            if (rawProfile) setProfile(JSON.parse(rawProfile));
            const rawPhoto = localStorage.getItem(PHOTO_KEY);
            if (rawPhoto) setPhoto(rawPhoto);
            setOrderCount(getOrders().length);
        } catch {
            // ignore
        }
    }, []);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setPhoto(dataUrl);
            localStorage.setItem(PHOTO_KEY, dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        localStorage.removeItem(PHOTO_KEY);
    };

    const handleSave = () => {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSignOut = () => {
        localStorage.removeItem(PROFILE_KEY);
        localStorage.removeItem(PHOTO_KEY);
        setProfile(emptyProfile);
        setPhoto(null);
    };

    const initial = profile.name.trim().charAt(0).toUpperCase() || 'A';

    return (
        <div className="min-h-screen bg-brand-ivory">
            <div className="container-main py-8 sm:py-12 max-w-4xl">
                <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl sm:text-3xl mb-6">My Account</h1>

                {/* Quick links */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                    <Link href="/wishlist" className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all p-4 sm:p-5 text-center">
                        <Heart className="w-6 h-6 text-brand-orange mx-auto mb-2" strokeWidth={2} />
                        <div className="font-poppins font-bold text-charcoal-900 text-lg">{wishlistItems.length}</div>
                        <div className="text-xs text-charcoal-500 font-inter">Wishlist</div>
                    </Link>
                    <Link href="/cart" className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all p-4 sm:p-5 text-center">
                        <ShoppingBag className="w-6 h-6 text-brand-orange mx-auto mb-2" strokeWidth={2} />
                        <div className="font-poppins font-bold text-charcoal-900 text-lg">{itemCount}</div>
                        <div className="text-xs text-charcoal-500 font-inter">In Cart</div>
                    </Link>
                    <Link href="/orders" className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all p-4 sm:p-5 text-center">
                        <Package className="w-6 h-6 text-brand-orange mx-auto mb-2" strokeWidth={2} />
                        <div className="font-poppins font-bold text-charcoal-900 text-lg">{orderCount}</div>
                        <div className="text-xs text-charcoal-500 font-inter">Orders</div>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-card p-5 sm:p-8">
                    {/* Avatar */}
                    <div className="flex items-center gap-5 pb-6 border-b border-charcoal-200">
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-charcoal-800 flex items-center justify-center overflow-hidden">
                                {photo ? (
                                    <img src={photo} alt="Profile photo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-poppins font-bold text-white text-2xl sm:text-3xl">{initial}</span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-card hover:bg-brand-orange-dark transition-colors"
                                aria-label="Change profile photo"
                            >
                                <Camera className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h2 className="font-poppins font-bold text-charcoal-900 text-lg">{profile.name || 'Your Name'}</h2>
                            <p className="text-sm text-charcoal-500 font-inter">{profile.email || 'Add your email'}</p>
                            {photo && (
                                <button
                                    onClick={handleRemovePhoto}
                                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-red-500 font-inter transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} /> Remove photo
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile fields */}
                    <div className="pt-6 grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="text-sm font-poppins font-semibold text-charcoal-900 block mb-1.5">Full Name</label>
                            <input
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Your name"
                                className="w-full px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-poppins font-semibold text-charcoal-900 block mb-1.5">Email</label>
                            <input
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                placeholder="you@example.com"
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-poppins font-semibold text-charcoal-900 block mb-1.5">Phone</label>
                            <input
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                type="tel"
                                className="w-full px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleSave}
                            className={`btn-primary justify-center sm:w-auto ${saved ? 'bg-brand-green hover:bg-brand-green' : ''}`}
                        >
                            {saved ? 'Saved ✓' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-poppins font-semibold text-sm text-charcoal-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" strokeWidth={2} /> Sign Out
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
                        Back to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
