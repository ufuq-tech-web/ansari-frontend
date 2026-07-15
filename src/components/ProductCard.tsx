"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, Plus, Check } from 'lucide-react';
import { productHref as buildProductHref, type Product as CatalogProduct } from '../lib/catalog-helpers';
import type { Product as LibProduct } from '../lib/products';
import { useCart } from '../lib/cart-context';
import { useWishlist } from '../lib/wishlist-context';

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
      return { primary: imgHelper('2421374'), secondary: imgHelper('2421374') };
    case 'monsoon-gumboot':
      return { primary: imgHelper('1537492'), secondary: imgHelper('1537492') };
    default:
      return { primary: imgHelper('298863'), secondary: imgHelper('298863') };
  }
}

export default function ProductCard({ product, onWishlist }: Props) {
  const isCatalogProduct = 'salePrice' in product;
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const catalogProduct = isCatalogProduct ? (product as CatalogProduct) : null;
  const wishlisted = catalogProduct ? isWishlisted(catalogProduct.id) : false;
  const productId = 'id' in product ? product.id : (product as LibProduct).slug;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (catalogProduct) toggle(catalogProduct);
    onWishlist?.(productId);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!catalogProduct) return;
    addItem(catalogProduct, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
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
  
  const reviewsCount = 'reviews' in product && product.reviews !== undefined
    ? product.reviews
    : ('reviewCount' in product ? (product as LibProduct).reviewCount : 0);

  const productHref = catalogProduct ? buildProductHref(catalogProduct) : undefined;

  return (
    <article className="product-card group bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-charcoal-100">
        {productHref ? (
          <Link href={productHref} className="absolute inset-0 block">
            <img
              src={images.primary}
              alt={product.name}
              loading="lazy"
              className="product-img-primary absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            />
            <img
              src={images.secondary}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="product-img-secondary absolute inset-0 w-full h-full object-cover"
            />
          </Link>
        ) : (
          <>
            <img
              src={images.primary}
              alt={product.name}
              loading="lazy"
              className="product-img-primary absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            />
            <img
              src={images.secondary}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="product-img-secondary absolute inset-0 w-full h-full object-cover"
            />
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-charcoal-800 text-white text-[10px] font-poppins font-semibold px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-brand-orange text-white text-[10px] font-poppins font-semibold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur flex items-center justify-center shadow-sm transition-all active:scale-90 ${wishlisted ? 'bg-brand-orange text-white' : 'bg-white/90 text-charcoal-700 hover:text-brand-orange hover:bg-white'
            }`}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
        >
          <Heart className="w-4 h-4" strokeWidth={2} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={!catalogProduct}
            className={`w-full backdrop-blur font-poppins font-semibold text-sm py-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${justAdded ? 'bg-brand-green text-white' : 'bg-charcoal-900/95 text-white hover:bg-charcoal-800'
              }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2} /> Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2} /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details */}
      {productHref ? (
        <Link href={productHref} className="p-3 sm:p-4 flex flex-col flex-1">
          <span className="text-xs text-charcoal-900 font-inter uppercase tracking-wide">{brandName}</span>
          <h3 className="mt-1 font-poppins font-bold text-charcoal-900 text-sm sm:text-[15px] leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'text-brand-orange fill-brand-orange' : 'text-charcoal-200'}`}
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-xs text-charcoal-900 font-inter">({reviewsCount})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2 flex-1">
            <span className="font-manrope font-bold text-charcoal-900 text-base">₹{sellingPrice.toLocaleString('en-IN')}</span>
            {originalPrice && originalPrice > sellingPrice && (
              <span className="text-xs text-charcoal-900 line-through font-manrope">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </Link>
      ) : (
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <span className="text-xs text-charcoal-900 font-inter uppercase tracking-wide">{brandName}</span>
          <h3 className="mt-1 font-poppins font-bold text-charcoal-900 text-sm sm:text-[15px] leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'text-brand-orange fill-brand-orange' : 'text-charcoal-200'}`}
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-xs text-charcoal-900 font-inter">({reviewsCount})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2 flex-1">
            <span className="font-manrope font-bold text-charcoal-900 text-base">₹{sellingPrice.toLocaleString('en-IN')}</span>
            {originalPrice && originalPrice > sellingPrice && (
              <span className="text-xs text-charcoal-900 line-through font-manrope">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
