"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Ticket, Check, X, ToggleLeft, ToggleRight } from "lucide-react";

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

const DEFAULT_COUPONS: Coupon[] = [
  { id: "1", code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 999, expiry: "2026-12-31", active: true, usedCount: 142 },
  { id: "2", code: "FESTIVE500", type: "FIXED", value: 500, minOrder: 4999, expiry: "2026-10-31", active: true, usedCount: 68 },
  { id: "3", code: "MONSOON15", type: "PERCENT", value: 15, minOrder: 1999, expiry: "2026-08-31", active: false, usedCount: 9 },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    type: "PERCENT" as "PERCENT" | "FIXED",
    value: 0,
    minOrder: 0,
    expiry: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const saved = localStorage.getItem("ansari_admin_coupons");
    if (saved) {
      setCoupons(JSON.parse(saved));
    } else {
      setCoupons(DEFAULT_COUPONS);
      localStorage.setItem("ansari_admin_coupons", JSON.stringify(DEFAULT_COUPONS));
    }
  }, []);

  const saveToStorage = (updatedList: Coupon[]) => {
    setCoupons(updatedList);
    localStorage.setItem("ansari_admin_coupons", JSON.stringify(updatedList));
  };

  const handleToggleActive = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    saveToStorage(updated);
  };

  const handleDelete = (id: string, code: string) => {
    if (!confirm(`Delete coupon code "${code}"?`)) return;
    const updated = coupons.filter((c) => c.id !== id);
    saveToStorage(updated);
  };

  const handleStartEdit = (c: Coupon) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      expiry: c.expiry,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      code: "",
      type: "PERCENT",
      value: 0,
      minOrder: 0,
      expiry: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;

    if (editingId) {
      const updated = coupons.map((c) =>
        c.id === editingId
          ? {
              ...c,
              code: form.code.toUpperCase(),
              type: form.type,
              value: Number(form.value),
              minOrder: Number(form.minOrder),
              expiry: form.expiry,
            }
          : c
      );
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newCoupon: Coupon = {
        id: String(Date.now()),
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minOrder: Number(form.minOrder),
        expiry: form.expiry,
        active: true,
        usedCount: 0,
      };
      saveToStorage([...coupons, newCoupon]);
    }

    handleCancelEdit();
  };

  const inputClass = "w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
  const labelClass = "text-xs font-poppins font-semibold text-charcoal-500 block mb-1.5 uppercase tracking-wide";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Coupon Codes
          </h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Manage promotional campaigns and discounts
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-charcoal-50/70 border-b border-charcoal-200/30 text-charcoal-400 font-poppins font-semibold text-xs tracking-wider uppercase">
                <tr>
                  <th className="text-left px-6 py-4">Coupon Code</th>
                  <th className="text-left px-6 py-4">Discount Value</th>
                  <th className="text-left px-6 py-4">Usage Limits</th>
                  <th className="text-left px-6 py-4">Expires</th>
                  <th className="text-center px-6 py-4">Status</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {coupons.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">No coupons created yet</td></tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-charcoal-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-xs uppercase tracking-wider bg-charcoal-100 text-charcoal-800 border border-charcoal-200 px-2.5 py-1 rounded-lg inline-block shadow-sm">
                          {c.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-inter text-xs text-charcoal-800">
                        {c.type === "PERCENT" ? (
                          <span className="font-bold text-brand-orange">{c.value}% Off</span>
                        ) : (
                          <span className="font-extrabold text-charcoal-900">₹{c.value} Off</span>
                        )}
                        <div className="text-[10px] text-charcoal-400 mt-0.5">Min Order: ₹{c.minOrder}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-inter text-charcoal-600">
                        Used <span className="font-semibold text-charcoal-900">{c.usedCount}</span> times
                      </td>
                      <td className="px-6 py-4 text-xs font-inter text-charcoal-500">
                        {new Date(c.expiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(c.id)}
                          className={`p-1 rounded-full transition-colors ${c.active ? "text-brand-green" : "text-charcoal-300"}`}
                          aria-label={c.active ? "Deactivate" : "Activate"}
                        >
                          {c.active ? (
                            <ToggleRight className="w-9 h-9 text-emerald-500" strokeWidth={1.5} />
                          ) : (
                            <ToggleLeft className="w-9 h-9 text-charcoal-300" strokeWidth={1.5} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="p-1.5 text-charcoal-400 hover:text-brand-orange hover:bg-brand-orange/5 rounded-xl transition-all"
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.code)}
                            className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200 p-6 self-start shadow-card">
        <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-4">
          {editingId ? "Edit Coupon" : "Create Coupon"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Coupon Code</label>
            <input
              required
              placeholder="e.g. EXTRA20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Discount Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENT" | "FIXED" })}
                className="w-full px-3 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
              >
                <option value="PERCENT">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Value</label>
              <input
                type="number"
                required
                min={1}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Minimum Order Amount (₹)</label>
            <input
              type="number"
              required
              min={0}
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Expiry Date</label>
            <input
              type="date"
              required
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-charcoal-900 text-white font-poppins font-semibold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-charcoal-800 transition-colors"
            >
              {editingId ? "Save Changes" : "Create Coupon"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-charcoal-600 font-poppins font-semibold text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}
