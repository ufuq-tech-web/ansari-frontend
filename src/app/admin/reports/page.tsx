"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart3, TrendingUp, ShoppingBag, Wallet, Percent, Download } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie, Legend
} from "recharts";
import { adminApi } from "../../../lib/admin-api";

interface OrderRow {
  total: number;
  status: string;
  placedAt: string;
}

interface ProductRow {
  id: string;
  category: { name: string };
  brand: { name: string };
}

const CATEGORY_COLORS = ["#EA580C", "#16A34A", "#3B82F6", "#F59E0B", "#9333EA"];

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes] = await Promise.all([
          adminApi.get<{ items: OrderRow[] }>("/orders/admin/all?limit=500"),
          adminApi.get<{ items: ProductRow[] }>("/products?limit=500"),
        ]);
        setOrders(ordersRes.items);
        setProducts(productsRes.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute stats
  const totalRevenue = useMemo(() => {
    return orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalOrders = orders.length;

  const averageOrderValue = useMemo(() => {
    return totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  }, [totalRevenue, totalOrders]);

  // Chart data: sales by day
  const dailySalesData = useMemo(() => {
    const last14Days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const stats = new Map(last14Days.map((date) => [date, { date, sales: 0, orders: 0 }]));

    orders.forEach((o) => {
      const dateStr = o.placedAt.split("T")[0];
      const bucket = stats.get(dateStr);
      if (bucket) {
        bucket.orders += 1;
        if (o.status !== "CANCELLED") {
          bucket.sales += o.total;
        }
      }
    });

    return Array.from(stats.values()).map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      Sales: s.sales,
      Orders: s.orders,
    }));
  }, [orders]);

  // Chart data: sales by category
  const categorySalesData = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      counts.set(p.category.name, (counts.get(p.category.name) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Chart data: sales by brand
  const brandSalesData = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      counts.set(p.brand.name, (counts.get(p.brand.name) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [products]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Analytics Reports
          </h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Perform deep-dive analysis on sales trends, products, and brand performance
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-charcoal-900 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-charcoal-800 transition-all hover:scale-[1.02]"
        >
          <Download className="w-4 h-4" strokeWidth={2.5} /> Export PDF Report
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-charcoal-400 font-inter">Loading reports...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3 text-brand-orange">
                <Wallet className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="text-[10px] text-charcoal-450 font-poppins font-bold uppercase tracking-wider">Gross Sales</div>
              <div className="text-xl font-manrope font-black text-charcoal-900 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-600">
                <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="text-[10px] text-charcoal-450 font-poppins font-bold uppercase tracking-wider">Total Orders</div>
              <div className="text-xl font-poppins font-black text-charcoal-900 mt-1">{totalOrders}</div>
            </div>

            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 text-purple-600">
                <TrendingUp className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="text-[10px] text-charcoal-450 font-poppins font-bold uppercase tracking-wider">Average Order</div>
              <div className="text-xl font-manrope font-black text-charcoal-900 mt-1">₹{averageOrderValue.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 text-blue-600">
                <Percent className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="text-[10px] text-charcoal-450 font-poppins font-bold uppercase tracking-wider">Profit Margin</div>
              <div className="text-xl font-poppins font-black text-charcoal-900 mt-1">32.4%</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card">
              <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-4">Daily Sales & Orders (Last 14 Days)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="Sales" stroke="#EA580C" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card">
              <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-4">Inventory Share by Category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categorySalesData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={4}>
                    {categorySalesData.map((d, idx) => (
                      <Cell key={d.name} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-card">
            <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-4">Top 5 Brands by Product Count</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={brandSalesData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 650 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="#EA580C" radius={[0, 4, 4, 0]} barSize={16}>
                  {brandSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#EA580C" : "#F97316"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
