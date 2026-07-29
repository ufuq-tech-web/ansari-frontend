import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { storefrontApi, slugify } from '../../lib/storefront-api';
import RecentlyViewed from '../../components/RecentlyViewed';
import Newsletter from '../../components/Newsletter';

export const metadata = {
  title: 'Shop by Brand — Ansary Footwear',
  description: 'Explore footwear from Heritage, UrbanStep, FlexWalk, Grace, TrailMate, LittleSteps, Classic, and ComfortPro.',
};

export default async function BrandsPage() {
  const productsRes = await storefrontApi.getProducts({ limit: 100 });
  const allProductsList = productsRes.items;

  const brandData = Array.from(new Set(allProductsList.map((p) => p.brand))).map((brand) => {
    const products = allProductsList.filter((p) => p.brand === brand);
    return {
      name: brand,
      count: products.length,
      image: products[0]?.image,
    };
  });

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Brands hero">
        <div className="absolute inset-0">
          <img src="/images/brands-banner.png" alt="Brands" loading="eager" className="w-full h-full object-cover object-[center_35%] opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-20 min-h-[320px] sm:min-h-[400px] lg:min-h-[450px] flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Brands</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Shop by Brand</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Trusted brands for every need and budget — from heritage leathercraft to everyday comfort.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-16">
        <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto">
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Our Partners</span>
          <h2 className="section-heading text-3xl sm:text-4xl tracking-tight text-primary">Discover Top <span className="text-secondary">Brands</span></h2>
          <p className="text-charcoal-500 font-inter text-sm sm:text-base">We curate only the highest quality footwear from brands that share our commitment to craftsmanship, comfort, and durability.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {brandData.map((b) => (
            <Link
              key={b.name}
              href={`/brands/${slugify(b.name)}`}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[4/3] bg-charcoal-100"
            >
              <img
                src={b.image}
                alt={`${b.name} footwear`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="font-poppins font-semibold text-white text-xl">{b.name}</h3>
                <p className="text-white/80 text-sm font-inter mt-1">{b.count} products</p>
                <div className="mt-4 overflow-hidden h-0 group-hover:h-6 transition-all duration-300">
                  <span className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-poppins font-semibold">
                    Shop Collection <ArrowRight className="w-4 h-4" />
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
