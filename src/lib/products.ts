export type Product = {
  slug: string;
  name: string;
  category: "Men" | "Women" | "Kids" | "Sandals";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: "Sale" | "New" | "Bestseller";
  description: string;
  sizes: number[];
};

export const products: Product[] = [
  {
    slug: "trail-blazer-boot",
    name: "Trail Blazer Boot",
    category: "Men",
    price: 749,
    rating: 4.6,
    reviewCount: 214,
    inStock: true,
    badge: "Bestseller",
    description:
      "A rugged everyday boot built for monsoon roads and long shifts on your feet. Reinforced sole, water-resistant upper.",
    sizes: [6, 7, 8, 9, 10, 11],
  },
  {
    slug: "oxford-classic",
    name: "Oxford Classic",
    category: "Men",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    badge: "Sale",
    description:
      "A formal Oxford that goes from office to wedding season without complaint. Genuine leather upper, cushioned insole.",
    sizes: [6, 7, 8, 9, 10, 11],
  },
  {
    slug: "kids-school-shoe",
    name: "Kids School Shoe",
    category: "Kids",
    price: 499,
    rating: 4.8,
    reviewCount: 302,
    inStock: true,
    description:
      "Scuff-resistant, easy to clean, and built to survive an entire school term of playground use.",
    sizes: [1, 2, 3, 4, 5],
  },
  {
    slug: "everyday-sandal",
    name: "Everyday Sandal",
    category: "Sandals",
    price: 399,
    rating: 4.4,
    reviewCount: 97,
    inStock: true,
    description:
      "Lightweight, quick-drying and grippy — the sandal families reach for every single day.",
    sizes: [5, 6, 7, 8, 9, 10],
  },
  {
    slug: "heritage-loafer",
    name: "Heritage Loafer",
    category: "Women",
    price: 649,
    rating: 4.5,
    reviewCount: 132,
    inStock: true,
    description:
      "Soft leather loafer with a low block heel, comfortable enough for a full day of errands.",
    sizes: [4, 5, 6, 7, 8],
  },
  {
    slug: "monsoon-gumboot",
    name: "Monsoon Gumboot",
    category: "Kids",
    price: 349,
    rating: 4.3,
    reviewCount: 58,
    inStock: false,
    description:
      "Fully waterproof gumboot for the rainy season, easy pull-on design for smaller hands.",
    sizes: [1, 2, 3, 4],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
