"use client";

import { useState, useCallback } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import ProductModal from "../../../components/admin/ProductModal";
import Select from "../../../components/admin/Select";

import DataTable, { ColumnDef } from "../../../components/shared/DataTable";
import Pagination from "../../../components/shared/Pagination";
import SearchInput from "../../../components/shared/SearchInput";
import ConfirmModal from "../../../components/shared/ConfirmModal";

interface ProductRow {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  stock: string;
  brand: { name: string };
  category: { name: string };
  subcategory: { name: string } | null;
  isActive: boolean;
}

interface CategoryOption {
  key: string;
  name: string;
}

const STOCK_OPTIONS = [
  { value: "IN_STOCK", label: "In Stock" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
];

const PAGE_SIZE = 15;

const STOCK_STYLES: Record<string, string> = {
  IN_STOCK: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  LOW_STOCK: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  OUT_OF_STOCK: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState("");
  const [stock, setStock] = useState("");
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState<{ open: boolean; productId?: string }>({ open: false });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: "",
    name: "",
    action: "" as "delete" | "toggle",
    isCurrentlyActive: false,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => adminApi.get<CategoryOption[]>("/categories"),
    staleTime: 60 * 1000,
  });

  const { data, isLoading: loading, refetch } = useQuery({
    queryKey: ["adminProducts", searchQuery, categoryKey, stock, page],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (searchQuery) params.set("search", searchQuery);
      if (categoryKey) params.set("categoryKey", categoryKey);
      if (stock) params.set("stock", stock);
      return adminApi.get<{ items: ProductRow[]; total: number; totalPages: number }>(`/products/manage?${params.toString()}`);
    },
    placeholderData: keepPreviousData,
  });

  const items = data?.items || [];
  const total = data?.total || 0;

  const handleConfirmAction = async () => {
    const { id, action, isCurrentlyActive } = confirmModal;
    
    try {
      if (action === "delete") {
        await adminApi.delete(`/products/${id}`);
      } else if (action === "toggle") {
        await adminApi.patch(`/products/${id}`, { isActive: !isCurrentlyActive });
      }
      refetch();
    } catch {
      alert(`Failed to ${action} product`);
    }
  };

  const columns: ColumnDef<ProductRow>[] = [
    {
      key: 'product',
      label: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3.5">
          <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-charcoal-100 border border-charcoal-250/20 shadow-sm" />
          <div className="leading-snug">
            <div className="font-poppins font-bold text-charcoal-900 text-xs">{p.name}</div>
            <div className="text-[10px] text-charcoal-400 font-poppins font-bold tracking-wide uppercase mt-0.5">{p.brand.name}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (p) => (
        <span className="text-charcoal-600 font-inter text-xs">
          <span className="font-semibold text-charcoal-800">{p.category.name}</span>
          {p.subcategory ? <span className="text-charcoal-400"> / {p.subcategory.name}</span> : ""}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (p) => (
        <span className="font-manrope">
          <span className="font-extrabold text-charcoal-900 text-sm">₹{p.salePrice.toLocaleString("en-IN")}</span>
          {p.price > p.salePrice && <span className="text-charcoal-400 line-through ml-2 text-xs font-semibold">₹{p.price.toLocaleString("en-IN")}</span>}
        </span>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (p) => (
        <span className={`text-[10px] font-poppins font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${
          STOCK_STYLES[p.stock] ?? "bg-charcoal-100 text-charcoal-600 border-charcoal-200/30"
        }`}>
          {p.stock.replace("_", " ")}
        </span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (p) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold tracking-wide uppercase ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {p.isActive ? 'Active' : 'Blocked'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => setConfirmModal({ isOpen: true, id: p.id, name: p.name, action: "toggle", isCurrentlyActive: p.isActive })}
            className="p-2 text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 rounded-xl transition-all duration-200"
            title={p.isActive ? "Block" : "Unblock"}
          >
            {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setModalState({ open: true, productId: p.id })} 
            className="p-2 text-charcoal-400 hover:text-brand-orange hover:bg-brand-orange/5 rounded-xl transition-all duration-200" 
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4" strokeWidth={2} />
          </button>
          <button 
            onClick={() => setConfirmModal({ isOpen: true, id: p.id, name: p.name, action: "delete", isCurrentlyActive: false })}
            className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200" 
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight">Products</h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">Manage and edit your footwear catalog</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <form 
            onSubmit={(e) => { e.preventDefault(); setPage(1); setSearchQuery(search); }}
            className="w-full sm:w-64"
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search products…"
              className="w-full"
            />
          </form>
          <Select
            value={categoryKey}
            onChange={(v) => { setCategoryKey(v); setPage(1); }}
            options={[{ value: "", label: "All Categories" }, ...categories.map((c) => ({ value: c.key, label: c.name }))]}
            className="w-full sm:w-48"
          />
          <Select
            value={stock}
            onChange={(v) => { setStock(v); setPage(1); }}
            options={[{ value: "", label: "All Stock" }, ...STOCK_OPTIONS]}
            className="w-full sm:w-44"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row flex-shrink-0">
          <Link
            href="/admin/products/bulk"
            className="flex items-center gap-2 w-full sm:w-auto justify-center bg-charcoal-900 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-charcoal-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Bulk Upload
          </Link>
          <button
            onClick={() => setModalState({ open: true })}
            className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gradient-to-r from-brand-orange to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Product
          </button>
        </div>
      </div>

      <DataTable
        data={items}
        columns={columns}
        keyExtractor={(p) => p.id}
        isLoading={loading}
        emptyMessage="No products found."
      />

      {!loading && total > 0 && (
        <Pagination
          currentPage={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={(p) => setPage(p)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.action === 'delete' ? 'Delete Product' : confirmModal.isCurrentlyActive ? 'Block Product' : 'Unblock Product'}
        message={
          confirmModal.action === 'delete' 
            ? `Are you sure you want to delete "${confirmModal.name}"? This action cannot be undone.`
            : `Are you sure you want to ${confirmModal.isCurrentlyActive ? "block" : "unblock"} "${confirmModal.name}"?`
        }
        confirmText={confirmModal.action === 'delete' ? 'Delete' : confirmModal.isCurrentlyActive ? 'Block' : 'Unblock'}
        cancelText="Cancel"
        danger={confirmModal.action === 'delete' || confirmModal.isCurrentlyActive}
        onConfirm={handleConfirmAction}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {modalState.open && (
        <ProductModal
          productId={modalState.productId}
          onClose={() => setModalState({ open: false })}
          onSaved={() => {
            setModalState({ open: false });
            refetch();
          }}
        />
      )}
    </div>
  );
}
