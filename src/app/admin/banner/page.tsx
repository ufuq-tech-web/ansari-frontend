"use client";

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/admin-api';
import toast from 'react-hot-toast';
import { Save, Image as ImageIcon, Calendar } from 'lucide-react';

interface PromoBanner {
  title: string;
  titleHighlight: string;
  description: string;
  discountPercent: number;
  couponCode: string;
  endDate: string;
  image: string;
  linkUrl: string;
  isActive: boolean;
}

export default function PromoBannerSettings() {
  const [banner, setBanner] = useState<PromoBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await adminApi.get<PromoBanner>('/banner');
        if (data) setBanner(data);
      } catch (err) {
        toast.error('Failed to load banner settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanner();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? Number(value) : value);
    setBanner(prev => prev ? { ...prev, [name]: val } : null);
  };

  const handleSave = async () => {
    if (!banner) return;
    setIsSaving(true);
    try {
      // Ensure exact ISO string format handling if required, or simply passing standard HTML datetime-local works
      const payload = {
        ...banner,
        endDate: new Date(banner.endDate).toISOString()
      };
      await adminApi.put('/banner', payload);
      toast.success('Promo banner updated successfully');
    } catch (err) {
      toast.error('Failed to update banner');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-charcoal-400">Loading settings...</div>;
  }

  if (!banner) {
    return <div className="p-8 text-center text-charcoal-400">Settings not found</div>;
  }

  // Format date for datetime-local input safely
  const formattedDate = banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-charcoal-900">Promotion Banner</h1>
          <p className="text-charcoal-500 font-inter text-sm mt-1">Configure the main promotional banner shown on the home page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-orange text-white rounded-xl font-poppins font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Settings
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
          
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-charcoal-50 rounded-xl">
            <div>
              <h3 className="font-poppins font-semibold text-charcoal-900">Banner Status</h3>
              <p className="text-sm text-charcoal-500 font-inter">Toggle visibility of the banner on the home page</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={banner.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-14 h-7 bg-charcoal-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
            </label>
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Title</label>
              <input 
                type="text" name="title" value={banner.title} onChange={handleChange}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter text-sm md:text-base" 
              />
            </div>
            <div className="space-y-2">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Title Highlight (Accent color)</label>
              <input 
                type="text" name="titleHighlight" value={banner.titleHighlight} onChange={handleChange}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter text-sm md:text-base" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Description</label>
              <textarea 
                name="description" value={banner.description} onChange={handleChange} rows={2}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter text-sm md:text-base" 
              />
            </div>

            <div className="space-y-2">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Discount Percentage</label>
              <div className="relative">
                <input 
                  type="number" name="discountPercent" value={banner.discountPercent} onChange={handleChange} min={0} max={100}
                  className="w-full pl-3 md:pl-4 pr-10 md:pr-12 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter text-right text-sm md:text-base" 
                />
                <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-charcoal-400 font-bold text-sm md:text-base">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Coupon Code (Leave empty if none)</label>
              <input 
                type="text" name="couponCode" value={banner.couponCode} onChange={handleChange}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter uppercase text-sm md:text-base" 
              />
            </div>

            <div className="space-y-2">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Countdown End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 md:w-5 md:h-5 text-charcoal-400" />
                <input 
                  type="datetime-local" name="endDate" value={formattedDate} onChange={handleChange}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter text-sm md:text-base" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Button Link</label>
              <input 
                type="text" name="linkUrl" value={banner.linkUrl} onChange={handleChange}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter text-sm md:text-base" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2 border-t border-charcoal-100 pt-6">
              <label className="font-poppins font-medium text-sm text-charcoal-700">Background Image URL</label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <ImageIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 md:w-5 md:h-5 text-charcoal-400" />
                  <input 
                    type="text" name="image" value={banner.image} onChange={handleChange}
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none font-inter text-sm md:text-base" 
                    placeholder="e.g., /images/promo/monsoon-banner.png or https://..."
                  />
                </div>
              </div>
              {banner.image && (
                <div className="mt-4 rounded-xl overflow-hidden border border-charcoal-200 h-32 sm:h-40 md:h-48 bg-charcoal-900 relative">
                  <img src={banner.image} alt="Preview" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-charcoal-900/60 text-white px-4 py-1.5 rounded-full text-xs font-poppins font-medium backdrop-blur-sm">Image Preview</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
