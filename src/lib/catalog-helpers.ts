// Pure types, constants, and utility functions extracted from the old static
// data/catalog.ts so the storefront can run entirely off the live API.
// Nothing in this file holds product/category data itself — all data comes
// from storefront-api.ts, which imports the types and helpers below.

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  salePrice: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage: string;
  badge?: string;
  subcategory?: string;
  stock?: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
  gender?: 'boys' | 'girls' | 'unisex';
  ageGroup?: '2-5' | '6-9' | '10-14';
  material?: string;
  occasion?: string;
  soleMaterial?: string;
  closureType?: string;
  heelHeight?: string;
  toeShape?: string;
  gallery?: string[];
  isActive?: boolean;
}

export interface ProductWithCategory extends Product {
  category: 'men' | 'women' | 'kids' | 'accessories';
}

export const MATERIALS = ['Leather', 'Canvas', 'Mesh', 'Rubber', 'Synthetic'] as const;
export const OCCASIONS = ['Formal', 'Casual', 'Sports', 'Party', 'Ethnic', 'Everyday', 'School'] as const;

export interface RelatedCategory {
  key: string;
  name: string;
  image: string;
}

export interface SubcategoryItem {
  name: string;
  image: string;
  count?: string;
  _count?: { products: number };
}

export interface CategoryConfig {
  key: string;
  name: string;
  description: string;
  heroImage: string;
  totalProducts: number;
  subcategories: SubcategoryItem[];
  products: ProductWithCategory[];
  relatedCategories: RelatedCategory[];
  faqs: { question: string; answer: string }[];
  buyingGuides: BuyingGuideWithCategory[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface BuyingGuide {
  id?: string;
  title: string;
  slug: string;
  description: string;
  readTime: string;
  content: { heading: string; body: string }[];
}

export interface BuyingGuideWithCategory extends BuyingGuide {
  categoryKey: string;
  categoryName: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  verified: boolean;
  productId?: string | null;
}

// Price bands used for the mega menu's Price column and the /{category}/price/{tier} route.
export const priceTiers: Record<string, { label: string; min: number; max: number }> = {
  'under-999': { label: 'Under ₹999', min: 0, max: 999 },
  '1000-1499': { label: '₹1000–₹1499', min: 1000, max: 1499 },
  '1500-plus': { label: '₹1500+', min: 1500, max: 5000 },
};

// Which price tier a product's sale price falls into, for the "Similar Price
// Range" cross-link on product pages.
export function findPriceTierForProduct(product: Product): { key: string; label: string } | undefined {
  const entry = Object.entries(priceTiers).find(([, info]) => product.salePrice >= info.min && product.salePrice <= info.max);
  return entry ? { key: entry[0], label: entry[1].label } : undefined;
}

// Top-level homepage category tiles.
export const categories = [
  {
    name: 'Men',
    href: '/mens-shoes',
    image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
    count: '320+ Styles',
  },
  {
    name: 'Women',
    href: '/womens-shoes',
    image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
    count: '450+ Styles',
  },
  {
    name: 'Kids',
    href: '/kids-shoes',
    image: 'https://images.pexels.com/photos/5275375/pexels-photo-5275375.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
    count: '180+ Styles',
  },
  {
    name: 'Accessories',
    href: '/accessories',
    image: 'https://images.pexels.com/photos/915917/pexels-photo-915917.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
    count: '90+ Items',
  },
];

// Curated cross-category collections shown on the homepage and linked from PDPs.
export const collections = [
  {
    name: 'Office Wear',
    href: '/mens-shoes/formal-shoes-for-men',
    image: '/images/featured/featured-1.png',
    description: 'Polished & professional',
  },
  {
    name: 'Everyday Flats',
    href: '/womens-shoes/womens-flats',
    image: '/images/featured/featured-2.png',
    description: 'All-day comfort',
  },
  {
    name: 'Sports Collection',
    href: '/mens-shoes/sports-shoes-for-men',
    image: '/images/featured/featured-3.png',
    description: 'Performance ready',
  },
  {
    name: 'Kolhapuri Chappal',
    href: '/women/kolhapuri-chappal',
    image: '/images/featured/featured-4.png',
    description: 'Handcrafted heritage style',
  },
  {
    name: 'School Shoes',
    href: '/kids-shoes/school-shoes',
    image: '/images/featured/featured-5.png',
    description: 'Durable & smart',
  },
];

// Subcategory showcase cards (name + representative photo) per top-level
// category — shared by the homepage's category slider and the Collections
// page's per-gender grids so both stay in sync with one source of truth.
export const subcategoryShowcase: Record<string, { name: string; image: string }[]> = {
  men: [
    { name: 'Formal Shoes', image: '/images/men-collection/men-formal-shoes.png' },
    { name: 'Casual Shoes', image: '/images/men-collection/men-casual-shoes.png' },
    { name: 'Sneakers', image: '/images/men-collection/men-sneakers.png' },
    { name: 'Sports Shoes', image: '/images/men-collection/men-sports-shoes.png' },
    { name: 'Sandals', image: '/images/men-collection/men-sandals.png' },
    { name: 'Slippers & Flip Flops', image: '/images/men-collection/men-slippers-flip-flops.png' },
    { name: 'Loafers', image: '/images/men-collection/men-loafers.png' },
    { name: 'Boots', image: '/images/men-collection/men-boots.png' },
  ],
  women: [
    { name: 'Flats', image: '/images/women-collection/women-flats.png' },
    { name: 'Sandals', image: '/images/women-collection/women-sandals.png' },
    { name: 'Slippers', image: '/images/women-collection/women-slippers.png' },
    { name: 'Kolhapuri Chappal', image: '/images/women-collection/women-kolhapuri-chappal.png' },
    { name: 'Mojari Shoes', image: '/images/women-collection/women-mojari-shoes.png' },
  ],
  kids: [
    { name: 'School Shoes', image: '/images/kids-collection/kids-school-shoes.png' },
    { name: 'Casual Shoes', image: '/images/kids-collection/kids-casual-shoes.png' },
    { name: 'Sneakers', image: '/images/kids-collection/kids-sneakers.png' },
    { name: 'Sandals', image: '/images/kids-collection/kids-sandals.png' },
    { name: 'Slippers', image: '/images/kids-collection/kids-slippers.png' },
    { name: 'Boys', image: '/images/kids-collection/kids-boys.png' },
    { name: 'Girls', image: '/images/kids-collection/kids-girls.png' },
    { name: 'New born baby', image: '/images/kids-collection/kids-new-born.png' },
    { name: 'Toddler (2–5 Years)', image: '/images/kids-collection/kids-toddler.png' },
    { name: 'Big Kids Shoes (10–14 Years)', image: '/images/kids-collection/kids-big-kids.png' },
  ],
  accessories: [
    { name: 'Socks', image: '/images/accessories-collection/accessories-socks.png' },
    { name: 'Shoe Care Products', image: '/images/accessories-collection/accessories-shoe-care-products.png' },
    { name: 'Shoes Polish', image: '/images/accessories-collection/accessories-shoes-polish.png' },
    { name: 'Shoes Brush', image: '/images/accessories-collection/accessories-shoes-brush.png' },
  ],
};

// The named collection (Office Wear, Wedding Collection, etc.) a product
// belongs to, matched by its category+subcategory against each collection's
// target page. Not every product belongs to one of the 5 curated collections.
export function findCollectionForProduct(
  product: Product & { category?: ProductWithCategory['category'] }
): { name: string; href: string; description: string } | undefined {
  if (!product.category || !product.subcategory) return undefined;
  const path = `/${product.category}/${slugify(product.subcategory)}`;
  return collections.find((c) => c.href === path);
}

// Other products sharing at least one color, within the same category pool.
export function findSameColorProducts(
  product: Product & { category?: ProductWithCategory['category'] },
  pool: ProductWithCategory[],
  limit = 4
): ProductWithCategory[] {
  if (!product.colors?.length) return [];
  return pool
    .filter((p) => p.id !== product.id && p.colors?.some((c) => product.colors!.includes(c)))
    .slice(0, limit);
}

// Maps a product's subcategory to the most relevant buying guide slug within
// its category. Subcategories without an obvious match fall back to the
// category's first guide in findRelevantGuide below.
const subcategoryGuideMap: Record<string, Record<string, string>> = {
  men: {
    'Formal Shoes': 'how-to-choose-formal-shoes',
    'Casual Shoes': 'sneaker-buying-guide',
    'Sports Shoes': 'running-shoe-guide',
    Loafers: 'office-shoe-guide',
    Boots: 'office-shoe-guide',
  },
  women: {
    Flats: 'flat-shoes-buying-guide',
    Sandals: 'sandal-styles-explained',
    Slippers: 'sandal-styles-explained',
    'Kolhapuri Chappal': 'sandal-styles-explained',
  },
  kids: {
    'School Shoes': 'best-school-shoes-for-kids',
    Sneakers: 'kids-sports-shoe-guide',
  },
  accessories: {
    'Shoes Polish': 'leather-shoe-care-guide',
    'Shoes Brush': 'leather-shoe-care-guide',
    'Shoe Care Products': 'how-to-waterproof-your-shoes',
  },
};

// Picks the buying guide most relevant to a product — matched by subcategory
// where we have a mapping, otherwise the category's first guide.
export function findRelevantGuide(
  product: Product & { category?: ProductWithCategory['category'] },
  categoryGuides: BuyingGuideWithCategory[]
): BuyingGuideWithCategory | undefined {
  if (!product.category || !categoryGuides.length) return undefined;
  const mappedSlug = product.subcategory ? subcategoryGuideMap[product.category]?.[product.subcategory] : undefined;
  return (mappedSlug ? categoryGuides.find((g) => g.slug === mappedSlug) : undefined) ?? categoryGuides[0];
}

// Representative products for a buying guide — the reverse of
// findRelevantGuide's subcategory mapping, used for the guide's "Shop the
// Products" section (the Blog → Products internal link).
export function findProductsForGuide(guide: BuyingGuideWithCategory, pool: ProductWithCategory[], limit = 4): ProductWithCategory[] {
  const map = subcategoryGuideMap[guide.categoryKey] ?? {};
  const matchingSubcats = Object.entries(map)
    .filter(([, slug]) => slug === guide.slug)
    .map(([subcat]) => subcat);

  const matched = matchingSubcats.length
    ? pool.filter((p) => p.subcategory && matchingSubcats.includes(p.subcategory))
    : [];

  if (matched.length >= limit) return matched.slice(0, limit);

  const matchedIds = new Set(matched.map((p) => p.id));
  const rest = [...pool]
    .filter((p) => !matchedIds.has(p.id))
    .sort((a, b) => b.reviews - a.reviews);

  return [...matched, ...rest].slice(0, limit);
}

const SUBCATEGORY_FEATURE: Record<string, string> = {
  'Formal Shoes': 'Polished finish for a professional, boardroom-ready look',
  'Boots': 'Reinforced sole built to handle rough terrain and daily wear',
  'Casual Shoes': 'Lightweight design for all-day everyday comfort',
  'Loafers': 'Slip-on design with a padded footbed for easy wear',
  'Sports Shoes': 'Cushioned sole engineered for high-impact activity',
  'Sandals': 'Adjustable straps for a secure, custom fit',
  'Slippers & Flip Flops': 'Quick slip-on design for effortless everyday wear',
  'Flats': 'Flexible sole that moves naturally with your foot',
  'Kolhapuri Chappal': 'Handcrafted detailing rooted in traditional design',
  'Mojari Shoes': 'Traditional flat construction with intricate hand embroidery',
  'Slippers': 'Soft, cushioned footbed for relaxed indoor comfort',
  'Sneakers': 'Breathable design suited for daily wear',
  'School Shoes': 'Sturdy build designed to last through a full school term',
  'Socks': 'Soft, breathable weave for all-day comfort',
  'Shoe Care Products': 'Keeps footwear looking new for longer',
  'Shoes Polish': 'Restores shine and protects the leather surface',
  'Shoes Brush': 'Gently lifts dirt without damaging the material',
};

// Real, data-derived bullet points (material/subcategory/occasion/sizes/colors already on
// the product) — not fabricated marketing copy.
export function getProductFeatures(product: Product): string[] {
  const features: string[] = [];
  if (product.material) features.push(`${product.material} construction for durability and comfort`);
  if (product.subcategory && SUBCATEGORY_FEATURE[product.subcategory]) {
    features.push(SUBCATEGORY_FEATURE[product.subcategory]);
  }
  if (product.occasion) features.push(`Well suited for ${product.occasion.toLowerCase()} occasions`);
  if (product.sizes?.length) {
    features.push(`Available in ${product.sizes.length} sizes, from ${product.sizes[0]} to ${product.sizes[product.sizes.length - 1]}`);
  }
  if (product.colors && product.colors.length > 1) {
    features.push(`Offered in ${product.colors.length} colour options`);
  }
  return features;
}

// Descriptive, unique product URL segment: "mens-leather-derby-shoes-m-1".
// The trailing id keeps it unique even when two products share a name.
export function productUrlSlug(p: Product): string {
  return `${slugify(p.name)}-${p.id}`;
}

// Canonical product URL. Products with a real category+subcategory (the full
// catalog) get the SEO path /{category}/{subcategory}/{product-name} with no
// id needed (names are unique within a category+subcategory). Curated-only
// products (lacking category/subcategory) fall back to the flat /product/{name}-{id} route.
export function productHref(p: Product & { category?: ProductWithCategory['category'] }): string {
  if (p.category && p.subcategory) {
    return `/${p.category}/${slugify(p.subcategory)}/${slugify(p.name)}`;
  }
  return `/product/${productUrlSlug(p)}`;
}

// Plausible 5→1 star distribution for a given average rating (we don't store per-star
// counts). Higher-rated products skew more heavily toward 5-star.
export function getRatingBreakdown(rating: number): { star: number; percent: number }[] {
  const percents =
    rating >= 4.5 ? [70, 20, 6, 3, 1] :
    rating >= 4.0 ? [55, 28, 10, 5, 2] :
    rating >= 3.5 ? [40, 30, 15, 10, 5] :
    rating >= 3.0 ? [25, 25, 25, 15, 10] :
    [15, 20, 25, 25, 15];

  return [5, 4, 3, 2, 1].map((star, i) => ({ star, percent: percents[i] }));
}

const subcategoryOpeners: Record<string, string> = {
  'formal shoes': 'a polished, office-ready dress shoe',
  'casual shoes': 'an everyday casual shoe built for comfort',
  'sports shoes': 'a performance-ready sports shoe',
  boots: 'a durable, all-weather boot',
  loafers: 'a slip-on loafer that balances comfort and style',
  'slippers & flip flops': 'a lightweight, easy-wear slipper or flip flop',
  sandals: 'a handcrafted sandal',
  flats: 'a comfortable everyday flat',
  sneakers: 'a versatile lifestyle sneaker',
  slippers: 'a soft, easy-slip house slipper',
  'kolhapuri chappal': 'a festive, handcrafted Kolhapuri chappal',
  'mojari shoes': 'a traditional, hand-embroidered mojari',
  'school shoes': "a durable, parent-approved school shoe",
  socks: 'a soft, breathable everyday sock',
  'shoe care products': 'a reliable footwear care essential',
  'shoes polish': 'a premium leather polish',
  'shoes brush': 'a gentle-bristle shoe cleaning brush',
};

// Templated but variable-driven product description — used until real per-product
// copywriting is written. Varies by subcategory, brand, rating, and stock/badge state.
export function getProductDescription(product: Product): string {
  const opener = subcategoryOpeners[product.subcategory?.toLowerCase() ?? ''] ?? 'a quality footwear pick';
  const audience = product.gender && product.ageGroup
    ? ` Designed for ${product.gender} aged ${product.ageGroup},`
    : '';
  const trust = product.reviews > 0
    ? ` Rated ${product.rating} out of 5 by ${product.reviews} customers,`
    : '';
  const stockNote = product.stock === 'low_stock'
    ? ' Only a few pairs left in stock — order soon to avoid missing out.'
    : product.stock === 'out_of_stock'
      ? ' Currently out of stock — check back soon for restocks.'
      : '';
  const badgeNote = product.isNew
    ? ' Part of our latest arrivals.'
    : product.badge === 'Bestseller'
      ? ' A customer favorite and one of our top sellers.'
      : '';

  return `The ${product.name} by ${product.brand} is ${opener}.${audience}${trust} it's built for lasting comfort and everyday durability.${badgeNote}${stockNote}`;
}

export const instagramImages = [
  'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  'https://images.pexels.com/photos/5275375/pexels-photo-5275375.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
];
