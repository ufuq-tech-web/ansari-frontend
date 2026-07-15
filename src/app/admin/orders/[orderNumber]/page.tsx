"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Calendar, User, Package } from "lucide-react";
import { adminApi } from "../../../../lib/admin-api";
import Select from "../../../../components/admin/Select";

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  qty: number;
  salePrice: number;
}

interface OrderDetail {
  orderNumber: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  placedAt: string;
  items: OrderItem[];
  address: { name: string; phone: string; line1: string; city: string; state: string; pincode: string } | null;
  user: { name: string; email: string };
}

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLES: Record<string, string> = {
  PLACED: "bg-slate-500/10 text-slate-600 border border-slate-500/20",
  CONFIRMED: "bg-sky-500/10 text-sky-600 border border-sky-500/20",
  SHIPPED: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  CANCELLED: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminApi.get<OrderDetail>(`/orders/${params.orderNumber}`).then(setOrder);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderNumber]);

  const handleStatusChange = async (status: string) => {
    setSaving(true);
    await adminApi.patch(`/orders/${params.orderNumber}/status`, { status });
    await load();
    setSaving(false);
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-charcoal-400 font-inter text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin mb-3" />
        <span className="font-poppins font-semibold text-xs tracking-wider uppercase">Loading Order Details…</span>
      </div>
    );
  }

  const customerInitials = order.user.name
    ? order.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {/* Navigation Header */}
      <div>
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-brand-orange font-poppins font-bold uppercase tracking-wider transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Back to Orders</span>
        </Link>
      </div>

      {/* Order Identity & Status Control */}
      <div className="bg-white rounded-2xl border border-charcoal-200/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-charcoal-50 border border-charcoal-200/30 flex items-center justify-center text-charcoal-500 shadow-sm flex-shrink-0">
            <Package className="w-6 h-6 text-charcoal-700" strokeWidth={2} />
          </div>
          <div className="leading-snug">
            <div className="flex items-center gap-2">
              <h2 className="font-poppins font-black text-charcoal-900 text-lg tracking-tight">Order #{order.orderNumber}</h2>
              <span className={`text-[9px] font-poppins font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] ?? "bg-charcoal-100 text-charcoal-600 border-charcoal-200/30"}`}>
                {order.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-charcoal-400 mt-1 font-inter">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(order.placedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-poppins font-bold text-charcoal-400 block mb-1 uppercase tracking-wider">Update Status</label>
          <Select
            value={order.status}
            onChange={handleStatusChange}
            disabled={saving}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items Breakdown */}
        <div className="bg-white rounded-2xl border border-charcoal-200/50 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-bold text-charcoal-800 text-xs tracking-wider uppercase mb-5">Items Summary</h3>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3.5 pb-4 border-b border-charcoal-100 last:pb-0 last:border-b-0">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-charcoal-100 border border-charcoal-200/20 shadow-sm" />
                  <div className="flex-1 leading-snug">
                    <div className="font-poppins font-bold text-charcoal-900 text-xs">{item.name}</div>
                    <div className="text-[10px] text-charcoal-400 font-poppins font-bold tracking-wide uppercase mt-0.5">{item.brand}</div>
                    <div className="text-[11px] text-charcoal-400 font-inter mt-0.5">Qty {item.qty} · ₹{item.salePrice.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="font-manrope font-extrabold text-charcoal-900 text-sm">₹{(item.salePrice * item.qty).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-charcoal-100 flex flex-col gap-1.5 text-xs font-inter">
            <div className="flex justify-between text-charcoal-500">
              <span>Subtotal</span>
              <span className="font-manrope font-semibold">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-charcoal-500">
              <span>Shipping</span>
              <span className="font-manrope font-semibold">{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between font-manrope font-black text-charcoal-900 text-base mt-2 pt-2 border-t border-charcoal-100">
              <span>Total</span>
              <span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info Columns */}
        <div className="flex flex-col gap-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-charcoal-200/50 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="font-poppins font-bold text-charcoal-800 text-xs tracking-wider uppercase mb-4">Customer Details</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center text-xs font-poppins font-bold text-charcoal-600 border border-charcoal-200/40 shadow-sm flex-shrink-0">
                {customerInitials}
              </div>
              <div className="leading-snug">
                <div className="font-poppins font-semibold text-charcoal-900 text-xs">{order.user.name}</div>
                <div className="text-[10px] text-charcoal-400 font-inter">{order.user.email}</div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-white rounded-2xl border border-charcoal-200/50 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="font-poppins font-bold text-charcoal-800 text-xs tracking-wider uppercase mb-4">Shipping Info</h3>
              <div className="flex items-start gap-2.5 text-xs text-charcoal-700 font-inter leading-relaxed">
                <MapPin className="w-4 h-4 text-charcoal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-charcoal-950">{order.address.name}</div>
                  <div className="text-charcoal-500 mt-0.5">{order.address.phone}</div>
                  <div className="text-charcoal-500 mt-1">
                    {order.address.line1},<br />
                    {order.address.city}, {order.address.state} {order.address.pincode}
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-charcoal-100 flex items-center gap-2 text-xs text-charcoal-600 font-inter">
                <CreditCard className="w-4 h-4 text-charcoal-400" />
                <span>Payment: <strong className="text-charcoal-800">{order.paymentMethod}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
