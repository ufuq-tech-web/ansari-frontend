"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import BrandModal from "../../../components/admin/BrandModal";
import DataTable, { ColumnDef } from "../../../components/shared/DataTable";
import Pagination from "../../../components/shared/Pagination";
import SearchInput from "../../../components/shared/SearchInput";
import ConfirmModal from "../../../components/shared/ConfirmModal";

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
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const [modalState, setModalState] = useState<{ open: boolean; brand?: BrandRow }>({ open: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, slug: "", name: "" });

  const load = () => adminApi.get<BrandRow[]>(`/brands${debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : ""}`).then(setBrands);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    load();
  }, [debouncedSearch]);

  const handleDelete = async () => {
    try {
      await adminApi.delete(`/brands/${confirmModal.slug}`);
      load();
    } catch {
      alert("Failed to delete brand");
    }
  };

  const paginated = brands.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch]);

  const totalProducts = useMemo(() => brands.reduce((sum, b) => sum + b.productCount, 0), [brands]);

  const columns: ColumnDef<BrandRow>[] = [
    {
      key: 'avatar',
      label: 'Brand',
      render: (b) => {
        const avatar = avatarStyle(b.name);
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${avatar.bg} flex items-center justify-center font-poppins font-bold text-base ${avatar.text}`}>
              {b.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-poppins font-semibold text-charcoal-900">{b.name}</span>
          </div>
        );
      }
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (b) => <span className="font-inter text-sm text-charcoal-900 font-medium">{b.slug}</span>
    },
    {
      key: 'products',
      label: 'Linked Products',
      render: (b) => (
        <div className="flex items-center gap-2">
          <span className="font-inter font-medium text-charcoal-700">{b.productCount}</span>
          {b.productCount === 0 && (
            <span className="text-[10px] font-poppins font-semibold px-2 py-0.5 rounded-full bg-charcoal-100 text-charcoal-500 uppercase tracking-wider">Unused</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (b) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setModalState({ open: true, brand: b })}
            className="p-2 text-charcoal-400 hover:text-brand-orange hover:bg-brand-orange/5 rounded-lg transition-colors"
            title="Edit Brand"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button
            onClick={() => {
              if (b.productCount > 0) {
                alert(`Cannot delete "${b.name}" as it has ${b.productCount} linked product(s). Please remove them first.`);
                return;
              }
              setConfirmModal({ isOpen: true, slug: b.slug, name: b.name });
            }}
            className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={b.productCount > 0 ? "Cannot delete brand in use" : "Delete Brand"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight">Brands</h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">Manage global product brands</p>
        </div>
        <button
          onClick={() => setModalState({ open: true })}
          className="flex w-full sm:w-auto flex-shrink-0 items-center justify-center gap-1.5 bg-brand-orange text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Brand
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-xs text-charcoal-500 font-poppins font-semibold uppercase tracking-wider mb-2">Total Brands</div>
          <div className="font-poppins font-black text-brand-orange text-3xl">{brands.length || "—"}</div>
        </div>
        <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-xs text-charcoal-500 font-poppins font-semibold uppercase tracking-wider mb-2">Linked Products</div>
          <div className="font-poppins font-black text-brand-green text-3xl">{brands.length ? totalProducts : "—"}</div>
        </div>
        <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-sm hover:shadow-md transition-shadow hidden md:block">
          <div className="text-xs text-charcoal-500 font-poppins font-semibold uppercase tracking-wider mb-2">Avg per Brand</div>
          <div className="font-poppins font-black text-blue-600 text-3xl">
            {brands.length ? Math.round(totalProducts / brands.length) : "—"}
          </div>
        </div>
      </div>

      <div className="w-full bg-white p-4 rounded-t-2xl border-x border-t border-charcoal-200">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search brands..." 
          className="w-full sm:max-w-md"
        />
      </div>

      <DataTable 
        data={paginated} 
        columns={columns} 
        keyExtractor={(b) => b.id} 
        emptyMessage="No brands found."
      />

      <Pagination 
        currentPage={currentPage}
        totalItems={brands.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Brand"
        message={`Are you sure you want to delete "${confirmModal.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDelete}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {modalState.open && (
        <BrandModal
          initialData={modalState.brand}
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
