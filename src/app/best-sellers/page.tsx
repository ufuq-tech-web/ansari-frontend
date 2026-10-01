import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { slugify, subcategoryShowcase } from '../../lib/catalog-helpers';
import Newsletter from '../../components/Newsletter';
import PageFaq from '../../components/PageFaq';
import { getPageFaqs } from '../../lib/seo-faqs';

export const metadata = {
  title: 'Best Sellers — Ansary Footwear',
  description: 'Our most-loved footwear styles across Men, Women, and Kids — top-rated by thousands of customers, aligned by category.',
  alternates: { canonical: '/best-sellers' },
};

const defaultBestSellerFaqs = [
  { question: 'How do you decide what counts as a best seller?', answer: 'We track order volume and customer reviews across the catalog — the styles families keep buying and rating highly earn the Bestseller badge.' },
  { question: 'Are best sellers restocked quickly?', answer: "Yes, we prioritize restocking popular sizes and styles first, since they're the ones most likely to sell out." },
  { question: 'Do best sellers cost more than regular listings?', answer: "No, best sellers aren't priced any differently — you'll find the same price here as on the item's own category page." },
  { question: 'How often is this list updated?', answer: 'We refresh it regularly as new sales and review data comes in, so it reflects what customers are actually loving right now.' },
];

const genderSections: { key: 'men' | 'women' | 'kids'; label: string }[] = [
  { key: 'men', label: "Men's" },
  { key: 'women', label: "Women's" },
  { key: 'kids', label: "Kids'" },
];

export default async function BestSellersPage() {
  const faqs = await getPageFaqs('best-sellers', defaultBestSellerFaqs);

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800 aspect-auto min-h-[320px] sm:min-h-[400px] lg:aspect-[21/9] lg:min-h-0" aria-label="Best sellers hero">
        <div className="absolute inset-0">
          <Image src="/images/hero-banner/hero-best-sellers.png" alt="Best sellers" fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Best Sellers</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">Best Sellers</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Top-rated styles loved by thousands of customers — best sellers for Men, Women, and Kids, aligned by category.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16 space-y-16 sm:space-y-20">
        {genderSections.map(({ key, label }) => (
          <div key={key}>
            <div className="flex flex-col items-center text-center gap-4 mb-8 sm:mb-10 max-w-3xl mx-auto px-2">
              <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Customer Favorites</span>
              <h2 className="section-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-primary sm:whitespace-nowrap">
                Explore Our <span className="text-secondary">{label} Best Seller Collection</span>
              </h2>
              <p className="text-charcoal-500 font-inter text-sm sm:text-base">
                {label} favorites, aligned by category — find your next pair without the scroll.
              </p>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {subcategoryShowcase[key].map((sub) => (
                <Link
                  key={sub.name}
                  href={`/${key}/${slugify(sub.name)}?sort=best_selling`}
                  className="group relative flex-shrink-0 w-[240px] sm:w-[260px] lg:w-[280px] snap-start rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[4/5]"
                >
                  <Image
                    src={sub.image}
                    alt={`${sub.name} for ${label}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/25 to-transparent" />
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                    <h3 className="font-poppins font-bold text-white text-lg sm:text-xl">{sub.name}</h3>
                    <div className="mt-3 overflow-hidden h-0 group-hover:h-6 transition-all duration-300">
                      <span className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-poppins font-semibold">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <PageFaq faqs={faqs} subtitle="What to know before you shop our best sellers." />

      <Newsletter />
    </div>
  );
}
