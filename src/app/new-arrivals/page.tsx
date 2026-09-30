import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Newsletter from '../../components/Newsletter';
import PageFaq from '../../components/PageFaq';
import { getPageFaqs } from '../../lib/seo-faqs';

export const metadata = {
  title: 'New Arrivals — Ansary Footwear',
  description: 'The latest footwear styles just landed — fresh drops across Men, Women, and Kids.',
  alternates: { canonical: '/new-arrivals' },
};

const defaultNewArrivalsFaqs = [
  { question: 'How often do new arrivals get added?', answer: "We add fresh styles regularly as new stock lands, so it's worth checking back every week or two." },
  { question: 'How do I know a product is a new arrival?', answer: 'Every product here carries a "New" badge, and each category page only shows what has landed recently.' },
  { question: 'Can I browse new arrivals by category?', answer: 'Yes — pick Men, Women, or Kids above, and you\'ll find new arrivals broken down by category like Formal Shoes, Sneakers, and more.' },
  { question: 'Do new arrivals go on sale?', answer: 'Occasionally — check the Sale tab for any new arrivals currently discounted, or sign up below to hear about new drops first.' },
];

const genderCards = [
  { key: 'men', label: 'Men', description: "This season's freshest styles for him", image: '/images/Banner/new-arrival-men.png' },
  { key: 'women', label: 'Women', description: "This season's freshest styles for her", image: '/images/Banner/new-arrival-women.png' },
  { key: 'kids', label: 'Kids', description: 'Fresh drops built for play', image: '/images/Banner/new-arrival-kid.png' },
];

export default async function NewArrivalsPage() {
  const faqs = await getPageFaqs('new-arrivals', defaultNewArrivalsFaqs);
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800 aspect-auto min-h-[320px] sm:min-h-[400px] lg:aspect-[21/9] lg:min-h-0" aria-label="New arrivals hero">
        <div className="absolute inset-0">
          <Image src="/images/hero-banner/hero-new-arrivals.png" alt="New arrivals" fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">New Arrivals</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">New Arrivals</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Fresh drops across Men, Women, and Kids — just landed. Pick a category to dive in.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16">
        <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Just In</span>
          <h2 className="section-heading text-3xl sm:text-4xl tracking-tight text-primary">Shop New Arrivals By <span className="text-secondary">Category</span></h2>
          <p className="text-charcoal-500 font-inter text-sm sm:text-base">Choose who you&apos;re shopping for to see the latest styles, organized by category.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {genderCards.map((g) => (
            <Link
              key={g.key}
              href={`/new-arrivals/${g.key}`}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[3/4] sm:aspect-[4/5]"
            >
              <Image
                src={g.image}
                alt={`New arrivals for ${g.label}`}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
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

      <PageFaq faqs={faqs} subtitle="What to know before you shop new arrivals." />

      <Newsletter />
    </div>
  );
}
