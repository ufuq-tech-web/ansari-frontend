"use client";

import { useState } from 'react';
import { Truck, RefreshCw, Banknote, ChevronDown } from 'lucide-react';

const announcements = [
  { icon: Truck, text: 'Free Shipping on Orders Above ₹999' },
  { icon: RefreshCw, text: '7-Day Easy Returns & Exchanges' },
  { icon: Banknote, text: 'Cash on Delivery Available' },
];

export default function AnnouncementBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-charcoal-800 text-white text-xs sm:text-sm">
        <div className="container-main">
          <div className="flex items-center justify-between h-9 sm:h-10">
            {/* Desktop / mobile first announcement */}
            <div className="flex items-center gap-2 overflow-hidden">
              {announcements.slice(0, 1).map((a, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <a.icon className="w-3.5 h-3.5 text-brand-orange" strokeWidth={2} />
                  <span className="font-inter">{a.text}</span>
                </span>
              ))}
            </div>

            {/* Rotating announcements (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              {announcements.slice(1).map((a, i) => (
                <span key={i} className="flex items-center gap-2">
                  <a.icon className="w-3.5 h-3.5 text-brand-orange" strokeWidth={2} />
                  <span className="font-inter">{a.text}</span>
                </span>
              ))}
            </div>

            {/* Mobile expand toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex items-center gap-1 text-white/80 hover:text-white"
              aria-label="More announcements"
            >
              <span>{open ? 'Less' : 'More'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile expanded announcements */}
      {open && (
        <div className="md:hidden bg-charcoal-700 text-white text-sm border-b border-charcoal-600">
          <div className="container-main py-2 space-y-2">
            {announcements.slice(1).map((a, i) => (
              <span key={i} className="flex items-center gap-2">
                <a.icon className="w-3.5 h-3.5 text-brand-orange" strokeWidth={2} />
                <span className="font-inter">{a.text}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
