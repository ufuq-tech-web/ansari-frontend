"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import Select from "../../../components/admin/Select";

interface OrderRow {
  orderNumber: string;
  status: string;
  total: number;
  placedAt: string;
  user: { name: string; email: string };
  items: unknown[];
}

const STATUS_STYLES: Record<string, string> = {
  PLACED: "bg-slate-500/10 text-slate-600 border border-slate-500/20",
  CONFIRMED: "bg-sky-500/10 text-sky-600 border border-sky-500/20",
  SHIPPED: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  CANCELLED: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
};

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAGE_SIZE = 15;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async (q: string, s: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
    if (q) params.set("search", q);
    if (s) params.set("status", s);
    const res = await adminApi.get<{ items: OrderRow[]; total: number; totalPages: number }>(`/orders/admin/all?${params.toString()}`);
    setOrders(res.items);
    setTotal(res.total);
    setTotalPages(res.totalPages || 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(search, status, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight">Orders</h2>
        <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">Monitor payments, shipments, and customer purchases</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" strokeWidth={2.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), load(search, status, 1))}
            placeholder="Search order #, customer name, or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all"
          />
        </div>
        <Select
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          options={[{ value: "", label: "All Statuses" }, ...STATUS_OPTIONS.map((s) => ({ value: s, label: s }))]}
          className="w-full sm:w-44"
        />
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
          <thead className="bg-charcoal-50/70 border-b border-charcoal-200/30 text-charcoal-400 font-poppins font-semibold text-xs tracking-wider uppercase">
            <tr>
              <th className="text-left px-6 py-4">Order</th>
              <th className="text-left px-6 py-4">Customer</th>
              <th className="text-left px-6 py-4">Items</th>
              <th className="text-left px-6 py-4">Total</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">No orders found</td></tr>
            ) : (
              orders.map((o) => {
                const customerInitials = o.user.name
                  ? o.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?";
                return (
                  <tr key={o.orderNumber} className="hover:bg-charcoal-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${o.orderNumber}`} className="font-poppins font-bold text-brand-orange hover:text-brand-orange-dark hover:underline tracking-tight">
                        #{o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center text-[10px] font-poppins font-bold text-charcoal-600 border border-charcoal-200/40 shadow-sm">
                          {customerInitials}
                        </div>
                        <div className="leading-snug">
                          <div className="font-poppins font-semibold text-charcoal-900 text-xs">{o.user.name}</div>
                          <div className="text-[11px] text-charcoal-400 font-inter">{o.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-inter text-charcoal-500 text-xs">
                      {o.items.length === 1 ? "1 item" : `${o.items.length} items`}
                    </td>
                    <td className="px-6 py-4 font-manrope font-extrabold text-charcoal-900 text-sm">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-poppins font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[o.status] ?? "bg-charcoal-100 text-charcoal-600 border-charcoal-200/30"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-inter text-charcoal-400 text-xs">
                      {new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-charcoal-200/50">
            <p className="text-xs text-charcoal-400 font-inter">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} orders
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
