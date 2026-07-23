"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-charcoal-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-inter min-w-full">
          <thead className="bg-charcoal-50 border-b border-charcoal-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-4 font-poppins font-semibold text-charcoal-900 whitespace-nowrap text-${col.align || 'left'} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100 relative min-h-[100px]">
             {isLoading ? (
               <tr>
                 <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-charcoal-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-brand-orange" />
                      <p className="font-poppins font-medium">Loading data...</p>
                    </div>
                 </td>
               </tr>
             ) : data.length === 0 ? (
               <tr>
                 <td colSpan={columns.length} className="px-6 py-12 text-center text-charcoal-500 font-inter">
                   {emptyMessage}
                 </td>
               </tr>
             ) : (
                data.map((item) => (
                  <tr key={keyExtractor(item)} className="hover:bg-charcoal-50 transition-colors group">
                    {columns.map((col) => (
                      <td 
                        key={String(col.key)} 
                        className={`px-6 py-4 whitespace-nowrap text-${col.align || 'left'} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                      >
                        {col.render ? col.render(item) : (item[col.key as keyof T] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
