"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { adminApi } from "../../lib/admin-api";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
const labelClass = "text-sm font-poppins font-medium text-charcoal-700 block mb-1.5";

export default function AddCategoryModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState({ key: "", name: "", description: "", heroImage: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.post("/categories", form);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
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
              <input required value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className={inputClass} placeholder="e.g. men" />
            </div>
            <div>
              <label className={labelClass}>Display Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Men's Footwear" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hero Image URL</label>
            <input required value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-600 font-inter">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="bg-brand-orange text-white font-poppins font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Create Category"}
            </button>
            <button type="button" onClick={onClose} className="text-charcoal-600 font-poppins font-semibold px-6 py-2.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
