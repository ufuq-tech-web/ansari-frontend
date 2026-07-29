"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Calendar, Package } from "lucide-react";
import { adminApi } from "../../../../lib/admin-api";
import StatusDropdown from "../../../../components/admin/StatusDropdown";

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  qty: number;
  salePrice: number;
  status: string;
}

interface OrderDetail {
  orderNumber: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  cancellationReason?: string | null;
  placedAt: string;
  items: OrderItem[];
  address: { name: string; phone: string; line1: string; city: string; state: string; pincode: string } | null;
  user: { name: string; email: string };
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = () => adminApi.get<OrderDetail>(`/orders/${params.orderNumber}`).then(setOrder);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderNumber]);

  const handleStatusChange = async (orderNumber: string, status: string) => {
    setSavingId(orderNumber);
    try {
      await adminApi.patch(`/orders/${orderNumber}/status`, { status });
      await load();
    } finally {
      setSavingId(null);
    }
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-charcoal-400 font-inter text-sm w-full h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin mb-4 shadow-sm" />
        <span className="font-poppins font-semibold text-[11px] tracking-[0.2em] uppercase text-charcoal-500">Loading Order…</span>
      </div>
    );
  }

  const customerInitials = order.user.name
    ? order.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div>
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-900 hover:text-brand-orange font-poppins font-bold uppercase tracking-wider transition-colors duration-200 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-charcoal-900" strokeWidth={2.5} />
          <span>Back to Orders</span>
        </Link>
      </div>

      {/* Order Identity & Status Control */}
      <div className="bg-white rounded-3xl border border-charcoal-200/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-charcoal-50 to-charcoal-100 border border-charcoal-200/50 flex items-center justify-center text-charcoal-500 shadow-sm flex-shrink-0">
            <Package className="w-6 h-6 text-charcoal-700" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-poppins font-black text-charcoal-950 text-xl tracking-tight">Order #{order.orderNumber}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-charcoal-900 mt-2 font-inter font-medium">
              <span className="flex items-center gap-1.5 bg-charcoal-50 px-2 py-0.5 rounded-md border border-charcoal-200/50">
                <Calendar className="w-3.5 h-3.5 text-charcoal-900" />
                {new Date(order.placedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1.5 border-t sm:border-t-0 sm:border-l border-charcoal-100 pt-4 sm:pt-0 sm:pl-8 mt-2 sm:mt-0">
          <label className="text-[10px] font-poppins font-bold text-charcoal-900 uppercase tracking-widest">Order Status</label>
          <StatusDropdown 
            status={order.status} 
            orderNumber={order.orderNumber} 
            updatingId={savingId} 
            onChange={handleStatusChange} 
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {order.cancellationReason && (
        <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6 sm:p-8 flex items-start sm:items-center gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-500 shadow-sm flex-shrink-0">
                <span className="font-poppins font-black text-xl">!</span>
            </div>
            <div>
                <h3 className="font-poppins font-bold text-red-900 text-sm tracking-tight mb-1">Customer Cancellation Note</h3>
                <p className="text-red-700 text-sm font-inter leading-relaxed">{order.cancellationReason}</p>
            </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Items Breakdown */}
        <div className="bg-white rounded-3xl border border-charcoal-200/50 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] lg:col-span-2 flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className="font-poppins font-extrabold text-charcoal-900 text-[11px] tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
              Items Summary
            </h3>
            <div className="flex flex-col gap-5">
              {order.items.map((item) => {
                const isCancelled = item.status === 'CANCELLED';
                return (
                <div key={item.id} className="flex items-start gap-4 pb-5 border-b border-charcoal-100/60 last:pb-0 last:border-b-0 group">
                  <div className={`relative w-16 h-16 rounded-xl overflow-hidden bg-charcoal-50 border border-charcoal-200/50 shadow-sm flex-shrink-0 ${isCancelled ? 'opacity-50 grayscale' : ''}`}>
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 leading-snug pt-0.5">
                    <div className="flex items-center gap-2">
                        <div className={`font-poppins font-bold text-sm tracking-tight ${isCancelled ? 'text-charcoal-400 line-through' : 'text-charcoal-950'}`}>{item.name}</div>
                        {isCancelled && <span className="px-1.5 py-0.5 text-[8px] font-poppins font-bold uppercase tracking-widest border border-red-200 text-red-500 rounded bg-red-50">Cancelled</span>}
                    </div>
                    <div className={`text-[10px] font-poppins font-bold tracking-widest uppercase mt-1.5 ${isCancelled ? 'text-charcoal-400 opacity-70' : 'text-charcoal-500'}`}>{item.brand}</div>
                    <div className="text-xs text-charcoal-500 font-inter mt-1.5 font-medium flex items-center gap-1.5">
                      <span className="bg-charcoal-50 px-1.5 py-0.5 rounded text-[11px]">Qty: {item.qty}</span>
                      <span>·</span>
                      <span>₹{item.salePrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className={`font-manrope font-extrabold text-base pt-0.5 ${isCancelled ? 'text-charcoal-400 line-through' : 'text-charcoal-950'}`}>
                    ₹{(item.salePrice * item.qty).toLocaleString("en-IN")}
                  </div>
                </div>
              )})}
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-charcoal-100/60 flex flex-col gap-2.5 text-xs font-inter">
            <div className="flex justify-between items-center text-charcoal-900 font-medium">
              <span>Subtotal</span>
              <span className="font-manrope font-semibold text-charcoal-900 text-sm">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center text-charcoal-900 font-medium">
              <span>Shipping</span>
              <span className="font-manrope font-semibold text-charcoal-900 text-sm">{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between items-end font-manrope font-black text-charcoal-950 text-xl mt-3 pt-4 border-t border-dashed border-charcoal-200">
              <span className="text-sm font-poppins font-bold text-charcoal-900 uppercase tracking-widest pb-1">Total</span>
              <span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info Columns */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Customer Card */}
          <div className="bg-white rounded-3xl border border-charcoal-200/50 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <h3 className="font-poppins font-extrabold text-charcoal-900 text-[11px] tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
              Customer Details
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center text-sm font-poppins font-bold text-charcoal-600 border border-charcoal-200/40 shadow-sm flex-shrink-0">
                {customerInitials}
              </div>
              <div className="leading-snug">
                <div className="font-poppins font-semibold text-charcoal-950 text-sm">{order.user.name}</div>
                <div className="text-xs text-charcoal-900 font-inter mt-0.5">{order.user.email}</div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-white rounded-3xl border border-charcoal-200/50 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <h3 className="font-poppins font-extrabold text-charcoal-900 text-[11px] tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Shipping Info
              </h3>
              <div className="flex items-start gap-3.5 text-sm w-full text-charcoal-700 font-inter leading-relaxed">
                <div className="w-8 h-8 rounded-full bg-charcoal-50 flex items-center justify-center flex-shrink-0 border border-charcoal-200/50">
                  <MapPin className="w-4 h-4 text-charcoal-500" />
                </div>
                <div>
                  <div className="font-poppins font-semibold text-charcoal-950 text-sm tracking-tight">{order.address.name}</div>
                  <div className="text-charcoal-900 font-medium text-xs mt-0.5">{order.address.phone}</div>
                  <div className="text-charcoal-900 mt-2 text-xs leading-relaxed max-w-[200px]">
                    {order.address.line1},<br />
                    {order.address.city}, {order.address.state} {order.address.pincode}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-charcoal-100 border-dashed flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-charcoal-50 flex items-center justify-center flex-shrink-0 border border-charcoal-200/50">
                  <CreditCard className="w-4 h-4 text-charcoal-900" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-poppins font-bold text-charcoal-900">Payment Method</div>
                  <div className="font-poppins font-semibold text-charcoal-950 text-sm uppercase">{order.paymentMethod}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
