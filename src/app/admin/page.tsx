"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Package, Layers, Tag, BookOpen, ShoppingBag, Wallet, ArrowRight, ArrowUpRight, Activity } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { adminApi } from "../../lib/admin-api";

interface MetricsData {
  overview: {
    products: number;
    categories: number;
    brands: number;
    guides: number;
    orders: number;
    revenue: number;
  };
  statusData: { name: string; value: number }[];
  categoryData: { name: string; value: number }[];
  stockData: { name: string; value: number }[];
  revenueTrend: { key: string; label: string; revenue: number; orders: number }[];
  recentOrders: {
    orderNumber: string;
    status: string;
    total: number;
    placedAt: string;
    user: { name: string; email: string };
    itemsCount: number;
  }[];
  activityLogs: {
    id: string;
    action: string;
    details: string;
    userEmail: string;
    createdAt: string;
  }[];
}

const STATUS_STYLES: Record<string, string> = {
  PLACED: "bg-charcoal-100/50 text-charcoal-600 border-charcoal-200/50",
  CONFIRMED: "bg-blue-50/50 text-blue-600 border-blue-200/50",
  SHIPPED: "bg-amber-50/50 text-amber-600 border-amber-200/50",
  DELIVERED: "bg-brand-green/10 text-brand-green border-brand-green/20",
  CANCELLED: "bg-red-50/50 text-red-600 border-red-200/50",
};

const STATUS_COLORS: Record<string, string> = {
  PLACED: "#9CA3AF",
  CONFIRMED: "#3B82F6",
  SHIPPED: "#F59E0B",
  DELIVERED: "#16A34A",
  CANCELLED: "#DC2626",
};

const CATEGORY_COLORS = ["#EA580C", "#16A34A", "#3B82F6", "#92400E", "#9333EA", "#F43F5E", "#14B8A6"];
const STOCK_COLORS: Record<string, string> = {
  "In Stock": "#16A34A",
  "Low Stock": "#F59E0B",
  "Out of Stock": "#DC2626",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-charcoal-200/50 p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <h3 className="font-poppins font-bold flex items-center gap-2 text-charcoal-900 text-sm mb-6"><Activity className="w-4 h-4 text-brand-orange" /> {title}</h3>
      {children}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-sm text-charcoal-400 font-inter bg-charcoal-50/30 rounded-2xl border border-charcoal-100 border-dashed">
      <Activity className="w-6 h-6 text-charcoal-300 mb-2 opacity-50" />
      {label}
    </div>
  );
}

const StatSkeleton = () => (
    <div className="bg-charcoal-50/50 animate-pulse rounded-2xl border border-charcoal-100 p-5 h-[116px]"></div>
);

export default function AdminDashboardPage() {
  const { data: metrics, error, isLoading } = useQuery({
    queryKey: ["adminDashboardMetrics"],
    queryFn: () => adminApi.get<MetricsData>("/dashboard/metrics"),
    staleTime: 60 * 1000,
  });

  const cards = [
    { label: "Products", value: metrics?.overview.products, icon: Package, href: "/admin/products", colorClass: "text-orange-600 bg-orange-500/10 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white" },
    { label: "Orders", value: metrics?.overview.orders, icon: ShoppingBag, href: "/admin/orders", colorClass: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white" },
    { label: "Revenue", value: metrics?.overview.revenue != null ? `₹${metrics.overview.revenue.toLocaleString("en-IN")}` : undefined, icon: Wallet, href: "/admin/orders", colorClass: "text-purple-600 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white" },
    { label: "Categories", value: metrics?.overview.categories, icon: Layers, href: "/admin/categories", colorClass: "text-blue-600 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white" },
    { label: "Brands", value: metrics?.overview.brands, icon: Tag, href: "/admin/brands", colorClass: "text-amber-600 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white" },
    { label: "Buying Guides", value: metrics?.overview.guides, icon: BookOpen, href: "/admin/guides", colorClass: "text-rose-600 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white" },
  ];

  if (error) {
    return <div className="p-8 text-center text-red-500 font-inter">Failed to load dashboard metrics.</div>;
  }

  return (
    <div className="pb-12 animate-fade-in-up">
      <div className="mb-8">
        <h2 className="font-poppins font-black text-charcoal-900 text-2xl lg:text-3xl tracking-tight">Command Center</h2>
        <p className="text-sm text-charcoal-400 font-poppins font-medium uppercase tracking-wider mt-1">Real-time metrics & insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 mb-8">
        {isLoading || !metrics ? Array.from({length: 6}).map((_, i) => <StatSkeleton key={i}/>) : cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white/60 backdrop-blur-md rounded-2xl border border-charcoal-200/50 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-card-hover hover:border-charcoal-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border transition-all duration-300 ${card.colorClass}`}>
              <card.icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-poppins font-extrabold text-charcoal-900 text-2xl lg:text-3xl tracking-tighter mb-1">{card.value}</div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-charcoal-500 font-poppins font-bold uppercase tracking-widest">{card.label}</span>
                <ArrowRight className="w-4 h-4 text-charcoal-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {metrics && (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ChartCard title="Revenue Growth — Last 14 Days">
                {metrics.revenueTrend.every((d) => d.orders === 0) ? (
                  <EmptyChart label="No orders generated yet" />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={metrics.revenueTrend} margin={{ left: -20, top: 10 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600, fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600, fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Revenue"]}
                        contentStyle={{ borderRadius: 16, border: "1px solid #E2E8F0", fontSize: 13, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)", fontWeight: 500, fontFamily: "var(--font-inter)", padding: "12px 16px" }}
                        itemStyle={{ color: "#EA580C", fontWeight: 700 }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </div>

            <ChartCard title="Orders by Status">
              {metrics.statusData.length === 0 ? (
                <EmptyChart label="No orders placed yet" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={metrics.statusData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={85} paddingAngle={4} strokeWidth={0}>
                      {metrics.statusData.map((d) => (
                        <Cell key={d.name} fill={STATUS_COLORS[d.name] ?? "#94A3B8"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 13, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", fontWeight: 600, fontFamily: "var(--font-inter)" }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-inter)", fontWeight: 600, paddingTop: "20px" }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Catalog by Category">
              {metrics.categoryData.length === 0 ? (
                <EmptyChart label="No products yet" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={metrics.categoryData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={85} paddingAngle={4} strokeWidth={0}>
                      {metrics.categoryData.map((d, i) => (
                        <Cell key={d.name} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 13, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", fontWeight: 600, fontFamily: "var(--font-inter)" }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-inter)", fontWeight: 600, paddingTop: "20px" }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Inventory Health">
              {metrics.stockData.length === 0 ? (
                <EmptyChart label="No products yet" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={metrics.stockData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={85} paddingAngle={4} strokeWidth={0}>
                      {metrics.stockData.map((d) => (
                        <Cell key={d.name} fill={STOCK_COLORS[d.name] ?? "#94A3B8"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 13, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", fontWeight: 600, fontFamily: "var(--font-inter)" }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-inter)", fontWeight: 600, paddingTop: "20px" }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Tables and Lists */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-charcoal-200/50 shadow-card overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-7 py-6 border-b border-charcoal-100/50 bg-charcoal-50/20">
                <h3 className="font-poppins font-bold text-charcoal-900 text-sm tracking-wide flex items-center gap-2">
                   Recent Orders
                </h3>
                <Link href="/admin/orders" className="flex items-center gap-1.5 text-xs text-brand-orange font-poppins font-bold uppercase tracking-wider hover:gap-2 transition-all px-3 py-1.5 rounded-full hover:bg-orange-50">
                  <span>View Ledger</span> <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm">
                  <thead className="bg-charcoal-50/40 text-charcoal-400 font-poppins font-bold text-[10px] tracking-widest uppercase border-b border-charcoal-100/50">
                    <tr>
                      <th className="text-left px-7 py-4">Order Code</th>
                      <th className="text-left px-7 py-4">Customer</th>
                      <th className="text-left px-7 py-4">Total</th>
                      <th className="text-left px-7 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-100/50">
                    {metrics.recentOrders.length === 0 ? (
                      <tr><td colSpan={4} className="px-7 py-12 text-center text-charcoal-400 font-inter text-sm">No orders recorded yet.</td></tr>
                    ) : (
                      metrics.recentOrders.map((o) => {
                        const init = o.user.name ? o.user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "?";
                        return (
                          <tr key={o.orderNumber} className="hover:bg-charcoal-50/60 transition-colors group">
                            <td className="px-7 py-5">
                              <Link href={`/admin/orders/${o.orderNumber}`} className="font-poppins font-bold text-charcoal-900 group-hover:text-brand-orange transition-colors">
                                #{o.orderNumber}
                              </Link>
                              <div className="text-[10px] font-inter text-charcoal-400 mt-1">{new Date(o.placedAt).toLocaleDateString("en-US", {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                            </td>
                            <td className="px-7 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-charcoal-800 text-white flex items-center justify-center text-[11px] font-poppins font-bold shadow-sm">
                                  {init}
                                </div>
                                <div className="leading-tight">
                                  <div className="font-poppins font-semibold text-charcoal-900 text-xs">{o.user.name}</div>
                                  <div className="text-[11px] text-charcoal-400 font-inter mt-0.5">{o.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-7 py-5 font-manrope font-black text-charcoal-900 text-sm">₹{o.total.toLocaleString("en-IN")}</td>
                            <td className="px-7 py-5">
                              <span className={`text-[9px] font-poppins font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${STATUS_STYLES[o.status] ?? "bg-charcoal-100 text-charcoal-600 border-charcoal-200/30"}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-charcoal-200/50 shadow-card overflow-hidden flex flex-col">
              <div className="px-7 py-6 border-b border-charcoal-100/50 bg-charcoal-50/20">
                <h3 className="font-poppins font-bold text-charcoal-900 text-sm tracking-wide flex items-center gap-2">System Logs</h3>
              </div>
              <div className="p-7 overflow-y-auto flex-1">
                <ul className="-my-3 divide-y divide-charcoal-100/50">
                  {metrics.activityLogs.length === 0 ? (
                    <li className="py-5 text-center text-charcoal-400 font-inter text-sm">No activity recorded.</li>
                  ) : (
                    metrics.activityLogs.map((log) => (
                      <li key={log.id} className="py-4 flex gap-4 hover:bg-charcoal-50/40 rounded-xl transition-colors -mx-4 px-4 overflow-hidden">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(234,88,12,0.6)] flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-poppins font-bold text-charcoal-900 tracking-wide truncate">
                            {log.action.replace(/_/g, " ")}
                          </div>
                          <div className="text-[11px] text-charcoal-500 font-inter mt-1 leading-relaxed truncate">{log.details}</div>
                          <div className="text-[10px] font-inter text-charcoal-400 font-medium mt-1.5 flex gap-2">
                             <span>{new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute:"2-digit" })}</span>
                             <span>•</span>
                             <span className="truncate">{log.userEmail.split('@')[0]}</span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
