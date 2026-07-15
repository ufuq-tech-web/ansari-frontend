import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { collections } from '../../lib/catalog-helpers';

export const metadata = {
  title: 'Shop by Collection — Ansari Boot House',
  description: 'Handpicked footwear collections for every occasion — office wear, daily comfort, sports, weddings, and school shoes.',
  alternates: { canonical: '/collections' },
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Collections hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Collections</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Shop by Collection</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Handpicked styles for every occasion — from office mornings to wedding-day celebrations.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
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
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                <h2 className="font-poppins font-bold text-white text-lg sm:text-xl">{col.name}</h2>
                <p className="text-white/75 text-xs sm:text-sm font-inter mt-0.5">{col.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-white text-sm font-poppins font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
