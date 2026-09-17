import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { collections } from '../../lib/catalog-helpers';
import RecentlyViewed from '../../components/RecentlyViewed';
import Newsletter from '../../components/Newsletter';

export const metadata = {
  title: 'Shop by Collection — Ansary Footwear',
  description: 'Handpicked footwear collections for every occasion — office wear, daily comfort, sports, weddings, and school shoes.',
  alternates: { canonical: '/collections' },
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Collections hero">
        <div className="absolute inset-0">
          <img src="/images/collections-banner.png" alt="Collections" loading="eager" className="w-full h-full object-cover object-[center_35%] opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 min-h-[320px] sm:min-h-[400px] lg:min-h-[450px] flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Collections</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-bold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight">Shop by Collection</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Handpicked styles for every occasion — from office mornings to wedding-day celebrations.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16">
        <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Curated For You</span>
          <h2 className="section-heading text-3xl sm:text-4xl tracking-tight text-primary">Explore Our <span className="text-secondary">Collections</span></h2>
          <p className="text-charcoal-500 font-inter text-sm sm:text-base">Whether you're dressing up for a special occasion or looking for daily comfort, find the perfect pair effortlessly.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.name}
              href={col.href}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[4/5]"
            >
              <img
                src={col.image}
                alt={col.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/25 to-transparent" />
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <h2 className="font-poppins font-bold text-white text-xl sm:text-2xl">{col.name}</h2>
                <p className="text-white/80 text-sm font-inter mt-1">{col.description}</p>
                <div className="mt-4 overflow-hidden h-0 group-hover:h-6 transition-all duration-300">
                  <span className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-poppins font-semibold">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <RecentlyViewed />
      <Newsletter />
    </div>
  );
}
