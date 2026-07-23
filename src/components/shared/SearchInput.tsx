"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 w-full md:w-64 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
