"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Tag as TagIcon, Image as ImageIcon, Palette, Users, ImageOff } from "lucide-react";
import { adminApi } from "../../lib/admin-api";
import Select from "./Select";

interface CategoryOption {
  key: string;
  name: string;
  subcategories: { name: string }[];
}

export interface ProductFormValues {
  name: string;
  sku: string;
  brandName: string;
  categoryKey: string;
  subcategoryName: string;
  price: number;
  salePrice: number;
  image: string;
  hoverImage: string;
  badge: string;
  stock: string;
  isNew: boolean;
  colors: string;
  sizes: string;
  gender: string;
  ageGroup: string;
}

const EMPTY: ProductFormValues = {
  name: "",
  sku: "",
  brandName: "",
  categoryKey: "",
  subcategoryName: "",
  price: 0,
  salePrice: 0,
  image: "",
  hoverImage: "",
  badge: "",
  stock: "IN_STOCK",
  isNew: false,
  colors: "",
  sizes: "",
  gender: "",
  ageGroup: "",
};

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange transition-colors";
const labelClass = "text-sm font-poppins font-medium text-charcoal-700 block mb-1.5";

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4.5 h-4.5 text-brand-orange" strokeWidth={2} />
      </div>
      <div>
        <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">{title}</h3>
        <p className="text-xs text-charcoal-400 font-inter">{subtitle}</p>
      </div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl border border-charcoal-200 p-5">{children}</div>;
}

export default function ProductForm({ productId, onSuccess, onCancel }: { productId?: string; onSuccess?: () => void; onCancel?: () => void }) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [values, setValues] = useState<ProductFormValues>(EMPTY);
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const finishSuccess = () => (onSuccess ? onSuccess() : router.push("/admin/products"));
  const finishCancel = () => (onCancel ? onCancel() : router.push("/admin/products"));

  useEffect(() => {
    adminApi.get<CategoryOption[]>("/categories").then(setCategories);
  }, []);

  useEffect(() => {
    if (!productId) return;
    adminApi
      .get<any>(`/products/${productId}`)
      .then((p) =>
        setValues({
          name: p.name,
          sku: p.sku ?? "",
          brandName: p.brand.name,
          categoryKey: p.category.key,
          subcategoryName: p.subcategory?.name ?? "",
          price: p.price,
          salePrice: p.salePrice,
          image: p.image,
          hoverImage: p.hoverImage,
          badge: p.badge ?? "",
          stock: p.stock,
          isNew: p.isNew,
          colors: (p.colors ?? []).join(", "),
          sizes: (p.sizes ?? []).join(", "),
          gender: p.gender ?? "",
          ageGroup: p.ageGroup ?? "",
        }),
      )
      .finally(() => setLoading(false));
  }, [productId]);

  const selectedCategory = categories.find((c) => c.key === values.categoryKey);
  const discount = values.price > values.salePrice && values.price > 0 ? Math.round(((values.price - values.salePrice) / values.price) * 100) : 0;

  const set = <K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) => setValues((v) => ({ ...v, [key]: val }));

  useEffect(() => setImageError(false), [values.image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.categoryKey) {
      setError("Please select a category");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      name: values.name,
      sku: values.sku || undefined,
      brandName: values.brandName,
      categoryKey: values.categoryKey,
      subcategoryName: values.subcategoryName || undefined,
      price: Number(values.price),
      salePrice: Number(values.salePrice),
      image: values.image,
      hoverImage: values.hoverImage || values.image,
      badge: values.badge || undefined,
      stock: values.stock,
      isNew: values.isNew,
      colors: values.colors ? values.colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
      sizes: values.sizes ? values.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      gender: values.gender || undefined,
      ageGroup: values.ageGroup || undefined,
    };

    try {
      if (productId) {
        await adminApi.patch(`/products/${productId}`, payload);
      } else {
        await adminApi.post("/products", payload);
      }
      finishSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
      setSaving(false);
    }
  };

  if (loading) return <p className="text-charcoal-400 font-inter py-8 text-center">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Section>
        <SectionHeader icon={Info} title="Basic Info" subtitle="Name, brand, and category placement" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Product Name</label>
            <input required value={values.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="e.g. Men's Leather Derby Shoes" />
          </div>
          <div>
            <label className={labelClass}>SKU (Stock Keeping Unit)</label>
            <input value={values.sku} onChange={(e) => set("sku", e.target.value)} className={inputClass} placeholder="e.g. OX-100" />
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input required value={values.brandName} onChange={(e) => set("brandName", e.target.value)} className={inputClass} placeholder="e.g. Heritage" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <Select
              value={values.categoryKey}
              onChange={(v) => { set("categoryKey", v); set("subcategoryName", ""); }}
              placeholder="Select category"
              options={categories.map((c) => ({ value: c.key, label: c.name }))}
            />
          </div>
          <div>
            <label className={labelClass}>Subcategory</label>
            <Select
              value={values.subcategoryName}
              onChange={(v) => set("subcategoryName", v)}
              disabled={!selectedCategory}
              options={[{ value: "", label: "None" }, ...(selectedCategory?.subcategories.map((s) => ({ value: s.name, label: s.name })) ?? [])]}
            />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader icon={TagIcon} title="Pricing & Stock" subtitle="What shoppers pay and availability" />
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input required type="number" min={0} value={values.price} onChange={(e) => set("price", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sale Price (₹)</label>
            <input required type="number" min={0} value={values.salePrice} onChange={(e) => set("salePrice", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Discount</label>
            <div className={`${inputClass} flex items-center bg-charcoal-50 text-charcoal-500`}>
              {discount > 0 ? `${discount}% off` : "No discount"}
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelClass}>Stock</label>
            <Select
              value={values.stock}
              onChange={(v) => set("stock", v)}
              options={[
                { value: "IN_STOCK", label: "In Stock" },
                { value: "LOW_STOCK", label: "Low Stock" },
                { value: "OUT_OF_STOCK", label: "Out of Stock" },
              ]}
            />
          </div>
          <div>
            <label className={labelClass}>Badge</label>
            <input value={values.badge} onChange={(e) => set("badge", e.target.value)} className={inputClass} placeholder="e.g. Bestseller, New" />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm font-inter text-charcoal-700 cursor-pointer">
              <input type="checkbox" checked={values.isNew} onChange={(e) => set("isNew", e.target.checked)} className="w-4 h-4 accent-brand-orange" />
              Mark as New Arrival
            </label>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader icon={ImageIcon} title="Media" subtitle="Product photography" />
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-start">
          <div>
            <label className={labelClass}>Image URL</label>
            <input required value={values.image} onChange={(e) => set("image", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hover Image URL</label>
            <input value={values.hoverImage} onChange={(e) => set("hoverImage", e.target.value)} className={inputClass} placeholder="Same as image if blank" />
          </div>
          <div>
            <label className={labelClass}>Preview</label>
            <div className="w-16 h-16 rounded-xl border border-charcoal-200 bg-charcoal-50 overflow-hidden flex items-center justify-center">
              {values.image && !imageError ? (
                <img src={values.image} alt="" className="w-full h-full object-cover" onError={() => setImageError(true)} />
              ) : (
                <ImageOff className="w-5 h-5 text-charcoal-300" strokeWidth={1.5} />
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader icon={Palette} title="Variants" subtitle="Available colors and sizes" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Colors (comma-separated hex)</label>
            <input value={values.colors} onChange={(e) => set("colors", e.target.value)} className={inputClass} placeholder="#000000, #92400E" />
            {values.colors && (
              <div className="flex gap-1.5 mt-2">
                {values.colors.split(",").map((c) => c.trim()).filter(Boolean).map((c) => (
                  <span key={c} className="w-5 h-5 rounded-full border border-charcoal-200" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Sizes (comma-separated)</label>
            <input value={values.sizes} onChange={(e) => set("sizes", e.target.value)} className={inputClass} placeholder="6, 7, 8, 9" />
          </div>
        </div>
      </Section>

      {values.categoryKey === "kids" && (
        <Section>
          <SectionHeader icon={Users} title="Kids Specifics" subtitle="Gender and age group targeting" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Gender</label>
              <Select
                value={values.gender}
                onChange={(v) => set("gender", v)}
                options={[
                  { value: "", label: "Unspecified" },
                  { value: "BOYS", label: "Boys" },
                  { value: "GIRLS", label: "Girls" },
                  { value: "UNISEX", label: "Unisex" },
                ]}
              />
            </div>
            <div>
              <label className={labelClass}>Age Group</label>
              <Select
                value={values.ageGroup}
                onChange={(v) => set("ageGroup", v)}
                options={[
                  { value: "", label: "Unspecified" },
                  { value: "AGE_2_5", label: "2-5 Years" },
                  { value: "AGE_6_9", label: "6-9 Years" },
                  { value: "AGE_10_14", label: "10-14 Years" },
                ]}
              />
            </div>
          </div>
        </Section>
      )}

      {error && <p className="text-sm text-red-600 font-inter">{error}</p>}

      <div className="flex gap-3 pt-1 sticky bottom-0 bg-brand-ivory/95 backdrop-blur -mx-1 px-1 py-3 sm:static sm:bg-transparent sm:backdrop-blur-none sm:p-0">
        <button type="submit" disabled={saving} className="bg-brand-orange text-white font-poppins font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50">
          {saving ? "Saving…" : productId ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={finishCancel} className="text-charcoal-600 font-poppins font-semibold px-6 py-2.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
