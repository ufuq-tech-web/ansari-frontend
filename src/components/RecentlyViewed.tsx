"use client";

import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function RecentlyViewed() {
  return (
    <section id="recently-viewed" className="py-10 sm:py-12 bg-white border-t border-charcoal-200" aria-label="Recently viewed">
      <div className="container-main">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-charcoal-400" strokeWidth={2} />
          <h2 className="font-poppins font-bold text-charcoal-900 text-lg sm:text-xl">Recently Viewed</h2>
        </div>
        <div className="rounded-2xl border border-dashed border-charcoal-200 bg-brand-ivory p-8 text-center">
          <p className="text-charcoal-900 font-inter text-sm">
            No recently viewed products yet. Start browsing to see your history here.
          </p>
          <Link href="/" className="mt-3 inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}
