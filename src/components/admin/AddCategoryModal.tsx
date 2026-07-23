"use client";

import { useEffect, useState, useRef } from "react";
import { X, Upload, ImageOff } from "lucide-react";
import { adminApi } from "../../lib/admin-api";
import ImageCropModal from "../shared/ImageCropModal";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
const labelClass = "text-sm font-poppins font-medium text-charcoal-700 block mb-1.5";

export default function AddCategoryModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState({ key: "", name: "", description: "", heroImage: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.key.trim()) errs.key = "Slug is required.";
    if (!form.name.trim()) errs.name = "Category name is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.heroImage.trim()) errs.heroImage = "Hero Image is required. Please upload or paste a URL.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropImageSrc(url);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    setGeneralError(null);
    try {
      await adminApi.post("/categories", form);
      onSaved();
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : "Failed to create category");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add category">
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200 flex-shrink-0">
          <div>
            <h2 className="font-poppins font-bold text-charcoal-900 text-lg">Add Category</h2>
            <p className="text-xs text-charcoal-400 font-inter mt-0.5">Create a new top-level category</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-charcoal-100 hover:bg-charcoal-200 flex items-center justify-center text-charcoal-600 transition-colors flex-shrink-0" aria-label="Close">
            <X className="w-4.5 h-4.5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Key (URL slug)</label>
              <input value={form.key} onChange={(e) => { setForm({ ...form, key: e.target.value }); setErrors({...errors, key: ""}) }} className={inputClass} placeholder="e.g. men" />
              {errors.key && <p className="text-xs text-red-500 font-inter mt-1.5">{errors.key}</p>}
            </div>
            <div>
              <label className={labelClass}>Display Name</label>
              <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({...errors, name: ""}) }} className={inputClass} placeholder="e.g. Men's Footwear" />
              {errors.name && <p className="text-xs text-red-500 font-inter mt-1.5">{errors.name}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input value={form.description} onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({...errors, description: ""}) }} className={inputClass} />
            {errors.description && <p className="text-xs text-red-500 font-inter mt-1.5">{errors.description}</p>}
          </div>
          <div>
            <label className={labelClass}>Hero Image</label>
            <div className="w-full aspect-[21/9] bg-charcoal-50 border border-charcoal-200 rounded-xl mb-3 overflow-hidden relative group flex items-center justify-center">
              {form.heroImage ? (
                <img src={form.heroImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center flex flex-col items-center opacity-50 px-4">
                   <ImageOff className="w-8 h-8 mb-2 text-charcoal-400" />
                   <p className="text-xs font-inter text-charcoal-500">No banner selected</p>
                </div>
              )}
              
              <label className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300">
                <Upload className="w-6 h-6 text-white mb-2" />
                <span className="text-white text-xs font-semibold font-poppins">{uploading ? "Uploading..." : "Click to Upload Image"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} disabled={uploading} />
              </label>
            </div>
            <input value={form.heroImage} onChange={(e) => { setForm({ ...form, heroImage: e.target.value }); setErrors({...errors, heroImage: ""}) }} className={inputClass} placeholder="Or paste image URL directly" />
            {errors.heroImage && <p className="text-xs text-red-500 font-inter mt-1.5">{errors.heroImage}</p>}
          </div>

          {generalError && <p className="text-sm text-red-600 font-inter bg-red-50 p-3 rounded-lg border border-red-100">{generalError}</p>}

          <div className="flex gap-3 pt-4 border-t border-charcoal-100">
            <button type="submit" disabled={saving || uploading} className="bg-brand-orange text-white font-poppins font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Create Category"}
            </button>
            <button type="button" onClick={onClose} disabled={saving} className="text-charcoal-600 font-poppins font-semibold px-6 py-2.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {cropImageSrc && (
        <ImageCropModal 
          imageSrc={cropImageSrc}
          onClose={() => setCropImageSrc(null)}
          aspectRatio={21/9}
          onCropped={(url) => {
            setForm({ ...form, heroImage: url });
            setErrors({...errors, heroImage: ""});
            setCropImageSrc(null);
          }}
        />
      )}
    </div>
  );
}
