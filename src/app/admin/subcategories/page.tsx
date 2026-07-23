"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import DataTable, { ColumnDef } from "../../../components/shared/DataTable";
import Pagination from "../../../components/shared/Pagination";
import SearchInput from "../../../components/shared/SearchInput";
import ConfirmModal from "../../../components/shared/ConfirmModal";
import SubcategoryModal from "../../../components/admin/SubcategoryModal";

interface SubcategoryRow {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: string;
  category: {
    key: string;
    name: string;
  };
  _count: { products: number };
}

export default function AdminSubcategoriesPage() {
  const [items, setItems] = useState<SubcategoryRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const [modalState, setModalState] = useState<{ open: boolean; sub?: SubcategoryRow }>({ open: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: "", name: "" });

  const load = () => adminApi.get<SubcategoryRow[]>("/categories/manage/subcategories").then(setItems);

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      await adminApi.delete(`/categories/subcategories/${confirmModal.id}`);
      load();
    } catch {
      alert("Failed to delete subcategory");
    }
  };

  const filtered = items.filter((s) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const columns: ColumnDef<SubcategoryRow>[] = [
    {
      key: 'image',
      label: 'Image',
      render: (s) => (
        <div className="w-10 h-10 bg-charcoal-100 rounded-lg overflow-hidden border border-charcoal-200 shadow-sm">
          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Subcategory Name',
      render: (s) => <span className="font-poppins font-semibold text-charcoal-900">{s.name}</span>
    },
    {
      key: 'category',
      label: 'Parent Category',
      render: (s) => <span className="font-inter text-sm text-charcoal-600 font-medium">{s.category.name}</span>
    },
    {
      key: 'products',
      label: 'Linked Products',
      render: (s) => <span className="text-charcoal-500 font-inter text-sm">{s._count?.products || 0}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setModalState({ open: true, sub: s })}
            className="p-2 text-charcoal-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, id: s.id, name: s.name })}
            className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight">Subcategories</h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">Manage granular product groups</p>
        </div>
        <button
          onClick={() => setModalState({ open: true })}
          className="flex flex-shrink-0 items-center justify-center gap-1.5 bg-brand-orange text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Subcategory
        </button>
      </div>

      <div className="w-full bg-white p-4 rounded-t-2xl border-x border-t border-charcoal-200">
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search subcategories or parents..." 
          className="w-full sm:max-w-md"
        />
      </div>

      <DataTable 
        data={paginated} 
        columns={columns} 
        keyExtractor={(s) => s.id} 
        emptyMessage="No subcategories found."
      />

      <Pagination 
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${confirmModal.name}"? This action cannot be undone and will unlink it from any products.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDelete}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {modalState.open && (
        <SubcategoryModal
          subcategoryId={modalState.sub?.id}
          initialData={modalState.sub}
          onClose={() => setModalState({ open: false, sub: undefined })}
          onSaved={() => {
            setModalState({ open: false, sub: undefined });
            load();
          }}
        />
      )}
    </div>
  );
}
