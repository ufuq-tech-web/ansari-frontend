import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { storefrontApi } from '../../../lib/storefront-api';

export const metadata = {
  title: 'Blog — Ansari Boot House',
  description: 'Footwear buying guides, care tips, and style advice from Ansari Boot House — sizing, materials, and how to choose the right shoe for every occasion.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const allBuyingGuidesList = await storefrontApi.getGuides();

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Blog hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Blog</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">The Ansari Blog</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Buying guides, care tips, and style advice from 25+ years in the footwear business.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {allBuyingGuidesList.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-charcoal-200 hover:border-brand-orange/30 transition-all duration-300 group flex flex-col"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-brand-orange" strokeWidth={2} />
                  </span>
                  <span className="text-xs text-leather-400 font-poppins font-semibold uppercase tracking-wide">{guide.categoryName}</span>
                </div>
                <h2 className="font-poppins font-bold text-charcoal-900 text-lg leading-snug group-hover:text-brand-orange transition-colors">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm text-charcoal-500 font-inter leading-relaxed flex-1">{guide.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-charcoal-400 font-inter">
                    <Clock className="w-3.5 h-3.5" strokeWidth={2} /> {guide.readTime}
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
