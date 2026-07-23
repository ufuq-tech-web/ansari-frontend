"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Tag as TagIcon, Image as ImageIcon, Palette, Users, ImageOff, Upload, X } from "lucide-react";
import { adminApi } from "../../lib/admin-api";
import ImageCropModal from "../shared/ImageCropModal";
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
  gallery: string[];
  badge: string;
  stockQuantity: number;
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
  gallery: [],
  badge: "",
  stockQuantity: 50,
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
  const [brands, setBrands] = useState<{ name: string }[]>([]);
  const [values, setValues] = useState<ProductFormValues>(EMPTY);
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishSuccess = () => (onSuccess ? onSuccess() : router.push("/admin/products"));
  const finishCancel = () => (onCancel ? onCancel() : router.push("/admin/products"));

  useEffect(() => {
    adminApi.get<CategoryOption[]>("/categories").then(setCategories);
    adminApi.get<{ name: string }[]>("/brands").then(setBrands);
  }, []);

  useEffect(() => {
    if (!productId) return;
    adminApi
      .get<any>(`/products/manage/${productId}`)
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
          gallery: p.gallery ?? [],
          badge: p.badge ?? "",
          stockQuantity: p.stockQuantity ?? 0,
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

  const [cropTarget, setCropTarget] = useState<{ src: string; field: "image" | "hoverImage" | "gallery" } | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "hoverImage" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setCropTarget({ src: reader.result as string, field });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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
      gallery: values.gallery,
      badge: values.badge || undefined,
      stockQuantity: Number(values.stockQuantity),
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
            <Select
              value={values.brandName}
              onChange={(v) => set("brandName", v)}
              placeholder="Select brand"
              options={brands.map((b) => ({ value: b.name, label: b.name }))}
            />
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
              options={[{ value: "", label: "None" }, ...(selectedCategory?.subcategories || []).map((s) => ({ value: s.name, label: s.name }))]}
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
            <label className={labelClass}>Stock Quantity</label>
            <input
              required
              type="number"
              min={0}
              value={values.stockQuantity}
              onChange={(e) => set("stockQuantity", Number(e.target.value))}
              className={inputClass}
            />
            <p className={`mt-1 text-xs font-poppins font-medium ${
              values.stockQuantity <= 0 ? "text-red-600" : values.stockQuantity <= 5 ? "text-amber-600" : "text-charcoal-400"
            }`}>
              {values.stockQuantity <= 0 ? "Out of stock" : values.stockQuantity <= 5 ? "Low stock" : "In stock"}
            </p>
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
        <SectionHeader icon={ImageIcon} title="Media" subtitle="Product photography (Upload directly or paste URL)" />
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Main Image</label>
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 rounded-xl border border-charcoal-200 bg-charcoal-50 overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                  {values.image ? (
                    <img src={values.image} alt="Main" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-6 h-6 text-charcoal-300" strokeWidth={1.5} />
                  )}
                  <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} disabled={uploading} />
                  </label>
                </div>
                <div className="flex-1">
                  <input value={values.image} onChange={(e) => set("image", e.target.value)} className={inputClass} placeholder="Or paste image URL" />
                </div>
              </div>
            </div>
            
            <div>
              <label className={labelClass}>Hover Image</label>
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 rounded-xl border border-charcoal-200 bg-charcoal-50 overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                  {values.hoverImage ? (
                    <img src={values.hoverImage} alt="Hover" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-6 h-6 text-charcoal-300" strokeWidth={1.5} />
                  )}
                  <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "hoverImage")} disabled={uploading} />
                  </label>
                </div>
                <div className="flex-1">
                  <input value={values.hoverImage} onChange={(e) => set("hoverImage", e.target.value)} className={inputClass} placeholder="Or paste hover URL" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className={labelClass}>Gallery Images (Multiple Views)</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {values.gallery.map((url, i) => (
                <div key={i} className="w-24 h-24 rounded-xl border border-charcoal-200 relative group overflow-hidden">
                  <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setValues(v => ({ ...v, gallery: v.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 md:group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-charcoal-200 hover:border-brand-orange bg-charcoal-50/50 hover:bg-brand-orange/5 flex flex-col items-center justify-center cursor-pointer transition-colors text-charcoal-400 hover:text-brand-orange ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-poppins font-medium uppercase tracking-wider text-center px-2 leading-tight">{uploading ? "Uploading..." : "Add Image"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "gallery")} disabled={uploading} />
              </label>
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
        <button type="submit" disabled={saving || uploading} className="bg-brand-orange text-white font-poppins font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50">
          {saving ? "Saving…" : productId ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={finishCancel} className="text-charcoal-600 font-poppins font-semibold px-6 py-2.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 transition-colors">
          Cancel
        </button>
      </div>

      {cropTarget && (
        <ImageCropModal 
          imageSrc={cropTarget.src}
          onClose={() => setCropTarget(null)}
          aspectRatio={4/5}
          onCropped={(url) => {
            if (cropTarget.field === "gallery") {
              setValues(v => ({ ...v, gallery: [...v.gallery, url] }));
            } else {
              set(cropTarget.field, url);
            }
            setCropTarget(null);
          }}
        />
      )}
    </form>
  );
}
