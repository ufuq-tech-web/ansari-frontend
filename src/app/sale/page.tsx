import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Newsletter from '../../components/Newsletter';
import PageFaq from '../../components/PageFaq';
import { getPageFaqs } from '../../lib/seo-faqs';

export const metadata = {
  title: 'Sale — Ansary Footwear',
  description: 'Big discounts across Men, Women, Kids, and Accessories footwear — shop the sale by category.',
  alternates: { canonical: '/sale' },
};

const defaultSaleFaqs = [
  { question: 'How much can I save during the sale?', answer: 'Discounts vary by product, up to 40% off — every sale item shows both its original and discounted price on the product card.' },
  { question: 'Are sale items final sale, or can I return them?', answer: 'Sale items follow our standard 7-day return and exchange policy, same as any other order.' },
  { question: 'Can I browse the sale by category?', answer: 'Yes — pick Men, Women, Kids, or Accessories above, and you\'ll find discounted styles broken down by category.' },
  { question: 'Do new arrivals ever go on sale?', answer: "Occasionally — if a new arrival is discounted, you'll find it listed here as well as in New Arrivals." },
];

const categoryCards = [
  { key: 'men', label: 'Men', description: 'Formal to casual, discounted', image: '/images/Banner/new-arrival-men.png' },
  { key: 'women', label: 'Women', description: 'Heels to flats, styled for less', image: '/images/Banner/new-arrival-women.png' },
  { key: 'kids', label: 'Kids', description: 'Family-friendly prices', image: '/images/Banner/new-arrival-kid.png' },
];

export default async function SalePage() {
  const faqs = await getPageFaqs('sale', defaultSaleFaqs);
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800 aspect-auto min-h-[320px] sm:min-h-[400px] lg:aspect-[21/9] lg:min-h-0" aria-label="Sale hero">
        <div className="absolute inset-0">
          <Image src="/images/sale.png" alt="Sale" fill priority sizes="100vw" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/HomePage" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Sale</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">Sale</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Up to 40% off across Men, Women, Kids, and Accessories — pick a category to dive in.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16">
        <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Limited Offer</span>
          <h2 className="section-heading text-3xl sm:text-4xl tracking-tight text-primary">Shop The Sale By <span className="text-secondary">Category</span></h2>
          <p className="text-charcoal-500 font-inter text-sm sm:text-base">Choose who you&apos;re shopping for to see discounted styles, organized by category.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {categoryCards.map((g) => (
            <Link
              key={g.key}
              href={`/sale/${g.key}`}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[3/4] sm:aspect-[4/5]"
            >
              <Image
                src={g.image}
                alt={`Sale for ${g.label}`}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/25 to-transparent" />
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                <h3 className="font-poppins font-bold text-white text-xl sm:text-2xl">{g.label}</h3>
                <p className="text-white/80 text-sm font-inter mt-1">{g.description}</p>
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

      <PageFaq faqs={faqs} subtitle="What to know before you shop the sale." />

      <Newsletter />
    </div>
  );
}
