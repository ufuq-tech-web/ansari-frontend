import type { Product, ProductWithCategory, CategoryConfig, Review, BuyingGuideWithCategory } from './catalog-helpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export { slugify } from './catalog-helpers';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function isNotFound(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}

async function apiFetch<T>(path: string, options: RequestInit & { next?: NextFetchRequestConfig } = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    // Cache storefront reads for 60s so catalog pages are served from
    // Next's data cache instead of hitting the backend on every request.
    // Callers can still override via options.next / options.cache.
    next: { revalidate: 60 },
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message ?? "Request failed");
  }

  return res.json();
}

export function mapProduct(p: any): ProductWithCategory {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand?.name || p.brand || "",
    price: p.price,
    salePrice: p.salePrice,
    rating: p.rating,
    reviews: p.reviewsCount,
    image: p.image,
    hoverImage: p.hoverImage || p.image,
    gallery: p.gallery ?? [],
    badge: p.badge || undefined,
    subcategory: p.subcategory?.name || p.subcategory || "",
    category: (p.category?.key || p.category || "") as ProductWithCategory['category'],
    stock: p.stock ? (p.stock.toLowerCase() as any) : 'in_stock',
    isNew: p.isNew ?? false,
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    gender: p.gender ? (p.gender.toLowerCase() as any) : undefined,
    ageGroup: p.ageGroup ? (p.ageGroup.replace('AGE_', '').replace('_', '-') as any) : undefined,
    material: p.material || undefined,
    occasion: p.occasion || undefined,
    soleMaterial: p.soleMaterial || undefined,
    closureType: p.closureType || undefined,
    heelHeight: p.heelHeight || undefined,
    toeShape: p.toeShape || undefined,
    isActive: p.isActive ?? true,
  };
}

function mapGuide(g: any): BuyingGuideWithCategory {
  return {
    id: g.id,
    slug: g.slug,
    title: g.title,
    description: g.description,
    readTime: g.readTime,
    content: g.content,
    categoryKey: g.category?.key || "",
    categoryName: g.category?.name || "",
  };
}

export const storefrontApi = {
  async getCategories(): Promise<{ key: string; name: string; heroImage: string; description: string; subcategories: { name: string; slug: string }[] }[]> {
    try {
      const list = await apiFetch<any[]>('/categories');
      return list.map((c) => ({ key: c.key, name: c.name, heroImage: c.heroImage, description: c.description, subcategories: c.subcategories || [] }));
    } catch (err) {
      console.error("Error loading categories:", err);
      return [];
    }
  },

  async getCategory(key: string): Promise<CategoryConfig | null> {
    try {
      const [category, productsRes, allCategories] = await Promise.all([
        apiFetch<any>(`/categories/${key}`),
        apiFetch<any>(`/products?categoryKey=${key}&limit=100`),
        this.getCategories(),
      ]);

      if (!category) return null;

      const relatedCategories = allCategories
        .filter((c) => c.key !== key)
        .map((c) => ({ key: c.key, name: c.name, image: c.heroImage }));

      return {
        key: category.key,
        name: category.name,
        description: category.description,
        heroImage: category.heroImage,
        totalProducts: category.totalProducts,
        subcategories: category.subcategories || [],
        buyingGuides: (category.buyingGuides || []).map((g: any) => ({
          id: g.id,
          slug: g.slug,
          title: g.title,
          description: g.description,
          readTime: g.readTime,
          content: g.content,
          categoryKey: category.key,
          categoryName: category.name,
        })),
        faqs: category.faqs || [],
        products: (productsRes.items || []).map(mapProduct),
        relatedCategories,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
      };
    } catch (err) {
      if (!isNotFound(err)) console.error(`Error loading category ${key}:`, err);
      return null;
    }
  },

  async getProducts(query: Record<string, any> = {}): Promise<{ items: ProductWithCategory[]; total: number }> {
    try {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v != null) params.set(k, String(v));
      }
      const qs = params.toString();
      const res = await apiFetch<any>(`/products?${qs}`);
      return {
        items: (res.items || []).map(mapProduct),
        total: res.total || 0,
      };
    } catch (err) {
      console.error("Error loading products:", err);
      return { items: [], total: 0 };
    }
  },

  async getProductBySlug(categoryKey: string, subcategorySlug: string, productSlug: string): Promise<ProductWithCategory | null> {
    try {
      const p = await apiFetch<any>(`/products/by-slug/${categoryKey}/${subcategorySlug}/${productSlug}`);
      return p ? mapProduct(p) : null;
    } catch (err) {
      if (!isNotFound(err)) console.error("Error loading product by slug:", err);
      return null;
    }
  },

  async getProductById(id: string): Promise<ProductWithCategory | null> {
    try {
      const p = await apiFetch<any>(`/products/${id}`);
      return p ? mapProduct(p) : null;
    } catch (err) {
      if (!isNotFound(err)) console.error("Error loading product by ID:", err);
      return null;
    }
  },

  async getGuides(): Promise<BuyingGuideWithCategory[]> {
    try {
      const list = await apiFetch<any[]>('/guides');
      return list.map(mapGuide);
    } catch (err) {
      console.error("Error loading guides:", err);
      return [];
    }
  },

  async getGuideBySlug(slug: string): Promise<BuyingGuideWithCategory | null> {
    try {
      const g = await apiFetch<any>(`/guides/${slug}`);
      return g ? mapGuide(g) : null;
    } catch (err) {
      if (!isNotFound(err)) console.error(`Error loading guide ${slug}:`, err);
      return null;
    }
  },

  async getReviews(): Promise<Review[]> {
    try {
      return await apiFetch<Review[]>('/reviews');
    } catch (err) {
      console.error("Error loading reviews:", err);
      return [];
    }
  },

  async getBrands(): Promise<{ id: string; name: string; slug: string; productCount: number }[]> {
    try {
      return await apiFetch<any[]>('/brands');
    } catch (err) {
      console.error("Error loading brands:", err);
      return [];
    }
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      return await apiFetch<BlogPost[]>('/blog');
    } catch (err) {
      console.error("Error loading blog posts:", err);
      return [];
    }
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      return await apiFetch<BlogPost>(`/blog/${slug}`);
    } catch (err) {
      if (!isNotFound(err)) console.error(`Error loading blog post ${slug}:`, err);
      return null;
    }
  },

  // Public — no auth required, works for guests and logged-in users alike.
  // Always called client-side (form submit), so Next's server-fetch cache
  // options don't apply here regardless.
  subscribeToNewsletter(email: string): Promise<{ alreadySubscribed: boolean; couponCode: string }> {
    return apiFetch('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  author: string;
  createdAt: string;
}

export type { Product, ProductWithCategory, CategoryConfig, Review, BuyingGuideWithCategory };
