import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storefrontApi } from '../../../lib/storefront-api';
import { slugify, subcategoryShowcase } from '../../../lib/catalog-helpers';
import CategoryProductSlider from '../../../components/CategoryProductSlider';
import SalePromoStrip from '../../../components/SalePromoStrip';
import Newsletter from '../../../components/Newsletter';
import PageFaq from '../../../components/PageFaq';
import { getPageFaqs } from '../../../lib/seo-faqs';

const genderConfig: Record<string, { label: string; possessive: string; hero: string }> = {
  men: { label: 'Men', possessive: "Men's", hero: '/images/sale.png' },
  women: { label: 'Women', possessive: "Women's", hero: '/images/sale.png' },
  kids: { label: 'Kids', possessive: "Kids'", hero: '/images/sale.png' },
  accessories: { label: 'Accessories', possessive: 'Accessories', hero: '/images/sale.png' },
};

const defaultSaleGenderFaqs = (config: { label: string; possessive: string }) => [
  { question: 'How much can I save on the sale?', answer: 'Discounts vary by product, up to 40% off — every sale item shows both its original and discounted price on the product card.' },
  { question: 'Are sale items eligible for returns or exchange?', answer: 'Yes — sale items follow our standard 7-day return and exchange policy, same as any other order.' },
  { question: `Is the price shown already discounted?`, answer: 'Yes — the price shown on each product card is the final, discounted price you\'ll pay at checkout, no extra codes needed.' },
  { question: `Do new arrivals in ${config.label} ever go on sale?`, answer: `Occasionally — if a new arrival is discounted, you'll find it listed here as well as in New Arrivals.` },
  { question: 'How do I find sale items in a specific category?', answer: 'Use the category rows above — each one shows discounted styles for that category, or shop the full category page and sort by discount.' },
];

export async function generateMetadata({ params }: { params: Promise<{ gender: string }> }): Promise<Metadata> {
  const { gender } = await params;
  const config = genderConfig[gender];
  if (!config) return { title: 'Page Not Found — Ansary Footwear' };
  return {
    title: `${config.possessive} Sale — Ansary Footwear`,
    description: `Big discounts on ${config.label.toLowerCase()} footwear — browse the sale by category.`,
    alternates: { canonical: `/sale/${gender}` },
  };
}

export default async function SaleGenderPage({ params }: { params: Promise<{ gender: string }> }) {
  const { gender } = await params;
  const config = genderConfig[gender];
  if (!config) notFound();

  const faqs = await getPageFaqs(`sale-${gender}`, defaultSaleGenderFaqs(config));
  const productsRes = await storefrontApi.getProducts({ categoryKey: gender, limit: 100 });
  const sections = subcategoryShowcase[gender].map((sub) => {
    const subcategoryProducts = productsRes.items.filter((p) => p.subcategory === sub.name);
    const saleProducts = subcategoryProducts.filter((p) => p.salePrice < p.price);
    // Nothing discounted in this category right now — fall back to real
    // current stock so the page stays browsable instead of a dead end.
    const isFallback = saleProducts.length === 0;
    return {
      name: sub.name,
      href: `/${gender}/${slugify(sub.name)}`,
      products: isFallback ? subcategoryProducts.slice(0, 8) : saleProducts,
      isFallback,
    };
  });
  const hasAnySale = sections.some((s) => !s.isFallback);

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800 aspect-auto min-h-[280px] sm:min-h-[360px] lg:aspect-[21/9] lg:min-h-0" aria-label={`${config.label} sale hero`}>
        <div className="absolute inset-0">
          <Image src={config.hero} alt={`Sale for ${config.label}`} fill priority sizes="100vw" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li><Link href="/sale" className="hover:text-white transition-colors">Sale</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">{config.label}</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">{config.possessive} Sale</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Big discounts on {config.label.toLowerCase()} footwear — browse by category below.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16">
        {!hasAnySale && (
          <p className="text-center text-charcoal-500 font-inter text-sm mb-10">
            Nothing discounted for {config.label.toLowerCase()} right now — but here&apos;s every category to check back on.
          </p>
        )}
        <div className="space-y-12 sm:space-y-16">
          {sections.map((s) => (
            <CategoryProductSlider
              key={s.name}
              title={`${config.possessive} ${s.name} Sale`}
              heading={
                <div key={`heading-${s.name}`} className="mb-6 sm:mb-8">
                  <SalePromoStrip
                    title={`${config.possessive} ${s.name} Sale — Up to 40% Off`}
                    subtitle={`Save on ${s.name.toLowerCase()} this season`}
                    href={s.href}
                  />
                </div>
              }
              products={s.products}
              shopAllHref={s.href}
              isFallback={s.isFallback}
              fallbackNote="Nothing discounted here yet — here's what's popular in this category."
            />
          ))}
        </div>
      </div>

      <PageFaq faqs={faqs} subtitle={`What to know before you shop the ${config.label.toLowerCase()} sale.`} />

      <Newsletter />
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(genderConfig).map((gender) => ({ gender }));
}
