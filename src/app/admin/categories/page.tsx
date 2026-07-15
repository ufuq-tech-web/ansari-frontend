"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import CategoryModal from "../../../components/admin/CategoryModal";
import AddCategoryModal from "../../../components/admin/AddCategoryModal";

interface CategoryRow {
  key: string;
  name: string;
  description: string;
  heroImage: string;
  subcategories: unknown[];
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [managingKey, setManagingKey] = useState<string | null>(null);

  const load = () => adminApi.get<CategoryRow[]>("/categories").then(setCategories);

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-charcoal-500 font-inter">Manage top-level categories and their subcategories.</p>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 bg-brand-orange text-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setManagingKey(c.key)}
            className="text-left bg-white rounded-2xl border border-charcoal-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
          >
            <div className="aspect-[16/9] bg-charcoal-100">
              <img src={c.heroImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-poppins font-semibold text-charcoal-900">{c.name}</h3>
              <p className="text-xs text-charcoal-400 font-inter mt-0.5">{c.subcategories.length} subcategories · {c._count.products} products</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-brand-orange font-poppins font-semibold group-hover:gap-1.5 transition-all">
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {managingKey && (
        <CategoryModal
          categoryKey={managingKey}
          onClose={() => setManagingKey(null)}
          onSaved={() => {
            setManagingKey(null);
            load();
          }}
        />
      )}

      {showNew && (
        <AddCategoryModal
          onClose={() => setShowNew(false)}
          onSaved={() => {
            setShowNew(false);
            load();
          }}
        />
      )}
    </div>
  );
}
