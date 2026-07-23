"use client";

import { useEffect, useState, useRef } from "react";
import { X, Plus, Trash2, Info, Layers, Pencil, ImagePlus } from "lucide-react";
import { adminApi } from "../../lib/admin-api";
import ImageCropModal from "../shared/ImageCropModal";

interface Subcategory {
  id: string;
  name: string;
  image: string;
  count: string;
}

interface CategoryDetail {
  key: string;
  name: string;
  description: string;
  heroImage: string;
  subcategories: Subcategory[];
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
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

interface Props {
  categoryKey: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function CategoryModal({ categoryKey, onClose, onSaved }: Props) {
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [newSub, setNewSub] = useState({ name: "", image: "", count: "" });
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropImageSrc(url);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const load = () => adminApi.get<CategoryDetail>(`/categories/manage/${categoryKey}`).then(setCategory);

  useEffect(() => {
    load();
    setEditingSubId(null);
    setNewSub({ name: "", image: "", count: "" });
  }, [categoryKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setSaving(true);
    setError(null);
    try {
      await adminApi.patch(`/categories/${category.key}`, {
        name: category.name,
        description: category.description,
        heroImage: category.heroImage,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
      setSaving(false);
    }
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubId) {
      await adminApi.patch(`/categories/subcategories/${editingSubId}`, newSub);
      setEditingSubId(null);
    } else {
      await adminApi.post(`/categories/${categoryKey}/subcategories`, newSub);
    }
    setNewSub({ name: "", image: "", count: "" });
    load();
  };

  const handleStartEdit = (s: Subcategory) => {
    setEditingSubId(s.id);
    setNewSub({ name: s.name, image: s.image, count: s.count });
  };

  const handleCancelEdit = () => {
    setEditingSubId(null);
    setNewSub({ name: "", image: "", count: "" });
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;
    await adminApi.delete(`/categories/subcategories/${id}`);
    if (editingSubId === id) {
      handleCancelEdit();
    }
    load();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Manage category">
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-brand-ivory rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200 bg-white rounded-t-3xl flex-shrink-0">
          <div>
            <h2 className="font-poppins font-bold text-charcoal-900 text-lg">Manage Category</h2>
            <p className="text-xs text-charcoal-400 font-inter mt-0.5">{category?.name ?? "Loading…"}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-charcoal-100 hover:bg-charcoal-200 flex items-center justify-center text-charcoal-600 transition-colors flex-shrink-0" aria-label="Close">
            <X className="w-4.5 h-4.5" strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {!category ? (
            <p className="text-charcoal-400 font-inter py-8 text-center">Loading…</p>
          ) : (
            <div className="flex flex-col gap-5">
              <form onSubmit={handleSaveCategory}>
                <Section>
                  <SectionHeader icon={Info} title="Category Details" subtitle="Name, description, and hero image" />
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className={labelClass}>Name</label>
                      <input value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <input value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Hero Image URL</label>
                      <div className="flex gap-4 items-start mt-2">
                        {category.heroImage && (
                          <img src={category.heroImage} alt="Banner" className="w-32 h-12 rounded-lg bg-charcoal-100 object-cover border border-charcoal-200 flex-shrink-0" />
                        )}
                        <div className="flex flex-col gap-2 flex-1">
                          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 px-4 py-2 w-full lg:w-auto bg-charcoal-50 hover:bg-charcoal-100 border border-charcoal-200 rounded-lg text-sm font-poppins font-semibold text-charcoal-700 transition-colors">
                            <ImagePlus className="w-4 h-4" /> {category.heroImage ? "Change Image" : "Upload Image"}
                          </button>
                          <input value={category.heroImage} onChange={(e) => setCategory({ ...category, heroImage: e.target.value })} placeholder="Or paste image URL directly..." className={inputClass} />
                        </div>
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-600 font-inter">{error}</p>}
                    <button type="submit" disabled={saving} className="self-start bg-brand-orange text-white font-poppins font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50">
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </Section>
              </form>

            </div>
          )}
        </div>
      </div>
      
      {cropImageSrc && (
        <ImageCropModal 
          imageSrc={cropImageSrc}
          onClose={() => setCropImageSrc(null)}
          aspectRatio={21/9}
          onCropped={(url) => {
            if (category) setCategory({ ...category, heroImage: url });
            setCropImageSrc(null);
          }}
        />
      )}
    </div>
  );
}
