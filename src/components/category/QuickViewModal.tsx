"use client";

import { useState } from 'react';
import { X, ShoppingBag, Heart, Truck, RefreshCw, ChevronLeft, ChevronRight, Star, BadgeCheck, Zap } from 'lucide-react';
import type { Product } from '../../lib/catalog-helpers';
import { useCart } from '../../lib/cart-context';
import { useWishlist } from '../../lib/wishlist-context';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const images = [product.image, product.hoverImage];
  const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);

  const handleAdd = () => {
    if (product.sizes?.length && !selectedSize) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-charcoal-700 hover:text-charcoal-900 transition-colors"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="grid sm:grid-cols-2">
          {/* Image panel */}
          <div className="relative bg-charcoal-50 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden aspect-square">
            <img
              src={images[imgIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="bg-charcoal-800 text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">{product.badge}</span>
              )}
              {discount > 0 && (
                <span className="bg-brand-orange text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">-{discount}%</span>
              )}
              {product.stock === 'low_stock' && (
                <span className="bg-amber-500 text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">Low Stock</span>
              )}
            </div>

            {/* Image nav */}
            {images.length > 1 && (
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                <button
                  onClick={() => setImgIndex((v) => (v - 1 + images.length) % images.length)}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-charcoal-700 hover:bg-white shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <div className="flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setImgIndex((v) => (v + 1) % images.length)}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-charcoal-700 hover:bg-white shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="p-6 flex flex-col gap-4">
            <div>
              <span className="text-xs text-charcoal-400 font-inter uppercase tracking-wide">{product.brand}</span>
              <h2 className="font-poppins font-bold text-charcoal-900 text-xl mt-1">{product.name}</h2>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'text-brand-orange fill-brand-orange' : 'text-charcoal-200'}`} strokeWidth={2} />
                  ))}
                </div>
                <span className="text-sm text-charcoal-500 font-inter">{product.rating} ({product.reviews} reviews)</span>
                <span className="flex items-center gap-0.5 text-brand-green text-xs font-poppins font-medium">
                  <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} /> Verified
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-manrope font-bold text-charcoal-900 text-2xl">₹{product.salePrice.toLocaleString('en-IN')}</span>
              {product.price > product.salePrice && (
                <span className="text-base text-charcoal-400 line-through font-manrope">₹{product.price.toLocaleString('en-IN')}</span>
              )}
              {discount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-sm font-poppins font-semibold">{discount}% off</span>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="text-sm font-poppins font-semibold text-charcoal-900 block mb-2">
                  Color: <span className="font-normal text-charcoal-500">{selectedColor || 'Select'}</span>
                </span>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      title={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c ? 'border-brand-orange scale-110 ring-2 ring-brand-orange/30' : 'border-white ring-1 ring-charcoal-200'
                        }`}
                      style={{ backgroundColor: c }}
                      aria-label={c}
                      aria-pressed={selectedColor === c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-poppins font-semibold text-charcoal-900">
                    Size: <span className="font-normal text-charcoal-500">{selectedSize || 'Select size'}</span>
                  </span>
                  <a href="#size-guide" className="text-xs text-brand-orange font-inter hover:underline">Size Guide</a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-11 h-11 rounded-xl border text-sm font-inter font-medium transition-all ${selectedSize === s
                          ? 'bg-charcoal-900 text-white border-charcoal-900'
                          : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400'
                        }`}
                      aria-label={`Size ${s}`}
                      aria-pressed={selectedSize === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-brand-orange font-inter mt-1.5">Please select a size</p>
                )}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAdd}
                disabled={!!product.sizes?.length && !selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-poppins font-semibold text-sm transition-all ${added
                    ? 'bg-brand-green text-white'
                    : 'bg-brand-orange text-white hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggle(product)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${wishlisted ? 'border-brand-orange bg-brand-orange/10 text-brand-orange' : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400'
                  }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlisted}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-brand-orange' : ''}`} strokeWidth={2} />
              </button>
            </div>

            {/* Trust mini row */}
            <div className="flex flex-wrap gap-3 pt-3 border-t border-charcoal-200">
              <span className="flex items-center gap-1.5 text-xs text-charcoal-500 font-inter">
                <Truck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> Free delivery ₹999+
              </span>
              <span className="flex items-center gap-1.5 text-xs text-charcoal-500 font-inter">
                <RefreshCw className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> 7-day easy returns
              </span>
              <span className="flex items-center gap-1.5 text-xs text-charcoal-500 font-inter">
                <Zap className="w-3.5 h-3.5 text-brand-orange" strokeWidth={2} /> COD available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
