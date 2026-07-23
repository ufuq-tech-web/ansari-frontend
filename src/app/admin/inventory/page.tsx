"use client";

import { useEffect, useState, useCallback } from "react";
import { Boxes, Loader2, CheckCircle2, Check, X } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import Select from "../../../components/admin/Select";
import DataTable, { ColumnDef } from "../../../components/shared/DataTable";
import Pagination from "../../../components/shared/Pagination";
import SearchInput from "../../../components/shared/SearchInput";

interface ProductRow {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  stock: string;
  stockQuantity: number;
  brand: { name: string };
  category: { name: string };
  subcategory: { name: string } | null;
}

interface CategoryOption {
  key: string;
  name: string;
}

const PAGE_SIZE = 15;

export default function AdminInventoryPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [categoryKey, setCategoryKey] = useState("");
  const [stock, setStock] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Row-level tracking
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    adminApi.get<CategoryOption[]>("/categories").then(setCategories);
  }, []);

  // Handle Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const load = useCallback(async (q: string, cat: string, st: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
    if (q) params.set("search", q);
    if (cat) params.set("categoryKey", cat);
    if (st) params.set("stock", st);
    
    try {
      const res = await adminApi.get<{ items: ProductRow[]; total: number }>(`/products?${params.toString()}`);
      setItems(res.items);
      setTotal(res.total);
    } catch {
      // Ignored for now
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(debouncedSearch, categoryKey, stock, page);
  }, [debouncedSearch, categoryKey, stock, page, load]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    setUpdatingId(productId);
    try {
      const updated = await adminApi.patch<{ stock: string; stockQuantity: number }>(`/products/${productId}`, { stockQuantity: newQuantity });
      setItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, stock: updated.stock, stockQuantity: updated.stockQuantity } : item))
      );
      
      // Clear draft since it successfully saved
      setDrafts(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });

      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to update stock quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: ColumnDef<ProductRow>[] = [
    {
      key: "product",
      label: "Product",
      render: (p) => (
        <div className="flex items-center gap-3.5">
          <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-charcoal-100 border border-charcoal-250/20 shadow-sm" />
          <div className="leading-snug max-w-[200px] truncate">
            <div className="font-poppins font-bold text-charcoal-900 text-xs truncate">{p.name}</div>
            <div className="text-[10px] text-charcoal-400 font-poppins font-bold tracking-wide uppercase mt-0.5">{p.brand.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (p) => (
        <div className="text-charcoal-600 font-inter text-xs">
          <span className="font-semibold text-charcoal-800">{p.category.name}</span>
          {p.subcategory && <span className="text-charcoal-400"> / {p.subcategory.name}</span>}
        </div>
      )
    },
    {
      key: "price",
      label: "Pricing",
      render: (p) => <span className="font-manrope font-extrabold text-charcoal-900 text-sm">₹{p.salePrice.toLocaleString("en-IN")}</span>
    },
    {
      key: "stockEdit",
      label: "Stock Status",
      width: "220px",
      render: (p) => {
        const currentVal = drafts[p.id] !== undefined ? drafts[p.id] : p.stockQuantity;
        const isDraft = currentVal !== p.stockQuantity;
        
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={currentVal.toString()}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                if (!isNaN(val)) setDrafts(d => ({ ...d, [p.id]: val }));
              }}
              onKeyDown={(e) => {
                 if (e.key === "Enter" && isDraft && !updatingId) handleQuantityChange(p.id, currentVal);
                 if (e.key === "Escape") setDrafts(d => { const newD = {...d}; delete newD[p.id]; return newD; });
              }}
              disabled={updatingId === p.id}
              className={`w-20 px-2.5 py-1.5 rounded-lg border text-sm font-inter text-charcoal-900 focus:outline-none transition-colors ${
                isDraft ? "border-brand-orange bg-orange-50/50" : "border-charcoal-200"
              } disabled:opacity-50`}
            />
            
            {updatingId === p.id ? (
               <Loader2 className="w-5 h-5 text-brand-orange animate-spin ml-1" />
            ) : isDraft ? (
               <div className="flex items-center gap-1.5 ml-1">
                 <button 
                   onClick={() => handleQuantityChange(p.id, currentVal)}
                   className="p-[5px] rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-sm border border-emerald-200 transition-all"
                   title="Save (Enter)"
                 >
                   <Check className="w-3.5 h-3.5" strokeWidth={3} />
                 </button>
                 <button 
                   onClick={() => setDrafts(d => { const newD = {...d}; delete newD[p.id]; return newD; })}
                   className="p-[5px] rounded-lg bg-charcoal-50 text-charcoal-500 hover:bg-red-50 hover:text-red-600 hover:shadow-sm border border-charcoal-200 hover:border-red-200 transition-all"
                   title="Discard (Esc)"
                 >
                   <X className="w-3.5 h-3.5" strokeWidth={3} />
                 </button>
               </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[9px] font-poppins font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    p.stock === "OUT_OF_STOCK"
                      ? "bg-red-50 text-red-600"
                      : p.stock === "LOW_STOCK"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {p.stock === "OUT_OF_STOCK" ? "Out of Stock" : p.stock === "LOW_STOCK" ? "Low Stock" : "In Stock"}
                </span>
                {successId === p.id && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                )}
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
          <Boxes className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
          Inventory Management
        </h2>
        <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
          Quickly monitor and safely adjust stock levels across all products
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6 bg-white p-4 rounded-t-2xl border-x border-t border-charcoal-200">
        <SearchInput 
          value={search}
          onChange={setSearch}
          placeholder="Search items..."
          className="w-full md:max-w-[240px]"
        />
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

      <DataTable 
        data={items} 
        columns={columns} 
        keyExtractor={(p) => p.id} 
        isLoading={loading}
        emptyMessage={search || categoryKey || stock ? "No inventory items match your filters." : "No products available in inventory."}
      />

      {!loading && items.length > 0 && (
        <Pagination 
          currentPage={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
