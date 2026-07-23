"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLES: Record<string, string> = {
  PLACED: "bg-slate-50 border-slate-200 text-slate-600",
  CONFIRMED: "bg-sky-50 border-sky-200 text-sky-600",
  SHIPPED: "bg-amber-50 border-amber-200 text-amber-600",
  DELIVERED: "bg-emerald-50 border-emerald-200 text-emerald-600",
  CANCELLED: "bg-rose-50 border-rose-200 text-rose-600",
};

interface Props {
  status: string;
  orderNumber: string;
  updatingId: string | null;
  onChange: (id: string, s: string) => void;
  className?: string;
}

export default function StatusDropdown({ status, orderNumber, updatingId, onChange, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = () => setOpen(false);
    const onScroll = () => setOpen(false);
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: Math.max(rect.left, 8), width: Math.max(rect.width, 140) });
    }
    setOpen(!open);
  };

  const isUpdating = updatingId === orderNumber;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={btnRef}
        onClick={isUpdating ? undefined : toggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-sm transition-all ${
          isUpdating ? 'opacity-50 pointer-events-none' : 'hover:shadow-md hover:-translate-y-[1px] cursor-pointer'
        } ${STATUS_STYLES[status] ?? "bg-charcoal-50 border-charcoal-200 text-charcoal-600"}`}
      >
        {isUpdating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${status === "DELIVERED" ? "bg-emerald-400" : status === "CANCELLED" ? "bg-rose-400" : status === "SHIPPED" ? "bg-amber-400" : status === "CONFIRMED" ? "bg-sky-400" : "bg-slate-400" }`}></span>
        )}
        <span className="text-[10px] font-poppins font-bold tracking-wider uppercase">
          {status}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: coords.top, left: coords.left, minWidth: coords.width }}
          className="fixed z-[9999] bg-white border border-charcoal-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(orderNumber, s); setOpen(false); }}
              className={`block w-full text-left px-3.5 py-2 text-[11px] tracking-wider uppercase font-poppins font-bold transition-colors ${
                s === status ? "bg-brand-orange/5 text-brand-orange" : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
