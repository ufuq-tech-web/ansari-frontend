"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Zap as BuyIcon, Heart, Truck, RefreshCw, Zap, Star, BadgeCheck,
  ChevronLeft, ChevronRight, ZoomIn, Minus, Plus, MapPin, ShieldCheck, ThumbsUp, Copy, Check, BookOpen, ArrowRight,
  CheckCircle2, AlertTriangle, XCircle,
} from "lucide-react";
import ProductCard from "../ProductCard";
import CategoryFAQ from "../category/CategoryFaq";
import RecentlyViewed from "../RecentlyViewed";
import { useCart } from "../../lib/cart-context";
import { useWishlistStore } from "../../lib/wishlist-store";
import { useImageZoom } from "../../hooks/useImageZoom";
import { useDeliveryEstimate } from "../../hooks/useDeliveryEstimate";
import {
  findRelevantGuide, findCollectionForProduct, findSameColorProducts,
  findPriceTierForProduct, getProductDescription, getProductFeatures, getRatingBreakdown,
  slugify, type ProductWithCategory, type CategoryConfig, type Review,
} from "../../lib/catalog-helpers";

type Tab = "description" | "reviews";

const RATING_LABELS = ["Excellent", "Very Good", "Good", "Average", "Poor"];
const RATING_COLORS = ["bg-brand-green", "bg-brand-green", "bg-amber-400", "bg-orange-500", "bg-red-500"];

// Deterministic pseudo "helpful" base count per review id, so it's stable across renders.
function baseHelpfulCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 40 + (hash % 900);
}

function reviewerInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

interface Props {
  product: ProductWithCategory;
  categoryConfig?: CategoryConfig;
  reviews: Review[];
}

export default function ProductDetailClient({ product, categoryConfig, reviews }: Props) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [imgIndex, setImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [copied, setCopied] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());
  const { zoomStyle, handleMouseMove, handleMouseLeave } = useImageZoom();
  const { pincode, deliveryEstimate, handlePincodeChange, handleCheckDelivery } = useDeliveryEstimate(product.stock);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlistStore();

  const wishlisted = isWishlisted(product.id);
  const images = [product.image, product.hoverImage, ...(product.gallery || [])].filter((v, i, arr) => v && arr.indexOf(v) === i);
  const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
  const description = getProductDescription(product);
  const ratingBreakdown = getRatingBreakdown(product.rating);
  const relevantGuide = findRelevantGuide(product, categoryConfig?.buyingGuides ?? []);
  const collection = findCollectionForProduct(product);
  const priceTier = findPriceTierForProduct(product);
  const sameColorProducts = findSameColorProducts(product, categoryConfig?.products ?? []);

  const matchedReviews = reviews.filter((r) => r.productId === product.id);

  const relatedProducts = (() => {
    if (!categoryConfig) return [];
    // Prefer same-subcategory matches, then pad with other same-category
    // products — some subcategories (e.g. most accessories) only have a
    // single item, so a strict subcategory-only match would come up empty.
    const sameSubcategory = categoryConfig.products.filter((p) => p.id !== product.id && p.subcategory === product.subcategory);
    const otherInCategory = categoryConfig.products.filter((p) => p.id !== product.id && p.subcategory !== product.subcategory);
    return [...sameSubcategory, ...otherInCategory].slice(0, 4);
  })();

  const features = getProductFeatures(product);
  const canAdd = product.stock !== "out_of_stock" && 
    (!product.sizes?.length || !!selectedSize) && 
    (!product.colors?.length || !!selectedColor);

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!canAdd) return;
    addItem(product, quantity);
    router.push("/checkout");
  };

  const handleCopyHighlights = () => {
    const lines = [
      `Brand: ${product.brand}`,
      categoryConfig ? `Category: ${categoryConfig.name}` : null,
      product.subcategory ? `Type: ${product.subcategory}` : null,
      product.sizes?.length ? `Sizes: ${product.sizes.join(", ")}` : null,
    ].filter(Boolean);
    navigator.clipboard?.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleHelpful = (id: string) => {
    setHelpfulClicked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const specifications: [string, string][] = [
    ["Brand", product.brand],
    ...(categoryConfig ? [["Category", categoryConfig.name] as [string, string]] : []),
    ...(product.subcategory ? [["Type", product.subcategory] as [string, string]] : []),
    ...(product.material ? [["Material", product.material] as [string, string]] : []),
    ...(product.occasion ? [["Occasion", product.occasion] as [string, string]] : []),
    ...(product.gender ? [["Gender", product.gender[0].toUpperCase() + product.gender.slice(1)] as [string, string]] : []),
    ["Availability", product.stock === "out_of_stock" ? "Out of Stock" : product.stock === "low_stock" ? "Low Stock" : "In Stock"],
  ];

  return (
    <div className="min-h-screen bg-brand-ivory pb-24 lg:pb-0">
      <div className="container-main py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-charcoal-500 font-inter flex-wrap">
            <li><Link href="/" className="hover:text-brand-orange transition-colors">Home</Link></li>
            <li aria-hidden><span className="text-charcoal-300">/</span></li>
            {categoryConfig ? (
              <>
                <li><Link href={`/${categoryConfig.key}`} className="hover:text-brand-orange transition-colors">{categoryConfig.name}</Link></li>
                {product.subcategory && (
                  <>
                    <li aria-hidden><span className="text-charcoal-300">/</span></li>
                    <li>
                      <Link href={`/${categoryConfig.key}/${slugify(product.subcategory)}`} className="hover:text-brand-orange transition-colors">
                        {product.subcategory}
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : null}
            <li aria-hidden><span className="text-charcoal-300">/</span></li>
            <li className="text-charcoal-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-3 lg:sticky lg:top-24 lg:self-start">
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-3">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setImgIndex(i)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${i === imgIndex ? "border-brand-orange" : "border-charcoal-200 hover:border-charcoal-400"}`}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === imgIndex}
                  >
                    <img src={img} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div
              className="group relative bg-white rounded-2xl overflow-hidden aspect-square shadow-card cursor-zoom-in flex-1"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={images[imgIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                style={zoomStyle}
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.badge && (
                  <span className="bg-charcoal-800 text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">{product.badge}</span>
                )}
                {discount > 0 && (
                  <span className="bg-brand-orange text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">-{discount}%</span>
                )}
                {product.stock === "low_stock" && (
                  <span className="bg-amber-500 text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">Low Stock</span>
                )}
              </div>

              <span className="absolute top-4 right-4 hidden lg:flex items-center gap-1 bg-white/90 text-charcoal-600 text-[11px] font-inter px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIn className="w-3 h-3" strokeWidth={2} /> Hover to zoom
              </span>

              {images.length > 1 && (
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={() => setImgIndex((v) => (v - 1 + images.length) % images.length)}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-charcoal-700 hover:bg-white shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setImgIndex((v) => (v + 1) % images.length)}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-charcoal-700 hover:bg-white shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <Link href={`/brands/${slugify(product.brand)}`} className="text-sm text-charcoal-900 font-inter uppercase tracking-wide hover:text-brand-orange transition-colors">
                {product.brand}
              </Link>
              <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl sm:text-3xl mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setActiveTab("reviews")} className="flex items-center gap-1 bg-brand-green text-white text-sm font-poppins font-semibold px-2 py-0.5 rounded-md hover:opacity-90 transition-opacity">
                {product.rating} <Star className="w-3.5 h-3.5 fill-white" strokeWidth={0} />
              </button>
              <button onClick={() => setActiveTab("reviews")} className="text-sm text-charcoal-900 font-inter hover:text-brand-orange transition-colors">
                {product.reviews} Reviews
              </button>
              <span className="flex items-center gap-0.5 text-charcoal-900 text-xs font-poppins font-medium">
                <BadgeCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> Verified quality
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-manrope font-bold text-charcoal-900 text-3xl">₹{product.salePrice.toLocaleString("en-IN")}</span>
              {product.price > product.salePrice && (
                <span className="text-lg text-charcoal-900 line-through font-manrope">₹{product.price.toLocaleString("en-IN")}</span>
              )}
              {discount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-sm font-poppins font-semibold">{discount}% off</span>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span className="text-sm font-poppins font-semibold text-charcoal-900 block mb-2">
                  Select Size: <span className="font-normal text-charcoal-500">{selectedSize || "Choose a size"}</span>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl border transition-all ${selectedSize === s ? "bg-charcoal-900 border-charcoal-900" : "border-charcoal-200 hover:border-charcoal-400"}`}
                      aria-label={`Size ${s}, ₹${product.salePrice.toLocaleString("en-IN")}`}
                      aria-pressed={selectedSize === s}
                    >
                      <span className={`text-sm font-inter font-semibold ${selectedSize === s ? "text-white" : "text-charcoal-700"}`}>{s}</span>
                      <span className={`text-[10px] font-manrope ${selectedSize === s ? "text-white/70" : "text-charcoal-400"}`}>₹{product.salePrice.toLocaleString("en-IN")}</span>
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-brand-orange font-inter mt-1.5">Please select a size</p>
                )}
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="text-sm font-poppins font-semibold text-charcoal-900 block mb-2">
                  Color: <span className="font-normal text-charcoal-500">{selectedColor || "Select a color"}</span>
                </span>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      title={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c ? "border-brand-orange scale-110 ring-2 ring-brand-orange/30" : "border-white ring-1 ring-charcoal-200"}`}
                      style={{ backgroundColor: c }}
                      aria-label={c}
                      aria-pressed={selectedColor === c}
                    />
                  ))}
                </div>
                {!selectedColor && (
                  <p className="text-xs text-brand-orange font-inter mt-1.5">Please select a color</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <span className="text-sm font-poppins font-semibold text-charcoal-900 block mb-2">Quantity</span>
              <div className="inline-flex items-center border border-charcoal-200 rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-11 flex items-center justify-center text-charcoal-700 hover:text-brand-orange disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" strokeWidth={2} />
                </button>
                <span className="w-10 text-center font-inter font-semibold text-charcoal-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="w-10 h-11 flex items-center justify-center text-charcoal-700 hover:text-brand-orange disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Stock status */}
            <div>
              {product.stock === "out_of_stock" ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-poppins font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                  <XCircle className="w-4 h-4" strokeWidth={2} /> Out of Stock
                </span>
              ) : product.stock === "low_stock" ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-poppins font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                  <AlertTriangle className="w-4 h-4" strokeWidth={2} /> Only a few left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-poppins font-semibold text-brand-green bg-brand-green/10 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2} /> In Stock
                </span>
              )}
            </div>

            <div className="hidden lg:flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-poppins font-semibold text-sm transition-all ${added ? "border-brand-green text-brand-green bg-brand-green/5" : "border-brand-orange text-brand-orange hover:bg-brand-orange/5 disabled:opacity-50 disabled:cursor-not-allowed"}`}
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!canAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-poppins font-semibold text-sm bg-brand-orange text-white hover:bg-brand-orange-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BuyIcon className="w-4 h-4" strokeWidth={2} />
                Buy Now
              </button>
              <button
                onClick={() => toggle(product)}
                className={`w-14 h-14 flex-shrink-0 rounded-xl border flex items-center justify-center transition-all ${wishlisted ? "border-brand-orange bg-brand-orange/10 text-brand-orange" : "border-charcoal-200 text-charcoal-700 hover:border-charcoal-400"}`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-brand-orange" : ""}`} strokeWidth={2} />
              </button>
            </div>

            {/* Delivery check */}
            <div className="pt-4 border-t border-charcoal-200">
              <span className="text-sm font-poppins font-semibold text-charcoal-900 flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 text-brand-orange" strokeWidth={2} /> Check delivery date
              </span>
              <form onSubmit={handleCheckDelivery} className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="Enter pincode"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
                />
                <button
                  type="submit"
                  disabled={pincode.length !== 6}
                  className="px-4 py-2.5 rounded-xl border border-charcoal-900 text-charcoal-900 font-poppins font-semibold text-sm hover:bg-charcoal-900 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Check
                </button>
              </form>
              {deliveryEstimate && (
                <p className="mt-2 text-sm text-brand-green font-inter flex items-center gap-1.5">
                  <Truck className="w-4 h-4" strokeWidth={2} /> Delivery by <span className="font-semibold">{deliveryEstimate}</span> to {pincode}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs text-charcoal-900 font-inter">
                <Truck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> Free delivery on orders ₹999+
              </span>
              <Link href="/return-exchange" className="flex items-center gap-1.5 text-xs text-charcoal-900 font-inter hover:text-brand-orange transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> 7-day easy returns
              </Link>
              <span className="flex items-center gap-1.5 text-xs text-charcoal-900 font-inter">
                <Zap className="w-3.5 h-3.5 text-brand-orange" strokeWidth={2} /> COD available
              </span>
              <span className="flex items-center gap-1.5 text-xs text-charcoal-900 font-inter">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={2} /> 100% secure checkout
              </span>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="pt-4 border-t border-charcoal-200">
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-3">Features</h3>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal-900 font-inter">
                      <Check className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            <div className="bg-white rounded-2xl border border-charcoal-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">Specifications</h3>
                <button onClick={handleCopyHighlights} className="flex items-center gap-1 text-xs text-brand-orange font-poppins font-semibold hover:opacity-80">
                  {copied ? <Check className="w-3.5 h-3.5" strokeWidth={2} /> : <Copy className="w-3.5 h-3.5" strokeWidth={2} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                {specifications.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-charcoal-400 font-inter">{k}</dt>
                    <dd className="text-sm text-charcoal-900 font-inter font-medium mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {relevantGuide && (
              <Link
                href={`/guides/${relevantGuide.slug}`}
                className="flex items-center gap-3 bg-brand-ivory rounded-2xl border border-charcoal-200 p-4 hover:border-brand-orange/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-brand-orange" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-charcoal-400 font-inter">Not sure this is right for you?</span>
                  <p className="text-sm font-poppins font-semibold text-charcoal-900 truncate group-hover:text-brand-orange transition-colors">{relevantGuide.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:text-brand-orange transition-colors flex-shrink-0" strokeWidth={2} />
              </Link>
            )}

            {(collection || priceTier) && (
              <div className="flex flex-wrap gap-2">
                {collection && (
                  <Link
                    href={collection.href}
                    className="inline-flex items-center gap-1.5 text-xs font-poppins font-semibold text-charcoal-700 bg-white border border-charcoal-200 rounded-full px-3 py-1.5 hover:border-brand-orange hover:text-brand-orange transition-colors"
                  >
                    Part of {collection.name} <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </Link>
                )}
                {priceTier && categoryConfig && (
                  <Link
                    href={`/${categoryConfig.key}/price/${priceTier.key}`}
                    className="inline-flex items-center gap-1.5 text-xs font-poppins font-semibold text-charcoal-700 bg-white border border-charcoal-200 rounded-full px-3 py-1.5 hover:border-brand-orange hover:text-brand-orange transition-colors"
                  >
                    More {priceTier.label} <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mt-14">
          <div className="flex items-center gap-2 border-b border-charcoal-200">
            {([
              ["description", "Description"],
              ["reviews", `Ratings & Reviews (${product.reviews})`],
            ] as [Tab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-poppins font-semibold text-sm border-b-2 -mb-px transition-colors ${activeTab === tab ? "border-brand-orange text-charcoal-900" : "border-transparent text-charcoal-400 hover:text-charcoal-700"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <p className="text-charcoal-700 font-inter leading-relaxed max-w-2xl">{description}</p>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl">
                <h2 className="font-poppins font-bold text-charcoal-900 text-lg mb-5">Product Ratings & Reviews</h2>
                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center justify-center text-center sm:border-r sm:border-charcoal-200 sm:pr-8">
                    <span className="font-poppins font-bold text-brand-green text-4xl flex items-center gap-1">{product.rating} <Star className="w-6 h-6 fill-brand-green" strokeWidth={0} /></span>
                    <span className="text-xs text-charcoal-400 font-inter mt-1">{product.reviews} Ratings</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    {ratingBreakdown.map(({ percent }, i) => (
                      <div key={RATING_LABELS[i]} className="flex items-center gap-3">
                        <span className="text-xs text-charcoal-600 font-inter w-20">{RATING_LABELS[i]}</span>
                        <div className="flex-1 h-2 rounded-full bg-charcoal-100 overflow-hidden">
                          <div className={`h-full rounded-full ${RATING_COLORS[i]}`} style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs text-charcoal-400 font-inter w-10 text-right">{Math.round((percent / 100) * product.reviews)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {matchedReviews.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {matchedReviews.map((r) => {
                      const isHelpful = helpfulClicked.has(r.id);
                      const helpfulCount = baseHelpfulCount(r.id) + (isHelpful ? 1 : 0);
                      return (
                        <div key={r.id} className="pb-5 border-b border-charcoal-100 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-full bg-charcoal-800 text-white flex items-center justify-center font-poppins font-semibold text-sm flex-shrink-0">
                              {reviewerInitial(r.name)}
                            </div>
                            <div>
                              <p className="font-poppins font-medium text-charcoal-900 text-sm">{r.name}</p>
                              <p className="text-xs text-charcoal-400 font-inter">{r.location}</p>
                            </div>
                            <span className="ml-auto flex items-center gap-1 bg-brand-green text-white text-xs font-poppins font-semibold px-2 py-0.5 rounded-md">
                              {r.rating.toFixed(1)} <Star className="w-3 h-3 fill-white" strokeWidth={0} />
                            </span>
                          </div>
                          {r.verified && (
                            <span className="flex items-center gap-0.5 text-brand-green text-xs font-poppins font-medium mb-1.5">
                              <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} /> Verified Purchase
                            </span>
                          )}
                          <p className="text-charcoal-700 font-inter text-sm leading-relaxed">{r.text}</p>
                          <button
                            onClick={() => toggleHelpful(r.id)}
                            className={`mt-3 flex items-center gap-1.5 text-xs font-inter transition-colors ${isHelpful ? "text-brand-orange" : "text-charcoal-400 hover:text-charcoal-700"}`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? "fill-brand-orange" : ""}`} strokeWidth={2} /> Helpful ({helpfulCount})
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-charcoal-400 font-inter">Written reviews for this exact style aren't available yet — ratings above are aggregated from verified buyers.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQs */}
      {categoryConfig && <CategoryFAQ category={categoryConfig} />}

      {/* Same color */}
      {sameColorProducts.length > 0 && (
        <section className="py-10 sm:py-16 bg-white border-t border-charcoal-200">
          <div className="container-main">
            <h2 className="font-poppins font-bold text-charcoal-900 text-xl sm:text-2xl mb-6">Similar Colors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {sameColorProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-10 sm:py-16 bg-brand-ivory border-t border-charcoal-200">
          <div className="container-main">
            <h2 className="font-poppins font-bold text-charcoal-900 text-xl sm:text-2xl mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently viewed */}
      <RecentlyViewed />

      {/* Sticky mobile CTA bar */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-30 bg-white border-t border-charcoal-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => toggle(product)}
          className={`w-11 h-11 flex-shrink-0 rounded-xl border flex items-center justify-center transition-all ${wishlisted ? "border-brand-orange bg-brand-orange/10 text-brand-orange" : "border-charcoal-200 text-charcoal-700"}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-brand-orange" : ""}`} strokeWidth={2} />
        </button>
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 font-poppins font-semibold text-xs transition-all ${added ? "border-brand-green text-brand-green" : "border-brand-orange text-brand-orange disabled:opacity-50 disabled:cursor-not-allowed"}`}
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={2} />
          {added ? "Added!" : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!canAdd}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-poppins font-semibold text-xs bg-brand-orange text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BuyIcon className="w-4 h-4" strokeWidth={2} />
          Buy Now
        </button>
      </div>
    </div>
  );
}
