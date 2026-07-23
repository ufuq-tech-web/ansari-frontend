"use client";

import { Truck, RefreshCw, Banknote } from 'lucide-react';

const announcements = [
  { icon: Truck, text: 'Free Shipping on Orders Above ₹999' },
  { icon: RefreshCw, text: '7-Day Easy Returns & Exchanges' },
  { icon: Banknote, text: 'Cash on Delivery Available' },
  { icon: Truck, text: 'Free Shipping on Orders Above ₹999' },
  { icon: RefreshCw, text: '7-Day Easy Returns & Exchanges' },
  { icon: Banknote, text: 'Cash on Delivery Available' },
];

export default function AnnouncementBar() {
  // Duplicate array to ensure seamless infinite scrolling
  const scrollItems = [...announcements, ...announcements, ...announcements];

  return (
    <div className="bg-charcoal-800 text-white text-xs sm:text-sm overflow-hidden relative border-b border-white/10">
      <div className="h-9 sm:h-10 flex items-center">
        <div className="flex whitespace-nowrap animate-[scrollLeft_30s_linear_infinite] hover:[animation-play-state:paused]">
          {scrollItems.map((a, i) => (
            <span key={i} className="flex items-center gap-2 px-6 sm:px-12">
              <a.icon className="w-3.5 h-3.5 text-brand-orange" strokeWidth={2} />
              <span className="font-poppins font-semibold tracking-wide uppercase">{a.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
