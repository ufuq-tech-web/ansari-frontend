"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Search, Tag } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import BrandModal from "../../../components/admin/BrandModal";

interface BrandRow {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const AVATAR_COLORS = [
  { bg: "bg-brand-orange/10", text: "text-brand-orange" },
  { bg: "bg-brand-green/10", text: "text-brand-green" },
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-leather-100", text: "text-leather-400" },
  { bg: "bg-purple-50", text: "text-purple-600" },
];

function avatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => adminApi.get<BrandRow[]>("/brands").then(setBrands);

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (slug: string, name: string, productCount: number) => {
    if (productCount > 0) {
      alert(`Can't delete "${name}" — ${productCount} product(s) still use this brand.`);
      return;
    }
    if (!confirm(`Delete brand "${name}"?`)) return;
    await adminApi.delete(`/brands/${slug}`);
    load();
  };

  const filtered = useMemo(
    () => (brands ?? []).filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [brands, search],
  );

  const totalProducts = useMemo(() => (brands ?? []).reduce((sum, b) => sum + b.productCount, 0), [brands]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card">
          <div className="font-poppins font-bold text-charcoal-900 text-2xl">{brands?.length ?? "—"}</div>
          <div className="text-sm text-charcoal-500 font-inter mt-1">Total Brands</div>
        </div>
        <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card">
          <div className="font-poppins font-bold text-charcoal-900 text-2xl">{brands ? totalProducts : "—"}</div>
          <div className="text-sm text-charcoal-500 font-inter mt-1">Products Across Brands</div>
        </div>
        <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card hidden sm:block">
          <div className="font-poppins font-bold text-charcoal-900 text-2xl">
            {brands?.length ? Math.round(totalProducts / brands.length) : "—"}
          </div>
          <div className="text-sm text-charcoal-500 font-inter mt-1">Avg. Products / Brand</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter focus:outline-none focus:border-brand-orange"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-brand-orange text-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Add Brand
        </button>
      </div>

      {brands === null ? (
        <p className="text-charcoal-400 font-inter py-8 text-center">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-charcoal-200 py-12 flex flex-col items-center gap-2">
          <Tag className="w-8 h-8 text-charcoal-300" strokeWidth={1.5} />
          <p className="text-charcoal-400 font-inter text-sm">{search ? "No brands match your search" : "No brands yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((b) => {
            const avatar = avatarStyle(b.name);
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card hover:shadow-card-hover hover:border-brand-orange/30 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl ${avatar.bg} flex items-center justify-center font-poppins font-bold text-lg ${avatar.text}`}>
                    {b.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleDelete(b.slug, b.name, b.productCount)}
                    className="p-1.5 text-charcoal-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`Delete ${b.name}`}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                <div className="font-poppins font-semibold text-charcoal-900 text-sm truncate">{b.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-charcoal-400 font-inter">{b.productCount} product{b.productCount === 1 ? "" : "s"}</span>
                  {b.productCount === 0 && (
                    <span className="text-[10px] font-poppins font-semibold px-1.5 py-0.5 rounded-full bg-charcoal-100 text-charcoal-500">Unused</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <BrandModal
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}
