"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-charcoal-200/50 bg-white rounded-b-2xl">
      <p className="text-xs text-charcoal-400 font-inter">
        Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
      </p>
      
      {totalPages > 1 && (
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center px-4 font-inter text-xs text-charcoal-600">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
