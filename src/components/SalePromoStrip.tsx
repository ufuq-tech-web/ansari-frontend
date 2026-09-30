import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  href?: string;
  ctaLabel?: string;
}

export default function SalePromoStrip({ title, subtitle, href = '/sale', ctaLabel = 'Shop Sale' }: Props) {
  return (
    <div className="rounded-2xl bg-charcoal-900 p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 min-w-0">
        <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Tag className="w-5 h-5 text-white" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-white/60 font-manrope font-semibold text-xs uppercase tracking-wide">Limited Offer</p>
          <h2 className="text-white font-poppins font-bold text-lg sm:text-xl truncate">{title}</h2>
          <p className="text-white/60 font-inter text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      <Link
        href={href}
        className="flex-shrink-0 inline-flex items-center gap-1.5 bg-brand-orange text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-brand-orange-dark transition-colors"
      >
        {ctaLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
