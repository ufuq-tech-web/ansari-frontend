"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, ImageOff } from "lucide-react";
import { adminApi } from "../../lib/admin-api";
import ImageCropModal from "../shared/ImageCropModal";

interface CategoryOption {
  key: string;
  name: string;
}

interface SubcategoryData {
  id?: string;
  name: string;
  image: string;
  categoryId?: string; // Required for create
  category?: CategoryOption; // Exists on edit
}

interface Props {
  subcategoryId?: string;
  initialData?: SubcategoryData;
  onClose: () => void;
  onSaved: () => void;
}

export default function SubcategoryModal({ subcategoryId, initialData, onClose, onSaved }: Props) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [formData, setFormData] = useState<SubcategoryData>({
    name: initialData?.name || "",
    image: initialData?.image || "",
    categoryId: initialData?.category?.key || "",
  });
  const [saving, setSaving] = useState(false);
  
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi.get<CategoryOption[]>("/categories/manage").then(setCategories);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (subcategoryId) {
        // Update
        await adminApi.patch(`/categories/subcategories/${subcategoryId}`, {
          name: formData.name,
          image: formData.image,
        });
      } else {
        // Create
        if (!formData.categoryId) return alert("Please select a parent category.");
        await adminApi.post(`/categories/${formData.categoryId}/subcategories`, {
          name: formData.name,
          image: formData.image,
        });
      }
      onSaved();
    } catch {
      alert("Failed to save subcategory");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setCropImageSrc(reader.result as string);
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const inputClass = "w-full pl-3 pr-4 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-poppins font-bold text-lg">{subcategoryId ? "Edit Subcategory" : "New Subcategory"}</h2>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5 text-charcoal-500" /></button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          {!subcategoryId && (
            <div>
              <label className="block text-sm font-poppins font-medium text-charcoal-700 mb-1.5">Parent Category</label>
              <select 
                required 
                value={formData.categoryId} 
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={inputClass}
              >
                <option value="">Select Category...</option>
                {categories.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-poppins font-medium text-charcoal-700 mb-1.5">Name</label>
            <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <div className="mb-2">
              <label className="block text-sm font-poppins font-medium text-charcoal-700 mb-0.5">Thumbnail Image (1:1)</label>
              <p className="text-[11px] font-inter text-charcoal-500 leading-tight">This square image is used for the "Shop by Style" navigation tiles shown on the storefront category page.</p>
            </div>
            <div className="w-[160px] aspect-square bg-charcoal-50 border border-charcoal-200 rounded-xl mb-3 overflow-hidden relative group flex items-center justify-center">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center flex flex-col items-center opacity-50 px-4">
                   <ImageOff className="w-6 h-6 mb-2 text-charcoal-400" />
                   <p className="text-[10px] font-inter text-charcoal-500">No image</p>
                </div>
              )}
              
              <label className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300">
                <Upload className="w-5 h-5 text-white mb-2" />
                <span className="text-white text-[10px] font-semibold font-poppins text-center px-2">{uploading ? "Uploading..." : "Upload Image"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} disabled={uploading} />
              </label>
            </div>
            <input required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className={inputClass} placeholder="Or paste image URL" />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-brand-orange text-white py-3 rounded-xl font-poppins font-semibold disabled:opacity-50 mt-4">
            {saving ? "Saving..." : "Save Subcategory"}
          </button>
        </form>
      </div>

      {cropImageSrc && (
        <ImageCropModal 
          imageSrc={cropImageSrc}
          onClose={() => setCropImageSrc(null)}
          aspectRatio={1/1}
          onCropped={(url) => {
            setFormData({ ...formData, image: url });
            setCropImageSrc(null);
          }}
        />
      )}
    </div>
  );
}
