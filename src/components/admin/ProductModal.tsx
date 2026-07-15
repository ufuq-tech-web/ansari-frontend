"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import ProductForm from "./ProductForm";

interface Props {
  productId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductModal({ productId, onClose, onSaved }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={productId ? "Edit product" : "Add product"}>
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-brand-ivory rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200 bg-white rounded-t-3xl flex-shrink-0">
          <div>
            <h2 className="font-poppins font-bold text-charcoal-900 text-lg">{productId ? "Edit Product" : "Add Product"}</h2>
            <p className="text-xs text-charcoal-400 font-inter mt-0.5">
              {productId ? "Update the details for this listing" : "Fill in the details to list a new product"}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-charcoal-100 hover:bg-charcoal-200 flex items-center justify-center text-charcoal-600 transition-colors flex-shrink-0" aria-label="Close">
            <X className="w-4.5 h-4.5" strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <ProductForm productId={productId} onSuccess={onSaved} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
