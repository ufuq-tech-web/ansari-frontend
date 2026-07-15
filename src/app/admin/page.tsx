"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Package, Layers, Tag, BookOpen, ShoppingBag, Wallet, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { adminApi } from "../../lib/admin-api";

interface ProductRow {
  id: string;
  stock: string;
  category: { name: string };
}

interface OrderRow {
  orderNumber: string;
  status: string;
  total: number;
  placedAt: string;
  user: { name: string; email: string };
  items: unknown[];
}

interface ActivityLogRow {
  id: string;
  action: string;
  details: string;
  userEmail: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  PLACED: "bg-charcoal-100 text-charcoal-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  SHIPPED: "bg-amber-50 text-amber-600",
  DELIVERED: "bg-brand-green/10 text-brand-green",
  CANCELLED: "bg-red-50 text-red-600",
};

const STATUS_COLORS: Record<string, string> = {
  PLACED: "#9CA3AF",
  CONFIRMED: "#3B82F6",
  SHIPPED: "#F59E0B",
  DELIVERED: "#16A34A",
  CANCELLED: "#DC2626",
};

const CATEGORY_COLORS = ["#EA580C", "#16A34A", "#3B82F6", "#92400E", "#9333EA"];
const STOCK_COLORS: Record<string, string> = {
  "In Stock": "#16A34A",
  "Low Stock": "#F59E0B",
  "Out of Stock": "#DC2626",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card">
      <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-56 flex items-center justify-center text-sm text-charcoal-400 font-inter">{label}</div>
  );
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);
  const [brandsCount, setBrandsCount] = useState<number | null>(null);
  const [guidesCount, setGuidesCount] = useState<number | null>(null);
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [ordersTotal, setOrdersTotal] = useState<number | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLogRow[] | null>(null);

  useEffect(() => {
    adminApi.get<{ items: ProductRow[] }>("/products?limit=100").then((r) => setProducts(r.items));
    adminApi.get<unknown[]>("/categories").then((r) => setCategoriesCount(r.length));
    adminApi.get<unknown[]>("/brands").then((r) => setBrandsCount(r.length));
    adminApi.get<unknown[]>("/guides").then((r) => setGuidesCount(r.length));
    adminApi.get<{ items: OrderRow[]; total: number }>("/orders/admin/all?limit=200").then((r) => {
      setOrders(r.items);
      setOrdersTotal(r.total);
    });
    adminApi.get<ActivityLogRow[]>("/users/admin/logs").then(setActivityLogs).catch((err) => console.error(err));
  }, []);

  const revenue = useMemo(
    () => orders?.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.total, 0) ?? null,
    [orders],
  );

  const cards = [
    { label: "Products", value: products?.length, icon: Package, href: "/admin/products", colorClass: "text-orange-600 bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/40" },
    { label: "Orders", value: ordersTotal ?? undefined, icon: ShoppingBag, href: "/admin/orders", colorClass: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40" },
    { label: "Revenue", value: revenue != null ? `₹${revenue.toLocaleString("en-IN")}` : undefined, icon: Wallet, href: "/admin/orders", colorClass: "text-purple-600 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/40" },
    { label: "Categories", value: categoriesCount ?? undefined, icon: Layers, href: "/admin/categories", colorClass: "text-blue-600 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/40" },
    { label: "Brands", value: brandsCount ?? undefined, icon: Tag, href: "/admin/brands", colorClass: "text-amber-600 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40" },
    { label: "Buying Guides", value: guidesCount ?? undefined, icon: BookOpen, href: "/admin/guides", colorClass: "text-rose-600 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/40" },
  ];

  const statusData = useMemo(() => {
    if (!orders) return [];
    const counts = new Map<string, number>();
    for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const categoryData = useMemo(() => {
    if (!products) return [];
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.category.name, (counts.get(p.category.name) ?? 0) + 1);
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  const stockData = useMemo(() => {
    if (!products) return [];
    const labelFor: Record<string, string> = { IN_STOCK: "In Stock", LOW_STOCK: "Low Stock", OUT_OF_STOCK: "Out of Stock" };
    const counts = new Map<string, number>();
    for (const p of products) {
      const label = labelFor[p.stock] ?? p.stock;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  const revenueTrend = useMemo(() => {
    if (!orders) return [];
    const days: { key: string; label: string; revenue: number; orders: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), revenue: 0, orders: 0 });
    }
    const byKey = new Map(days.map((d) => [d.key, d]));
    for (const o of orders) {
      const key = new Date(o.placedAt).toISOString().slice(0, 10);
      const bucket = byKey.get(key);
      if (bucket) {
        bucket.revenue += o.total;
        bucket.orders += 1;
      }
    }
    return days;
  }, [orders]);

  const recentOrders = orders?.slice(0, 6) ?? [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight">Dashboard</h2>
        <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">Overview of your catalog and orders</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl border border-charcoal-200/50 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-charcoal-350 hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border transition-all duration-300 ${card.colorClass}`}>
              <card.icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="font-poppins font-extrabold text-charcoal-900 text-2xl tracking-tight">{card.value ?? "—"}</div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-charcoal-500 font-poppins font-semibold uppercase tracking-wide">{card.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-charcoal-300 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue — Last 14 Days">
            {orders && revenueTrend.every((d) => d.orders === 0) ? (
              <EmptyChart label="No orders placed yet" />
            ) : (
              <ResponsiveContainer width="100%" height={224}>
                <BarChart data={revenueTrend} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity={1} />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 500, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 500, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                  />
                  <Bar dataKey="revenue" fill="url(#revGradient)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <ChartCard title="Orders by Status">
          {statusData.length === 0 ? (
            <EmptyChart label="No orders placed yet" />
          ) : (
            <ResponsiveContainer width="100%" height={224}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={75} paddingAngle={3}>
                  {statusData.map((d) => (
                    <Cell key={d.name} fill={STATUS_COLORS[d.name] ?? "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Inter", fontWeight: 500 }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Products by Category">
          {categoryData.length === 0 ? (
            <EmptyChart label="No products yet" />
          ) : (
            <ResponsiveContainer width="100%" height={224}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={75} paddingAngle={3}>
                  {categoryData.map((d, i) => (
                    <Cell key={d.name} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Inter", fontWeight: 500 }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Stock Health">
          {stockData.length === 0 ? (
            <EmptyChart label="No products yet" />
          ) : (
            <ResponsiveContainer width="100%" height={224}>
              <PieChart>
                <Pie data={stockData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={75} paddingAngle={3}>
                  {stockData.map((d) => (
                    <Cell key={d.name} fill={STOCK_COLORS[d.name] ?? "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Inter", fontWeight: 500 }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-200/50">
          <h3 className="font-poppins font-bold text-charcoal-800 text-xs tracking-wider uppercase">Recent Orders</h3>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-brand-orange font-poppins font-bold uppercase tracking-wider hover:gap-1.5 transition-all">
            <span>View all</span> <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>
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
              {orders === null ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">Loading…</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">No orders yet</td></tr>
              ) : (
                recentOrders.map((o) => {
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
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-charcoal-200/50">
          <h3 className="font-poppins font-bold text-charcoal-800 text-xs tracking-wider uppercase">System Activity Logs</h3>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-charcoal-100">
              {activityLogs === null ? (
                <li className="py-4 text-center text-charcoal-400 font-inter text-xs">Loading logs…</li>
              ) : activityLogs.length === 0 ? (
                <li className="py-4 text-center text-charcoal-400 font-inter text-xs">No admin activities logged yet</li>
              ) : (
                activityLogs.slice(0, 15).map((log) => (
                  <li key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-charcoal-50/20 px-2 rounded-xl transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-[10px] font-poppins font-bold text-brand-orange border border-brand-orange/20 flex-shrink-0">
                        LOG
                      </div>
                      <div>
                        <div className="text-xs font-poppins font-bold text-charcoal-900 uppercase tracking-wide">
                          {log.action.replace("_", " ")}
                        </div>
                        <div className="text-[11px] text-charcoal-500 font-inter mt-0.5">{log.details}</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end text-[10px] font-inter text-charcoal-400">
                      <span className="font-semibold text-charcoal-600">{log.userEmail}</span>
                      <span>{new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

