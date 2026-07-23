"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { adminApi } from "../../lib/admin-api";

interface BrandData {
  name: string;
  slug?: string;
}

interface Props {
  initialData?: BrandData;
  onClose: () => void;
  onSaved: () => void;
}

export default function BrandModal({ initialData, onClose, onSaved }: Props) {
  const [name, setName] = useState(initialData?.name || "");
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
      if (initialData?.slug) {
        await adminApi.patch(`/brands/${initialData.slug}`, { name });
      } else {
        await adminApi.post("/brands", { name });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save brand");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={initialData ? "Edit brand" : "Add brand"}>
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
          <h2 className="font-poppins font-bold text-charcoal-900 text-lg">{initialData ? "Edit Brand" : "Add Brand"}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-charcoal-100 hover:bg-charcoal-200 flex items-center justify-center text-charcoal-600 transition-colors" aria-label="Close">
            <X className="w-4.5 h-4.5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-poppins font-medium text-charcoal-700 block mb-1.5">Brand Name</label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Heritage"
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
            />
          </div>

          {error && <p className="text-sm text-red-600 font-inter">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 bg-brand-orange text-white font-poppins font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50">
              {saving ? "Saving…" : initialData ? "Update Brand" : "Create Brand"}
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
