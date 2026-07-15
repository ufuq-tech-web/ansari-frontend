import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { storefrontApi, slugify } from '../../lib/storefront-api';

export const metadata = {
  title: 'Shop by Brand — Ansari Boot House',
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
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
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

      <div className="container-main py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {brandData.map((b) => (
            <Link
              key={b.name}
              href={`/brands/${slugify(b.name)}`}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 aspect-[4/3]"
            >
              <img
                src={b.image}
                alt={`${b.name} footwear`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/20 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="font-poppins font-semibold text-white text-lg sm:text-xl">{b.name}</h3>
                <p className="text-white/75 text-xs font-inter mt-0.5">{b.count} products</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-white text-xs font-poppins font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
