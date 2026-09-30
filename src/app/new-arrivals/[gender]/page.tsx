import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storefrontApi } from '../../../lib/storefront-api';
import { slugify, subcategoryShowcase } from '../../../lib/catalog-helpers';
import CategoryProductSlider from '../../../components/CategoryProductSlider';
import Newsletter from '../../../components/Newsletter';

const genderConfig: Record<string, { label: string; possessive: string; hero: string }> = {
  men: { label: 'Men', possessive: "Men's", hero: '/images/hero-banner/hero-men.png' },
  women: { label: 'Women', possessive: "Women's", hero: '/images/hero-banner/hero-women.png' },
  kids: { label: 'Kids', possessive: "Kids'", hero: '/images/hero-banner/hero-kids.png' },
};

export async function generateMetadata({ params }: { params: Promise<{ gender: string }> }): Promise<Metadata> {
  const { gender } = await params;
  const config = genderConfig[gender];
  if (!config) return { title: 'Page Not Found — Ansary Footwear' };
  return {
    title: `New Arrivals — ${config.possessive} Shoes — Ansary Footwear`,
    description: `The latest ${config.label.toLowerCase()}'s footwear just landed — browse new arrivals by category.`,
    alternates: { canonical: `/new-arrivals/${gender}` },
  };
}

export default async function NewArrivalsGenderPage({ params }: { params: Promise<{ gender: string }> }) {
  const { gender } = await params;
  const config = genderConfig[gender];
  if (!config) notFound();

  const MIN_CARDS = 5;
  const productsRes = await storefrontApi.getProducts({ categoryKey: gender, limit: 100 });
  const sections = subcategoryShowcase[gender].map((sub) => {
    const newProducts = productsRes.items.filter((p) => p.subcategory === sub.name && p.isNew);
    // No new-flagged stock in this category yet — fall back to real current
    // stock so the page stays browsable instead of showing a dead end.
    const isFallback = newProducts.length === 0;
    let products = isFallback
      ? productsRes.items.filter((p) => p.subcategory === sub.name).slice(0, 8)
      : newProducts;
    // Still too sparse for a full row — top up with more real stock from the
    // rest of this gender's catalog rather than leaving a half-empty section.
    let isTopped = false;
    if (products.length < MIN_CARDS) {
      const usedIds = new Set(products.map((p) => p.id));
      const extra = productsRes.items.filter((p) => !usedIds.has(p.id));
      products = [...products, ...extra.slice(0, MIN_CARDS - products.length)];
      isTopped = extra.length > 0;
    }
    return {
      name: sub.name,
      href: `/${gender}/${slugify(sub.name)}`,
      products,
      isFallback: isFallback || isTopped,
    };
  });
  const hasAnyNewArrivals = sections.some((s) => !s.isFallback);

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800 aspect-auto min-h-[280px] sm:min-h-[360px] lg:aspect-[21/9] lg:min-h-0" aria-label={`New arrivals ${config.label} hero`}>
        <div className="absolute inset-0">
          <Image src={config.hero} alt={`New arrivals for ${config.label}`} fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">{config.label}</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">New Arrivals — {config.possessive} Shoes</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            The latest {config.label.toLowerCase()}&apos;s styles, fresh in — browse by category below.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16">
        {!hasAnyNewArrivals && (
          <p className="text-center text-charcoal-500 font-inter text-sm mb-10">
            Nothing&apos;s freshly landed for {config.label.toLowerCase()} right now — but here&apos;s every category to check back on.
          </p>
        )}
        <div className="space-y-12 sm:space-y-16">
          {sections.map((s) => (
            <CategoryProductSlider
              key={s.name}
              eyebrow="Just Landed"
              title={`Explore New Arrival ${config.possessive} ${s.name}`}
              highlight="New Arrival"
              products={s.products}
              shopAllHref={s.href}
              isFallback={s.isFallback}
              fallbackNote="Nothing new here yet — here's what's popular in this category."
            />
          ))}
        </div>
      </div>

      <Newsletter />
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(genderConfig).map((gender) => ({ gender }));
}
