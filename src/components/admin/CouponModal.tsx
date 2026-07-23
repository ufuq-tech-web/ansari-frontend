"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface CouponForm {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number;
  expiry: string;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CouponForm) => void;
  initialData?: CouponForm | null;
}

export default function CouponModal({ isOpen, onClose, onSubmit, initialData }: CouponModalProps) {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [form, setForm] = useState<CouponForm>({
    code: "",
    type: "PERCENT",
    value: 0,
    minOrder: 0,
    expiry: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        code: "",
        type: "PERCENT",
        value: 0,
        minOrder: 0,
        expiry: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;
    onSubmit(form);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-charcoal-400";
  const labelClass = "text-xs font-poppins font-semibold text-charcoal-500 block mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-charcoal-100">
          <h2 className="font-poppins font-black text-charcoal-900 text-lg tracking-tight">
            {initialData ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 bg-charcoal-50/30">
          <div>
            <label className={labelClass}>Coupon Code</label>
            <input
              required
              placeholder="e.g. EXTRA20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className={inputClass + " uppercase font-mono font-bold tracking-wider"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className={labelClass}>Discount Type</label>
              <button
                type="button"
                onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
                className={`${inputClass} flex items-center justify-between bg-white text-left text-sm whitespace-nowrap`}
              >
                <span>{form.type === "PERCENT" ? "Percentage (%)" : "Fixed Amount (₹)"}</span>
                <ChevronDown className={`w-4 h-4 text-charcoal-400 transition-transform ${isTypeMenuOpen ? "rotate-180" : ""}`} strokeWidth={2} />
              </button>

              {isTypeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsTypeMenuOpen(false)} />
                  <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-charcoal-200/60 shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 p-1.5 flex flex-col">
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, type: "PERCENT" }); setIsTypeMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-inter transition-colors ${form.type === "PERCENT" ? "bg-brand-orange/10 text-brand-orange font-semibold" : "text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900"}`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, type: "FIXED" }); setIsTypeMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-inter transition-colors mt-0.5 ${form.type === "FIXED" ? "bg-brand-orange/10 text-brand-orange font-semibold" : "text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900"}`}
                    >
                      Fixed Amount (₹)
                    </button>
                  </div>
                </>
              )}
            </div>
            <div>
              <label className={labelClass}>Value</label>
              <input
                type="number"
                required
                min={1}
                value={form.value || ""}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Min Order (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={form.minOrder || ""}
                onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                className={inputClass}
                placeholder="0"
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
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-charcoal-100 mt-2">
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-brand-orange to-orange-500 hover:to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-orange/20 transition-all flex-1"
            >
              {initialData ? "Save Changes" : "Create Coupon"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 text-charcoal-600 font-poppins font-bold text-xs uppercase tracking-wider bg-white border-2 border-charcoal-200 hover:border-charcoal-300 rounded-xl transition-all w-1/3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
