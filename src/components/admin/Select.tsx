"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Select({ value, onChange, options, placeholder, disabled, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-inter text-left transition-colors ${
          disabled
            ? "border-charcoal-200 bg-charcoal-50 text-charcoal-400 cursor-not-allowed"
            : open
              ? "border-brand-orange text-charcoal-900 bg-white"
              : "border-charcoal-200 text-charcoal-900 bg-white hover:border-charcoal-300"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "text-charcoal-400"}>{selected?.label ?? placeholder ?? "Select…"}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 text-charcoal-400 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-1.5 w-full max-h-64 overflow-y-auto bg-white rounded-xl border border-charcoal-200 shadow-card-hover py-1.5"
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-inter text-left transition-colors ${
                o.value === value ? "text-brand-orange font-semibold bg-brand-orange/5" : "text-charcoal-700 hover:bg-charcoal-50"
              }`}
            >
              {o.label}
              {o.value === value && <Check className="w-4 h-4 flex-shrink-0" strokeWidth={2} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
