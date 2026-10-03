import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface GenderBannerItem {
  title?: string;
  subtitle?: string;
  image?: string;
  linkHref?: string;
  linkLabel?: string;
}

export interface FeaturedCategoriesProps {
  men?: GenderBannerItem;
  women?: GenderBannerItem;
  kids?: GenderBannerItem;
}

export default function FeaturedCategories({ men, women, kids }: FeaturedCategoriesProps = {}) {
  const menData = {
    title: men?.title || 'MENS',
    subtitle: men?.subtitle || 'Casuals',
    image: men?.image || '/images/category/men-catt.png',
    linkHref: men?.linkHref || '/mens-shoes/casual-shoes-for-men',
    linkLabel: men?.linkLabel || 'Shop Now',
  };

  const womenData = {
    title: women?.title || 'WOMENS',
    subtitle: women?.subtitle || 'Heels',
    image: women?.image || '/images/category/women-catt.png',
    linkHref: women?.linkHref || '/women/heels',
    linkLabel: women?.linkLabel || 'Shop Now',
  };

  const kidsData = {
    title: kids?.title || 'KIDS',
    subtitle: kids?.subtitle || 'Collection',
    image: kids?.image || '/images/category/kids-catt.png',
    linkHref: kids?.linkHref || '/kids',
    linkLabel: kids?.linkLabel || 'Shop Now',
  };

  return (
    <section className="w-full flex flex-col">
      <div className="w-full flex flex-col md:flex-row">
      {/* Men's Banner */}
      <Link href={menData.linkHref} className="relative block w-full md:w-1/2 h-[50vh] md:h-[70vh] group overflow-hidden bg-gray-100">
        <Image
          src={menData.image}
          alt={menData.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        {/* Subtle overlay for text readability on bright image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Content */}
        <div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-end items-start">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
            <h3 className="text-white font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-4 leading-none">
              {menData.title} <br/><span className="font-serif font-medium italic text-4xl md:text-5xl lg:text-6xl tracking-normal text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">{menData.subtitle}</span>
            </h3>
            <span className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-6 py-3 rounded-full font-manrope font-semibold hover:bg-brand-orange hover:text-white transition-colors duration-300 shadow-lg mt-2">
              {menData.linkLabel}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>

      {/* Women's Banner */}
      <Link href={womenData.linkHref} className="relative block w-full md:w-1/2 h-[50vh] md:h-[70vh] group overflow-hidden bg-gray-100">
        <Image
          src={womenData.image}
          alt={womenData.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        {/* Subtle overlay for text readability on bright image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Content */}
        <div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-end items-start md:items-end md:text-right">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-2 flex flex-col md:items-end">
            <h3 className="text-white font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-4 leading-none">
              {womenData.title} <br/><span className="font-serif font-medium italic text-4xl md:text-5xl lg:text-6xl tracking-normal text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">{womenData.subtitle}</span>
            </h3>
            <span className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-6 py-3 rounded-full font-manrope font-semibold hover:bg-brand-orange hover:text-white transition-colors duration-300 shadow-lg mt-2">
              {womenData.linkLabel}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
      </div>

      {/* Kids Banner */}
      <Link href={kidsData.linkHref} className="relative block w-full aspect-[1983/793] min-h-[300px] sm:min-h-[360px] md:min-h-0 group overflow-hidden bg-gray-100">
        <Image
          src={kidsData.image}
          alt={kidsData.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Content */}
        <div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-end items-start">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
            <h3 className="text-white font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-4 leading-none">
              {kidsData.title} <br/><span className="font-serif font-medium italic text-4xl md:text-5xl lg:text-6xl tracking-normal text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">{kidsData.subtitle}</span>
            </h3>
            <span className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-6 py-3 rounded-full font-manrope font-semibold hover:bg-brand-orange hover:text-white transition-colors duration-300 shadow-lg mt-2">
              {kidsData.linkLabel}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
