"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Edit2, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import CategoryModal from "../../../components/admin/CategoryModal";
import AddCategoryModal from "../../../components/admin/AddCategoryModal";

import DataTable, { ColumnDef } from "../../../components/shared/DataTable";
import Pagination from "../../../components/shared/Pagination";
import SearchInput from "../../../components/shared/SearchInput";
import ConfirmModal from "../../../components/shared/ConfirmModal";

interface CategoryRow {
  key: string;
  name: string;
  description: string;
  heroImage: string;
  subcategories: unknown[];
  _count: { products: number };
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const { data: categories = [], refetch, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => adminApi.get<CategoryRow[]>("/categories/manage"),
  });

  const [showNew, setShowNew] = useState(false);
  const [managingKey, setManagingKey] = useState<string | null>(null);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    key: "",
    name: "",
    currentActive: false,
  });

  const handleToggleActive = async () => {
    const { key, currentActive } = confirmModal;
    try {
      await adminApi.patch(`/categories/${key}`, { isActive: !currentActive });
      refetch();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const columns: ColumnDef<CategoryRow>[] = [
    {
      key: 'image',
      label: 'Image',
      render: (c) => (
        <div className="w-12 h-12 bg-charcoal-100 rounded-lg overflow-hidden border border-charcoal-200">
          <img src={c.heroImage || "https://via.placeholder.com/100"} alt={c.name} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Category Name',
      render: (c) => <span className="font-semibold text-charcoal-900">{c.name}</span>
    },
    {
      key: 'key',
      label: 'Key',
      render: (c) => <code className="bg-charcoal-100 px-2 py-1 rounded text-xs">{c.key}</code>
    },
    {
      key: 'subcategories',
      label: 'Subcategories',
      render: (c) => <span className="text-charcoal-700">{c.subcategories.length}</span>
    },
    {
      key: 'products',
      label: 'Products',
      render: (c) => <span className="text-charcoal-700">{c._count?.products || 0}</span>
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (c) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {c.isActive ? 'Active' : 'Blocked'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setConfirmModal({ isOpen: true, key: c.key, name: c.name, currentActive: c.isActive })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal-700 bg-charcoal-100 hover:bg-charcoal-200 rounded-md transition-colors"
          >
            {c.isActive ? <><EyeOff className="w-3.5 h-3.5" /> Block</> : <><Eye className="w-3.5 h-3.5" /> Unblock</>}
          </button>
          <button
            onClick={() => setManagingKey(c.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 rounded-md transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <p className="text-charcoal-500 font-inter text-sm sm:text-base leading-snug">Manage top-level categories and their subcategories.</p>
        <button
          onClick={() => setShowNew(true)}
          className="w-full sm:w-auto flex flex-shrink-0 items-center justify-center gap-1.5 bg-brand-orange text-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Add Category
        </button>
      </div>

      <div className="w-full max-w-full bg-white p-4 rounded-t-2xl border-x border-t border-charcoal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search categories..."
          className="w-full sm:max-w-sm"
        />
      </div>

      <DataTable
        data={paginated}
        columns={columns}
        keyExtractor={(c) => c.key}
        emptyMessage="No categories found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.currentActive ? "Block Category" : "Unblock Category"}
        message={`Are you sure you want to ${confirmModal.currentActive ? "block" : "unblock"} "${confirmModal.name}"?`}
        confirmText={confirmModal.currentActive ? "Block" : "Unblock"}
        cancelText="Cancel"
        danger={confirmModal.currentActive}
        onConfirm={handleToggleActive}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {managingKey && (
        <CategoryModal
          categoryKey={managingKey}
          onClose={() => setManagingKey(null)}
          onSaved={() => {
            setManagingKey(null);
            refetch();
          }}
        />
      )}

      {showNew && (
        <AddCategoryModal
          onClose={() => setShowNew(false)}
          onSaved={() => {
            setShowNew(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
