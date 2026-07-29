import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { storefrontApi } from '../../lib/storefront-api';

export const metadata = {
  title: 'Buying Guides — Ansary Footwear',
  description: 'Expert footwear buying guides for men, women, and kids — sizing, materials, care tips, and how to choose the right shoe for every occasion.',
  alternates: { canonical: '/guides' },
};

export default async function GuidesPage() {
  const allBuyingGuidesList = await storefrontApi.getGuides();
  const categories = Array.from(new Set(allBuyingGuidesList.map((g) => g.categoryKey)));

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Buying guides hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Buying Guides</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Buying Guides</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Expert advice on sizing, materials, and care — so you can shop with confidence every time.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12 space-y-12">
        {categories.map((catKey) => {
          const guides = allBuyingGuidesList.filter((g) => g.categoryKey === catKey);
          return (
            <div key={catKey}>
              <h2 className="section-heading text-xl sm:text-2xl mb-5">{guides[0]?.categoryName}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-charcoal-200 hover:border-brand-orange/30 transition-all duration-300 group flex flex-col items-center gap-3 text-center"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0 mx-auto">
                      <BookOpen className="w-5 h-5 text-brand-orange" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-poppins font-semibold text-charcoal-900 text-sm leading-snug group-hover:text-brand-orange transition-colors">
                        {guide.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-charcoal-500 font-inter leading-relaxed">{guide.description}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-charcoal-400 font-inter">
                        <Clock className="w-3.5 h-3.5" strokeWidth={2} /> {guide.readTime}
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
