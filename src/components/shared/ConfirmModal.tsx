"use client";

import { useEffect, useRef } from "react";
import { X, AlertTriangle, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  danger = false
}: ConfirmModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    
    window.addEventListener("keydown", handleEsc);
    
    // Auto-focus confirm for keyboard accessibility
    const timer = setTimeout(() => {
      if (document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
          confirmBtnRef.current?.focus();
      }
    }, 10);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEsc);
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const Icon = danger ? AlertTriangle : AlertCircle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 py-5 border-b border-charcoal-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50 text-red-500' : 'bg-brand-orange/10 text-brand-orange'}`}>
              <Icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h2 id="modal-title" className="font-poppins font-bold text-charcoal-900 text-lg">
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-charcoal-50 hover:bg-charcoal-100 flex items-center justify-center text-charcoal-500 transition-colors flex-shrink-0 -mr-2" 
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-sm font-inter text-charcoal-600 mb-6 leading-relaxed">
            {message}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-poppins font-semibold text-sm text-charcoal-700 bg-charcoal-50 hover:bg-charcoal-100 transition-colors"
            >
              {cancelText}
            </button>
            <button
              ref={confirmBtnRef}
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-5 py-2.5 rounded-xl font-poppins font-semibold text-sm text-white transition-colors outline-none focus:ring-4 ${
                danger 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600/20' 
                  : 'bg-brand-orange hover:bg-brand-orange-dark focus:ring-brand-orange/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
