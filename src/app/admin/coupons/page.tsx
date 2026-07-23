"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Ticket, ToggleLeft, ToggleRight } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import DataTable, { ColumnDef } from "../../../components/shared/DataTable";
import CouponModal from "../../../components/admin/CouponModal";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number;
  expiry: string;
  active: boolean;
  usedCount: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<Coupon[]>("/coupons");
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggleActive = async (c: Coupon) => {
    await adminApi.patch(`/coupons/${c.id}`, { active: !c.active });
    loadCoupons();
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon code "${code}"?`)) return;
    await adminApi.delete(`/coupons/${id}`);
    loadCoupons();
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setIsModalOpen(true);
  };

  const handleSubmit = async (form: any) => {
    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      expiry: form.expiry,
    };

    if (editingCoupon) {
      await adminApi.patch(`/coupons/${editingCoupon.id}`, payload);
    } else {
      await adminApi.post("/coupons", payload);
    }

    setIsModalOpen(false);
    loadCoupons();
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      key: "code",
      label: "Coupon Code",
      render: (c) => (
        <div className="font-mono font-black text-xs uppercase tracking-wider bg-charcoal-900 text-white border border-charcoal-800 px-3 py-1.5 rounded-lg inline-block shadow-sm">
          {c.code}
        </div>
      ),
    },
    {
      key: "discount",
      label: "Discount Value",
      render: (c) => (
        <div className="font-inter">
          {c.type === "PERCENT" ? (
            <span className="font-extrabold text-brand-orange text-sm">{c.value}% Off</span>
          ) : (
            <span className="font-extrabold text-charcoal-950 text-sm">₹{c.value.toLocaleString("en-IN")} Off</span>
          )}
          <div className="text-[10px] text-charcoal-600 mt-0.5 font-semibold">Min Order: ₹{c.minOrder.toLocaleString("en-IN")}</div>
        </div>
      ),
    },
    {
      key: "usedCount",
      label: "Usage Limits",
      hideOnMobile: true,
      render: (c) => (
        <div className="text-xs font-inter text-charcoal-600">
          Used <span className="font-bold text-charcoal-900 bg-charcoal-100 px-1.5 py-0.5 rounded">{c.usedCount}</span> times
        </div>
      ),
    },
    {
      key: "expiry",
      label: "Expires",
      hideOnMobile: true,
      render: (c) => {
        const isExpired = new Date(c.expiry) < new Date();
        return (
          <div className={`text-xs font-inter font-semibold ${isExpired ? 'text-red-500' : 'text-charcoal-900'}`}>
            {new Date(c.expiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            {isExpired && <span className="block text-[9px] uppercase tracking-wider mt-0.5">Expired</span>}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (c) => (
        <button
          onClick={() => handleToggleActive(c)}
          className={`p-1 rounded-full transition-colors flex justify-center mx-auto ${c.active ? "text-emerald-500 hover:text-emerald-600" : "text-charcoal-300 hover:text-charcoal-400"}`}
          aria-label={c.active ? "Deactivate" : "Activate"}
        >
          {c.active ? (
            <ToggleRight className="w-8 h-8" strokeWidth={1.5} />
          ) : (
            <ToggleLeft className="w-8 h-8" strokeWidth={1.5} />
          )}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(c)}
            className="p-2 text-charcoal-600 hover:text-brand-orange hover:bg-brand-orange/10 rounded-xl transition-all"
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => handleDelete(c.id, c.code)}
            className="p-2 text-charcoal-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Coupon Codes
          </h2>
          <p className="text-xs text-charcoal-900 font-poppins font-semibold uppercase tracking-wider mt-1">
            Manage promotional campaigns and discounts
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-500 hover:to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Create Coupon
        </button>
      </div>

      <DataTable
        data={coupons}
        columns={columns}
        keyExtractor={(c) => c.id}
        isLoading={loading}
        emptyMessage="No promotional coupons created yet."
      />

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={
          editingCoupon
            ? {
                code: editingCoupon.code,
                type: editingCoupon.type,
                value: editingCoupon.value,
                minOrder: editingCoupon.minOrder,
                expiry: editingCoupon.expiry.split("T")[0],
              }
            : null
        }
      />
    </>
  );
}
