"use client";


import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { productHref as buildProductHref, type Product as CatalogProduct } from '../lib/catalog-helpers';
import type { Product as LibProduct } from '../lib/products';
import { useWishlistStore } from '../lib/wishlist-store';

interface Props {
  product: CatalogProduct | LibProduct;
  onWishlist?: (id: string) => void;
}

const imgHelper = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`;

function getProductImages(product: LibProduct) {
  const slug = product.slug;
  switch (slug) {
    case 'trail-blazer-boot':
      return { primary: imgHelper('1537492'), secondary: imgHelper('1537492') };
    case 'oxford-classic':
      return { primary: imgHelper('298863'), secondary: imgHelper('298863') };
    case 'kids-school-shoe':
      return { primary: imgHelper('10397766'), secondary: imgHelper('10397766') };
    case 'everyday-sandal':
      return { primary: imgHelper('336372'), secondary: imgHelper('336372') };
    case 'heritage-loafer':
      return { primary: imgHelper('298863'), secondary: imgHelper('298863') };
    case 'monsoon-gumboot':
      return { primary: imgHelper('1537492'), secondary: imgHelper('1537492') };
    default:
      return { primary: imgHelper('298863'), secondary: imgHelper('298863') };
  }
}

export default function ProductCard({ product, onWishlist }: Props) {
  const isCatalogProduct = 'salePrice' in product;
  const { toggle, isWishlisted } = useWishlistStore();
  const catalogProduct = isCatalogProduct ? (product as CatalogProduct) : null;
  const wishlisted = catalogProduct ? isWishlisted(catalogProduct.id) : false;
  const productId = 'id' in product ? product.id : (product as LibProduct).slug;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (catalogProduct) toggle(catalogProduct);
    onWishlist?.(productId);
  };

  const sellingPrice = (isCatalogProduct 
    ? (product as CatalogProduct).salePrice 
    : (product as LibProduct).price) || 0;
    
  const originalPrice = isCatalogProduct 
    ? (product as CatalogProduct).price 
    : (product as LibProduct).originalPrice;

  const discount = originalPrice && originalPrice > sellingPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  const images = 'image' in product && product.image
    ? { primary: product.image, secondary: product.hoverImage || product.image }
    : getProductImages(product as LibProduct);

  const brandName = 'brand' in product && product.brand ? product.brand : 'Ansari';

  const productHref = catalogProduct ? buildProductHref(catalogProduct) : undefined;

  return (
    <article className="product-card group bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col border border-charcoal-100 shadow-card hover:shadow-card-hover hover:border-charcoal-200">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-100 group-hover:bg-charcoal-200 transition-colors duration-500">
        {/* Subtle overlay for better text/button contrast on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
        {productHref ? (
          <Link href={productHref} className="absolute inset-0 block">
            <Image
              src={images.primary}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="product-img-primary object-cover transition-opacity duration-300"
            />
            <Image
              src={images.secondary}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="product-img-secondary object-cover"
            />
          </Link>
        ) : (
          <>
            <Image
              src={images.primary}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="product-img-primary object-cover transition-opacity duration-300"
            />
            <Image
              src={images.secondary}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="product-img-secondary object-cover"
            />
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {discount > 0 && (
            <span className="bg-accent text-white text-[10px] font-manrope font-bold px-2.5 py-1 rounded-md shadow-sm">
              -{discount}%
            </span>
          )}
          {product.badge && (
            <span className="bg-primary text-white text-[10px] font-manrope font-bold px-2.5 py-1 rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Rating badge — overlaid on the image */}
        {product.rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-white text-[11px] font-manrope font-bold px-2 py-1 rounded-md shadow-sm z-20">
            <Star className="w-3 h-3 fill-brand-orange text-brand-orange" strokeWidth={2} />
            {product.rating.toFixed(1)}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur flex items-center justify-center shadow-sm transition-all active:scale-90 z-20 ${wishlisted ? 'bg-brand-orange text-white' : 'bg-white/90 text-charcoal-700 hover:text-brand-orange hover:bg-white'
            }`}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
        >
          <Heart className="w-4 h-4" strokeWidth={2} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

      </div>

      {/* Details */}
      {productHref ? (
        <Link href={productHref} className="p-3 sm:p-4 flex flex-col flex-1">
          <span className="text-xs text-secondary font-manrope font-bold uppercase tracking-wider">{brandName}</span>
          <h3 className="mt-1 font-sora font-bold text-primary text-sm sm:text-[15px] leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2 flex-1">
            <span className="font-manrope font-bold text-primary text-base">₹{sellingPrice.toLocaleString('en-IN')}</span>
            {originalPrice && originalPrice > sellingPrice && (
              <span className="text-xs text-primary/60 line-through font-manrope font-bold">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </Link>
      ) : (
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <span className="text-xs text-secondary font-manrope font-bold uppercase tracking-wider">{brandName}</span>
          <h3 className="mt-1 font-sora font-bold text-primary text-sm sm:text-[15px] leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2 flex-1">
            <span className="font-manrope font-bold text-primary text-base">₹{sellingPrice.toLocaleString('en-IN')}</span>
            {originalPrice && originalPrice > sellingPrice && (
              <span className="text-xs text-primary/60 line-through font-manrope font-bold">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
