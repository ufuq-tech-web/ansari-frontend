"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Boxes, Loader2, CheckCircle2 } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import Select from "../../../components/admin/Select";

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

export default function AdminInventoryPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [search, setSearch] = useState("");
  const [categoryKey, setCategoryKey] = useState("");
  const [stock, setStock] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    adminApi.get<CategoryOption[]>("/categories").then(setCategories);
  }, []);

  const load = useCallback(async (q: string, cat: string, st: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
    if (q) params.set("search", q);
    if (cat) params.set("categoryKey", cat);
    if (st) params.set("stock", st);
    const res = await adminApi.get<{ items: ProductRow[]; total: number; totalPages: number }>(`/products?${params.toString()}`);
    setItems(res.items);
    setTotal(res.total);
    setTotalPages(res.totalPages || 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(search, categoryKey, stock, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey, stock, page]);

  const handleStockChange = async (productId: string, newStock: string) => {
    setUpdatingId(productId);
    try {
      await adminApi.patch(`/products/${productId}`, { stock: newStock });
      setItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, stock: newStock } : item))
      );
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to update stock status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
          <Boxes className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
          Inventory Management
        </h2>
        <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
          Quickly monitor and adjust stock levels across all products
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" strokeWidth={2.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), load(search, categoryKey, stock, 1))}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all"
          />
        </div>
        <Select
          value={categoryKey}
          onChange={(v) => { setCategoryKey(v); setPage(1); }}
          options={[{ value: "", label: "All Categories" }, ...categories.map((c) => ({ value: c.key, label: c.name }))]}
          className="w-full sm:w-48"
        />
        <Select
          value={stock}
          onChange={(v) => { setStock(v); setPage(1); }}
          options={[
            { value: "", label: "All Stock Levels" },
            { value: "IN_STOCK", label: "In Stock" },
            { value: "LOW_STOCK", label: "Low Stock" },
            { value: "OUT_OF_STOCK", label: "Out of Stock" },
          ]}
          className="w-full sm:w-48"
        />
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-50/70 border-b border-charcoal-200/30 text-charcoal-400 font-poppins font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Pricing</th>
                <th className="text-left px-6 py-4 w-64">Stock Status</th>
                <th className="text-center px-6 py-4 w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-charcoal-400 font-inter">Loading inventory…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-charcoal-400 font-inter">No products found</td></tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="hover:bg-charcoal-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-charcoal-100 border border-charcoal-250/20 shadow-sm" />
                        <div className="leading-snug">
                          <div className="font-poppins font-bold text-charcoal-900 text-xs">{p.name}</div>
                          <div className="text-[10px] text-charcoal-400 font-poppins font-bold tracking-wide uppercase mt-0.5">{p.brand.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-charcoal-600 font-inter text-xs">
                      <span className="font-semibold text-charcoal-800">{p.category.name}</span>
                      {p.subcategory ? <span className="text-charcoal-400"> / {p.subcategory.name}</span> : ""}
                    </td>
                    <td className="px-6 py-4 font-manrope">
                      <span className="font-extrabold text-charcoal-900 text-sm">₹{p.salePrice.toLocaleString("en-IN")}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={p.stock}
                        onChange={(v) => handleStockChange(p.id, v)}
                        options={STOCK_OPTIONS}
                        className="w-48"
                        disabled={updatingId === p.id}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center min-h-10">
                        {updatingId === p.id && (
                          <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
                        )}
                        {successId === p.id && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-charcoal-200/50">
            <p className="text-xs text-charcoal-400 font-inter">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} products
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 rounded-lg border border-charcoal-200 flex items-center justify-center text-charcoal-600 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5 disabled:opacity-30 disabled:hover:border-charcoal-200 disabled:hover:text-charcoal-600 disabled:hover:bg-transparent transition-all duration-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <span className="text-xs text-charcoal-600 font-poppins font-semibold px-1">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 rounded-lg border border-charcoal-200 flex items-center justify-center text-charcoal-600 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5 disabled:opacity-30 disabled:hover:border-charcoal-200 disabled:hover:text-charcoal-600 disabled:hover:bg-transparent transition-all duration-200"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
