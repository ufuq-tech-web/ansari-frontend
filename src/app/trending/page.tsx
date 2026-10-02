import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { slugify, subcategoryShowcase } from '../../lib/catalog-helpers';
import Newsletter from '../../components/Newsletter';
import PageFaq from '../../components/PageFaq';
import { getPageFaqs } from '../../lib/seo-faqs';

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/trending`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const title = seoTitle || "Trending Shoes | Stylish & Latest Shoes for Men, Women & Kids";
  const description =
    seoDesc ||
    "Shop trending shoes for men, women, girls and boys in stylish, latest designs. Browse new shoe trends and trending footwear for every occasion.";
  const canonicalUrl = "https://www.ansarifootwear.com/shoes-collection/trending-shoes/";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  };
}

const defaultTrendingFaqs = [
  { question: "What makes a product 'trending'?", answer: "Trending picks are our highest-rated styles right now — footwear that's earning consistently strong reviews from customers across Men, Women, and Kids." },
  { question: 'Is trending different from best sellers?', answer: "Yes — best sellers reflect total order volume over time, while trending reflects what's rated highest right now, so the two lists can differ." },
  { question: 'How often does the trending list change?', answer: "We refresh it regularly as new ratings come in, so it stays current with what customers are loving this week." },
  { question: 'Can I browse trending by category?', answer: 'Yes — use the Men, Women, and Kids sections above, or jump straight into any category page to filter further.' },
];

const genderSections: { key: 'men' | 'women' | 'kids'; label: string }[] = [
  { key: 'men', label: "Men's" },
  { key: 'women', label: "Women's" },
  { key: 'kids', label: "Kids'" },
];

export default async function TrendingPage() {
  const faqs = await getPageFaqs('trending', defaultTrendingFaqs);
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800 aspect-auto min-h-[320px] sm:min-h-[400px] lg:aspect-[21/9] lg:min-h-0" aria-label="Trending shoes hero">
        <div className="absolute inset-0">
          <Image src="/images/hero-banner/hero-trending.png" alt="Trending shoes" fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Trending Shoes</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">Trending Shoes</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Shop trending shoes for men, women, girls and boys in stylish, latest designs. Browse new shoe trends and trending footwear for every occasion.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16 space-y-16 sm:space-y-20">
        {genderSections.map(({ key, label }) => (
          <div key={key}>
            <div className="flex flex-col items-center text-center gap-4 mb-8 sm:mb-10 max-w-3xl mx-auto px-2">
              <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Trending Now</span>
              <h2 className="section-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-primary sm:whitespace-nowrap">
                Explore Our <span className="text-secondary">{label} Trending Collection</span>
              </h2>
              <p className="text-charcoal-500 font-inter text-sm sm:text-base">
                {label} favorites, aligned by category — find your next pair without the scroll.
              </p>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {subcategoryShowcase[key].map((sub) => (
                <Link
                  key={sub.name}
                  href={`/${key}/${slugify(sub.name)}?sort=rating`}
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

      <PageFaq faqs={faqs} subtitle="What to know before you shop what's trending." />

      <Newsletter />
    </div>
  );
}
