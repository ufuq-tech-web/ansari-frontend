"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import GuideModal from "../../../components/admin/GuideModal";

interface GuideRow {
  slug: string;
  title: string;
  readTime: string;
  category: { name: string };
}

export default function AdminGuidesPage() {
  
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [modalState, setModalState] = useState<{ open: boolean; slug?: string }>({ open: false });

  const load = () => adminApi.get<GuideRow[]>("/guides").then(setGuides);

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete guide "${title}"?`)) return;
    await adminApi.delete(`/guides/${slug}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-charcoal-500 font-inter">Buying guide articles shown on category pages and /guides.</p>
        <button
          onClick={() => setModalState({ open: true })}
          className="flex items-center gap-1.5 bg-brand-orange text-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Add Guide
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200 divide-y divide-charcoal-100">
        {guides.map((g) => (
          <div key={g.slug} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <div className="font-poppins font-medium text-charcoal-900 text-sm">{g.title}</div>
              <div className="text-xs text-charcoal-400 font-inter">{g.category.name} · {g.readTime}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setModalState({ open: true, slug: g.slug })} className="p-1.5 text-charcoal-400 hover:text-brand-orange transition-colors" aria-label="Edit">
                <Pencil className="w-4 h-4" strokeWidth={2} />
              </button>
              <button onClick={() => handleDelete(g.slug, g.title)} className="p-1.5 text-charcoal-400 hover:text-red-600 transition-colors" aria-label="Delete">
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalState.open && (
        <GuideModal
          slug={modalState.slug}
          onClose={() => setModalState({ open: false })}
          onSaved={() => {
            setModalState({ open: false });
            load();
          }}
        />
      )}
    </div>
  );
}
